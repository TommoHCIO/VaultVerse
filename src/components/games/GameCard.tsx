'use client';

import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Shield,
  Sparkles,
  ChevronRight,
  Activity,
  Percent
} from 'lucide-react';

interface GameCardProps {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  borderColor: string;
  shadowColor: string;
  houseEdge: string;
  maxPayout: string;
  players: number;
  volume: number;
  featured?: boolean;
}

export function GameCard({
  name,
  description,
  icon: Icon,
  color,
  borderColor,
  shadowColor,
  houseEdge,
  maxPayout,
  players,
  volume,
  featured
}: GameCardProps) {
  return (
    <div className={`
      relative glass-executive rounded-3xl p-8 border ${borderColor} 
      hover:border-luxury/50 transition-all duration-500 group element-3d
      ${featured ? 'ring-2 ring-luxury/20 ring-offset-2 ring-offset-vaultor-dark' : ''}
    `}>
      {/* Featured Badge */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-3 -right-3 bg-luxury text-vaultor-dark px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
          HOT GAME
        </motion.div>
      )}

      {/* Glass Effect Overlay */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className={`
          absolute inset-0 bg-gradient-to-br ${color} opacity-5 
          group-hover:opacity-10 transition-opacity duration-500
        `} />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className={`
                w-16 h-16 rounded-2xl bg-gradient-to-br ${color} 
                flex items-center justify-center shadow-2xl ${shadowColor}
                border ${borderColor}
              `}
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
              <div className="flex items-center gap-3 text-platinum-dark text-sm">
                <span className="flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  {houseEdge} Edge
                </span>
                <span className="text-luxury">•</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Max {maxPayout}
                </span>
              </div>
            </div>
          </div>
          <motion.div
            whileHover={{ x: 5 }}
            className="text-luxury"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-platinum-dark mb-6 leading-relaxed">
          {description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-light rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-emerald" />
              <span className="text-xs text-platinum-dark">Players</span>
            </div>
            <div className="text-xl font-bold text-white">
              {players.toLocaleString()}
            </div>
          </div>
          <div className="glass-light rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-luxury" />
              <span className="text-xs text-platinum-dark">Volume</span>
            </div>
            <div className="text-xl font-bold text-white">
              ${(volume / 1000).toFixed(0)}K
            </div>
          </div>
          <div className="glass-light rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-platinum-dark">Live</span>
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
              {Math.floor(players * 0.15)}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full py-4 rounded-2xl font-bold text-lg
            bg-gradient-to-r ${color} text-white
            shadow-lg ${shadowColor} hover:shadow-xl
            transition-all duration-300 flex items-center justify-center gap-3
            border ${borderColor} hover:border-luxury/50
            group relative overflow-hidden
          `}
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
          
          <Shield className="w-5 h-5" />
          <span className="relative z-10">Play Now</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        {/* Bottom Features */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-platinum-dark">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-luxury" />
            Shield Available
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald" />
            Instant Payouts
          </span>
        </div>
      </div>
    </div>
  );
}