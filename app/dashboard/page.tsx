import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Scan,
  CreditCard
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-6">
      <div className="relative">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 rounded-full blur-3xl floating-animation"></div>
        <h1 className="relative text-5xl font-black tracking-tight gradient-text mb-4">
          Security Dashboard
        </h1>
        <p className="relative text-lg text-muted-foreground font-medium">
          Welcome back! Here's your real-time security posture overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="morphism-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Scans</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-colors">
              <Scan className="h-5 w-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black mb-1">12</div>
            <div className="flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+2</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="morphism-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Average Score</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-colors">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black mb-1">85</div>
            <div className="flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">+5%</span>
              <span className="text-muted-foreground ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="morphism-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Credits Remaining</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
              <CreditCard className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black mb-1">75</div>
            <div className="flex items-center text-xs">
              <span className="text-muted-foreground">Out of </span>
              <span className="text-purple-500 font-medium ml-1">100 credits</span>
            </div>
          </CardContent>
        </Card>

        <Card className="morphism-card hover:scale-105 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Active Alerts</CardTitle>
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-colors pulse-glow">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black mb-1">3</div>
            <div className="flex items-center text-xs">
              <span className="text-red-500 font-medium">2 high priority</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4 glass-card border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                <Activity className="h-5 w-5 text-cyan-500" />
              </div>
              <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Latest security scans and alerts from your domains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/10 hover:from-green-500/10 hover:to-emerald-500/10 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">Security scan completed</p>
                <p className="text-sm text-muted-foreground">example.com scored <span className="text-green-500 font-semibold">92/100</span></p>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">2h ago</div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-orange-500/5 to-yellow-500/5 border border-orange-500/10 hover:from-orange-500/10 hover:to-yellow-500/10 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">SSL certificate expiring</p>
                <p className="text-sm text-muted-foreground">test.org expires in <span className="text-orange-500 font-semibold">30 days</span></p>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">4h ago</div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/10 hover:from-blue-500/10 hover:to-cyan-500/10 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">New scan started</p>
                <p className="text-sm text-muted-foreground">demo.net analysis <span className="text-blue-500 font-semibold">in progress</span></p>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">6h ago</div>
            </div>
          </CardContent>
        </Card>

        {/* Security Score Overview */}
        <Card className="col-span-3 glass-card border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Shield className="h-5 w-5 text-purple-500" />
              </div>
              <CardTitle className="text-xl font-bold">Security Score Trends</CardTitle>
            </div>
            <CardDescription className="text-sm">
              Average security scores across all domains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">SSL/TLS Security</span>
                <span className="font-bold text-green-500">95%</span>
              </div>
              <div className="relative">
                <Progress value={95} className="h-3 bg-muted/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full opacity-80 h-3" style={{width: '95%'}}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Security Headers</span>
                <span className="font-bold text-orange-500">78%</span>
              </div>
              <div className="relative">
                <Progress value={78} className="h-3 bg-muted/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full opacity-80 h-3" style={{width: '78%'}}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">DNS Configuration</span>
                <span className="font-bold text-blue-500">88%</span>
              </div>
              <div className="relative">
                <Progress value={88} className="h-3 bg-muted/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full opacity-80 h-3" style={{width: '88%'}}></div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-muted/30">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">Overall Security</span>
                <span className="font-black text-lg text-purple-500">85%</span>
              </div>
              <div className="relative">
                <Progress value={85} className="h-4 bg-muted/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 rounded-full opacity-90 h-4 pulse-glow" style={{width: '85%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-0">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Quick Actions</CardTitle>
          </div>
          <CardDescription className="text-sm">
            Get started with common security tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/scan/new">
            <div className="group cursor-pointer rounded-2xl p-6 morphism-card hover:scale-105 hover:-translate-y-1 transition-all duration-300 neon-glow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                  <Scan className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Run New Scan</h3>
                  <p className="text-xs text-muted-foreground">Start security analysis</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/alerts">
            <div className="group cursor-pointer rounded-2xl p-6 morphism-card hover:scale-105 hover:-translate-y-1 transition-all duration-300 neon-glow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-all duration-300">
                  <AlertTriangle className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">View Alerts</h3>
                  <p className="text-xs text-muted-foreground">Check security issues</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/scan/history">
            <div className="group cursor-pointer rounded-2xl p-6 morphism-card hover:scale-105 hover:-translate-y-1 transition-all duration-300 neon-glow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
                  <Clock className="h-6 w-6 text-green-500 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Scan History</h3>
                  <p className="text-xs text-muted-foreground">Review past results</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/settings">
            <div className="group cursor-pointer rounded-2xl p-6 morphism-card hover:scale-105 hover:-translate-y-1 transition-all duration-300 neon-glow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                  <Shield className="h-6 w-6 text-purple-500 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">Settings</h3>
                  <p className="text-xs text-muted-foreground">Configure dashboard</p>
                </div>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}