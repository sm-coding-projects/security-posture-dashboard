'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ScanLine,
  History,
  CreditCard,
  AlertTriangle,
  Key,
  Settings,
  HelpCircle,
  HeadphonesIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'New Scan',
    href: '/dashboard/scan/new',
    icon: ScanLine,
  },
  {
    title: 'Scan History',
    href: '/dashboard/scan/history',
    icon: History,
  },
  {
    title: 'Credits',
    href: '/dashboard/credits',
    icon: CreditCard,
  },
  {
    title: 'Alerts',
    href: '/dashboard/alerts',
    icon: AlertTriangle,
  },
  {
    title: 'API',
    href: '/dashboard/api',
    icon: Key,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar({ className, isOpen = false, onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 glass-card border-r-0 transition-all duration-300 ease-in-out',
          'flex flex-col backdrop-blur-xl',
          // Desktop styles
          'md:static md:z-auto',
          collapsed ? 'md:w-20' : 'md:w-72',
          // Mobile styles
          'w-72',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header with collapse button */}
          <div className="flex items-center justify-between p-6 border-b border-muted/20">
            <Link href="/" className={cn(
              'flex items-center gap-3 hover:scale-105 transition-all duration-200 group',
              collapsed && 'md:justify-center'
            )}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg pulse-glow group-hover:shadow-xl">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <span className="font-black text-xl gradient-text group-hover:text-cyan-400 transition-colors">SecureGuard</span>
                  <p className="text-xs text-muted-foreground">Security Platform</p>
                </div>
              )}
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden p-2 rounded-xl hover:bg-muted/50 transition-all duration-200"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Desktop collapse button */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden md:flex p-2 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4 group-hover:scale-110 transition-transform" />
                ) : (
                  <ChevronLeft className="h-4 w-4 group-hover:scale-110 transition-transform" />
                )}
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 relative overflow-hidden',
                    'hover:scale-105 hover:-translate-y-0.5',
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-foreground border border-purple-500/20 shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30',
                    collapsed && 'md:justify-center md:gap-0 md:px-3'
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl blur-xl"></div>
                  )}
                  <div className={cn(
                    "relative p-2 rounded-xl transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-br from-purple-500/30 to-cyan-500/30"
                      : "group-hover:bg-muted/50"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-all duration-300",
                      isActive ? "text-purple-400" : "group-hover:scale-110"
                    )} />
                  </div>
                  {!collapsed && (
                    <span className="relative z-10 group-hover:text-foreground transition-colors">
                      {item.title}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full pulse-glow"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Help & Support */}
          <div className="border-t border-muted/20 p-6">
            <Link
              href="/help"
              className={cn(
                'group flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300',
                'text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:scale-105 hover:-translate-y-0.5',
                collapsed && 'md:justify-center md:gap-0 md:px-3'
              )}
              title={collapsed ? 'Help & Support' : undefined}
            >
              <div className="relative p-2 rounded-xl group-hover:bg-muted/50 transition-all duration-300">
                <HelpCircle className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              </div>
              {!collapsed && (
                <span className="group-hover:text-foreground transition-colors">
                  Help & Support
                </span>
              )}
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}