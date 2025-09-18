export enum UserTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export enum ScanStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum ScanType {
  BASIC = 'BASIC',
  COMPREHENSIVE = 'COMPREHENSIVE',
  CUSTOM = 'CUSTOM',
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  tier: UserTier;
  credits: number;
  totalScans: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SSLCertificate {
  subject: string;
  issuer: string;
  serialNumber: string;
  validFrom: Date;
  validTo: Date;
  fingerprint: string;
  signatureAlgorithm: string;
  keySize: number;
  commonName: string;
  subjectAlternativeNames: string[];
}

export interface SSLProtocol {
  name: string;
  version: string;
  enabled: boolean;
  secure: boolean;
}

export interface SSLCipherSuite {
  name: string;
  strength: number;
  keyExchange: string;
  authentication: string;
  encryption: string;
  mac: string;
}

export interface SSLVulnerability {
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  cve?: string;
  recommendation: string;
}

export interface SSLResult {
  grade: string;
  score: number;
  certificate: SSLCertificate;
  protocols: SSLProtocol[];
  cipherSuites: SSLCipherSuite[];
  vulnerabilities: SSLVulnerability[];
  chainIssues: string[];
  ocspStapling: boolean;
  hsts: boolean;
  hstsMaxAge?: number;
  hstsIncludeSubdomains?: boolean;
  hstsPreload?: boolean;
}

export interface HeaderInfo {
  present: boolean;
  value?: string;
  score: number;
  recommendation: string;
}

export interface HeadersResult {
  score: number;
  headers: {
    'strict-transport-security': HeaderInfo;
    'content-security-policy': HeaderInfo;
    'x-frame-options': HeaderInfo;
    'x-content-type-options': HeaderInfo;
    'referrer-policy': HeaderInfo;
    'permissions-policy': HeaderInfo;
    'x-xss-protection': HeaderInfo;
    'expect-ct': HeaderInfo;
    'cross-origin-embedder-policy': HeaderInfo;
    'cross-origin-opener-policy': HeaderInfo;
    'cross-origin-resource-policy': HeaderInfo;
  };
}

export interface DNSRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

export interface EmailSecurity {
  spf: {
    present: boolean;
    valid: boolean;
    record?: string;
    mechanisms: string[];
  };
  dmarc: {
    present: boolean;
    valid: boolean;
    record?: string;
    policy: string;
    percentage?: number;
    reportingEmails: string[];
  };
  dkim: {
    present: boolean;
    valid: boolean;
    selectors: string[];
    keys: Array<{
      selector: string;
      valid: boolean;
      keySize?: number;
    }>;
  };
}

export interface DNSResult {
  records: DNSRecord[];
  emailSecurity: EmailSecurity;
  dnssec: boolean;
  nameservers: string[];
  mx: DNSRecord[];
  caa: DNSRecord[];
}

export interface ScanResult {
  ssl: SSLResult;
  headers: HeadersResult;
  dns: DNSResult;
}

export interface Scan {
  id: string;
  userId: string;
  domain: string;
  status: ScanStatus;
  sslGrade: string | null;
  securityScore: number | null;
  sslDetails: SSLResult | null;
  headersDetails: HeadersResult | null;
  dnsDetails: DNSResult | null;
  vulnerabilities: SSLVulnerability[];
  creditsUsed: number;
  scanType: ScanType;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface ScanSummary {
  id: string;
  domain: string;
  status: ScanStatus;
  sslGrade: string | null;
  securityScore: number | null;
  scanType: ScanType;
  creditsUsed: number;
  createdAt: Date;
  completedAt: Date | null;
}

export interface SecurityMetrics {
  totalScans: number;
  averageScore: number;
  gradeDistribution: Record<string, number>;
  vulnerabilityCount: number;
  criticalIssues: number;
  lastScanDate: Date | null;
}

export interface DashboardStats {
  user: User;
  recentScans: ScanSummary[];
  securityMetrics: SecurityMetrics;
  creditsRemaining: number;
  tierLimits: {
    maxScansPerMonth: number;
    maxConcurrentScans: number;
    features: string[];
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedScansResponse {
  scans: ScanSummary[];
  pagination: PaginationMeta;
}