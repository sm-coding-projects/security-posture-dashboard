import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>
            Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted, or the URL might be incorrect.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-muted-foreground mb-2">404</div>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/scans">
                <Search className="h-4 w-4 mr-2" />
                View All Scans
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}