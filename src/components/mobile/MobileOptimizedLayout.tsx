'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Trophy,
  Calendar,
  User,
  Menu,
  X,
  Search,
  Bell,
  Settings,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';

interface MobileLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  shortcut?: string;
}

const mainNavigation: NavigationItem[] = [
  { id: 'arena', label: 'Arena', href: '/arena', icon: Home, shortcut: 'A' },
  { id: 'events', label: 'Events', href: '/events', icon: Calendar, badge: 3, shortcut: 'E' },
  { id: 'leaderboard', label: 'Rankings', href: '/leaderboard', icon: Trophy, shortcut: 'R' },
  { id: 'dashboard', label: 'Profile', href: '/dashboard', icon: User, shortcut: 'P' }
];

const secondaryNavigation: NavigationItem[] = [
  { id: 'achievements', label: 'Achievements', href: '/achievements', icon: Shield },
  { id: 'tokens', label: 'Tokens', href: '/tokens', icon: Zap },
  { id: 'analytics', label: 'Analytics', href: '/analytics', icon: TrendingUp }
];

export function MobileOptimizedLayout({ children }: MobileLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { settings, announceToScreenReader } = useAccessibility();

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Keyboard shortcuts for navigation
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Alt + navigation shortcuts
      if (e.altKey) {
        const navItem = mainNavigation.find(item => item.shortcut === e.key.toUpperCase());
        if (navItem) {
          e.preventDefault();
          window.location.href = navItem.href;
          announceToScreenReader(`Navigating to ${navItem.label}`);
        }
      }

      // Toggle search with Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
        announceToScreenReader(isSearchOpen ? 'Search closed' : 'Search opened');
      }

      // Toggle mobile menu with Alt + M
      if (e.altKey && e.key.toLowerCase() === 'm' && isMobile) {
        e.preventDefault();
        setIsMobileMenuOpen(!isMobileMenuOpen);
        announceToScreenReader(isMobileMenuOpen ? 'Menu closed' : 'Menu opened');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, isSearchOpen, isMobileMenuOpen, isMobile, announceToScreenReader]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    announceToScreenReader(isMobileMenuOpen ? 'Menu closed' : 'Menu opened');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    announceToScreenReader(isSearchOpen ? 'Search closed' : 'Search opened');
  };

  return (
    <div className="min-h-screen bg-vaultor-dark">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-vaultor-dark/95 backdrop-blur-sm border-b border-glass-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Button */}
          <motion.button
            onClick={toggleMobileMenu}
            className={`
              p-2 rounded-lg text-white hover:bg-glass-bg
              focus:outline-none transition-colors
              ${settings.focusIndicators ? 'focus:ring-2 focus:ring-neon-cyan' : ''}
            `}
            whileTap={{ scale: 0.95 }}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent"
            >
              VaultorVerse
            </motion.div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={toggleSearch}
              className={`
                p-2 rounded-lg text-white hover:bg-glass-bg
                focus:outline-none transition-colors
                ${settings.focusIndicators ? 'focus:ring-2 focus:ring-neon-cyan' : ''}
              `}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            <motion.button
              className={`
                p-2 rounded-lg text-white hover:bg-glass-bg
                focus:outline-none transition-colors relative
                ${settings.focusIndicators ? 'focus:ring-2 focus:ring-neon-cyan' : ''}
              `}
              whileTap={{ scale: 0.95 }}
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
              className="border-t border-glass-border"
            >
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search markets, events, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-lg
                      bg-glass-bg border border-glass-border
                      text-white placeholder-gray-400
                      focus:outline-none focus:border-neon-cyan
                      ${settings.focusIndicators ? 'focus:ring-2 focus:ring-neon-cyan/50' : ''}
                      ${settings.largeText ? 'text-lg' : 'text-base'}
                    `}
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.2 }}
            className="md:hidden fixed inset-0 z-50 bg-black/50"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: settings.reducedMotion ? 0 : 0.3 }}
            className="md:hidden fixed top-0 left-0 z-50 w-80 h-full bg-vaultor-dark border-r border-glass-border"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="p-6">
              {/* Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-2xl font-bold bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
                  VaultorVerse
                </div>
                <motion.button
                  onClick={toggleMobileMenu}
                  className={`
                    p-2 rounded-lg text-white hover:bg-glass-bg
                    focus:outline-none transition-colors
                    ${settings.focusIndicators ? 'focus:ring-2 focus:ring-neon-cyan' : ''}
                  `}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Main Navigation */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    Main
                  </h3>
                  <div className="space-y-2">
                    {mainNavigation.map((item, index) => (
                      <MobileNavItem
                        key={item.id}
                        item={item}
                        isActive={pathname === item.href}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                    More
                  </h3>
                  <div className="space-y-2">
                    {secondaryNavigation.map((item, index) => (
                      <MobileNavItem
                        key={item.id}
                        item={item}
                        isActive={pathname === item.href}
                        delay={(mainNavigation.length + index) * 0.1}
                      />
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="pt-6 border-t border-glass-border">
                  <Link
                    href="/settings"
                    className={`
                      flex items-center gap-3 p-3 rounded-lg
                      text-gray-300 hover:text-white hover:bg-glass-bg
                      transition-colors group
                      focus:outline-none
                      ${settings.focusIndicators ? 'focus:ring-2 focus:ring-neon-cyan' : ''}
                    `}
                  >
                    <Settings className="w-5 h-5 group-hover:text-neon-cyan transition-colors" />
                    <span className={settings.largeText ? 'text-lg' : 'text-base'}>Settings</span>
                  </Link>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="mt-8 p-4 bg-glass-bg rounded-lg">
                <h4 className="text-sm font-semibold text-white mb-3">Quick Keys</h4>
                <div className="space-y-2 text-xs text-gray-400">
                  {mainNavigation.map((item) => (
                    item.shortcut && (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.label}</span>
                        <kbd className="bg-glass-border px-1 py-0.5 rounded text-xs">
                          Alt + {item.shortcut}
                        </kbd>
                      </div>
                    )
                  ))}
                  <div className="flex justify-between">
                    <span>Search</span>
                    <kbd className="bg-glass-border px-1 py-0.5 rounded text-xs">⌘K</kbd>
                  </div>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        id="main-content"
        className="flex-1 focus:outline-none"
        tabIndex={-1}
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-vaultor-dark/95 backdrop-blur-sm border-t border-glass-border"
        role="navigation"
        aria-label="Bottom navigation"
      >
        <div className="grid grid-cols-4 py-2">
          {mainNavigation.map((item) => (
            <MobileBottomNavItem
              key={item.id}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Spacing */}
      <div className="md:hidden h-20" />
    </div>
  );
}

interface MobileNavItemProps {
  item: NavigationItem;
  isActive: boolean;
  delay: number;
}

function MobileNavItem({ item, isActive, delay }: MobileNavItemProps) {
  const { settings } = useAccessibility();
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: settings.reducedMotion ? 0 : delay }}
    >
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 p-3 rounded-lg transition-colors
          group focus:outline-none
          ${isActive 
            ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' 
            : 'text-gray-300 hover:text-white hover:bg-glass-bg'
          }
          ${settings.focusIndicators ? 'focus:ring-2 focus:ring-neon-cyan' : ''}
        `}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className={`
          w-5 h-5 transition-colors
          ${isActive ? 'text-neon-purple' : 'group-hover:text-neon-cyan'}
        `} />
        <span className={`
          font-medium
          ${settings.largeText ? 'text-lg' : 'text-base'}
        `}>
          {item.label}
        </span>
        {item.badge && (
          <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
            {item.badge}
          </span>
        )}
      </Link>
    </motion.div>
  );
}

interface MobileBottomNavItemProps {
  item: NavigationItem;
  isActive: boolean;
}

function MobileBottomNavItem({ item, isActive }: MobileBottomNavItemProps) {
  const { settings } = useAccessibility();
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`
        flex flex-col items-center justify-center py-2 px-1
        transition-colors focus:outline-none
        ${isActive ? 'text-neon-purple' : 'text-gray-400'}
        ${settings.focusIndicators ? 'focus:ring-2 focus:ring-neon-cyan rounded-lg' : ''}
      `}
      aria-current={isActive ? 'page' : undefined}
      aria-label={item.label}
    >
      <div className="relative">
        <Icon className={`
          w-6 h-6 transition-colors
          ${isActive ? 'text-neon-purple' : 'text-gray-400'}
        `} />
        {item.badge && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </div>
      <span className={`
        text-xs mt-1 transition-colors
        ${isActive ? 'text-neon-purple' : 'text-gray-400'}
        ${settings.largeText ? 'text-sm' : 'text-xs'}
      `}>
        {item.label}
      </span>
    </Link>
  );
}