import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

interface ServiceStatus {
  status: "healthy" | "unhealthy"
  responseTime?: number
  error?: string
}

interface HealthResponse {
  status: "healthy" | "unhealthy"
  timestamp: string
  services: {
    database: ServiceStatus
    api: ServiceStatus
  }
}

export async function GET() {
  const timestamp = new Date().toISOString()
  const services: HealthResponse["services"] = {
    database: { status: "unhealthy" },
    api: { status: "healthy" }
  }

  // Test database connection
  const dbStart = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    const responseTime = Date.now() - dbStart
    services.database = {
      status: "healthy",
      responseTime
    }
  } catch (error) {
    services.database = {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown database error"
    }
  }

  // Determine overall status
  const isHealthy = Object.values(services).every(service => service.status === "healthy")
  const overallStatus: "healthy" | "unhealthy" = isHealthy ? "healthy" : "unhealthy"

  const response: HealthResponse = {
    status: overallStatus,
    timestamp,
    services
  }

  const statusCode = isHealthy ? 200 : 503

  return NextResponse.json(response, { status: statusCode })
}