'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  TrendingUp,
  CreditCard,
  Activity,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import type { User, ScanSummary, ScanStatus, SecurityMetrics } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface DashboardStats {
  user: User
  recentScans: ScanSummary[]
  securityMetrics: SecurityMetrics
  creditsRemaining: number
  activeMonitors: number
}

interface QuickScanFormData {
  domain: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [scanFormData, setScanFormData] = useState<QuickScanFormData>({ domain: '' })
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const [userResponse, scansResponse] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/scans?limit=5')
      ])

      if (!userResponse.ok || !scansResponse.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const user = await userResponse.json()
      const scansData = await scansResponse.json()

      const securityMetrics: SecurityMetrics = {
        totalScans: user.totalScans || 0,
        averageScore: calculateAverageScore(scansData.scans),
        gradeDistribution: calculateGradeDistribution(scansData.scans),
        vulnerabilityCount: 0,
        criticalIssues: 0,
        lastScanDate: scansData.scans[0]?.createdAt ? new Date(scansData.scans[0].createdAt) : null
      }

      const dashboardStats: DashboardStats = {
        user,
        recentScans: scansData.scans.map((scan: any) => ({
          ...scan,
          createdAt: new Date(scan.createdAt),
          completedAt: scan.completedAt ? new Date(scan.completedAt) : null
        })),
        securityMetrics,
        creditsRemaining: user.credits,
        activeMonitors: 0
      }

      setStats(dashboardStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const calculateAverageScore = (scans: any[]): number => {
    const completedScans = scans.filter(scan => scan.securityScore !== null)
    if (completedScans.length === 0) return 0
    const sum = completedScans.reduce((acc, scan) => acc + (scan.securityScore || 0), 0)
    return Math.round(sum / completedScans.length)
  }

  const calculateGradeDistribution = (scans: any[]): Record<string, number> => {
    const distribution: Record<string, number> = {}
    scans.forEach(scan => {
      if (scan.sslGrade) {
        distribution[scan.sslGrade] = (distribution[scan.sslGrade] || 0) + 1
      }
    })
    return distribution
  }

  const getScoreColor = (score: number | null): string => {
    if (score === null) return 'text-gray-500'
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number | null) => {
    if (score === null) return <Clock className="h-4 w-4 text-gray-500" />
    if (score >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (score >= 70) return <Shield className="h-4 w-4 text-yellow-600" />
    if (score >= 50) return <AlertTriangle className="h-4 w-4 text-orange-600" />
    return <XCircle className="h-4 w-4 text-red-600" />
  }

  const getStatusBadge = (status: ScanStatus) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, text: 'Pending' },
      RUNNING: { variant: 'default' as const, text: 'Running' },
      COMPLETED: { variant: 'success' as const, text: 'Completed' },
      FAILED: { variant: 'destructive' as const, text: 'Failed' },
      CANCELLED: { variant: 'secondary' as const, text: 'Cancelled' }
    }

    const config = statusConfig[status] || statusConfig.PENDING
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  const handleQuickScan = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!scanFormData.domain.trim()) {
      setError('Please enter a domain')
      return
    }

    setIsScanning(true)
    setError(null)

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: scanFormData.domain.trim(),
          scanType: 'vulnerability'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start scan')
      }

      const scanResult = await response.json()

      setScanFormData({ domain: '' })

      router.push(`/scan/${scanResult.scanId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start scan')
    } finally {
      setIsScanning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={fetchDashboardStats} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your security posture.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.securityMetrics.totalScans}</div>
            <p className="text-xs text-muted-foreground">
              Across all domains
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(stats.securityMetrics.averageScore)}`}>
              {stats.securityMetrics.averageScore || '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Security rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.creditsRemaining}</div>
            <p className="text-xs text-muted-foreground">
              {stats.user.tier} tier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Monitors</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMonitors}</div>
            <p className="text-xs text-muted-foreground">
              Monitoring domains
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Scan */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Scan</CardTitle>
            <CardDescription>
              Start a security scan for any domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuickScan} className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter domain (e.g., example.com)"
                  value={scanFormData.domain}
                  onChange={(e) => setScanFormData({ domain: e.target.value })}
                  disabled={isScanning}
                />
                <Button type="submit" disabled={isScanning}>
                  {isScanning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {isScanning ? 'Scanning...' : 'Scan'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>
              Your latest security scans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentScans.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No scans yet</p>
                  <p className="text-sm">Start your first scan above</p>
                </div>
              ) : (
                stats.recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/scan/${scan.id}`)}
                  >
                    <div className="flex items-center space-x-3">
                      {getScoreIcon(scan.securityScore)}
                      <div>
                        <p className="font-medium">{scan.domain}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{formatDistanceToNow(scan.createdAt, { addSuffix: true })}</span>
                          {scan.sslGrade && (
                            <>
                              <span>•</span>
                              <span>Grade {scan.sslGrade}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {scan.securityScore !== null && (
                        <span className={`text-sm font-medium ${getScoreColor(scan.securityScore)}`}>
                          {scan.securityScore}
                        </span>
                      )}
                      {getStatusBadge(scan.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
            {stats.recentScans.length > 0 && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/scans')}
                >
                  View All Scans
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}