import { prisma } from '../prisma'
import { Market, Position, OracleType, Difficulty } from '@prisma/client'

export interface CreateMarketData {
  contractId: string
  title: string
  description: string
  imageUrl?: string
  category: string
  outcomes: string[]
  minBet: bigint
  maxBet: bigint
  oracleType: OracleType
  oracleConfig: any
  startTime: Date
  endTime: Date
  tags?: string[]
  difficulty?: Difficulty
  featured?: boolean
}

export interface MarketWithPositions extends Market {
  positions: Position[]
  _count: {
    positions: number
  }
}

export interface MarketStats {
  totalVolume: bigint
  positionCount: number
  uniqueParticipants: number
  averageBet: bigint
  liquidityByOutcome: Record<number, bigint>
  oddsHistory: Array<{
    timestamp: Date
    odds: number[]
  }>
}

export class MarketService {
  // Create new market
  static async createMarket(data: CreateMarketData): Promise<Market> {
    // Initialize liquidity pool and odds for each outcome
    const outcomeCount = data.outcomes.length
    const initialLiquidity = Array(outcomeCount).fill(0)
    const initialOdds = Array(outcomeCount).fill(1 / outcomeCount)

    return await prisma.market.create({
      data: {
        contractId: data.contractId,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category,
        outcomes: data.outcomes,
        minBet: data.minBet,
        maxBet: data.maxBet,
        oracleType: data.oracleType,
        oracleConfig: data.oracleConfig,
        startTime: data.startTime,
        endTime: data.endTime,
        tags: data.tags || [],
        difficulty: data.difficulty || Difficulty.EASY,
        featured: data.featured || false,
        liquidityPool: initialLiquidity,
        currentOdds: initialOdds,
      }
    })
  }

  // Get market by ID
  static async getMarketById(id: string, includePositions: boolean = false): Promise<Market | null> {
    return await prisma.market.findUnique({
      where: { id },
      include: {
        positions: includePositions ? {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
              }
            }
          }
        } : false,
        events: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 10
        }
      }
    })
  }

  // Get market by contract ID
  static async getMarketByContractId(contractId: string): Promise<Market | null> {
    return await prisma.market.findUnique({
      where: { contractId }
    })
  }

  // Get active markets
  static async getActiveMarkets(
    page: number = 1,
    limit: number = 20,
    category?: string,
    featured?: boolean
  ): Promise<{
    markets: MarketWithPositions[]
    totalCount: number
    hasMore: boolean
  }> {
    const where: any = {
      isActive: true,
      isResolved: false,
      endTime: {
        gt: new Date()
      }
    }

    if (category) {
      where.category = category
    }

    if (featured !== undefined) {
      where.featured = featured
    }

    const [markets, totalCount] = await Promise.all([
      prisma.market.findMany({
        where,
        include: {
          positions: {
            take: 5,
            orderBy: {
              createdAt: 'desc'
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatar: true,
                }
              }
            }
          },
          _count: {
            select: {
              positions: true
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { totalVolume: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.market.count({ where })
    ])

    return {
      markets,
      totalCount,
      hasMore: page * limit < totalCount
    }
  }

  // Get resolved markets
  static async getResolvedMarkets(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    markets: MarketWithPositions[]
    totalCount: number
  }> {
    const where = {
      isResolved: true,
      isActive: true
    }

    const [markets, totalCount] = await Promise.all([
      prisma.market.findMany({
        where,
        include: {
          positions: {
            take: 5,
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              positions: true
            }
          }
        },
        orderBy: {
          resolvedAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.market.count({ where })
    ])

    return { markets, totalCount }
  }

  // Search markets
  static async searchMarkets(
    query: string,
    filters?: {
      category?: string
      difficulty?: Difficulty
      minVolume?: bigint
      isActive?: boolean
    }
  ): Promise<Market[]> {
    const where: any = {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
      isActive: filters?.isActive ?? true,
    }

    if (filters?.category) {
      where.category = filters.category
    }

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty
    }

    if (filters?.minVolume) {
      where.totalVolume = { gte: filters.minVolume }
    }

    return await prisma.market.findMany({
      where,
      orderBy: [
        { totalVolume: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 50,
    })
  }

  // Get market statistics
  static async getMarketStats(marketId: string): Promise<MarketStats> {
    const market = await prisma.market.findUnique({
      where: { id: marketId },
      include: {
        positions: {
          include: {
            user: true
          }
        }
      }
    })

    if (!market) {
      throw new Error('Market not found')
    }

    const positions = market.positions
    const totalVolume = positions.reduce((sum, pos) => sum + pos.amount, 0n)
    const uniqueParticipants = new Set(positions.map(pos => pos.userId)).size
    const averageBet = positions.length > 0 ? totalVolume / BigInt(positions.length) : 0n

    // Calculate liquidity by outcome
    const liquidityByOutcome: Record<number, bigint> = {}
    positions.forEach(pos => {
      liquidityByOutcome[pos.outcome] = (liquidityByOutcome[pos.outcome] || 0n) + pos.amount
    })

    // Get odds history (simplified - in production, you'd store this)
    const oddsHistory = [
      {
        timestamp: new Date(),
        odds: market.currentOdds as number[]
      }
    ]

    return {
      totalVolume,
      positionCount: positions.length,
      uniqueParticipants,
      averageBet,
      liquidityByOutcome,
      oddsHistory
    }
  }

  // Update market odds and liquidity
  static async updateMarketOdds(
    marketId: string, 
    newOdds: number[], 
    newLiquidity: bigint[]
  ): Promise<Market> {
    return await prisma.market.update({
      where: { id: marketId },
      data: {
        currentOdds: newOdds,
        liquidityPool: newLiquidity.map(l => l.toString()),
        updatedAt: new Date(),
      }
    })
  }

  // Update market volume
  static async updateMarketVolume(marketId: string, additionalVolume: bigint): Promise<Market> {
    const market = await prisma.market.findUnique({ where: { id: marketId } })
    if (!market) throw new Error('Market not found')

    return await prisma.market.update({
      where: { id: marketId },
      data: {
        totalVolume: market.totalVolume + additionalVolume,
        totalPositions: { increment: 1 },
        updatedAt: new Date(),
      }
    })
  }

  // Resolve market
  static async resolveMarket(
    marketId: string,
    winningOutcome: number,
    resolvedValue?: bigint
  ): Promise<Market> {
    return await prisma.market.update({
      where: { id: marketId },
      data: {
        isResolved: true,
        winningOutcome,
        resolvedValue,
        resolvedAt: new Date(),
        updatedAt: new Date(),
      }
    })
  }

  // Get markets by category
  static async getMarketsByCategory(category: string): Promise<Market[]> {
    return await prisma.market.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: [
        { featured: 'desc' },
        { totalVolume: 'desc' },
      ],
      take: 20,
    })
  }

  // Get trending markets
  static async getTrendingMarkets(limit: number = 10): Promise<Market[]> {
    // Get markets with high recent activity
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    return await prisma.market.findMany({
      where: {
        isActive: true,
        isResolved: false,
        positions: {
          some: {
            createdAt: {
              gte: oneDayAgo
            }
          }
        }
      },
      orderBy: {
        totalVolume: 'desc'
      },
      take: limit,
      include: {
        _count: {
          select: {
            positions: true
          }
        }
      }
    })
  }

  // Get markets ending soon
  static async getMarketsEndingSoon(hours: number = 24): Promise<Market[]> {
    const cutoff = new Date()
    cutoff.setHours(cutoff.getHours() + hours)

    return await prisma.market.findMany({
      where: {
        isActive: true,
        isResolved: false,
        endTime: {
          lte: cutoff,
          gt: new Date()
        }
      },
      orderBy: {
        endTime: 'asc'
      },
      take: 20,
    })
  }

  // Get user's markets (positions)
  static async getUserMarkets(userId: string): Promise<{
    active: Market[]
    resolved: Market[]
  }> {
    const userPositions = await prisma.position.findMany({
      where: { userId },
      include: {
        market: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const markets = userPositions.map(pos => pos.market)
    const uniqueMarkets = markets.filter((market, index, self) => 
      self.findIndex(m => m.id === market.id) === index
    )

    const active = uniqueMarkets.filter(market => !market.isResolved)
    const resolved = uniqueMarkets.filter(market => market.isResolved)

    return { active, resolved }
  }

  // Add market event
  static async addMarketEvent(
    marketId: string,
    type: string,
    data: any
  ): Promise<void> {
    await prisma.marketEvent.create({
      data: {
        marketId,
        type,
        data,
      }
    })
  }

  // Feature/unfeature market
  static async toggleMarketFeatured(marketId: string, featured: boolean): Promise<Market> {
    return await prisma.market.update({
      where: { id: marketId },
      data: {
        featured,
        updatedAt: new Date(),
      }
    })
  }

  // Deactivate market
  static async deactivateMarket(marketId: string): Promise<Market> {
    return await prisma.market.update({
      where: { id: marketId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      }
    })
  }

  // Get market categories
  static async getMarketCategories(): Promise<Array<{ category: string; count: number }>> {
    const results = await prisma.market.groupBy({
      by: ['category'],
      where: {
        isActive: true
      },
      _count: true,
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    })

    return results.map(result => ({
      category: result.category,
      count: result._count
    }))
  }
}

export default MarketService