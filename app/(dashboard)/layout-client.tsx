'use client'

import { useState, useEffect } from 'react'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { TopBar } from '@/components/layout/TopBar'
import { Sidebar } from '@/components/layout/Sidebar'

interface DashboardLayoutClientProps {
  children: React.ReactNode
  session: Session
}

export function DashboardLayoutClient({ children, session }: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSidebarClose = () => {
    setSidebarOpen(false)
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-gray-50">
        {/* Desktop Layout */}
        <div className="hidden md:flex h-screen">
          {/* Desktop Sidebar */}
          <Sidebar className="w-64 flex-shrink-0" />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar onMenuClick={handleMenuClick} />

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="container mx-auto px-6 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
          />

          {/* Mobile Content */}
          <div className="flex flex-col min-h-screen">
            <TopBar onMenuClick={handleMenuClick} />

            {/* Main Content */}
            <main className="flex-1">
              <div className="container mx-auto px-4 py-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}