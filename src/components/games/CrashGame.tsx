'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp,
  Rocket,
  DollarSign,
  Users,
  Activity,
  Shield,
  Trophy,
  Zap,
  AlertTriangle,
  Crown,
  Timer
} from 'lucide-react';

export function CrashGame() {
  const [betAmount, setBetAmount] = useState('10');
  const [autoCashout, setAutoCashout] = useState('2.00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasBet, setHasBet] = useState(false);
  const [hasCashedOut, setHasCashedOut] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<number[]>([2.34, 1.45, 5.67, 1.12, 3.45, 2.89, 1.98, 4.32]);
  const [activePlayers, setActivePlayers] = useState(234);
  const [shieldEnabled, setShieldEnabled] = useState(false);
  const multiplierRef = useRef(1.00);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Generate crash point (provably fair in real implementation)
  const generateCrashPoint = () => {
    const random = Math.random();
    if (random < 0.1) return 1.00; // 10% chance to crash immediately
    return Math.floor((1 / (1 - random)) * 100) / 100;
  };

  // Start game
  const startGame = () => {
    if (!isPlaying) {
      const newCrashPoint = generateCrashPoint();
      setCrashPoint(newCrashPoint);
      setIsPlaying(true);
      setHasCashedOut(false);
      setCurrentMultiplier(1.00);
      multiplierRef.current = 1.00;
      startTimeRef.current = Date.now();
      
      // Start animation
      const animate = () => {
        const elapsed = Date.now() - startTimeRef.current!;
        const newMultiplier = 1 + (elapsed / 1000) * 0.1; // Increase by 0.1x per second
        
        if (newMultiplier >= newCrashPoint) {
          // Crash!
          setCurrentMultiplier(newCrashPoint);
          setIsPlaying(false);
          setGameHistory(prev => [newCrashPoint, ...prev.slice(0, 7)]);
          
          // Reset for next round
          setTimeout(() => {
            setHasBet(false);
            setCurrentMultiplier(1.00);
            setCrashPoint(null);
          }, 3000);
        } else {
          setCurrentMultiplier(Math.floor(newMultiplier * 100) / 100);
          multiplierRef.current = newMultiplier;
          
          // Auto cashout check
          if (hasBet && !hasCashedOut && newMultiplier >= parseFloat(autoCashout)) {
            handleCashout();
          } else {
            animationRef.current = requestAnimationFrame(animate);
          }
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Place bet
  const handleBet = () => {
    if (!betAmount || isPlaying) return;
    setHasBet(true);
    if (!isPlaying) {
      startGame();
    }
  };

  // Cash out
  const handleCashout = () => {
    if (!hasBet || hasCashedOut || !isPlaying) return;
    setHasCashedOut(true);
    const winAmount = parseFloat(betAmount) * multiplierRef.current;
    console.log(`Cashed out at ${multiplierRef.current.toFixed(2)}x for $${winAmount.toFixed(2)}`);
  };

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Auto-start new rounds
  useEffect(() => {
    if (!isPlaying && !hasBet) {
      const timer = setTimeout(() => {
        startGame();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, hasBet]);

  const getCrashColor = (multiplier: number) => {
    if (multiplier < 1.5) return 'text-rose-400';
    if (multiplier < 2) return 'text-orange-400';
    if (multiplier < 3) return 'text-yellow-400';
    if (multiplier < 5) return 'text-emerald';
    return 'text-luxury';
  };

  return (
    <div className="glass-executive rounded-3xl p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ y: isPlaying ? [0, -5, 0] : 0 }}
            transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 
              flex items-center justify-center shadow-2xl shadow-emerald-500/30"
          >
            <Rocket className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white">Rocket Crash</h2>
            <p className="text-platinum-dark">Cash out before the rocket crashes!</p>
          </div>
        </div>
        
        {/* Live Players */}
        <div className="flex items-center gap-3 glass-light px-6 py-3 rounded-2xl">
          <Users className="w-5 h-5 text-emerald" />
          <span className="text-white font-bold">{activePlayers} Playing</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Display - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Crash Display */}
          <div className="glass-light rounded-3xl p-8 relative overflow-hidden h-96">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }} />
            </div>

            {/* Multiplier Display */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="playing"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className={`text-8xl font-bold ${getCrashColor(currentMultiplier)}`}
                    >
                      {currentMultiplier.toFixed(2)}x
                    </motion.div>
                    {hasBet && !hasCashedOut && (
                      <div className="text-2xl text-emerald mt-4">
                        Potential Win: ${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}
                      </div>
                    )}
                    {hasCashedOut && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-2xl text-luxury mt-4 font-bold"
                      >
                        CASHED OUT! +${(parseFloat(betAmount) * currentMultiplier).toFixed(2)}
                      </motion.div>
                    )}
                  </motion.div>
                ) : crashPoint ? (
                  <motion.div
                    key="crashed"
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <AlertTriangle className="w-24 h-24 text-rose-400 mx-auto mb-4" />
                    <div className="text-6xl font-bold text-rose-400">
                      CRASHED at {crashPoint.toFixed(2)}x
                    </div>
                    {hasBet && !hasCashedOut && (
                      <div className="text-xl text-rose-400 mt-4">
                        Lost ${betAmount}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <Timer className="w-16 h-16 text-platinum mx-auto mb-4" />
                    <div className="text-3xl text-platinum">
                      Starting in...
                    </div>
                    <motion.div
                      animate={{ scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-6xl font-bold text-luxury mt-4"
                    >
                      Place Your Bet!
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rocket Animation */}
            {isPlaying && (
              <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                animate={{ 
                  y: [-100, -200, -100],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Rocket className="w-12 h-12 text-emerald" />
                {/* Exhaust flames */}
                <motion.div
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 0.2,
                    repeat: Infinity
                  }}
                >
                  <div className="w-4 h-8 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-500 rounded-full blur-sm" />
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Bet Controls */}
          <div className="glass-light rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Bet Amount */}
              <div>
                <label className="text-platinum text-sm mb-2 block">Bet Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-luxury" />
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    disabled={hasBet}
                    className="w-full bg-glass-bg rounded-lg pl-10 pr-4 py-3 text-white font-bold 
                      border border-executive/20 focus:border-luxury/50 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {['10', '50', '100', '500'].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      disabled={hasBet}
                      className="py-1 rounded-lg bg-glass-bg hover:bg-luxury/20 text-white text-sm 
                        border border-executive/20 hover:border-luxury/30 transition-all disabled:opacity-50"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Cashout */}
              <div>
                <label className="text-platinum text-sm mb-2 block">Auto Cashout</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald" />
                  <input
                    type="number"
                    value={autoCashout}
                    onChange={(e) => setAutoCashout(e.target.value)}
                    step="0.1"
                    min="1.01"
                    disabled={hasBet}
                    className="w-full bg-glass-bg rounded-lg pl-10 pr-4 py-3 text-white font-bold 
                      border border-executive/20 focus:border-emerald/50 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {['1.5', '2', '5', '10'].map(multi => (
                    <button
                      key={multi}
                      onClick={() => setAutoCashout(multi)}
                      disabled={hasBet}
                      className="py-1 rounded-lg bg-glass-bg hover:bg-emerald/20 text-white text-sm 
                        border border-executive/20 hover:border-emerald/30 transition-all disabled:opacity-50"
                    >
                      {multi}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Shield Protection */}
            <div className="flex items-center justify-between mt-4 p-3 glass-bg rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-luxury" />
                <span className="text-white">Shield Protection (10% loss recovery)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shieldEnabled}
                  onChange={(e) => setShieldEnabled(e.target.checked)}
                  disabled={hasBet}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-glass-bg rounded-full peer peer-checked:bg-luxury 
                  peer-checked:after:translate-x-full after:content-[\'\'] after:absolute after:top-[2px] 
                  after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBet}
                disabled={hasBet || !betAmount}
                className={`py-4 rounded-2xl font-bold text-lg transition-all duration-300 
                  flex items-center justify-center gap-3 ${
                  hasBet || !betAmount
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                Place Bet
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCashout}
                disabled={!hasBet || hasCashedOut || !isPlaying}
                className={`py-4 rounded-2xl font-bold text-lg transition-all duration-300 
                  flex items-center justify-center gap-3 ${
                  !hasBet || hasCashedOut || !isPlaying
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-luxury to-champagne-gold text-vaultor-dark shadow-lg shadow-luxury/30 hover:shadow-luxury/50'
                }`}
              >
                <Zap className="w-5 h-5" />
                Cash Out
              </motion.button>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Game History */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-emerald" />
              <span className="text-white font-semibold">Recent Crashes</span>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {gameHistory.map((crash, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    p-2 rounded-lg text-center font-bold
                    ${crash < 2 ? 'bg-rose-500/20 text-rose-400' : 
                      crash < 5 ? 'bg-emerald/20 text-emerald' : 
                      'bg-luxury/20 text-luxury'}
                  `}
                >
                  {crash.toFixed(2)}x
                </motion.div>
              ))}
            </div>
          </div>

          {/* Live Bets */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold">Live Bets</span>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[
                { player: 'CryptoKing', bet: 500, cashout: 2.34 },
                { player: 'LuckyAce', bet: 100, cashout: null },
                { player: 'MoonShot', bet: 1000, cashout: 1.87 },
                { player: 'DiamondHands', bet: 250, cashout: null },
                { player: 'RocketMan', bet: 50, cashout: 5.43 }
              ].map((bet, index) => (
                <div key={index} className="flex items-center justify-between p-2 glass-bg rounded-lg">
                  <span className="text-platinum text-sm">{bet.player}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">${bet.bet}</span>
                    {bet.cashout ? (
                      <span className="text-emerald text-sm">@{bet.cashout}x</span>
                    ) : (
                      <span className="text-yellow-400 text-sm">betting...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="glass-executive rounded-2xl p-6 border border-luxury/30">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5 text-luxury" />
              <span className="text-luxury font-semibold">Statistics</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-platinum">House Edge</span>
                <span className="text-white font-bold">2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-platinum">Total Volume</span>
                <span className="text-luxury font-bold">$567K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-platinum">Biggest Win</span>
                <span className="text-emerald font-bold">$45.2K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-platinum">Max Multiplier</span>
                <span className="text-purple-400 font-bold">342.56x</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}