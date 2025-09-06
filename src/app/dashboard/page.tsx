'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Trophy,
  Shield,
  Zap,
  Activity,
  Calendar,
  Target,
  Award,
  Bell,
  Settings,
  Plus,
  MoreHorizontal,
  Filter,
  Search,
  BarChart3,
  PieChart,
  LineChart,
  Coins,
  Crown,
  UserPlus,
  UserCheck,
  Sparkles
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

// Executive Investment Management Dashboard for High-Net-Worth Individuals
export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'advisory' | 'performance' | 'portfolio'>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [advisoryList, setAdvisoryList] = useState<string[]>(['institutional_research', 'market_intelligence', 'wealth_advisory']);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Executive client data with institutional metrics
  const clientData = {
    name: 'Alexander J. Morgan',
    designation: 'Chief Investment Officer',
    avatar: '👔',
    tier: 'Platinum Executive',
    accreditation: 'Qualified Institutional Buyer',
    portfolioTier: 'Ultra-High-Net-Worth',
    level: 15,
    experience: 8750,
    nextLevelExp: 10000,
    ranking: 'Top 1% Institutional Investors',
    advisoryClients: 847,
    followingAnalysts: 56,
    totalReturns: 2456500,
    annualizedReturn: 18.7,
    winRate: 84.2,
    riskAdjustedReturn: 2.34,
    consecutivePeriods: 24,
    assetsUnderManagement: 125000000,
    institutionalGrade: 'AAA',
    wealthScore: 9520
  };

  // Institutional Advisory Intelligence Feed
  const advisoryFeed = [
    {
      id: '1',
      analyst: { name: 'Goldman Sachs Research', username: '@gs_research', avatar: '🏛️', tier: 'Tier 1 Investment Bank' },
      action: 'published market outlook',
      target: 'Digital Assets showing institutional accumulation patterns',
      allocation: 250000000,
      conviction: 'High Confidence',
      timestamp: '2 hours ago',
      impact: 'Market Moving',
      subscribers: 15000,
      views: 45000,
      isSubscribed: true
    },
    {
      id: '2',
      analyst: { name: 'JPMorgan Private Bank', username: '@jpm_private', avatar: '💼', tier: 'Private Banking Division' },
      action: 'achieved alpha target',
      target: 'Q4 Technology Sector Rebalancing Strategy',
      returns: 185000000,
      timestamp: '4 hours ago',
      impact: 'Portfolio Impact',
      subscribers: 12500,
      views: 28000,
      isSubscribed: true
    },
    {
      id: '3',
      analyst: { name: 'BlackRock Institutional', username: '@blackrock_inst', avatar: '⚫', tier: 'Asset Management Leader' },
      action: 'reached performance milestone',
      target: '24 consecutive quarters of alpha generation',
      timestamp: '6 hours ago',
      impact: 'Institutional Benchmark',
      subscribers: 18000,
      views: 67000,
      isSubscribed: true
    },
    {
      id: '4',
      analyst: { name: 'Credit Suisse Wealth', username: '@cs_wealth', avatar: '🏦', tier: 'Wealth Management' },
      action: 'released strategic insight',
      target: 'Alternative Investment Opportunities in Prediction Markets',
      timestamp: '8 hours ago',
      impact: 'Strategic Analysis',
      subscribers: 9800,
      views: 23000,
      isSubscribed: false
    }
  ];

  // Institutional Leaders & Fund Managers
  const institutionalLeaders = [
    { name: 'Bridgewater Associates', mandate: 'Global Macro Strategy', avatar: '🌐', return: 23.7, aum: 154200000000, tier: 'Tier 1 Hedge Fund' },
    { name: 'Renaissance Technologies', mandate: 'Quantitative Analysis', avatar: '🔬', return: 34.2, aum: 98760000000, tier: 'Algorithmic Trading' },
    { name: 'Citadel Investment Group', mandate: 'Multi-Strategy Alpha', avatar: '🏢', return: 28.9, aum: 85430000000, tier: 'Market Making Leader' },
    { name: 'Two Sigma Investments', mandate: 'Data Science Driven', avatar: '∑', return: 19.4, aum: 120340000000, tier: 'Technology-First Fund' }
  ];

  // Executive Investment Activity
  const executiveActivity = [
    { type: 'alpha', position: 'Digital Asset Allocation Strategy', returns: 1450000, timestamp: '1 hour ago' },
    { type: 'allocation', position: 'Political Risk Hedge Portfolio', amount: 25000000, timestamp: '3 hours ago' },
    { type: 'advisory', institution: 'Institutional Research Partners', timestamp: '5 hours ago' },
    { type: 'benchmark', milestone: 'Quarterly Alpha Target Achieved', excess: 2.4, timestamp: '1 day ago' },
    { type: 'risk', position: 'Alternative Investment Protection', coverage: 50000000, timestamp: '2 days ago' }
  ];

  // Recent Activity Data (fix for undefined variable)
  const recentActivity = [
    { type: 'win', market: 'Digital Asset Momentum Strategy', profit: 145000, timestamp: '2 hours ago' },
    { type: 'place', market: 'Geopolitical Risk Hedge', amount: 2500000, timestamp: '4 hours ago' },
    { type: 'achievement', title: 'Institutional Alpha Achievement', reward: 5000, timestamp: '6 hours ago' },
    { type: 'shield', market: 'Commodity Futures Protection', protection: 20, timestamp: '8 hours ago' },
    { type: 'follow', user: 'Goldman Sachs Research', timestamp: '12 hours ago' }
  ];

  // Top Performers Data (fix for undefined variable)
  const topPerformers = [
    { name: 'Morgan Stanley', username: '@ms_research', avatar: '🏛️', return: 23.4, followers: 15000, verified: true },
    { name: 'BlackRock Alpha', username: '@blackrock_alpha', avatar: '⚫', return: 19.8, followers: 12500, verified: true },
    { name: 'JP Morgan Private', username: '@jpm_private', avatar: '💼', return: 18.2, followers: 11200, verified: true },
    { name: 'Citadel Research', username: '@citadel_research', avatar: '🏢', return: 16.9, followers: 9800, verified: true }
  ];

  // Social Feed Data (fix for undefined variable)
  const socialFeed = [
    { 
      id: '1', 
      user: { name: 'Renaissance Tech', username: '@renaissance_tech', avatar: '🔬', verified: true },
      action: 'achieved alpha on',
      target: 'Quantitative Market Strategy',
      amount: 15000000,
      confidence: 87,
      profit: 2400000,
      timestamp: '3 hours ago',
      likes: 245,
      comments: 67,
      shares: 34,
      isFollowing: true
    },
    {
      id: '2',
      user: { name: 'Bridgewater', username: '@bridgewater', avatar: '🌐', verified: true },
      action: 'allocated position in',
      target: 'Global Macro Opportunity',
      amount: 45000000,
      confidence: 92,
      timestamp: '6 hours ago',
      likes: 189,
      comments: 43,
      shares: 28,
      isFollowing: false
    }
  ];

  // Portfolio Data (fix for undefined variable)
  const portfolioData = [
    { category: 'Digital Assets', value: 48500000, percentage: 38.8, color: 'from-luxury to-champagne-gold' },
    { category: 'Geopolitical Events', value: 36200000, percentage: 29.0, color: 'from-executive to-platinum-light' },
    { category: 'Commodities & Markets', value: 28900000, percentage: 23.1, color: 'from-emerald to-luxury' },
    { category: 'Economic Indicators', value: 11400000, percentage: 9.1, color: 'from-platinum to-executive' }
  ];

  // Following List State (fix for undefined variable)
  const [followingList, setFollowingList] = useState<string[]>(['ms_research', 'blackrock_alpha']);

  // Handle Follow Function
  const handleFollow = (username: string) => {
    if (followingList.includes(username)) {
      setFollowingList(prev => prev.filter(u => u !== username));
      setFeedbackMessage(`Unfollowed ${username}`);
    } else {
      setFollowingList(prev => [...prev, username]);
      setFeedbackMessage(`Now following ${username}`);
    }
    setShowFeedback(true);
  };

  // Institutional Asset Allocation
  const assetAllocation = [
    { category: 'Digital Assets', value: 48500000, percentage: 38.8, color: 'from-luxury to-champagne-gold' },
    { category: 'Geopolitical Events', value: 36200000, percentage: 29.0, color: 'from-executive to-platinum-light' },
    { category: 'Commodities & Markets', value: 28900000, percentage: 23.1, color: 'from-emerald to-luxury' },
    { category: 'Economic Indicators', value: 11400000, percentage: 9.1, color: 'from-platinum to-executive' }
  ];

  // User Data for calculations
  const userData = {
    monthlyReturn: 12.4
  };

  const handleAdvisorySubscription = (institution: string) => {
    if (advisoryList.includes(institution)) {
      setAdvisoryList(prev => prev.filter(u => u !== institution));
      setFeedbackMessage(`Unsubscribed from ${institution} research`);
    } else {
      setAdvisoryList(prev => [...prev, institution]);
      setFeedbackMessage(`Now receiving ${institution} institutional insights`);
    }
    setShowFeedback(true);
  };

  return (
    <div className="min-h-screen bg-vaultor-dark executive-gradient">
      <div className="max-w-[1800px] mx-auto px-8 py-12">
        {/* Executive Client Profile Header */}
        <ScrollReveal>
          <div className="glass-executive rounded-3xl p-8 mb-12 element-3d">
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-8">
              {/* Executive Profile & Credentials */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-luxury to-champagne-gold rounded-2xl flex items-center justify-center text-4xl border-2 border-luxury/30">
                    {clientData.avatar}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-luxury rounded-full flex items-center justify-center border-2 border-vaultor-dark">
                    <Crown className="w-4 h-4 text-vaultor-dark" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="px-3 py-1 bg-luxury text-xs font-bold text-vaultor-dark rounded-lg">
                      {clientData.tier}
                    </div>
                  </div>
                </div>

                <div>
                  <h1 className="text-3xl font-bold mb-2 heading-executive">
                    {clientData.name}
                  </h1>
                  <p className="text-lg text-luxury font-semibold mb-2">{clientData.designation}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald rounded-full"></div>
                      <span className="text-platinum">{clientData.accreditation}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-luxury rounded-full"></div>
                      <span className="text-platinum">{clientData.portfolioTier}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-executive rounded-full"></div>
                      <span className="text-platinum">{clientData.ranking}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="flex-1 grid grid-cols-3 gap-6 max-w-2xl">
                <div className="text-center glass-light p-4 rounded-xl border border-executive/20">
                  <div className="text-2xl font-bold text-luxury mb-1">${(clientData.assetsUnderManagement / 1000000).toFixed(0)}M</div>
                  <div className="text-xs text-platinum-dark uppercase tracking-wider">Assets Under Management</div>
                </div>
                <div className="text-center glass-light p-4 rounded-xl border border-executive/20">
                  <div className="text-2xl font-bold text-emerald mb-1">{clientData.annualizedReturn}%</div>
                  <div className="text-xs text-platinum-dark uppercase tracking-wider">Annualized Return</div>
                </div>
                <div className="text-center glass-light p-4 rounded-xl border border-executive/20">
                  <div className="text-2xl font-bold text-executive mb-1">{clientData.institutionalGrade}</div>
                  <div className="text-xs text-platinum-dark uppercase tracking-wider">Credit Rating</div>
                </div>
              </div>

              {/* Executive Actions */}
              <div className="flex items-center gap-4">
                <AnimatedButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative glass-light border border-executive/20"
                >
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-luxury rounded-full" />
                </AnimatedButton>
                
                <AnimatedButton variant="secondary" size="sm" className="glass-light border border-executive/20">
                  <Settings className="w-5 h-5" />
                  Portfolio Settings
                </AnimatedButton>
                
                <AnimatedButton variant="primary" size="sm" className="btn-luxury">
                  <Plus className="w-5 h-5" />
                  New Position
                </AnimatedButton>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Executive Performance Metrics */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            <InteractiveCard className="glass-executive rounded-2xl p-6 text-center element-3d">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-luxury/20 to-champagne-gold/20 rounded-2xl flex items-center justify-center border border-luxury/30">
                <DollarSign className="w-8 h-8 text-luxury" />
              </div>
              <div className="text-3xl font-bold text-luxury mb-2">
                ${(clientData.totalReturns / 1000).toFixed(1)}M
              </div>
              <div className="text-sm text-platinum-dark uppercase tracking-widest mb-2">Total Alpha Generated</div>
              <div className="text-sm text-emerald mt-2 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +{clientData.annualizedReturn}% annual return
              </div>
            </InteractiveCard>

            <InteractiveCard className="glass-executive rounded-2xl p-6 text-center element-3d">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-executive/20 to-platinum/20 rounded-2xl flex items-center justify-center border border-executive/30">
                <Target className="w-8 h-8 text-executive" />
              </div>
              <div className="text-3xl font-bold text-executive mb-2">
                {clientData.winRate}%
              </div>
              <div className="text-sm text-platinum-dark uppercase tracking-widest mb-2">Success Rate</div>
              <div className="text-sm text-executive mt-2">
                Sharpe Ratio: {clientData.riskAdjustedReturn}
              </div>
            </InteractiveCard>

            <InteractiveCard className="glass-executive rounded-2xl p-6 text-center element-3d">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald/20 to-luxury/20 rounded-2xl flex items-center justify-center border border-emerald/30">
                <Zap className="w-8 h-8 text-emerald" />
              </div>
              <div className="text-3xl font-bold text-emerald mb-2">
                {clientData.consecutivePeriods}
              </div>
              <div className="text-sm text-platinum-dark uppercase tracking-widest mb-2">Consecutive Quarters</div>
              <div className="text-sm text-emerald mt-2">
                ${(clientData.assetsUnderManagement / 1000000000).toFixed(1)}B AUM
              </div>
            </InteractiveCard>

            <InteractiveCard className="glass-executive rounded-2xl p-6 text-center element-3d">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-platinum/20 to-executive/20 rounded-2xl flex items-center justify-center border border-platinum/30">
                <Users className="w-8 h-8 text-platinum" />
              </div>
              <div className="text-3xl font-bold text-platinum mb-2">
                {clientData.wealthScore}
              </div>
              <div className="text-sm text-platinum-dark uppercase tracking-widest mb-2">Institutional Score</div>
              <div className="text-sm text-platinum mt-2">
                Top 0.1% Global Wealth
              </div>
            </InteractiveCard>
          </div>
        </ScrollReveal>

        {/* Executive Navigation */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap gap-4 mb-12">
            {[
              { id: 'overview', label: 'Investment Overview', icon: BarChart3 },
              { id: 'advisory', label: 'Institutional Advisory', icon: Users },
              { id: 'performance', label: 'Performance Analytics', icon: TrendingUp },
              { id: 'portfolio', label: 'Asset Allocation', icon: PieChart }
            ].map(tab => (
              <AnimatedButton
                key={tab.id}
                variant={selectedTab === tab.id ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setSelectedTab(tab.id as any)}
                className={selectedTab === tab.id ? 'btn-luxury' : 'glass-light border border-executive/20 hover:border-luxury/30 hover:glass-executive'}
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
            key={selectedTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-neon-green" />
                    Recent Activity
                  </h3>
                  
                  <StaggerContainer className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="glass-card rounded-xl p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          activity.type === 'win' ? 'bg-neon-green/20 text-neon-green' :
                          activity.type === 'place' ? 'bg-neon-purple/20 text-neon-purple' :
                          activity.type === 'follow' ? 'bg-neon-cyan/20 text-neon-cyan' :
                          activity.type === 'achievement' ? 'bg-shield-gold/20 text-shield-gold' :
                          'bg-orange-400/20 text-orange-400'
                        }`}>
                          {activity.type === 'win' && <Trophy className="w-5 h-5" />}
                          {activity.type === 'place' && <Target className="w-5 h-5" />}
                          {activity.type === 'follow' && <UserPlus className="w-5 h-5" />}
                          {activity.type === 'achievement' && <Award className="w-5 h-5" />}
                          {activity.type === 'shield' && <Shield className="w-5 h-5" />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-white font-medium">
                              {activity.type === 'win' && `Won prediction: ${activity.market}`}
                              {activity.type === 'place' && `Placed prediction: ${activity.market}`}
                              {activity.type === 'follow' && `Followed ${activity.user}`}
                              {activity.type === 'achievement' && `Unlocked: ${activity.title}`}
                              {activity.type === 'shield' && `Used Shield on ${activity.market}`}
                            </p>
                            <span className="text-xs text-gray-400">{activity.timestamp}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-1 text-sm">
                            {activity.profit && (
                              <span className="text-neon-green">+${activity.profit}</span>
                            )}
                            {activity.amount && (
                              <span className="text-neon-purple">${activity.amount}</span>
                            )}
                            {activity.reward && (
                              <span className="text-shield-gold">+{activity.reward} tokens</span>
                            )}
                            {activity.protection && (
                              <span className="text-orange-400">{activity.protection}% protection</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </StaggerContainer>
                </div>

                {/* Top Performers Sidebar */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-shield-gold" />
                    Top Performers
                  </h3>
                  
                  <div className="space-y-4">
                    {topPerformers.map((performer, index) => (
                      <InteractiveCard key={index} className="glass-card rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-xl flex items-center justify-center text-lg">
                              {performer.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-white text-sm">{performer.name}</span>
                                {performer.verified && <Sparkles className="w-3 h-3 text-neon-green" />}
                              </div>
                              <span className="text-xs text-gray-400">{performer.username}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-neon-green font-bold text-sm">
                              +{performer.return}%
                            </div>
                            <div className="text-xs text-gray-400">
                              {(performer.followers / 1000).toFixed(1)}K followers
                            </div>
                          </div>
                        </div>
                        
                        <AnimatedButton
                          size="sm"
                          variant={followingList.includes(performer.username.slice(1)) ? 'success' : 'secondary'}
                          onClick={() => handleFollow(performer.username.slice(1))}
                          className="w-full"
                        >
                          {followingList.includes(performer.username.slice(1)) ? (
                            <>
                              <UserCheck className="w-4 h-4" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              Follow
                            </>
                          )}
                        </AnimatedButton>
                      </InteractiveCard>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'social' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6 text-neon-cyan" />
                    Social Feed
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search traders..."
                        className="pl-10 pr-4 py-2 bg-glass-bg border border-glass-border rounded-xl text-white text-sm focus:outline-none focus:border-neon-purple"
                      />
                    </div>
                    <AnimatedButton variant="secondary" size="sm">
                      <Filter className="w-4 h-4" />
                      Filter
                    </AnimatedButton>
                  </div>
                </div>

                <StaggerContainer className="space-y-6">
                  {socialFeed.map((post) => (
                    <InteractiveCard key={post.id} className="glass-card rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-xl flex items-center justify-center text-xl">
                          {post.user.avatar}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white">{post.user.name}</span>
                              {post.user.verified && <Sparkles className="w-4 h-4 text-neon-green" />}
                              <span className="text-sm text-gray-400">{post.user.username}</span>
                              <span className="text-xs text-gray-500">• {post.timestamp}</span>
                            </div>
                            
                            <AnimatedButton
                              size="sm"
                              variant={post.isFollowing ? 'success' : 'secondary'}
                              onClick={() => handleFollow(post.user.username.slice(1))}
                            >
                              {post.isFollowing ? (
                                <>
                                  <UserCheck className="w-3 h-3" />
                                  Following
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-3 h-3" />
                                  Follow
                                </>
                              )}
                            </AnimatedButton>
                          </div>
                          
                          <p className="text-gray-300 mb-3">
                            <span className="text-neon-cyan font-medium">{post.action}</span>{' '}
                            <span className="text-white font-medium">"{post.target}"</span>
                          </p>
                          
                          {post.amount && (
                            <div className="mb-3 p-3 bg-glass-bg rounded-xl">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">Amount</span>
                                <span className="font-bold text-neon-green">${post.amount.toLocaleString()}</span>
                              </div>
                              {post.confidence && (
                                <div className="mt-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-400">Confidence</span>
                                    <span className="text-xs text-neon-purple font-bold">{post.confidence}%</span>
                                  </div>
                                  <div className="w-full bg-glass-bg rounded-full h-2">
                                    <div 
                                      className="h-2 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full"
                                      style={{ width: `${post.confidence}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {post.profit && (
                            <div className="mb-3 p-3 bg-neon-green/10 border border-neon-green/30 rounded-xl">
                              <div className="flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-neon-green" />
                                <span className="text-neon-green font-bold">+${post.profit.toLocaleString()} profit</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm text-gray-400">
                            <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                              <Heart className="w-4 h-4" />
                              {post.likes}
                            </button>
                            <button className="flex items-center gap-1 hover:text-neon-cyan transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              {post.comments}
                            </button>
                            <button className="flex items-center gap-1 hover:text-neon-green transition-colors">
                              <Share2 className="w-4 h-4" />
                              {post.shares}
                            </button>
                          </div>
                        </div>
                      </div>
                    </InteractiveCard>
                  ))}
                </StaggerContainer>
              </div>
            )}

            {selectedTab === 'portfolio' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <PieChart className="w-6 h-6 text-neon-purple" />
                    Portfolio Distribution
                  </h3>
                  
                  <div className="glass-card rounded-2xl p-6">
                    <div className="space-y-4">
                      {portfolioData.map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{item.category}</span>
                            <span className="text-gray-400">{item.percentage}%</span>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-400">
                              ${item.value.toLocaleString()}
                            </span>
                            <div className="w-3 h-3 bg-gradient-to-r rounded-full"
                                 style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                                 className={`bg-gradient-to-r ${item.color}`} />
                          </div>
                          <AnimatedProgress 
                            value={item.percentage} 
                            max={100}
                            animated={true}
                            showValue={false}
                            className="mb-3"
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-glass-border">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-white">Total Portfolio Value</span>
                        <span className="text-2xl font-bold text-neon-green">
                          ${portfolioData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <LineChart className="w-6 h-6 text-neon-cyan" />
                    Performance Analytics
                  </h3>
                  
                  <div className="space-y-4">
                    <InteractiveCard className="glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Best Performing Category</span>
                        <span className="text-neon-green font-bold">Crypto (+45.2%)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Worst Performing</span>
                        <span className="text-red-400 font-bold">Economics (-2.1%)</span>
                      </div>
                    </InteractiveCard>

                    <InteractiveCard className="glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Monthly ROI</span>
                        <span className="text-neon-green font-bold">+{userData.monthlyReturn}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Annual Projection</span>
                        <span className="text-neon-purple font-bold">+156.7%</span>
                      </div>
                    </InteractiveCard>

                    <InteractiveCard className="glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Risk Score</span>
                        <span className="text-yellow-400 font-bold">Medium (6.2/10)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Sharpe Ratio</span>
                        <span className="text-neon-cyan font-bold">1.84</span>
                      </div>
                    </InteractiveCard>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

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