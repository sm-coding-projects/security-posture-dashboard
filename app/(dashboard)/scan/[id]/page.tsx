'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { Gauge } from '@/components/ui/gauge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePolling } from '@/hooks/usePolling'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Shield,
  Globe,
  Lock,
  FileText,
  ExternalLink,
  Calendar,
  Timer,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react'
import { Scan, ScanStatus, SSLVulnerability } from '@/types'

interface ScanResultsPageProps {}

export default function ScanResultsPage({}: ScanResultsPageProps) {
  const router = useRouter()
  const params = useParams()
  const scanId = params.id as string

  const [scan, setScan] = useState<Scan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  const fetchScanData = useCallback(async () => {
    try {
      const response = await fetch(`/api/scan/${scanId}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Scan not found')
        }
        if (response.status === 403) {
          throw new Error('Access denied')
        }
        throw new Error('Failed to fetch scan data')
      }

      const scanData: Scan = await response.json()
      setScan(scanData)
      setError(null)

      // Stop polling if scan is completed or failed
      if (scanData.status === ScanStatus.COMPLETED ||
          scanData.status === ScanStatus.FAILED ||
          scanData.status === ScanStatus.CANCELLED) {
        return false // Signal to stop polling
      }

      return true // Continue polling
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false // Stop polling on error
    } finally {
      setLoading(false)
    }
  }, [scanId])

  // Polling setup
  const shouldPoll = scan?.status === ScanStatus.RUNNING || scan?.status === ScanStatus.PENDING

  usePolling(fetchScanData, {
    enabled: shouldPoll,
    interval: 3000,
    immediate: true
  })

  const handleScanAgain = async () => {
    if (!scan) return

    setScanning(true)
    try {
      const response = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: scan.domain,
          scanType: scan.scanType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to start new scan')
      }

      const { scanId: newScanId } = await response.json()
      router.push(`/scan/${newScanId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start new scan')
    } finally {
      setScanning(false)
    }
  }

  const getStatusIcon = (status: ScanStatus) => {
    switch (status) {
      case ScanStatus.COMPLETED:
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case ScanStatus.RUNNING:
      case ScanStatus.PENDING:
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
      case ScanStatus.FAILED:
      case ScanStatus.CANCELLED:
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: ScanStatus) => {
    switch (status) {
      case ScanStatus.COMPLETED:
        return 'default'
      case ScanStatus.RUNNING:
      case ScanStatus.PENDING:
        return 'secondary'
      case ScanStatus.FAILED:
      case ScanStatus.CANCELLED:
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getSSLGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'B':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'C':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'D':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'F':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString()
  }

  const formatDuration = (start: Date | string, end?: Date | string | null) => {
    const startTime = new Date(start).getTime()
    const endTime = end ? new Date(end).getTime() : Date.now()
    const duration = Math.round((endTime - startTime) / 1000)

    if (duration < 60) return `${duration}s`
    if (duration < 3600) return `${Math.round(duration / 60)}m ${duration % 60}s`
    return `${Math.round(duration / 3600)}h ${Math.round((duration % 3600) / 60)}m`
  }

  if (loading && !scan) {
    return <ScanResultsSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Scan</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => router.push('/scan')}>
                Back to Scan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!scan) {
    return null
  }

  const isRunning = scan.status === ScanStatus.RUNNING || scan.status === ScanStatus.PENDING
  const isCompleted = scan.status === ScanStatus.COMPLETED
  const hasFailed = scan.status === ScanStatus.FAILED || scan.status === ScanStatus.CANCELLED

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8" />
            Security Scan Results
          </h1>
          <p className="text-muted-foreground mt-1">
            {scan.domain} • {formatDate(scan.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isCompleted && (
            <Button
              onClick={handleScanAgain}
              disabled={scanning}
              variant="outline"
              className="flex items-center gap-2"
            >
              {scanning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Scan Again
            </Button>
          )}
          <Badge variant={getStatusBadgeVariant(scan.status)} className="flex items-center gap-2">
            {getStatusIcon(scan.status)}
            {scan.status}
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Security Score */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {isCompleted && scan.securityScore !== null ? (
              <Gauge
                value={scan.securityScore}
                size="lg"
                label="Overall Security"
              />
            ) : isRunning ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Calculating...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">Not available</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SSL Grade */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              SSL Grade
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {isCompleted && scan.sslGrade ? (
              <div className={`text-6xl font-bold px-6 py-4 rounded-lg border-2 ${getSSLGradeColor(scan.sslGrade)}`}>
                {scan.sslGrade}
              </div>
            ) : isRunning ? (
              <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-20 w-20 rounded-lg" />
                <span className="text-sm text-muted-foreground">Analyzing SSL...</span>
              </div>
            ) : (
              <div className="text-2xl text-muted-foreground">N/A</div>
            )}
          </CardContent>
        </Card>

        {/* Scan Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Scan Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Type:</span>
              <Badge variant="outline">{scan.scanType}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Credits Used:</span>
              <span className="text-sm font-medium">{scan.creditsUsed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Duration:</span>
              <span className="text-sm font-medium">
                {formatDuration(scan.createdAt, scan.completedAt)}
              </span>
            </div>
            {scan.completedAt && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Completed:</span>
                <span className="text-sm font-medium">{formatDate(scan.completedAt)}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Running State */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold">Scan in Progress</h3>
                <p className="text-muted-foreground">
                  We're analyzing your domain's security posture. This may take a few minutes.
                </p>
              </div>
              <Progress value={undefined} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Failed State */}
      {hasFailed && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold">Scan Failed</h3>
                <p className="text-muted-foreground">
                  {scan.errorMessage || 'The scan could not be completed. Please try again.'}
                </p>
              </div>
              <Button onClick={handleScanAgain} disabled={scanning}>
                {scanning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results - Only show when completed */}
      {isCompleted && (
        <Tabs defaultValue="ssl" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ssl" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              SSL/TLS
            </TabsTrigger>
            <TabsTrigger value="headers" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Headers
            </TabsTrigger>
            <TabsTrigger value="dns" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              DNS Configuration
            </TabsTrigger>
          </TabsList>

          {/* SSL/TLS Tab */}
          <TabsContent value="ssl" className="space-y-6">
            {scan.sslDetails ? (
              <>
                {/* SSL Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>SSL/TLS Overview</CardTitle>
                    <CardDescription>
                      Certificate and protocol analysis results
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="font-medium">Certificate Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Common Name:</span>
                            <span className="font-medium">{scan.sslDetails.certificate.commonName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Issuer:</span>
                            <span className="font-medium">{scan.sslDetails.certificate.issuer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valid Until:</span>
                            <span className="font-medium">{formatDate(scan.sslDetails.certificate.validTo)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Key Size:</span>
                            <span className="font-medium">{scan.sslDetails.certificate.keySize} bits</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Security Features</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">HSTS:</span>
                            <Badge variant={scan.sslDetails.hsts ? 'default' : 'destructive'}>
                              {scan.sslDetails.hsts ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">OCSP Stapling:</span>
                            <Badge variant={scan.sslDetails.ocspStapling ? 'default' : 'secondary'}>
                              {scan.sslDetails.ocspStapling ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SSL Vulnerabilities */}
                {scan.sslDetails.vulnerabilities.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        SSL/TLS Vulnerabilities
                      </CardTitle>
                      <CardDescription>
                        Security issues found in SSL/TLS configuration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {scan.sslDetails.vulnerabilities.map((vuln, index) => (
                          <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(vuln.severity)}`}>
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium">{vuln.name}</h4>
                              <Badge variant="outline" className={getSeverityColor(vuln.severity)}>
                                {vuln.severity}
                              </Badge>
                            </div>
                            <p className="text-sm mb-3">{vuln.description}</p>
                            {vuln.cve && (
                              <p className="text-xs text-muted-foreground mb-2">CVE: {vuln.cve}</p>
                            )}
                            <div className="text-sm">
                              <strong>Recommendation:</strong> {vuln.recommendation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* SSL Protocols */}
                <Card>
                  <CardHeader>
                    <CardTitle>Supported Protocols</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {scan.sslDetails.protocols.map((protocol, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{protocol.name} {protocol.version}</span>
                            <Badge variant={protocol.secure ? 'default' : 'destructive'}>
                              {protocol.secure ? 'Secure' : 'Insecure'}
                            </Badge>
                          </div>
                          <Badge variant={protocol.enabled ? 'default' : 'secondary'}>
                            {protocol.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No SSL/TLS data available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Security Headers Tab */}
          <TabsContent value="headers" className="space-y-6">
            {scan.headersDetails ? (
              <Card>
                <CardHeader>
                  <CardTitle>Security Headers Analysis</CardTitle>
                  <CardDescription>
                    HTTP security headers configuration and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(scan.headersDetails.headers).map(([headerName, info]) => (
                      <div key={headerName} className="p-4 rounded-lg border">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium capitalize">
                            {headerName.replace(/-/g, ' ')}
                          </h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={info.present ? 'default' : 'destructive'}>
                              {info.present ? 'Present' : 'Missing'}
                            </Badge>
                            <div className="text-sm font-medium">
                              Score: {info.score}/100
                            </div>
                          </div>
                        </div>
                        {info.value && (
                          <p className="text-sm text-muted-foreground mb-2 font-mono">
                            {info.value}
                          </p>
                        )}
                        <div className="text-sm">
                          <strong>Recommendation:</strong> {info.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No security headers data available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* DNS Configuration Tab */}
          <TabsContent value="dns" className="space-y-6">
            {scan.dnsDetails ? (
              <>
                {/* Email Security */}
                <Card>
                  <CardHeader>
                    <CardTitle>Email Security</CardTitle>
                    <CardDescription>
                      SPF, DMARC, and DKIM configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* SPF */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">SPF (Sender Policy Framework)</h4>
                        <Badge variant={scan.dnsDetails.emailSecurity.spf.valid ? 'default' : 'destructive'}>
                          {scan.dnsDetails.emailSecurity.spf.valid ? 'Valid' : 'Invalid'}
                        </Badge>
                      </div>
                      {scan.dnsDetails.emailSecurity.spf.record && (
                        <p className="text-sm font-mono mb-2 p-2 bg-muted rounded">
                          {scan.dnsDetails.emailSecurity.spf.record}
                        </p>
                      )}
                      {scan.dnsDetails.emailSecurity.spf.mechanisms.length > 0 && (
                        <div className="text-sm">
                          <strong>Mechanisms:</strong> {scan.dnsDetails.emailSecurity.spf.mechanisms.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* DMARC */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">DMARC</h4>
                        <Badge variant={scan.dnsDetails.emailSecurity.dmarc.valid ? 'default' : 'destructive'}>
                          {scan.dnsDetails.emailSecurity.dmarc.valid ? 'Valid' : 'Invalid'}
                        </Badge>
                      </div>
                      {scan.dnsDetails.emailSecurity.dmarc.record && (
                        <p className="text-sm font-mono mb-2 p-2 bg-muted rounded">
                          {scan.dnsDetails.emailSecurity.dmarc.record}
                        </p>
                      )}
                      <div className="text-sm space-y-1">
                        <div><strong>Policy:</strong> {scan.dnsDetails.emailSecurity.dmarc.policy}</div>
                        {scan.dnsDetails.emailSecurity.dmarc.percentage && (
                          <div><strong>Percentage:</strong> {scan.dnsDetails.emailSecurity.dmarc.percentage}%</div>
                        )}
                      </div>
                    </div>

                    {/* DKIM */}
                    <div className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">DKIM</h4>
                        <Badge variant={scan.dnsDetails.emailSecurity.dkim.valid ? 'default' : 'destructive'}>
                          {scan.dnsDetails.emailSecurity.dkim.valid ? 'Valid' : 'Invalid'}
                        </Badge>
                      </div>
                      {scan.dnsDetails.emailSecurity.dkim.keys.length > 0 && (
                        <div className="space-y-2">
                          {scan.dnsDetails.emailSecurity.dkim.keys.map((key, index) => (
                            <div key={index} className="text-sm p-2 bg-muted rounded">
                              <div><strong>Selector:</strong> {key.selector}</div>
                              <div><strong>Valid:</strong> {key.valid ? 'Yes' : 'No'}</div>
                              {key.keySize && <div><strong>Key Size:</strong> {key.keySize} bits</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* DNS Records */}
                <Card>
                  <CardHeader>
                    <CardTitle>DNS Records</CardTitle>
                    <CardDescription>
                      Important DNS configuration details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div>
                        <h4 className="font-medium mb-2">DNSSEC</h4>
                        <Badge variant={scan.dnsDetails.dnssec ? 'default' : 'destructive'}>
                          {scan.dnsDetails.dnssec ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>

                      {scan.dnsDetails.nameservers.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Nameservers</h4>
                          <div className="space-y-1">
                            {scan.dnsDetails.nameservers.map((ns, index) => (
                              <div key={index} className="text-sm font-mono p-2 bg-muted rounded">
                                {ns}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {scan.dnsDetails.mx.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">MX Records</h4>
                          <div className="space-y-1">
                            {scan.dnsDetails.mx.map((mx, index) => (
                              <div key={index} className="text-sm p-2 bg-muted rounded">
                                <strong>{mx.priority}:</strong> {mx.value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {scan.dnsDetails.caa.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">CAA Records</h4>
                          <div className="space-y-1">
                            {scan.dnsDetails.caa.map((caa, index) => (
                              <div key={index} className="text-sm font-mono p-2 bg-muted rounded">
                                {caa.value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">No DNS data available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function ScanResultsSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32 mx-auto" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-32 mx-auto rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}