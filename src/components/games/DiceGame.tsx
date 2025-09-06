'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6,
  Shield, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Percent,
  Trophy,
  Zap,
  ChevronUp,
  ChevronDown,
  Activity,
  Crown
} from 'lucide-react';

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export function DiceGame() {
  const [rollUnder, setRollUnder] = useState(50);
  const [betAmount, setBetAmount] = useState('10');
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [winStreak, setWinStreak] = useState(0);
  const [shieldEnabled, setShieldEnabled] = useState(false);
  const [shieldPercentage, setShieldPercentage] = useState(10);
  const [gameHistory, setGameHistory] = useState<Array<{
    roll: number;
    target: number;
    won: boolean;
    amount: number;
  }>>([]);
  const [diceValue, setDiceValue] = useState(1);
  const [showResult, setShowResult] = useState(false);

  // Calculate win chance and multiplier
  const winChance = rollUnder;
  const houseEdge = 1;
  const multiplier = ((100 - houseEdge) / winChance).toFixed(2);
  const potentialWin = (parseFloat(betAmount || '0') * parseFloat(multiplier)).toFixed(2);

  const handleRoll = () => {
    if (isRolling || !betAmount) return;
    
    setIsRolling(true);
    setShowResult(false);
    
    // Animate dice rolling
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    setTimeout(() => {
      clearInterval(rollInterval);
      const roll = Math.floor(Math.random() * 100) + 1;
      const won = roll < rollUnder;
      
      setLastRoll(roll);
      setDiceValue(Math.ceil(roll / 16.67)); // Convert to 1-6 range
      setShowResult(true);
      
      if (won) {
        setWinStreak(prev => prev + 1);
      } else {
        setWinStreak(0);
      }
      
      setGameHistory(prev => [{
        roll,
        target: rollUnder,
        won,
        amount: parseFloat(betAmount)
      }, ...prev.slice(0, 9)]);
      
      setIsRolling(false);
    }, 2000);
  };

  const DiceIcon = diceIcons[diceValue - 1];

  return (
    <div className="glass-executive rounded-3xl p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: isRolling ? 360 : 0 }}
            transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-luxury via-champagne-gold to-luxury 
              flex items-center justify-center shadow-2xl shadow-luxury/30"
          >
            <Dice1 className="w-8 h-8 text-vaultor-dark" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white">Luxury Dice</h2>
            <p className="text-platinum-dark">Roll under your target for instant wins</p>
          </div>
        </div>
        
        {/* Win Streak */}
        {winStreak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-3 glass-light px-6 py-3 rounded-2xl border border-luxury/30"
          >
            <Trophy className="w-5 h-5 text-luxury" />
            <span className="text-white font-bold">{winStreak} Win Streak!</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Game Area */}
        <div className="space-y-6">
          {/* Dice Display */}
          <motion.div className="glass-light rounded-3xl p-12 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-luxury/10 via-transparent to-emerald/10 animate-pulse" />
            
            {/* Dice */}
            <motion.div
              animate={{ 
                rotate: isRolling ? [0, 360] : 0,
                scale: isRolling ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                duration: isRolling ? 0.5 : 0.3,
                repeat: isRolling ? Infinity : 0
              }}
              className="relative z-10 flex items-center justify-center"
            >
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-luxury via-champagne-gold to-luxury shadow-2xl shadow-luxury/50 flex items-center justify-center relative">
                <DiceIcon className="w-20 h-20 text-vaultor-dark" />
                
                {/* Sparkle Effects */}
                {isRolling && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-luxury rounded-full"
                        animate={{
                          x: [0, (Math.random() - 0.5) * 200],
                          y: [0, (Math.random() - 0.5) * 200],
                          opacity: [1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            </motion.div>
            
            {/* Result Display */}
            <AnimatePresence>
              {showResult && lastRoll !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 text-center"
                >
                  <div className="text-6xl font-bold mb-2">
                    <span className={lastRoll < rollUnder ? 'text-emerald' : 'text-rose-400'}>
                      {lastRoll}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${lastRoll < rollUnder ? 'text-emerald' : 'text-rose-400'}`}>
                    {lastRoll < rollUnder ? 'YOU WIN!' : 'TRY AGAIN'}
                  </div>
                  {lastRoll < rollUnder && (
                    <div className="text-luxury text-xl mt-2">
                      +${potentialWin}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Roll Under Slider */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-luxury" />
                <span className="text-white font-semibold">Roll Under</span>
              </div>
              <div className="text-3xl font-bold text-luxury">{rollUnder}</div>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min="2"
                max="98"
                value={rollUnder}
                onChange={(e) => setRollUnder(parseInt(e.target.value))}
                className="w-full h-3 bg-glass-bg rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${rollUnder}%, rgba(255,255,255,0.1) ${rollUnder}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <div className="flex justify-between mt-2 text-xs text-platinum-dark">
                <span>2</span>
                <span>50</span>
                <span>98</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-platinum-dark text-sm">Win Chance</div>
                <div className="text-emerald text-2xl font-bold">{winChance}%</div>
              </div>
              <div className="text-center">
                <div className="text-platinum-dark text-sm">Multiplier</div>
                <div className="text-luxury text-2xl font-bold">{multiplier}x</div>
              </div>
            </div>
          </div>

          {/* Bet Controls */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-semibold">Bet Amount</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-luxury" />
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-glass-bg rounded-lg px-4 py-2 text-white text-xl font-bold w-32 text-right border border-executive/20 focus:border-luxury/50 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {['10', '50', '100', '500'].map(amount => (
                <motion.button
                  key={amount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBetAmount(amount)}
                  className="py-2 rounded-lg bg-glass-bg hover:bg-luxury/20 text-white font-medium 
                    border border-executive/20 hover:border-luxury/30 transition-all"
                >
                  ${amount}
                </motion.button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBetAmount((prev) => (parseFloat(prev) / 2).toString())}
                className="flex-1 py-2 rounded-lg bg-glass-bg hover:bg-rose-500/20 text-white font-medium 
                  border border-executive/20 hover:border-rose-500/30 transition-all"
              >
                ½
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBetAmount((prev) => (parseFloat(prev) * 2).toString())}
                className="flex-1 py-2 rounded-lg bg-glass-bg hover:bg-emerald/20 text-white font-medium 
                  border border-executive/20 hover:border-emerald/30 transition-all"
              >
                2×
              </motion.button>
            </div>
          </div>

          {/* Shield Protection */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-luxury" />
                <span className="text-white font-semibold">Shield Protection</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shieldEnabled}
                  onChange={(e) => setShieldEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-glass-bg rounded-full peer peer-checked:bg-luxury 
                  peer-checked:after:translate-x-full after:content-[\'\'] after:absolute after:top-[2px] 
                  after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
            
            {shieldEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-3"
              >
                <div className="flex gap-2">
                  {[10, 20, 30].map(percent => (
                    <motion.button
                      key={percent}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShieldPercentage(percent)}
                      className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                        shieldPercentage === percent
                          ? 'bg-luxury text-vaultor-dark'
                          : 'bg-glass-bg text-white hover:bg-luxury/20 border border-executive/20'
                      }`}
                    >
                      {percent}%
                    </motion.button>
                  ))}
                </div>
                <div className="text-center text-platinum-dark text-sm">
                  Recover {shieldPercentage}% of losses • Cost: {(parseFloat(betAmount) * 0.05).toFixed(2)}
                </div>
              </motion.div>
            )}
          </div>

          {/* Roll Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRoll}
            disabled={isRolling || !betAmount}
            className={`w-full py-6 rounded-3xl font-bold text-xl transition-all duration-300 
              flex items-center justify-center gap-3 relative overflow-hidden ${
              isRolling || !betAmount
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-luxury via-champagne-gold to-luxury text-vaultor-dark shadow-2xl shadow-luxury/30 hover:shadow-luxury/50'
            }`}
          >
            {/* Shine Effect */}
            {!isRolling && betAmount && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                translate-x-[-100%] animate-shine" />
            )}
            
            <Zap className="w-6 h-6" />
            <span>{isRolling ? 'Rolling...' : `Roll to Win $${potentialWin}`}</span>
          </motion.button>
        </div>

        {/* Stats & History */}
        <div className="space-y-6">
          {/* Live Stats */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-emerald" />
              <span className="text-white font-semibold">Live Statistics</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-bg rounded-xl p-4">
                <div className="text-platinum-dark text-sm mb-1">House Edge</div>
                <div className="text-2xl font-bold text-white">1%</div>
              </div>
              <div className="glass-bg rounded-xl p-4">
                <div className="text-platinum-dark text-sm mb-1">Total Wagered</div>
                <div className="text-2xl font-bold text-luxury">$385K</div>
              </div>
              <div className="glass-bg rounded-xl p-4">
                <div className="text-platinum-dark text-sm mb-1">Players Online</div>
                <div className="text-2xl font-bold text-emerald">187</div>
              </div>
              <div className="glass-bg rounded-xl p-4">
                <div className="text-platinum-dark text-sm mb-1">Biggest Win</div>
                <div className="text-2xl font-bold text-purple-400">$12.5K</div>
              </div>
            </div>
          </div>

          {/* Game History */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-5 h-5 text-luxury" />
              <span className="text-white font-semibold">Your History</span>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {gameHistory.length === 0 ? (
                <div className="text-center text-platinum-dark py-8">
                  No games played yet. Roll the dice to start!
                </div>
              ) : (
                gameHistory.map((game, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      game.won ? 'bg-emerald/10 border border-emerald/20' : 'bg-rose-500/10 border border-rose-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${game.won ? 'bg-emerald' : 'bg-rose-400'}`} />
                      <span className="text-white font-medium">
                        Rolled {game.roll} / Target {game.target}
                      </span>
                    </div>
                    <span className={`font-bold ${game.won ? 'text-emerald' : 'text-rose-400'}`}>
                      {game.won ? '+' : '-'}${game.amount}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* VIP Features */}
          <div className="glass-executive rounded-2xl p-6 border border-luxury/30">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-5 h-5 text-luxury" />
              <span className="text-luxury font-semibold">VIP Features</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-platinum">Rakeback</span>
                <span className="text-emerald font-bold">5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-platinum">Level Rewards</span>
                <span className="text-luxury font-bold">2x Points</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-platinum">Weekly Bonus</span>
                <span className="text-purple-400 font-bold">$500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #D4AF37, #F7E7A3);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #D4AF37, #F7E7A3);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
          border: none;
        }
        
        @keyframes shine {
          to {
            transform: translateX(100%);
          }
        }
        
        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </div>
  );
}