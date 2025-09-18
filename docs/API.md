# Security Posture Dashboard API Documentation

## Overview

The Security Posture Dashboard API provides endpoints for domain security scanning, user management, and health monitoring. All endpoints require authentication via NextAuth.js session tokens unless otherwise specified.

## Base URL

```
https://your-domain.com/api
```

## Authentication

All API endpoints (except `/health`) require user authentication. Authentication is handled via NextAuth.js sessions. Include session cookies in all requests.

### Authentication Errors

- **401 Unauthorized**: Missing or invalid session
- **403 Forbidden**: Access denied (e.g., trying to access another user's data)

## Rate Limiting

- No explicit rate limiting implemented
- Credit-based usage limits apply for scan operations

## Credit System

- Each scan operation consumes credits
- Basic scans (vulnerability): 1 credit
- Advanced scans (SSL, DNS, port): 1 credit
- Check user credits before initiating scans

---

## Endpoints

### 1. Health Check

Check the health status of the API and its dependencies.

**Endpoint:** `GET /api/health`

**Authentication:** Not required

**Response Format:**
```json
{
  "status": "healthy" | "unhealthy",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "services": {
    "database": {
      "status": "healthy" | "unhealthy",
      "responseTime": 25,
      "error": "Optional error message"
    },
    "api": {
      "status": "healthy" | "unhealthy"
    }
  }
}
```

**Status Codes:**
- `200`: All services healthy
- `503`: One or more services unhealthy

**Example Request:**
```bash
curl -X GET https://your-domain.com/api/health
```

**Example Response:**
```json
{
  "status": "healthy",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": 25
    },
    "api": {
      "status": "healthy"
    }
  }
}
```

---

### 2. Create Scan

Initiate a new security scan for a domain.

**Endpoint:** `POST /api/scan`

**Authentication:** Required

**Request Body Schema:**
```json
{
  "domain": "string (required)",
  "scanType": "vulnerability" | "ssl" | "dns" | "port" (optional, default: "vulnerability")"
}
```

**Response Format:**
```json
{
  "scanId": "string",
  "domain": "string",
  "status": "PENDING" | "RUNNING" | "COMPLETED" | "FAILED",
  "scanType": "BASIC" | "ADVANCED",
  "creditsUsed": 1,
  "createdAt": "2023-12-07T10:30:00.000Z"
}
```

**Status Codes:**
- `201`: Scan created successfully
- `400`: Invalid request data
- `401`: Unauthorized
- `402`: Insufficient credits
- `404`: User not found
- `500`: Internal server error

**Credit Costs:**
- Vulnerability scan: 1 credit
- SSL/DNS/Port scans: 1 credit

**Example Request:**
```bash
curl -X POST https://your-domain.com/api/scan \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "domain": "example.com",
    "scanType": "vulnerability"
  }'
```

**Example Response:**
```json
{
  "scanId": "clpx1y2z30000abc123def456",
  "domain": "example.com",
  "status": "PENDING",
  "scanType": "BASIC",
  "creditsUsed": 1,
  "createdAt": "2023-12-07T10:30:00.000Z"
}
```

**Error Responses:**

Validation Error (400):
```json
{
  "error": "Invalid request data",
  "details": [
    {
      "field": "domain",
      "message": "Please enter a valid domain name (e.g., example.com)"
    }
  ]
}
```

Insufficient Credits (402):
```json
{
  "error": "Insufficient credits",
  "required": 1,
  "available": 0
}
```

---

### 3. Get Scan Details

Retrieve detailed information about a specific scan.

**Endpoint:** `GET /api/scan/{id}`

**Authentication:** Required

**URL Parameters:**
- `id` (string): Unique scan identifier

**Response Format:**
```json
{
  "id": "string",
  "domain": "string",
  "status": "PENDING" | "RUNNING" | "COMPLETED" | "FAILED",
  "sslGrade": "string | null",
  "securityScore": "number | null",
  "sslDetails": "object | null",
  "headerDetails": "object | null",
  "dnsDetails": "object | null",
  "vulnerabilities": "object | null",
  "creditsUsed": "number",
  "scanType": "BASIC" | "ADVANCED",
  "errorMessage": "string | null",
  "createdAt": "2023-12-07T10:30:00.000Z",
  "updatedAt": "2023-12-07T10:35:00.000Z"
}
```

**Status Codes:**
- `200`: Scan found and returned
- `400`: Invalid scan ID
- `401`: Unauthorized
- `403`: Access denied (scan belongs to another user)
- `404`: Scan not found
- `500`: Internal server error

**Example Request:**
```bash
curl -X GET https://your-domain.com/api/scan/clpx1y2z30000abc123def456 \
  -H "Cookie: next-auth.session-token=your-session-token"
```

**Example Response:**
```json
{
  "id": "clpx1y2z30000abc123def456",
  "domain": "example.com",
  "status": "COMPLETED",
  "sslGrade": "A+",
  "securityScore": 95,
  "sslDetails": {
    "certificate": {
      "subject": "CN=example.com",
      "issuer": "Let's Encrypt",
      "validFrom": "2023-10-01T00:00:00.000Z",
      "validTo": "2024-01-01T00:00:00.000Z"
    }
  },
  "headerDetails": {
    "securityHeaders": {
      "strictTransportSecurity": true,
      "contentSecurityPolicy": true,
      "xFrameOptions": true
    }
  },
  "vulnerabilities": {
    "critical": 0,
    "high": 1,
    "medium": 3,
    "low": 5
  },
  "creditsUsed": 1,
  "scanType": "BASIC",
  "errorMessage": null,
  "createdAt": "2023-12-07T10:30:00.000Z",
  "updatedAt": "2023-12-07T10:35:00.000Z"
}
```

---

### 4. List User Scans

Retrieve a paginated list of scans for the authenticated user.

**Endpoint:** `GET /api/scans`

**Authentication:** Required

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `domain` (string, optional): Filter by domain (case-insensitive contains)
- `status` (string, optional): Filter by status (PENDING, RUNNING, COMPLETED, FAILED)

**Response Format:**
```json
{
  "scans": [
    {
      "id": "string",
      "domain": "string",
      "status": "string",
      "sslGrade": "string | null",
      "securityScore": "number | null",
      "creditsUsed": "number",
      "scanType": "string",
      "errorMessage": "string | null",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Status Codes:**
- `200`: Scans retrieved successfully
- `401`: Unauthorized
- `500`: Internal server error

**Example Request:**
```bash
curl -X GET "https://your-domain.com/api/scans?page=1&limit=10&domain=example&status=COMPLETED" \
  -H "Cookie: next-auth.session-token=your-session-token"
```

**Example Response:**
```json
{
  "scans": [
    {
      "id": "clpx1y2z30000abc123def456",
      "domain": "example.com",
      "status": "COMPLETED",
      "sslGrade": "A+",
      "securityScore": 95,
      "creditsUsed": 1,
      "scanType": "BASIC",
      "errorMessage": null,
      "createdAt": "2023-12-07T10:30:00.000Z",
      "updatedAt": "2023-12-07T10:35:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### 5. Get User Profile

Retrieve the authenticated user's profile information.

**Endpoint:** `GET /api/user`

**Authentication:** Required

**Response Format:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string | null",
  "image": "string | null",
  "tier": "string",
  "credits": "number",
  "totalScans": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Status Codes:**
- `200`: User profile retrieved successfully
- `401`: Unauthorized
- `404`: User not found
- `500`: Internal server error

**Example Request:**
```bash
curl -X GET https://your-domain.com/api/user \
  -H "Cookie: next-auth.session-token=your-session-token"
```

**Example Response:**
```json
{
  "id": "clpx1a2b30000xyz789abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://example.com/avatar.jpg",
  "tier": "FREE",
  "credits": 5,
  "totalScans": 12,
  "createdAt": "2023-11-01T08:00:00.000Z",
  "updatedAt": "2023-12-07T10:30:00.000Z"
}
```

---

### 6. Update User Profile

Update the authenticated user's profile information.

**Endpoint:** `PATCH /api/user`

**Authentication:** Required

**Request Body Schema:**
```json
{
  "name": "string (required, 1-100 characters)"
}
```

**Response Format:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "image": "string | null",
  "tier": "string",
  "credits": "number",
  "totalScans": "number",
  "createdAt": "string",
  "updatedAt": "string"
}
```

**Status Codes:**
- `200`: User profile updated successfully
- `400`: Invalid request data
- `401`: Unauthorized
- `500`: Internal server error

**Example Request:**
```bash
curl -X PATCH https://your-domain.com/api/user \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{
    "name": "Jane Smith"
  }'
```

**Example Response:**
```json
{
  "id": "clpx1a2b30000xyz789abc123",
  "email": "user@example.com",
  "name": "Jane Smith",
  "image": "https://example.com/avatar.jpg",
  "tier": "FREE",
  "credits": 5,
  "totalScans": 12,
  "createdAt": "2023-11-01T08:00:00.000Z",
  "updatedAt": "2023-12-07T10:45:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid data",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Name is required",
      "path": ["name"]
    }
  ]
}
```

---

### 7. Authentication Endpoints

Handle user authentication via NextAuth.js.

**Endpoint:** `GET/POST /api/auth/[...nextauth]`

**Authentication:** Handled by NextAuth.js

**Description:**
These endpoints are managed by NextAuth.js and handle:
- OAuth provider callbacks
- Session management
- Sign in/out operations
- JWT token handling

**Usage:**
Refer to NextAuth.js documentation for integration details. The application supports OAuth providers configured in the auth configuration.

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message",
  "details": "Optional additional details"
}
```

### Common Error Codes

- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication
- `402`: Payment Required - Insufficient credits
- `403`: Forbidden - Access denied
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server-side error

### Validation Errors

Validation errors include detailed information about which fields failed validation:

```json
{
  "error": "Invalid request data",
  "details": [
    {
      "field": "domain",
      "message": "Please enter a valid domain name (e.g., example.com)"
    }
  ]
}
```

---

## Domain Validation

Domains are automatically cleaned and validated:

1. **Cleaning Process:**
   - Remove protocol (http://, https://)
   - Remove paths and query parameters
   - Convert to lowercase
   - Trim whitespace

2. **Validation Rules:**
   - Must be a valid domain format
   - Supports subdomains
   - Does not support IP addresses
   - Minimum 1 character, properly formatted

3. **Examples:**
   - `https://example.com/path` → `example.com`
   - `EXAMPLE.COM` → `example.com`
   - `sub.example.com` → `sub.example.com` (valid)

---

## Scan Types and Results

### Basic Scans (Vulnerability)
- **Credit Cost:** 1
- **Results:** Security score, vulnerabilities, basic security headers

### Advanced Scans (SSL, DNS, Port)
- **Credit Cost:** 1
- **Results:** Detailed SSL information, DNS records, open ports, comprehensive security analysis

### Scan Status Flow
1. `PENDING` - Scan created, waiting to start
2. `RUNNING` - Scan in progress
3. `COMPLETED` - Scan finished successfully
4. `FAILED` - Scan encountered errors

---

## Best Practices

1. **Polling for Results:** Use the scan ID to poll `/api/scan/{id}` for status updates
2. **Credit Management:** Check user credits before initiating scans
3. **Error Handling:** Implement proper error handling for all status codes
4. **Rate Limiting:** Avoid excessive API calls; implement client-side throttling
5. **Domain Format:** Ensure domains are properly formatted before submission

---

## SDK and Integration Examples

### JavaScript/TypeScript Example

```typescript
// Create a scan
const response = await fetch('/api/scan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    domain: 'example.com',
    scanType: 'vulnerability'
  }),
  credentials: 'include' // Include session cookies
});

const scan = await response.json();

// Poll for results
const pollScan = async (scanId: string) => {
  const response = await fetch(`/api/scan/${scanId}`, {
    credentials: 'include'
  });
  const result = await response.json();

  if (result.status === 'COMPLETED') {
    return result;
  } else if (result.status === 'FAILED') {
    throw new Error(result.errorMessage);
  } else {
    // Continue polling
    await new Promise(resolve => setTimeout(resolve, 5000));
    return pollScan(scanId);
  }
};
```