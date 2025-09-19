export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your security posture.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Total Scans</h3>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Across all domains</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Average Score</h3>
          <div className="text-2xl font-bold">--</div>
          <p className="text-xs text-muted-foreground">Security rating</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Credits Remaining</h3>
          <div className="text-2xl font-bold">100</div>
          <p className="text-xs text-muted-foreground">Free tier</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Active Monitors</h3>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">Monitoring domains</p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
        <p className="text-muted-foreground">
          Get started by running your first security scan. Navigate to the Scan section to begin.
        </p>
      </div>
    </div>
  )
}