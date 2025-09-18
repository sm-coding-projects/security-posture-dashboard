import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import type { Metadata } from 'next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Security Posture Dashboard',
  description: 'A comprehensive dashboard for monitoring and managing your organization\'s security posture, compliance, and risk assessment.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}