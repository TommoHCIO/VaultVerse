'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  Zap,
  Shield,
  Fire,
  Sparkles,
  ChevronUp,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

export interface LeaderboardPlayer {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  rank: number;
  previousRank: number;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  streak: number;
  averageTime: number;
  totalRewards: number;
  tier: string;
  country: string;
  isVip: boolean;
  achievements: string[];
}

export interface LeaderboardProps {
  players: LeaderboardPlayer[];
  currentUserId?: string;
  eventTitle: string;
  totalParticipants: number;
  prizePool: number;
  timeRemaining: number;
  isLive?: boolean;
  className?: string;
}

export function EventLeaderboard({
  players,
  currentUserId,
  eventTitle,
  totalParticipants,
  prizePool,
  timeRemaining,
  isLive = false,
  className = ''
}: LeaderboardProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardPlayer | null>(null);
  const [viewMode, setViewMode] = useState<'live' | 'overall'>('live');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setAnimationKey(prev => prev + 1);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-luxury" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white">{rank}</div>;
    }
  };

  const getRankChange = (currentRank: number, previousRank: number) => {
    if (previousRank === 0) return null;
    const change = previousRank - currentRank;
    if (change > 0) {
      return (
        <div className="flex items-center text-emerald-400 text-xs">
          <ChevronUp className="w-3 h-3" />
          +{change}
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-400 text-xs">
          <ChevronDown className="w-3 h-3" />
          {change}
        </div>
      );
    }
    return null;
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'legendary': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'diamond': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'gold': return 'text-luxury bg-luxury/10 border-luxury/20';
      case 'silver': return 'text-gray-300 bg-gray-300/10 border-gray-300/20';
      case 'bronze': return 'text-amber-600 bg-amber-600/10 border-amber-600/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-emerald-400';
    if (accuracy >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  };

  const topThree = players.slice(0, 3);
  const restOfPlayers = players.slice(3);
  const currentUser = players.find(p => p.id === currentUserId);

  return (
    <div className={`bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700/30 bg-gradient-to-r from-luxury/5 to-champagne-gold/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-luxury" />
              {eventTitle} Leaderboard
            </h3>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{totalParticipants.toLocaleString()} participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>${(prizePool / 1000).toFixed(0)}K prize pool</span>
              </div>
              {isLive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-medium">LIVE</span>
                </div>
              )}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-800/50 rounded-xl p-1 border border-gray-700/30">
            <button
              onClick={() => setViewMode('live')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'live'
                  ? 'bg-luxury text-gray-900 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Live Ranking
            </button>
            <button
              onClick={() => setViewMode('overall')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                viewMode === 'overall'
                  ? 'bg-luxury text-gray-900 shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Overall
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Top 3 Podium */}
        <div className="mb-8">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-luxury" />
            Champions Podium
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThree.map((player, index) => {
              const podiumHeight = index === 0 ? 'h-32' : index === 1 ? 'h-28' : 'h-24';
              const podiumOrder = index === 0 ? 2 : index === 1 ? 1 : 3; // Center 1st place
              
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: podiumOrder * 0.2 }}
                  className={`relative ${index === 1 ? 'order-first md:order-none' : ''}`}
                  style={{ order: podiumOrder }}
                >
                  {/* Podium Base */}
                  <div className={`
                    ${podiumHeight} rounded-t-2xl mb-4 relative overflow-hidden
                    ${index === 0 ? 'bg-gradient-to-t from-luxury/20 to-luxury/5 border-t-2 border-luxury/30' :
                      index === 1 ? 'bg-gradient-to-t from-gray-300/20 to-gray-300/5 border-t-2 border-gray-300/30' :
                      'bg-gradient-to-t from-amber-600/20 to-amber-600/5 border-t-2 border-amber-600/30'
                    }
                  `}>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                      <div className="text-2xl font-bold text-white mb-1">#{player.rank}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">
                        {index === 0 ? 'Champion' : index === 1 ? '2nd Place' : '3rd Place'}
                      </div>
                    </div>
                  </div>

                  {/* Player Card */}
                  <div className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 rounded-2xl p-4 border border-gray-600/30 relative">
                    {/* Rank Badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      {getRankIcon(player.rank)}
                    </div>

                    {/* VIP Crown */}
                    {player.isVip && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-luxury rounded-full flex items-center justify-center border-2 border-gray-900">
                        <Sparkles className="w-3 h-3 text-gray-900" />
                      </div>
                    )}

                    <div className="text-center pt-2">
                      {/* Avatar */}
                      <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-luxury/20 to-champagne-gold/20 flex items-center justify-center text-2xl border border-luxury/30">
                        {player.avatar}
                      </div>

                      {/* Player Info */}
                      <div className="mb-3">
                        <div className="font-bold text-white text-lg mb-1">{player.displayName}</div>
                        <div className="text-xs text-gray-400">@{player.username}</div>
                        <div className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold mt-2 border ${getTierColor(player.tier)}`}>
                          {player.tier}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Score</span>
                          <span className="font-bold text-luxury">{player.score.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Accuracy</span>
                          <span className={`font-bold ${getAccuracyColor((player.correctAnswers / player.totalAnswers) * 100)}`}>
                            {((player.correctAnswers / player.totalAnswers) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Streak</span>
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <Fire className="w-3 h-3" />
                            {player.streak}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div>
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-champagne-gold" />
            Full Rankings
          </h4>

          <div className="space-y-2">
            {/* Current User Highlight (if not in top 10) */}
            {currentUser && currentUser.rank > 10 && (
              <>
                <div className="text-center py-2">
                  <div className="text-xs text-gray-500">...</div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-r from-luxury/10 to-champagne-gold/10 border border-luxury/30 rounded-xl p-4 relative"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-luxury rounded-l-xl"></div>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1 text-center">
                      {getRankIcon(currentUser.rank)}
                    </div>
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-luxury/20 to-champagne-gold/20 flex items-center justify-center border border-luxury/30">
                        {currentUser.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-luxury">{currentUser.displayName} (You)</div>
                        <div className="text-xs text-gray-400">@{currentUser.username}</div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="font-bold text-luxury">{currentUser.score.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className={`font-bold ${getAccuracyColor((currentUser.correctAnswers / currentUser.totalAnswers) * 100)}`}>
                        {((currentUser.correctAnswers / currentUser.totalAnswers) * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="font-bold text-emerald-400 flex items-center justify-center gap-1">
                        <Fire className="w-3 h-3" />
                        {currentUser.streak}
                      </div>
                      <div className="text-xs text-gray-400">Streak</div>
                    </div>
                    <div className="col-span-2 text-center">
                      <div className="font-bold text-blue-400">{formatTime(currentUser.averageTime)}</div>
                      <div className="text-xs text-gray-400">Avg Time</div>
                    </div>
                  </div>
                </motion.div>
                <div className="text-center py-2">
                  <div className="text-xs text-gray-500">...</div>
                </div>
              </>
            )}

            {/* Top Players List */}
            <div className="space-y-2">
              {restOfPlayers.slice(0, 7).map((player, index) => {
                const isCurrentUser = player.id === currentUserId;
                
                return (
                  <motion.div
                    key={`${player.id}-${animationKey}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`
                      rounded-xl p-4 border transition-all duration-200 cursor-pointer
                      ${isCurrentUser 
                        ? 'bg-gradient-to-r from-luxury/10 to-champagne-gold/10 border-luxury/30' 
                        : 'bg-gray-800/50 border-gray-700/30 hover:bg-gray-800/70 hover:border-gray-600/50'
                      }
                    `}
                    onClick={() => setSelectedPlayer(player)}
                    whileHover={{ scale: 1.01 }}
                  >
                    {isCurrentUser && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-luxury rounded-l-xl"></div>
                    )}
                    
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center">
                          {getRankIcon(player.rank)}
                          {getRankChange(player.rank, player.previousRank)}
                        </div>
                      </div>

                      {/* Player Info */}
                      <div className="col-span-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-600/20 to-gray-500/20 flex items-center justify-center border border-gray-600/30">
                          {player.avatar}
                        </div>
                        <div>
                          <div className={`font-semibold ${isCurrentUser ? 'text-luxury' : 'text-white'}`}>
                            {player.displayName}
                            {isCurrentUser && <span className="text-xs text-luxury ml-1">(You)</span>}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            @{player.username}
                            {player.isVip && <Sparkles className="w-3 h-3 text-luxury" />}
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="col-span-2 text-center">
                        <div className={`font-bold ${isCurrentUser ? 'text-luxury' : 'text-white'}`}>
                          {player.score.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">Score</div>
                      </div>

                      {/* Accuracy */}
                      <div className="col-span-2 text-center">
                        <div className={`font-bold ${getAccuracyColor((player.correctAnswers / player.totalAnswers) * 100)}`}>
                          {((player.correctAnswers / player.totalAnswers) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-400">{player.correctAnswers}/{player.totalAnswers}</div>
                      </div>

                      {/* Streak */}
                      <div className="col-span-2 text-center">
                        <div className="font-bold text-emerald-400 flex items-center justify-center gap-1">
                          <Fire className="w-3 h-3" />
                          {player.streak}
                        </div>
                        <div className="text-xs text-gray-400">Streak</div>
                      </div>

                      {/* Average Time */}
                      <div className="col-span-2 text-center">
                        <div className="font-bold text-blue-400">{formatTime(player.averageTime)}</div>
                        <div className="text-xs text-gray-400">Avg Time</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 pt-6 border-t border-gray-700/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-800/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-luxury mb-1">
                {players.length > 0 ? Math.max(...players.map(p => p.score)).toLocaleString() : 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Highest Score</div>
            </div>
            
            <div className="bg-gray-800/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {players.length > 0 ? (players.reduce((sum, p) => sum + ((p.correctAnswers / p.totalAnswers) * 100), 0) / players.length).toFixed(1) : 0}%
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Avg Accuracy</div>
            </div>
            
            <div className="bg-gray-800/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-champagne-gold mb-1">
                {players.length > 0 ? Math.max(...players.map(p => p.streak)) : 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Longest Streak</div>
            </div>
            
            <div className="bg-gray-800/30 rounded-xl p-4">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {players.length > 0 ? formatTime(Math.min(...players.map(p => p.averageTime))) : '0s'}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Fastest Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventLeaderboard;