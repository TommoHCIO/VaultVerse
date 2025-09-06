'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Shield, 
  TrendingUp, 
  Calculator, 
  Zap, 
  AlertTriangle,
  Info,
  Wallet,
  Target
} from 'lucide-react'
import { formatEther, parseEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface BetPlacementProps {
  isOpen: boolean
  onClose: () => void
  market: {
    id: string
    title: string
    outcomes: string[]
    currentOdds: number[]
    minBet: bigint
    maxBet: bigint
    shieldEnabled: boolean
    endTime: Date
  }
  selectedOutcome?: number
  onPlaceBet: (data: {
    marketId: string
    outcome: number
    amount: bigint
    shieldEnabled: boolean
    shieldPercentage: number
  }) => Promise<void>
  userTokenVersion?: 'V1' | 'V2' | 'V3' | 'V4' | 'V5'
}

export function BetPlacement({
  isOpen,
  onClose,
  market,
  selectedOutcome = 0,
  onPlaceBet,
  userTokenVersion = 'V1'
}: BetPlacementProps) {
  const { address } = useAccount()
  const { data: balance } = useBalance({ address })

  const [outcome, setOutcome] = useState(selectedOutcome)
  const [betAmount, setBetAmount] = useState('')
  const [shieldEnabled, setShieldEnabled] = useState(false)
  const [shieldPercentage, setShieldPercentage] = useState(10)
  const [isPlacing, setIsPlacing] = useState(false)

  // Calculate values
  const betAmountBigInt = betAmount ? parseEther(betAmount) : 0n
  const odds = market.currentOdds[outcome] || 0
  const potentialWin = betAmountBigInt * BigInt(Math.floor(odds * 100)) / 100n
  const shieldCost = shieldEnabled ? (betAmountBigInt * BigInt(shieldPercentage)) / 1000n : 0n
  const totalCost = betAmountBigInt + shieldCost

  // Shield discounts based on token version
  const shieldDiscounts = {
    V1: 5,   // 5% discount
    V2: 10,  // 10% discount
    V3: 15,  // 15% discount
    V4: 20,  // 20% discount
    V5: 25   // 25% discount
  }

  const userDiscount = shieldDiscounts[userTokenVersion]
  const discountedShieldCost = shieldCost * BigInt(100 - userDiscount) / 100n

  // Validation
  const isValidAmount = betAmountBigInt >= market.minBet && betAmountBigInt <= market.maxBet
  const hasEnoughBalance = balance && totalCost <= balance.value
  const canPlaceBet = isValidAmount && hasEnoughBalance && !isPlacing

  useEffect(() => {
    setOutcome(selectedOutcome)
  }, [selectedOutcome])

  const handlePlaceBet = async () => {
    if (!canPlaceBet) return

    setIsPlacing(true)
    try {
      await onPlaceBet({
        marketId: market.id,
        outcome,
        amount: betAmountBigInt,
        shieldEnabled,
        shieldPercentage
      })
      
      toast.success('Bet placed successfully!')
      onClose()
      setBetAmount('')
      setShieldEnabled(false)
    } catch (error) {
      toast.error('Failed to place bet: ' + (error as Error).message)
    } finally {
      setIsPlacing(false)
    }
  }

  const quickAmounts = ['0.1', '0.5', '1', '5']

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-vaultor-primary" />
            Place Your Bet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Market Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h3 className="font-medium text-sm mb-2 line-clamp-2">{market.title}</h3>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Min: {formatEther(market.minBet)} ETH</span>
                <span>Max: {formatEther(market.maxBet)} ETH</span>
                <span>Ends: {new Date(market.endTime).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Outcome Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Outcome</Label>
            <div className="grid gap-2">
              {market.outcomes.map((outcomeText, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Card
                    className={cn(
                      "cursor-pointer border-2 transition-all",
                      outcome === index 
                        ? "border-vaultor-primary bg-vaultor-primary/10" 
                        : "border-border hover:border-vaultor-primary/50"
                    )}
                    onClick={() => setOutcome(index)}
                  >
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full transition-all",
                          outcome === index ? "bg-vaultor-primary" : "bg-muted-foreground"
                        )} />
                        <span className="text-sm font-medium">{outcomeText}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {(market.currentOdds[index] * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {market.currentOdds[index].toFixed(2)}x
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bet Amount */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Bet Amount</Label>
              {balance && (
                <span className="text-xs text-muted-foreground">
                  Balance: {formatEther(balance.value)} ETH
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="pr-16 text-lg"
                  step="0.01"
                  min="0"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  ETH
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(amount)}
                    className="flex-1"
                  >
                    {amount} ETH
                  </Button>
                ))}
                {balance && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(formatEther(balance.value * 8n / 10n))}
                    className="text-xs"
                  >
                    Max
                  </Button>
                )}
              </div>

              {/* Validation Messages */}
              {betAmount && !isValidAmount && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    Amount must be between {formatEther(market.minBet)} and {formatEther(market.maxBet)} ETH
                  </span>
                </div>
              )}

              {betAmount && !hasEnoughBalance && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <Wallet className="w-4 h-4" />
                  <span>Insufficient balance</span>
                </div>
              )}
            </div>
          </div>

          {/* Shield Protection */}
          {market.shieldEnabled && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-shield-gold" />
                  <Label className="text-sm font-medium">Shield Protection</Label>
                  <Badge variant="outline" className="text-xs border-shield-gold/30 text-shield-gold">
                    {userDiscount}% OFF
                  </Badge>
                </div>
                <Switch
                  checked={shieldEnabled}
                  onCheckedChange={setShieldEnabled}
                />
              </div>

              <AnimatePresence>
                {shieldEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pl-6"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs">Protection Level</Label>
                        <span className="text-xs font-medium">{shieldPercentage}%</span>
                      </div>
                      <Slider
                        value={[shieldPercentage]}
                        onValueChange={([value]) => setShieldPercentage(value)}
                        max={30}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>10%</span>
                        <span>30%</span>
                      </div>
                    </div>

                    <div className="bg-shield-gold/10 border border-shield-gold/20 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-shield-gold mt-0.5" />
                        <div className="text-xs">
                          <p className="font-medium mb-1">Shield Protection Active</p>
                          <p className="text-muted-foreground">
                            If you lose, you'll receive {shieldPercentage}% of your bet back. 
                            Cost: {formatEther(discountedShieldCost)} ETH (V{userTokenVersion.slice(1)} discount applied)
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <Separator />

          {/* Bet Summary */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Bet Summary
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bet Amount:</span>
                <span className="font-medium">{formatEther(betAmountBigInt)} ETH</span>
              </div>

              {shieldEnabled && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shield Cost:</span>
                    <span className="font-medium text-shield-gold">
                      {formatEther(discountedShieldCost)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Original: {formatEther(shieldCost)} ETH</span>
                    <span className="text-green-500">Saved: {formatEther(shieldCost - discountedShieldCost)} ETH</span>
                  </div>
                </>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Potential Win:</span>
                <span className="font-medium text-green-500">
                  {formatEther(potentialWin)} ETH
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-base">
                <span className="font-medium">Total Cost:</span>
                <span className="font-bold">{formatEther(totalCost)} ETH</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Potential Profit:</span>
                <span className="font-medium text-green-500">
                  +{formatEther(potentialWin - betAmountBigInt)} ETH
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isPlacing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlaceBet}
              disabled={!canPlaceBet}
              className="flex-1 bg-gradient-to-r from-vaultor-primary to-vaultor-primary/80"
            >
              {isPlacing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Bet...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Place Bet
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BetPlacement