'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Lock,
  Unlock,
  Shield,
  Trophy,
  Star,
  TrendingUp,
  Calendar,
  Clock,
  Zap,
  Plus,
  Minus,
  Info,
  CheckCircle,
  AlertCircle,
  Gift,
  Crown,
  Diamond,
  Sparkles,
  Target,
  Award,
  Calculator,
  BarChart3,
  Activity,
  DollarSign
} from 'lucide-react';

// Import animation components
import {
  AnimatedButton,
  ScrollReveal,
  InteractiveCard,
  AnimatedProgress,
  StaggerContainer,
  FloatingFeedback
} from '@/components/animations';

// Import premium token showcase
import { V1V5TokenShowcase } from '@/components/tokens/V1V5TokenShowcase';

// Premium Staking System for VaultorVerse 2025
export default function StakingPage() {
  const [selectedPool, setSelectedPool] = useState<string>('V3');
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number>(90);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState<'stake' | 'rewards' | 'analytics'>('stake');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedTokenVersion, setSelectedTokenVersion] = useState('V3');

  // Enhanced user staking data with luxury metrics
  const userStaking = {
    totalStaked: 125000,
    totalRewards: 28500,
    activeStakes: 8,
    nextRewardDate: new Date('2025-01-08'),
    stakingPower: 125000,
    multiplier: 4.2,
    wealthTier: 'Ultra-High-Net-Worth',
    annualizedReturn: 42.8,
    portfolioValue: 2850000,
    liquidityRatio: 15.4
  };

  // Premium staking pools with enhanced V1-V5 data
  const stakingPools = [
    {
      id: 'V1',
      name: 'V1 Foundation Shield',
      icon: Shield,
      description: 'Entry-level staking with essential Shield protection benefits',
      apy: 18.5,
      minStake: 100,
      maxStake: 50000,
      lockPeriods: [
        { days: 7, multiplier: 1.0, bonus: 0, tier: 'Basic' },
        { days: 30, multiplier: 1.5, bonus: 5, tier: 'Standard' },
        { days: 90, multiplier: 2.0, bonus: 15, tier: 'Premium' },
        { days: 180, multiplier: 2.5, bonus: 25, tier: 'Elite' },
        { days: 365, multiplier: 3.0, bonus: 50, tier: 'Legendary' }
      ],
      totalStaked: 3200000,
      participants: 15420,
      color: 'from-gray-600 via-gray-500 to-gray-400',
      benefits: ['10% Shield Protection', 'Standard Support', 'Market Access', 'Basic Analytics'],
      tier: 'Foundation',
      rarity: 'Common'
    },
    {
      id: 'V2',
      name: 'V2 Enhanced Power',
      icon: Zap,
      description: 'Advanced staking with 2x multipliers and exclusive market access',
      apy: 28.8,
      minStake: 250,
      maxStake: 100000,
      lockPeriods: [
        { days: 14, multiplier: 1.2, bonus: 0, tier: 'Basic' },
        { days: 60, multiplier: 1.8, bonus: 10, tier: 'Enhanced' },
        { days: 120, multiplier: 2.3, bonus: 20, tier: 'Premium' },
        { days: 270, multiplier: 2.8, bonus: 35, tier: 'Elite' },
        { days: 365, multiplier: 3.5, bonus: 60, tier: 'Legendary' }
      ],
      totalStaked: 2400000,
      participants: 8920,
      color: 'from-blue-600 via-blue-500 to-blue-400',
      benefits: ['20% Shield Protection', '2x Staking Rewards', 'Governance Voting', 'Premium Markets'],
      tier: 'Enhanced',
      rarity: 'Rare'
    },
    {
      id: 'V3',
      name: 'V3 Premium Elite',
      icon: Trophy,
      description: 'High-tier benefits with governance power and revenue sharing',
      apy: 42.4,
      minStake: 500,
      maxStake: 250000,
      lockPeriods: [
        { days: 30, multiplier: 2.0, bonus: 15, tier: 'Premium' },
        { days: 90, multiplier: 3.0, bonus: 30, tier: 'Elite' },
        { days: 180, multiplier: 4.0, bonus: 50, tier: 'Executive' },
        { days: 365, multiplier: 5.0, bonus: 100, tier: 'Legendary' }
      ],
      totalStaked: 1800000,
      participants: 3840,
      color: 'from-luxury via-champagne-gold to-luxury',
      benefits: ['30% Shield Protection', 'Revenue Sharing', 'VIP Support', 'Exclusive Analytics'],
      tier: 'Premium',
      rarity: 'Epic'
    },
    {
      id: 'V4',
      name: 'V4 Executive Diamond',
      icon: Diamond,
      description: 'Ultra-premium tier with institutional-grade benefits',
      apy: 58.7,
      minStake: 1000,
      maxStake: 500000,
      lockPeriods: [
        { days: 60, multiplier: 3.0, bonus: 25, tier: 'Executive' },
        { days: 180, multiplier: 4.5, bonus: 50, tier: 'Diamond' },
        { days: 365, multiplier: 6.0, bonus: 100, tier: 'Legendary' }
      ],
      totalStaked: 950000,
      participants: 1250,
      color: 'from-cyan-400 via-blue-300 to-cyan-400',
      benefits: ['50% Shield Protection', 'Alpha Generation', 'Institutional Tools', 'White-glove Service'],
      tier: 'Executive',
      rarity: 'Legendary'
    },
    {
      id: 'V5',
      name: 'V5 Legendary Crown',
      icon: Crown,
      description: 'The ultimate staking tier with maximum rewards and legendary status',
      apy: 78.3,
      minStake: 2500,
      maxStake: 1000000,
      lockPeriods: [
        { days: 90, multiplier: 4.0, bonus: 50, tier: 'Crown' },
        { days: 180, multiplier: 6.0, bonus: 100, tier: 'Legendary' },
        { days: 365, multiplier: 8.0, bonus: 200, tier: 'Mythic' }
      ],
      totalStaked: 650000,
      participants: 340,
      color: 'from-purple-600 via-pink-500 to-purple-600',
      benefits: ['75% Shield Protection', 'Maximum APY', 'Complete Access', 'Legendary Status'],
      tier: 'Legendary',
      rarity: 'Mythic'
    }
  ];

  // Enhanced active stakes with luxury details
  const activeStakes = [
    {
      id: '1',
      pool: 'V3 Premium Elite',
      amount: 45000,
      duration: 180,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2025-03-30'),
      currentRewards: 12485,
      apy: 42.4,
      status: 'active',
      tier: 'Executive',
      multiplier: 4.0,
      shieldProtection: 30
    },
    {
      id: '2',
      pool: 'V4 Executive Diamond',
      amount: 25000,
      duration: 365,
      startDate: new Date('2024-11-15'),
      endDate: new Date('2025-11-15'),
      currentRewards: 8920,
      apy: 58.7,
      status: 'active',
      tier: 'Diamond',
      multiplier: 6.0,
      shieldProtection: 50
    },
    {
      id: '3',
      pool: 'V5 Legendary Crown',
      amount: 15000,
      duration: 365,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2025-12-01'),
      currentRewards: 7095,
      apy: 78.3,
      status: 'active',
      tier: 'Mythic',
      multiplier: 8.0,
      shieldProtection: 75
    }
  ];

  const selectedPoolData = stakingPools.find(pool => pool.id === selectedPool);
  const selectedLockPeriod = selectedPoolData?.lockPeriods.find(period => period.days === selectedDuration);

  const calculateEstimatedRewards = () => {
    if (!stakeAmount || !selectedPoolData || !selectedLockPeriod) return 0;
    const amount = parseFloat(stakeAmount);
    const dailyRate = (selectedPoolData.apy / 100) / 365;
    const rewards = amount * dailyRate * selectedDuration * selectedLockPeriod.multiplier;
    return rewards + (rewards * selectedLockPeriod.bonus / 100);
  };

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) < (selectedPoolData?.minStake || 0)) {
      setFeedbackMessage('Invalid stake amount');
      setShowFeedback(true);
      return;
    }
    setShowConfirmation(true);
  };

  const confirmStake = () => {
    setShowConfirmation(false);
    setFeedbackMessage(`Successfully staked ${stakeAmount} ${selectedPool} tokens for ${selectedDuration} days!`);
    setShowFeedback(true);
    setStakeAmount('');
  };

  const formatDuration = (days: number) => {
    if (days < 30) return `${days} days`;
    if (days < 365) return `${Math.round(days / 30)} months`;
    return `${Math.round(days / 365)} year${days > 365 ? 's' : ''}`;
  };

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Basic': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'Standard': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Premium': return 'text-luxury bg-luxury/10 border-luxury/20';
      case 'Elite': return 'text-champagne-gold bg-champagne-gold/10 border-champagne-gold/20';
      case 'Executive': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'Diamond': return 'text-blue-300 bg-blue-300/10 border-blue-300/20';
      case 'Legendary': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Mythic': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="max-w-[1800px] mx-auto px-8 py-12">
        {/* Luxury Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-luxury via-champagne-gold to-luxury rounded-3xl flex items-center justify-center shadow-2xl shadow-luxury/30 border-2 border-luxury/20"
            >
              <Lock className="w-12 h-12 text-gray-900" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7A3 50%, #D4AF37 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Elite Token Staking
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
            >
              Unlock the full potential of VaultorVerse with our premium V1-V5 token staking ecosystem. 
              From foundation protection to legendary status, choose your tier and maximize your wealth.
            </motion.p>
          </div>
        </ScrollReveal>

        {/* Premium User Wealth Dashboard */}
        <ScrollReveal delay={0.1}>
          <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 mb-16">
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-8">
              {/* Wealth Profile */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-luxury to-champagne-gold rounded-2xl flex items-center justify-center border-2 border-luxury/30 shadow-lg">
                    <Crown className="w-10 h-10 text-gray-900" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-luxury rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-gray-900" />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">Elite Staker</h2>
                    <div className="px-3 py-1 bg-luxury/10 border border-luxury/30 rounded-lg">
                      <span className="text-luxury font-bold text-sm">{userStaking.wealthTier}</span>
                    </div>
                  </div>
                  <p className="text-gray-400">Portfolio Value: <span className="text-luxury font-bold">${(userStaking.portfolioValue / 1000000).toFixed(2)}M</span></p>
                  <p className="text-gray-400">Annual Return: <span className="text-emerald-400 font-bold">{userStaking.annualizedReturn}%</span></p>
                </div>
              </div>

              {/* Wealth Metrics */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                  <div className="text-2xl font-bold text-luxury mb-1">
                    ${(userStaking.totalStaked / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Total Staked</div>
                </div>
                
                <div className="text-center bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">
                    ${(userStaking.totalRewards / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Total Rewards</div>
                </div>
                
                <div className="text-center bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                  <div className="text-2xl font-bold text-champagne-gold mb-1">
                    {userStaking.activeStakes}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Active Stakes</div>
                </div>
                
                <div className="text-center bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {userStaking.multiplier}x
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Avg Multiplier</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Premium Tab Navigation */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-4 mb-12">
            {[
              { id: 'stake', label: 'Token Showcase & Staking', icon: Trophy },
              { id: 'rewards', label: 'Active Stakes & Rewards', icon: Gift },
              { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 }
            ].map(tab => (
              <AnimatedButton
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'secondary'}
                size="lg"
                onClick={() => setActiveTab(tab.id as any)}
                className={activeTab === tab.id ? 'btn-luxury shadow-lg shadow-luxury/20' : 'glass-light border border-gray-700 hover:border-luxury/30'}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </AnimatedButton>
            ))}
          </div>
        </ScrollReveal>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'stake' && (
              <div className="space-y-12">
                {/* V1-V5 Token Showcase */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-luxury" />
                    V1-V5 Token Tiers
                  </h3>
                  <V1V5TokenShowcase 
                    selectedVersion={selectedTokenVersion}
                    onVersionSelect={(version) => {
                      setSelectedTokenVersion(version);
                      setSelectedPool(version);
                    }}
                  />
                </div>

                {/* Staking Configuration */}
                {selectedPoolData && (
                  <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8">
                    <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                      <Calculator className="w-8 h-8 text-champagne-gold" />
                      Stake Configuration for {selectedPoolData.name}
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Staking Form */}
                      <div>
                        {/* Amount Input */}
                        <div className="mb-8">
                          <label className="block text-lg font-semibold text-gray-300 mb-4">
                            Stake Amount
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={stakeAmount}
                              onChange={(e) => setStakeAmount(e.target.value)}
                              placeholder={`Minimum: ${selectedPoolData.minStake}`}
                              className="w-full p-6 bg-gray-800/50 border-2 border-gray-700 rounded-2xl text-white text-xl focus:outline-none focus:border-luxury transition-colors"
                            />
                            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                              {selectedPool} Tokens
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3 text-sm">
                            <span className="text-gray-400">
                              Min: {selectedPoolData.minStake.toLocaleString()} • Max: {selectedPoolData.maxStake.toLocaleString()}
                            </span>
                            <span className="text-emerald-400 font-semibold">
                              Available: 125,000
                            </span>
                          </div>
                        </div>

                        {/* Lock Period Selection */}
                        <div className="mb-8">
                          <label className="block text-lg font-semibold text-gray-300 mb-4">
                            Lock Period & Tier
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedPoolData.lockPeriods.map((period) => (
                              <AnimatedButton
                                key={period.days}
                                variant={selectedDuration === period.days ? 'primary' : 'secondary'}
                                onClick={() => setSelectedDuration(period.days)}
                                className={`p-6 h-auto flex-col ${selectedDuration === period.days 
                                  ? 'btn-luxury shadow-lg' 
                                  : 'glass-light border border-gray-700 hover:border-luxury/30'
                                }`}
                              >
                                <div className="font-bold text-lg mb-2">{formatDuration(period.days)}</div>
                                <div className={`text-sm px-3 py-1 rounded-lg border mb-2 ${getTierColor(period.tier)}`}>
                                  {period.tier}
                                </div>
                                <div className="text-xs opacity-80">
                                  {period.multiplier}x multiplier • +{period.bonus}% bonus
                                </div>
                              </AnimatedButton>
                            ))}
                          </div>
                        </div>

                        {/* Stake Button */}
                        <AnimatedButton
                          variant="primary"
                          size="xl"
                          onClick={handleStake}
                          disabled={!stakeAmount || parseFloat(stakeAmount) < selectedPoolData.minStake}
                          className="w-full btn-luxury shadow-xl shadow-luxury/20"
                        >
                          <Lock className="w-6 h-6" />
                          Stake {stakeAmount || '0'} {selectedPool} Tokens
                        </AnimatedButton>
                      </div>

                      {/* Rewards Calculator */}
                      <div>
                        <div className="bg-gradient-to-br from-luxury/10 to-champagne-gold/10 border border-luxury/30 rounded-2xl p-8">
                          <h4 className="text-2xl font-bold text-luxury mb-6 flex items-center gap-2">
                            <DollarSign className="w-6 h-6" />
                            Projected Rewards
                          </h4>
                          
                          <div className="space-y-6">
                            <div className="bg-gray-800/50 rounded-xl p-6">
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400">Base APY:</span>
                                <span className="text-2xl font-bold text-white">{selectedPoolData.apy}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-3">
                                <div 
                                  className="h-3 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                                  style={{ width: `${Math.min((selectedPoolData.apy / 100) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                            
                            {selectedLockPeriod && (
                              <>
                                <div className="bg-gray-800/50 rounded-xl p-6">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400">Tier Multiplier:</span>
                                    <span className="text-xl font-bold text-champagne-gold">
                                      {selectedLockPeriod.multiplier}x
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Bonus Reward:</span>
                                    <span className="text-xl font-bold text-cyan-400">
                                      +{selectedLockPeriod.bonus}%
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="border-t border-luxury/30 pt-6">
                                  <div className="text-center">
                                    <div className="text-sm text-gray-400 mb-2">Total Estimated Rewards</div>
                                    <div className="text-4xl font-bold text-luxury mb-2">
                                      {calculateEstimatedRewards().toLocaleString()} tokens
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Over {formatDuration(selectedDuration)} period
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rewards' && (
              <div>
                <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <Gift className="w-8 h-8 text-luxury" />
                  Active Stakes & Rewards
                </h3>

                <div className="space-y-8">
                  {activeStakes.map((stake) => (
                    <motion.div
                      key={stake.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden"
                    >
                      <div className="p-8">
                        <div className="flex flex-col xl:flex-row gap-8">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="text-2xl font-bold text-white">{stake.pool}</h4>
                              <div className="flex items-center gap-4">
                                <div className={`px-4 py-2 rounded-lg border font-bold ${getTierColor(stake.tier)}`}>
                                  {stake.tier}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 rounded-lg border border-emerald-400/20">
                                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                  <span className="text-emerald-400 font-semibold capitalize">
                                    {stake.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-luxury mb-1">
                                  {stake.amount.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Staked Amount</div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-2xl font-bold text-emerald-400 mb-1">
                                  {stake.currentRewards.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Current Rewards</div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-2xl font-bold text-champagne-gold mb-1">
                                  {stake.apy}%
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">APY</div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-2xl font-bold text-cyan-400 mb-1">
                                  {stake.multiplier}x
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Multiplier</div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400 mb-1">
                                  {getDaysRemaining(stake.endDate)}
                                </div>
                                <div className="text-xs text-gray-400 uppercase tracking-wider">Days Left</div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-6">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-400">Lock Progress</span>
                                <span className="text-emerald-400 font-bold">
                                  {Math.round(((new Date().getTime() - stake.startDate.getTime()) / (stake.endDate.getTime() - stake.startDate.getTime())) * 100)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-3">
                                <div 
                                  className="h-3 bg-gradient-to-r from-luxury to-champagne-gold rounded-full transition-all duration-1000"
                                  style={{ 
                                    width: `${Math.round(((new Date().getTime() - stake.startDate.getTime()) / (stake.endDate.getTime() - stake.startDate.getTime())) * 100)}%` 
                                  }}
                                />
                              </div>
                              <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>{stake.startDate.toLocaleDateString()}</span>
                                <span>{stake.endDate.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="xl:w-64">
                            <div className="space-y-4">
                              <AnimatedButton
                                variant={getDaysRemaining(stake.endDate) > 0 ? 'secondary' : 'primary'}
                                size="lg"
                                disabled={getDaysRemaining(stake.endDate) > 0}
                                className="w-full"
                              >
                                <Gift className="w-5 h-5" />
                                {getDaysRemaining(stake.endDate) > 0 ? 'Locked' : 'Claim Rewards'}
                              </AnimatedButton>
                              
                              <AnimatedButton
                                variant="secondary"
                                size="lg"
                                className="w-full glass-light border border-gray-700 hover:border-luxury/30"
                              >
                                <Plus className="w-5 h-5" />
                                Add More Stakes
                              </AnimatedButton>

                              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                                <div className="text-lg font-bold text-white mb-1">
                                  Shield Protection
                                </div>
                                <div className="text-2xl font-bold text-luxury">
                                  {stake.shieldProtection}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-cyan-400" />
                  Staking Performance Analytics
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8">
                    <h4 className="text-xl font-bold text-white mb-6">Portfolio Allocation</h4>
                    <div className="space-y-4">
                      {activeStakes.map((stake, index) => {
                        const percentage = (stake.amount / userStaking.totalStaked) * 100;
                        return (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-300">{stake.pool}</span>
                              <span className="text-luxury font-bold">{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="h-2 bg-gradient-to-r from-luxury to-champagne-gold rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8">
                    <h4 className="text-xl font-bold text-white mb-6">Performance Metrics</h4>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Average APY</span>
                          <span className="text-emerald-400 font-bold text-xl">
                            {(activeStakes.reduce((sum, stake) => sum + stake.apy, 0) / activeStakes.length).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Total Potential Rewards</span>
                          <span className="text-luxury font-bold text-xl">
                            {(userStaking.totalRewards * 1.5).toLocaleString()} tokens
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Average Shield Protection</span>
                          <span className="text-cyan-400 font-bold text-xl">
                            {(activeStakes.reduce((sum, stake) => sum + stake.shieldProtection, 0) / activeStakes.length).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Premium Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-luxury/30 p-8 max-w-lg w-full shadow-2xl shadow-luxury/20"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-luxury to-champagne-gold rounded-3xl flex items-center justify-center shadow-lg">
                  <Lock className="w-10 h-10 text-gray-900" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Confirm Premium Staking
                </h3>
                <div className="space-y-4 mb-8 text-left">
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Token Pool:</span>
                    <span className="text-white font-bold">{selectedPoolData?.name}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Stake Amount:</span>
                    <span className="text-luxury font-bold">{stakeAmount} tokens</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-gray-400">Lock Duration:</span>
                    <span className="text-champagne-gold font-bold">{formatDuration(selectedDuration)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-400/10 to-emerald-400/5 rounded-lg border border-emerald-400/20">
                    <span className="text-gray-400">Est. Rewards:</span>
                    <span className="text-emerald-400 font-bold text-lg">
                      {calculateEstimatedRewards().toLocaleString()} tokens
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <AnimatedButton
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 glass-light border border-gray-700"
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton
                    variant="primary"
                    size="lg"
                    onClick={confirmStake}
                    className="flex-1 btn-luxury shadow-lg shadow-luxury/20"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Confirm Stake
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Feedback */}
      <FloatingFeedback
        type="success"
        message={feedbackMessage}
        isVisible={showFeedback}
        onClose={() => setShowFeedback(false)}
        position="top-right"
      />
    </div>
  );
}