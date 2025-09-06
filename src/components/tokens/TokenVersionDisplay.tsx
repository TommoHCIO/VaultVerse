'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Star,
  Crown,
  Zap,
  Sparkles,
  Lock,
  Unlock,
  TrendingUp,
  Users,
  Award,
  Gift,
  Coins,
  Diamond,
  Flame,
  Target,
  Eye,
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  Infinity,
  Rocket,
  Brain,
  Heart,
  Bolt,
  Gem,
  Skull
} from 'lucide-react';

// Token Version Types and Utilities
export interface TokenUtility {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'trading' | 'social' | 'governance' | 'exclusive' | 'financial' | 'cosmetic';
  active: boolean;
  multiplier?: number;
  discount?: number;
  unlockLevel?: number;
  stackable: boolean;
  timeGated?: boolean;
  exclusive?: boolean;
}

export interface TokenVersion {
  id: string;
  version: 'V1' | 'V2' | 'V3' | 'V4' | 'V5';
  name: string;
  description: string;
  tagline: string;
  rarity: 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical';
  tier: number;
  supply: {
    total: number;
    circulating: number;
    burned?: number;
  };
  price: {
    current: number;
    change24h: number;
    allTimeHigh: number;
  };
  utilities: TokenUtility[];
  aesthetics: {
    primaryColor: string;
    secondaryColor: string;
    glowColor: string;
    gradient: string;
    particleColor: string;
    animation: 'pulse' | 'glow' | 'sparkle' | 'rotation' | 'wave';
  };
  ownership: {
    owned: boolean;
    quantity: number;
    purchaseDate?: Date;
    stakingRewards?: number;
    totalEarned?: number;
  };
  requirements?: {
    minimumHolding?: number;
    stakingPeriod?: number; // days
    prerequisites?: string[]; // Other token IDs
  };
  marketStats: {
    volume24h: number;
    holders: number;
    averageHoldingPeriod: number; // days
    utilityUsageRate: number; // percentage
  };
  roadmapStatus: 'live' | 'coming-soon' | 'concept';
  launchDate?: Date;
}

// Mock V1-V5 Token Data with 2025 Crypto Utility Trends
const tokenVersions: TokenVersion[] = [
  {
    id: 'v1',
    version: 'V1',
    name: 'Shield Pioneer',
    description: 'Foundation token providing essential Shield protection benefits',
    tagline: 'Your Gateway to Protected Trading',
    rarity: 'uncommon',
    tier: 1,
    supply: { total: 10000, circulating: 8750, burned: 250 },
    price: { current: 89.50, change24h: 2.3, allTimeHigh: 125.00 },
    utilities: [
      {
        id: 'shield_discount',
        name: 'Shield Cost Reduction',
        description: '15% discount on Shield protection fees',
        icon: Shield,
        category: 'trading',
        active: true,
        discount: 15,
        stackable: false,
        timeGated: false
      },
      {
        id: 'basic_staking',
        name: 'Basic Staking Rewards',
        description: 'Earn 5% APY on staked tokens',
        icon: Coins,
        category: 'financial',
        active: true,
        multiplier: 1.05,
        stackable: true,
        timeGated: false
      },
      {
        id: 'priority_support',
        name: 'Priority Customer Support',
        description: '24/7 priority assistance and faster response times',
        icon: Heart,
        category: 'social',
        active: true,
        stackable: false,
        timeGated: false
      }
    ],
    aesthetics: {
      primaryColor: '#00d9ff',
      secondaryColor: '#0891b2',
      glowColor: '#67e8f9',
      gradient: 'from-cyan-400 to-blue-500',
      particleColor: '#22d3ee',
      animation: 'pulse'
    },
    ownership: { owned: true, quantity: 5, purchaseDate: new Date('2024-08-15'), stakingRewards: 0.75, totalEarned: 12.50 },
    marketStats: { volume24h: 450000, holders: 5234, averageHoldingPeriod: 45, utilityUsageRate: 78 },
    roadmapStatus: 'live',
    launchDate: new Date('2024-06-01')
  },
  {
    id: 'v2',
    version: 'V2',
    name: 'Prediction Amplifier',
    description: 'Enhanced token with boosted staking rewards and prediction score multipliers',
    tagline: 'Amplify Your Prediction Power',
    rarity: 'rare',
    tier: 2,
    supply: { total: 5000, circulating: 4200, burned: 150 },
    price: { current: 245.75, change24h: -1.2, allTimeHigh: 389.00 },
    utilities: [
      {
        id: 'score_multiplier',
        name: '2x Event Score Multiplier',
        description: 'Double points in live prediction events',
        icon: Zap,
        category: 'trading',
        active: true,
        multiplier: 2,
        stackable: true,
        timeGated: false
      },
      {
        id: 'enhanced_staking',
        name: 'Enhanced Staking Rewards',
        description: 'Earn 12% APY on staked tokens',
        icon: TrendingUp,
        category: 'financial',
        active: true,
        multiplier: 1.12,
        stackable: true,
        timeGated: false
      },
      {
        id: 'early_market_access',
        name: 'Early Market Access',
        description: '30-minute head start on new prediction markets',
        icon: Target,
        category: 'exclusive',
        active: true,
        stackable: false,
        timeGated: true
      },
      {
        id: 'advanced_analytics',
        name: 'Advanced Analytics Dashboard',
        description: 'Detailed performance insights and market trends',
        icon: Brain,
        category: 'trading',
        active: true,
        stackable: false,
        timeGated: false
      }
    ],
    aesthetics: {
      primaryColor: '#a855f7',
      secondaryColor: '#7c3aed',
      glowColor: '#c084fc',
      gradient: 'from-purple-400 to-violet-600',
      particleColor: '#a78bfa',
      animation: 'glow'
    },
    ownership: { owned: false, quantity: 0 },
    requirements: { minimumHolding: 3, stakingPeriod: 30, prerequisites: ['v1'] },
    marketStats: { volume24h: 180000, holders: 2891, averageHoldingPeriod: 67, utilityUsageRate: 85 },
    roadmapStatus: 'live',
    launchDate: new Date('2024-09-15')
  },
  {
    id: 'v3',
    version: 'V3',
    name: 'Governance Guardian',
    description: 'Premium token unlocking governance rights and exclusive market access',
    tagline: 'Shape the Future of Vaultor',
    rarity: 'epic',
    tier: 3,
    supply: { total: 2500, circulating: 1890, burned: 85 },
    price: { current: 678.25, change24h: 5.7, allTimeHigh: 812.50 },
    utilities: [
      {
        id: 'governance_voting',
        name: 'Platform Governance',
        description: 'Vote on platform upgrades and new features',
        icon: Users,
        category: 'governance',
        active: true,
        stackable: false,
        timeGated: false
      },
      {
        id: 'exclusive_markets',
        name: 'Exclusive High-Stakes Markets',
        description: 'Access to whale-only prediction markets',
        icon: Crown,
        category: 'exclusive',
        active: true,
        exclusive: true,
        stackable: false,
        timeGated: false
      },
      {
        id: 'premium_staking',
        name: 'Premium Staking Pool',
        description: 'Earn 20% APY in exclusive staking pool',
        icon: Diamond,
        category: 'financial',
        active: true,
        multiplier: 1.20,
        stackable: true,
        timeGated: false
      },
      {
        id: 'vip_events',
        name: 'VIP Event Access',
        description: 'Exclusive access to high-reward prediction tournaments',
        icon: Award,
        category: 'exclusive',
        active: true,
        exclusive: true,
        stackable: false,
        timeGated: true
      },
      {
        id: 'custom_avatars',
        name: 'Custom Avatar Gallery',
        description: 'Unlock exclusive avatar collection and customization',
        icon: Sparkles,
        category: 'cosmetic',
        active: true,
        stackable: false,
        timeGated: false
      }
    ],
    aesthetics: {
      primaryColor: '#f59e0b',
      secondaryColor: '#d97706',
      glowColor: '#fbbf24',
      gradient: 'from-amber-400 to-orange-500',
      particleColor: '#f3b90c',
      animation: 'sparkle'
    },
    ownership: { owned: false, quantity: 0 },
    requirements: { minimumHolding: 2, stakingPeriod: 60, prerequisites: ['v2'] },
    marketStats: { volume24h: 95000, holders: 1456, averageHoldingPeriod: 89, utilityUsageRate: 92 },
    roadmapStatus: 'live',
    launchDate: new Date('2024-11-01')
  },
  {
    id: 'v4',
    version: 'V4',
    name: 'Revenue Oracle',
    description: 'Elite token providing revenue sharing and advanced platform privileges',
    tagline: 'Share in Vaultor\'s Success',
    rarity: 'legendary',
    tier: 4,
    supply: { total: 1000, circulating: 725, burned: 45 },
    price: { current: 1456.90, change24h: 8.4, allTimeHigh: 1889.00 },
    utilities: [
      {
        id: 'revenue_sharing',
        name: 'Platform Revenue Share',
        description: 'Receive 0.1% of platform revenue monthly',
        icon: Gift,
        category: 'financial',
        active: true,
        exclusive: true,
        stackable: true,
        timeGated: false
      },
      {
        id: 'alpha_features',
        name: 'Alpha Feature Access',
        description: 'First access to experimental features and tools',
        icon: Rocket,
        category: 'exclusive',
        active: true,
        exclusive: true,
        stackable: false,
        timeGated: false
      },
      {
        id: 'whale_analytics',
        name: 'Whale Movement Analytics',
        description: 'Real-time tracking of large position movements',
        icon: Eye,
        category: 'trading',
        active: true,
        exclusive: true,
        stackable: false,
        timeGated: false
      },
      {
        id: 'personal_manager',
        name: 'Personal Account Manager',
        description: 'Dedicated support specialist for your account',
        icon: Users,
        category: 'social',
        active: true,
        exclusive: true,
        stackable: false,
        timeGated: false
      },
      {
        id: 'unlimited_shield',
        name: 'Unlimited Shield Usage',
        description: 'Use Shield protection with no fees or limits',
        icon: Infinity,
        category: 'trading',
        active: true,
        exclusive: true,
        stackable: false,
        timeGated: false
      }
    ],
    aesthetics: {
      primaryColor: '#ec4899',
      secondaryColor: '#be185d',
      glowColor: '#f472b6',
      gradient: 'from-pink-400 to-rose-600',
      particleColor: '#f472b6',
      animation: 'rotation'
    },
    ownership: { owned: false, quantity: 0 },
    requirements: { minimumHolding: 1, stakingPeriod: 90, prerequisites: ['v3'] },
    marketStats: { volume24h: 45000, holders: 567, averageHoldingPeriod: 134, utilityUsageRate: 96 },
    roadmapStatus: 'coming-soon',
    launchDate: new Date('2025-02-01')
  },
  {
    id: 'v5',
    version: 'V5',
    name: 'Vaultor Sovereign',
    description: 'The ultimate mythical token with unlimited power and exclusive universe access',
    tagline: 'Transcend All Limitations',
    rarity: 'mythical',
    tier: 5,
    supply: { total: 100, circulating: 67, burned: 8 },
    price: { current: 15789.00, change24h: 12.8, allTimeHigh: 23456.00 },
    utilities: [
      {
        id: 'sovereign_council',
        name: 'Sovereign Council Membership',
        description: 'Direct influence over Vaultor\'s strategic direction',
        icon: Crown,
        category: 'governance',
        active: true,
        exclusive: true,
        stackable: false,
        timeGated: false
      },
      {
        id: 'universe_access',
        name: 'Vaultor Metaverse Access',
        description: 'Exclusive access to the Vaultor virtual world',
        icon: Sparkles,
        category: 'exclusive',
        active: true,
        exclusive: true,
        stackable: false,
        timeGated: false
      },
      {
        id: 'infinite_multipliers',
        name: 'Infinite Utility Multipliers',
        description: 'All token utilities stacked with no limits',
        icon: Infinity,
        category: 'trading',
        active: true,
        exclusive: true,
        multiplier: 999,
        stackable: true,
        timeGated: false
      },
      {
        id: 'genesis_rewards',
        name: 'Genesis Block Rewards',
        description: 'Lifetime 50% APY from genesis block validation',
        icon: Gem,
        category: 'financial',
        active: true,
        exclusive: true,
        multiplier: 1.50,
        stackable: true,
        timeGated: false
      },
      {
        id: 'reality_bending',
        name: 'Market Reality Manipulation',
        description: 'Theoretical ability to influence market outcomes',
        icon: Skull,
        category: 'exclusive',
        active: false, // Too powerful, kept inactive
        exclusive: true,
        stackable: false,
        timeGated: true
      }
    ],
    aesthetics: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#5b21b6',
      glowColor: '#a78bfa',
      gradient: 'from-violet-400 via-purple-500 to-indigo-600',
      particleColor: '#8b5cf6',
      animation: 'wave'
    },
    ownership: { owned: false, quantity: 0 },
    requirements: { minimumHolding: 1, stakingPeriod: 365, prerequisites: ['v4'] },
    marketStats: { volume24h: 12000, holders: 89, averageHoldingPeriod: 267, utilityUsageRate: 100 },
    roadmapStatus: 'concept',
    launchDate: new Date('2025-12-21') // Winter Solstice launch
  }
];

interface TokenVersionDisplayProps {
  selectedVersion?: string;
  showOwnershipOnly?: boolean;
  compactView?: boolean;
  showMarketData?: boolean;
  onPurchase?: (tokenId: string) => void;
  onStake?: (tokenId: string) => void;
}

export function TokenVersionDisplay({
  selectedVersion,
  showOwnershipOnly = false,
  compactView = false,
  showMarketData = true,
  onPurchase,
  onStake
}: TokenVersionDisplayProps) {
  const [expandedToken, setExpandedToken] = useState<string | null>(selectedVersion || null);
  const [activeUtilityView, setActiveUtilityView] = useState<string>('all');
  const [animatingTokens, setAnimatingTokens] = useState<Set<string>>(new Set());

  const filteredTokens = showOwnershipOnly 
    ? tokenVersions.filter(token => token.ownership.owned)
    : tokenVersions;

  const utilityCategories = [
    { id: 'all', label: 'All Utilities', icon: Star },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'financial', label: 'Financial', icon: Coins },
    { id: 'exclusive', label: 'Exclusive', icon: Crown },
    { id: 'governance', label: 'Governance', icon: Users },
    { id: 'social', label: 'Social', icon: Heart },
    { id: 'cosmetic', label: 'Cosmetic', icon: Sparkles }
  ];

  // Animate token on hover or interaction
  const handleTokenInteraction = (tokenId: string) => {
    setAnimatingTokens(prev => new Set([...prev, tokenId]));
    setTimeout(() => {
      setAnimatingTokens(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenId);
        return newSet;
      });
    }, 1000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getUtilityIcon = (utility: TokenUtility) => {
    const IconComponent = utility.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const isTokenAccessible = (token: TokenVersion) => {
    if (!token.requirements) return true;
    
    if (token.requirements.prerequisites) {
      return token.requirements.prerequisites.every(prereqId => {
        const prereqToken = tokenVersions.find(t => t.id === prereqId);
        return prereqToken?.ownership.owned;
      });
    }
    
    return true;
  };

  return (
    <div className="space-y-8">
      {/* Utility Filter */}
      <div className="flex flex-wrap gap-2">
        {utilityCategories.map(category => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveUtilityView(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeUtilityView === category.id
                ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/25'
                : 'bg-glass-bg text-gray-400 hover:text-white hover:bg-glass-bg-light'
            }`}
          >
            <category.icon className="w-4 h-4" />
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* Token Version Grid */}
      <div className={`grid gap-8 ${compactView ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {filteredTokens.map((token, index) => {
          const isExpanded = expandedToken === token.id;
          const isAnimating = animatingTokens.has(token.id);
          const isAccessible = isTokenAccessible(token);
          const filteredUtilities = activeUtilityView === 'all' 
            ? token.utilities 
            : token.utilities.filter(u => u.category === activeUtilityView);

          return (
            <motion.div
              key={token.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: isAnimating ? 1.02 : 1,
                rotateY: isAnimating ? [0, 5, -5, 0] : 0
              }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                scale: { duration: 0.3 },
                rotateY: { duration: 1, ease: "easeInOut" }
              }}
              className={`relative glass-card rounded-3xl overflow-hidden ${
                !isAccessible ? 'opacity-60' : ''
              }`}
            >
              {/* Token Header */}
              <div 
                className={`relative p-8 bg-gradient-to-br ${token.aesthetics.gradient}`}
                style={{
                  background: `linear-gradient(135deg, ${token.aesthetics.primaryColor}20, ${token.aesthetics.secondaryColor}40)`
                }}
              >
                {/* Particle Animation Background */}
                <div className="absolute inset-0 opacity-30">
                  <div 
                    className={`absolute inset-0 ${
                      token.aesthetics.animation === 'pulse' ? 'animate-pulse' :
                      token.aesthetics.animation === 'glow' ? 'animate-ping' :
                      token.aesthetics.animation === 'sparkle' ? 'animate-bounce' :
                      token.aesthetics.animation === 'rotation' ? 'animate-spin' :
                      'animate-pulse'
                    }`}
                    style={{
                      background: `radial-gradient(circle at 30% 70%, ${token.aesthetics.glowColor}20, transparent 50%)`
                    }}
                  />
                </div>

                {/* Access Lock Overlay */}
                {!isAccessible && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <div className="text-white font-bold">LOCKED</div>
                      <div className="text-xs text-gray-400">
                        Requires {token.requirements?.prerequisites?.join(', ')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    token.roadmapStatus === 'live' ? 'bg-green-500/20 text-green-400' :
                    token.roadmapStatus === 'coming-soon' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {token.roadmapStatus === 'live' ? 'LIVE' :
                     token.roadmapStatus === 'coming-soon' ? 'COMING SOON' :
                     'CONCEPT'}
                  </div>
                </div>

                {/* Ownership Badge */}
                {token.ownership.owned && (
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-xs font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      OWNED ({token.ownership.quantity})
                    </div>
                  </div>
                )}

                {/* Token Identity */}
                <div className="relative text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-glass-bg/20 border border-white/20"
                    style={{
                      boxShadow: `0 0 30px ${token.aesthetics.glowColor}40`
                    }}
                  >
                    <span 
                      className="text-3xl font-bold"
                      style={{ color: token.aesthetics.primaryColor }}
                    >
                      {token.version}
                    </span>
                  </motion.div>

                  <h2 className="text-2xl font-bold text-white mb-2">{token.name}</h2>
                  <p className="text-lg font-medium mb-4" style={{ color: token.aesthetics.glowColor }}>
                    {token.tagline}
                  </p>
                  <p className="text-gray-300 text-sm max-w-md mx-auto">
                    {token.description}
                  </p>
                </div>

                {/* Rarity Indicator */}
                <div className="absolute bottom-4 left-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    token.rarity === 'uncommon' ? 'bg-green-500/20 text-green-400' :
                    token.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                    token.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                    token.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-pink-500/20 text-pink-400'
                  }`}>
                    {token.rarity.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Token Content */}
              <div className="p-8">
                {/* Price and Market Data */}
                {showMarketData && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: token.aesthetics.primaryColor }}>
                        {formatPrice(token.price.current)}
                      </div>
                      <div className="text-xs text-gray-400">Current Price</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        token.price.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatPercentage(token.price.change24h)}
                      </div>
                      <div className="text-xs text-gray-400">24h Change</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{token.supply.circulating}</div>
                      <div className="text-xs text-gray-400">Circulating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-neon-cyan">{token.marketStats.holders}</div>
                      <div className="text-xs text-gray-400">Holders</div>
                    </div>
                  </div>
                )}

                {/* Quick Utilities Preview */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" style={{ color: token.aesthetics.primaryColor }} />
                    Key Utilities ({filteredUtilities.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredUtilities.slice(0, isExpanded ? filteredUtilities.length : 4).map(utility => (
                      <motion.div
                        key={utility.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          utility.active 
                            ? `border-${token.aesthetics.primaryColor}/30 bg-${token.aesthetics.primaryColor}/10`
                            : 'border-gray-600 bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            utility.active 
                              ? 'bg-gradient-to-br from-white/20 to-white/10'
                              : 'bg-gray-700'
                          }`}>
                            {getUtilityIcon(utility)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-semibold text-sm ${
                                utility.active ? 'text-white' : 'text-gray-400'
                              }`}>
                                {utility.name}
                              </h4>
                              
                              {/* Utility Badges */}
                              <div className="flex items-center gap-1">
                                {utility.exclusive && (
                                  <Crown className="w-3 h-3 text-yellow-400" />
                                )}
                                {utility.stackable && (
                                  <Plus className="w-3 h-3 text-green-400" />
                                )}
                                {utility.timeGated && (
                                  <Calendar className="w-3 h-3 text-blue-400" />
                                )}
                              </div>
                            </div>
                            
                            <p className="text-xs text-gray-400 mb-2">{utility.description}</p>
                            
                            {/* Utility Values */}
                            {(utility.multiplier || utility.discount) && (
                              <div className="flex items-center gap-2 text-xs">
                                {utility.multiplier && (
                                  <span className="text-green-400 font-bold">
                                    {utility.multiplier}x multiplier
                                  </span>
                                )}
                                {utility.discount && (
                                  <span className="text-blue-400 font-bold">
                                    {utility.discount}% discount
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {filteredUtilities.length > 4 && !isExpanded && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExpandedToken(token.id)}
                      className="w-full mt-4 py-2 rounded-xl border border-glass-border text-gray-400 hover:text-white hover:bg-glass-bg-light transition-colors duration-300 text-sm"
                    >
                      View All {filteredUtilities.length} Utilities
                    </motion.button>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!token.ownership.owned && isAccessible && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleTokenInteraction(token.id);
                        onPurchase?.(token.id);
                      }}
                      className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                        token.roadmapStatus === 'live' 
                          ? 'bg-gradient-to-r ' + token.aesthetics.gradient + ' hover:shadow-lg'
                          : 'bg-gray-600 cursor-not-allowed'
                      }`}
                      disabled={token.roadmapStatus !== 'live'}
                    >
                      {token.roadmapStatus === 'live' ? 'Purchase Token' : 
                       token.roadmapStatus === 'coming-soon' ? 'Coming Soon' : 
                       'Concept Only'}
                    </motion.button>
                  )}
                  
                  {token.ownership.owned && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onStake?.(token.id)}
                      className="flex-1 py-3 rounded-xl font-semibold bg-neon-green text-vaultor-dark hover:shadow-lg hover:shadow-neon-green/25 transition-all duration-300"
                    >
                      Stake & Earn
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setExpandedToken(isExpanded ? null : token.id)}
                    className="px-4 py-3 rounded-xl bg-glass-bg border border-glass-border text-gray-400 hover:text-white hover:bg-glass-bg-light transition-colors duration-300"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </motion.button>
                </div>

                {/* Expanded Stats */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-glass-border space-y-6"
                    >
                      {/* Detailed Market Stats */}
                      <div>
                        <h4 className="text-lg font-bold text-white mb-4">Market Analytics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="glass-bg rounded-xl p-3 text-center">
                            <div className="text-lg font-bold text-neon-green">
                              {formatPrice(token.marketStats.volume24h)}
                            </div>
                            <div className="text-xs text-gray-400">24h Volume</div>
                          </div>
                          <div className="glass-bg rounded-xl p-3 text-center">
                            <div className="text-lg font-bold text-neon-cyan">
                              {token.marketStats.averageHoldingPeriod}d
                            </div>
                            <div className="text-xs text-gray-400">Avg. Hold Time</div>
                          </div>
                          <div className="glass-bg rounded-xl p-3 text-center">
                            <div className="text-lg font-bold text-neon-purple">
                              {token.marketStats.utilityUsageRate}%
                            </div>
                            <div className="text-xs text-gray-400">Utility Usage</div>
                          </div>
                          <div className="glass-bg rounded-xl p-3 text-center">
                            <div className="text-lg font-bold text-shield-gold">
                              {formatPrice(token.price.allTimeHigh)}
                            </div>
                            <div className="text-xs text-gray-400">All-Time High</div>
                          </div>
                        </div>
                      </div>

                      {/* Requirements */}
                      {token.requirements && (
                        <div>
                          <h4 className="text-lg font-bold text-white mb-3">Requirements</h4>
                          <div className="space-y-2">
                            {token.requirements.minimumHolding && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Minimum Holding:</span>
                                <span className="text-white font-bold">{token.requirements.minimumHolding} tokens</span>
                              </div>
                            )}
                            {token.requirements.stakingPeriod && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Staking Period:</span>
                                <span className="text-white font-bold">{token.requirements.stakingPeriod} days</span>
                              </div>
                            )}
                            {token.requirements.prerequisites && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Prerequisites:</span>
                                <span className="text-white font-bold">
                                  {token.requirements.prerequisites.map(p => p.toUpperCase()).join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTokens.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-glass-bg flex items-center justify-center">
            <Lock className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Tokens Found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {showOwnershipOnly 
              ? "You don't own any tokens yet. Purchase your first V1 token to get started!"
              : "No tokens match the current filter criteria."
            }
          </p>
        </div>
      )}
    </div>
  );
}