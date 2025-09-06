'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Calendar, Grid, Filter, BarChart } from 'lucide-react';

export interface HeatmapDataPoint {
  category: string;
  period: string;
  value: number;
  volume: number;
  trades: number;
  winRate: number;
}

export interface PerformanceHeatmapProps {
  data: HeatmapDataPoint[];
  categories: string[];
  periods: string[];
  className?: string;
}

export function PerformanceHeatmap({
  data,
  categories,
  periods,
  className = ''
}: PerformanceHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapDataPoint | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'returns' | 'volume' | 'winRate'>('returns');

  const metrics = [
    { id: 'returns', label: 'Returns (%)', icon: TrendingUp },
    { id: 'volume', label: 'Volume ($)', icon: BarChart },
    { id: 'winRate', label: 'Win Rate (%)', icon: Grid }
  ];

  const getDataPoint = (category: string, period: string) => {
    return data.find(d => d.category === category && d.period === period);
  };

  const getMetricValue = (dataPoint: HeatmapDataPoint | undefined) => {
    if (!dataPoint) return 0;
    
    switch (selectedMetric) {
      case 'returns': return dataPoint.value;
      case 'volume': return dataPoint.volume;
      case 'winRate': return dataPoint.winRate;
      default: return 0;
    }
  };

  const getMaxValue = () => {
    return Math.max(...data.map(d => getMetricValue(d)));
  };

  const getMinValue = () => {
    return Math.min(...data.map(d => getMetricValue(d)));
  };

  const getCellColor = (value: number) => {
    if (value === 0) return 'bg-gray-800';
    
    const max = getMaxValue();
    const min = getMinValue();
    const normalized = (value - min) / (max - min);
    
    if (selectedMetric === 'returns') {
      if (value > 0) {
        // Green gradient for positive returns
        const intensity = Math.min(normalized * 2, 1);
        return `bg-gradient-to-br from-emerald-500/${Math.floor(intensity * 80 + 20)} to-emerald-600/${Math.floor(intensity * 60 + 10)}`;
      } else {
        // Red gradient for negative returns  
        const intensity = Math.min(Math.abs(normalized) * 2, 1);
        return `bg-gradient-to-br from-red-500/${Math.floor(intensity * 80 + 20)} to-red-600/${Math.floor(intensity * 60 + 10)}`;
      }
    } else {
      // Gold gradient for volume and win rate
      const intensity = Math.min(normalized, 1);
      return `bg-gradient-to-br from-luxury/${Math.floor(intensity * 80 + 20)} to-champagne-gold/${Math.floor(intensity * 60 + 10)}`;
    }
  };

  const getCellTextColor = (value: number) => {
    if (value === 0) return 'text-gray-500';
    
    const max = getMaxValue();
    const min = getMinValue();
    const normalized = (value - min) / (max - min);
    
    if (selectedMetric === 'returns') {
      return value > 0 ? 'text-emerald-100' : 'text-red-100';
    } else {
      return normalized > 0.5 ? 'text-gray-900' : 'text-gray-100';
    }
  };

  const formatValue = (value: number) => {
    switch (selectedMetric) {
      case 'returns':
        return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
      case 'volume':
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value.toFixed(0)}`;
      case 'winRate':
        return `${value.toFixed(0)}%`;
      default:
        return '0';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toUpperCase()) {
      case 'CRYPTO': return '₿';
      case 'POLITICS': return '🏛️';
      case 'SPORTS': return '⚽';
      case 'ENTERTAINMENT': return '🎬';
      case 'TECHNOLOGY': return '💻';
      case 'ECONOMICS': return '💰';
      default: return '📈';
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Grid className="w-6 h-6 text-luxury" />
              Performance Heatmap
            </h3>
            <p className="text-gray-400">Trading performance across categories and time periods</p>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center gap-1 bg-gray-800/50 rounded-xl p-1 border border-gray-700/30">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedMetric === metric.id
                    ? 'bg-luxury text-gray-900 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <metric.icon className="w-4 h-4" />
                {metric.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="p-6">
        <div className="relative">
          {/* Period Headers */}
          <div className="flex items-center mb-4">
            <div className="w-32" /> {/* Spacer for category labels */}
            <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${periods.length}, 1fr)` }}>
              {periods.map((period) => (
                <div key={period} className="text-center">
                  <div className="text-sm font-medium text-gray-300 mb-1">{period}</div>
                  <div className="text-xs text-gray-500">
                    {period === '1D' ? 'Today' :
                     period === '1W' ? 'Week' :
                     period === '1M' ? 'Month' :
                     period === '3M' ? 'Quarter' :
                     period === '1Y' ? 'Year' : 'All Time'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap Cells */}
          <div className="space-y-2">
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
                className="flex items-center"
              >
                {/* Category Label */}
                <div className="w-32 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getCategoryIcon(category)}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{category}</div>
                      <div className="text-xs text-gray-400 capitalize">
                        {data.filter(d => d.category === category).length} periods
                      </div>
                    </div>
                  </div>
                </div>

                {/* Period Cells */}
                <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${periods.length}, 1fr)` }}>
                  {periods.map((period, periodIndex) => {
                    const dataPoint = getDataPoint(category, period);
                    const value = getMetricValue(dataPoint);
                    
                    return (
                      <motion.div
                        key={`${category}-${period}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: (categoryIndex * periods.length + periodIndex) * 0.05 
                        }}
                        className={`
                          relative h-16 rounded-lg border border-gray-700/30 cursor-pointer transition-all duration-200
                          ${getCellColor(value)}
                          hover:scale-105 hover:border-luxury/50 hover:shadow-lg hover:shadow-luxury/20
                        `}
                        onMouseEnter={() => setHoveredCell(dataPoint || null)}
                        onMouseLeave={() => setHoveredCell(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          <div className={`text-sm font-bold ${getCellTextColor(value)}`}>
                            {formatValue(value)}
                          </div>
                          {dataPoint && (
                            <div className={`text-xs ${getCellTextColor(value)} opacity-80`}>
                              {dataPoint.trades} trades
                            </div>
                          )}
                        </div>

                        {/* Glow effect for high performance */}
                        {value > 0 && getMetricValue(dataPoint) > getMaxValue() * 0.8 && (
                          <div className="absolute inset-0 bg-gradient-to-br from-luxury/20 to-transparent rounded-lg animate-pulse" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredCell && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute top-4 right-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-4 min-w-[200px] z-10"
                style={{
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{getCategoryIcon(hoveredCell.category)}</span>
                  <div>
                    <div className="font-semibold text-white">{hoveredCell.category}</div>
                    <div className="text-xs text-gray-400">{hoveredCell.period}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Returns</span>
                    <span className={`font-bold text-sm ${
                      hoveredCell.value >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {hoveredCell.value >= 0 ? '+' : ''}{hoveredCell.value.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Volume</span>
                    <span className="font-bold text-sm text-luxury">
                      ${hoveredCell.volume >= 1000000 
                        ? `${(hoveredCell.volume / 1000000).toFixed(1)}M`
                        : `${(hoveredCell.volume / 1000).toFixed(0)}K`
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Win Rate</span>
                    <span className="font-bold text-sm text-champagne-gold">
                      {hoveredCell.winRate.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Total Trades</span>
                    <span className="font-bold text-sm text-blue-400">
                      {hoveredCell.trades}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Performance Scale: {selectedMetric === 'returns' ? 'Returns (%)' : 
                                 selectedMetric === 'volume' ? 'Volume ($)' : 'Win Rate (%)'}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-sm"></div>
                <span>Poor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-sm"></div>
                <span>Average</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-sm"></div>
                <span>Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-luxury to-champagne-gold rounded-sm"></div>
                <span>Outstanding</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceHeatmap;