import dns from 'dns';
import { promisify } from 'util';

// Promisify DNS functions
const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);
const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);
const resolveNs = promisify(dns.resolveNs);
const resolveCaa = promisify(dns.resolveCaa);

export interface DNSRecord {
  type: 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CAA';
  value: string;
  priority?: number;
  flags?: number;
  tag?: string;
}

export interface EmailSecurity {
  spf: boolean;
  dmarc: boolean;
  dkim: boolean;
}

export interface DNSResult {
  domain: string;
  records: DNSRecord[];
  emailSecurity: EmailSecurity;
  dnssec: boolean;
  timestamp: Date;
}

export class DNSScanner {
  async scanDomain(domain: string): Promise<DNSResult> {
    const records: DNSRecord[] = [];
    const emailSecurity: EmailSecurity = {
      spf: false,
      dmarc: false,
      dkim: false
    };

    // Query A records
    try {
      const aRecords = await resolve4(domain);
      aRecords.forEach(ip => {
        records.push({ type: 'A', value: ip });
      });
    } catch (error) {
      // Handle missing A records gracefully
    }

    // Query AAAA records
    try {
      const aaaaRecords = await resolve6(domain);
      aaaaRecords.forEach(ip => {
        records.push({ type: 'AAAA', value: ip });
      });
    } catch (error) {
      // Handle missing AAAA records gracefully
    }

    // Query MX records
    try {
      const mxRecords = await resolveMx(domain);
      mxRecords.forEach(mx => {
        records.push({
          type: 'MX',
          value: mx.exchange,
          priority: mx.priority
        });
      });
    } catch (error) {
      // Handle missing MX records gracefully
    }

    // Query TXT records and check for SPF
    try {
      const txtRecords = await resolveTxt(domain);
      txtRecords.forEach(txtArray => {
        const txtValue = txtArray.join('');
        records.push({ type: 'TXT', value: txtValue });

        // Check for SPF record
        if (txtValue.toLowerCase().includes('v=spf1')) {
          emailSecurity.spf = true;
        }

        // Check for DKIM indicators
        if (txtValue.toLowerCase().includes('dkim') ||
            txtValue.toLowerCase().includes('k=rsa') ||
            txtValue.toLowerCase().includes('p=')) {
          emailSecurity.dkim = true;
        }
      });
    } catch (error) {
      // Handle missing TXT records gracefully
    }

    // Query NS records
    try {
      const nsRecords = await resolveNs(domain);
      nsRecords.forEach(ns => {
        records.push({ type: 'NS', value: ns });
      });
    } catch (error) {
      // Handle missing NS records gracefully
    }

    // Query CAA records
    try {
      const caaRecords = await resolveCaa(domain);
      caaRecords.forEach(caa => {
        records.push({
          type: 'CAA',
          value: caa.value,
          flags: caa.critical,
          tag: caa.issue || caa.issuewild || caa.iodef
        });
      });
    } catch (error) {
      // Handle missing CAA records gracefully
    }

    // Check for DMARC record
    try {
      const dmarcRecords = await resolveTxt(`_dmarc.${domain}`);
      dmarcRecords.forEach(dmarcArray => {
        const dmarcValue = dmarcArray.join('');
        if (dmarcValue.toLowerCase().includes('v=dmarc1')) {
          emailSecurity.dmarc = true;
          records.push({
            type: 'TXT',
            value: `_dmarc.${domain}: ${dmarcValue}`
          });
        }
      });
    } catch (error) {
      // Handle missing DMARC records gracefully
    }

    // Attempt to detect DNSSEC
    const dnssec = await this.checkDNSSEC(domain);

    return {
      domain,
      records,
      emailSecurity,
      dnssec,
      timestamp: new Date()
    };
  }

  private async checkDNSSEC(domain: string): Promise<boolean> {
    try {
      // Check for DS record in parent zone
      // This is a simplified check - in practice, DNSSEC validation is more complex
      const resolver = new dns.Resolver();
      resolver.setServers(['8.8.8.8', '1.1.1.1']); // Use public DNS servers

      // Try to resolve with DO flag (DNSSEC OK)
      // Note: Node.js dns module has limited DNSSEC support
      // This is a basic heuristic check
      return new Promise((resolve) => {
        dns.resolve(domain, 'DS', (err, records) => {
          if (err) {
            resolve(false);
          } else {
            resolve(records && records.length > 0);
          }
        });
      });
    } catch (error) {
      return false;
    }
  }

  async scanMultipleDomains(domains: string[]): Promise<DNSResult[]> {
    const results = await Promise.allSettled(
      domains.map(domain => this.scanDomain(domain))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<DNSResult> =>
        result.status === 'fulfilled')
      .map(result => result.value);
  }
}

export const dnsScanner = new DNSScanner();