'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CreditCard,
  Crown,
  Shield,
  User,
  ArrowUp,
  Calendar,
  TrendingUp,
  Package,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

interface CreditUsage {
  date: string
  amount: number
  description: string
  scanId?: string
}

interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  name: string
  tier: 'FREE' | 'PRO' | 'ENTERPRISE'
  price: number
  credits: number
  features: PlanFeature[]
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    tier: 'FREE',
    price: 0,
    credits: 100,
    features: [
      { name: 'Basic security scans', included: true },
      { name: 'SSL certificate analysis', included: true },
      { name: 'Security headers check', included: true },
      { name: 'Email support', included: false },
      { name: 'Priority scanning', included: false },
      { name: 'Advanced vulnerability detection', included: false },
      { name: 'API access', included: false }
    ]
  },
  {
    name: 'Pro',
    tier: 'PRO',
    price: 29,
    credits: 500,
    popular: true,
    features: [
      { name: 'Basic security scans', included: true },
      { name: 'SSL certificate analysis', included: true },
      { name: 'Security headers check', included: true },
      { name: 'Email support', included: true },
      { name: 'Priority scanning', included: true },
      { name: 'Advanced vulnerability detection', included: true },
      { name: 'API access', included: false }
    ]
  },
  {
    name: 'Enterprise',
    tier: 'ENTERPRISE',
    price: 99,
    credits: 2000,
    features: [
      { name: 'Basic security scans', included: true },
      { name: 'SSL certificate analysis', included: true },
      { name: 'Security headers check', included: true },
      { name: 'Email support', included: true },
      { name: 'Priority scanning', included: true },
      { name: 'Advanced vulnerability detection', included: true },
      { name: 'API access', included: true }
    ]
  }
]

export default function CreditsPage() {
  const [currentPlan] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>('FREE')
  const [creditsRemaining] = useState(100)
  const [totalCredits] = useState(100)
  const [monthlyUsage] = useState(0)
  const [creditHistory, setCreditHistory] = useState<CreditUsage[]>([])

  useEffect(() => {
    // Mock credit history
    setCreditHistory([
      { date: '2024-01-15', amount: -10, description: 'Security scan for example.com', scanId: 'scan_123' },
      { date: '2024-01-10', amount: -5, description: 'SSL check for test.com', scanId: 'scan_122' },
      { date: '2024-01-01', amount: 100, description: 'Monthly credit allocation' },
    ])
  }, [])

  const usagePercentage = ((totalCredits - creditsRemaining) / totalCredits) * 100

  const getTierIcon = (tier: 'FREE' | 'PRO' | 'ENTERPRISE') => {
    switch (tier) {
      case 'FREE': return <User className="h-4 w-4" />
      case 'PRO': return <Crown className="h-4 w-4" />
      case 'ENTERPRISE': return <Shield className="h-4 w-4" />
    }
  }

  const getTierColor = (tier: 'FREE' | 'PRO' | 'ENTERPRISE') => {
    switch (tier) {
      case 'FREE': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'PRO': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ENTERPRISE': return 'bg-purple-100 text-purple-800 border-purple-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credits & Billing</h1>
        <p className="text-muted-foreground">
          Manage your credits and subscription plan
        </p>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Badge variant="outline" className={getTierColor(currentPlan)}>
              {getTierIcon(currentPlan)}
              <span className="ml-1">{currentPlan}</span>
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {PLANS.find(p => p.tier === currentPlan)?.name}
            </div>
            <p className="text-xs text-muted-foreground">
              ${PLANS.find(p => p.tier === currentPlan)?.price}/month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creditsRemaining}</div>
            <p className="text-xs text-muted-foreground">
              of {totalCredits} total credits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyUsage}</div>
            <p className="text-xs text-muted-foreground">
              credits used this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usagePercentage.toFixed(0)}%</div>
            <Progress value={usagePercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUp className="h-5 w-5" />
            Upgrade Your Plan
          </CardTitle>
          <CardDescription>
            Get more credits and unlock advanced features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <Card key={plan.tier} className={`relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {getTierIcon(plan.tier)}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.credits} credits included
                  </p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle
                          className={`h-4 w-4 mr-2 ${
                            feature.included ? 'text-green-500' : 'text-gray-300'
                          }`}
                        />
                        <span className={feature.included ? '' : 'text-muted-foreground'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.tier === currentPlan ? 'outline' : 'default'}
                    disabled={plan.tier === currentPlan}
                  >
                    {plan.tier === currentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credit Usage History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Credit Usage History
          </CardTitle>
          <CardDescription>
            Track your credit usage and scan history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {creditHistory.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No credit usage history</p>
                <Link href="/dashboard/scan/new" className="inline-block mt-2">
                  <Button variant="outline" size="sm">
                    <Zap className="h-4 w-4 mr-2" />
                    Start Your First Scan
                  </Button>
                </Link>
              </div>
            ) : (
              creditHistory.map((usage, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{usage.description}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(usage.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-right ${usage.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <span className="font-semibold">
                        {usage.amount > 0 ? '+' : ''}{usage.amount}
                      </span>
                      <p className="text-xs text-muted-foreground">credits</p>
                    </div>
                    {usage.scanId && (
                      <Link href={`/dashboard/scan/${usage.scanId}`}>
                        <Button variant="ghost" size="sm">
                          View <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/dashboard/scan/new">
              <Button variant="outline" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Start New Scan
              </Button>
            </Link>
            <Link href="/dashboard/scan/history">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                View Scan History
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}