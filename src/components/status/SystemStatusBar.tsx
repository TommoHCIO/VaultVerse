'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wifi,
  Database,
  Server,
  Globe,
  Shield,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { LiveStatusIndicator, LiveStatusConfig } from './LiveStatusIndicator';

export interface SystemStatus {
  api: 'operational' | 'degraded' | 'outage';
  database: 'operational' | 'degraded' | 'outage';
  websockets: 'operational' | 'degraded' | 'outage';
  cdn: 'operational' | 'degraded' | 'outage';
  blockchain: 'operational' | 'degraded' | 'outage';
  lastUpdate: Date;
  totalUsers: number;
  activeMarkets: number;
  uptime: number;
}

export interface SystemStatusBarProps {
  showDetailed?: boolean;
  compact?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function SystemStatusBar({
  showDetailed = false,
  compact = false,
  autoRefresh = true,
  refreshInterval = 30000
}: SystemStatusBarProps) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    api: 'operational',
    database: 'operational',
    websockets: 'operational',
    cdn: 'operational',
    blockchain: 'operational',
    lastUpdate: new Date(),
    totalUsers: 12547,
    activeMarkets: 89,
    uptime: 99.97
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Simulate real-time status updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        lastUpdate: new Date(),
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 10) - 5,
        activeMarkets: prev.activeMarkets + Math.floor(Math.random() * 3) - 1,
        // Occasionally simulate degraded performance
        api: Math.random() > 0.95 ? 'degraded' : 'operational',
        websockets: Math.random() > 0.98 ? 'degraded' : 'operational'
      }));
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getOverallStatus = (): 'live' | 'warning' | 'error' => {
    const statuses = [
      systemStatus.api,
      systemStatus.database,
      systemStatus.websockets,
      systemStatus.cdn,
      systemStatus.blockchain
    ];

    if (statuses.includes('outage')) return 'error';
    if (statuses.includes('degraded')) return 'warning';
    return 'live';
  };

  const statusConfigs: LiveStatusConfig[] = [
    {
      type: 'system',
      status: systemStatus.api === 'operational' ? 'live' : systemStatus.api === 'degraded' ? 'warning' : 'error',
      label: 'API',
      value: systemStatus.api === 'operational' ? 'Online' : systemStatus.api.charAt(0).toUpperCase() + systemStatus.api.slice(1),
      compact: true,
      showPulse: systemStatus.api === 'operational'
    },
    {
      type: 'system',
      status: systemStatus.database === 'operational' ? 'live' : systemStatus.database === 'degraded' ? 'warning' : 'error',
      label: 'Database',
      value: systemStatus.database === 'operational' ? 'Online' : systemStatus.database.charAt(0).toUpperCase() + systemStatus.database.slice(1),
      compact: true,
      showPulse: systemStatus.database === 'operational'
    },
    {
      type: 'stream',
      status: systemStatus.websockets === 'operational' ? 'live' : systemStatus.websockets === 'degraded' ? 'warning' : 'error',
      label: 'Real-time',
      value: systemStatus.websockets === 'operational' ? 'Connected' : systemStatus.websockets.charAt(0).toUpperCase() + systemStatus.websockets.slice(1),
      compact: true,
      showPulse: systemStatus.websockets === 'operational'
    },
    {
      type: 'system',
      status: systemStatus.cdn === 'operational' ? 'live' : systemStatus.cdn === 'degraded' ? 'warning' : 'error',
      label: 'CDN',
      value: systemStatus.cdn === 'operational' ? 'Global' : systemStatus.cdn.charAt(0).toUpperCase() + systemStatus.cdn.slice(1),
      compact: true,
      showPulse: systemStatus.cdn === 'operational'
    },
    {
      type: 'system',
      status: systemStatus.blockchain === 'operational' ? 'live' : systemStatus.blockchain === 'degraded' ? 'warning' : 'error',
      label: 'Blockchain',
      value: systemStatus.blockchain === 'operational' ? 'Synced' : systemStatus.blockchain.charAt(0).toUpperCase() + systemStatus.blockchain.slice(1),
      compact: true,
      showPulse: systemStatus.blockchain === 'operational'
    }
  ];

  const overallStatus = getOverallStatus();

  if (compact) {
    return (
      <motion.div
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-glass-bg border border-glass-border"
        whileHover={{ scale: 1.02 }}
      >
        <div className={`w-2 h-2 rounded-full ${
          overallStatus === 'live' ? 'bg-neon-green' : 
          overallStatus === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
        }`}>
          {overallStatus === 'live' && (
            <motion.div
              className="w-2 h-2 rounded-full bg-neon-green"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        <span className="text-sm font-medium text-white">
          All Systems {overallStatus === 'live' ? 'Operational' : overallStatus === 'warning' ? 'Degraded' : 'Down'}
        </span>
        <div className="text-xs text-gray-400">
          {systemStatus.uptime}% uptime
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {/* Main Status Bar */}
      <motion.div
        className="glass-card rounded-2xl p-4 mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Overall Status Indicator */}
            <div className="relative">
              <motion.div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  overallStatus === 'live' 
                    ? 'bg-gradient-to-br from-neon-green/20 to-green-500/20 border border-neon-green/30' 
                    : overallStatus === 'warning'
                    ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border border-yellow-400/30'
                    : 'bg-gradient-to-br from-red-400/20 to-red-500/20 border border-red-400/30'
                }`}
              >
                {overallStatus === 'live' ? (
                  <CheckCircle className="w-6 h-6 text-neon-green" />
                ) : overallStatus === 'warning' ? (
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                )}
              </motion.div>
              
              {overallStatus === 'live' && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-neon-green/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </div>

            {/* Status Summary */}
            <div>
              <h3 className="text-lg font-bold text-white">
                System Status: {overallStatus === 'live' ? 'All Systems Operational' : overallStatus === 'warning' ? 'Degraded Performance' : 'Service Disruption'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span>{systemStatus.uptime}% uptime</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{systemStatus.totalUsers.toLocaleString()} users</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{systemStatus.activeMarkets} markets</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Status Indicators */}
          <div className="flex items-center gap-2">
            {statusConfigs.slice(0, 3).map((config, index) => (
              <LiveStatusIndicator
                key={index}
                config={config}
                showTooltip={false}
                className="transform hover:scale-105 transition-transform"
              />
            ))}
            
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="ml-2"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Status */}
      <AnimatePresence>
        {(showDetailed || isExpanded) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {statusConfigs.map((config, index) => (
              <LiveStatusIndicator
                key={index}
                config={{
                  ...config,
                  compact: false,
                  lastUpdate: systemStatus.lastUpdate,
                  latency: Math.floor(Math.random() * 100) + 50
                }}
                realTimeUpdates={autoRefresh}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Metrics */}
      {(showDetailed || isExpanded) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 glass-card rounded-2xl p-4"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-neon-cyan" />
            Performance Metrics
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-green mb-1">
                {Math.floor(Math.random() * 50) + 20}ms
              </div>
              <div className="text-xs text-gray-400">API Response</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-cyan mb-1">
                {Math.floor(Math.random() * 100) + 50}ms
              </div>
              <div className="text-xs text-gray-400">WebSocket Latency</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-purple mb-1">
                {Math.floor(Math.random() * 20) + 80}%
              </div>
              <div className="text-xs text-gray-400">Cache Hit Rate</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-shield-gold mb-1">
                {Math.floor(Math.random() * 1000) + 5000}
              </div>
              <div className="text-xs text-gray-400">Req/min</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Last Updated */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-2 text-center"
      >
        <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <Clock className="w-3 h-3" />
          Last updated: {systemStatus.lastUpdate.toLocaleTimeString()}
          {autoRefresh && (
            <>
              <span className="mx-1">•</span>
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Auto-refresh enabled
              </motion.span>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}