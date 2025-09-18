import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { ScanStatus } from "@prisma/client";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const offset = (page - 1) * limit;

    // Filter parameters
    const domain = searchParams.get("domain");
    const status = searchParams.get("status");

    // Build where clause
    const where: any = {
      userId: session.user.id,
    };

    // Add domain filter (case-insensitive contains)
    if (domain && domain.trim()) {
      where.domain = {
        contains: domain.trim(),
        mode: 'insensitive',
      };
    }

    // Add status filter
    if (status && Object.values(ScanStatus).includes(status as ScanStatus)) {
      where.status = status as ScanStatus;
    }

    // Get total count for pagination metadata
    const total = await prisma.scan.count({
      where,
    });

    // Calculate total pages
    const pages = Math.ceil(total / limit);

    // Fetch scans with pagination and filtering
    const scans = await prisma.scan.findMany({
      where,
      select: {
        id: true,
        domain: true,
        status: true,
        sslGrade: true,
        securityScore: true,
        creditsUsed: true,
        scanType: true,
        errorMessage: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
    });

    // Return response with scans and pagination metadata
    return NextResponse.json({
      scans,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching scans:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}