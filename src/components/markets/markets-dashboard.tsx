'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Star, 
  Grid, 
  List,
  RefreshCw,
  Plus,
  Target,
  Zap
} from 'lucide-react'
import { MarketCard, MarketData } from './market-card'
import { BetPlacement } from './bet-placement'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface MarketsDashboardProps {
  className?: string
}

// Mock data - in production, this would come from your API/database
const mockMarkets: MarketData[] = [
  {
    id: '1',
    contractId: '0x123...',
    title: 'Will Bitcoin reach $100,000 by end of 2024?',
    description: 'Predict whether Bitcoin will reach or exceed $100,000 USD by December 31, 2024.',
    category: 'Crypto',
    outcomes: ['Yes', 'No'],
    totalVolume: BigInt('5000000000000000000'), // 5 ETH
    totalPositions: 42,
    currentOdds: [0.65, 0.35],
    liquidityPool: [BigInt('3250000000000000000'), BigInt('1750000000000000000')],
    endTime: new Date(Date.now() + 86400000 * 30), // 30 days
    isResolved: false,
    featured: true,
    difficulty: 'MEDIUM' as const,
    shieldEnabled: true,
    recentPositions: [
      {
        user: { id: '1', username: 'alice', displayName: 'Alice', avatar: '/avatars/alice.jpg' },
        amount: BigInt('1000000000000000000'),
        outcome: 0,
        createdAt: new Date()
      }
    ]
  },
  {
    id: '2',
    contractId: '0x456...',
    title: 'Who will win the 2024 US Presidential Election?',
    description: 'Predict the winner of the 2024 United States Presidential Election.',
    category: 'Politics',
    outcomes: ['Democrat', 'Republican', 'Independent'],
    totalVolume: BigInt('12000000000000000000'), // 12 ETH
    totalPositions: 156,
    currentOdds: [0.48, 0.47, 0.05],
    liquidityPool: [BigInt('5760000000000000000'), BigInt('5640000000000000000'), BigInt('600000000000000000')],
    endTime: new Date(Date.now() + 86400000 * 90), // 90 days
    isResolved: false,
    featured: true,
    difficulty: 'HARD' as const,
    shieldEnabled: true,
  },
  {
    id: '3',
    contractId: '0x789...',
    title: 'Will Ethereum 2.0 staking yield exceed 5% in 2024?',
    description: 'Will the annual percentage yield for Ethereum 2.0 staking exceed 5% at any point in 2024?',
    category: 'Crypto',
    outcomes: ['Yes', 'No'],
    totalVolume: BigInt('2500000000000000000'), // 2.5 ETH
    totalPositions: 28,
    currentOdds: [0.72, 0.28],
    liquidityPool: [BigInt('1800000000000000000'), BigInt('700000000000000000')],
    endTime: new Date(Date.now() + 86400000 * 60), // 60 days
    isResolved: false,
    featured: false,
    difficulty: 'EASY' as const,
    shieldEnabled: true,
  }
]

const categories = ['All', 'Crypto', 'Politics', 'Sports', 'Technology', 'Entertainment']

export function MarketsDashboard({ className }: MarketsDashboardProps) {
  const [activeTab, setActiveTab] = useState('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [markets, setMarkets] = useState<MarketData[]>(mockMarkets)
  
  // Bet Placement State
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null)
  const [selectedOutcome, setSelectedOutcome] = useState<number>(0)
  const [showBetPlacement, setShowBetPlacement] = useState(false)

  // Filter markets based on search and category
  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         market.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || market.category === selectedCategory
    const matchesTab = activeTab === 'active' ? !market.isResolved : 
                      activeTab === 'resolved' ? market.isResolved : true
    
    return matchesSearch && matchesCategory && matchesTab
  })

  // Sort markets
  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    // Featured markets first
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    
    // Then by volume
    if (a.totalVolume > b.totalVolume) return -1
    if (a.totalVolume < b.totalVolume) return 1
    
    return 0
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // In production, fetch fresh data from API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Markets refreshed!')
    } catch (error) {
      toast.error('Failed to refresh markets')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePlaceBet = (marketId: string, outcome: number) => {
    const market = markets.find(m => m.id === marketId)
    if (market) {
      setSelectedMarket(market)
      setSelectedOutcome(outcome)
      setShowBetPlacement(true)
    }
  }

  const handleViewDetails = (marketId: string) => {
    toast.info(`Viewing details for market ${marketId}`)
    // In production, navigate to market details page
  }

  const handleBetSubmit = async (betData: {
    marketId: string
    outcome: number
    amount: bigint
    shieldEnabled: boolean
    shieldPercentage: number
  }) => {
    // In production, this would interact with smart contracts
    console.log('Placing bet:', betData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update market volume locally
    setMarkets(prev => prev.map(market => 
      market.id === betData.marketId 
        ? { ...market, totalVolume: market.totalVolume + betData.amount, totalPositions: market.totalPositions + 1 }
        : market
    ))
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-vaultor-primary to-vaultor-primary/70 bg-clip-text text-transparent">
            Prediction Arena
          </h1>
          <p className="text-muted-foreground">
            Battle in the markets with Shield protection
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>

          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-vaultor-primary" />
              <span className="text-sm text-muted-foreground">Active Markets</span>
            </div>
            <p className="text-2xl font-bold">{markets.filter(m => !m.isResolved).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Total Volume</span>
            </div>
            <p className="text-2xl font-bold">
              {(Number(markets.reduce((sum, m) => sum + m.totalVolume, 0n)) / 1e18).toFixed(1)} ETH
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Total Bets</span>
            </div>
            <p className="text-2xl font-bold">{markets.reduce((sum, m) => sum + m.totalPositions, 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Ending Soon</span>
            </div>
            <p className="text-2xl font-bold">
              {markets.filter(m => !m.isResolved && new Date(m.endTime).getTime() - Date.now() < 86400000).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Active
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="resolved" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Resolved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <MarketGrid 
            markets={sortedMarkets.filter(m => !m.isResolved)} 
            viewMode={viewMode}
            onPlaceBet={handlePlaceBet}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          <MarketGrid 
            markets={sortedMarkets.filter(m => m.featured)} 
            viewMode={viewMode}
            onPlaceBet={handlePlaceBet}
            onViewDetails={handleViewDetails}
            variant="featured"
          />
        </TabsContent>

        <TabsContent value="resolved" className="mt-6">
          <MarketGrid 
            markets={sortedMarkets.filter(m => m.isResolved)} 
            viewMode={viewMode}
            onPlaceBet={handlePlaceBet}
            onViewDetails={handleViewDetails}
          />
        </TabsContent>
      </Tabs>

      {/* No Results */}
      {sortedMarkets.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No markets found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button onClick={() => {
            setSearchQuery('')
            setSelectedCategory('All')
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Bet Placement Modal */}
      {selectedMarket && (
        <BetPlacement
          isOpen={showBetPlacement}
          onClose={() => setShowBetPlacement(false)}
          market={selectedMarket}
          selectedOutcome={selectedOutcome}
          onPlaceBet={handleBetSubmit}
          userTokenVersion="V3" // This would come from user context
        />
      )}
    </div>
  )
}

interface MarketGridProps {
  markets: MarketData[]
  viewMode: 'grid' | 'list'
  onPlaceBet: (marketId: string, outcome: number) => void
  onViewDetails: (marketId: string) => void
  variant?: 'default' | 'featured'
}

function MarketGrid({ markets, viewMode, onPlaceBet, onViewDetails, variant = 'default' }: MarketGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          : "space-y-4"
      )}
    >
      <AnimatePresence>
        {markets.map((market) => (
          <motion.div key={market.id} variants={itemVariants}>
            <MarketCard
              market={market}
              onPlaceBet={onPlaceBet}
              onViewDetails={onViewDetails}
              variant={variant === 'featured' ? 'featured' : viewMode === 'list' ? 'compact' : 'default'}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default MarketsDashboard