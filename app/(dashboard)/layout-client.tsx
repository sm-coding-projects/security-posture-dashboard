'use client'

import { useState, useEffect } from 'react'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { TopBar } from '@/components/layout/TopBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { cn } from '@/lib/utils'

interface DashboardLayoutClientProps {
  children: React.ReactNode
  session: Session
}

export function DashboardLayoutClient({ children, session }: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
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

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen">
          {/* Unified Sidebar for both mobile and desktop */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
            collapsed={sidebarCollapsed}
            onToggleCollapse={handleToggleCollapse}
          />

          {/* Main Content Area */}
          <div className={cn(
            "flex-1 flex flex-col overflow-hidden transition-all duration-200",
            !isMobile && sidebarCollapsed ? "ml-16" : !isMobile ? "ml-64" : "ml-0"
          )}>
            <TopBar onMenuClick={handleMenuClick} />

            {/* Main Content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SessionProvider>
  )
}