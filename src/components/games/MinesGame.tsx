'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bomb,
  Diamond,
  DollarSign,
  Shield,
  Trophy,
  Zap,
  AlertTriangle,
  Crown,
  Activity,
  RefreshCw,
  Lock
} from 'lucide-react';

interface Tile {
  id: number;
  revealed: boolean;
  isMine: boolean;
  isGold: boolean;
}

export function MinesGame() {
  const [gridSize, setGridSize] = useState(5);
  const [minesCount, setMinesCount] = useState(5);
  const [betAmount, setBetAmount] = useState('10');
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [revealedSafe, setRevealedSafe] = useState(0);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [shieldEnabled, setShieldEnabled] = useState(false);
  const [autoReveal, setAutoReveal] = useState(3);
  const [gameHistory, setGameHistory] = useState<Array<{
    tiles: number;
    multiplier: number;
    won: boolean;
    amount: number;
  }>>([]);

  // Initialize game grid
  const initializeGame = () => {
    const totalTiles = gridSize * gridSize;
    const newTiles: Tile[] = [];
    
    // Create all tiles
    for (let i = 0; i < totalTiles; i++) {
      newTiles.push({
        id: i,
        revealed: false,
        isMine: false,
        isGold: false
      });
    }
    
    // Place mines randomly
    const minePositions = new Set<number>();
    while (minePositions.size < minesCount) {
      minePositions.add(Math.floor(Math.random() * totalTiles));
    }
    
    minePositions.forEach(pos => {
      newTiles[pos].isMine = true;
    });
    
    // Mark safe tiles as gold
    newTiles.forEach(tile => {
      if (!tile.isMine) {
        tile.isGold = true;
      }
    });
    
    setTiles(newTiles);
    setRevealedSafe(0);
    setCurrentMultiplier(1.00);
    setGameOver(false);
    setIsPlaying(true);
  };

  // Calculate multiplier based on revealed tiles
  const calculateMultiplier = (revealed: number) => {
    const totalSafe = gridSize * gridSize - minesCount;
    const riskFactor = minesCount / (gridSize * gridSize);
    const baseMultiplier = 1 + (riskFactor * 2);
    return Math.pow(baseMultiplier, revealed);
  };

  // Handle tile click
  const handleTileClick = (tileId: number) => {
    if (!isPlaying || gameOver) return;
    
    const tile = tiles[tileId];
    if (tile.revealed) return;
    
    const newTiles = [...tiles];
    newTiles[tileId].revealed = true;
    
    if (tile.isMine) {
      // Hit a mine - game over
      setGameOver(true);
      setIsPlaying(false);
      
      // Reveal all tiles
      newTiles.forEach(t => {
        t.revealed = true;
      });
      
      setGameHistory(prev => [{
        tiles: revealedSafe,
        multiplier: currentMultiplier,
        won: false,
        amount: parseFloat(betAmount)
      }, ...prev.slice(0, 9)]);
    } else {
      // Found gold
      const newRevealed = revealedSafe + 1;
      const newMultiplier = calculateMultiplier(newRevealed);
      setRevealedSafe(newRevealed);
      setCurrentMultiplier(newMultiplier);
      
      // Check if all safe tiles revealed
      const totalSafe = gridSize * gridSize - minesCount;
      if (newRevealed === totalSafe) {
        setGameOver(true);
        setIsPlaying(false);
        setGameHistory(prev => [{
          tiles: newRevealed,
          multiplier: newMultiplier,
          won: true,
          amount: parseFloat(betAmount) * newMultiplier
        }, ...prev.slice(0, 9)]);
      }
    }
    
    setTiles(newTiles);
  };

  // Cash out
  const handleCashout = () => {
    if (!isPlaying || revealedSafe === 0) return;
    
    setIsPlaying(false);
    setGameOver(true);
    
    // Reveal all tiles
    const newTiles = tiles.map(tile => ({ ...tile, revealed: true }));
    setTiles(newTiles);
    
    setGameHistory(prev => [{
      tiles: revealedSafe,
      multiplier: currentMultiplier,
      won: true,
      amount: parseFloat(betAmount) * currentMultiplier
    }, ...prev.slice(0, 9)]);
  };

  // Auto reveal tiles
  const handleAutoReveal = () => {
    if (!isPlaying || gameOver) return;
    
    const unrevealed = tiles.filter(t => !t.revealed && !t.isMine);
    if (unrevealed.length === 0) return;
    
    const toReveal = Math.min(autoReveal, unrevealed.length);
    const shuffled = unrevealed.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < toReveal; i++) {
      setTimeout(() => {
        handleTileClick(shuffled[i].id);
      }, i * 200);
    }
  };

  const potentialWin = (parseFloat(betAmount || '0') * currentMultiplier).toFixed(2);

  return (
    <div className="glass-executive rounded-3xl p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: gameOver && !tiles.some(t => t.isMine && t.revealed) ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 via-rose-400 to-rose-600 
              flex items-center justify-center shadow-2xl shadow-rose-500/30"
          >
            <Bomb className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-white">Gold Mines</h2>
            <p className="text-platinum-dark">Find gold and avoid the mines!</p>
          </div>
        </div>
        
        {/* Current Multiplier */}
        {isPlaying && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-3 glass-light px-6 py-3 rounded-2xl border border-luxury/30"
          >
            <Diamond className="w-5 h-5 text-luxury" />
            <span className="text-white font-bold text-xl">{currentMultiplier.toFixed(2)}x</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Grid - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Minefield */}
          <div className="glass-light rounded-3xl p-8">
            {!isPlaying && tiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96">
                <Diamond className="w-24 h-24 text-luxury mb-6" />
                <h3 className="text-3xl font-bold text-white mb-4">Ready to Mine?</h3>
                <p className="text-platinum-dark text-center max-w-md">
                  Select your risk level and bet amount, then start mining for gold. 
                  The more tiles you reveal, the higher your multiplier!
                </p>
              </div>
            ) : (
              <div>
                {/* Stats Bar */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-executive/20">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Diamond className="w-5 h-5 text-emerald" />
                      <span className="text-platinum">Safe: {revealedSafe}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bomb className="w-5 h-5 text-rose-400" />
                      <span className="text-platinum">Mines: {minesCount}</span>
                    </div>
                  </div>
                  <div className="text-luxury font-bold text-xl">
                    Win: ${potentialWin}
                  </div>
                </div>

                {/* Game Grid */}
                <div 
                  className={`grid gap-2`}
                  style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                >
                  {tiles.map((tile) => (
                    <motion.button
                      key={tile.id}
                      whileHover={!tile.revealed && isPlaying ? { scale: 1.05 } : {}}
                      whileTap={!tile.revealed && isPlaying ? { scale: 0.95 } : {}}
                      onClick={() => handleTileClick(tile.id)}
                      disabled={!isPlaying || tile.revealed}
                      className={`
                        aspect-square rounded-xl flex items-center justify-center text-2xl font-bold
                        transition-all duration-300 relative overflow-hidden
                        ${tile.revealed 
                          ? tile.isMine 
                            ? 'bg-rose-500/20 border-2 border-rose-500/50' 
                            : 'bg-emerald/20 border-2 border-emerald/50'
                          : 'bg-glass-bg hover:bg-luxury/20 border-2 border-executive/30 hover:border-luxury/50 cursor-pointer'
                        }
                      `}
                    >
                      <AnimatePresence>
                        {tile.revealed && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            {tile.isMine ? (
                              <Bomb className="w-8 h-8 text-rose-400" />
                            ) : (
                              <Diamond className="w-8 h-8 text-emerald" />
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Hover effect */}
                      {!tile.revealed && isPlaying && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-luxury/0 to-luxury/20"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Game Over Message */}
                <AnimatePresence>
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-center"
                    >
                      {tiles.some(t => t.isMine && t.revealed) ? (
                        <div className="text-2xl font-bold text-rose-400">
                          <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                          Mine Hit! Lost ${betAmount}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-emerald">
                          <Trophy className="w-12 h-12 mx-auto mb-2" />
                          Won ${potentialWin}!
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Game Controls */}
          {!isPlaying && (
            <div className="glass-light rounded-2xl p-6 space-y-4">
              {/* Risk Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-platinum text-sm mb-2 block">Grid Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 5, 7].map(size => (
                      <button
                        key={size}
                        onClick={() => setGridSize(size)}
                        className={`py-2 rounded-lg font-medium transition-all ${
                          gridSize === size
                            ? 'bg-luxury text-vaultor-dark'
                            : 'bg-glass-bg text-white hover:bg-luxury/20 border border-executive/20'
                        }`}
                      >
                        {size}×{size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-platinum text-sm mb-2 block">Mines</label>
                  <input
                    type="range"
                    min="1"
                    max={Math.floor((gridSize * gridSize) * 0.8)}
                    value={minesCount}
                    onChange={(e) => setMinesCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-white font-bold mt-1">{minesCount}</div>
                </div>
              </div>

              {/* Bet Amount */}
              <div>
                <label className="text-platinum text-sm mb-2 block">Bet Amount</label>
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

              {/* Start Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={initializeGame}
                className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-rose-500 to-rose-600 
                  text-white shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 
                  flex items-center justify-center gap-3"
              >
                <Zap className="w-5 h-5" />
                Start Mining
              </motion.button>
            </div>
          )}

          {/* Active Game Controls */}
          {isPlaying && (
            <div className="glass-light rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAutoReveal}
                  className="py-3 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 
                    text-white shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Auto Reveal ({autoReveal})
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCashout}
                  disabled={revealedSafe === 0}
                  className={`py-3 rounded-xl font-bold transition-all duration-300 
                    flex items-center justify-center gap-2 ${
                    revealedSafe === 0
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-luxury to-champagne-gold text-vaultor-dark shadow-lg shadow-luxury/30'
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  Cash Out (${potentialWin})
                </motion.button>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Risk/Reward Info */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-emerald" />
              <span className="text-white font-semibold">Risk Analysis</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-platinum">Win Chance</span>
                <span className="text-emerald font-bold">
                  {((1 - minesCount / (gridSize * gridSize)) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-platinum">Max Multiplier</span>
                <span className="text-luxury font-bold">
                  {calculateMultiplier(gridSize * gridSize - minesCount).toFixed(2)}x
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-platinum">House Edge</span>
                <span className="text-white font-bold">3%</span>
              </div>
            </div>
          </div>

          {/* Shield Protection */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-luxury" />
                <span className="text-white font-semibold">Shield</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={shieldEnabled}
                  onChange={(e) => setShieldEnabled(e.target.checked)}
                  disabled={isPlaying}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-glass-bg rounded-full peer peer-checked:bg-luxury 
                  peer-checked:after:translate-x-full after:content-[\'\'] after:absolute after:top-[2px] 
                  after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </label>
            </div>
            
            {shieldEnabled && (
              <p className="text-platinum-dark text-sm">
                Recover 10% of losses if you hit a mine
              </p>
            )}
          </div>

          {/* Game History */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-5 h-5 text-luxury" />
              <span className="text-white font-semibold">History</span>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {gameHistory.length === 0 ? (
                <div className="text-center text-platinum-dark py-4">
                  No games played yet
                </div>
              ) : (
                gameHistory.map((game, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      game.won ? 'bg-emerald/10 border border-emerald/20' : 'bg-rose-500/10 border border-rose-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Diamond className="w-4 h-4 text-white" />
                      <span className="text-white text-sm">{game.tiles} tiles</span>
                    </div>
                    <span className={`font-bold ${game.won ? 'text-emerald' : 'text-rose-400'}`}>
                      {game.won ? '+' : '-'}${game.amount.toFixed(2)}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}