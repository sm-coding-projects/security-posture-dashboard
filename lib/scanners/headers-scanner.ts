import { HeadersResult, HeaderInfo } from '../../types';

interface SecurityHeader {
  name: string;
  maxScore: number;
  scorePresent: number;
  scoreConfigured?: number;
  validateConfig?: (value: string) => number;
  getRecommendation: (present: boolean, value?: string) => string;
}

const SECURITY_HEADERS: SecurityHeader[] = [
  {
    name: 'strict-transport-security',
    maxScore: 20,
    scorePresent: 15,
    scoreConfigured: 20,
    validateConfig: (value: string): number => {
      const maxAgeMatch = value.match(/max-age=(\d+)/);
      const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1]) : 0;
      const hasIncludeSubdomains = value.includes('includeSubDomains');
      const hasPreload = value.includes('preload');

      let score = 15;
      if (maxAge >= 31536000) score += 3; // 1 year
      if (hasIncludeSubdomains) score += 1;
      if (hasPreload) score += 1;

      return score;
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return 'Add Strict-Transport-Security header with max-age=31536000; includeSubDomains; preload';
      }

      if (!value) return 'Configure HSTS with proper max-age and directives';

      const maxAgeMatch = value.match(/max-age=(\d+)/);
      const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1]) : 0;
      const hasIncludeSubdomains = value.includes('includeSubDomains');
      const hasPreload = value.includes('preload');

      const issues = [];
      if (maxAge < 31536000) issues.push('increase max-age to at least 31536000 (1 year)');
      if (!hasIncludeSubdomains) issues.push('add includeSubDomains directive');
      if (!hasPreload) issues.push('consider adding preload directive');

      return issues.length ? `Improve HSTS: ${issues.join(', ')}` : 'HSTS is properly configured';
    }
  },
  {
    name: 'content-security-policy',
    maxScore: 20,
    scorePresent: 10,
    scoreConfigured: 20,
    validateConfig: (value: string): number => {
      let score = 10;

      // Check for unsafe directives
      if (value.includes("'unsafe-inline'")) score -= 5;
      if (value.includes("'unsafe-eval'")) score -= 3;
      if (value.includes('*')) score -= 2;

      // Check for important directives
      if (value.includes('default-src')) score += 2;
      if (value.includes('script-src')) score += 2;
      if (value.includes('object-src')) score += 1;
      if (value.includes('base-uri')) score += 1;
      if (value.includes('frame-ancestors')) score += 2;

      return Math.max(5, Math.min(20, score));
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return "Add Content-Security-Policy header to prevent XSS and other injection attacks";
      }

      if (!value) return 'Configure CSP with appropriate directives';

      const issues = [];
      if (value.includes("'unsafe-inline'")) issues.push("remove 'unsafe-inline'");
      if (value.includes("'unsafe-eval'")) issues.push("remove 'unsafe-eval'");
      if (value.includes('*')) issues.push('avoid wildcard (*) sources');

      if (!value.includes('default-src')) issues.push('add default-src directive');
      if (!value.includes('script-src')) issues.push('add script-src directive');
      if (!value.includes('frame-ancestors')) issues.push('add frame-ancestors directive');

      return issues.length ? `Improve CSP: ${issues.join(', ')}` : 'CSP is well configured';
    }
  },
  {
    name: 'x-frame-options',
    maxScore: 15,
    scorePresent: 10,
    scoreConfigured: 15,
    validateConfig: (value: string): number => {
      const upperValue = value.toUpperCase();
      if (upperValue === 'DENY') return 15;
      if (upperValue === 'SAMEORIGIN') return 12;
      if (upperValue.startsWith('ALLOW-FROM')) return 8;
      return 5;
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return 'Add X-Frame-Options header to prevent clickjacking attacks';
      }

      if (!value) return 'Configure X-Frame-Options properly';

      const upperValue = value.toUpperCase();
      if (upperValue === 'DENY') return 'X-Frame-Options is optimally configured';
      if (upperValue === 'SAMEORIGIN') return 'Consider using DENY for better security if framing is not needed';
      return 'Use DENY or SAMEORIGIN instead of ALLOW-FROM';
    }
  },
  {
    name: 'x-content-type-options',
    maxScore: 10,
    scorePresent: 10,
    validateConfig: (value: string): number => {
      return value.toLowerCase() === 'nosniff' ? 10 : 5;
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return 'Add X-Content-Type-Options: nosniff header to prevent MIME type sniffing';
      }

      if (!value || value.toLowerCase() !== 'nosniff') {
        return 'Set X-Content-Type-Options to "nosniff"';
      }

      return 'X-Content-Type-Options is properly configured';
    }
  },
  {
    name: 'referrer-policy',
    maxScore: 10,
    scorePresent: 6,
    scoreConfigured: 10,
    validateConfig: (value: string): number => {
      const policies = ['no-referrer', 'no-referrer-when-downgrade', 'origin', 'origin-when-cross-origin', 'same-origin', 'strict-origin', 'strict-origin-when-cross-origin', 'unsafe-url'];
      const lowerValue = value.toLowerCase();

      if (lowerValue === 'no-referrer' || lowerValue === 'strict-origin-when-cross-origin') return 10;
      if (lowerValue === 'strict-origin' || lowerValue === 'origin-when-cross-origin') return 8;
      if (policies.includes(lowerValue)) return 6;
      return 3;
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return 'Add Referrer-Policy header to control referrer information';
      }

      if (!value) return 'Configure Referrer-Policy properly';

      const lowerValue = value.toLowerCase();
      if (lowerValue === 'no-referrer' || lowerValue === 'strict-origin-when-cross-origin') {
        return 'Referrer-Policy is optimally configured';
      }

      return 'Consider using "strict-origin-when-cross-origin" or "no-referrer" for better privacy';
    }
  },
  {
    name: 'permissions-policy',
    maxScore: 10,
    scorePresent: 8,
    scoreConfigured: 10,
    validateConfig: (value: string): number => {
      let score = 8;

      // Check for important permissions being restricted
      const restrictedPermissions = [
        'camera=', 'microphone=', 'geolocation=', 'payment=', 'usb=', 'magnetometer=', 'gyroscope='
      ];

      restrictedPermissions.forEach(permission => {
        if (value.includes(permission)) score += 0.2;
      });

      return Math.min(10, score);
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return 'Add Permissions-Policy header to control browser features and APIs';
      }

      return 'Consider restricting unnecessary permissions like camera, microphone, geolocation';
    }
  },
  {
    name: 'x-xss-protection',
    maxScore: 5,
    scorePresent: 3,
    scoreConfigured: 5,
    validateConfig: (value: string): number => {
      if (value === '1; mode=block') return 5;
      if (value === '1') return 3;
      if (value === '0') return 1;
      return 2;
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return 'Add X-XSS-Protection: 1; mode=block header (legacy browsers)';
      }

      if (value === '1; mode=block') return 'X-XSS-Protection is properly configured';
      return 'Set X-XSS-Protection to "1; mode=block" or consider removing for modern CSP';
    }
  },
  {
    name: 'expect-ct',
    maxScore: 5,
    scorePresent: 3,
    scoreConfigured: 5,
    validateConfig: (value: string): number => {
      const maxAgeMatch = value.match(/max-age=(\d+)/);
      const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1]) : 0;
      const hasEnforce = value.includes('enforce');

      let score = 3;
      if (maxAge > 0) score += 1;
      if (hasEnforce) score += 1;

      return score;
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return 'Consider adding Expect-CT header for Certificate Transparency';
      }

      if (!value?.includes('enforce')) {
        return 'Consider adding "enforce" directive to Expect-CT';
      }

      return 'Expect-CT is properly configured';
    }
  },
  {
    name: 'cross-origin-embedder-policy',
    maxScore: 5,
    scorePresent: 4,
    scoreConfigured: 5,
    validateConfig: (value: string): number => {
      if (value === 'require-corp') return 5;
      if (value === 'credentialless') return 4;
      return 3;
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return 'Consider adding Cross-Origin-Embedder-Policy for enhanced security';
      }

      if (value === 'require-corp') return 'COEP is optimally configured';
      return 'Consider using "require-corp" for stronger protection';
    }
  },
  {
    name: 'cross-origin-opener-policy',
    maxScore: 5,
    scorePresent: 4,
    scoreConfigured: 5,
    validateConfig: (value: string): number => {
      if (value === 'same-origin') return 5;
      if (value === 'same-origin-allow-popups') return 4;
      return 3;
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return 'Consider adding Cross-Origin-Opener-Policy for process isolation';
      }

      if (value === 'same-origin') return 'COOP is optimally configured';
      return 'Consider using "same-origin" for better isolation';
    }
  },
  {
    name: 'cross-origin-resource-policy',
    maxScore: 5,
    scorePresent: 3,
    scoreConfigured: 5,
    validateConfig: (value: string): number => {
      if (value === 'same-site') return 5;
      if (value === 'same-origin') return 4;
      if (value === 'cross-origin') return 3;
      return 2;
    },
    getRecommendation: (present: boolean, value?: string) => {
      if (!present) {
        return 'Consider adding Cross-Origin-Resource-Policy to prevent unwanted embedding';
      }

      if (value === 'same-site' || value === 'same-origin') return 'CORP is properly configured';
      return 'Consider using "same-site" or "same-origin" for better protection';
    }
  }
];

export class HeadersScanner {
  private timeout: number = 30000;

  async scanHeaders(domain: string): Promise<HeadersResult> {
    try {
      const url = `https://${domain}`;
      const headers = await this.fetchHeaders(url);
      const headerAnalysis = this.analyzeHeaders(headers);
      const score = this.calculateOverallScore(headerAnalysis);

      return {
        score,
        headers: headerAnalysis
      };
    } catch (error) {
      throw new Error(`Headers scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fetchHeaders(url: string): Promise<Headers> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'SecurityPosture-HeadersScanner/1.0'
        }
      });

      clearTimeout(timeoutId);
      return response.headers;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw new Error(`Failed to fetch headers: ${error.message}`);
      }

      throw new Error('Failed to fetch headers: Unknown error');
    }
  }

  private analyzeHeaders(responseHeaders: Headers): HeadersResult['headers'] {
    const analysis: HeadersResult['headers'] = {} as HeadersResult['headers'];

    SECURITY_HEADERS.forEach(securityHeader => {
      const headerValue = responseHeaders.get(securityHeader.name);
      const present = headerValue !== null;

      let score: number;
      if (!present) {
        score = 0;
      } else if (securityHeader.validateConfig && headerValue) {
        score = securityHeader.validateConfig(headerValue);
      } else {
        score = securityHeader.scorePresent;
      }

      const recommendation = securityHeader.getRecommendation(present, headerValue || undefined);

      analysis[securityHeader.name as keyof HeadersResult['headers']] = {
        present,
        value: headerValue || undefined,
        score,
        recommendation
      };
    });

    return analysis;
  }

  private calculateOverallScore(headers: HeadersResult['headers']): number {
    const totalMaxScore = SECURITY_HEADERS.reduce((sum, header) => sum + header.maxScore, 0);
    const actualScore = Object.values(headers).reduce((sum, header) => sum + header.score, 0);

    return Math.round((actualScore / totalMaxScore) * 100);
  }
}

export async function scanHeaders(domain: string): Promise<HeadersResult> {
  const scanner = new HeadersScanner();
  return scanner.scanHeaders(domain);
}