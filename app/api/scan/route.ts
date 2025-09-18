import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { scanRequestSchema } from "@/lib/validators/domain";
import { prisma } from "@/lib/db/prisma";
import { ScanStatus, ScanType, TransactionType } from "@prisma/client";
import { z } from "zod";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate request body with schema
    let validatedData;
    try {
      validatedData = scanRequestSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Invalid request data",
            details: error.issues.map(e => ({
              field: e.path.join('.'),
              message: e.message
            }))
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Invalid domain" },
        { status: 400 }
      );
    }

    const { domain, scanType } = validatedData;

    // Get user with current credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        credits: true,
        tier: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has sufficient credits
    const creditsRequired = 1; // Basic scan costs 1 credit

    if (user.credits < creditsRequired) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          required: creditsRequired,
          available: user.credits
        },
        { status: 402 }
      );
    }

    // Determine scan type based on request
    let prismaTypeName: ScanType;
    switch (scanType) {
      case 'vulnerability':
        prismaTypeName = ScanType.BASIC;
        break;
      case 'ssl':
      case 'dns':
      case 'port':
        prismaTypeName = ScanType.ADVANCED;
        break;
      default:
        prismaTypeName = ScanType.BASIC;
    }

    // Create scan record in database
    const scan = await prisma.scan.create({
      data: {
        userId: user.id,
        domain: domain,
        status: ScanStatus.PENDING,
        scanType: prismaTypeName,
        creditsUsed: creditsRequired,
      },
      select: {
        id: true,
        domain: true,
        status: true,
        scanType: true,
        createdAt: true
      }
    });

    // Deduct credits from user account
    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: creditsRequired
        },
        totalScans: {
          increment: 1
        }
      }
    });

    // Record credit transaction
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        amount: -creditsRequired,
        type: TransactionType.DEDUCT,
        description: `Scan for ${domain}`,
        balance: user.credits - creditsRequired,
      }
    });

    // TODO: Start orchestrated scan asynchronously (non-blocking)
    // This would typically trigger a background job or queue system
    // For now, we'll just update the scan status to RUNNING
    prisma.scan.update({
      where: { id: scan.id },
      data: { status: ScanStatus.RUNNING }
    }).catch(console.error); // Fire and forget

    // Return scan ID immediately for polling
    return NextResponse.json({
      scanId: scan.id,
      domain: scan.domain,
      status: scan.status,
      scanType: scan.scanType,
      creditsUsed: creditsRequired,
      createdAt: scan.createdAt
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating scan:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}