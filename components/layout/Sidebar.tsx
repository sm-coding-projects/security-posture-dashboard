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
} from 'lucide-react'

interface SidebarProps {
  className?: string
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

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-all duration-200 ease-in-out',
        'hidden md:flex md:flex-col',
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4 pt-6">
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
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
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
              'text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help & Support</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}