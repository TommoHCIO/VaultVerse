import { chromium, FullConfig } from '@playwright/test'
import { PrismaClient } from '@prisma/client'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Running global test setup...')
  
  // Initialize database for testing
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
      }
    }
  })

  try {
    // Clean up test database
    await prisma.$transaction([
      prisma.eventParticipation.deleteMany(),
      prisma.position.deleteMany(),
      prisma.vaultorEvent.deleteMany(),
      prisma.market.deleteMany(),
      prisma.userAchievement.deleteMany(),
      prisma.achievement.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.transaction.deleteMany(),
      prisma.socialConnection.deleteMany(),
      prisma.user.deleteMany(),
    ])

    // Create test data
    await createTestData(prisma)
    
    console.log('✅ Test database setup completed')
  } catch (error) {
    console.error('❌ Error setting up test database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }

  // Browser setup for authentication state
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  // Create authenticated state for tests
  await page.goto(config.projects[0].use?.baseURL || 'http://localhost:3000')
  
  // Mock wallet connection for tests
  await page.evaluate(() => {
    localStorage.setItem('test_wallet_connected', 'true')
    localStorage.setItem('test_wallet_address', '0x742d35cc6675c05c4c16502d1b2a4b7b8f8f8b8f')
    localStorage.setItem('test_user_token', 'test_jwt_token_here')
  })
  
  // Save authenticated state
  await page.context().storageState({ path: 'tests/fixtures/auth-state.json' })
  await browser.close()

  console.log('✅ Global setup completed')
}

async function createTestData(prisma: PrismaClient) {
  // Create test users
  const testUser = await prisma.user.create({
    data: {
      id: 'test-user-1',
      walletAddress: '0x742d35cc6675c05c4c16502d1b2a4b7b8f8f8b8f',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@vaultorverse.com',
      tokenVersion: 'V2',
      totalTokenBalance: BigInt('15000000000000000000000'), // 15,000 tokens
      stakedAmount: BigInt('10000000000000000000000'), // 10,000 tokens
      level: 5,
      xp: 2500,
      totalWagered: BigInt('5000000000000000000'), // 5 ETH
      totalWinnings: BigInt('3000000000000000000'), // 3 ETH
      winRate: 0.65,
      streak: 3,
      maxStreak: 7,
    }
  })

  // Create test markets
  const cryptoMarket = await prisma.market.create({
    data: {
      id: 'test-market-1',
      contractId: '0x123456789abcdef',
      title: 'Will Bitcoin reach $100,000 by end of 2024?',
      description: 'Predict whether Bitcoin will reach or exceed $100,000 USD by December 31, 2024.',
      category: 'Crypto',
      outcomes: ['Yes', 'No'],
      minBet: BigInt('100000000000000000'), // 0.1 ETH
      maxBet: BigInt('10000000000000000000'), // 10 ETH
      totalVolume: BigInt('5000000000000000000'), // 5 ETH
      totalPositions: 25,
      oracleType: 'CHAINLINK_PRICE',
      oracleConfig: { feedAddress: '0xabc...', threshold: 100000 },
      startTime: new Date(Date.now() - 86400000), // 1 day ago
      endTime: new Date(Date.now() + 2592000000), // 30 days from now
      currentOdds: [0.65, 0.35],
      liquidityPool: ['3250000000000000000', '1750000000000000000'],
      tags: ['crypto', 'bitcoin', 'prediction'],
      difficulty: 'MEDIUM',
      featured: true,
      shieldEnabled: true,
    }
  })

  // Create test positions
  await prisma.position.create({
    data: {
      userId: testUser.id,
      marketId: cryptoMarket.id,
      outcome: 0,
      amount: BigInt('1000000000000000000'), // 1 ETH
      odds: 0.65,
      potentialWin: BigInt('1538461538461538461'), // ~1.538 ETH
      shieldEnabled: true,
      shieldPercentage: 20,
      shieldCost: BigInt('50000000000000000'), // 0.05 ETH
    }
  })

  // Create test events
  const liveEvent = await prisma.vaultorEvent.create({
    data: {
      id: 'test-event-1',
      title: 'Crypto Knowledge Championship',
      description: 'Test your knowledge of cryptocurrency and blockchain technology!',
      questionCount: 25,
      duration: 900, // 15 minutes
      entryFee: BigInt('100000000000000000'), // 0.1 ETH
      maxParticipants: 1000,
      totalPrizePool: BigInt('50000000000000000000'), // 50 ETH
      prizeDistribution: {
        positions: 10,
        percentages: [40, 20, 15, 10, 5, 3, 2, 2, 2, 1]
      },
      scheduledAt: new Date(Date.now() - 600000), // 10 minutes ago
      startedAt: new Date(Date.now() - 300000), // 5 minutes ago
      status: 'LIVE',
      participantCount: 247,
      questions: [
        {
          text: 'What is the maximum supply of Bitcoin?',
          options: ['21 million', '100 million', '50 million', 'Unlimited'],
          correctAnswer: 0
        }
      ]
    }
  })

  // Create test achievements
  await prisma.achievement.create({
    data: {
      name: 'First Bet',
      description: 'Place your first prediction bet',
      type: 'VOLUME',
      requirement: { minAmount: 1 },
      xpReward: 100,
      tokenReward: BigInt('10000000000000000000'), // 10 tokens
      rarity: 'COMMON',
      category: 'Getting Started',
    }
  })

  console.log('✅ Test data created successfully')
}

export default globalSetup