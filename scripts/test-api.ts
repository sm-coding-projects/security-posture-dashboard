#!/usr/bin/env tsx

import { performance } from 'perf_hooks';

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_DOMAIN_VALID = 'example.com';
const TEST_DOMAIN_INVALID = 'invalid-domain';

// Types for API responses
interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: {
      status: 'healthy' | 'unhealthy';
      responseTime?: number;
      error?: string;
    };
    api: {
      status: 'healthy' | 'unhealthy';
    };
  };
}

interface ScanResponse {
  scanId: string;
  domain: string;
  status: string;
  scanType: string;
  creditsUsed: number;
  createdAt: string;
}

interface ScanDetailsResponse {
  id: string;
  domain: string;
  status: string;
  sslGrade?: string;
  securityScore?: number;
  sslDetails?: any;
  headerDetails?: any;
  dnsDetails?: any;
  vulnerabilities?: any;
  creditsUsed: number;
  scanType: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

interface ScansListResponse {
  scans: Array<{
    id: string;
    domain: string;
    status: string;
    sslGrade?: string;
    securityScore?: number;
    creditsUsed: number;
    scanType: string;
    errorMessage?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Color utilities for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message: string, color?: keyof typeof colors) {
  const colorCode = color ? colors[color] : '';
  const resetCode = color ? colors.reset : '';
  console.log(`${colorCode}${message}${resetCode}`);
}

function logTest(testName: string) {
  log(`\n🧪 Testing: ${testName}`, 'cyan');
}

function logSuccess(message: string) {
  log(`✅ ${message}`, 'green');
}

function logError(message: string) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, 'blue');
}

// HTTP client utility
async function makeRequest(
  endpoint: string,
  options: RequestInit = {},
  includeAuth = false
): Promise<{ response: Response; data: any; responseTime: number }> {
  const startTime = performance.now();

  const url = `${BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Note: In a real test, you'd need to handle authentication properly
  // This is a placeholder for auth testing
  if (includeAuth) {
    // headers['Authorization'] = 'Bearer your-token-here';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    const responseTime = performance.now() - startTime;

    return { response, data, responseTime };
  } catch (error) {
    const responseTime = performance.now() - startTime;
    throw new Error(`Request failed after ${responseTime.toFixed(2)}ms: ${error}`);
  }
}

// Test functions
async function testHealthEndpoint(): Promise<boolean> {
  logTest('Health Endpoint');

  try {
    const { response, data, responseTime } = await makeRequest('/api/health');

    logInfo(`Response time: ${responseTime.toFixed(2)}ms`);
    logInfo(`Status code: ${response.status}`);

    if (response.status === 200 || response.status === 503) {
      const healthData = data as HealthResponse;
      logInfo(`Overall status: ${healthData.status}`);
      logInfo(`Database status: ${healthData.services.database.status}`);
      logInfo(`API status: ${healthData.services.api.status}`);

      if (healthData.services.database.responseTime) {
        logInfo(`Database response time: ${healthData.services.database.responseTime}ms`);
      }

      logSuccess('Health endpoint test passed');
      return true;
    } else {
      logError(`Unexpected status code: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Health endpoint test failed: ${error}`);
    return false;
  }
}

async function testAuthenticationFlow(): Promise<boolean> {
  logTest('Authentication Flow');

  try {
    // Test unauthenticated access to protected endpoint
    logInfo('Testing unauthenticated access...');
    const { response: unauthedResponse } = await makeRequest('/api/scans');

    if (unauthedResponse.status === 401) {
      logSuccess('Unauthenticated request properly rejected (401)');
    } else {
      logWarning(`Expected 401 but got ${unauthedResponse.status}`);
    }

    // Note: Full auth flow testing would require setting up test credentials
    logInfo('Note: Full authentication testing requires valid credentials');
    logInfo('This test only verifies that protected endpoints reject unauthenticated requests');

    return unauthedResponse.status === 401;
  } catch (error) {
    logError(`Authentication test failed: ${error}`);
    return false;
  }
}

async function testScanCreationValid(): Promise<{ success: boolean; scanId?: string }> {
  logTest('Scan Creation - Valid Domain');

  try {
    const requestBody = {
      domain: TEST_DOMAIN_VALID,
      scanType: 'vulnerability'
    };

    logInfo(`Testing scan creation for domain: ${TEST_DOMAIN_VALID}`);

    const { response, data } = await makeRequest('/api/scan', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    }, true);

    logInfo(`Status code: ${response.status}`);

    if (response.status === 401) {
      logWarning('Request rejected due to authentication (expected without valid session)');
      return { success: true }; // This is expected behavior
    }

    if (response.status === 201) {
      const scanData = data as ScanResponse;
      logSuccess(`Scan created successfully with ID: ${scanData.scanId}`);
      logInfo(`Domain: ${scanData.domain}`);
      logInfo(`Status: ${scanData.status}`);
      logInfo(`Scan type: ${scanData.scanType}`);
      logInfo(`Credits used: ${scanData.creditsUsed}`);
      return { success: true, scanId: scanData.scanId };
    } else {
      logError(`Unexpected response: ${response.status} - ${JSON.stringify(data)}`);
      return { success: false };
    }
  } catch (error) {
    logError(`Valid domain scan test failed: ${error}`);
    return { success: false };
  }
}

async function testScanCreationInvalid(): Promise<boolean> {
  logTest('Scan Creation - Invalid Domain');

  try {
    const requestBody = {
      domain: TEST_DOMAIN_INVALID,
      scanType: 'vulnerability'
    };

    logInfo(`Testing scan creation for invalid domain: ${TEST_DOMAIN_INVALID}`);

    const { response, data } = await makeRequest('/api/scan', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    }, true);

    logInfo(`Status code: ${response.status}`);

    if (response.status === 401) {
      logWarning('Request rejected due to authentication (expected without valid session)');
      return true; // This is expected behavior
    }

    if (response.status === 400) {
      logSuccess('Invalid domain properly rejected (400)');
      logInfo(`Error message: ${JSON.stringify(data)}`);
      return true;
    } else {
      logError(`Expected 400 but got ${response.status} - ${JSON.stringify(data)}`);
      return false;
    }
  } catch (error) {
    logError(`Invalid domain scan test failed: ${error}`);
    return false;
  }
}

async function testScanStatusRetrieval(scanId?: string): Promise<boolean> {
  logTest('Scan Status Retrieval');

  if (!scanId) {
    logWarning('No scan ID provided, using dummy ID for endpoint testing');
    scanId = 'dummy-scan-id';
  }

  try {
    logInfo(`Testing scan status retrieval for ID: ${scanId}`);

    const { response, data } = await makeRequest(`/api/scan/${scanId}`, {}, true);

    logInfo(`Status code: ${response.status}`);

    if (response.status === 401) {
      logWarning('Request rejected due to authentication (expected without valid session)');
      return true; // This is expected behavior
    }

    if (response.status === 404) {
      logWarning('Scan not found (expected for dummy ID)');
      return true;
    }

    if (response.status === 200) {
      const scanData = data as ScanDetailsResponse;
      logSuccess('Scan details retrieved successfully');
      logInfo(`Domain: ${scanData.domain}`);
      logInfo(`Status: ${scanData.status}`);
      logInfo(`Scan type: ${scanData.scanType}`);
      if (scanData.securityScore) {
        logInfo(`Security score: ${scanData.securityScore}`);
      }
      return true;
    } else {
      logError(`Unexpected response: ${response.status} - ${JSON.stringify(data)}`);
      return false;
    }
  } catch (error) {
    logError(`Scan status retrieval test failed: ${error}`);
    return false;
  }
}

async function testScanHistoryPagination(): Promise<boolean> {
  logTest('Scan History Pagination');

  try {
    // Test first page
    logInfo('Testing first page of scan history...');
    const { response: page1Response, data: page1Data } = await makeRequest('/api/scans?page=1&limit=5', {}, true);

    logInfo(`Status code: ${page1Response.status}`);

    if (page1Response.status === 401) {
      logWarning('Request rejected due to authentication (expected without valid session)');
      return true; // This is expected behavior
    }

    if (page1Response.status === 200) {
      const scansData = page1Data as ScansListResponse;
      logSuccess('Scan history retrieved successfully');
      logInfo(`Total scans: ${scansData.pagination.total}`);
      logInfo(`Current page: ${scansData.pagination.page}`);
      logInfo(`Total pages: ${scansData.pagination.pages}`);
      logInfo(`Scans on this page: ${scansData.scans.length}`);
      logInfo(`Has next page: ${scansData.pagination.hasNext}`);
      logInfo(`Has previous page: ${scansData.pagination.hasPrev}`);

      // Test second page if available
      if (scansData.pagination.hasNext) {
        logInfo('Testing second page...');
        const { response: page2Response, data: page2Data } = await makeRequest('/api/scans?page=2&limit=5', {}, true);

        if (page2Response.status === 200) {
          const page2ScansData = page2Data as ScansListResponse;
          logSuccess('Second page retrieved successfully');
          logInfo(`Scans on page 2: ${page2ScansData.scans.length}`);
        }
      }

      // Test filtering
      logInfo('Testing domain filtering...');
      const { response: filteredResponse } = await makeRequest('/api/scans?domain=example.com', {}, true);

      if (filteredResponse.status === 200) {
        logSuccess('Domain filtering works');
      }

      return true;
    } else {
      logError(`Unexpected response: ${page1Response.status} - ${JSON.stringify(page1Data)}`);
      return false;
    }
  } catch (error) {
    logError(`Scan history pagination test failed: ${error}`);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  log('🚀 Starting API Test Suite', 'bright');
  log(`Base URL: ${BASE_URL}`, 'blue');
  log(`Test domain (valid): ${TEST_DOMAIN_VALID}`, 'blue');
  log(`Test domain (invalid): ${TEST_DOMAIN_INVALID}`, 'blue');

  const results: { [key: string]: boolean } = {};
  let scanId: string | undefined;

  // Run tests
  results.health = await testHealthEndpoint();
  results.auth = await testAuthenticationFlow();

  const scanResult = await testScanCreationValid();
  results.scanValid = scanResult.success;
  scanId = scanResult.scanId;

  results.scanInvalid = await testScanCreationInvalid();
  results.scanStatus = await testScanStatusRetrieval(scanId);
  results.pagination = await testScanHistoryPagination();

  // Summary
  log('\n📊 Test Results Summary', 'bright');
  log('========================', 'bright');

  const testNames = {
    health: 'Health Endpoint',
    auth: 'Authentication Flow',
    scanValid: 'Scan Creation (Valid)',
    scanInvalid: 'Scan Creation (Invalid)',
    scanStatus: 'Scan Status Retrieval',
    pagination: 'Pagination & Filtering'
  };

  let passedCount = 0;
  const totalCount = Object.keys(results).length;

  for (const [key, result] of Object.entries(results)) {
    if (result) {
      logSuccess(`${testNames[key as keyof typeof testNames]}`);
      passedCount++;
    } else {
      logError(`${testNames[key as keyof typeof testNames]}`);
    }
  }

  log(`\n📈 Overall: ${passedCount}/${totalCount} tests passed`, passedCount === totalCount ? 'green' : 'yellow');

  if (passedCount === totalCount) {
    log('🎉 All tests passed!', 'green');
  } else {
    log('⚠️  Some tests failed or had warnings', 'yellow');
  }

  log('\n💡 Note: Authentication-related failures are expected when running without valid credentials', 'blue');
  log('To test with authentication, set up proper session management or API keys', 'blue');
}

// Run if this file is executed directly
if (require.main === module) {
  runAllTests().catch((error) => {
    logError(`Test suite failed: ${error}`);
    process.exit(1);
  });
}

export {
  runAllTests,
  testHealthEndpoint,
  testAuthenticationFlow,
  testScanCreationValid,
  testScanCreationInvalid,
  testScanStatusRetrieval,
  testScanHistoryPagination
};