export default function AlertsPage() {
  const mockAlerts = [
    {
      id: '1',
      title: 'SSL Certificate Expiring Soon',
      description: 'The SSL certificate for example.com will expire in 30 days',
      severity: 'medium',
      type: 'ssl',
      domain: 'example.com',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Security Headers Missing',
      description: 'Critical security headers not found: X-Frame-Options, Content-Security-Policy',
      severity: 'high',
      type: 'security',
      domain: 'test.org',
      createdAt: '2024-01-14T09:15:00Z'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Alerts</h1>
        <p className="text-muted-foreground">
          Monitor and manage security alerts for your domains
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Total Alerts</h3>
          <div className="text-2xl font-bold">{mockAlerts.length}</div>
          <p className="text-xs text-muted-foreground">All time alerts</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Unread</h3>
          <div className="text-2xl font-bold text-orange-600">1</div>
          <p className="text-xs text-muted-foreground">Require attention</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Critical</h3>
          <div className="text-2xl font-bold text-red-600">0</div>
          <p className="text-xs text-muted-foreground">High priority issues</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm font-medium">Resolved</h3>
          <div className="text-2xl font-bold text-green-600">5</div>
          <p className="text-xs text-muted-foreground">Successfully resolved</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockAlerts.map((alert) => (
          <div key={alert.id} className="rounded-lg border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium mb-2">{alert.title}</h3>
                <p className="text-muted-foreground mb-3">{alert.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Domain: {alert.domain}</span>
                  <span>Type: {alert.type}</span>
                  <span>Severity: {alert.severity}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}