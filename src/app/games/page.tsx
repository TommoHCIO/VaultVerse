'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dice1, 
  TrendingUp, 
  Bomb, 
  Circle,
  Trophy,
  Shield,
  Sparkles,
  Zap,
  Crown,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Star,
  Flame
} from 'lucide-react';
import { GameCard } from '@/components/games/GameCard';
import { DiceGame } from '@/components/games/DiceGame';
import { CrashGame } from '@/components/games/CrashGame';
import { MinesGame } from '@/components/games/MinesGame';
import { PlinkoGame } from '@/components/games/PlinkoGame';

// Game data with BCH.GAMES-inspired features
const games = [
  {
    id: 'dice',
    name: 'Luxury Dice',
    description: 'Classic high/low dice with Shield protection. Roll the golden dice and predict the outcome.',
    icon: Dice1,
    color: 'from-luxury via-champagne-gold to-luxury',
    borderColor: 'border-luxury/30',
    shadowColor: 'shadow-luxury/20',
    houseEdge: '1%',
    maxPayout: '9900x',
    players: 1247,
    volume: 385000,
    featured: true,
    component: DiceGame
  },
  {
    id: 'crash',
    name: 'Rocket Crash',
    description: 'Watch the multiplier rocket up! Cash out before it crashes for massive wins.',
    icon: TrendingUp,
    color: 'from-emerald-500 via-emerald-400 to-emerald-600',
    borderColor: 'border-emerald-500/30',
    shadowColor: 'shadow-emerald-500/20',
    houseEdge: '2%',
    maxPayout: '10000x',
    players: 892,
    volume: 567000,
    featured: true,
    component: CrashGame
  },
  {
    id: 'mines',
    name: 'Gold Mines',
    description: 'Navigate the minefield to find gold. More risk, bigger rewards!',
    icon: Bomb,
    color: 'from-rose-500 via-rose-400 to-rose-600',
    borderColor: 'border-rose-500/30',
    shadowColor: 'shadow-rose-500/20',
    houseEdge: '3%',
    maxPayout: '5000x',
    players: 654,
    volume: 234000,
    component: MinesGame
  },
  {
    id: 'plinko',
    name: 'Plinko Drop',
    description: 'Drop the ball and watch it bounce to riches. Physics-based excitement!',
    icon: Circle,
    color: 'from-purple-500 via-purple-400 to-purple-600',
    borderColor: 'border-purple-500/30',
    shadowColor: 'shadow-purple-500/20',
    houseEdge: '2.5%',
    maxPayout: '1000x',
    players: 432,
    volume: 178000,
    component: PlinkoGame
  }
];

// Particle system for background
function ParticleBackground() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-luxury rounded-full opacity-20"
          initial={{ y: '100vh', x: `${particle.left}vw` }}
          animate={{ y: '-10vh' }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
}

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [globalStats, setGlobalStats] = useState({
    totalVolume: 1364000,
    activePlayers: 3225,
    totalGames: 45678,
    biggestWin: 125000
  });

  const handleGameSelect = (gameId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedGame(gameId);
      setIsLoading(false);
    }, 500);
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
  };

  const selectedGameData = games.find(g => g.id === selectedGame);

  return (
    <div className="min-h-screen bg-vaultor-dark executive-gradient relative">
      <ParticleBackground />
      
      <div className="max-w-[1600px] mx-auto px-8 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="games-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Executive Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-6xl md:text-7xl font-bold mb-4 heading-executive">
                      Casino{' '}
                      <span className="text-luxury metal-gold">Games</span>
                      <span className="text-executive block text-5xl md:text-6xl mt-2">Arena</span>
                    </h1>
                    <p className="text-xl text-platinum-dark max-w-4xl leading-relaxed">
                      Experience premium casino games with institutional-grade fairness and revolutionary Shield protection. 
                      Provably fair gaming meets enterprise security.
                    </p>
                  </div>
                  
                  {/* Live Stats Widget */}
                  <div className="hidden xl:block">
                    <div className="glass-executive p-8 rounded-2xl min-w-[400px]">
                      <div className="text-sm text-platinum-dark uppercase tracking-widest mb-4 font-semibold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald" />
                        Live Casino Statistics
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-platinum">Total Volume</span>
                          <span className="text-2xl font-bold text-luxury">${(globalStats.totalVolume / 1000).toFixed(1)}M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-platinum">Active Players</span>
                          <span className="text-xl font-semibold text-emerald">{globalStats.activePlayers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-platinum">Biggest Win Today</span>
                          <span className="text-xl font-semibold text-executive">${globalStats.biggestWin.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Features Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-executive rounded-2xl p-6 mb-12 element-3d"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-luxury/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-luxury" />
                    </div>
                    <div>
                      <div className="text-platinum-dark text-sm">Shield Protection</div>
                      <div className="text-white font-semibold">Loss Recovery</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-emerald" />
                    </div>
                    <div>
                      <div className="text-platinum-dark text-sm">Instant</div>
                      <div className="text-white font-semibold">Payouts</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-platinum-dark text-sm">Provably</div>
                      <div className="text-white font-semibold">Fair</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-rose-400" />
                    </div>
                    <div>
                      <div className="text-platinum-dark text-sm">VIP</div>
                      <div className="text-white font-semibold">Rewards</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Games Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8"
              >
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.3 + index * 0.1, 
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -5,
                      transition: { duration: 0.3 }
                    }}
                    onClick={() => handleGameSelect(game.id)}
                    className="cursor-pointer"
                  >
                    <GameCard {...game} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Bottom Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-16 glass-executive rounded-2xl p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <Flame className="w-5 h-5 text-orange-500" />
                      <span className="text-platinum">Hot Streak:</span>
                      <span className="text-luxury font-bold">Player_8976 won 15x in a row!</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-platinum">Jackpot Pool:</span>
                      <span className="text-emerald font-bold">$458,234</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl glass-light hover:glass-executive text-platinum hover:text-luxury transition-all duration-500"
                  >
                    <RefreshCw className="w-6 h-6" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="game-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative"
            >
              {/* Back Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: -5 }}
                onClick={handleBackToGames}
                className="mb-8 flex items-center gap-3 text-platinum hover:text-luxury transition-colors"
              >
                <ChevronRight className="w-6 h-6 rotate-180" />
                <span className="text-lg font-medium">Back to Games</span>
              </motion.button>

              {/* Selected Game Component */}
              {selectedGameData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedGameData.component && <selectedGameData.component />}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-luxury border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}