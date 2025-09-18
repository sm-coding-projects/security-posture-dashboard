'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, HelpCircle, Loader2, Shield, Zap } from 'lucide-react'
import { domainSchema } from '@/lib/validators/domain'
import { ScanType } from '@/types'

const SCAN_TYPES = {
  [ScanType.BASIC]: {
    name: 'Basic Scan',
    description: 'Essential security checks including SSL, headers, and basic DNS analysis',
    credits: 1,
    duration: '~2 minutes',
    features: ['SSL Certificate Analysis', 'Security Headers Check', 'Basic DNS Records']
  },
  [ScanType.COMPREHENSIVE]: {
    name: 'Advanced Scan',
    description: 'Comprehensive security analysis with deep vulnerability scanning',
    credits: 3,
    duration: '~5 minutes',
    features: ['Everything in Basic', 'Port Scanning', 'Vulnerability Assessment', 'Email Security Analysis', 'DNSSEC Validation']
  }
}

export default function ScanPage() {
  const router = useRouter()
  const [domain, setDomain] = useState('')
  const [scanType, setScanType] = useState<ScanType>(ScanType.BASIC)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ domain?: string; general?: string }>({})
  const [currentCredits] = useState(25) // TODO: Fetch from user context/API

  const validateDomain = (value: string) => {
    try {
      domainSchema.parse(value)
      setErrors(prev => ({ ...prev, domain: undefined }))
      return true
    } catch (error: any) {
      const message = error.errors?.[0]?.message || 'Invalid domain format'
      setErrors(prev => ({ ...prev, domain: message }))
      return false
    }
  }

  const handleDomainChange = (value: string) => {
    setDomain(value)
    if (value.trim()) {
      validateDomain(value)
    } else {
      setErrors(prev => ({ ...prev, domain: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!domain.trim()) {
      setErrors({ domain: 'Domain is required' })
      return
    }

    if (!validateDomain(domain)) {
      return
    }

    const selectedScanConfig = SCAN_TYPES[scanType]
    if (currentCredits < selectedScanConfig.credits) {
      setErrors({ general: 'Insufficient credits for this scan type' })
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/scans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domain.trim(), scanType })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to start scan')
      }

      const { scanId } = await response.json()
      router.push(`/scan/results/${scanId}`)
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to start scan. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedScanConfig = SCAN_TYPES[scanType]
  const canAffordScan = currentCredits >= selectedScanConfig.credits

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Security Scan</h1>
        <p className="text-muted-foreground">
          Analyze your domain's security posture with comprehensive scanning tools
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Start Security Scan
              </CardTitle>
              <CardDescription>
                Enter a domain to analyze its security configuration and vulnerabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    type="text"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => handleDomainChange(e.target.value)}
                    className={errors.domain ? 'border-destructive' : ''}
                    disabled={isLoading}
                  />
                  {errors.domain && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.domain}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scanType">Scan Type</Label>
                  <Select
                    value={scanType}
                    onValueChange={(value) => setScanType(value as ScanType)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SCAN_TYPES).map(([type, config]) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center justify-between w-full">
                            <span>{config.name}</span>
                            <span className="text-muted-foreground ml-2">
                              {config.credits} {config.credits === 1 ? 'credit' : 'credits'}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {errors.general && (
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.general}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !canAffordScan || !!errors.domain}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting Scan...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Start Scan ({selectedScanConfig.credits} {selectedScanConfig.credits === 1 ? 'credit' : 'credits'})
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credit Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{currentCredits}</div>
              <p className="text-sm text-muted-foreground">Credits remaining</p>
              {!canAffordScan && (
                <p className="text-sm text-destructive mt-2">
                  Need {selectedScanConfig.credits - currentCredits} more credits
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Scan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">{selectedScanConfig.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedScanConfig.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span className="text-muted-foreground">{selectedScanConfig.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost:</span>
                    <span className="text-muted-foreground">
                      {selectedScanConfig.credits} {selectedScanConfig.credits === 1 ? 'credit' : 'credits'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Includes:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedScanConfig.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Domain Format Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span><strong>Correct:</strong> example.com</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span><strong>Correct:</strong> www.example.com</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span><strong>Correct:</strong> sub.example.com</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span><strong>Incorrect:</strong> https://example.com</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span><strong>Incorrect:</strong> example.com/path</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter domain names without protocols (http/https) or paths
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}