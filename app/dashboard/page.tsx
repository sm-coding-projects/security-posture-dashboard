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
    <div className="space-y-8 p-6 particle-field cyber-grid">

      <div className="relative scene-3d">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-cyan-400/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute top-20 right-0 w-48 h-48 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl floating-animation" style={{animationDelay: '3s'}}></div>

        <h1 className="relative text-6xl md:text-7xl font-black tracking-tight gradient-text mb-6 tilt-3d">
          SECURITY DASHBOARD
        </h1>
        <p className="relative text-xl text-cyan-400 font-bold mb-2 holographic">
          REAL-TIME MONITORING
        </p>
        <p className="relative text-lg text-muted-foreground font-medium">
          Comprehensive security analysis and vulnerability management.
        </p>

        {/* Live Status Indicators */}
        <div className="flex space-x-6 mt-8">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full pulse-glow"></div>
            <span className="text-green-400 font-mono text-sm">ALL SYSTEMS OPERATIONAL</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyan-500 rounded-full pulse-glow"></div>
            <span className="text-cyan-400 font-mono text-sm">CONTINUOUS MONITORING</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full pulse-glow"></div>
            <span className="text-blue-400 font-mono text-sm">SECURITY ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 scene-3d">
        <Card className="neon-box bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-indigo-500/10 border-blue-500/30 hover:border-blue-400/60 card-3d group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-cyan-400 holographic">ACTIVE SCANS</CardTitle>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 group-hover:from-blue-500/50 group-hover:to-cyan-500/50 transition-all duration-300 pulse-glow">
              <Scan className="h-6 w-6 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black mb-2 gradient-text">12</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-green-400 font-bold">+2</span>
              <span className="text-gray-400 ml-2 font-mono">THIS MONTH</span>
            </div>
            <div className="mt-4 w-full bg-blue-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full w-3/4 data-stream"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="neon-box bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border-green-500/30 hover:border-green-400/60 card-3d group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-green-400 holographic">SECURITY SCORE</CardTitle>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 group-hover:from-green-500/50 group-hover:to-emerald-500/50 transition-all duration-300 pulse-glow">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black mb-2 text-green-400">85</div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-green-400 font-bold">+5%</span>
              <span className="text-gray-400 ml-2 font-mono">IMPROVEMENT</span>
            </div>
            <div className="mt-4 w-full bg-green-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full w-5/6 data-stream"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="neon-box bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-cyan-500/10 border-indigo-500/30 hover:border-indigo-400/60 card-3d group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-indigo-400 holographic">CREDITS AVAILABLE</CardTitle>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-blue-500/30 group-hover:from-indigo-500/50 group-hover:to-blue-500/50 transition-all duration-300 pulse-glow">
              <CreditCard className="h-6 w-6 text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black mb-2 text-indigo-400">75</div>
            <div className="flex items-center text-sm">
              <span className="text-gray-400 font-mono">REMAINING </span>
              <span className="text-indigo-400 font-bold ml-2">/ 100</span>
            </div>
            <div className="mt-4 w-full bg-indigo-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-400 h-2 rounded-full w-3/4 data-stream"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="neon-box bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10 border-red-500/30 hover:border-red-400/60 card-3d group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold text-red-400 holographic">SECURITY ALERTS</CardTitle>
            <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/30 to-orange-500/30 group-hover:from-red-500/50 group-hover:to-orange-500/50 transition-all duration-300 pulse-glow">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black mb-2 text-red-400">3</div>
            <div className="flex items-center text-sm">
              <span className="text-red-400 font-bold">2 HIGH PRIORITY</span>
              <span className="text-gray-400 ml-2 font-mono">ISSUES</span>
            </div>
            <div className="mt-4 w-full bg-red-500/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-red-500 to-orange-400 h-2 rounded-full w-1/4 data-stream pulse-glow"></div>
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
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20">
                <Shield className="h-5 w-5 text-indigo-500" />
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
                <span className="font-black text-lg text-indigo-500">85%</span>
              </div>
              <div className="relative">
                <Progress value={85} className="h-4 bg-muted/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 rounded-full opacity-90 h-4 pulse-glow" style={{width: '85%'}}></div>
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
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-indigo-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                  <Shield className="h-6 w-6 text-indigo-500 group-hover:scale-110 transition-transform" />
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