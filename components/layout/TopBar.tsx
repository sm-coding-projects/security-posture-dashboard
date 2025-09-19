'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Menu, Bell, Search, LogOut, User, CreditCard, Settings, Shield } from 'lucide-react'
import Link from 'next/link'

interface TopBarProps {
  onMenuClick: () => void
}

interface UserSession {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    tier?: string
    credits?: number
  }
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { data: session } = useSession() as { data: UserSession | null }

  const userInitials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-muted/20 glass-card backdrop-blur-xl">
      <div className="flex h-18 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl hover:bg-muted/50 transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg pulse-glow">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black gradient-text">SecDash</h1>
              <p className="text-xs text-muted-foreground -mt-1">Security Suite</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type="search"
              placeholder="Search security data..."
              className="w-80 pl-10 pr-4 py-3 text-sm border-0 rounded-2xl bg-muted/30 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-muted/50 transition-all duration-200 placeholder:text-muted-foreground"
            />
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/20">
              <Badge variant="secondary" className="text-xs font-semibold bg-transparent border-0 text-purple-400">
                {session?.user?.tier || 'FREE'}
              </Badge>
            </div>
            <span className="text-sm font-bold text-foreground">
              {session?.user?.credits || 0} <span className="text-muted-foreground font-normal">credits</span>
            </span>
          </div>

          <Button variant="ghost" size="sm" className="relative p-3 rounded-2xl hover:bg-muted/30 transition-all duration-200 group">
            <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full pulse-glow" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-2xl ring-2 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-200">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 glass-card border-muted/20 shadow-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-bold leading-none">
                    {session?.user?.name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="px-2 py-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/20">
                      <Badge variant="secondary" className="text-xs font-semibold bg-transparent border-0 text-purple-400">
                        {session?.user?.tier || 'FREE'}
                      </Badge>
                    </div>
                    <span className="text-xs font-medium">
                      {session?.user?.credits || 0} credits
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-muted/20" />
              <DropdownMenuItem asChild className="mx-2 rounded-xl hover:bg-muted/30 transition-all duration-200">
                <Link href="/profile" className="flex items-center gap-3 p-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/20">
                    <User className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="font-medium">Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="mx-2 rounded-xl hover:bg-muted/30 transition-all duration-200">
                <Link href="/settings" className="flex items-center gap-3 p-3">
                  <div className="p-1.5 rounded-lg bg-green-500/20">
                    <Settings className="h-4 w-4 text-green-500" />
                  </div>
                  <span className="font-medium">Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="mx-2 rounded-xl hover:bg-muted/30 transition-all duration-200">
                <Link href="/credits-billing" className="flex items-center gap-3 p-3">
                  <div className="p-1.5 rounded-lg bg-purple-500/20">
                    <CreditCard className="h-4 w-4 text-purple-500" />
                  </div>
                  <span className="font-medium">Credits & Billing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-muted/20" />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="mx-2 rounded-xl hover:bg-red-500/10 transition-all duration-200 text-red-500"
              >
                <div className="flex items-center gap-3 p-3 w-full">
                  <div className="p-1.5 rounded-lg bg-red-500/20">
                    <LogOut className="h-4 w-4 text-red-500" />
                  </div>
                  <span className="font-medium">Log out</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}