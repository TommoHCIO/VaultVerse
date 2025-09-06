'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  DollarSign, 
  Activity,
  Star,
  Zap,
  Eye,
  Target
} from 'lucide-react';

export interface MarketOutcome {
  id: string;
  label: string;
  odds: number;
  liquidity: number;
  isWinning?: boolean;
}

export interface MarketCardProps {
  id: string;
  question: string;
  description: string;
  category: 'CRYPTO' | 'POLITICS' | 'SPORTS' | 'ENTERTAINMENT' | 'TECHNOLOGY' | 'ECONOMICS';
  outcomes: MarketOutcome[];
  totalVolume: number;
  participantCount: number;
  endTime: Date;
  isResolved: boolean;
  shieldEnabled: boolean;
  trending?: boolean;
  featured?: boolean;
}

const categoryColors = {
  CRYPTO: 'text-luxury border-luxury/30 bg-luxury/10',
  POLITICS: 'text-sapphire-info border-sapphire-info/30 bg-sapphire-info/10',
  SPORTS: 'text-emerald-success border-emerald-success/30 bg-emerald-success/10',
  ENTERTAINMENT: 'text-neon-pink border-neon-pink/30 bg-neon-pink/10',
  TECHNOLOGY: 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10',
  ECONOMICS: 'text-wealth border-wealth/30 bg-wealth/10'
};

export function MarketCard({ 
  id, 
  question, 
  description, 
  category, 
  outcomes, 
  totalVolume, 
  participantCount, 
  endTime, 
  isResolved, 
  shieldEnabled, 
  trending, 
  featured 
}: MarketCardProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [shieldActive, setShieldActive] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const timeRemaining = endTime.getTime() - new Date().getTime();
  const daysLeft = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
  const hoursLeft = Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`;
    return `$${volume}`;
  };

  const formatLiquidity = (liquidity: number) => {
    if (liquidity >= 1000000) return `${(liquidity / 1000000).toFixed(1)}M`;
    if (liquidity >= 1000) return `${(liquidity / 1000).toFixed(1)}K`;
    return liquidity.toString();
  };

  return (
    <motion.div
      layout
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-deep-navy/90 to-navy-medium/80 backdrop-blur-md border border-platinum/10 hover:border-luxury/30 transition-all duration-500 group"
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 20px 40px rgba(212, 175, 55, 0.15)" 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-luxury/5 via-transparent to-emerald-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-luxury/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header Section */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${categoryColors[category]}`}
              whileHover={{ scale: 1.05 }}
            >
              {category}
            </motion.div>
            {trending && (
              <motion.div 
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-success/20 border border-emerald-success/30"
                animate={{ 
                  boxShadow: [
                    "0 0 0 rgba(16, 185, 129, 0.3)",
                    "0 0 10px rgba(16, 185, 129, 0.5)",
                    "0 0 0 rgba(16, 185, 129, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-3 h-3 text-emerald-success" />
                <span className="text-xs text-emerald-success font-medium">TRENDING</span>
              </motion.div>
            )}
            {featured && (
              <motion.div 
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-luxury/20 border border-luxury/30"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Star className="w-3 h-3 text-luxury fill-luxury" />
                <span className="text-xs text-luxury font-medium">FEATURED</span>
              </motion.div>
            )}
          </div>

          {shieldEnabled && (
            <motion.button
              onClick={() => setShieldActive(!shieldActive)}
              className={`relative p-2 rounded-xl transition-all duration-300 ${
                shieldActive 
                  ? 'bg-luxury/20 border border-luxury/50 shadow-lg shadow-luxury/25' 
                  : 'bg-platinum/10 border border-platinum/20 hover:bg-luxury/10 hover:border-luxury/30'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className={`w-5 h-5 ${shieldActive ? 'text-luxury' : 'text-platinum'}`} />
              {shieldActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-luxury/20"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 rgba(255, 215, 0, 0.4)",
                      "0 0 15px rgba(255, 215, 0, 0.6)",
                      "0 0 0 rgba(255, 215, 0, 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          )}
        </div>

        <h3 className="text-lg font-bold text-executive mb-2 leading-tight">
          {question}
        </h3>

        <p className="text-sm text-platinum-dark mb-4 line-clamp-2">
          {description}
        </p>

        {/* Market Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-4 h-4 text-luxury" />
              <span className="text-xs text-platinum-dark uppercase tracking-wider">Volume</span>
            </div>
            <div className="text-lg font-bold text-luxury">{formatVolume(totalVolume)}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-emerald-success" />
              <span className="text-xs text-platinum-dark uppercase tracking-wider">Traders</span>
            </div>
            <div className="text-lg font-bold text-emerald-success">{participantCount.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-sapphire-info" />
              <span className="text-xs text-platinum-dark uppercase tracking-wider">Ends</span>
            </div>
            <div className="text-sm font-semibold text-sapphire-info">
              {daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h` : `${hoursLeft}h`}
            </div>
          </div>
        </div>
      </div>

      {/* Outcomes Section */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          {outcomes.map((outcome, index) => {
            const liquidityPercentage = (outcome.liquidity / outcomes.reduce((sum, o) => sum + o.liquidity, 0)) * 100;
            const isSelected = selectedOutcome === outcome.id;
            
            return (
              <motion.div
                key={outcome.id}
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'border-luxury/50 bg-luxury/10 shadow-lg shadow-luxury/20' 
                    : 'border-platinum/20 bg-glass-bg hover:border-platinum/40 hover:bg-platinum/5'
                }`}
                onClick={() => setSelectedOutcome(isSelected ? null : outcome.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                {/* Liquidity Bar Background */}
                <motion.div
                  className={`absolute inset-0 ${isSelected ? 'bg-luxury/10' : 'bg-emerald-success/5'}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: liquidityPercentage / 100 }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  style={{ transformOrigin: 'left' }}
                />

                <div className="relative p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-executive">{outcome.label}</span>
                      {outcome.isWinning && (
                        <motion.div
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-success/20 border border-emerald-success/30"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Target className="w-3 h-3 text-emerald-success" />
                          <span className="text-xs text-emerald-success font-medium">LEADING</span>
                        </motion.div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-platinum-dark" />
                        <span className="text-xs text-platinum-dark">Liquidity: {formatLiquidity(outcome.liquidity)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-2xl font-bold mb-1 ${
                      outcome.odds > 50 ? 'text-emerald-success' : 'text-luxury'
                    }`}>
                      {outcome.odds}%
                    </div>
                    <div className="text-xs text-platinum-dark uppercase tracking-wider">Odds</div>
                  </div>
                </div>

                {/* Selection Indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-luxury"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Shield Protection Info */}
        <AnimatePresence>
          {shieldActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-luxury/10 border border-luxury/30">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-luxury" />
                  <span className="text-sm font-semibold text-luxury uppercase tracking-wider">Shield Protection Active</span>
                </div>
                <div className="text-xs text-platinum-dark">
                  Up to 30% loss protection available. Premium applied based on position size and risk assessment.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <motion.button
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              selectedOutcome 
                ? 'bg-luxury hover:bg-luxury/90 text-deep-navy shadow-lg shadow-luxury/25' 
                : 'bg-platinum/20 text-platinum-dark cursor-not-allowed'
            }`}
            disabled={!selectedOutcome}
            whileHover={selectedOutcome ? { scale: 1.02 } : {}}
            whileTap={selectedOutcome ? { scale: 0.98 } : {}}
          >
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              {selectedOutcome ? 'Place Trade' : 'Select Position'}
            </span>
          </motion.button>

          <motion.button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-3 rounded-xl bg-glass-bg border border-platinum/20 hover:border-luxury/30 hover:bg-luxury/5 text-platinum hover:text-luxury transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Detailed View */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-glass-bg border border-platinum/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-platinum-dark">Market ID:</span>
                    <div className="text-executive font-mono">{id}</div>
                  </div>
                  <div>
                    <span className="text-platinum-dark">Resolution:</span>
                    <div className="text-executive">{endTime.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-platinum-dark">Total Pool:</span>
                    <div className="text-executive">{formatVolume(outcomes.reduce((sum, o) => sum + o.liquidity, 0))}</div>
                  </div>
                  <div>
                    <span className="text-platinum-dark">Status:</span>
                    <div className={`${isResolved ? 'text-emerald-success' : 'text-sapphire-info'}`}>
                      {isResolved ? 'Resolved' : 'Active'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}