'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Zap,
  Shield,
  Flame,
  Award,
  Target,
  Users,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Sparkles,
  Activity
} from 'lucide-react';

interface LeaderboardPlayer {
  id: string;
  username: string;
  score: number;
  previousRank: number;
  currentRank: number;
  streak: number;
  avatar: string;
  isCurrentUser?: boolean;
  isVip: boolean;
  v1TokenHolder: boolean;
  v5TokenHolder: boolean;
  badges: string[];
  winRate: number;
  totalPredictions: number;
  joinDate: Date;
  country: string;
  level: number;
  experience: number;
  nextLevelExp: number;
}

interface LiveLeaderboardProps {
  players: LeaderboardPlayer[];
  timeFrame: 'daily' | 'weekly' | 'monthly' | 'all-time';
  category: 'overall' | 'crypto' | 'politics' | 'sports' | 'events';
  maxVisible?: number;
  showNearbyRanks?: boolean;
  currentUserId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  showDetailedStats?: boolean;
  allowFiltering?: boolean;
  onPlayerSelect?: (player: LeaderboardPlayer) => void;
}

export function LiveLeaderboard({
  players,
  timeFrame = 'weekly',
  category = 'overall',
  maxVisible = 10,
  showNearbyRanks = true,
  currentUserId,
  autoRefresh = true,
  refreshInterval = 5000,
  showDetailedStats = false,
  allowFiltering = false,
  onPlayerSelect
}: LiveLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'vip' | 'v1' | 'v5'>('all');
  const [expandedView, setExpandedView] = useState(false);
  const [animatingRanks, setAnimatingRanks] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(Date.now());
      // Simulate some rank changes
      const rankChanges = new Set<string>();
      players.forEach(player => {
        if (Math.random() < 0.1) { // 10% chance of rank change
          rankChanges.add(player.id);
        }
      });
      setAnimatingRanks(rankChanges);
      
      // Clear animations after 2 seconds
      setTimeout(() => setAnimatingRanks(new Set()), 2000);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, players]);

  // Filter and search players
  const filteredPlayers = useMemo(() => {
    let filtered = [...players];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(player =>
        player.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (selectedFilter) {
      case 'vip':
        filtered = filtered.filter(player => player.isVip);
        break;
      case 'v1':
        filtered = filtered.filter(player => player.v1TokenHolder);
        break;
      case 'v5':
        filtered = filtered.filter(player => player.v5TokenHolder);
        break;
    }

    // Sort by current rank
    return filtered.sort((a, b) => a.currentRank - b.currentRank);
  }, [players, searchQuery, selectedFilter]);

  // Get visible players with nearby ranks
  const visiblePlayers = useMemo(() => {
    const currentUser = players.find(p => p.id === currentUserId);
    let visible = filteredPlayers.slice(0, maxVisible);

    if (showNearbyRanks && currentUser && !visible.includes(currentUser)) {
      // Add current user and nearby players
      const userRank = currentUser.currentRank;
      const nearbyStart = Math.max(0, userRank - 3);
      const nearbyEnd = Math.min(filteredPlayers.length, userRank + 2);
      const nearbyPlayers = filteredPlayers.slice(nearbyStart, nearbyEnd);
      
      // Combine top players and nearby players, avoiding duplicates
      const combined = [...visible];
      nearbyPlayers.forEach(player => {
        if (!combined.find(p => p.id === player.id)) {
          combined.push(player);
        }
      });
      
      return combined;
    }

    return visible;
  }, [filteredPlayers, maxVisible, showNearbyRanks, currentUserId, players]);

  const getRankChangeIcon = (player: LeaderboardPlayer) => {
    const change = player.previousRank - player.currentRank;
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-red-400" />;
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-400" />;
    return null;
  };

  const getPlayerLevelColor = (level: number) => {
    if (level >= 50) return 'text-purple-400';
    if (level >= 30) return 'text-blue-400';
    if (level >= 15) return 'text-green-400';
    if (level >= 5) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const formatScore = (score: number) => {
    if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
    return score.toLocaleString();
  };

  const formatWinRate = (rate: number) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  const timeFrameLabels = {
    daily: 'Today',
    weekly: 'This Week',
    monthly: 'This Month',
    'all-time': 'All Time'
  };

  const categoryLabels = {
    overall: 'Overall',
    crypto: 'Crypto',
    politics: 'Politics',
    sports: 'Sports',
    events: 'Live Events'
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-shield-gold to-yellow-500 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Leaderboard
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </h2>
            <p className="text-sm text-gray-400">
              {timeFrameLabels[timeFrame]} • {categoryLabels[category]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400">
            Updated {Math.floor((Date.now() - lastUpdate) / 1000)}s ago
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpandedView(!expandedView)}
            className="p-2 rounded-lg bg-glass-bg hover:bg-glass-bg-light text-gray-400 hover:text-white transition-colors"
          >
            {expandedView ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Filters */}
      {allowFiltering && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-glass-bg border border-glass-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple transition-colors duration-300"
            />
          </div>
          
          <div className="flex gap-2">
            {(['all', 'vip', 'v1', 'v5'] as const).map(filter => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  selectedFilter === filter
                    ? 'bg-neon-purple text-white'
                    : 'bg-glass-bg text-gray-400 hover:text-white hover:bg-glass-bg-light'
                }`}
              >
                {filter === 'all' ? 'All' : filter.toUpperCase()}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Entries */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {visiblePlayers.map((player, index) => {
            const isAnimating = animatingRanks.has(player.id);
            const rankChange = player.previousRank - player.currentRank;
            const isCurrentUser = player.id === currentUserId;
            
            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: isAnimating ? 1.02 : 1
                }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                whileHover={{ scale: 1.01 }}
                onClick={() => onPlayerSelect?.(player)}
                className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isCurrentUser
                    ? 'border-neon-purple bg-neon-purple/10'
                    : player.currentRank === 1
                    ? 'border-yellow-400/30 bg-gradient-to-r from-yellow-400/10 to-orange-400/10'
                    : player.currentRank === 2
                    ? 'border-gray-400/30 bg-gradient-to-r from-gray-400/10 to-gray-300/10'
                    : player.currentRank === 3
                    ? 'border-orange-400/30 bg-gradient-to-r from-orange-400/10 to-red-400/10'
                    : 'border-glass-border bg-glass-bg hover:border-neon-purple/30 hover:bg-glass-bg-light'
                }`}
              >
                {/* Rank Change Animation */}
                <AnimatePresence>
                  {isAnimating && rankChange !== 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -right-2 -top-2 z-10"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        rankChange > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        <span className="text-white text-xs font-bold">
                          {rankChange > 0 ? `+${rankChange}` : rankChange}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <div className={`text-2xl font-bold ${
                      player.currentRank === 1 ? 'text-yellow-400' :
                      player.currentRank === 2 ? 'text-gray-300' :
                      player.currentRank === 3 ? 'text-orange-400' :
                      'text-white'
                    }`}>
                      #{player.currentRank}
                    </div>
                    {getRankBadge(player.currentRank)}
                  </div>

                  {/* Avatar & Basic Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative">
                      <div className={`text-2xl p-2 rounded-xl ${
                        player.v5TokenHolder ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                        player.v1TokenHolder ? 'bg-gradient-to-br from-neon-purple to-neon-cyan' :
                        'bg-glass-bg'
                      }`}>
                        {player.avatar}
                      </div>
                      
                      {/* Level Badge */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-glass-bg border border-glass-border rounded-full flex items-center justify-center">
                        <span className={`text-xs font-bold ${getPlayerLevelColor(player.level)}`}>
                          {player.level}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white truncate">
                          {player.username}
                        </span>
                        
                        {/* Status Badges */}
                        <div className="flex items-center gap-1">
                          {player.isVip && <Crown className="w-3 h-3 text-yellow-400" />}
                          {player.v5TokenHolder && <Star className="w-3 h-3 text-purple-400" />}
                          {player.v1TokenHolder && <Shield className="w-3 h-3 text-neon-cyan" />}
                          {player.streak >= 10 && <Flame className="w-3 h-3 text-red-400" />}
                        </div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {player.streak} streak
                        </span>
                        <span>{formatWinRate(player.winRate)} win rate</span>
                        <span>{player.totalPredictions} predictions</span>
                      </div>
                    </div>
                  </div>

                  {/* Score & Rank Change */}
                  <div className="text-right min-w-[100px]">
                    <div className="text-xl font-bold text-neon-green mb-1">
                      {formatScore(player.score)}
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      {getRankChangeIcon(player)}
                      <span className="text-xs text-gray-400">
                        {rankChange === 0 ? '–' : 
                         rankChange > 0 ? `+${rankChange}` : 
                         rankChange}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience Bar */}
                <div className="mt-3 w-full bg-glass-bg rounded-full h-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(player.experience / player.nextLevelExp) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    className={`h-1 rounded-full ${
                      player.v5TokenHolder ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                      player.v1TokenHolder ? 'bg-gradient-to-r from-neon-purple to-neon-cyan' :
                      'bg-gradient-to-r from-neon-green to-neon-cyan'
                    }`}
                  />
                </div>

                {/* Detailed Stats (Expanded View) */}
                <AnimatePresence>
                  {expandedView && showDetailedStats && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-glass-border"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="text-center">
                          <div className="text-neon-green font-bold">{player.badges.length}</div>
                          <div className="text-gray-400">Badges</div>
                        </div>
                        <div className="text-center">
                          <div className="text-neon-cyan font-bold">{player.country}</div>
                          <div className="text-gray-400">Country</div>
                        </div>
                        <div className="text-center">
                          <div className="text-neon-purple font-bold">
                            {Math.floor((Date.now() - player.joinDate.getTime()) / (1000 * 60 * 60 * 24))}d
                          </div>
                          <div className="text-gray-400">Member</div>
                        </div>
                        <div className="text-center">
                          <div className="text-shield-gold font-bold">{player.experience}</div>
                          <div className="text-gray-400">XP</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t border-glass-border">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Showing {visiblePlayers.length} of {filteredPlayers.length} players</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Live updates
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {players.length.toLocaleString()} total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}