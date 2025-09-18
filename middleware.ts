import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Middleware function runs after authentication
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to auth routes
        if (pathname.startsWith('/api/auth')) {
          return true
        }

        // Allow access to health check
        if (pathname === '/api/health') {
          return true
        }

        // Require authentication for dashboard and other API routes
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/api')) {
          return !!token
        }

        // Allow access to other routes
        return true
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}