'use client';

import React, { memo, useMemo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Users,
  Shield,
  Crown,
  Sparkles,
  BarChart3,
  Activity,
  Target,
  Award
} from 'lucide-react';

// Lazy load heavy components for better performance
const Chart = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));

// Performance-optimized interfaces
interface PortfolioMetric {
  readonly label: string;
  readonly value: string | number;
  readonly change: string;
  readonly trend: 'up' | 'down' | 'neutral';
  readonly icon: React.ComponentType<any>;
}

interface AssetAllocation {
  readonly name: string;
  readonly value: number;
  readonly percentage: number;
  readonly color: string;
}

// Memoized metric card component
const MetricCard = memo<PortfolioMetric>(({ label, value, change, trend, icon: Icon }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    className="luxury-glass rounded-2xl p-6 backdrop-blur-md border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300"
    style={{
      background: 'rgba(24, 24, 27, 0.6)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 1px rgba(212, 175, 55, 0.2)'
    }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#E6C566]/20 flex items-center justify-center border border-[#D4AF37]/30">
        <Icon className="w-6 h-6 text-[#D4AF37]" />
      </div>
      <div className={`text-sm font-medium ${
        trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-zinc-400'
      }`}>
        {change}
      </div>
    </div>
    
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-zinc-400 uppercase tracking-wider">{label}</div>
  </motion.div>
));

MetricCard.displayName = 'MetricCard';

// Memoized allocation item
const AllocationItem = memo<AssetAllocation & { index: number }>(({ name, percentage, value, color, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-center justify-between p-4 rounded-xl luxury-glass border border-[#D4AF37]/10 hover:border-[#D4AF37]/20 transition-colors duration-300"
  >
    <div className="flex items-center gap-3">
      <div 
        className="w-4 h-4 rounded-full" 
        style={{ backgroundColor: color }}
      />
      <div>
        <div className="font-medium text-white">{name}</div>
        <div className="text-sm text-zinc-400">${value.toLocaleString()}</div>
      </div>
    </div>
    <div className="text-[#D4AF37] font-semibold">{percentage}%</div>
  </motion.div>
));

AllocationItem.displayName = 'AllocationItem';

// Loading skeleton component
const LoadingSkeleton = memo(() => (
  <div className="animate-pulse space-y-4">
    <div className="h-8 bg-zinc-800 rounded-lg w-1/2"></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-32 bg-zinc-800 rounded-xl"></div>
      ))}
    </div>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Main component with performance optimizations
const PremiumExecutiveDashboard: React.FC = memo(() => {
  // Memoized data to prevent unnecessary recalculations
  const portfolioMetrics = useMemo<PortfolioMetric[]>(() => [
    {
      label: 'Total Portfolio Value',
      value: '$12.4M',
      change: '+18.7%',
      trend: 'up' as const,
      icon: DollarSign
    },
    {
      label: 'Monthly Returns',
      value: '+$547K',
      change: '+12.4%',
      trend: 'up' as const,
      icon: TrendingUp
    },
    {
      label: 'Active Positions',
      value: '47',
      change: '+3 new',
      trend: 'up' as const,
      icon: Target
    },
    {
      label: 'Risk Score',
      value: '7.2/10',
      change: 'Moderate',
      trend: 'neutral' as const,
      icon: Shield
    }
  ], []);

  const assetAllocations = useMemo<AssetAllocation[]>(() => [
    { name: 'Digital Assets', value: 4850000, percentage: 39.1, color: '#D4AF37' },
    { name: 'Equity Markets', value: 3620000, percentage: 29.2, color: '#3b82f6' },
    { name: 'Fixed Income', value: 2890000, percentage: 23.3, color: '#10b981' },
    { name: 'Alternatives', value: 1040000, percentage: 8.4, color: '#8b5cf6' }
  ], []);

  // Memoized recent activities to prevent unnecessary re-renders
  const recentActivities = useMemo(() => [
    { type: 'trade', action: 'Acquired', asset: 'Digital Asset Portfolio', amount: 850000, time: '2h ago' },
    { type: 'yield', action: 'Earned', asset: 'DeFi Staking Rewards', amount: 24500, time: '4h ago' },
    { type: 'rebalance', action: 'Rebalanced', asset: 'Asset Allocation Strategy', amount: 2100000, time: '1d ago' }
  ], []);

  return (
    <div className="w-full space-y-8">
      {/* Executive Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#E6C566] flex items-center justify-center shadow-lg">
            <Crown className="w-8 h-8 text-zinc-900" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E6C566]">
              Executive Portfolio
            </h1>
            <p className="text-zinc-400">Premium Investment Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <span className="text-emerald-400 text-sm font-medium">Market Open</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>

      {/* Portfolio Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {portfolioMetrics.map((metric, index) => (
          <MetricCard key={`${metric.label}-${index}`} {...metric} />
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset Allocation */}
        <div className="lg:col-span-2 luxury-glass rounded-2xl p-6 backdrop-blur-md border border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D4AF37]" />
              Asset Allocation
            </h2>
            <div className="text-sm text-zinc-400">Updated 2 min ago</div>
          </div>

          <div className="space-y-4">
            {assetAllocations.map((allocation, index) => (
              <AllocationItem key={allocation.name} {...allocation} index={index} />
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total Assets</span>
              <span className="text-2xl font-bold text-[#D4AF37]">
                ${assetAllocations.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="luxury-glass rounded-2xl p-6 backdrop-blur-md border border-[#D4AF37]/20">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#D4AF37]" />
            Recent Activity
          </h2>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={`${activity.type}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-[#D4AF37]/20 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{activity.action}</span>
                  <span className="text-xs text-zinc-500">{activity.time}</span>
                </div>
                <div className="text-sm text-zinc-400 mb-1">{activity.asset}</div>
                <div className="text-[#D4AF37] font-semibold">
                  ${activity.amount.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6">
            <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C566] text-zinc-900 font-semibold hover:from-[#E6C566] hover:to-[#F8E7AA] transition-all duration-300">
              View All Transactions
            </button>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="luxury-glass rounded-2xl p-6 backdrop-blur-md border border-[#D4AF37]/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            Performance Overview
          </h2>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm text-[#D4AF37]">Premium Analytics</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="text-2xl font-bold text-emerald-500 mb-2">+24.7%</div>
            <div className="text-sm text-zinc-400">YTD Performance</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="text-2xl font-bold text-[#D4AF37] mb-2">1.86</div>
            <div className="text-sm text-zinc-400">Sharpe Ratio</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <div className="text-2xl font-bold text-blue-500 mb-2">94.2%</div>
            <div className="text-sm text-zinc-400">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Chart Component with Suspense for performance */}
      <Suspense fallback={<LoadingSkeleton />}>
        <div className="luxury-glass rounded-2xl p-6 backdrop-blur-md border border-[#D4AF37]/20">
          <h2 className="text-xl font-bold text-white mb-6">Portfolio Growth Trajectory</h2>
          <div className="h-64 flex items-center justify-center text-zinc-400">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]/50" />
              <p>Advanced Chart Component</p>
              <p className="text-sm">Lazy-loaded for optimal performance</p>
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
});

PremiumExecutiveDashboard.displayName = 'PremiumExecutiveDashboard';

export default PremiumExecutiveDashboard;

// Performance-optimized export with React.memo
export { PremiumExecutiveDashboard };