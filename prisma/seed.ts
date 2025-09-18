import { PrismaClient, UserTier, ScanStatus, ScanType } from '@prisma/client'

const prisma = new PrismaClient()

function getRandomSecurityScore(): number {
  return Math.floor(Math.random() * 41) + 60 // Score between 60-100
}

function getRandomGrade(): string {
  const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']
  return grades[Math.floor(Math.random() * grades.length)]
}

function generateSSLDetails() {
  return {
    issuer: 'Let\'s Encrypt Authority X3',
    validFrom: new Date('2024-01-01').toISOString(),
    validTo: new Date('2024-12-31').toISOString(),
    keySize: 2048,
    signatureAlgorithm: 'SHA256withRSA',
    certificateChain: [
      {
        commonName: '*.example.com',
        organization: 'Example Corp',
        country: 'US'
      }
    ],
    sslVersion: 'TLSv1.3',
    cipherSuite: 'TLS_AES_256_GCM_SHA384'
  }
}

function generateHeaderDetails() {
  return {
    securityHeaders: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': 'default-src \'self\'; script-src \'self\' \'unsafe-inline\'',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    missingHeaders: [
      'X-XSS-Protection',
      'Permissions-Policy'
    ],
    score: Math.floor(Math.random() * 30) + 70,
    recommendations: [
      'Add X-XSS-Protection header',
      'Consider implementing Permissions-Policy'
    ]
  }
}

function generateDNSDetails() {
  return {
    records: {
      A: ['192.168.1.1', '192.168.1.2'],
      AAAA: ['2001:db8::1'],
      MX: [
        { priority: 10, exchange: 'mail.example.com' }
      ],
      TXT: [
        'v=spf1 include:_spf.google.com ~all',
        'google-site-verification=abcd1234'
      ]
    },
    nameservers: ['ns1.example.com', 'ns2.example.com'],
    dnssec: true,
    ttl: 300,
    resolverInfo: {
      queryTime: Math.floor(Math.random() * 50) + 10,
      server: '8.8.8.8'
    }
  }
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create or update test user
  console.log('👤 Creating test user...')
  const testUser = await prisma.user.upsert({
    where: {
      email: 'test@example.com'
    },
    update: {
      credits: 100,
      tier: UserTier.FREE
    },
    create: {
      email: 'test@example.com',
      name: 'Test User',
      tier: UserTier.FREE,
      credits: 100,
      totalScans: 0
    }
  })
  console.log(`✅ Test user created/updated: ${testUser.email} (ID: ${testUser.id})`)

  // Sample domains for scans
  const sampleDomains = [
    'example.com',
    'google.com',
    'github.com',
    'stackoverflow.com',
    'mozilla.org'
  ]

  console.log('🔍 Creating sample scans...')

  // Delete existing scans for the test user to avoid duplicates
  await prisma.scan.deleteMany({
    where: { userId: testUser.id }
  })

  const scansToCreate = Math.floor(Math.random() * 3) + 3 // 3-5 scans

  for (let i = 0; i < scansToCreate; i++) {
    const domain = sampleDomains[i % sampleDomains.length]
    const securityScore = getRandomSecurityScore()
    const sslGrade = getRandomGrade()

    const scan = await prisma.scan.create({
      data: {
        userId: testUser.id,
        domain: domain,
        status: ScanStatus.COMPLETED,
        securityScore: securityScore,
        sslGrade: sslGrade,
        scanType: ScanType.BASIC,
        creditsUsed: 1,
        sslDetails: generateSSLDetails(),
        headerDetails: generateHeaderDetails(),
        dnsDetails: generateDNSDetails(),
        vulnerabilities: {
          critical: Math.floor(Math.random() * 3),
          high: Math.floor(Math.random() * 5),
          medium: Math.floor(Math.random() * 8),
          low: Math.floor(Math.random() * 12),
          info: Math.floor(Math.random() * 15)
        },
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
        updatedAt: new Date()
      }
    })

    console.log(`✅ Created scan for ${domain} - Score: ${securityScore}, Grade: ${sslGrade} (ID: ${scan.id})`)
  }

  // Update user's total scan count
  await prisma.user.update({
    where: { id: testUser.id },
    data: { totalScans: scansToCreate }
  })

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📊 Created ${scansToCreate} sample scans for test user`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('🔌 Disconnecting from database...')
    await prisma.$disconnect()
  })