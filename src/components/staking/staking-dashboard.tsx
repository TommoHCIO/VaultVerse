'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Coins, 
  TrendingUp, 
  Lock, 
  Unlock, 
  Shield, 
  Crown, 
  Star,
  Zap,
  Gift,
  Calendar,
  Clock,
  Target,
  Flame,
  Award,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react'
import { formatEther, parseEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TokenVersion {
  level: 'V1' | 'V2' | 'V3' | 'V4' | 'V5'
  name: string
  requiredBalance: bigint
  stakingMultiplier: number // APY percentage
  shieldDiscount: number // percentage
  governanceWeight: number
  hasEarlyAccess: boolean
  hasRevenueSharing: boolean
  color: string
  icon: React.ComponentType<{ className?: string }>
}

const tokenVersions: TokenVersion[] = [
  {
    level: 'V1',
    name: 'Foundation',
    requiredBalance: parseEther('1000'),
    stakingMultiplier: 1,
    shieldDiscount: 5,
    governanceWeight: 1,
    hasEarlyAccess: false,
    hasRevenueSharing: false,
    color: 'from-gray-500 to-gray-600',
    icon: Shield
  },
  {
    level: 'V2',
    name: 'Enhanced',
    requiredBalance: parseEther('5000'),
    stakingMultiplier: 2,
    shieldDiscount: 10,
    governanceWeight: 2,
    hasEarlyAccess: true,
    hasRevenueSharing: false,
    color: 'from-blue-500 to-blue-600',
    icon: Zap
  },
  {
    level: 'V3',
    name: 'Premium',
    requiredBalance: parseEther('25000'),
    stakingMultiplier: 3,
    shieldDiscount: 15,
    governanceWeight: 5,
    hasEarlyAccess: true,
    hasRevenueSharing: false,
    color: 'from-purple-500 to-purple-600',
    icon: Star
  },
  {
    level: 'V4',
    name: 'Elite',
    requiredBalance: parseEther('100000'),
    stakingMultiplier: 5,
    shieldDiscount: 20,
    governanceWeight: 10,
    hasEarlyAccess: true,
    hasRevenueSharing: true,
    color: 'from-orange-500 to-red-500',
    icon: Crown
  },
  {
    level: 'V5',
    name: 'Legendary',
    requiredBalance: parseEther('500000'),
    stakingMultiplier: 10,
    shieldDiscount: 25,
    governanceWeight: 25,
    hasEarlyAccess: true,
    hasRevenueSharing: true,
    color: 'from-yellow-400 to-yellow-600',
    icon: Award
  }
]

interface StakeData {
  amount: bigint
  startDate: Date
  endDate: Date
  currentAPY: number
  earnedRewards: bigint
  version: 'V1' | 'V2' | 'V3' | 'V4' | 'V5'
  isActive: boolean
}

interface StakingDashboardProps {
  className?: string
}

export function StakingDashboard({ className }: StakingDashboardProps) {
  const { address } = useAccount()
  const { data: balance } = useBalance({ address })

  // Mock user data - in production, fetch from contracts/API
  const [userTokenBalance] = useState(parseEther('15000')) // 15,000 tokens
  const [stakedAmount] = useState(parseEther('10000')) // 10,000 tokens staked
  const [currentVersion, setCurrentVersion] = useState<TokenVersion>(tokenVersions[1]) // V2
  const [totalRewards] = useState(parseEther('250')) // 250 tokens earned
  
  // Staking form state
  const [stakeAmount, setStakeAmount] = useState('')
  const [stakeDuration, setStakeDuration] = useState([90]) // days
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)

  // Mock staking positions
  const [stakes] = useState<StakeData[]>([
    {
      amount: parseEther('5000'),
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      currentAPY: 2,
      earnedRewards: parseEther('125'),
      version: 'V2',
      isActive: true
    },
    {
      amount: parseEther('5000'),
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      currentAPY: 2,
      earnedRewards: parseEther('125'),
      version: 'V2',
      isActive: true
    }
  ])

  const totalStaked = stakes.reduce((sum, stake) => sum + stake.amount, 0n)
  const totalEarned = stakes.reduce((sum, stake) => sum + stake.earnedRewards, 0n)
  const totalBalance = userTokenBalance + stakedAmount

  // Calculate version progression
  const getVersionForBalance = (balance: bigint): TokenVersion => {
    for (let i = tokenVersions.length - 1; i >= 0; i--) {
      if (balance >= tokenVersions[i].requiredBalance) {
        return tokenVersions[i]
      }
    }
    return tokenVersions[0]
  }

  const nextVersion = tokenVersions.find(v => v.requiredBalance > totalBalance)
  const progressToNext = nextVersion 
    ? Number(totalBalance * 100n / nextVersion.requiredBalance)
    : 100

  const handleStake = async () => {
    if (!stakeAmount || isStaking) return

    setIsStaking(true)
    try {
      // In production, interact with TokenManager contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Staked ${stakeAmount} tokens successfully!`)
      setStakeAmount('')
    } catch (error) {
      toast.error('Failed to stake tokens')
    } finally {
      setIsStaking(false)
    }
  }

  const handleUnstake = async (stakeId: string) => {
    setIsUnstaking(true)
    try {
      // In production, interact with TokenManager contract
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Tokens unstaked successfully!')
    } catch (error) {
      toast.error('Failed to unstake tokens')
    } finally {
      setIsUnstaking(false)
    }
  }

  const handleClaimRewards = async () => {
    try {
      // In production, interact with TokenManager contract
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Rewards claimed successfully!')
    } catch (error) {
      toast.error('Failed to claim rewards')
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-vaultor-primary to-blue-500 bg-clip-text text-transparent">
            Token Staking
          </h1>
          <p className="text-muted-foreground">
            Stake tokens to unlock utilities and earn rewards
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Current Version Status */}
      <Card className={cn(
        "relative overflow-hidden bg-gradient-to-br",
        currentVersion.color,
        "text-white"
      )}>
        <div className="absolute inset-0 bg-black/20" />
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <currentVersion.icon className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{currentVersion.level}</h2>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {currentVersion.name}
                  </Badge>
                </div>
                <p className="text-white/80">
                  {formatEther(totalBalance)} / {formatEther(currentVersion.requiredBalance)} tokens
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-white/80">Total Value</div>
              <div className="text-2xl font-bold">
                {formatEther(totalBalance)} VLTR
              </div>
            </div>
          </div>

          {nextVersion && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-white/80 mb-2">
                <span>Progress to {nextVersion.level}</span>
                <span>{progressToNext.toFixed(1)}%</span>
              </div>
              <Progress value={progressToNext} className="h-2 bg-white/20" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-vaultor-primary" />
              <span className="text-sm text-muted-foreground">Available</span>
            </div>
            <p className="text-2xl font-bold">{formatEther(userTokenBalance)}</p>
            <p className="text-xs text-muted-foreground">VLTR</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Staked</span>
            </div>
            <p className="text-2xl font-bold">{formatEther(totalStaked)}</p>
            <p className="text-xs text-muted-foreground">VLTR</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Earned</span>
            </div>
            <p className="text-2xl font-bold">{formatEther(totalEarned)}</p>
            <p className="text-xs text-muted-foreground">VLTR</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">APY</span>
            </div>
            <p className="text-2xl font-bold">{currentVersion.stakingMultiplier}%</p>
            <p className="text-xs text-muted-foreground">Current</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Staking Form */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="stake" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stake">Stake Tokens</TabsTrigger>
              <TabsTrigger value="unstake">Manage Stakes</TabsTrigger>
            </TabsList>

            <TabsContent value="stake" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Stake Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Amount to Stake</Label>
                      <span className="text-sm text-muted-foreground">
                        Available: {formatEther(userTokenBalance)} VLTR
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="pr-16"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        VLTR
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {['25%', '50%', '75%', '100%'].map((percent) => (
                        <Button
                          key={percent}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const percentage = parseInt(percent) / 100
                            setStakeAmount(formatEther(userTokenBalance * BigInt(Math.floor(percentage * 100)) / 100n))
                          }}
                        >
                          {percent}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Staking Duration</Label>
                      <span className="text-sm text-muted-foreground">
                        {stakeDuration[0]} days
                      </span>
                    </div>
                    <Slider
                      value={stakeDuration}
                      onValueChange={setStakeDuration}
                      max={365}
                      min={30}
                      step={30}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>30 days</span>
                      <span>365 days</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated APY:</span>
                      <span className="font-medium">{currentVersion.stakingMultiplier}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lock Duration:</span>
                      <span className="font-medium">{stakeDuration[0]} days</span>
                    </div>
                    {stakeAmount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Yearly Rewards:</span>
                        <span className="font-medium text-green-500">
                          {(parseFloat(stakeAmount) * currentVersion.stakingMultiplier / 100).toFixed(2)} VLTR
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleStake}
                    disabled={!stakeAmount || isStaking || parseEther(stakeAmount) > userTokenBalance}
                    className="w-full"
                  >
                    {isStaking ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Staking...
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Stake Tokens
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unstake" className="mt-6">
              <div className="space-y-4">
                {stakes.map((stake, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={cn(
                            "text-white",
                            tokenVersions.find(v => v.level === stake.version)?.color
                          )}>
                            {stake.version}
                          </Badge>
                          <div>
                            <p className="font-medium">{formatEther(stake.amount)} VLTR</p>
                            <p className="text-sm text-muted-foreground">
                              {stake.currentAPY}% APY
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-medium text-green-500">
                            +{formatEther(stake.earnedRewards)} VLTR
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Earned rewards
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClaimRewards}
                          >
                            <Gift className="w-4 h-4 mr-1" />
                            Claim
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnstake(index.toString())}
                            disabled={isUnstaking}
                          >
                            <Unlock className="w-4 h-4 mr-1" />
                            Unstake
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Unlocks: {stake.endDate.toLocaleDateString()}</span>
                          <span>{Math.floor((stake.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left</span>
                        </div>
                        <Progress 
                          value={100 - (stake.endDate.getTime() - Date.now()) / (stake.endDate.getTime() - stake.startDate.getTime()) * 100}
                          className="h-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {stakes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active stakes found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Version Benefits */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Version Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Staking APY</span>
                  <span className="font-medium">{currentVersion.stakingMultiplier}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Shield Discount</span>
                  <span className="font-medium text-green-500">{currentVersion.shieldDiscount}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Governance Weight</span>
                  <span className="font-medium">{currentVersion.governanceWeight}x</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Early Access</span>
                  <Badge variant={currentVersion.hasEarlyAccess ? 'default' : 'secondary'}>
                    {currentVersion.hasEarlyAccess ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenue Sharing</span>
                  <Badge variant={currentVersion.hasRevenueSharing ? 'default' : 'secondary'}>
                    {currentVersion.hasRevenueSharing ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Version Roadmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Version Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tokenVersions.map((version, index) => {
                const isUnlocked = totalBalance >= version.requiredBalance
                const isCurrent = version.level === currentVersion.level
                const Icon = version.icon

                return (
                  <div
                    key={version.level}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all",
                      isCurrent && "bg-vaultor-primary/10 border-vaultor-primary/30",
                      isUnlocked && !isCurrent && "bg-green-500/10 border-green-500/30",
                      !isUnlocked && "opacity-50"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5",
                      isCurrent && "text-vaultor-primary",
                      isUnlocked && !isCurrent && "text-green-500",
                      !isUnlocked && "text-muted-foreground"
                    )} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{version.level}</span>
                        {isCurrent && <Badge>Current</Badge>}
                        {isUnlocked && !isCurrent && <Badge className="bg-green-500">Unlocked</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatEther(version.requiredBalance)} VLTR
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {version.stakingMultiplier}% APY
                    </span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default StakingDashboard