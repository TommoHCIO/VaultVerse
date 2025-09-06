'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Circle,
  Wifi,
  WifiOff,
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  Signal,
  Globe
} from 'lucide-react';

export interface LiveStatusConfig {
  type: 'market' | 'event' | 'stream' | 'system' | 'connection';
  status: 'live' | 'offline' | 'loading' | 'error' | 'warning' | 'success';
  label: string;
  value?: string | number;
  lastUpdate?: Date;
  showPulse?: boolean;
  showViewers?: boolean;
  viewerCount?: number;
  latency?: number;
  quality?: 'excellent' | 'good' | 'fair' | 'poor';
  compact?: boolean;
}

export interface LiveStatusIndicatorProps {
  config: LiveStatusConfig;
  realTimeUpdates?: boolean;
  showTooltip?: boolean;
  onClick?: () => void;
  className?: string;
}

export function LiveStatusIndicator({
  config,
  realTimeUpdates = true,
  showTooltip = true,
  onClick,
  className = ""
}: LiveStatusIndicatorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [connectionStrength, setConnectionStrength] = useState(0);

  // Simulate real-time connection strength updates
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      setConnectionStrength(Math.random());
    }, 2000);

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  const getStatusColor = () => {
    switch (config.status) {
      case 'live': return 'text-neon-green';
      case 'offline': return 'text-gray-500';
      case 'loading': return 'text-neon-cyan';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-neon-green';
      default: return 'text-gray-400';
    }
  };

  const getStatusBgColor = () => {
    switch (config.status) {
      case 'live': return 'bg-neon-green';
      case 'offline': return 'bg-gray-500';
      case 'loading': return 'bg-neon-cyan';
      case 'error': return 'bg-red-400';
      case 'warning': return 'bg-yellow-400';
      case 'success': return 'bg-neon-green';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (config.status) {
      case 'live': return Activity;
      case 'offline': return WifiOff;
      case 'loading': return Clock;
      case 'error': return XCircle;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      default: return Circle;
    }
  };

  const getQualityBars = () => {
    const levels = config.quality === 'excellent' ? 4 : 
                   config.quality === 'good' ? 3 : 
                   config.quality === 'fair' ? 2 : 1;
    
    return Array.from({ length: 4 }, (_, i) => (
      <motion.div
        key={i}
        className={`w-1 rounded-full ${
          i < levels ? 'bg-neon-green' : 'bg-gray-600'
        }`}
        style={{ height: `${(i + 1) * 3 + 4}px` }}
        animate={config.status === 'live' && i < levels ? {
          opacity: [0.5, 1, 0.5],
        } : {}}
        transition={{
          duration: 1 + i * 0.2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    ));
  };

  const StatusIcon = getStatusIcon();

  if (config.compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-glass-bg border border-glass-border ${className}`}
        onClick={onClick}
      >
        <div className={`w-2 h-2 rounded-full ${getStatusBgColor()}`}>
          {config.showPulse && config.status === 'live' && (
            <motion.div
              className="w-2 h-2 rounded-full bg-neon-green"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {config.label}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-card rounded-xl p-4 cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Status Icon with Pulse Effect */}
            <div className="relative">
              <motion.div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  config.status === 'live' 
                    ? 'bg-gradient-to-br from-neon-green/20 to-green-500/20 border border-neon-green/30' 
                    : 'bg-glass-bg border border-glass-border'
                }`}
              >
                <StatusIcon className={`w-5 h-5 ${getStatusColor()}`} />
              </motion.div>
              
              {config.showPulse && config.status === 'live' && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-neon-green/20"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              {/* Connection Quality Indicator */}
              {config.type === 'connection' && (
                <div className="absolute -top-1 -right-1 flex items-end gap-0.5">
                  {getQualityBars()}
                </div>
              )}
            </div>

            {/* Status Info */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{config.label}</h3>
                {config.status === 'live' && (
                  <motion.div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-green/20 text-neon-green"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Circle className="w-2 h-2 fill-current" />
                    <span className="text-xs font-bold">LIVE</span>
                  </motion.div>
                )}
              </div>
              
              {config.value && (
                <div className={`text-sm ${getStatusColor()}`}>
                  {config.value}
                </div>
              )}
              
              {config.lastUpdate && (
                <div className="text-xs text-gray-400">
                  Updated {config.lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          {/* Viewer Count & Metrics */}
          <div className="flex items-center gap-4">
            {config.showViewers && config.viewerCount && (
              <motion.div
                className="flex items-center gap-1 text-gray-300"
                whileHover={{ scale: 1.05 }}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {config.viewerCount.toLocaleString()}
                </span>
              </motion.div>
            )}
            
            {config.latency && (
              <div className="flex items-center gap-1 text-gray-300">
                <Zap className="w-4 h-4" />
                <span className="text-sm">{config.latency}ms</span>
              </div>
            )}

            {/* Real-time Activity Indicator */}
            {realTimeUpdates && config.status === 'live' && (
              <motion.div
                className="flex items-center gap-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Signal className="w-4 h-4 text-neon-cyan" />
                <div className="w-2 h-2 rounded-full bg-neon-cyan" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Advanced Metrics Bar */}
        {config.status === 'live' && config.type === 'market' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 pt-3 border-t border-glass-border"
          >
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="text-center">
                <div className="text-neon-green font-semibold">87.3%</div>
                <div className="text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-neon-cyan font-semibold">$24.5K</div>
                <div className="text-gray-400">Volume</div>
              </div>
              <div className="text-center">
                <div className="text-neon-purple font-semibold">156ms</div>
                <div className="text-gray-400">Response</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 mb-2 z-50"
          >
            <div className="glass-card rounded-lg p-3 text-sm text-white whitespace-nowrap">
              <div className="font-semibold mb-1">{config.label} Status</div>
              <div className="text-gray-300">
                {config.status === 'live' && 'Real-time data streaming'}
                {config.status === 'offline' && 'Currently unavailable'}
                {config.status === 'loading' && 'Connecting...'}
                {config.status === 'error' && 'Connection failed'}
              </div>
              {config.quality && (
                <div className="text-xs text-gray-400 mt-1">
                  Quality: {config.quality}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}