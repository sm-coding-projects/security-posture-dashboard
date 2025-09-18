'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Bell,
  BellOff,
  Mail,
  Settings,
  Filter,
  Search,
  Clock,
  Shield,
  Eye,
  Trash2,
  Plus
} from 'lucide-react'

interface Alert {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'security' | 'ssl' | 'dns' | 'performance' | 'compliance'
  domain: string
  scanId: string
  isRead: boolean
  createdAt: string
  resolvedAt?: string
}

interface NotificationSettings {
  emailAlerts: boolean
  pushNotifications: boolean
  securityAlerts: boolean
  sslExpirationAlerts: boolean
  scanCompletionAlerts: boolean
  weeklyReports: boolean
}

const SEVERITY_CONFIG = {
  low: {
    label: 'Low',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Info
  },
  medium: {
    label: 'Medium',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertTriangle
  },
  high: {
    label: 'High',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: AlertTriangle
  },
  critical: {
    label: 'Critical',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  }
}

const TYPE_CONFIG = {
  security: { label: 'Security', icon: Shield },
  ssl: { label: 'SSL', icon: CheckCircle },
  dns: { label: 'DNS', icon: Info },
  performance: { label: 'Performance', icon: Clock },
  compliance: { label: 'Compliance', icon: CheckCircle }
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailAlerts: true,
    pushNotifications: false,
    securityAlerts: true,
    sslExpirationAlerts: true,
    scanCompletionAlerts: false,
    weeklyReports: true
  })

  useEffect(() => {
    // Mock alerts data
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: 'SSL Certificate Expiring Soon',
        description: 'The SSL certificate for example.com will expire in 30 days',
        severity: 'medium',
        type: 'ssl',
        domain: 'example.com',
        scanId: 'scan_123',
        isRead: false,
        createdAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Security Headers Missing',
        description: 'Critical security headers not found: X-Frame-Options, Content-Security-Policy',
        severity: 'high',
        type: 'security',
        domain: 'test.org',
        scanId: 'scan_124',
        isRead: true,
        createdAt: '2024-01-14T09:15:00Z'
      },
      {
        id: '3',
        title: 'Vulnerable TLS Configuration',
        description: 'Weak cipher suites detected. Consider updating TLS configuration.',
        severity: 'critical',
        type: 'security',
        domain: 'demo.net',
        scanId: 'scan_125',
        isRead: false,
        createdAt: '2024-01-13T14:45:00Z'
      },
      {
        id: '4',
        title: 'DNS Records Updated',
        description: 'DNS configuration has been successfully updated and verified',
        severity: 'low',
        type: 'dns',
        domain: 'example.com',
        scanId: 'scan_126',
        isRead: true,
        createdAt: '2024-01-12T16:20:00Z',
        resolvedAt: '2024-01-12T16:22:00Z'
      }
    ]

    setTimeout(() => {
      setAlerts(mockAlerts)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    let filtered = alerts

    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.domain.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter)
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.type === typeFilter)
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'unread') {
        filtered = filtered.filter(alert => !alert.isRead)
      } else if (statusFilter === 'resolved') {
        filtered = filtered.filter(alert => alert.resolvedAt)
      } else if (statusFilter === 'active') {
        filtered = filtered.filter(alert => !alert.resolvedAt)
      }
    }

    setFilteredAlerts(filtered)
  }, [alerts, searchTerm, severityFilter, typeFilter, statusFilter])

  const unreadCount = alerts.filter(alert => !alert.isRead).length
  const criticalCount = alerts.filter(alert => alert.severity === 'critical' && !alert.resolvedAt).length

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ))
  }

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })))
  }

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const updateNotificationSettings = (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const SeverityBadge = ({ severity }: { severity: string }) => {
    const config = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG]
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const TypeBadge = ({ type }: { type: string }) => {
    const config = TYPE_CONFIG[type as keyof typeof TYPE_CONFIG]
    const Icon = config.icon

    return (
      <Badge variant="outline">
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Alerts</h1>
          <p className="text-muted-foreground">
            Monitor and manage security alerts for your domains
          </p>
        </div>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">
              All time alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <BellOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">
              High priority issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.resolvedAt).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                    <SelectItem value="dns">DNS</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading alerts...</p>
                </CardContent>
              </Card>
            ) : filteredAlerts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No alerts found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || severityFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all'
                      ? 'No alerts match your current filters.'
                      : 'You don\'t have any security alerts yet. This is good news!'
                    }
                  </p>
                  <Link href="/dashboard/scan/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Run Security Scan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map((alert) => (
                <Card key={alert.id} className={`transition-all ${!alert.isRead ? 'ring-2 ring-primary/20' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={`font-medium ${!alert.isRead ? 'font-semibold' : ''}`}>
                            {alert.title}
                          </h3>
                          {!alert.isRead && <Badge variant="secondary">New</Badge>}
                        </div>
                        <p className="text-muted-foreground mb-3">{alert.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {alert.domain}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(alert.createdAt)}
                          </span>
                          {alert.resolvedAt && (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              Resolved {formatDate(alert.resolvedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 ml-4">
                        <SeverityBadge severity={alert.severity} />
                        <TypeBadge type={alert.type} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Link href={`/dashboard/scan/${alert.scanId}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Scan
                        </Button>
                      </Link>
                      {!alert.isRead && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how and when you receive security alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-alerts" className="text-base font-medium">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={notificationSettings.emailAlerts}
                    onCheckedChange={(checked) => updateNotificationSettings('emailAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => updateNotificationSettings('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="security-alerts" className="text-base font-medium">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">Critical security vulnerabilities</p>
                  </div>
                  <Switch
                    id="security-alerts"
                    checked={notificationSettings.securityAlerts}
                    onCheckedChange={(checked) => updateNotificationSettings('securityAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ssl-expiration" className="text-base font-medium">SSL Expiration Alerts</Label>
                    <p className="text-sm text-muted-foreground">SSL certificate expiration warnings</p>
                  </div>
                  <Switch
                    id="ssl-expiration"
                    checked={notificationSettings.sslExpirationAlerts}
                    onCheckedChange={(checked) => updateNotificationSettings('sslExpirationAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="scan-completion" className="text-base font-medium">Scan Completion</Label>
                    <p className="text-sm text-muted-foreground">When security scans complete</p>
                  </div>
                  <Switch
                    id="scan-completion"
                    checked={notificationSettings.scanCompletionAlerts}
                    onCheckedChange={(checked) => updateNotificationSettings('scanCompletionAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-reports" className="text-base font-medium">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">Weekly security summary reports</p>
                  </div>
                  <Switch
                    id="weekly-reports"
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => updateNotificationSettings('weeklyReports', checked)}
                  />
                </div>
              </div>

              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}