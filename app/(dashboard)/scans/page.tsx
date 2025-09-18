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
  XCircle
} from 'lucide-react'
import { ScanStatus, ScanSummary, PaginatedScansResponse } from '@/types'
import { format } from 'date-fns'

const STATUS_CONFIG = {
  [ScanStatus.PENDING]: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  [ScanStatus.RUNNING]: {
    label: 'Running',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Clock
  },
  [ScanStatus.COMPLETED]: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  },
  [ScanStatus.FAILED]: {
    label: 'Failed',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle
  },
  [ScanStatus.CANCELLED]: {
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

export default function ScansPage() {
  const [scans, setScans] = useState<ScanSummary[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  const fetchScans = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      })

      const response = await fetch(`/api/scans?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch scans')
      }

      const data: PaginatedScansResponse = await response.json()
      setScans(data.scans)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchScans()
  }, [pagination.page, pagination.limit, searchTerm, statusFilter])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const getGradeColor = (grade: string | null) => {
    if (!grade) return 'bg-gray-100 text-gray-800 border-gray-200'
    return GRADE_COLORS[grade as keyof typeof GRADE_COLORS] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'MMM dd, yyyy HH:mm')
  }

  const StatusBadge = ({ status }: { status: ScanStatus }) => {
    const config = STATUS_CONFIG[status]
    const Icon = config.icon

    return (
      <Badge variant="outline" className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const ScanCard = ({ scan }: { scan: ScanSummary }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-1">{scan.domain}</h3>
            <p className="text-sm text-muted-foreground">
              {formatDate(scan.createdAt)}
            </p>
          </div>
          <StatusBadge status={scan.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">SSL Grade</p>
            <Badge
              variant="outline"
              className={getGradeColor(scan.sslGrade)}
            >
              {scan.sslGrade || 'N/A'}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Security Score</p>
            <p className="font-medium">
              {scan.securityScore ? `${scan.securityScore}/100` : 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {scan.creditsUsed} {scan.creditsUsed === 1 ? 'credit' : 'credits'} used
          </p>
          {scan.status === ScanStatus.COMPLETED && (
            <Link href={`/scan/${scan.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                View Results
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const EmptyState = () => (
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
        <Link href="/scan">
          <Button>
            Start Your First Scan
          </Button>
        </Link>
      </CardContent>
    </Card>
  )

  const LoadingState = () => (
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
  )

  const ErrorState = () => (
    <Card>
      <CardContent className="p-12 text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">Error loading scans</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={fetchScans}>
          Try Again
        </Button>
      </CardContent>
    </Card>
  )

  const PaginationControls = () => (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
        {pagination.total} scans
      </p>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={!pagination.hasPrev}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={pagination.page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={!pagination.hasNext}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Scan History</h1>
        <p className="text-muted-foreground">
          View and manage your security scan history
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
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
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value={ScanStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={ScanStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={ScanStatus.RUNNING}>Running</SelectItem>
                <SelectItem value={ScanStatus.FAILED}>Failed</SelectItem>
                <SelectItem value={ScanStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none"
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="rounded-l-none"
              >
                Cards
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {error ? (
        <ErrorState />
      ) : isLoading ? (
        <LoadingState />
      ) : scans.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'cards' ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scans.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <div className="mt-6">
              <PaginationControls />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SSL Grade</TableHead>
                  <TableHead>Security Score</TableHead>
                  <TableHead>Scan Date</TableHead>
                  <TableHead>Credits Used</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium">{scan.domain}</TableCell>
                    <TableCell>
                      <StatusBadge status={scan.status} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getGradeColor(scan.sslGrade)}
                      >
                        {scan.sslGrade || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {scan.securityScore ? `${scan.securityScore}/100` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(scan.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {scan.creditsUsed} {scan.creditsUsed === 1 ? 'credit' : 'credits'}
                    </TableCell>
                    <TableCell className="text-right">
                      {scan.status === ScanStatus.COMPLETED && (
                        <Link href={`/scan/${scan.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {pagination.totalPages > 1 && (
            <PaginationControls />
          )}
        </div>
      )}
    </div>
  )
}