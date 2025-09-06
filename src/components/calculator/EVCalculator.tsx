'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  Shield,
  Activity,
  BarChart3,
  Info,
  Zap,
  Target,
  DollarSign,
  Percent,
  AlertTriangle,
  ChartLine,
  Sparkles
} from 'lucide-react';
import { ShieldConfig } from '@/components/shield/ShieldToggle';

interface SimulationResult {
  expectedValue: number;
  winProbability: number;
  lossRisk: number;
  potentialProfit: number;
  potentialLoss: number;
  roi: number;
  breakEvenOdds: number;
  kellyFraction: number;
  sharpeRatio: number;
  maxDrawdown: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  profitCurve: Array<{ x: number; y: number }>;
  outcomeDistribution: Array<{ outcome: string; probability: number; value: number }>;
}

interface EVCalculatorProps {
  stakeAmount: number;
  selectedOdds: number;
  shieldConfig: ShieldConfig | null;
  marketVolatility?: 'low' | 'medium' | 'high' | 'extreme';
  historicalAccuracy?: number;
  onSimulationComplete?: (result: SimulationResult) => void;
  showAdvanced?: boolean;
  v1TokenBonus?: number;
}

export function EVCalculator({
  stakeAmount,
  selectedOdds,
  shieldConfig,
  marketVolatility = 'medium',
  historicalAccuracy = 0.65,
  onSimulationComplete,
  showAdvanced = false,
  v1TokenBonus = 0
}: EVCalculatorProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [simulationCount, setSimulationCount] = useState(10000);
  const [showDetails, setShowDetails] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  // Volatility multipliers for risk calculations
  const volatilityMultipliers = {
    low: 0.8,
    medium: 1.0,
    high: 1.3,
    extreme: 1.6
  };

  // Monte Carlo Simulation
  const runMonteCarloSimulation = useMemo(() => {
    return () => {
      const iterations = simulationCount;
      const results: number[] = [];
      const winProb = selectedOdds / 100;
      const volatilityFactor = volatilityMultipliers[marketVolatility];
      
      for (let i = 0; i < iterations; i++) {
        const random = Math.random();
        const adjustedWinProb = winProb * (1 + (Math.random() - 0.5) * volatilityFactor * 0.2);
        
        if (random < adjustedWinProb) {
          // Win scenario
          const payout = stakeAmount * (100 / selectedOdds);
          const profit = payout - stakeAmount;
          results.push(profit);
        } else {
          // Loss scenario
          if (shieldConfig?.enabled) {
            const shieldRefund = stakeAmount * (shieldConfig.percentage / 100);
            const netLoss = stakeAmount - shieldRefund - (stakeAmount * shieldConfig.fee);
            results.push(-netLoss);
          } else {
            results.push(-stakeAmount);
          }
        }
      }
      
      return results;
    };
  }, [stakeAmount, selectedOdds, shieldConfig, marketVolatility, simulationCount]);

  // Calculate comprehensive metrics
  const calculateMetrics = (): SimulationResult => {
    const simulationResults = runMonteCarloSimulation();
    
    // Basic statistics
    const expectedValue = simulationResults.reduce((a, b) => a + b, 0) / simulationResults.length;
    const winCount = simulationResults.filter(r => r > 0).length;
    const winProbability = (winCount / simulationResults.length) * 100;
    
    // Advanced metrics
    const potentialProfit = stakeAmount * (100 / selectedOdds) - stakeAmount;
    const potentialLoss = shieldConfig?.enabled 
      ? stakeAmount * (1 - shieldConfig.percentage / 100) + (stakeAmount * shieldConfig.fee)
      : stakeAmount;
    
    const roi = (expectedValue / stakeAmount) * 100;
    const breakEvenOdds = 100 / (1 + (potentialProfit / stakeAmount));
    
    // Kelly Criterion
    const p = winProbability / 100;
    const q = 1 - p;
    const b = potentialProfit / stakeAmount;
    const kellyFraction = Math.max(0, Math.min(1, (p * b - q) / b)) * 100;
    
    // Sharpe Ratio (simplified)
    const returns = simulationResults.map(r => r / stakeAmount);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length);
    const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;
    
    // Max Drawdown
    let maxDrawdown = 0;
    let peak = 0;
    let runningTotal = 0;
    for (const result of simulationResults) {
      runningTotal += result;
      if (runningTotal > peak) peak = runningTotal;
      const drawdown = peak > 0 ? (peak - runningTotal) / peak : 0;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    }
    
    // Confidence Interval (95%)
    const sortedResults = [...simulationResults].sort((a, b) => a - b);
    const lowerIndex = Math.floor(simulationResults.length * 0.025);
    const upperIndex = Math.floor(simulationResults.length * 0.975);
    
    // Generate profit curve
    const profitCurve = [];
    let cumulative = 0;
    for (let i = 0; i < Math.min(100, simulationResults.length); i++) {
      cumulative += simulationResults[i];
      profitCurve.push({ x: i, y: cumulative });
    }
    
    // Outcome distribution
    const outcomeDistribution = [
      { outcome: 'Win', probability: winProbability, value: potentialProfit },
      { outcome: 'Loss', probability: 100 - winProbability, value: -potentialLoss }
    ];
    
    return {
      expectedValue,
      winProbability,
      lossRisk: 100 - winProbability,
      potentialProfit,
      potentialLoss,
      roi,
      breakEvenOdds,
      kellyFraction,
      sharpeRatio,
      maxDrawdown: maxDrawdown * 100,
      confidenceInterval: {
        lower: sortedResults[lowerIndex],
        upper: sortedResults[upperIndex]
      },
      profitCurve,
      outcomeDistribution
    };
  };

  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    if (stakeAmount > 0 && selectedOdds > 0) {
      setIsCalculating(true);
      const timer = setTimeout(() => {
        const newResult = calculateMetrics();
        setResult(newResult);
        setIsCalculating(false);
        onSimulationComplete?.(newResult);
        
        // Animate the EV value
        const targetValue = newResult.expectedValue;
        const duration = 1000;
        const steps = 60;
        const increment = targetValue / steps;
        let current = 0;
        
        const interval = setInterval(() => {
          current += increment;
          if (current >= targetValue) {
            setAnimatedValue(targetValue);
            clearInterval(interval);
          } else {
            setAnimatedValue(current);
          }
        }, duration / steps);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [stakeAmount, selectedOdds, shieldConfig, marketVolatility, simulationCount]);

  const getEVColor = (ev: number) => {
    if (ev > stakeAmount * 0.2) return 'text-neon-green';
    if (ev > 0) return 'text-green-400';
    if (ev > -stakeAmount * 0.2) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskLevel = () => {
    if (!result) return { level: 'Unknown', color: 'text-gray-400', icon: AlertTriangle };
    
    const riskScore = (result.lossRisk / 100) * volatilityMultipliers[marketVolatility] * (1 - (shieldConfig?.percentage || 0) / 100);
    
    if (riskScore < 0.3) return { level: 'Low Risk', color: 'text-green-400', icon: Shield };
    if (riskScore < 0.5) return { level: 'Medium Risk', color: 'text-yellow-400', icon: Activity };
    if (riskScore < 0.7) return { level: 'High Risk', color: 'text-orange-400', icon: AlertTriangle };
    return { level: 'Very High Risk', color: 'text-red-400', icon: AlertTriangle };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const riskLevel = getRiskLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Expected Value Calculator</h3>
            <p className="text-xs text-gray-400">Monte Carlo simulation with {simulationCount.toLocaleString()} iterations</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 rounded-lg bg-glass-bg hover:bg-glass-bg-light transition-colors"
        >
          <Info className="w-4 h-4 text-gray-400" />
        </motion.button>
      </div>

      {/* Main EV Display */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 rounded-2xl blur-xl" />
        <div className="relative glass-bg rounded-2xl p-6 border border-glass-border">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Expected Value</p>
            <div className={`text-4xl font-bold ${result ? getEVColor(result.expectedValue) : 'text-white'} mb-2`}>
              {isCalculating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse delay-150" />
                </div>
              ) : (
                formatCurrency(animatedValue)
              )}
            </div>
            {result && (
              <p className={`text-sm ${result.expectedValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(result.roi)} ROI
              </p>
            )}
          </div>

          {/* Risk Level Indicator */}
          {result && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <riskLevel.icon className={`w-4 h-4 ${riskLevel.color}`} />
              <span className={`text-sm font-medium ${riskLevel.color}`}>{riskLevel.level}</span>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-bg rounded-xl p-3 border border-glass-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-gray-400">Win Chance</span>
            </div>
            <p className="text-lg font-bold text-white">{result.winProbability.toFixed(1)}%</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-bg rounded-xl p-3 border border-glass-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3 h-3 text-neon-green" />
              <span className="text-xs text-gray-400">Max Win</span>
            </div>
            <p className="text-lg font-bold text-neon-green">
              {formatCurrency(result.potentialProfit)}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-bg rounded-xl p-3 border border-glass-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3 h-3 text-red-400" />
              <span className="text-xs text-gray-400">Max Loss</span>
            </div>
            <p className="text-lg font-bold text-red-400">
              {formatCurrency(result.potentialLoss)}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-bg rounded-xl p-3 border border-glass-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3 h-3 text-neon-cyan" />
              <span className="text-xs text-gray-400">Break Even</span>
            </div>
            <p className="text-lg font-bold text-neon-cyan">
              {result.breakEvenOdds.toFixed(1)}%
            </p>
          </motion.div>
        </div>
      )}

      {/* Advanced Metrics */}
      <AnimatePresence>
        {showDetails && result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="border-t border-glass-border pt-4">
              <h4 className="text-sm font-semibold text-white mb-3">Advanced Analytics</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-bg rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-gray-400">Kelly Criterion</span>
                  </div>
                  <p className="text-sm font-bold text-white">{result.kellyFraction.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Optimal bet size</p>
                </div>

                <div className="glass-bg rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-gray-400">Sharpe Ratio</span>
                  </div>
                  <p className="text-sm font-bold text-white">{result.sharpeRatio.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Risk-adjusted return</p>
                </div>

                <div className="glass-bg rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ChartLine className="w-3 h-3 text-orange-400" />
                    <span className="text-xs text-gray-400">Max Drawdown</span>
                  </div>
                  <p className="text-sm font-bold text-white">{result.maxDrawdown.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">Peak to trough</p>
                </div>

                <div className="glass-bg rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-gray-400">95% CI</span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {formatCurrency(result.confidenceInterval.lower)}
                  </p>
                  <p className="text-xs text-gray-500">
                    to {formatCurrency(result.confidenceInterval.upper)}
                  </p>
                </div>
              </div>
            </div>

            {/* Outcome Distribution */}
            <div className="glass-bg rounded-xl p-4">
              <h5 className="text-sm font-semibold text-white mb-3">Outcome Distribution</h5>
              <div className="space-y-2">
                {result.outcomeDistribution.map((outcome, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        outcome.outcome === 'Win' ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <span className="text-sm text-gray-300">{outcome.outcome}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">{outcome.probability.toFixed(1)}%</span>
                      <span className={`text-sm font-bold ${
                        outcome.value >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatCurrency(outcome.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simulation Settings */}
            {showAdvanced && (
              <div className="glass-bg rounded-xl p-4">
                <h5 className="text-sm font-semibold text-white mb-3">Simulation Settings</h5>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Iterations</label>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={simulationCount}
                      onChange={(e) => setSimulationCount(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1K</span>
                      <span>{(simulationCount / 1000).toFixed(0)}K</span>
                      <span>100K</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Message */}
      {shieldConfig?.enabled && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-shield-gold/10 border border-shield-gold/20">
          <Shield className="w-4 h-4 text-shield-gold mt-0.5" />
          <div className="flex-1">
            <p className="text-xs text-shield-gold">
              Shield Protection Active: {shieldConfig.percentage}% loss coverage
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Reduces maximum loss to {formatCurrency(result?.potentialLoss || 0)}
            </p>
          </div>
        </div>
      )}

      {/* V1 Token Bonus */}
      {v1TokenBonus > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20">
          <Zap className="w-4 h-4 text-neon-purple" />
          <p className="text-xs text-neon-purple">
            V1 Token Bonus: +{v1TokenBonus}% to expected value
          </p>
        </div>
      )}
    </motion.div>
  );
}