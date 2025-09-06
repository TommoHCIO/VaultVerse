'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  Star,
  TrendingUp,
  Clock,
  Globe,
  Filter,
  Calendar,
  Award,
  Zap,
  Crown,
  Shield,
  Target,
  Activity
} from 'lucide-react';
import { LiveLeaderboard } from '@/components/leaderboard/LiveLeaderboard';

// Mock data for comprehensive leaderboard testing
const mockPlayers = Array.from({ length: 100 }, (_, i) => ({
  id: `player-${i + 1}`,
  username: [
    'CryptoNinja', 'VaultorPro', 'QuickShot', 'PredictorX', 'MarketWiz',
    'DiamondHands', 'MoonWalker', 'FlashTrade', 'AlphaSeeker', 'ChainMaster',
    'BullRunner', 'BearSlayer', 'CoinGuru', 'TokenHunter', 'DeFiKing',
    'PumpChaser', 'HODLer', 'SwingTrade', 'ScalpMaster', 'TrendFollower',
    'RiskTaker', 'SafePlayer', 'YieldFarmer', 'LiquidityPro', 'ArbitrageBot'
  ][i % 25] + (i > 24 ? (i + 1).toString() : ''),
  score: Math.floor(Math.random() * 50000) + 1000,
  previousRank: i + 1 + (Math.random() > 0.7 ? Math.floor(Math.random() * 5) - 2 : 0),
  currentRank: i + 1,
  streak: Math.floor(Math.random() * 15),
  avatar: ['🥷', '🚀', '⚡', '🎯', '🧙', '💎', '🌙', '⚡', '🔍', '⛓️', '🐂', '🐻', '🪙', '🎪', '👑'][i % 15],
  isCurrentUser: i === 7, // 8th player is current user
  isVip: Math.random() > 0.8,
  v1TokenHolder: Math.random() > 0.6,
  v5TokenHolder: Math.random() > 0.9,
  badges: Array.from({ length: Math.floor(Math.random() * 8) }, (_, j) => `badge-${j}`),
  winRate: 0.4 + Math.random() * 0.4, // 40-80% win rate
  totalPredictions: Math.floor(Math.random() * 1000) + 50,
  joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  country: ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'SG', 'AU', 'BR', 'IN'][Math.floor(Math.random() * 10)],
  level: Math.floor(Math.random() * 60) + 1,
  experience: Math.floor(Math.random() * 10000),
  nextLevelExp: 10000
})).sort((a, b) => b.score - a.score).map((player, index) => ({
  ...player,
  currentRank: index + 1,
  previousRank: Math.max(1, index + 1 + (Math.random() > 0.7 ? Math.floor(Math.random() * 6) - 3 : 0))
}));

export default function LeaderboardPage() {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('weekly');
  const [category, setCategory] = useState<'overall' | 'crypto' | 'politics' | 'sports' | 'events'>('overall');
  const [selectedView, setSelectedView] = useState<'standard' | 'detailed'>('standard');
  const [totalPlayers] = useState(mockPlayers.length);
  const [totalPrizes] = useState(125000);

  const timeFrameOptions = [
    { id: 'daily', label: 'Today', icon: Clock },
    { id: 'weekly', label: 'This Week', icon: Calendar },
    { id: 'monthly', label: 'This Month', icon: Calendar },
    { id: 'all-time', label: 'All Time', icon: Globe }
  ];

  const categoryOptions = [
    { id: 'overall', label: 'Overall', icon: Trophy, color: 'text-shield-gold' },
    { id: 'crypto', label: 'Crypto', icon: Zap, color: 'text-orange-400' },
    { id: 'politics', label: 'Politics', icon: Users, color: 'text-blue-400' },
    { id: 'sports', label: 'Sports', icon: Target, color: 'text-green-400' },
    { id: 'events', label: 'Live Events', icon: Activity, color: 'text-neon-purple' }
  ];

  const topPerformers = mockPlayers.slice(0, 3);

  return (
    <div className="min-h-screen bg-vaultor-dark mesh-gradient">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Global{' '}
            <span className="text-neon bg-gradient-to-r from-shield-gold via-neon-cyan to-neon-green bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Compete with the world's top prediction traders. Track performance across all markets and time periods.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-green mb-2">
                ${(totalPrizes / 1000).toFixed(0)}K
              </div>
              <div className="text-gray-400 text-sm">Total Prizes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-cyan mb-2">
                {totalPlayers.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-neon-purple mb-2">
                {mockPlayers.filter(p => p.v1TokenHolder).length}
              </div>
              <div className="text-gray-400 text-sm">V1 Holders</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-shield-gold mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-3xl font-bold">LIVE</span>
              </div>
              <div className="text-gray-400 text-sm">Real-time Updates</div>
            </div>
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 text-center order-2 md:order-1"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center text-3xl">
                  {topPerformers[1]?.avatar}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{topPerformers[1]?.username}</h3>
              <p className="text-2xl font-bold text-gray-300 mb-2">
                {topPerformers[1]?.score.toLocaleString()}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>{(topPerformers[1]?.winRate * 100).toFixed(1)}% win rate</span>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-8 text-center relative order-1 md:order-2 border-2 border-yellow-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-2xl" />
              <div className="relative">
                <div className="mb-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center text-4xl">
                    {topPerformers[0]?.avatar}
                  </div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <Crown className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{topPerformers[0]?.username}</h3>
                <p className="text-3xl font-bold text-yellow-400 mb-2">
                  {topPerformers[0]?.score.toLocaleString()}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-4">
                  <TrendingUp className="w-4 h-4" />
                  <span>{(topPerformers[0]?.winRate * 100).toFixed(1)}% win rate</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-bold">
                  <Crown className="w-3 h-3" />
                  CHAMPION
                </div>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6 text-center order-3"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl flex items-center justify-center text-3xl">
                  {topPerformers[2]?.avatar}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{topPerformers[2]?.username}</h3>
              <p className="text-2xl font-bold text-orange-400 mb-2">
                {topPerformers[2]?.score.toLocaleString()}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>{(topPerformers[2]?.winRate * 100).toFixed(1)}% win rate</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Time Frame Selection */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Time Period</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {timeFrameOptions.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeFrame(option.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      timeFrame === option.id
                        ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/25'
                        : 'bg-glass-bg text-gray-400 hover:text-white hover:bg-glass-bg-light'
                    }`}
                  >
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {categoryOptions.map(option => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCategory(option.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-300 ${
                      category === option.id
                        ? 'bg-neon-cyan text-vaultor-dark shadow-lg shadow-neon-cyan/25'
                        : 'bg-glass-bg text-gray-400 hover:text-white hover:bg-glass-bg-light'
                    }`}
                  >
                    <option.icon className="w-3 h-3" />
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <LiveLeaderboard
            players={mockPlayers}
            timeFrame={timeFrame}
            category={category}
            maxVisible={50}
            showNearbyRanks={true}
            currentUserId="player-8"
            autoRefresh={true}
            refreshInterval={8000}
            showDetailedStats={selectedView === 'detailed'}
            allowFiltering={true}
            onPlayerSelect={(player) => {
              console.log('Selected player:', player);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}