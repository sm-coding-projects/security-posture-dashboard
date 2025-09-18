import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate scan ID format (basic check)
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: "Invalid scan ID" },
        { status: 400 }
      );
    }

    // Fetch scan from database
    const scan = await prisma.scan.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        domain: true,
        status: true,
        sslGrade: true,
        securityScore: true,
        sslDetails: true,
        headerDetails: true,
        dnsDetails: true,
        vulnerabilities: true,
        creditsUsed: true,
        scanType: true,
        errorMessage: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // Check if scan exists
    if (!scan) {
      return NextResponse.json(
        { error: "Scan not found" },
        { status: 404 }
      );
    }

    // Verify scan belongs to authenticated user
    if (scan.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Return complete scan data (excluding userId for security)
    const { userId, ...scanData } = scan;

    return NextResponse.json(scanData, { status: 200 });

  } catch (error) {
    console.error("Error fetching scan:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}