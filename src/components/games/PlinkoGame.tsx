'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Circle,
  DollarSign,
  Shield,
  Trophy,
  Zap,
  Activity,
  Crown,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface Ball {
  id: number;
  x: number;
  y: number;
  path: number[];
  finalSlot: number;
  multiplier: number;
}

export function PlinkoGame() {
  const [betAmount, setBetAmount] = useState('10');
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [rows, setRows] = useState(12);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [isDropping, setIsDropping] = useState(false);
  const [autoDrop, setAutoDrop] = useState(false);
  const [dropCount, setDropCount] = useState(1);
  const [shieldEnabled, setShieldEnabled] = useState(false);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [gameHistory, setGameHistory] = useState<Array<{
    slot: number;
    multiplier: number;
    amount: number;
  }>>([]);
  const ballIdRef = useRef(0);

  // Multiplier configurations based on risk level
  const getMultipliers = () => {
    const configs = {
      low: {
        12: [5.6, 2.1, 1.1, 1, 0.5, 1, 0.5, 1, 1.1, 2.1, 5.6],
        14: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
        16: [16, 4, 1.9, 1.4, 1.1, 1, 0.5, 1, 0.5, 1, 1.1, 1.4, 1.9, 4, 16]
      },
      medium: {
        12: [13, 3, 1.3, 0.7, 0.4, 0.2, 0.4, 0.7, 1.3, 3, 13],
        14: [18, 4, 1.9, 1.3, 0.7, 0.2, 0.2, 0.2, 0.7, 1.3, 1.9, 4, 18],
        16: [35, 7, 2, 1.5, 1, 0.3, 0.2, 0.2, 0.2, 0.3, 1, 1.5, 2, 7, 35]
      },
      high: {
        12: [29, 4, 1.5, 0.3, 0.2, 0.2, 0.2, 0.3, 1.5, 4, 29],
        14: [43, 7, 2, 0.6, 0.2, 0.2, 0.2, 0.2, 0.2, 0.6, 2, 7, 43],
        16: [110, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 110]
      }
    };
    
    return configs[risk][rows as keyof typeof configs.low] || configs[risk][12];
  };

  const multipliers = getMultipliers();

  // Simulate ball physics
  const simulateBallPath = () => {
    const path = [];
    let position = 0;
    
    for (let i = 0; i < rows; i++) {
      // Random bounce left (-1) or right (1)
      const direction = Math.random() < 0.5 ? -1 : 1;
      position += direction;
      path.push(direction);
    }
    
    // Normalize position to slot index
    const slots = multipliers.length;
    const finalSlot = Math.max(0, Math.min(slots - 1, Math.floor((position + rows) / 2)));
    
    return { path, finalSlot };
  };

  // Drop a ball
  const dropBall = () => {
    if (!betAmount) return;
    
    setIsDropping(true);
    const { path, finalSlot } = simulateBallPath();
    const multiplier = multipliers[finalSlot];
    const winAmount = parseFloat(betAmount) * multiplier;
    
    const newBall: Ball = {
      id: ballIdRef.current++,
      x: 0,
      y: 0,
      path,
      finalSlot,
      multiplier
    };
    
    setBalls(prev => [...prev, newBall]);
    
    // Animate and remove ball after animation
    setTimeout(() => {
      setTotalWinnings(prev => prev + winAmount);
      setGameHistory(prev => [{
        slot: finalSlot,
        multiplier,
        amount: winAmount
      }, ...prev.slice(0, 9)]);
      
      setBalls(prev => prev.filter(b => b.id !== newBall.id));
      setIsDropping(false);
    }, 2000);
  };

  // Handle multiple drops
  const handleMultipleDrop = () => {
    for (let i = 0; i < dropCount; i++) {
      setTimeout(() => {
        dropBall();
      }, i * 300);
    }
  };

  // Auto drop effect
  useEffect(() => {
    if (autoDrop && !isDropping) {
      const timer = setTimeout(() => {
        dropBall();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoDrop, isDropping, balls]);

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier >= 10) return 'bg-luxury text-vaultor-dark';
    if (multiplier >= 5) return 'bg-purple-500 text-white';
    if (multiplier >= 2) return 'bg-emerald text-white';
    if (multiplier >= 1) return 'bg-blue-500 text-white';
    if (multiplier >= 0.5) return 'bg-gray-600 text-white';
    return 'bg-rose-500 text-white';
  };

  return (
    <div className="glass-executive rounded-3xl p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: isDropping ? 360 : 0 }}
            transition={{ duration: 2, repeat: isDropping ? Infinity : 0, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-purple-400 to-purple-600 
              flex items-center justify-center shadow-2xl shadow-purple-500/30"
          >
            <Circle className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white">Plinko Drop</h2>
            <p className="text-platinum-dark">Drop balls and watch them bounce to riches!</p>
          </div>
        </div>
        
        {/* Total Winnings */}
        {totalWinnings > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-3 glass-light px-6 py-3 rounded-2xl border border-luxury/30"
          >
            <Trophy className="w-5 h-5 text-luxury" />
            <span className="text-white font-bold">Total: ${totalWinnings.toFixed(2)}</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Plinko Board - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Board */}
          <div className="glass-light rounded-3xl p-8 relative">
            {/* Plinko Pegs Visualization */}
            <div className="relative h-[500px] flex flex-col justify-between">
              {/* Drop Zone */}
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-luxury to-champagne-gold 
                    shadow-lg shadow-luxury/50 flex items-center justify-center"
                >
                  <ChevronDown className="w-6 h-6 text-vaultor-dark" />
                </motion.div>
              </div>

              {/* Pegs Grid */}
              <div className="flex-1 relative">
                {[...Array(rows)].map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="absolute w-full flex justify-center gap-4"
                    style={{
                      top: `${(rowIndex / rows) * 100}%`,
                      paddingLeft: `${(rows - rowIndex) * 10}px`,
                      paddingRight: `${(rows - rowIndex) * 10}px`
                    }}
                  >
                    {[...Array(rowIndex + 3)].map((_, pegIndex) => (
                      <div
                        key={pegIndex}
                        className="w-2 h-2 rounded-full bg-gray-600 shadow-sm"
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Slots */}
              <div className="flex justify-center gap-1 mt-4">
                {multipliers.map((multiplier, index) => (
                  <div
                    key={index}
                    className={`
                      px-2 py-3 rounded-lg text-xs font-bold text-center
                      ${getMultiplierColor(multiplier)}
                      ${index === Math.floor(multipliers.length / 2) ? 'ring-2 ring-luxury' : ''}
                    `}
                    style={{ minWidth: '40px' }}
                  >
                    {multiplier}x
                  </div>
                ))}
              </div>

              {/* Falling Balls */}
              <AnimatePresence>
                {balls.map(ball => (
                  <motion.div
                    key={ball.id}
                    className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-luxury to-champagne-gold 
                      shadow-lg shadow-luxury/50"
                    initial={{ top: 0, left: '50%', x: '-50%' }}
                    animate={{
                      top: '90%',
                      left: `${50 + (ball.finalSlot - multipliers.length / 2) * 8}%`
                    }}
                    transition={{
                      duration: 2,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <Sparkles className="w-full h-full text-vaultor-dark p-1" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Game Controls */}
          <div className="glass-light rounded-2xl p-6 space-y-4">
            {/* Settings Row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Risk Level */}
              <div>
                <label className="text-platinum text-sm mb-2 block">Risk Level</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['low', 'medium', 'high'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setRisk(level)}
                      className={`py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        risk === level
                          ? level === 'low' ? 'bg-emerald text-white' :
                            level === 'medium' ? 'bg-yellow-500 text-white' :
                            'bg-rose-500 text-white'
                          : 'bg-glass-bg text-white hover:bg-white/10 border border-executive/20'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div>
                <label className="text-platinum text-sm mb-2 block">Rows</label>
                <div className="grid grid-cols-3 gap-1">
                  {[12, 14, 16].map(rowCount => (
                    <button
                      key={rowCount}
                      onClick={() => setRows(rowCount)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        rows === rowCount
                          ? 'bg-purple-500 text-white'
                          : 'bg-glass-bg text-white hover:bg-white/10 border border-executive/20'
                      }`}
                    >
                      {rowCount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop Count */}
              <div>
                <label className="text-platinum text-sm mb-2 block">Balls</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDropCount(Math.max(1, dropCount - 1))}
                    className="w-8 h-8 rounded-lg bg-glass-bg hover:bg-rose-500/20 text-white 
                      border border-executive/20 hover:border-rose-500/30 transition-all"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center text-white font-bold text-lg">{dropCount}</div>
                  <button
                    onClick={() => setDropCount(Math.min(10, dropCount + 1))}
                    className="w-8 h-8 rounded-lg bg-glass-bg hover:bg-emerald/20 text-white 
                      border border-executive/20 hover:border-emerald/30 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bet Amount */}
            <div>
              <label className="text-platinum text-sm mb-2 block">Bet Amount per Ball</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-luxury" />
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="w-full bg-glass-bg rounded-lg pl-10 pr-4 py-3 text-white font-bold 
                    border border-executive/20 focus:border-luxury/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMultipleDrop}
                disabled={isDropping || !betAmount}
                className={`py-4 rounded-2xl font-bold text-lg transition-all duration-300 
                  flex items-center justify-center gap-3 ${
                  isDropping || !betAmount
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                }`}
              >
                <Circle className="w-5 h-5" />
                Drop {dropCount > 1 ? `${dropCount} Balls` : 'Ball'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAutoDrop(!autoDrop)}
                className={`py-4 rounded-2xl font-bold text-lg transition-all duration-300 
                  flex items-center justify-center gap-3 ${
                  autoDrop
                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                }`}
              >
                <Zap className="w-5 h-5" />
                {autoDrop ? 'Stop Auto' : 'Auto Drop'}
              </motion.button>
            </div>

            {/* Shield Protection */}
            <div className="flex items-center justify-between p-3 glass-bg rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-luxury" />
                <span className="text-white">Shield Protection</span>
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
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Payout Info */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-emerald" />
              <span className="text-white font-semibold">Payout Info</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-platinum">Max Win</span>
                <span className="text-luxury font-bold">{Math.max(...multipliers)}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-platinum">Min Win</span>
                <span className="text-rose-400 font-bold">{Math.min(...multipliers)}x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-platinum">House Edge</span>
                <span className="text-white font-bold">2.5%</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 glass-bg rounded-lg">
              <div className="text-xs text-platinum mb-2">Risk/Reward</div>
              <div className="flex items-center gap-2">
                <div className={`h-2 rounded-full flex-1 ${
                  risk === 'low' ? 'bg-emerald' :
                  risk === 'medium' ? 'bg-yellow-500' :
                  'bg-rose-500'
                }`} />
              </div>
              <div className="text-xs text-platinum mt-1 text-center capitalize">{risk} Risk</div>
            </div>
          </div>

          {/* Recent Drops */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-5 h-5 text-luxury" />
              <span className="text-white font-semibold">Recent Drops</span>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {gameHistory.length === 0 ? (
                <div className="text-center text-platinum-dark py-4">
                  No drops yet. Start playing!
                </div>
              ) : (
                gameHistory.map((drop, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-2 glass-bg rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${getMultiplierColor(drop.multiplier)}`} />
                      <span className="text-white text-sm">Slot {drop.slot + 1}</span>
                    </div>
                    <span className={`font-bold ${
                      drop.multiplier >= 1 ? 'text-emerald' : 'text-rose-400'
                    }`}>
                      ${drop.amount.toFixed(2)}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="glass-executive rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold">Statistics</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-platinum">Total Dropped</span>
                <span className="text-white font-bold">{gameHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-platinum">Best Win</span>
                <span className="text-luxury font-bold">
                  ${Math.max(...gameHistory.map(g => g.amount), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-platinum">Average Multi</span>
                <span className="text-emerald font-bold">
                  {gameHistory.length > 0
                    ? (gameHistory.reduce((sum, g) => sum + g.multiplier, 0) / gameHistory.length).toFixed(2)
                    : '0.00'}x
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}