'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, LineChart, Activity, DollarSign } from 'lucide-react';

export interface WealthDataPoint {
  timestamp: number;
  portfolioValue: number;
  dailyPnL: number;
  monthlyReturn: number;
  cumulativeReturn: number;
}

export interface WealthChartProps {
  data: WealthDataPoint[];
  timeframe: '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';
  onTimeframeChange: (timeframe: string) => void;
  className?: string;
}

export function WealthChart({
  data,
  timeframe,
  onTimeframeChange,
  className = ''
}: WealthChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<WealthDataPoint | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const timeframes = [
    { id: '1D', label: '1D', duration: 'Today' },
    { id: '1W', label: '1W', duration: 'This Week' },
    { id: '1M', label: '1M', duration: 'This Month' },
    { id: '3M', label: '3M', duration: '3 Months' },
    { id: '1Y', label: '1Y', duration: 'This Year' },
    { id: 'ALL', label: 'ALL', duration: 'All Time' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const latestData = data[data.length - 1];
  const firstData = data[0];
  const totalReturn = latestData ? ((latestData.portfolioValue - firstData?.portfolioValue) / firstData?.portfolioValue) * 100 : 0;
  const isPositive = totalReturn >= 0;

  // Generate SVG path for the wealth curve
  const generatePath = (points: WealthDataPoint[], width: number, height: number) => {
    if (points.length < 2) return '';

    const minValue = Math.min(...points.map(p => p.portfolioValue));
    const maxValue = Math.max(...points.map(p => p.portfolioValue));
    const valueRange = maxValue - minValue;

    const pathData = points.map((point, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((point.portfolioValue - minValue) / valueRange) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return pathData;
  };

  // Generate gradient fill path
  const generateFillPath = (points: WealthDataPoint[], width: number, height: number) => {
    const path = generatePath(points, width, height);
    return `${path} L ${width} ${height} L 0 ${height} Z`;
  };

  const chartWidth = 800;
  const chartHeight = 300;

  return (
    <div className={`bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-luxury" />
              Wealth Performance
            </h3>
            <div className="flex items-center gap-6">
              <div className="text-3xl font-bold text-luxury">
                ${latestData ? (latestData.portfolioValue / 1000000).toFixed(2) : '0.00'}M
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                isPositive 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-bold">
                  {isPositive ? '+' : ''}{totalReturn.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-1 bg-gray-800/50 rounded-xl p-1 border border-gray-700/30">
            {timeframes.map((tf) => (
              <button
                key={tf.id}
                onClick={() => onTimeframeChange(tf.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeframe === tf.id
                    ? 'bg-luxury text-gray-900 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-6">
        <div className="relative">
          <svg
            width="100%"
            height="300"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="overflow-visible"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="wealthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.05} />
              </linearGradient>
              
              <linearGradient id="wealthStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#F7E7A3" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 1, 2, 3, 4].map((line) => (
              <line
                key={line}
                x1="0"
                y1={chartHeight * line / 4}
                x2={chartWidth}
                y2={chartHeight * line / 4}
                stroke="rgb(75, 85, 99)"
                strokeWidth="1"
                strokeOpacity="0.2"
                strokeDasharray="5,5"
              />
            ))}

            {/* Wealth Area Fill */}
            <motion.path
              d={generateFillPath(data, chartWidth, chartHeight)}
              fill="url(#wealthGradient)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: animationProgress, 
                opacity: animationProgress 
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Wealth Line */}
            <motion.path
              d={generatePath(data, chartWidth, chartHeight)}
              stroke="url(#wealthStroke)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: animationProgress }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{
                filter: 'drop-shadow(0 2px 8px rgba(212, 175, 55, 0.3))'
              }}
            />

            {/* Data Points */}
            {data.map((point, index) => {
              const minValue = Math.min(...data.map(p => p.portfolioValue));
              const maxValue = Math.max(...data.map(p => p.portfolioValue));
              const valueRange = maxValue - minValue;
              const x = (index / (data.length - 1)) * chartWidth;
              const y = chartHeight - ((point.portfolioValue - minValue) / valueRange) * chartHeight;

              return (
                <motion.circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={hoveredPoint === point ? 6 : 3}
                  fill="#D4AF37"
                  stroke="#0F172A"
                  strokeWidth="2"
                  className="cursor-pointer"
                  initial={{ scale: 0 }}
                  animate={{ scale: animationProgress }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredPoint(point)}
                  whileHover={{ scale: 1.5 }}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(212, 175, 55, 0.5))'
                  }}
                />
              );
            })}
          </svg>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredPoint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute top-4 left-4 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-4 min-w-[200px] z-10"
                style={{
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="text-xs text-gray-400 mb-2">
                  {new Date(hoveredPoint.timestamp).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Portfolio Value</span>
                    <span className="text-luxury font-bold">
                      ${(hoveredPoint.portfolioValue / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Daily P&L</span>
                    <span className={`font-bold text-sm ${
                      hoveredPoint.dailyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {hoveredPoint.dailyPnL >= 0 ? '+' : ''}${(hoveredPoint.dailyPnL / 1000).toFixed(1)}K
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Monthly Return</span>
                    <span className={`font-bold text-sm ${
                      hoveredPoint.monthlyReturn >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {hoveredPoint.monthlyReturn >= 0 ? '+' : ''}{hoveredPoint.monthlyReturn.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700/30">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Today's P&L</div>
            <div className={`text-lg font-bold ${
              latestData?.dailyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {latestData?.dailyPnL >= 0 ? '+' : ''}${latestData ? (latestData.dailyPnL / 1000).toFixed(1) : '0.0'}K
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Monthly Return</div>
            <div className={`text-lg font-bold ${
              latestData?.monthlyReturn >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {latestData?.monthlyReturn >= 0 ? '+' : ''}{latestData?.monthlyReturn.toFixed(2)}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Return</div>
            <div className={`text-lg font-bold ${
              totalReturn >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Peak Value</div>
            <div className="text-lg font-bold text-luxury">
              ${data.length ? (Math.max(...data.map(p => p.portfolioValue)) / 1000000).toFixed(2) : '0.00'}M
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WealthChart;