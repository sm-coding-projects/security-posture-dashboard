"use client"

import { cn } from "@/lib/utils"

interface GaugeProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showValue?: boolean
  label?: string
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-48 h-48'
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl'
}

export function Gauge({
  value,
  max = 100,
  size = 'md',
  className,
  showValue = true,
  label
}: GaugeProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

  // Color based on score
  const getColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    if (score >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getStrokeColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#eab308'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-muted-foreground/20"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={getStrokeColor(percentage)}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('font-bold', textSizeClasses[size], getColor(percentage))}>
              {Math.round(value)}
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-sm text-muted-foreground text-center">{label}</span>
      )}
    </div>
  )
}