'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Shield,
  TrendingUp,
  TrendingDown,
  Users,
  Volume2,
  Clock,
  Info,
  Plus,
  Minus,
  Calculator,
  Zap,
  AlertTriangle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldToggle, ShieldConfig } from '@/components/shield/ShieldToggle';
import { EVCalculator } from '@/components/calculator/EVCalculator';

// Mock market data - would come from API
const mockMarket = {
  id: '1',
  question: 'Will Bitcoin reach $100,000 by end of 2025?',
  description: 'Market resolves based on CoinGecko price data at 11:59 PM UTC on December 31, 2025. The price must close at or above $100,000 on the specified date for the "Yes" outcome to win.',
  category: 'CRYPTO' as const,
  outcomes: [
    { 
      id: '1a', 
      label: 'Yes', 
      odds: 65, 
      liquidity: 250000, 
      isWinning: true,
      priceChange: '+2.3%',
      volume24h: 45000
    },
    { 
      id: '1b', 
      label: 'No', 
      odds: 35, 
      liquidity: 135000,
      priceChange: '-1.8%',
      volume24h: 23000
    }
  ],
  totalVolume: 385000,
  participantCount: 1247,
  endTime: new Date('2025-12-31T23:59:59Z'),
  isResolved: false,
  shieldEnabled: true,
  trending: true,
  featured: true,
  createdAt: new Date('2024-01-15T10:30:00Z'),
  creator: '0x742d35Cc6638Bb6eb8b50a2e1b1b77Ce',
  oracleSource: 'CoinGecko API',
  minimumStake: 1,
  maximumStake: 10000,
  resolutionSource: 'Automated Oracle + Manual Verification'
};

const categoryColors = {
  CRYPTO: 'from-orange-500 to-yellow-500',
  POLITICS: 'from-blue-500 to-purple-500', 
  SPORTS: 'from-green-500 to-emerald-500',
  ENTERTAINMENT: 'from-pink-500 to-rose-500',
  TECHNOLOGY: 'from-cyan-500 to-blue-500',
  ECONOMICS: 'from-gray-500 to-slate-500'
};

const categoryIcons = {
  CRYPTO: '₿',
  POLITICS: '🏛️',
  SPORTS: '⚽',
  ENTERTAINMENT: '🎬',
  TECHNOLOGY: '💻',
  ECONOMICS: '📊'
};

export default function MarketDetailPage() {
  const params = useParams();
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [shieldConfig, setShieldConfig] = useState<ShieldConfig>({
    enabled: false,
    percentage: 30,
    cost: 0,
    maxCoverage: 0,
    isV1TokenHolder: true, // Simulate V1 token holder
    discountRate: 0.15 // 15% discount for V1 holders
  });
  const [isStaking, setIsStaking] = useState(false);
  const [showEVCalculator, setShowEVCalculator] = useState(false);

  const market = mockMarket; // In real app, fetch by params.id

  const timeRemaining = market.endTime.getTime() - Date.now();
  const isExpired = timeRemaining <= 0;

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return 'Market Ended';
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const formatVolume = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const calculatePotentialWinnings = () => {
    const stake = parseFloat(stakeAmount) || 0;
    const selectedOutcomeData = market.outcomes.find(o => o.id === selectedOutcome);
    if (!stake || !selectedOutcomeData) return 0;

    // Simplified calculation: stake * (100 / odds) - stake
    const odds = selectedOutcomeData.odds / 100;
    const potentialReturn = stake / odds;
    return potentialReturn - stake;
  };

  const calculateShieldRefund = () => {
    const stake = parseFloat(stakeAmount) || 0;
    if (!shieldConfig.enabled || !stake) return 0;
    return shieldConfig.maxCoverage;
  };

  const calculateShieldCost = () => {
    if (!shieldConfig.enabled) return 0;
    return shieldConfig.cost;
  };

  const getMaxPayout = () => {
    const selectedOutcomeData = market.outcomes.find(o => o.id === selectedOutcome);
    if (!selectedOutcomeData) return 0;
    return selectedOutcomeData.liquidity * 0.1; // Max 10% of pool liquidity
  };

  const handleStakeAmountChange = (value: string) => {
    // Only allow positive numbers with up to 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value) || value === '') {
      setStakeAmount(value);
    }
  };

  const handleQuickStake = (amount: number) => {
    setStakeAmount(amount.toString());
  };

  const handlePlaceStake = async () => {
    if (!selectedOutcome || !stakeAmount || parseFloat(stakeAmount) < market.minimumStake) {
      return;
    }

    setIsStaking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setSelectedOutcome(null);
    setStakeAmount('');
    setShieldConfig(prev => ({ ...prev, enabled: false }));
    setIsStaking(false);
    
    // Show success message (you'd implement this with a toast/notification system)
    alert(`Stake of $${stakeAmount} placed successfully!`);
  };

  const selectedOutcomeData = market.outcomes.find(o => o.id === selectedOutcome);
  const potentialWinnings = calculatePotentialWinnings();
  const shieldRefund = calculateShieldRefund();
  const shieldCost = calculateShieldCost();
  const maxPayout = getMaxPayout();
  const stakeValue = parseFloat(stakeAmount) || 0;

  return (
    <div className="min-h-screen bg-vaultor-dark mesh-gradient">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/arena">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-glass-bg border border-glass-border text-gray-400 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </Link>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${categoryColors[market.category]} text-white`}>
                <span>{categoryIcons[market.category]}</span>
                {market.category}
              </div>
              
              {market.trending && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neon-green/20 text-neon-green text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  TRENDING
                </div>
              )}
              
              {market.shieldEnabled && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-shield-gold/20 text-shield-gold text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  SHIELD AVAILABLE
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {market.question}
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Market Details</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                {market.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Creator</span>
                  <p className="text-white font-mono">
                    {market.creator.slice(0, 8)}...{market.creator.slice(-4)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Oracle Source</span>
                  <p className="text-white">{market.oracleSource}</p>
                </div>
                <div>
                  <span className="text-gray-400">Min Stake</span>
                  <p className="text-white">${market.minimumStake}</p>
                </div>
                <div>
                  <span className="text-gray-400">Max Stake</span>
                  <p className="text-white">${market.maximumStake}</p>
                </div>
              </div>
            </motion.div>

            {/* Market Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-green mb-2">
                    {formatVolume(market.totalVolume)}
                  </div>
                  <div className="text-gray-400 text-sm">Total Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-cyan mb-2">
                    {market.participantCount.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Traders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neon-purple mb-2">
                    {formatVolume(market.outcomes.reduce((sum, o) => sum + o.liquidity, 0))}
                  </div>
                  <div className="text-gray-400 text-sm">Total Liquidity</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${isExpired ? 'text-red-400' : 'text-white'}`}>
                    <Clock className="w-6 h-6 mx-auto mb-1" />
                  </div>
                  <div className="text-gray-400 text-sm">{formatTimeRemaining(timeRemaining)}</div>
                </div>
              </div>
            </motion.div>

            {/* Outcomes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Market Outcomes</h2>
              
              <div className="space-y-4">
                {market.outcomes.map((outcome, index) => (
                  <motion.button
                    key={outcome.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedOutcome(outcome.id)}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 ${
                      selectedOutcome === outcome.id
                        ? 'border-neon-purple bg-neon-purple/10'
                        : 'border-glass-border bg-glass-bg hover:border-neon-purple/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="text-lg font-semibold text-white mb-1">
                          {outcome.label}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Volume2 className="w-3 h-3" />
                            {formatVolume(outcome.liquidity)} liquidity
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {formatVolume(outcome.volume24h)} 24h
                          </span>
                          <span className={`flex items-center gap-1 ${
                            outcome.priceChange.startsWith('+') ? 'text-neon-green' : 'text-red-400'
                          }`}>
                            {outcome.priceChange.startsWith('+') ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {outcome.priceChange}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-neon">
                          {Math.round(outcome.odds)}%
                        </div>
                        <div className="text-xs text-gray-400">
                          implied odds
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Betting Interface */}
          <div className="space-y-6">
            {/* Stake Input */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6 sticky top-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-neon-green" />
                Place Your Prediction
              </h2>

              {!selectedOutcome ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glass-bg flex items-center justify-center">
                    <Info className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400">
                    Select an outcome to place your prediction
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selected Outcome Display */}
                  <div className="p-4 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">
                          {selectedOutcomeData?.label}
                        </div>
                        <div className="text-sm text-gray-400">
                          {Math.round(selectedOutcomeData?.odds || 0)}% implied odds
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-neon font-bold">
                          {Math.round(selectedOutcomeData?.odds || 0)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stake Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stake Amount
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={stakeAmount}
                        onChange={(e) => handleStakeAmountChange(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full pl-8 pr-4 py-3 bg-glass-bg border border-glass-border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple transition-colors duration-300"
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    
                    {/* Quick Stake Buttons */}
                    <div className="flex gap-2 mt-3">
                      {[10, 25, 50, 100].map(amount => (
                        <button
                          key={amount}
                          onClick={() => handleQuickStake(amount)}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-glass-bg hover:bg-glass-bg-light text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>

                    {stakeValue > 0 && stakeValue < market.minimumStake && (
                      <p className="text-red-400 text-xs mt-2">
                        Minimum stake is ${market.minimumStake}
                      </p>
                    )}
                    {stakeValue > market.maximumStake && (
                      <p className="text-red-400 text-xs mt-2">
                        Maximum stake is ${market.maximumStake}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Shield Toggle */}
                  {market.shieldEnabled && (
                    <ShieldToggle
                      stakeAmount={stakeValue}
                      onConfigChange={setShieldConfig}
                      initialConfig={shieldConfig}
                      showAdvanced={true}
                      marketVolatility="high" // High volatility for crypto
                      v1TokenDiscount={0.15} // 15% discount for demo
                    />
                  )}

                  {/* EV Calculator Integration */}
                  {stakeValue > 0 && selectedOutcomeData && (
                    <div className="space-y-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowEVCalculator(!showEVCalculator)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30 text-white hover:from-neon-purple/30 hover:to-neon-cyan/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-2">
                          <Calculator className="w-4 h-4 text-neon-cyan" />
                          <span className="font-medium">Expected Value Analysis</span>
                        </div>
                        <motion.div
                          animate={{ rotate: showEVCalculator ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Plus className="w-4 h-4" />
                        </motion.div>
                      </motion.button>

                      <AnimatePresence>
                        {showEVCalculator && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <EVCalculator
                              stakeAmount={stakeValue}
                              selectedOdds={selectedOutcomeData.odds}
                              shieldConfig={shieldConfig.enabled ? shieldConfig : null}
                              marketVolatility="high"
                              historicalAccuracy={0.68}
                              showAdvanced={true}
                              v1TokenBonus={shieldConfig.isV1TokenHolder ? 5 : 0}
                              onSimulationComplete={(result) => {
                                console.log('Simulation complete:', result);
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Calculation Summary */}
                  {stakeValue > 0 && (
                    <div className="p-4 rounded-xl bg-glass-bg border border-glass-border">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-neon-cyan" />
                        Prediction Summary
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Stake Amount:</span>
                          <span className="text-white">${stakeValue.toFixed(2)}</span>
                        </div>
                        
                        {shieldConfig.enabled && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Shield Cost:</span>
                              <span className="text-red-400">-${shieldCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Net Stake:</span>
                              <span className="text-white">${(stakeValue - shieldCost).toFixed(2)}</span>
                            </div>
                          </>
                        )}
                        
                        <div className="border-t border-glass-border pt-2 mt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">If You Win:</span>
                            <span className="text-neon-green font-bold">
                              +${Math.min(potentialWinnings, maxPayout).toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-400">If You Lose:</span>
                            <span className={shieldConfig.enabled ? 'text-shield-gold' : 'text-red-400'}>
                              {shieldConfig.enabled ? (
                                <>-${(stakeValue - shieldRefund).toFixed(2)}</>
                              ) : (
                                <>-${stakeValue.toFixed(2)}</>
                              )}
                            </span>
                          </div>
                          
                          {shieldConfig.enabled && (
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Shield Refund:</span>
                              <span className="text-shield-gold">+${shieldRefund.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Place Stake Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceStake}
                    disabled={!selectedOutcome || !stakeAmount || parseFloat(stakeAmount) < market.minimumStake || parseFloat(stakeAmount) > market.maximumStake || isStaking || isExpired}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                      (!selectedOutcome || !stakeAmount || parseFloat(stakeAmount) < market.minimumStake || parseFloat(stakeAmount) > market.maximumStake || isExpired)
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'btn-neon hover:shadow-lg hover:shadow-neon-purple/25'
                    }`}
                  >
                    {isStaking ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Processing...
                      </>
                    ) : isExpired ? (
                      'Market Ended'
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Place Prediction
                      </>
                    )}
                  </motion.button>

                  {/* Risk Warning */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                    <div className="text-xs text-amber-200">
                      <strong>Risk Warning:</strong> Prediction markets involve financial risk. 
                      Only stake what you can afford to lose. Past performance doesn't guarantee future results.
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}