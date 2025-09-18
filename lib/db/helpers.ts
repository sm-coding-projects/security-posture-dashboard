import { User, Scan, ScanStatus, ScanType, UserTier, TransactionType } from '@prisma/client'
import { prisma } from './prisma'

export interface CreateUserData {
  email: string
  name?: string
  image?: string
  githubId?: string
}

export interface UpdateScanData {
  status?: ScanStatus
  sslGrade?: string
  securityScore?: number
  sslDetails?: Record<string, unknown>
  headerDetails?: Record<string, unknown>
  dnsDetails?: Record<string, unknown>
  vulnerabilities?: Record<string, unknown>
  errorMessage?: string
}

export interface GetUserScansOptions {
  page?: number
  limit?: number
  status?: ScanStatus
  scanType?: ScanType
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { id }
    })
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    throw new Error('Failed to fetch user')
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email }
    })
  } catch (error) {
    console.error('Error fetching user by email:', error)
    throw new Error('Failed to fetch user')
  }
}

export async function createUser(data: CreateUserData): Promise<User> {
  try {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        image: data.image,
        githubId: data.githubId,
        tier: UserTier.FREE,
        credits: 100
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('Failed to create user')
  }
}

export async function deductCredits(
  userId: string,
  amount: number,
  description: string
): Promise<{ success: boolean; newBalance: number }> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        throw new Error('User not found')
      }

      if (user.credits < amount) {
        throw new Error('Insufficient credits')
      }

      const newBalance = user.credits - amount

      await tx.user.update({
        where: { id: userId },
        data: { credits: newBalance }
      })

      await tx.creditTransaction.create({
        data: {
          userId,
          amount: -amount,
          type: TransactionType.DEDUCT,
          description,
          balance: newBalance
        }
      })

      return { success: true, newBalance }
    })

    return result
  } catch (error) {
    console.error('Error deducting credits:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to deduct credits')
  }
}

export async function createScan(
  userId: string,
  domain: string,
  scanType: ScanType = ScanType.BASIC,
  creditsUsed: number = 1
): Promise<Scan> {
  try {
    return await prisma.scan.create({
      data: {
        userId,
        domain,
        status: ScanStatus.PENDING,
        scanType,
        creditsUsed
      }
    })
  } catch (error) {
    console.error('Error creating scan:', error)
    throw new Error('Failed to create scan')
  }
}

export async function updateScan(
  scanId: string,
  data: UpdateScanData
): Promise<Scan> {
  try {
    const updateData: Record<string, unknown> = { ...data }

    if (data.status === ScanStatus.COMPLETED) {
      updateData.completedAt = new Date()
    }

    return await prisma.scan.update({
      where: { id: scanId },
      data: updateData
    })
  } catch (error) {
    console.error('Error updating scan:', error)
    throw new Error('Failed to update scan')
  }
}

export async function getUserScans(
  userId: string,
  options: GetUserScansOptions = {}
): Promise<{ scans: Scan[]; total: number; hasMore: boolean }> {
  try {
    const { page = 1, limit = 10, status, scanType } = options
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { userId }
    if (status) where.status = status
    if (scanType) where.scanType = scanType

    const [scans, total] = await Promise.all([
      prisma.scan.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.scan.count({ where })
    ])

    const hasMore = skip + scans.length < total

    return { scans, total, hasMore }
  } catch (error) {
    console.error('Error fetching user scans:', error)
    throw new Error('Failed to fetch scans')
  }
}

export async function getScanById(scanId: string): Promise<Scan | null> {
  try {
    return await prisma.scan.findUnique({
      where: { id: scanId }
    })
  } catch (error) {
    console.error('Error fetching scan by ID:', error)
    throw new Error('Failed to fetch scan')
  }
}