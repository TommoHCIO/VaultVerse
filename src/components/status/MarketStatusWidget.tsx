'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Globe
} from 'lucide-react';
import { LiveStatusIndicator, LiveStatusConfig } from './LiveStatusIndicator';

export interface MarketData {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'resolved' | 'error';
  volume24h: number;
  participants: number;
  priceChange: number;
  lastTrade: Date;
  oracleStatus: 'connected' | 'disconnected' | 'updating';
  liquidityHealth: 'excellent' | 'good' | 'fair' | 'low';
}

export interface MarketStatusWidgetProps {
  markets: MarketData[];
  showGlobal?: boolean;
  compact?: boolean;
  maxVisible?: number;
  realTimeUpdates?: boolean;
}

export function MarketStatusWidget({
  markets,
  showGlobal = true,
  compact = false,
  maxVisible = 5,
  realTimeUpdates = true
}: MarketStatusWidgetProps) {
  const [globalMetrics, setGlobalMetrics] = useState({
    totalVolume: 0,
    totalParticipants: 0,
    activeMarkets: 0,
    averageHealth: 'good' as 'excellent' | 'good' | 'fair' | 'poor'
  });

  const [marketStatuses, setMarketStatuses] = useState<LiveStatusConfig[]>([]);

  // Update global metrics and market statuses
  useEffect(() => {
    const totalVolume = markets.reduce((sum, market) => sum + market.volume24h, 0);
    const totalParticipants = markets.reduce((sum, market) => sum + market.participants, 0);
    const activeMarkets = markets.filter(m => m.status === 'active').length;
    
    // Calculate average health
    const healthScores = markets.map(market => {
      switch (market.liquidityHealth) {
        case 'excellent': return 4;
        case 'good': return 3;
        case 'fair': return 2;
        case 'low': return 1;
        default: return 1;
      }
    });
    const avgScore = healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;
    const averageHealth = avgScore >= 3.5 ? 'excellent' : avgScore >= 2.5 ? 'good' : avgScore >= 1.5 ? 'fair' : 'poor';

    setGlobalMetrics({
      totalVolume,
      totalParticipants,
      activeMarkets,
      averageHealth
    });

    // Convert markets to status configs
    const statuses: LiveStatusConfig[] = markets.slice(0, maxVisible).map(market => ({
      type: 'market',
      status: market.status === 'active' ? 'live' : 
              market.status === 'paused' ? 'warning' : 
              market.status === 'resolved' ? 'success' : 'error',
      label: market.name,
      value: `$${(market.volume24h / 1000).toFixed(1)}K`,
      lastUpdate: market.lastTrade,
      showPulse: market.status === 'active',
      showViewers: true,
      viewerCount: market.participants,
      quality: market.liquidityHealth,
      compact: compact
    }));

    setMarketStatuses(statuses);
  }, [markets, maxVisible, compact]);

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      // Simulate small changes to metrics
      setGlobalMetrics(prev => ({
        ...prev,
        totalVolume: prev.totalVolume + (Math.random() - 0.5) * 10000,
        totalParticipants: Math.max(0, prev.totalParticipants + Math.floor((Math.random() - 0.5) * 20))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  const getGlobalStatusColor = () => {
    const healthyMarkets = markets.filter(m => m.status === 'active' && m.liquidityHealth !== 'low').length;
    const healthRatio = healthyMarkets / markets.length;
    
    if (healthRatio >= 0.8) return 'text-neon-green';
    if (healthRatio >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {marketStatuses.map((status, index) => (
          <LiveStatusIndicator
            key={index}
            config={status}
            realTimeUpdates={realTimeUpdates}
            showTooltip={true}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Global Market Overview */}
      {showGlobal && (
        <motion.div
          className="glass-card rounded-2xl p-6"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-6 h-6 text-neon-cyan" />
              Global Market Status
            </h3>
            
            <motion.div
              className={`flex items-center gap-2 px-3 py-1 rounded-full bg-glass-bg border ${getGlobalStatusColor()}`}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className={`w-2 h-2 rounded-full ${
                globalMetrics.averageHealth === 'excellent' ? 'bg-neon-green' :
                globalMetrics.averageHealth === 'good' ? 'bg-neon-cyan' :
                globalMetrics.averageHealth === 'fair' ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              <span className="text-sm font-semibold capitalize">
                {globalMetrics.averageHealth} Health
              </span>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-neon-green/20 to-green-500/20 rounded-xl flex items-center justify-center border border-neon-green/30">
                <DollarSign className="w-6 h-6 text-neon-green" />
              </div>
              <div className="text-2xl font-bold text-neon-green mb-1">
                ${(globalMetrics.totalVolume / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-400">24h Volume</div>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-neon-purple/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-neon-purple/30">
                <Users className="w-6 h-6 text-neon-purple" />
              </div>
              <div className="text-2xl font-bold text-neon-purple mb-1">
                {globalMetrics.totalParticipants.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400">Active Traders</div>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-neon-cyan/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-neon-cyan/30">
                <Activity className="w-6 h-6 text-neon-cyan" />
              </div>
              <div className="text-2xl font-bold text-neon-cyan mb-1">
                {globalMetrics.activeMarkets}
              </div>
              <div className="text-xs text-gray-400">Active Markets</div>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-shield-gold/20 to-yellow-500/20 rounded-xl flex items-center justify-center border border-shield-gold/30">
                <BarChart3 className="w-6 h-6 text-shield-gold" />
              </div>
              <div className="text-2xl font-bold text-shield-gold mb-1">
                {((globalMetrics.activeMarkets / markets.length) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-400">Market Uptime</div>
            </motion.div>
          </div>

          {/* Real-time Activity Indicator */}
          {realTimeUpdates && (
            <motion.div
              className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-neon-cyan" />
              <span>Real-time data streaming</span>
              <div className="w-2 h-2 rounded-full bg-neon-cyan" />
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Individual Market Statuses */}
      <motion.div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-neon-green" />
          Market Status Overview
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {marketStatuses.map((status, index) => (
            <LiveStatusIndicator
              key={index}
              config={status}
              realTimeUpdates={realTimeUpdates}
              onClick={() => {
                console.log(`Navigate to market: ${status.label}`);
              }}
            />
          ))}
        </div>

        {markets.length > maxVisible && (
          <motion.div
            className="mt-4 text-center"
            whileHover={{ scale: 1.05 }}
          >
            <button className="px-6 py-2 rounded-xl bg-glass-bg border border-glass-border text-gray-300 hover:text-white hover:bg-glass-bg-light transition-all duration-300">
              View {markets.length - maxVisible} More Markets
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Oracle & Infrastructure Status */}
      <motion.div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-neon-green" />
          Infrastructure Health
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LiveStatusIndicator
            config={{
              type: 'system',
              status: 'live',
              label: 'Oracle Network',
              value: 'All Feeds Active',
              showPulse: true,
              quality: 'excellent'
            }}
            realTimeUpdates={realTimeUpdates}
          />
          
          <LiveStatusIndicator
            config={{
              type: 'system',
              status: 'live',
              label: 'Smart Contracts',
              value: 'Deployed & Verified',
              showPulse: true,
              quality: 'excellent'
            }}
            realTimeUpdates={realTimeUpdates}
          />
          
          <LiveStatusIndicator
            config={{
              type: 'connection',
              status: 'live',
              label: 'Network Latency',
              value: '< 100ms Global',
              showPulse: true,
              quality: 'good',
              latency: 87
            }}
            realTimeUpdates={realTimeUpdates}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}