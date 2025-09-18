'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  User,
  CreditCard,
  Key,
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Crown,
  Shield,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw
} from 'lucide-react'
import type { User as UserType, UserTier } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface CreditUsage {
  date: string
  amount: number
  description: string
  scanId?: string
}

interface ApiKey {
  id: string
  name: string
  key: string
  lastUsed: Date | null
  createdAt: Date
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [creditHistory, setCreditHistory] = useState<CreditUsage[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [visibleApiKeys, setVisibleApiKeys] = useState<Set<string>>(new Set())

  // Form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  })

  useEffect(() => {
    fetchUserData()
    fetchCreditHistory()
    fetchApiKeys()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      if (!response.ok) throw new Error('Failed to fetch user data')

      const userData = await response.json()
      setUser(userData)
      setProfileForm({
        name: userData.name || '',
        email: userData.email || ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data')
    }
  }

  const fetchCreditHistory = async () => {
    try {
      // Mock data for now - replace with actual API call
      setCreditHistory([
        { date: '2024-01-15', amount: -10, description: 'Security scan for example.com', scanId: 'scan_123' },
        { date: '2024-01-10', amount: -5, description: 'SSL check for test.com', scanId: 'scan_122' },
        { date: '2024-01-01', amount: 100, description: 'Monthly credit allocation' },
      ])
    } catch (err) {
      console.error('Failed to fetch credit history:', err)
    }
  }

  const fetchApiKeys = async () => {
    try {
      // Mock data for now - replace with actual API call
      setApiKeys([
        {
          id: 'key_1',
          name: 'Production API',
          key: 'sk_live_1234567890abcdef',
          lastUsed: new Date('2024-01-15'),
          createdAt: new Date('2024-01-01')
        }
      ])
    } catch (err) {
      console.error('Failed to fetch API keys:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileForm.name.trim() || null
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setSuccess('Profile updated successfully')

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const getTierBadgeVariant = (tier: UserTier) => {
    switch (tier) {
      case 'FREE': return 'secondary'
      case 'PRO': return 'default'
      case 'ENTERPRISE': return 'destructive'
      default: return 'secondary'
    }
  }

  const getTierIcon = (tier: UserTier) => {
    switch (tier) {
      case 'FREE': return <User className="h-4 w-4" />
      case 'PRO': return <Crown className="h-4 w-4" />
      case 'ENTERPRISE': return <Shield className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const toggleApiKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleApiKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleApiKeys(newVisible)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSuccess('API key copied to clipboard')
      setTimeout(() => setSuccess(null), 2000)
    } catch (err) {
      setError('Failed to copy to clipboard')
    }
  }

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      // Redirect to login or home page after deletion
      window.location.href = '/login'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading settings...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Failed to load settings</h3>
          <p className="text-muted-foreground">Unable to load user information</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
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

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and account details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Account Created</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Plan & Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plan & Billing
            </CardTitle>
            <CardDescription>
              Current plan details and billing information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-muted-foreground">Your active subscription tier</p>
              </div>
              <Badge variant={getTierBadgeVariant(user.tier)} className="gap-1">
                {getTierIcon(user.tier)}
                {user.tier}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Credits Remaining</p>
                <p className="text-sm text-muted-foreground">Available scan credits</p>
              </div>
              <span className="text-2xl font-bold">{user.credits}</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Total Scans</p>
                <p className="text-sm text-muted-foreground">Lifetime scan count</p>
              </div>
              <span className="text-lg font-semibold">{user.totalScans}</span>
            </div>

            <Button variant="outline" className="w-full">
              Upgrade Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Credit Usage History */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Usage History</CardTitle>
          <CardDescription>
            Track your credit usage and scan history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {creditHistory.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No credit usage history</p>
              </div>
            ) : (
              creditHistory.map((usage, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{usage.description}</p>
                    <p className="text-sm text-muted-foreground">{usage.date}</p>
                  </div>
                  <div className={`text-right ${usage.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="font-semibold">
                      {usage.amount > 0 ? '+' : ''}{usage.amount}
                    </span>
                    <p className="text-xs text-muted-foreground">credits</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Key Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Key Management
          </CardTitle>
          <CardDescription>
            Manage your API keys for programmatic access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                API keys allow you to integrate our security scanning capabilities into your applications.
                Keep your keys secure and never share them publicly.
              </p>
            </div>

            {apiKeys.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No API keys created yet</p>
                <Button variant="outline" className="mt-2">
                  Create API Key
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {apiKeys.map((apiKey) => {
                  const isVisible = visibleApiKeys.has(apiKey.id)
                  const maskedKey = isVisible ? apiKey.key : `${apiKey.key.slice(0, 12)}${'*'.repeat(16)}`

                  return (
                    <div key={apiKey.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{apiKey.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Created {formatDistanceToNow(apiKey.createdAt, { addSuffix: true })}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {apiKey.lastUsed ? (
                            <>Last used {formatDistanceToNow(apiKey.lastUsed, { addSuffix: true })}</>
                          ) : (
                            'Never used'
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                          {maskedKey}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleApiKeyVisibility(apiKey.id)}
                        >
                          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}

                <Button variant="outline" className="w-full">
                  Create New API Key
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Delete Account</h4>
              <p className="text-sm text-red-700 mb-4">
                Once you delete your account, there is no going back. This will permanently delete
                your account, scan history, and all associated data.
              </p>

              {!showDeleteConfirm ? (
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-red-800">
                    Are you absolutely sure? This action cannot be undone.
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="flex-1"
                    >
                      Yes, Delete My Account
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}