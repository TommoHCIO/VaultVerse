'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Zap,
  Crown,
  Diamond,
  Star,
  Trophy,
  Lock,
  TrendingUp,
  Users,
  Gift,
  Sparkles,
  Award,
  Target,
  Calculator,
  DollarSign,
  Coins,
  Activity
} from 'lucide-react';

export interface TokenTier {
  version: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  metalGradient: string;
  glowColor: string;
  apy: number;
  minStake: number;
  maxMultiplier: number;
  benefits: string[];
  exclusiveFeatures: string[];
  stakingRewards: {
    base: number;
    premium: number;
    legendary: number;
  };
  holders: number;
  totalStaked: number;
  marketCap: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
}

export interface V1V5TokenShowcaseProps {
  selectedVersion?: string;
  onVersionSelect?: (version: string) => void;
  className?: string;
}

export function V1V5TokenShowcase({
  selectedVersion = 'V3',
  onVersionSelect,
  className = ''
}: V1V5TokenShowcaseProps) {
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  const tokenTiers: TokenTier[] = [
    {
      version: 'V1',
      name: 'Foundation Shield',
      description: 'Entry-level protection with essential Shield utility benefits',
      icon: Shield,
      gradient: 'from-gray-600 via-gray-500 to-gray-400',
      metalGradient: 'from-slate-300 via-gray-200 to-slate-300',
      glowColor: 'shadow-gray-500/30',
      apy: 15.5,
      minStake: 100,
      maxMultiplier: 2.0,
      benefits: ['Basic Shield Protection', 'Standard Support', 'Market Access'],
      exclusiveFeatures: ['10% Loss Protection', 'Priority Queuing'],
      stakingRewards: { base: 15.5, premium: 18.2, legendary: 22.1 },
      holders: 15420,
      totalStaked: 2850000,
      marketCap: 8500000,
      rarity: 'Common'
    },
    {
      version: 'V2',
      name: 'Enhanced Power',
      description: 'Advanced staking with 2x multipliers and exclusive market access',
      icon: Zap,
      gradient: 'from-blue-600 via-blue-500 to-blue-400',
      metalGradient: 'from-blue-300 via-sky-200 to-blue-300',
      glowColor: 'shadow-blue-500/40',
      apy: 22.8,
      minStake: 250,
      maxMultiplier: 3.0,
      benefits: ['2x Staking Rewards', 'Governance Voting', 'Premium Markets'],
      exclusiveFeatures: ['20% Loss Protection', 'Early Event Access', 'Beta Features'],
      stakingRewards: { base: 22.8, premium: 27.3, legendary: 33.8 },
      holders: 8920,
      totalStaked: 1750000,
      marketCap: 12400000,
      rarity: 'Rare'
    },
    {
      version: 'V3',
      name: 'Premium Elite',
      description: 'High-tier benefits with governance power and revenue sharing',
      icon: Trophy,
      gradient: 'from-luxury via-champagne-gold to-luxury',
      metalGradient: 'from-yellow-200 via-amber-100 to-yellow-200',
      glowColor: 'shadow-luxury/50',
      apy: 35.4,
      minStake: 500,
      maxMultiplier: 4.0,
      benefits: ['Revenue Sharing', 'VIP Support', 'Exclusive Analytics'],
      exclusiveFeatures: ['30% Loss Protection', 'Private Channels', 'Custom Strategies'],
      stakingRewards: { base: 35.4, premium: 42.5, legendary: 52.3 },
      holders: 3840,
      totalStaked: 980000,
      marketCap: 18700000,
      rarity: 'Epic'
    },
    {
      version: 'V4',
      name: 'Executive Diamond',
      description: 'Ultra-premium tier with institutional-grade benefits and alpha access',
      icon: Diamond,
      gradient: 'from-cyan-400 via-blue-300 to-cyan-400',
      metalGradient: 'from-cyan-200 via-blue-100 to-cyan-200',
      glowColor: 'shadow-cyan-400/60',
      apy: 48.7,
      minStake: 1000,
      maxMultiplier: 5.0,
      benefits: ['Alpha Generation', 'Institutional Tools', 'White-glove Service'],
      exclusiveFeatures: ['50% Loss Protection', 'Direct Advisor Access', 'Proprietary Research'],
      stakingRewards: { base: 48.7, premium: 58.4, legendary: 72.1 },
      holders: 1250,
      totalStaked: 420000,
      marketCap: 28900000,
      rarity: 'Legendary'
    },
    {
      version: 'V5',
      name: 'Legendary Crown',
      description: 'The ultimate tier with maximum rewards, complete ecosystem access, and legendary status',
      icon: Crown,
      gradient: 'from-purple-600 via-pink-500 to-purple-600',
      metalGradient: 'from-purple-200 via-pink-100 to-purple-200',
      glowColor: 'shadow-purple-500/70',
      apy: 65.3,
      minStake: 2500,
      maxMultiplier: 7.0,
      benefits: ['Maximum APY', 'Complete Access', 'Legendary Status'],
      exclusiveFeatures: ['75% Loss Protection', 'Personal Account Manager', 'Future Feature Access'],
      stakingRewards: { base: 65.3, premium: 78.4, legendary: 96.7 },
      holders: 340,
      totalStaked: 150000,
      marketCap: 45600000,
      rarity: 'Mythic'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
      case 'Rare': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'Epic': return 'text-luxury border-luxury/30 bg-luxury/10';
      case 'Legendary': return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
      case 'Mythic': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const selectedToken = tokenTiers.find(token => token.version === selectedVersion);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Token Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {tokenTiers.map((token, index) => {
          const IconComponent = token.icon;
          const isSelected = selectedVersion === token.version;
          const isHovered = hoveredToken === token.version;
          
          return (
            <motion.div
              key={token.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredToken(token.version)}
              onMouseLeave={() => setHoveredToken(null)}
              onClick={() => onVersionSelect?.(token.version)}
            >
              {/* Card Container */}
              <div className={`
                relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl 
                rounded-3xl border-2 overflow-hidden transition-all duration-500 h-full
                ${isSelected 
                  ? `border-luxury/50 ${token.glowColor} shadow-2xl scale-105 z-10` 
                  : isHovered
                  ? 'border-gray-600/50 shadow-xl scale-[1.02]'
                  : 'border-gray-700/30 hover:border-gray-600/50'
                }
              `}>
                
                {/* Animated Background */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${token.gradient} opacity-5 transition-opacity duration-500
                  ${(isSelected || isHovered) ? 'opacity-10' : 'opacity-5'}
                `} />

                {/* Metallic Shine Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${token.metalGradient} opacity-0`}
                  animate={{
                    opacity: (isSelected || isHovered) ? [0, 0.1, 0] : 0,
                    x: (isSelected || isHovered) ? [-100, 100] : 0
                  }}
                  transition={{
                    duration: 2,
                    repeat: (isSelected || isHovered) ? Infinity : 0,
                    repeatDelay: 1
                  }}
                />

                <div className="relative p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300
                      bg-gradient-to-br ${token.gradient}
                      ${isSelected ? 'border-luxury/50 shadow-lg' : 'border-gray-600/30'}
                    `}>
                      <IconComponent className={`w-8 h-8 text-white`} />
                    </div>
                    
                    <div className="text-right">
                      <div className={`
                        px-3 py-1 rounded-lg text-xs font-bold border
                        ${getRarityColor(token.rarity)}
                      `}>
                        {token.rarity.toUpperCase()}
                      </div>
                      <div className="text-2xl font-bold text-white mt-1">
                        {token.version}
                      </div>
                    </div>
                  </div>

                  {/* Token Info */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {token.name}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {token.description}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Max APY</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {token.apy}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Min Stake</span>
                      <span className="text-sm font-semibold text-luxury">
                        {formatNumber(token.minStake)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Max Multiplier</span>
                      <span className="text-sm font-semibold text-champagne-gold">
                        {token.maxMultiplier}x
                      </span>
                    </div>
                  </div>

                  {/* Holdings & Market Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <div className="text-lg font-bold text-white mb-1">
                        {formatNumber(token.holders)}
                      </div>
                      <div className="text-xs text-gray-400">Holders</div>
                    </div>
                    
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <div className="text-lg font-bold text-luxury mb-1">
                        ${formatNumber(token.marketCap)}
                      </div>
                      <div className="text-xs text-gray-400">Market Cap</div>
                    </div>
                  </div>

                  {/* Benefits Preview */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-300 mb-2">Key Benefits</div>
                    {token.benefits.slice(0, 2).map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-luxury"></div>
                        <span className="text-xs text-gray-400">{benefit}</span>
                      </div>
                    ))}
                    {token.benefits.length > 2 && (
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                        <span className="text-xs text-gray-500">
                          +{token.benefits.length - 2} more benefits
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-luxury rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg">
                      <Star className="w-4 h-4 text-gray-900" />
                    </div>
                  )}

                  {/* Hover Glow */}
                  <AnimatePresence>
                    {(isSelected || isHovered) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 rounded-3xl ${token.glowColor} -z-10`}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Token View */}
      {selectedToken && (
        <motion.div
          key={selectedToken.version}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden"
        >
          {/* Header */}
          <div className={`
            p-8 border-b border-gray-700/30 relative overflow-hidden
            bg-gradient-to-r ${selectedToken.gradient} bg-opacity-5
          `}>
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={`
                  w-20 h-20 rounded-3xl flex items-center justify-center border-2 border-luxury/30
                  bg-gradient-to-br ${selectedToken.gradient} shadow-2xl
                `}>
                  <selectedToken.icon className="w-10 h-10 text-white" />
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-white">
                      {selectedToken.version} - {selectedToken.name}
                    </h2>
                    <div className={`
                      px-3 py-1 rounded-lg text-sm font-bold border
                      ${getRarityColor(selectedToken.rarity)}
                    `}>
                      {selectedToken.rarity}
                    </div>
                  </div>
                  <p className="text-lg text-gray-300 max-w-2xl">
                    {selectedToken.description}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-4xl font-bold text-emerald-400 mb-1">
                  {selectedToken.apy}%
                </div>
                <div className="text-sm text-gray-400">Maximum APY</div>
              </div>
            </div>
            
            {/* Background Animation */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${selectedToken.metalGradient} opacity-5`}
              animate={{
                x: [-200, 200, -200],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Staking Rewards */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-luxury" />
                  Staking Rewards
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Base APY</span>
                      <span className="text-lg font-bold text-white">
                        {selectedToken.stakingRewards.base}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full"
                        style={{ width: `${(selectedToken.stakingRewards.base / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Premium APY</span>
                      <span className="text-lg font-bold text-luxury">
                        {selectedToken.stakingRewards.premium}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-luxury to-champagne-gold rounded-full"
                        style={{ width: `${(selectedToken.stakingRewards.premium / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Legendary APY</span>
                      <span className="text-lg font-bold text-emerald-400">
                        {selectedToken.stakingRewards.legendary}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                        style={{ width: `${(selectedToken.stakingRewards.legendary / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits & Features */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-champagne-gold" />
                  Token Benefits
                </h3>
                
                <div className="space-y-3">
                  {selectedToken.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-luxury"></div>
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-champagne-gold mb-3">
                    Exclusive Features
                  </h4>
                  <div className="space-y-2">
                    {selectedToken.exclusiveFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: (selectedToken.benefits.length + index) * 0.1 }}
                        className="flex items-center gap-3 p-2"
                      >
                        <Sparkles className="w-4 h-4 text-champagne-gold" />
                        <span className="text-sm text-gray-400">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Market Statistics */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Market Statistics
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-sm text-gray-400">Token Holders</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                      {formatNumber(selectedToken.holders)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Lock className="w-5 h-5 text-luxury" />
                      <span className="text-sm text-gray-400">Total Staked</span>
                    </div>
                    <div className="text-2xl font-bold text-luxury">
                      {formatNumber(selectedToken.totalStaked)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm text-gray-400">Market Cap</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400">
                      ${formatNumber(selectedToken.marketCap)}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="w-5 h-5 text-champagne-gold" />
                      <span className="text-sm text-gray-400">Min Stake</span>
                    </div>
                    <div className="text-xl font-bold text-champagne-gold">
                      {formatNumber(selectedToken.minStake)} Tokens
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Up to {selectedToken.maxMultiplier}x multiplier
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default V1V5TokenShowcase;