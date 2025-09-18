import * as https from 'https';
import * as tls from 'tls';
import { Socket } from 'net';
import {
  SSLResult,
  SSLCertificate,
  SSLProtocol,
  SSLCipherSuite,
  SSLVulnerability
} from '../../types';

interface TLSConnectionResult {
  certificate: any;
  protocol: string;
  cipherSuite: string;
  authorized: boolean;
  authorizationError?: Error;
}

const WEAK_PROTOCOLS = ['SSLv2', 'SSLv3', 'TLSv1', 'TLSv1.1'];
const SECURE_PROTOCOLS = ['TLSv1.2', 'TLSv1.3'];

const WEAK_CIPHERS = [
  'RC4',
  'DES',
  '3DES',
  'MD5',
  'SHA1',
  'NULL',
  'EXPORT',
  'ANON'
];

const CIPHER_STRENGTH_MAP: Record<string, number> = {
  'AES256': 256,
  'AES128': 128,
  'CHACHA20': 256,
  'CAMELLIA256': 256,
  'CAMELLIA128': 128,
  'ARIA256': 256,
  'ARIA128': 128,
  '3DES': 112,
  'RC4': 40,
  'DES': 56,
  'NULL': 0
};

export class SSLScanner {
  private timeout: number = 30000;

  async scanSSL(domain: string, port: number = 443): Promise<SSLResult> {
    try {
      const connectionResult = await this.connectAndAnalyze(domain, port);
      const certificate = this.extractCertificateInfo(connectionResult.certificate);
      const protocols = await this.detectProtocols(domain, port);
      const cipherSuites = await this.detectCipherSuites(domain, port);
      const vulnerabilities = this.detectVulnerabilities(protocols, cipherSuites, certificate);
      const chainIssues = this.analyzeChain(connectionResult);
      const hstsInfo = await this.checkHSTS(domain);

      const score = this.calculateScore(certificate, protocols, cipherSuites, vulnerabilities);
      const grade = this.calculateGrade(score);

      return {
        grade,
        score,
        certificate,
        protocols,
        cipherSuites,
        vulnerabilities,
        chainIssues,
        ocspStapling: false, // Would need additional implementation
        hsts: hstsInfo.enabled,
        hstsMaxAge: hstsInfo.maxAge,
        hstsIncludeSubdomains: hstsInfo.includeSubdomains,
        hstsPreload: hstsInfo.preload
      };
    } catch (error) {
      throw new Error(`SSL scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async connectAndAnalyze(domain: string, port: number): Promise<TLSConnectionResult> {
    return new Promise((resolve, reject) => {
      const socket = new Socket();
      const timeout = setTimeout(() => {
        socket.destroy();
        reject(new Error('Connection timeout'));
      }, this.timeout);

      socket.connect(port, domain, () => {
        const tlsSocket = tls.connect({
          socket,
          servername: domain,
          rejectUnauthorized: false
        });

        tlsSocket.on('secureConnect', () => {
          clearTimeout(timeout);
          const cert = tlsSocket.getPeerCertificate(true);
          const protocol = tlsSocket.getProtocol();
          const cipher = tlsSocket.getCipher();

          resolve({
            certificate: cert,
            protocol: protocol || 'unknown',
            cipherSuite: cipher?.name || 'unknown',
            authorized: tlsSocket.authorized,
            authorizationError: tlsSocket.authorizationError || undefined
          });

          tlsSocket.end();
        });

        tlsSocket.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      socket.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  private extractCertificateInfo(cert: any): SSLCertificate {
    const validFrom = new Date(cert.valid_from);
    const validTo = new Date(cert.valid_to);

    return {
      subject: cert.subject?.CN || 'Unknown',
      issuer: cert.issuer?.CN || 'Unknown',
      serialNumber: cert.serialNumber || 'Unknown',
      validFrom,
      validTo,
      fingerprint: cert.fingerprint || 'Unknown',
      signatureAlgorithm: cert.sigalg || 'Unknown',
      keySize: this.extractKeySize(cert),
      commonName: cert.subject?.CN || 'Unknown',
      subjectAlternativeNames: this.extractSANs(cert)
    };
  }

  private extractKeySize(cert: any): number {
    if (cert.pubkey) {
      return cert.pubkey.bits || 0;
    }
    // Fallback estimation based on modulus length
    if (cert.modulus) {
      return cert.modulus.length * 4; // Rough estimation
    }
    return 0;
  }

  private extractSANs(cert: any): string[] {
    if (!cert.subjectaltname) return [];

    return cert.subjectaltname
      .split(', ')
      .map((san: string) => san.replace(/^DNS:/, ''))
      .filter((san: string) => san.length > 0);
  }

  private async detectProtocols(domain: string, port: number): Promise<SSLProtocol[]> {
    const protocolsToTest = ['TLSv1.3', 'TLSv1.2', 'TLSv1.1', 'TLSv1', 'SSLv3'];
    const protocols: SSLProtocol[] = [];

    for (const protocol of protocolsToTest) {
      try {
        const supported = await this.testProtocol(domain, port, protocol);
        protocols.push({
          name: protocol,
          version: protocol,
          enabled: supported,
          secure: SECURE_PROTOCOLS.includes(protocol)
        });
      } catch {
        protocols.push({
          name: protocol,
          version: protocol,
          enabled: false,
          secure: SECURE_PROTOCOLS.includes(protocol)
        });
      }
    }

    return protocols;
  }

  private async testProtocol(domain: string, port: number, protocol: string): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new Socket();
      const timeout = setTimeout(() => {
        socket.destroy();
        resolve(false);
      }, 5000);

      socket.connect(port, domain, () => {
        try {
          const tlsSocket = tls.connect({
            socket,
            servername: domain,
            secureProtocol: this.mapProtocolToSecureProtocol(protocol),
            rejectUnauthorized: false
          });

          tlsSocket.on('secureConnect', () => {
            clearTimeout(timeout);
            tlsSocket.end();
            resolve(true);
          });

          tlsSocket.on('error', () => {
            clearTimeout(timeout);
            resolve(false);
          });
        } catch {
          clearTimeout(timeout);
          resolve(false);
        }
      });

      socket.on('error', () => {
        clearTimeout(timeout);
        resolve(false);
      });
    });
  }

  private mapProtocolToSecureProtocol(protocol: string): string {
    const mapping: Record<string, string> = {
      'TLSv1.3': 'TLSv1_3_method',
      'TLSv1.2': 'TLSv1_2_method',
      'TLSv1.1': 'TLSv1_1_method',
      'TLSv1': 'TLSv1_method',
      'SSLv3': 'SSLv3_method'
    };
    return mapping[protocol] || 'TLS_method';
  }

  private async detectCipherSuites(domain: string, port: number): Promise<SSLCipherSuite[]> {
    try {
      const result = await this.connectAndAnalyze(domain, port);
      const cipherName = result.cipherSuite;

      if (!cipherName || cipherName === 'unknown') {
        return [];
      }

      const cipher = this.parseCipherSuite(cipherName);
      return [cipher];
    } catch {
      return [];
    }
  }

  private parseCipherSuite(cipherName: string): SSLCipherSuite {
    const parts = cipherName.split('-');
    let strength = 0;
    let encryption = 'Unknown';

    // Extract encryption algorithm and strength
    for (const part of parts) {
      if (part.includes('AES256')) {
        encryption = 'AES256';
        strength = 256;
      } else if (part.includes('AES128')) {
        encryption = 'AES128';
        strength = 128;
      } else if (part.includes('CHACHA20')) {
        encryption = 'CHACHA20';
        strength = 256;
      } else if (CIPHER_STRENGTH_MAP[part]) {
        encryption = part;
        strength = CIPHER_STRENGTH_MAP[part];
      }
    }

    return {
      name: cipherName,
      strength,
      keyExchange: this.extractKeyExchange(cipherName),
      authentication: this.extractAuthentication(cipherName),
      encryption,
      mac: this.extractMAC(cipherName)
    };
  }

  private extractKeyExchange(cipherName: string): string {
    if (cipherName.includes('ECDHE')) return 'ECDHE';
    if (cipherName.includes('DHE')) return 'DHE';
    if (cipherName.includes('ECDH')) return 'ECDH';
    if (cipherName.includes('DH')) return 'DH';
    if (cipherName.includes('RSA')) return 'RSA';
    return 'Unknown';
  }

  private extractAuthentication(cipherName: string): string {
    if (cipherName.includes('ECDSA')) return 'ECDSA';
    if (cipherName.includes('RSA')) return 'RSA';
    if (cipherName.includes('DSS')) return 'DSS';
    return 'Unknown';
  }

  private extractMAC(cipherName: string): string {
    if (cipherName.includes('SHA384')) return 'SHA384';
    if (cipherName.includes('SHA256')) return 'SHA256';
    if (cipherName.includes('SHA1')) return 'SHA1';
    if (cipherName.includes('MD5')) return 'MD5';
    if (cipherName.includes('POLY1305')) return 'POLY1305';
    return 'Unknown';
  }

  private detectVulnerabilities(
    protocols: SSLProtocol[],
    cipherSuites: SSLCipherSuite[],
    certificate: SSLCertificate
  ): SSLVulnerability[] {
    const vulnerabilities: SSLVulnerability[] = [];

    // Check for weak protocols
    const enabledWeakProtocols = protocols.filter(p => p.enabled && WEAK_PROTOCOLS.includes(p.name));
    if (enabledWeakProtocols.length > 0) {
      vulnerabilities.push({
        name: 'Weak SSL/TLS Protocols',
        severity: 'HIGH',
        description: `Weak protocols enabled: ${enabledWeakProtocols.map(p => p.name).join(', ')}`,
        recommendation: 'Disable SSLv2, SSLv3, TLSv1.0, and TLSv1.1. Use only TLSv1.2 and TLSv1.3.'
      });
    }

    // Check for weak ciphers
    const weakCiphers = cipherSuites.filter(c =>
      WEAK_CIPHERS.some(weak => c.name.includes(weak))
    );
    if (weakCiphers.length > 0) {
      vulnerabilities.push({
        name: 'Weak Cipher Suites',
        severity: 'MEDIUM',
        description: `Weak ciphers detected: ${weakCiphers.map(c => c.name).join(', ')}`,
        recommendation: 'Remove weak cipher suites and use strong, modern encryption algorithms.'
      });
    }

    // Check certificate expiration
    const daysUntilExpiry = Math.floor(
      (certificate.validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) {
      vulnerabilities.push({
        name: 'Expired Certificate',
        severity: 'CRITICAL',
        description: `Certificate expired ${Math.abs(daysUntilExpiry)} days ago`,
        recommendation: 'Renew the SSL certificate immediately.'
      });
    } else if (daysUntilExpiry < 30) {
      vulnerabilities.push({
        name: 'Certificate Expiring Soon',
        severity: 'MEDIUM',
        description: `Certificate expires in ${daysUntilExpiry} days`,
        recommendation: 'Renew the SSL certificate before it expires.'
      });
    }

    // Check key size
    if (certificate.keySize < 2048) {
      vulnerabilities.push({
        name: 'Weak Key Size',
        severity: 'HIGH',
        description: `Key size is ${certificate.keySize} bits, which is below recommended minimum`,
        recommendation: 'Use at least 2048-bit RSA keys or 256-bit ECC keys.'
      });
    }

    return vulnerabilities;
  }

  private analyzeChain(connectionResult: TLSConnectionResult): string[] {
    const issues: string[] = [];

    if (!connectionResult.authorized) {
      if (connectionResult.authorizationError) {
        issues.push(`Certificate verification failed: ${connectionResult.authorizationError.message}`);
      } else {
        issues.push('Certificate chain verification failed');
      }
    }

    return issues;
  }

  private async checkHSTS(domain: string): Promise<{
    enabled: boolean;
    maxAge?: number;
    includeSubdomains?: boolean;
    preload?: boolean;
  }> {
    return new Promise((resolve) => {
      const req = https.request({
        hostname: domain,
        port: 443,
        path: '/',
        method: 'HEAD',
        timeout: 10000,
        rejectUnauthorized: false
      }, (res) => {
        const hstsHeader = res.headers['strict-transport-security'];

        if (!hstsHeader) {
          resolve({ enabled: false });
          return;
        }

        const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/);
        const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1]) : undefined;
        const includeSubdomains = hstsHeader.includes('includeSubDomains');
        const preload = hstsHeader.includes('preload');

        resolve({
          enabled: true,
          maxAge,
          includeSubdomains,
          preload
        });
      });

      req.on('error', () => {
        resolve({ enabled: false });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ enabled: false });
      });

      req.end();
    });
  }

  private calculateScore(
    certificate: SSLCertificate,
    protocols: SSLProtocol[],
    cipherSuites: SSLCipherSuite[],
    vulnerabilities: SSLVulnerability[]
  ): number {
    let score = 100;

    // Protocol scoring
    const enabledProtocols = protocols.filter(p => p.enabled);
    const hasSecureProtocol = enabledProtocols.some(p => SECURE_PROTOCOLS.includes(p.name));
    const hasWeakProtocol = enabledProtocols.some(p => WEAK_PROTOCOLS.includes(p.name));

    if (!hasSecureProtocol) score -= 30;
    if (hasWeakProtocol) score -= 20;

    // Certificate scoring
    const daysUntilExpiry = Math.floor(
      (certificate.validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) score -= 40;
    else if (daysUntilExpiry < 30) score -= 15;

    if (certificate.keySize < 2048) score -= 20;

    // Cipher scoring
    const hasWeakCipher = cipherSuites.some(c =>
      WEAK_CIPHERS.some(weak => c.name.includes(weak))
    );
    if (hasWeakCipher) score -= 15;

    // Vulnerability scoring
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'CRITICAL': score -= 25; break;
        case 'HIGH': score -= 15; break;
        case 'MEDIUM': score -= 10; break;
        case 'LOW': score -= 5; break;
      }
    });

    return Math.max(0, Math.min(100, score));
  }

  private calculateGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }
}

export async function scanSSL(domain: string, port: number = 443): Promise<SSLResult> {
  const scanner = new SSLScanner();
  return scanner.scanSSL(domain, port);
}