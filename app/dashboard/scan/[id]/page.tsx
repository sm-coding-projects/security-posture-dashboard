interface ScanDetailPageProps {
  params: {
    id: string
  }
}

export default function ScanDetailPage({ params }: ScanDetailPageProps) {
  const { id } = params

  // Mock scan data
  const mockScan = {
    id,
    domain: 'example.com',
    status: 'completed',
    score: 85,
    createdAt: '2024-01-15T10:30:00Z',
    completedAt: '2024-01-15T10:35:00Z',
    results: {
      ssl: {
        score: 90,
        issues: ['Weak cipher suite detected'],
        certificate: {
          issuer: 'Let\'s Encrypt',
          expires: '2024-06-15',
          valid: true
        }
      },
      security: {
        score: 75,
        issues: ['Missing X-Frame-Options header', 'CSP not implemented'],
        headers: {
          'X-Frame-Options': 'Missing',
          'Content-Security-Policy': 'Missing',
          'X-Content-Type-Options': 'Present'
        }
      },
      dns: {
        score: 95,
        issues: [],
        records: {
          SPF: 'Present',
          DKIM: 'Present', 
          DMARC: 'Present'
        }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan Results</h1>
          <p className="text-muted-foreground">
            Security assessment for {mockScan.domain}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
            Download Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Rescan
          </button>
        </div>
      </div>

      {/* Overall Score */}
      <div className="rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Overall Security Score</h2>
          <span className={`text-3xl font-bold ${
            mockScan.score >= 80 ? 'text-green-600' :
            mockScan.score >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {mockScan.score}/100
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${
              mockScan.score >= 80 ? 'bg-green-600' :
              mockScan.score >= 60 ? 'bg-yellow-600' :
              'bg-red-600'
            }`}
            style={{ width: `${mockScan.score}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Scanned on {new Date(mockScan.completedAt || mockScan.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Detailed Results */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* SSL/TLS */}
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">SSL/TLS</h3>
            <span className="text-xl font-bold text-green-600">
              {mockScan.results.ssl.score}/100
            </span>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Certificate:</span>
              <span className="ml-2">{mockScan.results.ssl.certificate.issuer}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Expires:</span>
              <span className="ml-2">{mockScan.results.ssl.certificate.expires}</span>
            </div>
            {mockScan.results.ssl.issues.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-600 mb-1">Issues:</p>
                {mockScan.results.ssl.issues.map((issue, i) => (
                  <p key={i} className="text-sm text-red-600">• {issue}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Security Headers */}
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Security Headers</h3>
            <span className="text-xl font-bold text-yellow-600">
              {mockScan.results.security.score}/100
            </span>
          </div>
          <div className="space-y-2">
            {Object.entries(mockScan.results.security.headers).map(([header, status]) => (
              <div key={header} className="text-sm flex justify-between">
                <span className="text-muted-foreground">{header}:</span>
                <span className={status === 'Present' ? 'text-green-600' : 'text-red-600'}>
                  {status}
                </span>
              </div>
            ))}
            {mockScan.results.security.issues.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-red-600 mb-1">Issues:</p>
                {mockScan.results.security.issues.map((issue, i) => (
                  <p key={i} className="text-sm text-red-600">• {issue}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DNS Configuration */}
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">DNS Configuration</h3>
            <span className="text-xl font-bold text-green-600">
              {mockScan.results.dns.score}/100
            </span>
          </div>
          <div className="space-y-2">
            {Object.entries(mockScan.results.dns.records).map(([record, status]) => (
              <div key={record} className="text-sm flex justify-between">
                <span className="text-muted-foreground">{record}:</span>
                <span className={status === 'Present' ? 'text-green-600' : 'text-red-600'}>
                  {status}
                </span>
              </div>
            ))}
            {mockScan.results.dns.issues.length === 0 && (
              <p className="text-sm text-green-600 mt-3">✓ No issues found</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
        <div className="space-y-3">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-medium text-yellow-800">High Priority</h4>
            <p className="text-sm text-yellow-700">Implement Content Security Policy (CSP) headers to prevent XSS attacks.</p>
          </div>
          <div className="p-3 bg-orange-50 border border-orange-200 rounded">
            <h4 className="font-medium text-orange-800">Medium Priority</h4>
            <p className="text-sm text-orange-700">Add X-Frame-Options header to prevent clickjacking attacks.</p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-medium text-blue-800">Low Priority</h4>
            <p className="text-sm text-blue-700">Consider upgrading TLS cipher suites for better security.</p>
          </div>
        </div>
      </div>
    </div>
  )
}