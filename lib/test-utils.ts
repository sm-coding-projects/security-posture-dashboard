import { faker } from '@faker-js/faker';
import {
  User,
  Scan,
  ScanStatus,
  ScanType,
  UserTier,
  SSLResult,
  HeadersResult,
  DNSResult,
  SSLCertificate,
  SSLProtocol,
  SSLCipherSuite,
  SSLVulnerability,
  HeaderInfo,
  DNSRecord,
  EmailSecurity,
  SecurityMetrics,
  DashboardStats,
  ScanSummary,
} from '@/types';

// Test Constants
export const TEST_CONSTANTS = {
  DOMAINS: [
    'example.com',
    'test-site.org',
    'secure-domain.net',
    'my-website.com',
    'corporate-site.co',
  ],
  SSL_GRADES: ['A+', 'A', 'A-', 'B', 'C', 'D', 'F'],
  USER_EMAILS: [
    'test@example.com',
    'user@test.org',
    'admin@secure.net',
    'developer@mysite.com',
  ],
  VULNERABILITY_SEVERITIES: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const,
  CIPHER_SUITES: [
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-GCM-SHA256',
  ],
  PROTOCOLS: [
    { name: 'TLS', version: '1.3' },
    { name: 'TLS', version: '1.2' },
    { name: 'TLS', version: '1.1' },
    { name: 'SSL', version: '3.0' },
  ],
};

// Mock User Data
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  image: faker.image.avatar(),
  tier: faker.helpers.enumValue(UserTier),
  credits: faker.number.int({ min: 0, max: 1000 }),
  totalScans: faker.number.int({ min: 0, max: 100 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

export const createMockUsers = (count: number): User[] =>
  Array.from({ length: count }, () => createMockUser());

// Mock SSL Certificate Data
export const createMockSSLCertificate = (
  overrides: Partial<SSLCertificate> = {}
): SSLCertificate => ({
  subject: `CN=${faker.internet.domainName()}`,
  issuer: faker.company.name(),
  serialNumber: faker.string.alphanumeric(16),
  validFrom: faker.date.past(),
  validTo: faker.date.future(),
  fingerprint: faker.string.alphanumeric(40).toUpperCase(),
  signatureAlgorithm: 'SHA256-RSA',
  keySize: faker.helpers.arrayElement([2048, 3072, 4096]),
  commonName: faker.internet.domainName(),
  subjectAlternativeNames: Array.from(
    { length: faker.number.int({ min: 1, max: 5 }) },
    () => faker.internet.domainName()
  ),
  ...overrides,
});

// Mock SSL Protocol Data
export const createMockSSLProtocol = (
  overrides: Partial<SSLProtocol> = {}
): SSLProtocol => {
  const protocol = faker.helpers.arrayElement(TEST_CONSTANTS.PROTOCOLS);
  return {
    name: protocol.name,
    version: protocol.version,
    enabled: faker.datatype.boolean(),
    secure: protocol.name === 'TLS' && parseFloat(protocol.version) >= 1.2,
    ...overrides,
  };
};

// Mock SSL Cipher Suite Data
export const createMockSSLCipherSuite = (
  overrides: Partial<SSLCipherSuite> = {}
): SSLCipherSuite => ({
  name: faker.helpers.arrayElement(TEST_CONSTANTS.CIPHER_SUITES),
  strength: faker.number.int({ min: 128, max: 256 }),
  keyExchange: faker.helpers.arrayElement(['ECDHE', 'DHE', 'RSA']),
  authentication: faker.helpers.arrayElement(['RSA', 'ECDSA', 'DSA']),
  encryption: faker.helpers.arrayElement(['AES', 'ChaCha20']),
  mac: faker.helpers.arrayElement(['SHA384', 'SHA256', 'POLY1305']),
  ...overrides,
});

// Mock SSL Vulnerability Data
export const createMockSSLVulnerability = (
  overrides: Partial<SSLVulnerability> = {}
): SSLVulnerability => ({
  name: faker.hacker.noun(),
  severity: faker.helpers.arrayElement(TEST_CONSTANTS.VULNERABILITY_SEVERITIES),
  description: faker.lorem.sentence(),
  cve: Math.random() > 0.5 ? `CVE-${faker.date.recent().getFullYear()}-${faker.number.int({ min: 1000, max: 9999 })}` : undefined,
  recommendation: faker.lorem.sentence(),
  ...overrides,
});

// Mock SSL Result Data
export const createMockSSLResult = (
  overrides: Partial<SSLResult> = {}
): SSLResult => ({
  grade: faker.helpers.arrayElement(TEST_CONSTANTS.SSL_GRADES),
  score: faker.number.int({ min: 0, max: 100 }),
  certificate: createMockSSLCertificate(),
  protocols: Array.from({ length: 3 }, () => createMockSSLProtocol()),
  cipherSuites: Array.from({ length: 5 }, () => createMockSSLCipherSuite()),
  vulnerabilities: Array.from(
    { length: faker.number.int({ min: 0, max: 3 }) },
    () => createMockSSLVulnerability()
  ),
  chainIssues: faker.datatype.boolean()
    ? [faker.lorem.sentence()]
    : [],
  ocspStapling: faker.datatype.boolean(),
  hsts: faker.datatype.boolean(),
  hstsMaxAge: faker.datatype.boolean() ? faker.number.int({ min: 3600, max: 31536000 }) : undefined,
  hstsIncludeSubdomains: faker.datatype.boolean(),
  hstsPreload: faker.datatype.boolean(),
  ...overrides,
});

// Mock Header Info Data
export const createMockHeaderInfo = (
  overrides: Partial<HeaderInfo> = {}
): HeaderInfo => ({
  present: faker.datatype.boolean(),
  value: faker.datatype.boolean() ? faker.lorem.words() : undefined,
  score: faker.number.int({ min: 0, max: 100 }),
  recommendation: faker.lorem.sentence(),
  ...overrides,
});

// Mock Headers Result Data
export const createMockHeadersResult = (
  overrides: Partial<HeadersResult> = {}
): HeadersResult => ({
  score: faker.number.int({ min: 0, max: 100 }),
  headers: {
    'strict-transport-security': createMockHeaderInfo(),
    'content-security-policy': createMockHeaderInfo(),
    'x-frame-options': createMockHeaderInfo(),
    'x-content-type-options': createMockHeaderInfo(),
    'referrer-policy': createMockHeaderInfo(),
    'permissions-policy': createMockHeaderInfo(),
    'x-xss-protection': createMockHeaderInfo(),
    'expect-ct': createMockHeaderInfo(),
    'cross-origin-embedder-policy': createMockHeaderInfo(),
    'cross-origin-opener-policy': createMockHeaderInfo(),
    'cross-origin-resource-policy': createMockHeaderInfo(),
  },
  ...overrides,
});

// Mock DNS Record Data
export const createMockDNSRecord = (
  overrides: Partial<DNSRecord> = {}
): DNSRecord => ({
  type: faker.helpers.arrayElement(['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS']),
  name: faker.internet.domainName(),
  value: faker.internet.ip(),
  ttl: faker.number.int({ min: 300, max: 86400 }),
  priority: Math.random() > 0.5 ? faker.number.int({ min: 10, max: 50 }) : undefined,
  ...overrides,
});

// Mock Email Security Data
export const createMockEmailSecurity = (
  overrides: Partial<EmailSecurity> = {}
): EmailSecurity => ({
  spf: {
    present: faker.datatype.boolean(),
    valid: faker.datatype.boolean(),
    record: `v=spf1 include:_spf.${faker.internet.domainName()} ~all`,
    mechanisms: ['include', 'a', 'mx'],
  },
  dmarc: {
    present: faker.datatype.boolean(),
    valid: faker.datatype.boolean(),
    record: `v=DMARC1; p=${faker.helpers.arrayElement(['none', 'quarantine', 'reject'])}; rua=mailto:dmarc@${faker.internet.domainName()}`,
    policy: faker.helpers.arrayElement(['none', 'quarantine', 'reject']),
    percentage: faker.number.int({ min: 1, max: 100 }),
    reportingEmails: [faker.internet.email()],
  },
  dkim: {
    present: faker.datatype.boolean(),
    valid: faker.datatype.boolean(),
    selectors: ['default', 'selector1'],
    keys: [
      {
        selector: 'default',
        valid: faker.datatype.boolean(),
        keySize: faker.helpers.arrayElement([1024, 2048]),
      },
    ],
  },
  ...overrides,
});

// Mock DNS Result Data
export const createMockDNSResult = (
  overrides: Partial<DNSResult> = {}
): DNSResult => ({
  records: Array.from({ length: 5 }, () => createMockDNSRecord()),
  emailSecurity: createMockEmailSecurity(),
  dnssec: faker.datatype.boolean(),
  nameservers: Array.from({ length: 2 }, () => faker.internet.domainName()),
  mx: Array.from({ length: 2 }, () => createMockDNSRecord({ type: 'MX' })),
  caa: Array.from({ length: 1 }, () => createMockDNSRecord({ type: 'CAA' })),
  ...overrides,
});

// Mock Scan Data
export const createMockScan = (overrides: Partial<Scan> = {}): Scan => {
  const createdAt = faker.date.past();
  const completedAt = faker.helpers.arrayElement([null, faker.date.between({ from: createdAt, to: new Date() })]);

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    domain: faker.helpers.arrayElement(TEST_CONSTANTS.DOMAINS),
    status: faker.helpers.enumValue(ScanStatus),
    sslGrade: faker.helpers.arrayElement([...TEST_CONSTANTS.SSL_GRADES, null]),
    securityScore: faker.number.int({ min: 0, max: 100 }),
    sslDetails: createMockSSLResult(),
    headersDetails: createMockHeadersResult(),
    dnsDetails: createMockDNSResult(),
    vulnerabilities: Array.from(
      { length: faker.number.int({ min: 0, max: 5 }) },
      () => createMockSSLVulnerability()
    ),
    creditsUsed: faker.number.int({ min: 1, max: 10 }),
    scanType: faker.helpers.enumValue(ScanType),
    errorMessage: faker.helpers.arrayElement([null, faker.lorem.sentence()]),
    createdAt,
    updatedAt: faker.date.recent(),
    completedAt,
    ...overrides,
  };
};

export const createMockScans = (count: number): Scan[] =>
  Array.from({ length: count }, () => createMockScan());

// Mock Scan Summary Data
export const createMockScanSummary = (
  overrides: Partial<ScanSummary> = {}
): ScanSummary => {
  const scan = createMockScan(overrides);
  return {
    id: scan.id,
    domain: scan.domain,
    status: scan.status,
    sslGrade: scan.sslGrade,
    securityScore: scan.securityScore,
    scanType: scan.scanType,
    creditsUsed: scan.creditsUsed,
    createdAt: scan.createdAt,
    completedAt: scan.completedAt,
  };
};

// Mock Security Metrics Data
export const createMockSecurityMetrics = (
  overrides: Partial<SecurityMetrics> = {}
): SecurityMetrics => ({
  totalScans: faker.number.int({ min: 0, max: 1000 }),
  averageScore: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
  gradeDistribution: TEST_CONSTANTS.SSL_GRADES.reduce(
    (acc, grade) => ({
      ...acc,
      [grade]: faker.number.int({ min: 0, max: 50 }),
    }),
    {}
  ),
  vulnerabilityCount: faker.number.int({ min: 0, max: 100 }),
  criticalIssues: faker.number.int({ min: 0, max: 10 }),
  lastScanDate: faker.helpers.arrayElement([null, faker.date.recent()]),
  ...overrides,
});

// Mock Dashboard Stats Data
export const createMockDashboardStats = (
  overrides: Partial<DashboardStats> = {}
): DashboardStats => {
  const user = createMockUser();
  return {
    user,
    recentScans: Array.from({ length: 5 }, () => createMockScanSummary({ userId: user.id })),
    securityMetrics: createMockSecurityMetrics(),
    creditsRemaining: user.credits,
    tierLimits: {
      maxScansPerMonth: user.tier === UserTier.FREE ? 10 : user.tier === UserTier.PRO ? 100 : 1000,
      maxConcurrentScans: user.tier === UserTier.FREE ? 1 : user.tier === UserTier.PRO ? 3 : 10,
      features: user.tier === UserTier.FREE
        ? ['Basic Scans']
        : user.tier === UserTier.PRO
        ? ['Basic Scans', 'Advanced Scans', 'API Access']
        : ['All Features'],
    },
    ...overrides,
  };
};

// Mock Session Utilities
export const createMockSession = (user?: Partial<User>) => {
  const mockUser = createMockUser(user);
  return {
    user: {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name || '',
      image: mockUser.image || '',
      credits: mockUser.credits,
      tier: mockUser.tier,
    },
    expires: faker.date.future().toISOString(),
  };
};

export const createMockSessionWithUser = (userId: string) => {
  return createMockSession({ id: userId });
};

// Helper Functions for Common Test Scenarios
export const createUserWithScans = (scanCount: number) => {
  const user = createMockUser();
  const scans = Array.from({ length: scanCount }, () =>
    createMockScan({ userId: user.id })
  );
  return { user, scans };
};

export const createFailedScan = (domain?: string) =>
  createMockScan({
    domain: domain || faker.helpers.arrayElement(TEST_CONSTANTS.DOMAINS),
    status: ScanStatus.FAILED,
    errorMessage: 'Connection timeout',
    securityScore: null,
    sslGrade: null,
  });

export const createCompletedScan = (grade?: string, score?: number) =>
  createMockScan({
    status: ScanStatus.COMPLETED,
    sslGrade: grade || faker.helpers.arrayElement(TEST_CONSTANTS.SSL_GRADES),
    securityScore: score || faker.number.int({ min: 50, max: 100 }),
    completedAt: faker.date.recent(),
  });

export const createPendingScan = (domain?: string) =>
  createMockScan({
    domain: domain || faker.helpers.arrayElement(TEST_CONSTANTS.DOMAINS),
    status: ScanStatus.PENDING,
    securityScore: null,
    sslGrade: null,
    completedAt: null,
  });

export const createUserWithTier = (tier: UserTier, credits?: number) =>
  createMockUser({
    tier,
    credits: credits || (tier === UserTier.FREE ? 10 : tier === UserTier.PRO ? 100 : 1000),
  });

export const createHighSecurityScan = () =>
  createMockScan({
    status: ScanStatus.COMPLETED,
    sslGrade: 'A+',
    securityScore: faker.number.int({ min: 90, max: 100 }),
    vulnerabilities: [],
  });

export const createLowSecurityScan = () =>
  createMockScan({
    status: ScanStatus.COMPLETED,
    sslGrade: faker.helpers.arrayElement(['D', 'F']),
    securityScore: faker.number.int({ min: 0, max: 30 }),
    vulnerabilities: Array.from({ length: 5 }, () =>
      createMockSSLVulnerability({ severity: 'CRITICAL' })
    ),
  });

// Test Data Cleanup and Reset Utilities
export const resetMockData = () => {
  faker.seed(12345); // Use consistent seed for reproducible tests
};

export const generateTestDataSet = () => ({
  users: createMockUsers(10),
  scans: createMockScans(50),
  completedScans: Array.from({ length: 20 }, () => createCompletedScan()),
  failedScans: Array.from({ length: 5 }, () => createFailedScan()),
  pendingScans: Array.from({ length: 10 }, () => createPendingScan()),
});

// Database Mock Helpers
export const mockDatabaseResponse = <T>(data: T, delay = 100): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const mockDatabaseError = (message = 'Database connection failed') =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error(message)), 100)
  );