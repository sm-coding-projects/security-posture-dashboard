'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  Plus,
  Code,
  Book,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Download,
  Activity
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ApiKey {
  id: string
  name: string
  key: string
  lastUsed: Date | null
  createdAt: Date
  usageCount: number
  isActive: boolean
}

interface ApiUsage {
  date: string
  endpoint: string
  requests: number
  status: 'success' | 'error'
}

export default function APIPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [newKeyName, setNewKeyName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const [apiUsage] = useState<ApiUsage[]>([
    { date: '2024-01-15', endpoint: '/api/scan', requests: 25, status: 'success' },
    { date: '2024-01-14', endpoint: '/api/scan/results', requests: 15, status: 'success' },
    { date: '2024-01-13', endpoint: '/api/domains', requests: 8, status: 'error' },
  ])

  useEffect(() => {
    // Mock API keys
    setApiKeys([
      {
        id: 'key_1',
        name: 'Production API',
        key: 'sk_live_your_api_key_here_example_12345',
        lastUsed: new Date('2024-01-15'),
        createdAt: new Date('2024-01-01'),
        usageCount: 156,
        isActive: true
      },
      {
        id: 'key_2',
        name: 'Development API',
        key: 'sk_test_your_api_key_here_example_67890',
        lastUsed: null,
        createdAt: new Date('2024-01-10'),
        usageCount: 0,
        isActive: true
      }
    ])
  }, [])

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleKeys(newVisible)
  }

  const copyToClipboard = async (text: string, keyName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(keyName)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) return

    setIsCreating(true)

    // Simulate API call
    setTimeout(() => {
      const newKey: ApiKey = {
        id: `key_${Date.now()}`,
        name: newKeyName,
        key: `sk_live_example_${Math.random().toString(36).substring(2, 18)}`,
        lastUsed: null,
        createdAt: new Date(),
        usageCount: 0,
        isActive: true
      }

      setApiKeys(prev => [...prev, newKey])
      setNewKeyName('')
      setIsCreating(false)
    }, 1000)
  }

  const deleteApiKey = (keyId: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId))
  }

  const regenerateApiKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key =>
      key.id === keyId
        ? { ...key, key: `sk_live_example_${Math.random().toString(36).substring(2, 18)}` }
        : key
    ))
  }

  const formatKey = (key: string, isVisible: boolean) => {
    if (isVisible) return key
    return `${key.slice(0, 12)}${'*'.repeat(20)}`
  }

  const codeExamples = {
    javascript: `// JavaScript/Node.js Example
const apiKey = 'your_api_key_here';
const domain = 'example.com';

const response = await fetch('https://api.securitydashboard.com/v1/scan', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    domain: domain,
    scan_type: 'comprehensive'
  })
});

const result = await response.json();
console.log(result);`,

    python: `# Python Example
import requests

api_key = 'your_api_key_here'
domain = 'example.com'

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

data = {
    'domain': domain,
    'scan_type': 'comprehensive'
}

response = requests.post(
    'https://api.securitydashboard.com/v1/scan',
    headers=headers,
    json=data
)

result = response.json()
print(result)`,

    curl: `# cURL Example
curl -X POST "https://api.securitydashboard.com/v1/scan" \\
  -H "Authorization: Bearer your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "domain": "example.com",
    "scan_type": "comprehensive"
  }'`
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
        <p className="text-muted-foreground">
          Manage your API keys and integrate security scanning into your applications
        </p>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          {/* Create New API Key */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New API Key
              </CardTitle>
              <CardDescription>
                Generate a new API key for programmatic access to our security scanning services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="key-name">API Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production API, Development API"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={createApiKey}
                    disabled={!newKeyName.trim() || isCreating}
                  >
                    {isCreating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Create Key
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  API keys provide full access to your account. Keep them secure and never share them publicly.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Existing API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Your API Keys
              </CardTitle>
              <CardDescription>
                Manage your existing API keys and monitor their usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No API keys created yet</p>
                  <p className="text-sm">Create your first API key to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => {
                    const isVisible = visibleKeys.has(apiKey.id)

                    return (
                      <div key={apiKey.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{apiKey.name}</h3>
                              <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                                {apiKey.isActive ? "Active" : "Inactive"}
                              </Badge>
                              {copySuccess === apiKey.name && (
                                <Badge variant="outline" className="text-green-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Copied!
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground space-x-4">
                              <span>Created {formatDistanceToNow(apiKey.createdAt, { addSuffix: true })}</span>
                              <span>•</span>
                              <span>{apiKey.usageCount} requests</span>
                              {apiKey.lastUsed && (
                                <>
                                  <span>•</span>
                                  <span>Last used {formatDistanceToNow(apiKey.lastUsed, { addSuffix: true })}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                            {formatKey(apiKey.key, isVisible)}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                          >
                            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => regenerateApiKey(apiKey.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteApiKey(apiKey.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                API Documentation
              </CardTitle>
              <CardDescription>
                Learn how to integrate our security scanning API into your applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Start */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Start</h3>
                <p className="text-muted-foreground mb-4">
                  Get started with our REST API in minutes. All endpoints require authentication using your API key.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Base URL</h4>
                    <code className="block p-2 bg-muted rounded text-sm">
                      https://api.securitydashboard.com/v1
                    </code>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Authentication</h4>
                    <code className="block p-2 bg-muted rounded text-sm">
                      Authorization: Bearer your_api_key_here
                    </code>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Code Examples */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Code Examples</h3>
                <Tabs defaultValue="javascript" className="w-full">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>

                  {Object.entries(codeExamples).map(([language, code]) => (
                    <TabsContent key={language} value={language}>
                      <div className="relative">
                        <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                          <code>{code}</code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(code, `${language} example`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <Separator />

              {/* Available Endpoints */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Endpoints</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700">POST</Badge>
                      <code className="text-sm">/scan</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Initiate a security scan for a domain
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">GET</Badge>
                      <code className="text-sm">/scan/{'{scan_id}'}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Retrieve scan results and status
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">GET</Badge>
                      <code className="text-sm">/scans</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      List all scans with pagination and filtering
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">GET</Badge>
                      <code className="text-sm">/account</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Get account information and credit balance
                    </p>
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="flex gap-4">
                <Button variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  Full Documentation
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  OpenAPI Spec
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                API Usage Analytics
              </CardTitle>
              <CardDescription>
                Monitor your API usage and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Usage Stats */}
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">99.2%</div>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">245ms</div>
                    <p className="text-xs text-muted-foreground">P95 latency</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Usage */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Recent API Usage</h3>
                <div className="space-y-2">
                  {apiUsage.map((usage, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={usage.status === 'success' ? 'text-green-600' : 'text-red-600'}
                        >
                          {usage.status === 'success' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                          {usage.status}
                        </Badge>
                        <code className="text-sm">{usage.endpoint}</code>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{usage.requests} requests</div>
                        <div className="text-sm text-muted-foreground">{usage.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}