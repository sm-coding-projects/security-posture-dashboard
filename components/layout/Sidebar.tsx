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
          'fixed inset-y-0 left-0 z-50 bg-background border-r transition-all duration-200 ease-in-out',
          'flex flex-col',
          // Desktop styles
          'md:static md:z-auto',
          collapsed ? 'md:w-16' : 'md:w-64',
          // Mobile styles
          'w-64',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header with collapse button */}
          <div className="flex items-center justify-between p-4 border-b md:border-b-0">
            <div className={cn(
              'flex items-center gap-2',
              collapsed && 'md:justify-center'
            )}>
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
              </div>
              {!collapsed && (
                <span className="font-semibold text-lg">Security Dashboard</span>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-lg hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Desktop collapse button */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden md:flex p-1 rounded-lg hover:bg-accent"
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground',
                    collapsed && 'md:justify-center md:gap-0'
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Help & Support */}
          <div className="border-t p-4">
            <Link
              href="/help"
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                'text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground',
                collapsed && 'md:justify-center md:gap-0'
              )}
              title={collapsed ? 'Help & Support' : undefined}
            >
              <HelpCircle className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Help & Support</span>}
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}