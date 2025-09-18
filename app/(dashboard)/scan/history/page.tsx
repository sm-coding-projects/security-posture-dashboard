'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Plus
} from 'lucide-react'

interface Scan {
  id: string
  domain: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  sslGrade: string | null
  securityScore: number | null
  creditsUsed: number
  createdAt: string
  completedAt: string | null
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  running: {
    label: 'Running',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Clock
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle
  }
}

const GRADE_COLORS = {
  'A+': 'bg-green-100 text-green-800 border-green-200',
  'A': 'bg-green-100 text-green-800 border-green-200',
  'B': 'bg-blue-100 text-blue-800 border-blue-200',
  'C': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'D': 'bg-orange-100 text-orange-800 border-orange-200',
  'F': 'bg-red-100 text-red-800 border-red-200',
}

export default function ScanHistoryPage() {
  const [scans, setScans] = useState<Scan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock data for demonstration
  useEffect(() => {
    const mockScans: Scan[] = [
      {
        id: '1',
        domain: 'example.com',
        status: 'completed',
        sslGrade: 'A+',
        securityScore: 95,
        creditsUsed: 1,
        createdAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T10:32:00Z'
      },
      {
        id: '2',
        domain: 'test.org',
        status: 'completed',
        sslGrade: 'B',
        securityScore: 78,
        creditsUsed: 3,
        createdAt: '2024-01-14T09:15:00Z',
        completedAt: '2024-01-14T09:20:00Z'
      },
      {
        id: '3',
        domain: 'demo.net',
        status: 'running',
        sslGrade: null,
        securityScore: null,
        creditsUsed: 1,
        createdAt: '2024-01-13T14:45:00Z',
        completedAt: null
      },
      {
        id: '4',
        domain: 'failed-site.com',
        status: 'failed',
        sslGrade: null,
        securityScore: null,
        creditsUsed: 1,
        createdAt: '2024-01-12T16:20:00Z',
        completedAt: null
      }
    ]

    setTimeout(() => {
      setScans(mockScans)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || scan.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredScans.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedScans = filteredScans.slice(startIndex, startIndex + itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getGradeColor = (grade: string | null) => {
    if (!grade) return 'bg-gray-100 text-gray-800 border-gray-200'
    return GRADE_COLORS[grade as keyof typeof GRADE_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
          <p className="text-muted-foreground">View and manage your security scan history</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Error loading scan history</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
          <p className="text-muted-foreground">
            View and manage your security scan history
          </p>
        </div>
        <Link href="/dashboard/scan/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Scan
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by domain..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {paginatedScans.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No scans found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'No scans match your current filters. Try adjusting your search or filters.'
                : 'You haven\'t run any security scans yet. Start your first scan to see results here.'
              }
            </p>
            <Link href="/dashboard/scan/new">
              <Button>
                Start Your First Scan
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SSL Grade</TableHead>
                  <TableHead>Security Score</TableHead>
                  <TableHead>Credits Used</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedScans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium">{scan.domain}</TableCell>
                    <TableCell>
                      <StatusBadge status={scan.status} />
                    </TableCell>
                    <TableCell>
                      {scan.sslGrade ? (
                        <Badge variant="outline" className={getGradeColor(scan.sslGrade)}>
                          {scan.sslGrade}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {scan.securityScore ? (
                        <span className="font-medium">{scan.securityScore}/100</span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{scan.creditsUsed}</TableCell>
                    <TableCell>{formatDate(scan.createdAt)}</TableCell>
                    <TableCell>
                      {scan.status === 'completed' ? (
                        <Link href={`/dashboard/scan/${scan.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredScans.length)} of{' '}
                {filteredScans.length} scans
              </p>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}