import { requireAuth } from '@/lib/auth/helpers'
import { DashboardLayoutClient } from './layout-client'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication on the server side
  const session = await requireAuth()

  return (
    <DashboardLayoutClient session={session}>
      {children}
    </DashboardLayoutClient>
  )
}