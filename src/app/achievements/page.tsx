'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Crown,
  Shield,
  Target,
  Award,
  Sparkles,
  TrendingUp,
  Calendar,
  Gift,
  Zap,
  Users,
  Activity,
  BarChart3
} from 'lucide-react';
import { BadgeSystem } from '@/components/achievements/BadgeSystem';

export default function AchievementsPage() {
  const [selectedTab, setSelectedTab] = useState<'badges' | 'achievements' | 'leaderboard'>('badges');

  const stats = {
    totalBadgesEarned: 12,
    totalPoints: 2340,
    totalTokens: 150,
    currentStreak: 5,
    rank: 89,
    completionRate: 34.5
  };

  const recentAchievements = [
    {
      id: 'v1_pioneer',
      name: 'V1 Pioneer',
      description: 'Acquired your first V1 token',
      points: 2000,
      tokens: 100,
      unlockedAt: new Date('2024-12-15'),
      rarity: 'legendary'
    },
    {
      id: 'first_win',
      name: 'First Victory',
      description: 'Won your first prediction',
      points: 100,
      unlockedAt: new Date('2024-12-10'),
      rarity: 'common'
    },
    {
      id: 'social_starter',
      name: 'Social Starter',
      description: 'Followed your first trader',
      points: 50,
      unlockedAt: new Date('2024-12-08'),
      rarity: 'common'
    }
  ];

  const upcomingChallenges = [
    {
      id: 'holiday_special',
      name: '🎄 Holiday Streak Master',
      description: 'Maintain a 10-day streak during December',
      reward: 'Exclusive holiday badge + 500 tokens',
      timeLeft: '12 days',
      progress: 40,
      category: 'seasonal'
    },
    {
      id: 'year_end_marathon',
      name: '🏁 Year-End Marathon',
      description: 'Place 50 predictions before 2025',
      reward: 'Champion badge + 1000 points',
      timeLeft: '16 days',
      progress: 76,
      category: 'milestone'
    }
  ];

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
            Your{' '}
            <span className="text-neon bg-gradient-to-r from-shield-gold via-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Achievements
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Track your progress, unlock exclusive badges, and climb the ranks in the Vaultor ecosystem.
          </p>
        </motion.div>

        {/* Achievement Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-neon-green mb-1">{stats.totalBadgesEarned}</div>
              <div className="text-xs text-gray-400">Badges Earned</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-shield-gold to-yellow-500 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-shield-gold mb-1">{stats.totalPoints.toLocaleString()}</div>
              <div className="text-xs text-gray-400">Total Points</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-neon-green to-green-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-neon-green mb-1">{stats.totalTokens}</div>
              <div className="text-xs text-gray-400">Bonus Tokens</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-red-400 mb-1">{stats.currentStreak}</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-neon-purple mb-1">#{stats.rank}</div>
              <div className="text-xs text-gray-400">Global Rank</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-neon-cyan mb-1">{stats.completionRate}%</div>
              <div className="text-xs text-gray-400">Completion</div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {[
            { id: 'badges', label: 'Badge Collection', icon: Award },
            { id: 'achievements', label: 'Recent Unlocks', icon: Trophy },
            { id: 'leaderboard', label: 'Challenges', icon: Target }
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/25'
                  : 'bg-glass-card text-gray-400 hover:text-white hover:bg-glass-bg-light'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedTab === 'badges' && (
            <BadgeSystem
              showProgressBars={true}
              allowFiltering={true}
              showHiddenBadges={false}
              compactView={false}
              onBadgeClick={(badge) => {
                console.log('Badge clicked:', badge);
              }}
            />
          )}

          {selectedTab === 'achievements' && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-shield-gold" />
                  Recent Achievements
                </h2>
                
                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-glass-bg border border-glass-border"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          achievement.rarity === 'legendary' 
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                            : 'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          {achievement.rarity === 'legendary' ? (
                            <Shield className="w-6 h-6 text-white" />
                          ) : (
                            <Star className="w-6 h-6 text-white" />
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-white">{achievement.name}</h3>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs">
                            <span className="text-shield-gold">+{achievement.points} points</span>
                            {achievement.tokens && (
                              <span className="text-neon-green">+{achievement.tokens} tokens</span>
                            )}
                            <span className="text-gray-500">
                              {achievement.unlockedAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        achievement.rarity === 'legendary'
                          ? 'bg-yellow-400/20 text-yellow-400'
                          : 'bg-gray-400/20 text-gray-400'
                      }`}>
                        {achievement.rarity.toUpperCase()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'leaderboard' && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-neon-green" />
                  Active Challenges
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {upcomingChallenges.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative p-6 rounded-2xl bg-gradient-to-br from-glass-bg to-glass-bg-light border border-glass-border overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10 rounded-full blur-2xl" />
                      
                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-2">
                              {challenge.name}
                            </h3>
                            <p className="text-sm text-gray-400 mb-3">
                              {challenge.description}
                            </p>
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-xs font-bold">
                              <Gift className="w-3 h-3" />
                              {challenge.reward}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-bold text-neon-cyan">{challenge.timeLeft}</div>
                            <div className="text-xs text-gray-400">remaining</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Progress</span>
                            <span className="text-sm font-bold text-neon-green">
                              {challenge.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-glass-bg rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${challenge.progress}%` }}
                              transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                              className="h-2 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Achievement Tips */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-neon-purple" />
                  Pro Tips
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                    <div className="w-8 h-8 bg-neon-green/20 rounded-lg flex items-center justify-center mb-3">
                      <TrendingUp className="w-4 h-4 text-neon-green" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Daily Consistency</h3>
                    <p className="text-sm text-gray-400">
                      Make at least one prediction daily to build up your streak multiplier.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                    <div className="w-8 h-8 bg-shield-gold/20 rounded-lg flex items-center justify-center mb-3">
                      <Shield className="w-4 h-4 text-shield-gold" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Shield Strategy</h3>
                    <p className="text-sm text-gray-400">
                      Use Shield protection on uncertain predictions to unlock V1 token benefits.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                    <div className="w-8 h-8 bg-neon-purple/20 rounded-lg flex items-center justify-center mb-3">
                      <Users className="w-4 h-4 text-neon-purple" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Social Engagement</h3>
                    <p className="text-sm text-gray-400">
                      Follow top traders and participate in community events for social badges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}