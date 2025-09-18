import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Search,
  AlertTriangle,
  CheckCircle,
  Globe,
  Lock,
  Eye,
  BarChart3,
  Zap,
  Users,
  Clock,
  Star,
  ArrowRight,
  Check,
  ChevronDown
} from 'lucide-react'
import { getSession } from '@/lib/auth/helpers'

export default async function LandingPage() {
  const session = await getSession()
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">SecurePosture</span>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                  </Link>
                  <Link href="/settings">
                    <Button>Settings</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/login">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              🛡️ Enterprise Security Platform
            </Badge>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
              Complete Security
              <span className="text-primary block">Posture Analysis</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover vulnerabilities, analyze security headers, monitor SSL certificates,
              and get comprehensive security insights for your web applications.
              All in one powerful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/scan">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Start New Scan
                      <Search className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Free Scan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View Demo
                    <Eye className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 5 free scans included
            </p>
          </div>
        </div>
      </section>

      {/* Security Badges */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-muted-foreground">Trusted by security professionals worldwide</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <span className="font-semibold">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-6 w-6" />
              <span className="font-semibold">256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">GDPR Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6" />
              <span className="font-semibold">Zero Data Retention</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need for security analysis
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive security scanning and monitoring tools designed for modern web applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>DNS Security Analysis</CardTitle>
                <CardDescription>
                  Comprehensive DNS record analysis, DNSSEC validation, and subdomain discovery
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Lock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>SSL/TLS Monitoring</CardTitle>
                <CardDescription>
                  Certificate validation, expiration tracking, and cipher suite analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Security Headers</CardTitle>
                <CardDescription>
                  OWASP compliance checking, CSP analysis, and header optimization recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Search className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Vulnerability Scanning</CardTitle>
                <CardDescription>
                  Automated vulnerability detection using industry-standard databases and custom rules
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Detailed Reporting</CardTitle>
                <CardDescription>
                  Executive summaries, technical reports, and trend analysis with actionable insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>
                  Continuous monitoring with instant alerts for security changes and threats
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Example Results Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Security insights at a glance
            </h2>
            <p className="text-xl text-muted-foreground">
              Get instant security scores and detailed analysis for any domain
            </p>
          </div>

          <div className="bg-background rounded-lg border p-8 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Security Score</h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-muted stroke-current"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-500 stroke-current"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray="85, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-green-500">A+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Results</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      SSL Certificate
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Valid
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Security Headers
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Configured
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                      DNSSEC
                    </span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      Missing
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Vulnerabilities
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      None Found
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-4xl font-bold text-foreground">$0</div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    5 scans per month
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Basic security analysis
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    SSL certificate monitoring
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Email reports
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="text-4xl font-bold text-foreground">$29</div>
                <CardDescription>For growing businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    100 scans per month
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Advanced vulnerability scanning
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Real-time monitoring
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    API access
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full mt-6">
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier */}
            <Card className="border-2">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="text-4xl font-bold text-foreground">Custom</div>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Unlimited scans
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    On-premise deployment
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    SLA guarantee
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently asked questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about SecurePosture
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  How accurate are the security scans?
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our security scans use industry-standard tools and databases, including CVE, NVD, and OWASP guidelines.
                  We maintain a 99.5% accuracy rate and regularly update our scanning algorithms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Do you store my website data?
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We follow a zero data retention policy. Scan results are temporarily stored for report generation
                  and are automatically deleted after 30 days unless you choose to save them.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Can I integrate with my existing security tools?
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We offer REST API access and webhooks for Pro and Enterprise plans.
                  Popular integrations include Slack, JIRA, PagerDuty, and most SIEM platforms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  What makes SecurePosture different?
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Unlike other tools that focus on single aspects, SecurePosture provides comprehensive analysis
                  covering DNS, SSL, headers, and vulnerabilities in one platform with actionable recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to secure your web presence?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers and security professionals who trust SecurePosture
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/scan">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Start New Scan
                    <Search className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Your Free Scan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Schedule Demo
                  <Users className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-bold">SecurePosture</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Comprehensive security analysis for modern web applications.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">API</Link></li>
                <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
                <li><Link href="#" className="hover:text-foreground">Compliance</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 SecurePosture. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>SOC 2 Certified</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}