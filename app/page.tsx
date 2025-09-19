import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">SecureGuard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign In
              </Link>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Comprehensive
            <span className="text-blue-600"> Security Posture</span>
            <br />
            Monitoring
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Analyze your web application&apos;s security stance with comprehensive SSL, DNS, and vulnerability assessments.
            Get actionable insights to strengthen your defenses.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/login" className="px-8 py-3 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Start Free Scan
            </Link>
            <Link href="#features" className="px-8 py-3 text-sm font-semibold text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
              Learn more
            </Link>
          </div>
        </div>
      </div>

      <div id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Complete Security Assessment
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to understand and improve your security posture
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">SSL/TLS Analysis</h3>
              <p className="mt-2 text-gray-600">
                Deep SSL certificate validation, cipher suite analysis, and TLS configuration review
                to ensure encrypted connections are properly secured.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">DNS Security</h3>
              <p className="mt-2 text-gray-600">
                Comprehensive DNS configuration analysis including SPF, DKIM, DMARC records
                and subdomain enumeration for complete domain security.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-lg font-semibold">Vulnerability Scanning</h3>
              <p className="mt-2 text-gray-600">
                Automated detection of common web vulnerabilities, misconfigurations,
                and security headers analysis with remediation recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 SecureGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}