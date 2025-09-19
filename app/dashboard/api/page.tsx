export default function APIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
        <p className="text-muted-foreground">
          Integrate security scanning into your workflow with our RESTful API
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Authentication</h2>
          <p className="text-muted-foreground mb-4">
            All API requests require authentication using API keys. Include your API key in the Authorization header.
          </p>
          <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
            Authorization: Bearer YOUR_API_KEY
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Endpoints</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                <span className="font-mono">/api/scans</span>
              </div>
              <p className="text-muted-foreground text-sm">Retrieve all security scans</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</span>
                <span className="font-mono">/api/scan</span>
              </div>
              <p className="text-muted-foreground text-sm">Start a new security scan</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono">GET</span>
                <span className="font-mono">/api/scan/[id]</span>
              </div>
              <p className="text-muted-foreground text-sm">Get scan results by ID</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}