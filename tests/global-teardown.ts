import { PrismaClient } from '@prisma/client'

async function globalTeardown() {
  console.log('🧹 Running global test teardown...')
  
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
    
    console.log('✅ Test database cleaned up')
  } catch (error) {
    console.error('❌ Error cleaning up test database:', error)
  } finally {
    await prisma.$disconnect()
  }

  console.log('✅ Global teardown completed')
}

export default globalTeardown