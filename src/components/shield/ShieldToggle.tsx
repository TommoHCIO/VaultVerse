'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Info, DollarSign, TrendingDown, Lock } from 'lucide-react';

export interface ShieldToggleProps {
  onToggle?: (enabled: boolean, level: number) => void;
  defaultEnabled?: boolean;
  defaultLevel?: number;
  className?: string;
  stakeAmount?: number;
}

const protectionLevels = [
  { level: 10, fee: 2.5, description: 'Basic Protection' },
  { level: 20, fee: 4.0, description: 'Enhanced Shield' },
  { level: 30, fee: 6.5, description: 'Maximum Coverage' }
];

export function ShieldToggle({ 
  onToggle, 
  defaultEnabled = false, 
  defaultLevel = 20, 
  className = '',
  stakeAmount = 0
}: ShieldToggleProps) {
  const [isEnabled, setIsEnabled] = useState(defaultEnabled);
  const [selectedLevel, setSelectedLevel] = useState(defaultLevel);
  const [showDetails, setShowDetails] = useState(false);

  const handleToggle = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (onToggle) {
      onToggle(enabled, selectedLevel);
    }
  };

  const handleLevelChange = (level: number) => {
    setSelectedLevel(level);
    if (onToggle && isEnabled) {
      onToggle(isEnabled, level);
    }
  };

  const selectedProtection = protectionLevels.find(p => p.level === selectedLevel);
  const protectionAmount = stakeAmount * (selectedLevel / 100);
  const feeAmount = stakeAmount * (selectedProtection?.fee || 0) / 100;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              isEnabled 
                ? 'bg-luxury/20 border border-luxury/50 shadow-lg shadow-luxury/25' 
                : 'bg-platinum/10 border border-platinum/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className={`w-6 h-6 ${isEnabled ? 'text-luxury' : 'text-platinum'}`} />
            {isEnabled && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-luxury/20"
                animate={{ 
                  boxShadow: [
                    "0 0 0 rgba(255, 215, 0, 0.4)",
                    "0 0 20px rgba(255, 215, 0, 0.6)",
                    "0 0 0 rgba(255, 215, 0, 0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          <div>
            <h3 className="text-lg font-bold text-executive">Shield Protection</h3>
            <p className="text-sm text-platinum-dark">
              {isEnabled ? `${selectedLevel}% loss protection active` : 'Protect your investment from losses'}
            </p>
          </div>
        </div>

        <motion.button
          onClick={() => handleToggle(!isEnabled)}
          className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
            isEnabled ? 'bg-luxury' : 'bg-platinum/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={`absolute top-1 w-6 h-6 rounded-full shadow-lg transition-all duration-300 ${
              isEnabled ? 'bg-deep-navy right-1' : 'bg-white left-1'
            }`}
            animate={{ x: isEnabled ? 0 : 0 }}
          />
        </motion.button>
      </div>

      {/* Protection Levels */}
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-xl bg-glass-bg border border-luxury/20 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-luxury" />
                <span className="text-sm font-semibold text-luxury uppercase tracking-wider">
                  Select Protection Level
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {protectionLevels.map((protection) => (
                  <motion.button
                    key={protection.level}
                    onClick={() => handleLevelChange(protection.level)}
                    className={`p-4 rounded-xl transition-all duration-300 ${
                      selectedLevel === protection.level
                        ? 'bg-luxury/20 border-2 border-luxury/50 shadow-lg shadow-luxury/20'
                        : 'bg-platinum/5 border border-platinum/20 hover:bg-luxury/10 hover:border-luxury/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`text-2xl font-bold mb-1 ${
                      selectedLevel === protection.level ? 'text-luxury' : 'text-executive'
                    }`}>
                      {protection.level}%
                    </div>
                    <div className="text-xs text-platinum-dark mb-1">
                      {protection.description}
                    </div>
                    <div className="text-xs text-platinum-dark">
                      {protection.fee}% fee
                    </div>
                    
                    {selectedLevel === protection.level && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-luxury/50"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Protection Summary */}
              {stakeAmount > 0 && (
                <div className="p-4 rounded-xl bg-luxury/10 border border-luxury/30">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-platinum-dark mb-1">
                        <DollarSign className="w-3 h-3" />
                        <span>Protected Amount</span>
                      </div>
                      <div className="text-lg font-bold text-luxury">
                        ${protectionAmount.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-platinum-dark mb-1">
                        <TrendingDown className="w-3 h-3" />
                        <span>Protection Fee</span>
                      </div>
                      <div className="text-lg font-bold text-executive">
                        ${feeAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Toggle */}
              <motion.button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-4 flex items-center gap-2 text-sm text-platinum-dark hover:text-luxury transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <Info className="w-4 h-4" />
                <span>{showDetails ? 'Hide' : 'Show'} Protection Details</span>
              </motion.button>

              {/* Detailed Information */}
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
                      <h4 className="text-sm font-semibold text-executive mb-2">How Shield Protection Works:</h4>
                      <ul className="text-xs text-platinum-dark space-y-1">
                        <li>• Shield protects up to {selectedLevel}% of your stake on losing positions</li>
                        <li>• Protection is funded by the risk pool and insurance reserves</li>
                        <li>• Fee is calculated based on market volatility and risk assessment</li>
                        <li>• Refunds are processed automatically upon market resolution</li>
                        <li>• V1 token holders receive discounted protection fees</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}