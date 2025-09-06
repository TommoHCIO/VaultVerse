'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Target,
  Calendar,
  BarChart3,
  Coins,
  Trophy,
  Shield,
  Crown,
  User,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Wallet,
  TrendingUp,
  Star,
  Zap,
  Activity,
  Award,
  Sparkles
} from 'lucide-react';

export interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
  isNew?: boolean;
  children?: NavigationItem[];
}

export function LuxuryNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Mock user data
  const userData = {
    username: 'EliteTrader',
    tier: 'Legendary',
    avatar: '👔',
    balance: 125000,
    notifications: 3,
    level: 42,
    xp: 8750,
    nextLevelXp: 10000
  };

  const navigationItems: NavigationItem[] = [
    {
      href: '/',
      label: 'Home',
      icon: Home
    },
    {
      href: '/arena',
      label: 'Arena',
      icon: Target,
      badge: 'LIVE'
    },
    {
      href: '/events',
      label: 'Events',
      icon: Calendar,
      badge: userData.notifications,
      isNew: true
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3
    },
    {
      href: '/staking',
      label: 'Staking',
      icon: Coins,
      children: [
        { href: '/staking', label: 'Overview', icon: BarChart3 },
        { href: '/staking?tab=v1', label: 'V1 Foundation', icon: Shield },
        { href: '/staking?tab=v2', label: 'V2 Enhanced', icon: Zap },
        { href: '/staking?tab=v3', label: 'V3 Premium', icon: Trophy },
        { href: '/staking?tab=v4', label: 'V4 Executive', icon: Star },
        { href: '/staking?tab=v5', label: 'V5 Legendary', icon: Crown }
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'legendary': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'diamond': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'gold': return 'text-luxury bg-luxury/10 border-luxury/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl shadow-black/20' 
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-[1800px] mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-br from-luxury via-champagne-gold to-luxury rounded-2xl flex items-center justify-center shadow-lg shadow-luxury/30 border border-luxury/20"
              >
                <Shield className="w-6 h-6 text-gray-900" />
              </motion.div>
              <div>
                <div className="text-2xl font-bold">
                  <span 
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7A3 50%, #D4AF37 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    VaultorVerse
                  </span>
                </div>
                <div className="text-xs text-gray-400 -mt-1">Elite Trading Platform</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);
                
                return (
                  <div key={item.href} className="relative">
                    {item.children ? (
                      // Dropdown Menu
                      <div
                        className="relative"
                        onMouseEnter={() => setActiveDropdown(item.href)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <button
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200
                            ${active
                              ? 'text-luxury bg-luxury/10 border border-luxury/20 shadow-lg shadow-luxury/10'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                            }
                          `}
                        >
                          <IconComponent className="w-5 h-5" />
                          {item.label}
                          <ChevronDown className="w-4 h-4" />
                          {item.badge && (
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {item.badge}
                            </div>
                          )}
                        </button>

                        {/* Dropdown Content */}
                        <AnimatePresence>
                          {activeDropdown === item.href && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full mt-2 left-0 w-64 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden"
                            >
                              {item.children?.map((child) => {
                                const ChildIcon = child.icon;
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
                                  >
                                    <ChildIcon className="w-4 h-4" />
                                    {child.label}
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      // Regular Link
                      <Link
                        href={item.href}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 relative
                          ${active
                            ? 'text-luxury bg-luxury/10 border border-luxury/20 shadow-lg shadow-luxury/10'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                          }
                        `}
                      >
                        <IconComponent className="w-5 h-5" />
                        {item.label}
                        {item.badge && (
                          <div className={`
                            px-2 py-1 rounded-full text-xs font-bold
                            ${typeof item.badge === 'string' 
                              ? 'bg-red-500 text-white' 
                              : 'bg-emerald-500 text-white'
                            }
                          `}>
                            {item.badge}
                          </div>
                        )}
                        {item.isNew && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* User Profile & Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-700/30 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-700/30 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {userData.notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {userData.notifications}
                  </div>
                )}
              </motion.button>

              {/* Wallet */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-xl">
                <Wallet className="w-4 h-4 text-luxury" />
                <span className="text-luxury font-bold">
                  ${(userData.balance / 1000).toFixed(0)}K
                </span>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-700/30 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-luxury/20 to-champagne-gold/20 flex items-center justify-center border border-luxury/30">
                  {userData.avatar}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{userData.username}</div>
                  <div className={`text-xs px-2 py-0.5 rounded border ${getTierColor(userData.tier)}`}>
                    {userData.tier}
                  </div>
                </div>
                <div className="text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-gray-800/50 border border-gray-700/30 flex items-center justify-center text-gray-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-80 h-full bg-gray-900/98 backdrop-blur-xl border-r border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Header */}
              <div className="p-6 border-b border-gray-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-luxury via-champagne-gold to-luxury rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-luxury">VaultorVerse</div>
                    <div className="text-xs text-gray-400">Elite Trading</div>
                  </div>
                </div>
              </div>

              {/* Mobile User Profile */}
              <div className="p-6 border-b border-gray-700/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luxury/20 to-champagne-gold/20 flex items-center justify-center text-xl border border-luxury/30">
                    {userData.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{userData.username}</div>
                    <div className={`inline-block text-xs px-2 py-1 rounded border ${getTierColor(userData.tier)}`}>
                      {userData.tier}
                    </div>
                  </div>
                </div>
                
                {/* XP Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Level {userData.level}</span>
                    <span>{userData.xp}/{userData.nextLevelXp} XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-luxury to-champagne-gold rounded-full"
                      style={{ width: `${(userData.xp / userData.nextLevelXp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Balance */}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700/30">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-luxury" />
                    <span className="text-gray-400">Balance</span>
                  </div>
                  <span className="text-luxury font-bold">${userData.balance.toLocaleString()}</span>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors relative
                        ${active
                          ? 'text-luxury bg-luxury/10 border border-luxury/20'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }
                      `}
                    >
                      <IconComponent className="w-5 h-5" />
                      {item.label}
                      {item.badge && (
                        <div className="ml-auto w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {item.badge}
                        </div>
                      )}
                      {item.isNew && (
                        <div className="ml-auto w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/30">
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl text-gray-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800/50 rounded-xl text-gray-400 hover:text-white">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navigation */}
      <div className="h-20"></div>
    </>
  );
}

export default LuxuryNavigation;