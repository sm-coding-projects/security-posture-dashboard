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
        router.push('/')
      }
    }
    checkSession()
  }, [router])

  const handleGitHubSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn('github', {
        callbackUrl: '/',
        redirect: false,
      })

      if (result?.error) {
        setError('Failed to sign in with GitHub. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Security Posture Dashboard
            </h1>
            <p className="text-gray-300 text-sm">
              Comprehensive security analysis and monitoring
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="bg-black/20 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">100 Free Credits</span>
              </div>
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                New Users
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Comprehensive Security Analysis</span>
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
            className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-3 border border-gray-600"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connecting...</span>
              </div>
            ) : (
              <>
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </>
            )}
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center mt-6 text-gray-400">
            <Lock className="w-4 h-4 mr-2" />
            <span className="text-xs">Protected by SSL/TLS encryption</span>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-6 text-xs text-gray-400 space-x-4">
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Sign in to start monitoring your security posture
          </p>
        </div>
      </div>
    </div>
  )
}