import Link from 'next/link'

export default function ScansPage() {
  const mockScans = [
    {
      id: 'scan_123',
      domain: 'example.com',
      status: 'completed',
      score: 85,
      issues: 3,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'scan_124',
      domain: 'test.org',
      status: 'completed', 
      score: 72,
      issues: 7,
      createdAt: '2024-01-14T09:15:00Z'
    },
    {
      id: 'scan_125',
      domain: 'demo.net',
      status: 'running',
      score: null,
      issues: null,
      createdAt: '2024-01-16T08:00:00Z'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Scans</h1>
          <p className="text-muted-foreground">
            Manage and monitor your security scans
          </p>
        </div>
        <Link href="/dashboard/scan/new">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            New Scan
          </button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Total Scans</h3>
          <div className="text-2xl font-bold">{mockScans.length}</div>
          <p className="text-xs text-muted-foreground">All domains</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Active Scans</h3>
          <div className="text-2xl font-bold">
            {mockScans.filter(s => s.status === 'running').length}
          </div>
          <p className="text-xs text-muted-foreground">In progress</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Average Score</h3>
          <div className="text-2xl font-bold">78</div>
          <p className="text-xs text-muted-foreground">Security rating</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Issues Found</h3>
          <div className="text-2xl font-bold text-red-600">10</div>
          <p className="text-xs text-muted-foreground">Require attention</p>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">All Scans</h2>
        </div>
        <div className="divide-y">
          {mockScans.map((scan) => (
            <div key={scan.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{scan.domain}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      scan.status === 'completed' ? 'bg-green-100 text-green-800' :
                      scan.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {scan.status}
                    </span>
                    {scan.score && (
                      <span className={`font-semibold ${
                        scan.score >= 80 ? 'text-green-600' :
                        scan.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Score: {scan.score}/100
                      </span>
                    )}
                    {scan.issues && (
                      <span className="text-red-600 text-sm">
                        {scan.issues} issues
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Created: {new Date(scan.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/scan/${scan.id}`}>
                    <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                      View Details
                    </button>
                  </Link>
                  {scan.status === 'completed' && (
                    <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 border border-blue-200 rounded">
                      Rescan
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}