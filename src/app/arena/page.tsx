'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Filter,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Shield,
  RefreshCw,
  BarChart3,
  Activity,
  Globe
} from 'lucide-react';
import { MarketCard } from '@/components/markets/MarketCard';
import { SystemStatusBar, MarketStatusWidget, MarketData } from '@/components/status';

// Mock data - will be replaced with real API calls
const mockMarkets = [
  {
    id: '1',
    question: 'Will Bitcoin reach $100,000 by end of 2025?',
    description: 'Market resolves based on CoinGecko price data at 11:59 PM UTC on December 31, 2025',
    category: 'CRYPTO' as const,
    outcomes: [
      { id: '1a', label: 'Yes', odds: 65, liquidity: 250000, isWinning: true },
      { id: '1b', label: 'No', odds: 35, liquidity: 135000 }
    ],
    totalVolume: 385000,
    participantCount: 1247,
    endTime: new Date('2025-12-31T23:59:59Z'),
    isResolved: false,
    shieldEnabled: true,
    trending: true,
    featured: true
  },
  {
    id: '2',
    question: 'Who will win the 2025 US Presidential Election?',
    description: 'Market resolves based on electoral college results certified by Congress',
    category: 'POLITICS' as const,
    outcomes: [
      { id: '2a', label: 'Democratic Candidate', odds: 52, liquidity: 180000 },
      { id: '2b', label: 'Republican Candidate', odds: 48, liquidity: 165000 }
    ],
    totalVolume: 345000,
    participantCount: 892,
    endTime: new Date('2025-11-04T23:59:59Z'),
    isResolved: false,
    shieldEnabled: true,
    trending: true
  },
  {
    id: '3',
    question: 'Will Ethereum 2.0 staking rewards exceed 8% APR?',
    description: 'Market resolves based on average staking rewards over Q4 2025',
    category: 'CRYPTO' as const,
    outcomes: [
      { id: '3a', label: 'Yes, above 8%', odds: 42, liquidity: 95000 },
      { id: '3b', label: 'No, 8% or below', odds: 58, liquidity: 128000 }
    ],
    totalVolume: 223000,
    participantCount: 567,
    endTime: new Date('2025-12-31T23:59:59Z'),
    isResolved: false,
    shieldEnabled: true
  }
];

const categories = [
  { id: 'ALL', label: 'All Markets', icon: Globe },
  { id: 'CRYPTO', label: 'Digital Assets', icon: BarChart3 },
  { id: 'POLITICS', label: 'Political Events', icon: Activity },
  { id: 'SPORTS', label: 'Sports Markets', icon: TrendingUp },
  { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Users },
  { id: 'TECHNOLOGY', label: 'Technology', icon: Activity },
  { id: 'ECONOMICS', label: 'Economic Indicators', icon: DollarSign }
];

const sortOptions = [
  { id: 'volume', label: 'Assets Under Management', icon: DollarSign },
  { id: 'trending', label: 'Market Momentum', icon: TrendingUp },
  { id: 'ending', label: 'Settlement Date', icon: Clock },
  { id: 'participants', label: 'Institutional Interest', icon: Users }
];

export default function ArenaPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('volume');
  const [markets, setMarkets] = useState(mockMarkets);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter and sort markets
  const filteredMarkets = markets
    .filter(market => 
      (selectedCategory === 'ALL' || market.category === selectedCategory) &&
      (searchQuery === '' || market.question.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (selectedSort) {
        case 'volume':
          return b.totalVolume - a.totalVolume;
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        case 'ending':
          return a.endTime.getTime() - b.endTime.getTime();
        case 'participants':
          return b.participantCount - a.participantCount;
        default:
          return 0;
      }
    });

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const totalVolume = markets.reduce((sum, market) => sum + market.totalVolume, 0);
  const activeMarkets = markets.filter(market => !market.isResolved).length;
  const totalParticipants = markets.reduce((sum, market) => sum + market.participantCount, 0);

  return (
    <div className="min-h-screen bg-vaultor-dark executive-gradient">
      <div className="max-w-[1600px] mx-auto px-8 py-12">
        {/* Executive Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-6xl md:text-7xl font-bold mb-4 heading-executive">
                Market{' '}
                <span className="text-luxury metal-gold">Intelligence</span>
                <span className="text-executive block text-5xl md:text-6xl mt-2">Arena</span>
              </h1>
              <p className="text-xl text-platinum-dark max-w-4xl leading-relaxed">
                Professional-grade prediction markets with institutional liquidity and advanced risk management. 
                Access real-time market intelligence trusted by sophisticated investors worldwide.
              </p>
            </div>
            
            {/* Executive Market Statistics */}
            <div className="hidden xl:block">
              <div className="glass-executive p-8 rounded-2xl min-w-[400px]">
                <div className="text-sm text-platinum-dark uppercase tracking-widest mb-4 font-semibold">Global Market Overview</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-platinum">Total AUM</span>
                    <span className="text-2xl font-bold text-luxury">${(totalVolume / 1000).toFixed(1)}M</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-platinum">Active Positions</span>
                    <span className="text-xl font-semibold text-emerald">{activeMarkets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-platinum">Institutional Clients</span>
                    <span className="text-xl font-semibold text-executive">{totalParticipants.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <SystemStatusBar compact={true} autoRefresh={true} />
        </motion.div>

        {/* Market Status Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <MarketStatusWidget
            markets={markets.map(market => ({
              id: market.id,
              name: market.question.slice(0, 50) + '...',
              status: market.isResolved ? 'resolved' : 'active',
              volume24h: market.totalVolume,
              participants: market.participantCount,
              priceChange: market.trending ? 12.5 : -3.2,
              lastTrade: new Date(),
              oracleStatus: 'connected',
              liquidityHealth: market.totalVolume > 300000 ? 'excellent' : market.totalVolume > 200000 ? 'good' : 'fair'
            } as MarketData))}
            showGlobal={true}
            maxVisible={3}
            realTimeUpdates={true}
          />
        </motion.div>

        {/* Professional Trading Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-executive rounded-2xl p-8 mb-12 element-3d"
        >
          {/* Executive Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-platinum w-6 h-6" />
            <input
              type="text"
              placeholder="Search institutional markets and opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-glass-bg border border-executive/20 rounded-xl text-white placeholder-platinum-dark focus:outline-none focus:border-luxury focus:ring-1 focus:ring-luxury/50 transition-all duration-500 text-lg font-medium"
            />
          </div>

          {/* Asset Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map(category => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-500 element-3d ${
                    selectedCategory === category.id
                      ? 'bg-luxury text-vaultor-dark shadow-luxury shadow-luxury/25 metal-gold'
                      : 'glass-light text-platinum hover:text-luxury hover:glass-executive border border-executive/20 hover:border-luxury/30'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.label}
                </motion.button>
              );
            })}
          </div>

          {/* Professional Sort Options */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-platinum" />
              <span className="text-platinum text-sm font-medium uppercase tracking-wider">Portfolio View:</span>
              <div className="flex gap-3">
                {sortOptions.map(option => {
                  const IconComponent = option.icon;
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSort(option.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 ${
                        selectedSort === option.id
                          ? 'bg-emerald text-vaultor-dark shadow-lg shadow-emerald/25'
                          : 'text-platinum-dark hover:text-luxury hover:bg-glass-bg'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      {option.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-3 rounded-xl glass-light hover:glass-executive text-platinum hover:text-luxury transition-all duration-500 border border-executive/20 hover:border-luxury/30"
            >
              <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Professional Markets Portfolio */}
        <AnimatePresence mode="wait">
          {filteredMarkets.length > 0 ? (
            <motion.div
              key="markets-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredMarkets.map((market, index) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  className="element-3d"
                >
                  <MarketCard {...market} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <div className="glass-executive p-16 rounded-3xl mx-auto max-w-2xl element-3d">
                <div className="w-32 h-32 mx-auto mb-8 rounded-full glass-light flex items-center justify-center border border-executive/20">
                  <Search className="w-16 h-16 text-platinum" />
                </div>
                <h3 className="text-3xl font-bold text-executive mb-6 heading-executive">No Investment Opportunities</h3>
                <p className="text-platinum-dark text-lg leading-relaxed max-w-xl mx-auto">
                  Adjust your portfolio parameters or asset class filters to discover suitable institutional-grade prediction markets matching your investment criteria.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                  }}
                  className="mt-8 btn-luxury px-8 py-4 text-lg font-semibold"
                >
                  Reset Portfolio View
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}