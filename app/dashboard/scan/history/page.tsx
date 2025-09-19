export default function ScanHistoryPage() {
  const mockScans = [
    {
      id: '1',
      domain: 'example.com',
      status: 'completed',
      score: 85,
      createdAt: '2024-01-15T10:30:00Z',
      completedAt: '2024-01-15T10:35:00Z'
    },
    {
      id: '2', 
      domain: 'test.org',
      status: 'completed',
      score: 72,
      createdAt: '2024-01-14T09:15:00Z',
      completedAt: '2024-01-14T09:22:00Z'
    },
    {
      id: '3',
      domain: 'demo.net',
      status: 'running',
      score: null,
      createdAt: '2024-01-16T08:00:00Z',
      completedAt: null
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
        <p className="text-muted-foreground">
          View and manage your previous security scans
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Total Scans</h3>
          <div className="text-2xl font-bold">{mockScans.length}</div>
          <p className="text-xs text-muted-foreground">All time</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">This Month</h3>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">Scans completed</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Average Score</h3>
          <div className="text-2xl font-bold">78</div>
          <p className="text-xs text-muted-foreground">Security rating</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Running</h3>
          <div className="text-2xl font-bold">1</div>
          <p className="text-xs text-muted-foreground">In progress</p>
        </div>
      </div>

      <div className="rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Scans</h2>
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
                        {scan.score}/100
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Started: {new Date(scan.createdAt).toLocaleDateString()}
                    {scan.completedAt && (
                      <span> • Completed: {new Date(scan.completedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                    View Results
                  </button>
                  {scan.status === 'completed' && (
                    <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                      Download Report
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