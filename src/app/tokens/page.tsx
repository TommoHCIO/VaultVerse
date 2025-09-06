'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  Crown,
  Shield,
  Star,
  Zap,
  TrendingUp,
  Users,
  Lock,
  Unlock,
  Activity,
  BarChart3,
  Trophy,
  Sparkles
} from 'lucide-react';
import { TokenVersionDisplay } from '@/components/tokens/TokenVersionDisplay';

export default function TokensPage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'marketplace' | 'staking'>('overview');
  const [selectedVersion, setSelectedVersion] = useState<'V1' | 'V2' | 'V3' | 'V4' | 'V5'>('V1');

  const userStats = {
    totalTokenValue: 45000,
    stakingRewards: 1250,
    monthlyYield: 8.5,
    governanceWeight: 2.3,
    totalStaked: 15000,
    availableRewards: 450,
    nextUnlock: 'V3',
    daysToUnlock: 12
  };

  const tokenOverview = {
    V1: { owned: 100, staked: 50, value: 5000 },
    V2: { owned: 25, staked: 20, value: 12500 },
    V3: { owned: 0, staked: 0, value: 0 },
    V4: { owned: 0, staked: 0, value: 0 },
    V5: { owned: 0, staked: 0, value: 0 }
  };

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
            Token{' '}
            <span className="text-neon bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Ecosystem
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Unlock exclusive utilities and benefits with our multi-tier token system. From basic perks to legendary status.
          </p>
        </motion.div>

        {/* User Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-neon-green to-green-500 rounded-xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-neon-green mb-1">
                ${userStats.totalTokenValue.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Portfolio Value</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-neon-purple to-purple-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-neon-purple mb-1">
                +${userStats.stakingRewards}
              </div>
              <div className="text-xs text-gray-400">Staking Rewards</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-shield-gold to-yellow-500 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-shield-gold mb-1">
                {userStats.monthlyYield}%
              </div>
              <div className="text-xs text-gray-400">Monthly Yield</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-neon-cyan to-blue-500 rounded-xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-neon-cyan mb-1">
                {userStats.governanceWeight}x
              </div>
              <div className="text-xs text-gray-400">Governance Weight</div>
            </div>
          </div>
        </motion.div>

        {/* Token Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-shield-gold" />
            Your Token Portfolio
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(tokenOverview).map(([version, data], index) => (
              <motion.div
                key={version}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className={`glass-card rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                  selectedVersion === version 
                    ? 'ring-2 ring-neon-purple shadow-lg shadow-neon-purple/25' 
                    : 'hover:ring-1 hover:ring-gray-500'
                }`}
                onClick={() => setSelectedVersion(version as any)}
              >
                <div className="text-center">
                  <div className={`w-10 h-10 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                    data.owned > 0 
                      ? 'bg-gradient-to-br from-neon-green to-green-500' 
                      : 'bg-gray-600'
                  }`}>
                    {data.owned > 0 ? (
                      <Unlock className="w-5 h-5 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <h3 className={`font-bold text-sm mb-1 ${
                    data.owned > 0 ? 'text-white' : 'text-gray-400'
                  }`}>
                    {version}
                  </h3>
                  <div className={`text-xs mb-1 ${
                    data.owned > 0 ? 'text-neon-green' : 'text-gray-500'
                  }`}>
                    {data.owned > 0 ? `${data.owned} owned` : 'Locked'}
                  </div>
                  <div className={`text-xs ${
                    data.value > 0 ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    ${data.value.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {[
            { id: 'overview', label: 'Token Overview', icon: Star },
            { id: 'marketplace', label: 'Marketplace', icon: Activity },
            { id: 'staking', label: 'Staking & Rewards', icon: Zap }
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
          {selectedTab === 'overview' && (
            <TokenVersionDisplay
              selectedVersion={selectedVersion}
              showOwnershipOnly={false}
              compactView={false}
              showMarketData={true}
              onPurchase={(version, amount) => {
                console.log(`Purchase ${amount} ${version} tokens`);
              }}
              onStake={(version, amount) => {
                console.log(`Stake ${amount} ${version} tokens`);
              }}
            />
          )}

          {selectedTab === 'marketplace' && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-neon-cyan" />
                  Token Marketplace
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quick Buy/Sell */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Quick Trade</h3>
                    
                    {(['V1', 'V2', 'V3'] as const).map((version) => (
                      <div key={version} className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-green-500 rounded-lg flex items-center justify-center">
                              <Coins className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-semibold text-white">{version}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-neon-green">
                              ${(Math.random() * 1000 + 50).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-400">per token</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button className="px-3 py-2 rounded-lg bg-neon-green/20 text-neon-green hover:bg-neon-green/30 transition-colors text-sm font-semibold">
                            Buy
                          </button>
                          <button className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold">
                            Sell
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Market Stats */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Market Statistics</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-glass-bg border border-glass-border text-center">
                        <div className="text-2xl font-bold text-neon-cyan mb-1">
                          $2.4M
                        </div>
                        <div className="text-xs text-gray-400">24h Volume</div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-glass-bg border border-glass-border text-center">
                        <div className="text-2xl font-bold text-neon-green mb-1">
                          +12.5%
                        </div>
                        <div className="text-xs text-gray-400">24h Change</div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-glass-bg border border-glass-border text-center">
                        <div className="text-2xl font-bold text-neon-purple mb-1">
                          15.2K
                        </div>
                        <div className="text-xs text-gray-400">Holders</div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-glass-bg border border-glass-border text-center">
                        <div className="text-2xl font-bold text-shield-gold mb-1">
                          67%
                        </div>
                        <div className="text-xs text-gray-400">Staked</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'staking' && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-neon-purple" />
                  Staking & Rewards
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Staking */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Active Stakes</h3>
                    
                    <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-neon-green to-green-500 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">V1 Stake</div>
                            <div className="text-xs text-gray-400">50 tokens staked</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-neon-green">+8.5% APY</div>
                          <div className="text-xs text-gray-400">$125 rewards</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-neon-green">30 days left</span>
                        </div>
                        <div className="w-full bg-glass-bg rounded-full h-2">
                          <div className="h-2 bg-gradient-to-r from-neon-green to-green-500 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-purple-500 rounded-lg flex items-center justify-center">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-white">V2 Stake</div>
                            <div className="text-xs text-gray-400">20 tokens staked</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-neon-purple">+12.0% APY</div>
                          <div className="text-xs text-gray-400">$325 rewards</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-neon-purple">45 days left</span>
                        </div>
                        <div className="w-full bg-glass-bg rounded-full h-2">
                          <div className="h-2 bg-gradient-to-r from-neon-purple to-purple-500 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Staking Rewards */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Available Rewards</h3>
                    
                    <div className="p-6 rounded-xl bg-gradient-to-br from-neon-green/10 to-green-500/10 border border-neon-green/20">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neon-green to-green-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-3xl font-bold text-neon-green mb-2">
                          ${userStats.availableRewards}
                        </div>
                        <div className="text-sm text-gray-300 mb-4">
                          Available to claim now
                        </div>
                        <button className="w-full px-4 py-2 rounded-xl bg-neon-green text-vaultor-dark font-bold hover:bg-neon-green/80 transition-colors">
                          Claim Rewards
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-300">Reward History</h4>
                      
                      {[
                        { amount: 125, token: 'V1', date: '2024-12-15' },
                        { amount: 89, token: 'V1', date: '2024-12-08' },
                        { amount: 156, token: 'V2', date: '2024-12-01' }
                      ].map((reward, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-glass-bg border border-glass-border">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-neon-green to-green-500 rounded-full flex items-center justify-center">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white">
                                +${reward.amount} rewards
                              </div>
                              <div className="text-xs text-gray-400">
                                {reward.token} staking
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {reward.date}
                          </div>
                        </div>
                      ))}
                    </div>
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