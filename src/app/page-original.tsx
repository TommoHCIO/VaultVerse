'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Zap, Users, Trophy, Star, Activity, ArrowRight, Menu, X } from 'lucide-react';

export default function VaultorHomePage() {
  const [activeTab, setActiveTab] = useState('prediction-arena');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '$10M+', label: 'Total Volume', icon: TrendingUp },
    { value: '50K+', label: 'Active Users', icon: Users },
    { value: '1000+', label: 'Markets Created', icon: Activity },
    { value: '99.9%', label: 'Uptime', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-vaultor-dark mesh-gradient">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'glass-nav py-2' : 'py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 gradient-neon-primary rounded-xl flex items-center justify-center animate-neon-pulse">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neon bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              VaultorVerse
            </h1>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/arena" className="text-white hover:text-neon-purple transition-all duration-300 hover:scale-105">
              Prediction Arena
            </Link>
            <Link href="/events" className="text-white hover:text-neon-cyan transition-all duration-300 hover:scale-105">
              Vaultor Events
            </Link>
            <Link href="/staking" className="text-white hover:text-neon-green transition-all duration-300 hover:scale-105">
              Staking
            </Link>
            <button className="btn-neon px-6 py-2 rounded-xl font-semibold">
              Connect Wallet
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2 hover-neon rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          className={`lg:hidden glass-card-lg mx-6 mt-4 rounded-2xl ${isMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 space-y-4">
            <Link href="/arena" className="block text-white hover:text-neon-purple transition-colors">
              Prediction Arena
            </Link>
            <Link href="/events" className="block text-white hover:text-neon-cyan transition-colors">
              Vaultor Events
            </Link>
            <Link href="/staking" className="block text-white hover:text-neon-green transition-colors">
              Staking
            </Link>
            <button className="btn-neon w-full py-3 rounded-xl font-semibold">
              Connect Wallet
            </button>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 particle-bg opacity-30" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full gradient-neon-primary opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full gradient-neon-secondary opacity-20"
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative z-10 px-6 text-center max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              The Future of{' '}
              <span className="text-neon bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green bg-clip-text text-transparent animate-pulse">
                Prediction Markets
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience the world's most advanced gamified prediction platform with revolutionary Shield protection, 
              daily live events, and multi-version token utilities powered by cutting-edge Web3 technology.
            </motion.p>
            
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/arena">
                <button className="group relative px-10 py-4 gradient-neon-primary rounded-xl font-bold text-lg text-white hover-lift overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Enter Prediction Arena
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </Link>
              <Link href="/events">
                <button className="btn-neon px-10 py-4 rounded-xl font-bold text-lg">
                  Join Live Events
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-neon-purple rounded-full flex justify-center">
            <div className="w-1 h-3 bg-neon-purple rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              VaultorVerse combines cutting-edge technology with innovative gamification 
              to create the ultimate prediction market experience.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Prediction Arena */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 hover-lift hover-neon group"
            >
              <div className="w-16 h-16 gradient-neon-primary rounded-2xl flex items-center justify-center mb-8 group-hover:animate-neon-pulse">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">24/7 Prediction Arena</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Trade predictions on markets with revolutionary Shield loss protection. 
                Advanced AMM system with real-time odds calculation and instant settlements.
              </p>
              <div className="flex items-center space-x-2 text-shield-gold">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Shield Protection Available</span>
              </div>
            </motion.div>

            {/* Vaultor Events */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 hover-lift hover-neon group"
            >
              <div className="w-16 h-16 gradient-neon-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:animate-neon-pulse">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">Daily Live Events</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                High-energy 10-15 minute prediction battles with 25 rapid-fire questions. 
                Real-time leaderboards, instant rewards, and global competitions.
              </p>
              <div className="flex items-center space-x-2 text-neon-green">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Win Daily Prizes</span>
              </div>
            </motion.div>

            {/* Token Economy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 hover-lift hover-neon group"
            >
              <div className="w-16 h-16 gradient-neon-tertiary rounded-2xl flex items-center justify-center mb-8 group-hover:animate-neon-pulse">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-6">V1-V5 Token System</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Multi-version utility tokens with escalating benefits. From Shield discounts 
                to governance rights, revenue sharing, and exclusive access.
              </p>
              <div className="flex items-center space-x-2 text-neon-cyan">
                <Users className="w-5 h-5" />
                <span className="font-semibold">DAO Governance</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 glass-card-lg mx-6 rounded-3xl my-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="w-16 h-16 gradient-neon-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:animate-neon-pulse">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-neon mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Ready to Enter the{' '}
              <span className="text-neon">VaultorVerse?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of traders in the most advanced prediction market platform ever built. 
              Start your journey today and experience the future of decentralized prediction markets.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link href="/arena">
                <button className="group relative px-10 py-4 gradient-neon-primary rounded-xl font-bold text-lg text-white hover-lift overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Trading Now
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </Link>
              <Link href="/events">
                <button className="btn-neon px-10 py-4 rounded-xl font-bold text-lg">
                  Join Next Event
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-card-lg rounded-t-3xl py-16 px-6 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 gradient-neon-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-neon">VaultorVerse</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                The world's most advanced gamified prediction market platform, 
                powered by cutting-edge Web3 technology.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Platform</h4>
              <div className="space-y-3">
                <Link href="/arena" className="block text-gray-300 hover:text-neon-purple transition-colors">
                  Prediction Arena
                </Link>
                <Link href="/events" className="block text-gray-300 hover:text-neon-cyan transition-colors">
                  Vaultor Events
                </Link>
                <Link href="/staking" className="block text-gray-300 hover:text-neon-green transition-colors">
                  Staking
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Community</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-300 hover:text-neon-purple transition-colors">
                  Discord
                </a>
                <a href="#" className="block text-gray-300 hover:text-neon-cyan transition-colors">
                  Twitter
                </a>
                <a href="#" className="block text-gray-300 hover:text-neon-green transition-colors">
                  Telegram
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Resources</h4>
              <div className="space-y-3">
                <Link href="/docs" className="block text-gray-300 hover:text-neon-purple transition-colors">
                  Documentation
                </Link>
                <Link href="/api" className="block text-gray-300 hover:text-neon-cyan transition-colors">
                  API
                </Link>
                <Link href="/support" className="block text-gray-300 hover:text-neon-green transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-glass-border mt-12 pt-8 text-center">
            <p className="text-gray-300">
              &copy; 2025 VaultorVerse. All rights reserved. Built with ❤️ for the future of prediction markets.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}