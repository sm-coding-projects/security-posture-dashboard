export default function CreditsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credits & Usage</h1>
        <p className="text-muted-foreground">
          Manage your scan credits and view usage history
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Available Credits</h3>
          <div className="text-2xl font-bold">100</div>
          <p className="text-xs text-muted-foreground">Free tier</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Used This Month</h3>
          <div className="text-2xl font-bold">25</div>
          <p className="text-xs text-muted-foreground">Out of 100</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Next Reset</h3>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-muted-foreground">Days remaining</p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Usage History</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span>Security scan for example.com</span>
            <span className="text-muted-foreground">-5 credits</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>SSL check for test.org</span>
            <span className="text-muted-foreground">-2 credits</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>DNS analysis for demo.net</span>
            <span className="text-muted-foreground">-3 credits</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Upgrade Plan</h2>
        <p className="text-muted-foreground mb-4">
          Need more credits? Upgrade to a premium plan for unlimited scans.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          View Plans
        </button>
      </div>
    </div>
  )
}