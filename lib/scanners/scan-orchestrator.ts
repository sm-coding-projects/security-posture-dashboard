import { ScanStatus, ScanType } from '@prisma/client';
import { SSLResult, HeadersResult, DNSResult, ScanResult } from '../../types';
import { updateScan, deductCredits, getScanById } from '../db/helpers';
import { scanSSL } from './ssl-scanner';
import { scanHeaders } from './headers-scanner';
import { dnsScanner } from './dns-scanner';

interface OrchestratorConfig {
  scanId: string;
  domain: string;
  userId: string;
  scanType: ScanType;
}

interface ScannerResult<T> {
  status: 'fulfilled' | 'rejected';
  data?: T;
  error?: string;
}

interface OrchestratorResult {
  success: boolean;
  scanResult?: ScanResult;
  error?: string;
  creditsUsed: number;
}

const SCAN_TYPE_CREDITS: Record<ScanType, number> = {
  BASIC: 1,
  ADVANCED: 3,
  PREMIUM: 5,
};

export class ScanOrchestrator {
  private config: OrchestratorConfig;

  constructor(config: OrchestratorConfig) {
    this.config = config;
  }

  async orchestrateScan(): Promise<OrchestratorResult> {
    const { scanId, domain, userId, scanType } = this.config;
    const creditsRequired = SCAN_TYPE_CREDITS[scanType];

    try {
      // 1. Check and deduct user credits before scanning
      console.log(`Attempting to deduct ${creditsRequired} credits for user ${userId}`);
      const creditResult = await deductCredits(
        userId,
        creditsRequired,
        `${scanType} scan for ${domain}`
      );

      if (!creditResult.success) {
        await updateScan(scanId, {
          status: ScanStatus.FAILED,
          errorMessage: 'Insufficient credits to perform scan'
        });

        return {
          success: false,
          error: 'Insufficient credits to perform scan',
          creditsUsed: 0
        };
      }

      console.log(`Credits deducted successfully. New balance: ${creditResult.newBalance}`);

      // 2. Update scan status to RUNNING
      await updateScan(scanId, {
        status: ScanStatus.RUNNING
      });

      console.log(`Starting ${scanType} scan for domain: ${domain}`);

      // 3. Run all scanners in parallel using Promise.allSettled
      const scannerPromises = this.createScannerPromises(domain, scanType);
      const scannerResults = await Promise.allSettled(scannerPromises);

      // 4. Process scanner results
      const processedResults = this.processScannerResults(scannerResults);

      // 5. Check if any critical scanners failed
      const hasCriticalFailures = this.hasCriticalFailures(processedResults, scanType);

      if (hasCriticalFailures && processedResults.ssl.status === 'rejected' && processedResults.headers.status === 'rejected') {
        // If both SSL and Headers failed, consider it a complete failure
        await updateScan(scanId, {
          status: ScanStatus.FAILED,
          errorMessage: 'Critical scanners failed to complete'
        });

        return {
          success: false,
          error: 'Critical scanners failed to complete',
          creditsUsed: creditsRequired
        };
      }

      // 6. Calculate overall security score from all components
      const securityScore = this.calculateOverallSecurityScore(processedResults);

      // 7. Create combined scan result
      const scanResult: ScanResult = {
        ssl: processedResults.ssl.data || this.getDefaultSSLResult(),
        headers: processedResults.headers.data || this.getDefaultHeadersResult(),
        dns: processedResults.dns.data || this.getDefaultDNSResult()
      };

      // 8. Extract SSL grade if available
      const sslGrade = processedResults.ssl.data?.grade || null;

      // 9. Store results in database using updateScan
      await updateScan(scanId, {
        status: ScanStatus.COMPLETED,
        sslGrade,
        securityScore,
        sslDetails: scanResult.ssl,
        headerDetails: scanResult.headers,
        dnsDetails: scanResult.dns,
        vulnerabilities: scanResult.ssl.vulnerabilities || []
      });

      console.log(`Scan ${scanId} completed successfully with score: ${securityScore}`);

      return {
        success: true,
        scanResult,
        creditsUsed: creditsRequired
      };

    } catch (error) {
      console.error(`Scan orchestration failed for ${scanId}:`, error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      // Update scan status to FAILED
      await updateScan(scanId, {
        status: ScanStatus.FAILED,
        errorMessage
      });

      return {
        success: false,
        error: errorMessage,
        creditsUsed: creditsRequired
      };
    }
  }

  private createScannerPromises(domain: string, scanType: ScanType): Promise<any>[] {
    const promises: Promise<any>[] = [];

    // SSL scanning is always included
    promises.push(this.wrapScannerCall(() => scanSSL(domain), 'SSL'));

    // Headers scanning is always included
    promises.push(this.wrapScannerCall(() => scanHeaders(domain), 'Headers'));

    // DNS scanning based on scan type
    if (scanType === ScanType.ADVANCED || scanType === ScanType.PREMIUM) {
      promises.push(this.wrapScannerCall(() => dnsScanner.scanDomain(domain), 'DNS'));
    }

    return promises;
  }

  private async wrapScannerCall<T>(
    scannerFn: () => Promise<T>,
    scannerName: string
  ): Promise<T> {
    try {
      console.log(`Starting ${scannerName} scanner`);
      const result = await scannerFn();
      console.log(`${scannerName} scanner completed successfully`);
      return result;
    } catch (error) {
      console.error(`${scannerName} scanner failed:`, error);
      throw new Error(`${scannerName} scanner failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private processScannerResults(results: PromiseSettledResult<any>[]): {
    ssl: ScannerResult<SSLResult>;
    headers: ScannerResult<HeadersResult>;
    dns: ScannerResult<DNSResult>;
  } {
    const [sslResult, headersResult, dnsResult] = results;

    return {
      ssl: {
        status: sslResult.status,
        data: sslResult.status === 'fulfilled' ? sslResult.value : undefined,
        error: sslResult.status === 'rejected' ? sslResult.reason?.message || 'SSL scan failed' : undefined
      },
      headers: {
        status: headersResult.status,
        data: headersResult.status === 'fulfilled' ? headersResult.value : undefined,
        error: headersResult.status === 'rejected' ? headersResult.reason?.message || 'Headers scan failed' : undefined
      },
      dns: {
        status: dnsResult ? dnsResult.status : 'rejected',
        data: dnsResult && dnsResult.status === 'fulfilled' ? dnsResult.value : undefined,
        error: dnsResult && dnsResult.status === 'rejected' ? dnsResult.reason?.message || 'DNS scan failed' : undefined
      }
    };
  }

  private hasCriticalFailures(
    results: { ssl: ScannerResult<SSLResult>; headers: ScannerResult<HeadersResult>; dns: ScannerResult<DNSResult> },
    scanType: ScanType
  ): boolean {
    // SSL and Headers are critical for all scan types
    const criticalScannersFailed = results.ssl.status === 'rejected' && results.headers.status === 'rejected';

    // For PREMIUM scans, DNS is also critical
    if (scanType === ScanType.PREMIUM) {
      return criticalScannersFailed || (results.ssl.status === 'rejected' && results.dns.status === 'rejected');
    }

    return criticalScannersFailed;
  }

  private calculateOverallSecurityScore(results: {
    ssl: ScannerResult<SSLResult>;
    headers: ScannerResult<HeadersResult>;
    dns: ScannerResult<DNSResult>;
  }): number {
    let totalScore = 0;
    let componentCount = 0;

    // SSL component (40% weight)
    if (results.ssl.status === 'fulfilled' && results.ssl.data) {
      totalScore += results.ssl.data.score * 0.4;
      componentCount += 0.4;
    }

    // Headers component (35% weight)
    if (results.headers.status === 'fulfilled' && results.headers.data) {
      totalScore += results.headers.data.score * 0.35;
      componentCount += 0.35;
    }

    // DNS component (25% weight) - only if scanned
    if (results.dns.status === 'fulfilled' && results.dns.data) {
      // DNS scanner doesn't return a score, so we calculate one based on security features
      const dnsScore = this.calculateDNSScore(results.dns.data);
      totalScore += dnsScore * 0.25;
      componentCount += 0.25;
    }

    // Normalize score based on available components
    if (componentCount === 0) return 0;

    const normalizedScore = Math.round(totalScore / componentCount);
    return Math.max(0, Math.min(100, normalizedScore));
  }

  private calculateDNSScore(dnsResult: DNSResult): number {
    let score = 60; // Base score

    // Email security checks (30 points total)
    if (dnsResult.emailSecurity.spf.present && dnsResult.emailSecurity.spf.valid) score += 10;
    if (dnsResult.emailSecurity.dmarc.present && dnsResult.emailSecurity.dmarc.valid) score += 10;
    if (dnsResult.emailSecurity.dkim.present && dnsResult.emailSecurity.dkim.valid) score += 10;

    // DNSSEC (20 points)
    if (dnsResult.dnssec) score += 20;

    // CAA records (10 points)
    if (dnsResult.caa && dnsResult.caa.length > 0) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  private getDefaultSSLResult(): SSLResult {
    return {
      grade: 'F',
      score: 0,
      certificate: {
        subject: 'Unknown',
        issuer: 'Unknown',
        serialNumber: 'Unknown',
        validFrom: new Date(),
        validTo: new Date(),
        fingerprint: 'Unknown',
        signatureAlgorithm: 'Unknown',
        keySize: 0,
        commonName: 'Unknown',
        subjectAlternativeNames: []
      },
      protocols: [],
      cipherSuites: [],
      vulnerabilities: [{
        name: 'SSL Scan Failed',
        severity: 'CRITICAL',
        description: 'SSL scan could not be completed',
        recommendation: 'Check domain accessibility and SSL configuration'
      }],
      chainIssues: ['SSL scan failed'],
      ocspStapling: false,
      hsts: false
    };
  }

  private getDefaultHeadersResult(): HeadersResult {
    const defaultHeaderInfo = {
      present: false,
      score: 0,
      recommendation: 'Header scan failed - unable to retrieve security headers'
    };

    return {
      score: 0,
      headers: {
        'strict-transport-security': defaultHeaderInfo,
        'content-security-policy': defaultHeaderInfo,
        'x-frame-options': defaultHeaderInfo,
        'x-content-type-options': defaultHeaderInfo,
        'referrer-policy': defaultHeaderInfo,
        'permissions-policy': defaultHeaderInfo,
        'x-xss-protection': defaultHeaderInfo,
        'expect-ct': defaultHeaderInfo,
        'cross-origin-embedder-policy': defaultHeaderInfo,
        'cross-origin-opener-policy': defaultHeaderInfo,
        'cross-origin-resource-policy': defaultHeaderInfo
      }
    };
  }

  private getDefaultDNSResult(): DNSResult {
    return {
      records: [],
      emailSecurity: {
        spf: { present: false, valid: false, mechanisms: [] },
        dmarc: { present: false, valid: false, policy: '', reportingEmails: [] },
        dkim: { present: false, valid: false, selectors: [], keys: [] }
      },
      dnssec: false,
      nameservers: [],
      mx: [],
      caa: []
    };
  }
}

// Main orchestrator function that can be called externally
export async function orchestrateScan(
  scanId: string,
  domain: string,
  userId: string,
  scanType: ScanType
): Promise<OrchestratorResult> {
  const orchestrator = new ScanOrchestrator({
    scanId,
    domain,
    userId,
    scanType
  });

  return orchestrator.orchestrateScan();
}

// Helper function to validate scan before orchestration
export async function validateAndOrchestrateScan(
  scanId: string,
  domain: string,
  userId: string,
  scanType: ScanType
): Promise<OrchestratorResult> {
  try {
    // Verify scan exists and is in correct state
    const scan = await getScanById(scanId);

    if (!scan) {
      return {
        success: false,
        error: 'Scan not found',
        creditsUsed: 0
      };
    }

    if (scan.status !== ScanStatus.PENDING) {
      return {
        success: false,
        error: `Scan is not in pending state. Current status: ${scan.status}`,
        creditsUsed: 0
      };
    }

    if (scan.userId !== userId) {
      return {
        success: false,
        error: 'Unauthorized: Scan does not belong to user',
        creditsUsed: 0
      };
    }

    // Proceed with orchestration
    return orchestrateScan(scanId, domain, userId, scanType);

  } catch (error) {
    console.error('Scan validation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Validation failed',
      creditsUsed: 0
    };
  }
}