import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 particle-field cyber-grid relative overflow-hidden">
      {/* Immersive 3D Background */}
      <div className="absolute inset-0 matrix-rain opacity-30"></div>

      {/* Navigation */}
      <nav className="relative z-50 glass-card border-0 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl pulse-glow">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-2xl font-black gradient-text">SecureGuard</span>
                  <p className="text-xs text-cyan-400 -mt-1">SECURITY PLATFORM</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="px-6 py-3 text-sm font-bold text-cyan-400 hover:text-white transition-all duration-300 tilt-3d">
                Sign In
              </Link>
              <Link href="/login" className="px-8 py-3 text-sm font-bold text-white neon-box hover:scale-105 transition-all duration-300">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center scene-3d">
          {/* Floating 3D Elements */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl floating-animation"></div>
          <div className="absolute top-20 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full blur-2xl floating-animation" style={{animationDelay: '2s'}}></div>

          <div className="relative z-10">
            <h1 className="text-7xl md:text-8xl font-black tracking-tight text-white mb-8 tilt-3d">
              <span className="block gradient-text mb-4">SECURITY</span>
              <span className="block text-cyan-400 holographic">POSTURE</span>
              <span className="block text-4xl md:text-5xl text-blue-400 mt-6 data-stream">DASHBOARD</span>
            </h1>

            <div className="relative max-w-4xl mx-auto mb-12">
              <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-medium">
                Comprehensive <span className="text-cyan-400 font-bold">security analysis</span> platform with
                <span className="text-blue-400 font-bold"> real-time monitoring</span> and
                <span className="text-green-400 font-bold"> actionable insights</span>
              </p>
            </div>

            {/* Interactive 3D Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-16">
              <Link href="/login" className="group relative">
                <div className="px-12 py-6 text-lg font-black text-white neon-box hover:scale-110 transition-all duration-500 card-3d">
                  <span className="relative z-10">Start Security Scan</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl blur group-hover:blur-md transition-all duration-300"></div>
                </div>
              </Link>

              <Link href="#features" className="group relative">
                <div className="px-12 py-6 text-lg font-black text-cyan-400 border-2 border-cyan-400/50 rounded-2xl hover:bg-cyan-400/10 transition-all duration-500 card-3d holographic">
                  <span className="relative z-10">Learn More</span>
                </div>
              </Link>
            </div>

            {/* Live Status Indicators */}
            <div className="mt-20 flex justify-center space-x-8">
              <div className="flex items-center space-x-3 data-stream px-6 py-3 rounded-full bg-green-500/10 border border-green-500/30">
                <div className="w-3 h-3 bg-green-500 rounded-full pulse-glow"></div>
                <span className="text-green-400 font-mono text-sm">PLATFORM ONLINE</span>
              </div>
              <div className="flex items-center space-x-3 data-stream px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                <div className="w-3 h-3 bg-cyan-500 rounded-full pulse-glow"></div>
                <span className="text-cyan-400 font-mono text-sm">MONITORING ACTIVE</span>
              </div>
              <div className="flex items-center space-x-3 data-stream px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/30">
                <div className="w-3 h-3 bg-blue-500 rounded-full pulse-glow"></div>
                <span className="text-blue-400 font-mono text-sm">SCAN READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative py-32 bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900 particle-field">
        <div className="absolute inset-0 cyber-grid opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black tracking-tight text-white mb-8">
              <span className="gradient-text">SECURITY</span>
              <span className="block text-4xl text-cyan-400 mt-4 holographic">FEATURES</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">
              Comprehensive security assessment tools with <span className="text-blue-400 font-bold">enterprise-grade</span> threat detection
            </p>
          </div>

          <div className="scene-3d mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* SSL/TLS Analysis Card */}
            <div className="group card-3d">
              <div className="relative p-8 rounded-3xl neon-box bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border-green-500/30 hover:border-green-400/60 transition-all duration-500">
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18,8h-1V6A5,5 0 0,0 12,1A5,5 0 0,0 7,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8M12,3A3,3 0 0,1 15,6V8H9V6A3,3 0 0,1 12,3Z"/>
                    </svg>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-black text-green-400 mb-4 holographic">SSL/TLS Analysis</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    <span className="text-green-400 font-bold">Advanced encryption</span> validation with comprehensive
                    <span className="text-cyan-400 font-bold"> cipher suite analysis</span> and
                    <span className="text-white font-bold">certificate security assessment</span>
                  </p>
                </div>

                <div className="mt-8 flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-green-400 font-mono text-sm">SSL MONITORING</span>
                </div>
              </div>
            </div>

            {/* DNS Security Card */}
            <div className="group card-3d">
              <div className="relative p-8 rounded-3xl neon-box bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-indigo-500/10 border-blue-500/30 hover:border-blue-400/60 transition-all duration-500">
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z"/>
                    </svg>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-black text-blue-400 mb-4 holographic">DNS Security</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    <span className="text-blue-400 font-bold">Comprehensive</span> DNS configuration analysis with
                    <span className="text-cyan-400 font-bold"> SPF, DKIM, DMARC validation</span> and
                    <span className="text-white font-bold">subdomain enumeration</span>
                  </p>
                </div>

                <div className="mt-8 flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full pulse-glow"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full pulse-glow" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full pulse-glow" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-blue-400 font-mono text-sm">DNS SCANNING</span>
                </div>
              </div>
            </div>

            {/* Vulnerability Scanning Card */}
            <div className="group card-3d">
              <div className="relative p-8 rounded-3xl neon-box bg-gradient-to-br from-orange-500/10 via-red-500/5 to-yellow-500/10 border-orange-500/30 hover:border-orange-400/60 transition-all duration-500">
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-2xl">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1M12,7C10.89,7 10,7.89 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9C14,7.89 13.1,7 12,7Z"/>
                    </svg>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-black text-orange-400 mb-4 holographic">Vulnerability Scan</h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    <span className="text-orange-400 font-bold">Automated</span> vulnerability detection with
                    <span className="text-red-400 font-bold"> security headers analysis</span> and
                    <span className="text-white font-bold">remediation recommendations</span>
                  </p>
                </div>

                <div className="mt-8 flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full pulse-glow"></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full pulse-glow" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full pulse-glow" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <span className="text-orange-400 font-mono text-sm">VULN SCANNING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-t from-black via-slate-900 to-slate-900 border-t border-purple-500/20">
        <div className="absolute inset-0 cyber-grid opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl pulse-glow">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-black gradient-text">SecureGuard</h3>
                <p className="text-cyan-400 font-mono text-sm">SECURITY PLATFORM</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="data-stream p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                <h4 className="text-blue-400 font-bold mb-2">SSL/TLS ANALYSIS</h4>
                <p className="text-gray-400 text-sm">Advanced encryption scanning</p>
              </div>
              <div className="data-stream p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20">
                <h4 className="text-cyan-400 font-bold mb-2">DNS SECURITY</h4>
                <p className="text-gray-400 text-sm">Comprehensive DNS validation</p>
              </div>
              <div className="data-stream p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
                <h4 className="text-green-400 font-bold mb-2">VULNERABILITY SCAN</h4>
                <p className="text-gray-400 text-sm">Automated threat detection</p>
              </div>
            </div>

            <div className="border-t border-blue-500/20 pt-8">
              <p className="text-gray-500 font-mono">
                &copy; 2025 SECUREGUARD SECURITY PLATFORM. ALL RIGHTS RESERVED.
              </p>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full pulse-glow" style={{animationDelay: '0.5s'}}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full pulse-glow" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}