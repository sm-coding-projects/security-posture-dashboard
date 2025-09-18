import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "./skeleton"
import { Card, CardContent, CardHeader } from "./card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2 className={spinnerVariants({ size, variant })} />
    </div>
  )
)
Spinner.displayName = "Spinner"

interface LoadingTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
}

const LoadingText = React.forwardRef<HTMLDivElement, LoadingTextProps>(
  ({ className, text = "Loading...", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}
      {...props}
    >
      <Spinner size="sm" variant="muted" />
      <span>{text}</span>
    </div>
  )
)
LoadingText.displayName = "LoadingText"

const PageLoading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { text?: string }
>(({ className, text = "Loading...", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-h-[50vh] flex-col items-center justify-center space-y-4",
      className
    )}
    {...props}
  >
    <Spinner size="xl" />
    <p className="text-lg text-muted-foreground">{text}</p>
  </div>
))
PageLoading.displayName = "PageLoading"

interface InlineLoadingProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "default"
}

const InlineLoading = React.forwardRef<HTMLSpanElement, InlineLoadingProps>(
  ({ className, size = "sm", ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex items-center", className)}
      {...props}
    >
      <Spinner size={size} variant="muted" />
    </span>
  )
)
InlineLoading.displayName = "InlineLoading"

interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  showHeader?: boolean
  showFooter?: boolean
  lines?: number
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, showHeader = true, showFooter = false, lines = 3, ...props }, ref) => (
    <Card ref={ref} className={className} {...props}>
      {showHeader && (
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4",
              i === lines - 1 ? "w-2/3" : "w-full"
            )}
          />
        ))}
      </CardContent>
      {showFooter && (
        <div className="flex items-center justify-between p-6 pt-0">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      )}
    </Card>
  )
)
CardSkeleton.displayName = "CardSkeleton"

interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number
  columns?: number
  showHeader?: boolean
}

const TableSkeleton = React.forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ className, rows = 5, columns = 4, showHeader = true, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton
                    className={cn(
                      "h-4",
                      colIndex === 0 ? "w-3/4" : "w-full"
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
)
TableSkeleton.displayName = "TableSkeleton"

interface MetricCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const MetricCardSkeleton = React.forwardRef<HTMLDivElement, MetricCardSkeletonProps>(
  ({ className, ...props }, ref) => (
    <Card ref={ref} className={className} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-3 w-full" />
        </div>
      </CardContent>
    </Card>
  )
)
MetricCardSkeleton.displayName = "MetricCardSkeleton"

interface GridSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  items?: number
  columns?: 1 | 2 | 3 | 4
  itemHeight?: string
}

const GridSkeleton = React.forwardRef<HTMLDivElement, GridSkeletonProps>(
  ({ className, items = 6, columns = 3, itemHeight = "h-32", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid gap-4",
        {
          "grid-cols-1": columns === 1,
          "grid-cols-1 md:grid-cols-2": columns === 2,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": columns === 3,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": columns === 4,
        },
        className
      )}
      {...props}
    >
      {Array.from({ length: items }).map((_, i) => (
        <Skeleton key={i} className={cn("w-full rounded-lg", itemHeight)} />
      ))}
    </div>
  )
)
GridSkeleton.displayName = "GridSkeleton"

interface ButtonLoadingProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
}

const ButtonLoading = React.forwardRef<HTMLButtonElement, ButtonLoadingProps>(
  ({ loading = false, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" variant="white" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
)
ButtonLoading.displayName = "ButtonLoading"

export {
  Spinner,
  LoadingText,
  PageLoading,
  InlineLoading,
  CardSkeleton,
  TableSkeleton,
  MetricCardSkeleton,
  GridSkeleton,
  ButtonLoading,
  spinnerVariants,
}