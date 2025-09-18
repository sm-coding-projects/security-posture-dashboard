#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'
import { UserTier, ScanStatus, ScanType } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error', 'warn', 'info'],
})

interface TestResults {
  connectionTest: boolean
  userCreation: boolean
  scanCreation: boolean
  dataRetrieval: boolean
  cleanup: boolean
  error?: string
}

async function testDatabaseConnection(): Promise<TestResults> {
  const results: TestResults = {
    connectionTest: false,
    userCreation: false,
    scanCreation: false,
    dataRetrieval: false,
    cleanup: false,
  }

  let testUserId: string | null = null
  let testScanId: string | null = null

  try {
    console.log('🔍 Testing Prisma database connection...')

    // Test 1: Database Connection
    console.log('\n1. Testing database connection...')
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    results.connectionTest = true
    console.log('✅ Database connection successful')

    // Test 2: Create test user
    console.log('\n2. Creating test user...')
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        tier: UserTier.FREE,
        credits: 100,
      },
    })
    testUserId = testUser.id
    results.userCreation = true
    console.log(`✅ Test user created with ID: ${testUser.id}`)

    // Test 3: Create test scan
    console.log('\n3. Creating test scan...')
    const testScan = await prisma.scan.create({
      data: {
        userId: testUser.id,
        domain: 'example.com',
        status: ScanStatus.COMPLETED,
        scanType: ScanType.BASIC,
        sslGrade: 'A+',
        securityScore: 95,
        creditsUsed: 1,
        sslDetails: { version: 'TLSv1.3', cipher: 'ECDHE-RSA-AES256-GCM-SHA384' },
        headerDetails: { hsts: true, xFrameOptions: 'DENY' },
        dnsDetails: { dnssec: true, records: ['A', 'AAAA', 'MX'] },
      },
    })
    testScanId = testScan.id
    results.scanCreation = true
    console.log(`✅ Test scan created with ID: ${testScan.id}`)

    // Test 4: Retrieve and verify data
    console.log('\n4. Retrieving and verifying data...')

    // Retrieve user with scans
    const retrievedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        scans: true,
      },
    })

    if (!retrievedUser) {
      throw new Error('Failed to retrieve test user')
    }

    if (retrievedUser.scans.length !== 1) {
      throw new Error('Expected 1 scan, but found ' + retrievedUser.scans.length)
    }

    const retrievedScan = retrievedUser.scans[0]
    if (retrievedScan.domain !== 'example.com' || retrievedScan.securityScore !== 95) {
      throw new Error('Scan data does not match expected values')
    }

    results.dataRetrieval = true
    console.log('✅ Data retrieval and verification successful')
    console.log(`   User: ${retrievedUser.name} (${retrievedUser.email})`)
    console.log(`   Scan: ${retrievedScan.domain} - Score: ${retrievedScan.securityScore}`)

    // Test 5: Cleanup test data
    console.log('\n5. Cleaning up test data...')

    // Delete scan first (due to foreign key constraint)
    if (testScanId) {
      await prisma.scan.delete({
        where: { id: testScanId },
      })
      console.log('✅ Test scan deleted')
    }

    // Delete user
    if (testUserId) {
      await prisma.user.delete({
        where: { id: testUserId },
      })
      console.log('✅ Test user deleted')
    }

    results.cleanup = true
    console.log('✅ Cleanup completed successfully')

  } catch (error) {
    results.error = error instanceof Error ? error.message : String(error)
    console.error('❌ Test failed:', results.error)

    // Emergency cleanup if something went wrong
    try {
      if (testScanId) {
        await prisma.scan.delete({ where: { id: testScanId } }).catch(() => {})
      }
      if (testUserId) {
        await prisma.user.delete({ where: { id: testUserId } }).catch(() => {})
      }
    } catch (cleanupError) {
      console.error('❌ Emergency cleanup failed:', cleanupError)
    }
  } finally {
    await prisma.$disconnect()
  }

  return results
}

async function printConnectionInfo() {
  console.log('🔧 Database Configuration:')
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}`)
  console.log(`   DATABASE_URL_POOLED: ${process.env.DATABASE_URL_POOLED ? '✅ Set' : '❌ Not set'}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`)
}

async function main() {
  console.log('🚀 Starting database connection test...\n')

  await printConnectionInfo()

  const results = await testDatabaseConnection()

  console.log('\n📊 Test Results Summary:')
  console.log('========================')
  console.log(`Database Connection: ${results.connectionTest ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`User Creation: ${results.userCreation ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Scan Creation: ${results.scanCreation ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Data Retrieval: ${results.dataRetrieval ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Cleanup: ${results.cleanup ? '✅ PASS' : '❌ FAIL'}`)

  const allPassed = Object.values(results).every((value, index) =>
    index === Object.values(results).length - 1 ? true : value === true
  )

  console.log('\n🎯 Overall Result:')
  if (allPassed && !results.error) {
    console.log('✅ ALL TESTS PASSED - Neon database connection is working correctly!')
  } else {
    console.log('❌ SOME TESTS FAILED - Check the error details above')
    if (results.error) {
      console.log(`Error: ${results.error}`)
    }
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Script execution failed:', error)
    process.exit(1)
  })
}

export { testDatabaseConnection, printConnectionInfo }