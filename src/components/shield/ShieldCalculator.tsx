'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export interface ShieldCalculatorProps {
  stakeAmount: number;
  protectionLevel: number;
  marketOdds: number;
  onCalculationUpdate?: (calculation: ShieldCalculation) => void;
  className?: string;
}

export interface ShieldCalculation {
  stakeAmount: number;
  protectionLevel: number;
  protectedAmount: number;
  feeAmount: number;
  netStake: number;
  potentialWin: number;
  potentialLoss: number;
  protectedLoss: number;
  expectedValue: number;
  breakEvenOdds: number;
}

const protectionFees = {
  10: 2.5,
  20: 4.0,
  30: 6.5
};

export function ShieldCalculator({ 
  stakeAmount, 
  protectionLevel, 
  marketOdds, 
  onCalculationUpdate,
  className = '' 
}: ShieldCalculatorProps) {
  const [calculation, setCalculation] = useState<ShieldCalculation | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (stakeAmount > 0) {
      const feeRate = protectionFees[protectionLevel as keyof typeof protectionFees] || 4.0;
      const feeAmount = stakeAmount * (feeRate / 100);
      const netStake = stakeAmount - feeAmount;
      const protectedAmount = stakeAmount * (protectionLevel / 100);
      
      // Calculate potential outcomes
      const winMultiplier = 100 / marketOdds;
      const potentialWin = netStake * winMultiplier - netStake;
      const potentialLoss = stakeAmount;
      const protectedLoss = potentialLoss - protectedAmount;
      
      // Calculate expected value with and without shield
      const winProbability = marketOdds / 100;
      const lossProbability = 1 - winProbability;
      const expectedValue = (winProbability * potentialWin) - (lossProbability * protectedLoss);
      
      // Calculate break-even odds
      const breakEvenOdds = (netStake / (netStake + protectedLoss)) * 100;

      const calc: ShieldCalculation = {
        stakeAmount,
        protectionLevel,
        protectedAmount,
        feeAmount,
        netStake,
        potentialWin,
        potentialLoss,
        protectedLoss,
        expectedValue,
        breakEvenOdds
      };

      setCalculation(calc);
      
      if (onCalculationUpdate) {
        onCalculationUpdate(calc);
      }
    }
  }, [stakeAmount, protectionLevel, marketOdds, onCalculationUpdate]);

  if (!calculation || stakeAmount <= 0) {
    return (
      <div className={`p-6 rounded-xl bg-glass-bg border border-platinum/20 ${className}`}>
        <div className="text-center text-platinum-dark">
          <Calculator className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Enter stake amount to see Shield calculations</p>
        </div>
      </div>
    );
  }

  const isPositiveEV = calculation.expectedValue > 0;
  const feePercentage = (calculation.feeAmount / calculation.stakeAmount) * 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Calculation Card */}
      <motion.div
        className="p-6 rounded-xl bg-gradient-to-br from-luxury/10 via-transparent to-emerald-success/5 border border-luxury/30 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="p-2 rounded-xl bg-luxury/20 border border-luxury/50"
            animate={{ 
              boxShadow: [
                "0 0 0 rgba(255, 215, 0, 0.3)",
                "0 0 15px rgba(255, 215, 0, 0.5)",
                "0 0 0 rgba(255, 215, 0, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-5 h-5 text-luxury" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-executive">Shield Protection Analysis</h3>
            <p className="text-sm text-platinum-dark">
              {calculation.protectionLevel}% protection on ${calculation.stakeAmount.toFixed(2)} stake
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-glass-bg border border-platinum/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-luxury" />
              <span className="text-sm text-platinum-dark uppercase tracking-wider">Protected Amount</span>
            </div>
            <div className="text-2xl font-bold text-luxury">
              ${calculation.protectedAmount.toFixed(2)}
            </div>
            <div className="text-xs text-platinum-dark">
              {calculation.protectionLevel}% of stake protected
            </div>
          </div>

          <div className="p-4 rounded-xl bg-glass-bg border border-platinum/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-executive" />
              <span className="text-sm text-platinum-dark uppercase tracking-wider">Protection Fee</span>
            </div>
            <div className="text-2xl font-bold text-executive">
              ${calculation.feeAmount.toFixed(2)}
            </div>
            <div className="text-xs text-platinum-dark">
              {feePercentage.toFixed(1)}% of stake amount
            </div>
          </div>
        </div>

        {/* Expected Value Indicator */}
        <div className={`p-4 rounded-xl border ${
          isPositiveEV 
            ? 'bg-emerald-success/10 border-emerald-success/30' 
            : 'bg-burgundy-danger/10 border-burgundy-danger/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {isPositiveEV ? (
              <CheckCircle className="w-4 h-4 text-emerald-success" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-burgundy-danger" />
            )}
            <span className="text-sm font-semibold uppercase tracking-wider">Expected Value</span>
          </div>
          <div className={`text-2xl font-bold ${
            isPositiveEV ? 'text-emerald-success' : 'text-burgundy-danger'
          }`}>
            {isPositiveEV ? '+' : ''}${calculation.expectedValue.toFixed(2)}
          </div>
          <div className="text-xs text-platinum-dark">
            {isPositiveEV ? 'Favorable' : 'Unfavorable'} risk-adjusted expected return
          </div>
        </div>
      </motion.div>

      {/* Detailed Breakdown Toggle */}
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-glass-bg border border-platinum/20 hover:border-luxury/30 hover:bg-luxury/5 text-platinum hover:text-luxury transition-all duration-300"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Info className="w-4 h-4" />
        <span className="font-medium">
          {showDetails ? 'Hide' : 'Show'} Detailed Breakdown
        </span>
      </motion.button>

      {/* Detailed Breakdown */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-xl bg-glass-bg border border-platinum/20 space-y-4">
              <h4 className="text-lg font-bold text-executive mb-4">Scenario Analysis</h4>
              
              {/* Win Scenario */}
              <div className="p-4 rounded-xl bg-emerald-success/10 border border-emerald-success/30">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-success" />
                  <span className="font-semibold text-emerald-success">Win Scenario ({marketOdds}% odds)</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-platinum-dark">Net Stake:</span>
                    <div className="font-bold text-executive">${calculation.netStake.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-platinum-dark">Potential Win:</span>
                    <div className="font-bold text-emerald-success">+${calculation.potentialWin.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Loss Scenario */}
              <div className="p-4 rounded-xl bg-burgundy-danger/10 border border-burgundy-danger/30">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4 text-burgundy-danger" />
                  <span className="font-semibold text-burgundy-danger">Loss Scenario ({(100 - marketOdds).toFixed(1)}% odds)</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-platinum-dark">Total Loss:</span>
                    <div className="font-bold text-burgundy-danger">${calculation.potentialLoss.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-platinum-dark">Protected:</span>
                    <div className="font-bold text-luxury">${calculation.protectedAmount.toFixed(2)}</div>
                  </div>
                  <div>
                    <span className="text-platinum-dark">Net Loss:</span>
                    <div className="font-bold text-executive">${calculation.protectedLoss.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Break-even Analysis */}
              <div className="p-4 rounded-xl bg-sapphire-info/10 border border-sapphire-info/30">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-sapphire-info" />
                  <span className="font-semibold text-sapphire-info">Break-even Analysis</span>
                </div>
                <div className="text-sm">
                  <span className="text-platinum-dark">Break-even odds: </span>
                  <span className="font-bold text-sapphire-info">
                    {calculation.breakEvenOdds.toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-platinum-dark mt-1">
                  You need {calculation.breakEvenOdds.toFixed(1)}% win probability to break even with Shield protection
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}