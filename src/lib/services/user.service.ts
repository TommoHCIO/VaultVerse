import { prisma } from '../prisma'
import { TokenVersion, User } from '@prisma/client'
import { Address } from 'viem'

export interface CreateUserData {
  walletAddress: string
  email?: string
  username?: string
  displayName?: string
  referredBy?: string
}

export interface UpdateUserData {
  email?: string
  username?: string
  displayName?: string
  avatar?: string
  bio?: string
}

export interface UserStats {
  totalWagered: bigint
  totalWinnings: bigint
  winRate: number
  streak: number
  maxStreak: number
  level: number
  xp: number
}

export class UserService {
  // Create new user
  static async createUser(data: CreateUserData): Promise<User> {
    const userData: any = {
      walletAddress: data.walletAddress.toLowerCase(),
      email: data.email,
      username: data.username,
      displayName: data.displayName || data.username,
    }

    // Handle referral if provided
    if (data.referredBy) {
      const referrer = await this.getUserByWallet(data.referredBy)
      if (referrer) {
        userData.referredById = referrer.id
      }
    }

    return await prisma.user.create({
      data: userData,
      include: {
        achievements: true,
        socialConnections: true,
      }
    })
  }

  // Get user by wallet address
  static async getUserByWallet(walletAddress: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress.toLowerCase()
      },
      include: {
        positions: {
          include: {
            market: true
          }
        },
        eventParticipations: {
          include: {
            event: true
          }
        },
        achievements: {
          include: {
            achievement: true
          }
        },
        socialConnections: true,
        referrals: true,
      }
    })
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        positions: {
          include: {
            market: true
          }
        },
        eventParticipations: true,
        achievements: {
          include: {
            achievement: true
          }
        },
        socialConnections: true,
      }
    })
  }

  // Update user profile
  static async updateUser(id: string, data: UpdateUserData): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        lastActive: new Date(),
      }
    })
  }

  // Update user token balance and version
  static async updateTokenBalance(
    userId: string, 
    newBalance: bigint, 
    stakedAmount?: bigint
  ): Promise<User> {
    const tokenVersion = this.calculateTokenVersion(newBalance + (stakedAmount || 0n))
    
    return await prisma.user.update({
      where: { id: userId },
      data: {
        totalTokenBalance: newBalance,
        stakedAmount: stakedAmount || undefined,
        tokenVersion,
        updatedAt: new Date(),
      }
    })
  }

  // Calculate token version based on total balance
  static calculateTokenVersion(totalBalance: bigint): TokenVersion {
    const balance = Number(totalBalance) // Convert for comparison
    
    if (balance >= 500000) return TokenVersion.V5
    if (balance >= 100000) return TokenVersion.V4
    if (balance >= 25000) return TokenVersion.V3
    if (balance >= 5000) return TokenVersion.V2
    return TokenVersion.V1
  }

  // Update user statistics
  static async updateUserStats(userId: string, stats: Partial<UserStats>): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        ...stats,
        updatedAt: new Date(),
      }
    })
  }

  // Add XP and check for level up
  static async addXP(userId: string, xpAmount: number): Promise<{ user: User; leveledUp: boolean; newLevel?: number }> {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User not found')

    const newXP = user.xp + xpAmount
    const newLevel = Math.floor(newXP / 1000) + 1 // Simple leveling: 1000 XP per level
    const leveledUp = newLevel > user.level

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXP,
        level: newLevel,
        updatedAt: new Date(),
      }
    })

    return {
      user: updatedUser,
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
    }
  }

  // Update user streak
  static async updateStreak(userId: string, won: boolean): Promise<User> {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User not found')

    let newStreak = won ? user.streak + 1 : 0
    let newMaxStreak = Math.max(user.maxStreak, newStreak)

    return await prisma.user.update({
      where: { id: userId },
      data: {
        streak: newStreak,
        maxStreak: newMaxStreak,
        updatedAt: new Date(),
      }
    })
  }

  // Get user leaderboard position
  static async getUserLeaderboardPosition(userId: string): Promise<{
    position: number
    totalUsers: number
  }> {
    const userRank = await prisma.$queryRaw<[{ position: bigint }]>`
      SELECT COUNT(*) + 1 as position
      FROM users
      WHERE total_winnings > (
        SELECT total_winnings
        FROM users
        WHERE id = ${userId}
      )
    `

    const totalUsers = await prisma.user.count()

    return {
      position: Number(userRank[0]?.position || totalUsers),
      totalUsers,
    }
  }

  // Get top users by winnings
  static async getTopUsers(limit: number = 10): Promise<User[]> {
    return await prisma.user.findMany({
      take: limit,
      orderBy: {
        totalWinnings: 'desc'
      },
      include: {
        achievements: {
          include: {
            achievement: true
          }
        }
      }
    })
  }

  // Search users
  static async searchUsers(query: string, limit: number = 20): Promise<User[]> {
    return await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
          { walletAddress: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      take: limit,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        walletAddress: true,
        level: true,
        tokenVersion: true,
        isVerified: true,
      }
    })
  }

  // Get user activity summary
  static async getUserActivity(userId: string, days: number = 30): Promise<{
    totalBets: number
    totalVolume: bigint
    marketsParticipated: number
    eventsParticipated: number
    winRate: number
  }> {
    const since = new Date()
    since.setDate(since.getDate() - days)

    const positions = await prisma.position.findMany({
      where: {
        userId,
        createdAt: {
          gte: since
        }
      },
      include: {
        market: true
      }
    })

    const eventParticipations = await prisma.eventParticipation.findMany({
      where: {
        userId,
        createdAt: {
          gte: since
        }
      }
    })

    const totalVolume = positions.reduce((sum, pos) => sum + pos.amount, 0n)
    const winningPositions = positions.filter(pos => pos.isWinning === true).length
    const resolvedPositions = positions.filter(pos => pos.isWinning !== null).length
    
    return {
      totalBets: positions.length,
      totalVolume,
      marketsParticipated: new Set(positions.map(p => p.marketId)).size,
      eventsParticipated: eventParticipations.length,
      winRate: resolvedPositions > 0 ? winningPositions / resolvedPositions : 0,
    }
  }

  // Get user referrals
  static async getUserReferrals(userId: string): Promise<{
    referrals: User[]
    totalReferrals: number
    activeReferrals: number
  }> {
    const referrals = await prisma.user.findMany({
      where: {
        referredById: userId
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        createdAt: true,
        lastActive: true,
        level: true,
        totalWagered: true,
      }
    })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeReferrals = referrals.filter(
      ref => ref.lastActive >= thirtyDaysAgo
    ).length

    return {
      referrals,
      totalReferrals: referrals.length,
      activeReferrals,
    }
  }

  // Soft delete user (deactivate)
  static async deactivateUser(userId: string): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      }
    })
  }

  // Reactivate user
  static async reactivateUser(userId: string): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
        lastActive: new Date(),
        updatedAt: new Date(),
      }
    })
  }
}

export default UserService