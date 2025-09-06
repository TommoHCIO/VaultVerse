'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Star,
  Crown,
  Shield,
  Zap,
  Target,
  Flame,
  Award,
  Medal,
  Diamond,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Lock,
  CheckCircle,
  Plus,
  Minus,
  Calendar,
  BarChart3,
  Activity,
  Eye,
  EyeOff,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Coins,
  Gift,
  Rocket,
  Brain,
  Heart,
  Bolt
} from 'lucide-react';

// Badge Categories and Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical';
  category: 'trading' | 'social' | 'milestone' | 'streak' | 'special' | 'seasonal' | 'v1' | 'v5';
  unlockCondition: string;
  progress?: {
    current: number;
    target: number;
    unit: string;
  };
  isUnlocked: boolean;
  isNew: boolean;
  unlockedAt?: Date;
  rewardPoints: number;
  rewardTokens?: number;
  tier: number; // Multi-stage achievement support
  nextTier?: Badge;
  prerequisites?: string[]; // Badge IDs required to unlock
  isHidden: boolean; // Progressive disclosure
  rarityBonus: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badges: Badge[];
  totalProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  estimatedTime: string;
  rewards: {
    points: number;
    tokens?: number;
    specialReward?: string;
  };
}

// Mock badge data with 2025 gamification trends
const mockBadges: Badge[] = [
  // Trading Badges - Progressive Unlock System
  {
    id: 'first_prediction',
    name: 'First Steps',
    description: 'Place your first prediction',
    icon: Target,
    rarity: 'common',
    category: 'trading',
    unlockCondition: 'Place 1 prediction',
    progress: { current: 1, target: 1, unit: 'predictions' },
    isUnlocked: true,
    isNew: false,
    unlockedAt: new Date('2024-12-01'),
    rewardPoints: 50,
    tier: 1,
    isHidden: false,
    rarityBonus: 1
  },
  {
    id: 'trading_novice',
    name: 'Trading Novice',
    description: 'Place 10 predictions',
    icon: TrendingUp,
    rarity: 'common',
    category: 'trading',
    unlockCondition: 'Place 10 predictions',
    progress: { current: 8, target: 10, unit: 'predictions' },
    isUnlocked: false,
    isNew: false,
    rewardPoints: 100,
    tier: 1,
    isHidden: false,
    rarityBonus: 1
  },
  {
    id: 'prediction_master',
    name: 'Prediction Master',
    description: 'Place 100 predictions',
    icon: Crown,
    rarity: 'rare',
    category: 'trading',
    unlockCondition: 'Place 100 predictions',
    progress: { current: 8, target: 100, unit: 'predictions' },
    isUnlocked: false,
    isNew: false,
    rewardPoints: 500,
    tier: 2,
    prerequisites: ['trading_novice'],
    isHidden: true, // Progressive disclosure
    rarityBonus: 3
  },
  
  // Streak Badges - Multi-stage System
  {
    id: 'streak_warrior',
    name: 'Streak Warrior',
    description: 'Achieve a 7-day prediction streak',
    icon: Flame,
    rarity: 'uncommon',
    category: 'streak',
    unlockCondition: 'Maintain 7-day streak',
    progress: { current: 3, target: 7, unit: 'days' },
    isUnlocked: false,
    isNew: false,
    rewardPoints: 200,
    tier: 1,
    isHidden: false,
    rarityBonus: 2
  },
  {
    id: 'streak_legend',
    name: 'Streak Legend',
    description: 'Achieve a 30-day prediction streak',
    icon: Bolt,
    rarity: 'epic',
    category: 'streak',
    unlockCondition: 'Maintain 30-day streak',
    progress: { current: 3, target: 30, unit: 'days' },
    isUnlocked: false,
    isNew: false,
    rewardPoints: 1000,
    rewardTokens: 50,
    tier: 2,
    prerequisites: ['streak_warrior'],
    isHidden: true,
    rarityBonus: 5
  },
  
  // Social Badges
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Follow 10 other traders',
    icon: Heart,
    rarity: 'common',
    category: 'social',
    unlockCondition: 'Follow 10 traders',
    progress: { current: 2, target: 10, unit: 'follows' },
    isUnlocked: false,
    isNew: false,
    rewardPoints: 75,
    tier: 1,
    isHidden: false,
    rarityBonus: 1
  },
  
  // Special V1/V5 Token Badges
  {
    id: 'v1_pioneer',
    name: 'V1 Pioneer',
    description: 'Own a V1 token for Shield benefits',
    icon: Shield,
    rarity: 'legendary',
    category: 'v1',
    unlockCondition: 'Hold V1 token',
    isUnlocked: true,
    isNew: true,
    unlockedAt: new Date(),
    rewardPoints: 2000,
    rewardTokens: 100,
    tier: 1,
    isHidden: false,
    rarityBonus: 8
  },
  {
    id: 'v5_mystic',
    name: 'V5 Mystic',
    description: 'Own the legendary V5 token',
    icon: Star,
    rarity: 'mythical',
    category: 'v5',
    unlockCondition: 'Hold V5 token',
    isUnlocked: false,
    isNew: false,
    rewardPoints: 5000,
    rewardTokens: 500,
    tier: 1,
    isHidden: false,
    rarityBonus: 10
  },
  
  // Milestone Badges
  {
    id: 'profit_seeker',
    name: 'Profit Seeker',
    description: 'Earn your first $100 in winnings',
    icon: Coins,
    rarity: 'uncommon',
    category: 'milestone',
    unlockCondition: 'Earn $100 profit',
    progress: { current: 45, target: 100, unit: 'USD' },
    isUnlocked: false,
    isNew: false,
    rewardPoints: 300,
    tier: 1,
    isHidden: false,
    rarityBonus: 2
  }
];

const rarityColors = {
  common: 'from-gray-400 to-gray-500',
  uncommon: 'from-green-400 to-green-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-orange-500',
  mythical: 'from-pink-400 to-purple-600'
};

const rarityGlow = {
  common: 'shadow-gray-400/20',
  uncommon: 'shadow-green-400/30',
  rare: 'shadow-blue-400/40',
  epic: 'shadow-purple-400/50',
  legendary: 'shadow-yellow-400/60',
  mythical: 'shadow-pink-400/70'
};

const categoryIcons = {
  trading: TrendingUp,
  social: Users,
  milestone: Trophy,
  streak: Flame,
  special: Star,
  seasonal: Calendar,
  v1: Shield,
  v5: Crown
};

interface BadgeSystemProps {
  showProgressBars?: boolean;
  allowFiltering?: boolean;
  showHiddenBadges?: boolean;
  compactView?: boolean;
  onBadgeClick?: (badge: Badge) => void;
}

export function BadgeSystem({
  showProgressBars = true,
  allowFiltering = true,
  showHiddenBadges = false,
  compactView = false,
  onBadgeClick
}: BadgeSystemProps) {
  const [badges, setBadges] = useState<Badge[]>(mockBadges);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [expandedBadge, setExpandedBadge] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState<Set<string>>(new Set());

  // Simulate badge progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBadges(prevBadges => {
        return prevBadges.map(badge => {
          // Simulate progress for non-unlocked badges
          if (!badge.isUnlocked && badge.progress && Math.random() < 0.1) {
            const newCurrent = Math.min(
              badge.progress.current + 1,
              badge.progress.target
            );
            
            const isNewlyUnlocked = newCurrent === badge.progress.target;
            
            if (isNewlyUnlocked) {
              setShowAnimation(prev => new Set([...prev, badge.id]));
              setTimeout(() => {
                setShowAnimation(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(badge.id);
                  return newSet;
                });
              }, 3000);
            }
            
            return {
              ...badge,
              progress: { ...badge.progress, current: newCurrent },
              isUnlocked: isNewlyUnlocked,
              isNew: isNewlyUnlocked,
              unlockedAt: isNewlyUnlocked ? new Date() : badge.unlockedAt
            };
          }
          return badge;
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Filter badges
  const filteredBadges = badges.filter(badge => {
    // Search filter
    if (searchQuery && !badge.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !badge.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && badge.category !== selectedCategory) {
      return false;
    }

    // Rarity filter
    if (selectedRarity !== 'all' && badge.rarity !== selectedRarity) {
      return false;
    }

    // Unlocked filter
    if (showUnlockedOnly && !badge.isUnlocked) {
      return false;
    }

    // Hidden badge filter (progressive disclosure)
    if (!showHiddenBadges && badge.isHidden && !badge.isUnlocked) {
      // Check if prerequisites are met
      if (badge.prerequisites) {
        const prereqsMet = badge.prerequisites.every(prereqId => 
          badges.find(b => b.id === prereqId)?.isUnlocked
        );
        if (!prereqsMet) return false;
      }
    }

    return true;
  });

  const totalBadges = badges.length;
  const unlockedBadges = badges.filter(b => b.isUnlocked).length;
  const totalPoints = badges.filter(b => b.isUnlocked).reduce((sum, b) => sum + b.rewardPoints, 0);
  const completionRate = (unlockedBadges / totalBadges) * 100;

  const categories = [
    { id: 'all', label: 'All Categories' },
    ...Object.entries(categoryIcons).map(([key, icon]) => ({
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      icon
    }))
  ];

  const rarities = [
    { id: 'all', label: 'All Rarities' },
    { id: 'common', label: 'Common' },
    { id: 'uncommon', label: 'Uncommon' },
    { id: 'rare', label: 'Rare' },
    { id: 'epic', label: 'Epic' },
    { id: 'legendary', label: 'Legendary' },
    { id: 'mythical', label: 'Mythical' }
  ];

  const formatProgress = (progress: Badge['progress']) => {
    if (!progress) return '';
    return `${progress.current}/${progress.target} ${progress.unit}`;
  };

  const getProgressPercentage = (progress: Badge['progress']) => {
    if (!progress) return 0;
    return (progress.current / progress.target) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Achievement Badges</h2>
              <p className="text-sm text-gray-400">Track your progress and unlock rewards</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-neon-green">{unlockedBadges}/{totalBadges}</div>
            <div className="text-xs text-gray-400">Badges Unlocked</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-bg rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-neon-green mb-1">{completionRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-400">Completion</div>
          </div>
          <div className="glass-bg rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-shield-gold mb-1">{totalPoints.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Total Points</div>
          </div>
          <div className="glass-bg rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-neon-cyan mb-1">
              {badges.filter(b => b.isNew).length}
            </div>
            <div className="text-xs text-gray-400">New Badges</div>
          </div>
          <div className="glass-bg rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-neon-purple mb-1">
              {badges.filter(b => b.rarity === 'legendary' || b.rarity === 'mythical').filter(b => b.isUnlocked).length}
            </div>
            <div className="text-xs text-gray-400">Rare Unlocked</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Overall Progress</span>
            <span className="text-sm text-neon-green font-bold">{completionRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-glass-bg rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-2 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      {allowFiltering && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-glass-bg border border-glass-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple transition-colors duration-300"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-glass-bg border border-glass-border rounded-xl text-white focus:outline-none focus:border-neon-purple"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-vaultor-dark">
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-4 py-3 bg-glass-bg border border-glass-border rounded-xl text-white focus:outline-none focus:border-neon-purple"
            >
              {rarities.map(rarity => (
                <option key={rarity.id} value={rarity.id} className="bg-vaultor-dark">
                  {rarity.label}
                </option>
              ))}
            </select>

            {/* Toggle Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  showUnlockedOnly
                    ? 'bg-neon-green text-vaultor-dark'
                    : 'bg-glass-bg text-gray-400 hover:text-white'
                }`}
              >
                {showUnlockedOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHiddenBadges(!showHiddenBadges)}
                className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  showHiddenBadges
                    ? 'bg-neon-purple text-white'
                    : 'bg-glass-bg text-gray-400 hover:text-white'
                }`}
              >
                {showHiddenBadges ? <Lock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Badge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBadges.map((badge) => {
            const IconComponent = badge.icon;
            const CategoryIcon = categoryIcons[badge.category];
            const isAnimating = showAnimation.has(badge.id);
            const progressPercent = getProgressPercentage(badge.progress);

            return (
              <motion.div
                key={badge.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: isAnimating ? [1, 1.1, 1] : 1,
                  rotateY: isAnimating ? [0, 360] : 0
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.5,
                  scale: { duration: 0.6, repeat: isAnimating ? 2 : 0 },
                  rotateY: { duration: 1, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => {
                  onBadgeClick?.(badge);
                  setExpandedBadge(expandedBadge === badge.id ? null : badge.id);
                }}
                className={`relative glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  badge.isUnlocked 
                    ? `bg-gradient-to-br ${rarityColors[badge.rarity]} shadow-lg ${rarityGlow[badge.rarity]}` 
                    : 'opacity-75 hover:opacity-90'
                } ${badge.isNew ? 'ring-2 ring-neon-green animate-pulse' : ''}`}
              >
                {/* New Badge Indicator */}
                {badge.isNew && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-3 h-3 text-white" />
                  </motion.div>
                )}

                {/* Lock Overlay for Locked Badges */}
                {!badge.isUnlocked && badge.isHidden && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                {/* Badge Content */}
                <div className="flex flex-col items-center text-center">
                  {/* Badge Icon */}
                  <div className={`relative mb-4 ${badge.isUnlocked ? '' : 'grayscale'}`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      badge.isUnlocked 
                        ? `bg-gradient-to-br ${rarityColors[badge.rarity]}` 
                        : 'bg-glass-bg'
                    }`}>
                      <IconComponent className={`w-8 h-8 ${badge.isUnlocked ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    
                    {/* Category Icon */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-glass-bg border border-glass-border rounded-full flex items-center justify-center">
                      <CategoryIcon className="w-3 h-3 text-gray-400" />
                    </div>
                    
                    {/* Tier Indicator */}
                    {badge.tier > 1 && (
                      <div className="absolute -top-1 -left-1 w-5 h-5 bg-neon-purple rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{badge.tier}</span>
                      </div>
                    )}
                  </div>

                  {/* Badge Info */}
                  <h3 className={`text-lg font-bold mb-2 ${badge.isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {badge.description}
                  </p>

                  {/* Rarity Badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold mb-3 ${
                    badge.isUnlocked 
                      ? `bg-gradient-to-r ${rarityColors[badge.rarity]} text-white` 
                      : 'bg-glass-bg text-gray-400'
                  }`}>
                    <Star className="w-3 h-3" />
                    {badge.rarity.toUpperCase()}
                  </div>

                  {/* Progress Bar */}
                  {showProgressBars && badge.progress && !badge.isUnlocked && (
                    <div className="w-full mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-400">Progress</span>
                        <span className="text-xs text-neon-green font-bold">
                          {formatProgress(badge.progress)}
                        </span>
                      </div>
                      <div className="w-full bg-glass-bg rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-1.5 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Rewards */}
                  <div className="flex items-center justify-between w-full text-xs">
                    <div className="flex items-center gap-1 text-shield-gold">
                      <Coins className="w-3 h-3" />
                      <span className="font-bold">{badge.rewardPoints}</span>
                    </div>
                    {badge.rewardTokens && (
                      <div className="flex items-center gap-1 text-neon-green">
                        <Diamond className="w-3 h-3" />
                        <span className="font-bold">{badge.rewardTokens}</span>
                      </div>
                    )}
                    {badge.isUnlocked && badge.unlockedAt && (
                      <div className="text-gray-400">
                        {badge.unlockedAt.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedBadge === badge.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-glass-border"
                    >
                      <div className="text-xs text-gray-400 space-y-2">
                        <div><strong>Unlock Condition:</strong> {badge.unlockCondition}</div>
                        {badge.prerequisites && (
                          <div><strong>Prerequisites:</strong> {badge.prerequisites.join(', ')}</div>
                        )}
                        <div><strong>Rarity Bonus:</strong> {badge.rarityBonus}x multiplier</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Achievement Animation Overlay */}
                <AnimatePresence>
                  {isAnimating && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 rounded-2xl flex items-center justify-center"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: 2 }}
                        >
                          <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                        </motion.div>
                        <div className="text-white font-bold">UNLOCKED!</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-glass-bg flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">No Badges Found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Try adjusting your search terms or filters to find more badges.
          </p>
        </div>
      )}
    </div>
  );
}