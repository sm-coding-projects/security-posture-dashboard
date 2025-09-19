'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Github, Shield, CheckCircle, Lock } from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push('/dashboard')
      }
    }
    checkSession()
  }, [router])

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn('github', {
        callbackUrl: '/dashboard',
        redirect: true, // Changed to true for proper OAuth flow
      })
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 particle-field cyber-grid relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 matrix-rain opacity-30"></div>

      <div className="relative z-10 w-full max-w-md scene-3d">
        {/* Floating background elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-2xl floating-animation" style={{animationDelay: '2s'}}></div>

        {/* Main Card */}
        <div className="glass-card border-0 neon-box bg-gradient-to-br from-slate-900/80 via-purple-900/40 to-blue-900/80 backdrop-blur-xl p-8 card-3d group">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl mb-6 shadow-2xl pulse-glow">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3 gradient-text">
              SecureGuard
            </h1>
            <p className="text-cyan-400 text-sm font-bold mb-2 holographic">
              SECURITY PLATFORM
            </p>
            <p className="text-gray-300 text-sm">
              Comprehensive security analysis and monitoring
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="morphism-card neon-glow p-6 mb-6 border border-green-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-white font-bold">100 Free Credits</span>
              </div>
              <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 font-bold">
                NEW USERS
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-cyan-300 text-sm font-medium">Enterprise-Grade Security Analysis</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* GitHub Sign In Button */}
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full neon-box bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 border-0 shadow-lg hover:scale-105 hover:-translate-y-1"
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="font-bold">INITIALIZING...</span>
              </div>
            ) : (
              <>
                <Github className="w-5 h-5" />
                <span>CONTINUE WITH GITHUB</span>
              </>
            )}
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center mt-6 text-green-400">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center mr-3">
              <Lock className="w-3 h-3" />
            </div>
            <span className="text-xs font-mono">SECURED BY SSL/TLS ENCRYPTION</span>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-6 text-xs text-gray-400 space-x-4 font-mono">
            <a href="/terms" className="hover:text-cyan-400 transition-colors">
              TERMS OF SERVICE
            </a>
            <span className="text-cyan-500">•</span>
            <a href="/privacy" className="hover:text-cyan-400 transition-colors">
              PRIVACY POLICY
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2 data-stream px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30">
              <div className="w-2 h-2 bg-purple-500 rounded-full pulse-glow"></div>
              <span className="text-purple-400 font-mono text-xs">PLATFORM READY</span>
            </div>
            <div className="flex items-center space-x-2 data-stream px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <div className="w-2 h-2 bg-cyan-500 rounded-full pulse-glow"></div>
              <span className="text-cyan-400 font-mono text-xs">SECURE ACCESS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}