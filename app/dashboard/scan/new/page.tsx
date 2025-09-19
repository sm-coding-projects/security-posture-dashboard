export default function NewScanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Security Scan</h1>
        <p className="text-muted-foreground">
          Start a comprehensive security assessment for your domain
        </p>
      </div>

      <div className="rounded-lg border p-6 max-w-2xl">
        <form className="space-y-6">
          <div>
            <label className="text-sm font-medium block mb-2">Domain or URL</label>
            <input 
              type="url" 
              placeholder="https://example.com"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the domain or URL you want to scan
            </p>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Scan Type</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>SSL/TLS Analysis</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Security Headers</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>DNS Configuration</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Vulnerability Scan</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">Priority</label>
            <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Normal</option>
              <option>High</option>
              <option>Low</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start Scan
            </button>
            <button 
              type="button"
              className="px-6 py-2 border rounded-md hover:bg-gray-50"
            >
              Save as Template
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Scans</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <span className="font-medium">example.com</span>
              <span className="text-muted-foreground ml-2">2 hours ago</span>
            </div>
            <span className="text-green-600 text-sm">Completed</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <div>
              <span className="font-medium">test.org</span>
              <span className="text-muted-foreground ml-2">1 day ago</span>
            </div>
            <span className="text-green-600 text-sm">Completed</span>
          </div>
        </div>
      </div>
    </div>
  )
}