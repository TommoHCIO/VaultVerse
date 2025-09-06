'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TrendingUp, BarChart3, Globe, DollarSign, Award } from 'lucide-react';
import { EthereumIcon, BitcoinIcon, PolygonIcon, AppleIcon, MetaMaskIcon } from '@/components/icons';

// Optimized counter component
function OptimizedCounter({ 
  value, 
  prefix = '', 
  suffix = '' 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string; 
}) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const startValue = 0;
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = progress * progress * (3 - 2 * progress); // smooth easing
      
      setDisplayValue(Math.floor(startValue + (value - startValue) * easedProgress));
      
      if (progress >= 1) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="font-bold tabular-nums">
      {prefix}{displayValue}{suffix}
    </span>
  );
}

// Premium VaultorVerse logo using Ethereum icon
function VaultorLogo() {
  return (
    <div className="relative">
      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/90 to-yellow-600/90" />
        <EthereumIcon className="w-8 h-8 relative z-10" />
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
    </div>
  );
}

// Minimal particle effect
function BackgroundEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
    </div>
  );
}

export default function HomePage() {
  const [countersVisible, setCountersVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !countersVisible) {
          setCountersVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [countersVisible]);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      <BackgroundEffect />
      
      {/* Optimized Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <VaultorLogo />
              <div>
                <h1 className="text-xl font-bold text-yellow-400">VaultorVerse</h1>
                <span className="text-xs text-slate-400 uppercase tracking-wider">Premium Markets</span>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/arena" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
                Arena
              </Link>
              <Link href="/games" className="relative text-slate-300 hover:text-yellow-400 transition-colors font-medium">
                Games
                <span className="absolute -top-2 -right-8 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 text-xs px-2 py-0.5 rounded-full font-bold">
                  NEW
                </span>
              </Link>
              <Link href="/events" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
                Events
              </Link>
              <Link href="/dashboard" className="text-slate-300 hover:text-blue-400 transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="/staking" className="text-slate-300 hover:text-purple-400 transition-colors font-medium">
                Staking
              </Link>
              <button className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 rounded-full px-6 py-3 mb-8 backdrop-blur-sm border border-slate-700">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">
              Premium Prediction Markets
            </span>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white block mb-2">Wealth Through</span>
            <span className="text-yellow-400 block mb-2">Intelligent</span>
            <span className="text-slate-300">Predictions</span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-6 max-w-4xl mx-auto leading-relaxed">
            Join the world's most sophisticated prediction market platform designed for 
            <span className="text-yellow-400"> discerning investors</span> and 
            <span className="text-emerald-400"> financial professionals</span>.
          </p>
          
          <p className="text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed">
            Experience enterprise-grade prediction markets with institutional-level security, 
            advanced risk management, and premium Shield protection technology.
          </p>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16" ref={statsRef}>
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-yellow-400/30 transition-colors">
              <div className="text-3xl font-bold text-yellow-400 mb-2 flex items-center justify-center">
                <DollarSign className="w-6 h-6 mr-1" />
                {countersVisible ? <OptimizedCounter value={250} suffix="M+" /> : '0M+'}
              </div>
              <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">Assets Under Management</div>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-emerald-400/30 transition-colors">
              <div className="text-3xl font-bold text-emerald-400 mb-2 flex items-center justify-center">
                <Award className="w-6 h-6 mr-1" />
                99.9%
              </div>
              <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">Platform Reliability</div>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-blue-400/30 transition-colors">
              <div className="text-3xl font-bold text-blue-400 mb-2 flex items-center justify-center">
                <Globe className="w-6 h-6 mr-1" />
                {countersVisible ? <OptimizedCounter value={50} suffix="K+" /> : '0K+'}
              </div>
              <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">Verified Professionals</div>
            </div>
            
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-purple-400/30 transition-colors">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-slate-400 text-sm font-medium uppercase tracking-wide">Concierge Support</div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="/arena" 
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-colors inline-flex items-center gap-3 shadow-lg hover:shadow-yellow-400/25"
            >
              <span>Access Trading Arena</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link 
              href="/dashboard" 
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors inline-flex items-center gap-3 border border-slate-700 hover:border-slate-600"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Executive Dashboard</span>
            </Link>
          </div>

          {/* Brand Trust Indicators with Magic UI MCP Logos */}
          <div className="flex flex-wrap justify-center items-center gap-12 text-slate-400">
            <div className="flex items-center gap-3 group hover:text-white transition-colors">
              <div className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                <EthereumIcon className="w-full h-full" />
              </div>
              <span className="text-sm font-medium">Ethereum Network</span>
            </div>
            
            <div className="flex items-center gap-3 group hover:text-white transition-colors">
              <div className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                <PolygonIcon className="w-full h-full" />
              </div>
              <span className="text-sm font-medium">Polygon Scaling</span>
            </div>
            
            <div className="flex items-center gap-3 group hover:text-white transition-colors">
              <div className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                <MetaMaskIcon className="w-full h-full" />
              </div>
              <span className="text-sm font-medium">MetaMask Support</span>
            </div>
            
            <div className="flex items-center gap-3 group hover:text-white transition-colors">
              <div className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity text-slate-400 group-hover:text-white">
                <AppleIcon className="w-full h-full" />
              </div>
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
            
            <div className="flex items-center gap-3 group hover:text-white transition-colors">
              <div className="w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity">
                <BitcoinIcon className="w-full h-full" />
              </div>
              <span className="text-sm font-medium">Multi-Asset Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Metrics Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Platform Excellence</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Delivering institutional-grade performance and reliability for discerning professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-yellow-400/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {countersVisible ? <OptimizedCounter value={500} prefix="$" suffix="M+" /> : '$0M+'}
                  </div>
                  <div className="text-slate-400 text-sm uppercase tracking-wide">Total Volume Traded</div>
                </div>
              </div>
              <p className="text-slate-500 text-sm">Institutional-grade liquidity and market depth</p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-emerald-400/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <EthereumIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">99.99%</div>
                  <div className="text-slate-400 text-sm uppercase tracking-wide">Uptime SLA</div>
                </div>
              </div>
              <p className="text-slate-500 text-sm">Enterprise reliability guarantee</p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-blue-400/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {countersVisible ? <OptimizedCounter value={5000} suffix="+" /> : '0+'}
                  </div>
                  <div className="text-slate-400 text-sm uppercase tracking-wide">Live Markets</div>
                </div>
              </div>
              <p className="text-slate-500 text-sm">Global market coverage</p>
            </div>
          </div>

          {/* Powered by Section with Brand Logos */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-300 mb-8">Powered by Industry Leaders</h3>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-60">
              <div className="group hover:opacity-100 transition-opacity">
                <EthereumIcon className="w-12 h-12 mx-auto mb-2" />
                <div className="text-xs text-slate-400 group-hover:text-slate-300">Ethereum</div>
              </div>
              <div className="group hover:opacity-100 transition-opacity">
                <PolygonIcon className="w-12 h-12 mx-auto mb-2" />
                <div className="text-xs text-slate-400 group-hover:text-slate-300">Polygon</div>
              </div>
              <div className="group hover:opacity-100 transition-opacity">
                <BitcoinIcon className="w-12 h-12 mx-auto mb-2" />
                <div className="text-xs text-slate-400 group-hover:text-slate-300">Bitcoin</div>
              </div>
              <div className="group hover:opacity-100 transition-opacity">
                <MetaMaskIcon className="w-12 h-12 mx-auto mb-2" />
                <div className="text-xs text-slate-400 group-hover:text-slate-300">MetaMask</div>
              </div>
              <div className="group hover:opacity-100 transition-opacity text-slate-400 group-hover:text-slate-300">
                <AppleIcon className="w-12 h-12 mx-auto mb-2" />
                <div className="text-xs text-slate-400 group-hover:text-slate-300">Enterprise</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}