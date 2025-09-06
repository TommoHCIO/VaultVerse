'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Shield, 
  Crown,
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Coins,
  Calculator
} from 'lucide-react';

export interface WealthMetrics {
  netWorth: number;
  liquidAssets: number;
  totalReturns: number;
  monthlyIncome: number;
  riskScore: number;
  diversificationIndex: number;
  sharpeRatio: number;
  maxDrawdown: number;
  wealthTier: string;
  creditRating: string;
  investmentGrade: string;
  volatility: number;
  beta: number;
  alpha: number;
}

export interface WealthIndicatorsProps {
  metrics: WealthMetrics;
  className?: string;
}

export function WealthIndicators({
  metrics,
  className = ''
}: WealthIndicatorsProps) {
  const [animatedMetrics, setAnimatedMetrics] = useState<Partial<WealthMetrics>>({});

  useEffect(() => {
    // Animate number counters
    const animateValue = (key: keyof WealthMetrics, start: number, end: number, duration: number) => {
      const startTime = Date.now();
      const update = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOut;
        
        setAnimatedMetrics(prev => ({ ...prev, [key]: current }));
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      requestAnimationFrame(update);
    };

    // Animate key metrics
    animateValue('netWorth', 0, metrics.netWorth, 2000);
    animateValue('liquidAssets', 0, metrics.liquidAssets, 1800);
    animateValue('totalReturns', 0, metrics.totalReturns, 1600);
    animateValue('monthlyIncome', 0, metrics.monthlyIncome, 1400);
  }, [metrics]);

  const getWealthTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'ultra-high-net-worth': return <Crown className="w-5 h-5" />;
      case 'high-net-worth': return <Award className="w-5 h-5" />;
      case 'affluent': return <Target className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  const getWealthTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'ultra-high-net-worth': return 'text-luxury border-luxury/30 bg-luxury/10';
      case 'high-net-worth': return 'text-champagne-gold border-champagne-gold/30 bg-champagne-gold/10';
      case 'affluent': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getCreditRatingColor = (rating: string) => {
    if (['AAA', 'AA+', 'AA', 'AA-'].includes(rating)) {
      return 'text-luxury border-luxury/30 bg-luxury/10';
    } else if (['A+', 'A', 'A-'].includes(rating)) {
      return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
    } else if (['BBB+', 'BBB', 'BBB-'].includes(rating)) {
      return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
    } else {
      return 'text-red-400 border-red-400/30 bg-red-400/10';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 3) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (score <= 6) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  const formatCurrency = (value: number, compact = true) => {
    if (compact) {
      if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatPercentage = (value: number, decimals = 1) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Wealth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-luxury/10 border border-luxury/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-luxury" />
            </div>
            <div className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getWealthTierColor(metrics.wealthTier)}`}>
              {metrics.wealthTier.toUpperCase()}
            </div>
          </div>
          
          <div className="text-2xl font-bold text-luxury mb-1">
            {formatCurrency(animatedMetrics.netWorth || 0)}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Net Worth</div>
          
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
            <span className="text-emerald-400 font-medium">
              {formatPercentage(15.3)} this quarter
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <Coins className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="px-3 py-1 rounded-lg text-xs font-semibold border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
              LIQUID
            </div>
          </div>
          
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {formatCurrency(animatedMetrics.liquidAssets || 0)}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Liquid Assets</div>
          
          <div className="mt-4 text-sm text-gray-300">
            <span className="text-emerald-400 font-medium">
              {((metrics.liquidAssets / metrics.netWorth) * 100).toFixed(0)}%
            </span> of portfolio
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-champagne-gold/10 border border-champagne-gold/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-champagne-gold" />
            </div>
            <div className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getCreditRatingColor(metrics.creditRating)}`}>
              {metrics.creditRating}
            </div>
          </div>
          
          <div className="text-2xl font-bold text-champagne-gold mb-1">
            {formatCurrency(animatedMetrics.totalReturns || 0)}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Total Returns</div>
          
          <div className="mt-4 text-sm text-gray-300">
            <span className="text-champagne-gold font-medium">
              {metrics.sharpeRatio.toFixed(2)}
            </span> Sharpe Ratio
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div className="px-3 py-1 rounded-lg text-xs font-semibold border border-blue-400/30 bg-blue-400/10 text-blue-400">
              MONTHLY
            </div>
          </div>
          
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {formatCurrency(animatedMetrics.monthlyIncome || 0)}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">Monthly Income</div>
          
          <div className="mt-4 text-sm text-gray-300">
            <span className="text-blue-400 font-medium">
              {formatCurrency((animatedMetrics.monthlyIncome || 0) * 12)}
            </span> annually
          </div>
        </motion.div>
      </div>

      {/* Advanced Risk & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
        >
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-luxury" />
            Risk Assessment
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Risk Score</span>
              <div className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getRiskScoreColor(metrics.riskScore)}`}>
                {metrics.riskScore.toFixed(1)}/10
              </div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div 
                className={`h-2 rounded-full ${
                  metrics.riskScore <= 3 ? 'bg-emerald-400' :
                  metrics.riskScore <= 6 ? 'bg-amber-400' : 'bg-red-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${(metrics.riskScore / 10) * 100}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-sm text-gray-400 mb-1">Max Drawdown</div>
                <div className="text-red-400 font-semibold">{formatPercentage(metrics.maxDrawdown)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Volatility</div>
                <div className="text-amber-400 font-semibold">{formatPercentage(metrics.volatility)}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
        >
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-champagne-gold" />
            Performance Analytics
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Alpha Generation</span>
              <span className={`font-semibold ${metrics.alpha >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatPercentage(metrics.alpha, 2)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Beta (Market Correlation)</span>
              <span className="text-blue-400 font-semibold">{metrics.beta.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Diversification Index</span>
              <span className="text-champagne-gold font-semibold">
                {(metrics.diversificationIndex * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="pt-2 border-t border-gray-700/30">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Investment Grade</span>
                <div className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                  metrics.investmentGrade === 'AAA' ? 'text-luxury border-luxury/30 bg-luxury/10' :
                  metrics.investmentGrade.startsWith('A') ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
                  'text-amber-400 border-amber-400/30 bg-amber-400/10'
                }`}>
                  {metrics.investmentGrade}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wealth Growth Projection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
      >
        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-luxury" />
          Wealth Projection
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {formatCurrency(metrics.netWorth * 1.15)}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">1 Year</div>
            <div className="text-sm text-emerald-400 font-medium">+15% Growth</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-champagne-gold mb-1">
              {formatCurrency(metrics.netWorth * 1.35)}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">3 Years</div>
            <div className="text-sm text-champagne-gold font-medium">+35% Growth</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {formatCurrency(metrics.netWorth * 1.67)}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">5 Years</div>
            <div className="text-sm text-blue-400 font-medium">+67% Growth</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-luxury mb-1">
              {formatCurrency(metrics.netWorth * 2.25)}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">10 Years</div>
            <div className="text-sm text-luxury font-medium">+125% Growth</div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700/30 text-center">
          <div className="text-sm text-gray-400 mb-2">
            Based on current performance metrics and market conditions
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>• Historical Alpha: {formatPercentage(metrics.alpha, 2)}</span>
            <span>• Risk-Adjusted Return: {metrics.sharpeRatio.toFixed(2)}</span>
            <span>• Diversification: {(metrics.diversificationIndex * 100).toFixed(0)}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default WealthIndicators;