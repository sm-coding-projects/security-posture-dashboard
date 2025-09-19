export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Simplified layout without client components */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Simple header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-lg font-semibold">Security Dashboard</h1>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}