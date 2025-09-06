'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Clock, 
  Users, 
  DollarSign,
  Star,
  AlertCircle
} from 'lucide-react'
import { formatEther, formatUnits } from 'viem'
import { cn } from '@/lib/utils'

export interface MarketData {
  id: string
  contractId: string
  title: string
  description: string
  imageUrl?: string
  category: string
  outcomes: string[]
  totalVolume: bigint
  totalPositions: number
  currentOdds: number[]
  liquidityPool: bigint[]
  endTime: Date
  isResolved: boolean
  winningOutcome?: number
  featured: boolean
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  shieldEnabled: boolean
  recentPositions?: Array<{
    user: {
      id: string
      username?: string
      displayName?: string
      avatar?: string
    }
    amount: bigint
    outcome: number
    createdAt: Date
  }>
}

interface MarketCardProps {
  market: MarketData
  onPlaceBet?: (marketId: string, outcome: number) => void
  onViewDetails?: (marketId: string) => void
  className?: string
  variant?: 'default' | 'compact' | 'featured'
}

export function MarketCard({ 
  market, 
  onPlaceBet, 
  onViewDetails, 
  className,
  variant = 'default'
}: MarketCardProps) {
  const isEndingSoon = new Date(market.endTime).getTime() - Date.now() < 24 * 60 * 60 * 1000
  const timeRemaining = getTimeRemaining(market.endTime)
  const maxOdds = Math.max(...market.currentOdds)
  const minOdds = Math.min(...market.currentOdds)
  const mostLikelyOutcome = market.currentOdds.indexOf(maxOdds)

  const difficultyColors = {
    EASY: 'bg-green-500/10 text-green-600 border-green-500/20',
    MEDIUM: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    HARD: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    EXPERT: 'bg-red-500/10 text-red-600 border-red-500/20'
  }

  const cardVariants = {
    default: 'h-auto',
    compact: 'h-48',
    featured: 'h-80 border-vaultor-primary/50 bg-gradient-to-br from-vaultor-primary/5 to-transparent'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    >
      <Card className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-xl hover:shadow-vaultor-primary/10",
        "border border-border/50 hover:border-vaultor-primary/30 backdrop-blur-sm",
        cardVariants[variant],
        className
      )}>
        <CardHeader className="relative pb-3">
          {market.featured && (
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {market.category}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", difficultyColors[market.difficulty])}
                >
                  {market.difficulty}
                </Badge>
                {market.shieldEnabled && (
                  <Badge variant="outline" className="text-xs border-shield-gold/30 text-shield-gold">
                    <Shield className="w-3 h-3 mr-1" />
                    Shield
                  </Badge>
                )}
              </div>

              <h3 className="font-semibold text-sm md:text-base leading-tight mb-1 line-clamp-2 group-hover:text-vaultor-primary transition-colors">
                {market.title}
              </h3>

              {variant !== 'compact' && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {market.description}
                </p>
              )}
            </div>

            {market.imageUrl && (
              <img
                src={market.imageUrl}
                alt={market.title}
                className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover ml-3"
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Market Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>{formatEther(market.totalVolume)} ETH</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{market.totalPositions}</span>
            </div>
            <div className={cn(
              "flex items-center gap-1",
              isEndingSoon && "text-orange-500"
            )}>
              <Clock className="w-3 h-3" />
              <span>{timeRemaining}</span>
            </div>
          </div>

          {/* Outcomes */}
          <div className="space-y-2 mb-4">
            {market.outcomes.map((outcome, index) => {
              const odds = market.currentOdds[index]
              const liquidity = market.liquidityPool[index]
              const percentage = (odds * 100).toFixed(1)
              const isWinning = market.winningOutcome === index
              const isMostLikely = index === mostLikelyOutcome

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border transition-all",
                    "hover:bg-muted/50 cursor-pointer",
                    market.isResolved && isWinning && "bg-green-500/10 border-green-500/30",
                    !market.isResolved && isMostLikely && "bg-vaultor-primary/10 border-vaultor-primary/30"
                  )}
                  onClick={() => !market.isResolved && onPlaceBet?.(market.id, index)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      market.isResolved && isWinning ? "bg-green-500" :
                      isMostLikely ? "bg-vaultor-primary" : "bg-muted-foreground"
                    )} />
                    <span className="text-sm truncate">{outcome}</span>
                    {market.isResolved && isWinning && (
                      <Badge className="bg-green-500 text-white text-xs">Winner</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium">{percentage}%</div>
                      <div className="text-xs text-muted-foreground">
                        {formatEther(liquidity)} ETH
                      </div>
                    </div>
                    {!market.isResolved && odds > 0 && (
                      <div className="flex items-center">
                        {index === mostLikelyOutcome ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recent Activity */}
          {variant === 'featured' && market.recentPositions && market.recentPositions.length > 0 && (
            <div className="border-t pt-3">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Recent Activity</h4>
              <div className="flex -space-x-2">
                {market.recentPositions.slice(0, 5).map((position, index) => (
                  <Avatar key={index} className="w-6 h-6 border-2 border-background">
                    <AvatarImage src={position.user.avatar} />
                    <AvatarFallback className="text-xs">
                      {position.user.displayName?.[0] || position.user.username?.[0] || '?'}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {market.recentPositions.length > 5 && (
                  <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs">+{market.recentPositions.length - 5}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warning for ending soon */}
          {isEndingSoon && !market.isResolved && (
            <div className="flex items-center gap-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-orange-600">Ending soon!</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails?.(market.id)
            }}
            className="flex-1"
          >
            View Details
          </Button>

          {!market.isResolved && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onPlaceBet?.(market.id, mostLikelyOutcome)
              }}
              className="flex-1 bg-gradient-to-r from-vaultor-primary to-vaultor-primary/80 hover:from-vaultor-primary/90 hover:to-vaultor-primary/70"
            >
              Place Bet
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function getTimeRemaining(endTime: Date): string {
  const now = new Date()
  const end = new Date(endTime)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) return 'Ended'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export default MarketCard