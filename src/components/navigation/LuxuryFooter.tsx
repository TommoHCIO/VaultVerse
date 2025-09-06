'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  Twitter,
  Github,
  MessageCircle,
  Mail,
  Globe,
  FileText,
  Lock,
  Users,
  TrendingUp,
  Award,
  Star,
  Crown,
  Sparkles,
  ArrowUp
} from 'lucide-react';

export function LuxuryFooter() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Arena Trading', href: '/arena', icon: Shield },
        { label: 'Live Events', href: '/events', icon: Star },
        { label: 'Dashboard', href: '/dashboard', icon: TrendingUp },
        { label: 'Token Staking', href: '/staking', icon: Crown },
      ]
    },
    {
      title: 'Features',
      links: [
        { label: 'Shield Protection', href: '/features/shield', icon: Shield },
        { label: 'V1-V5 Tokens', href: '/features/tokens', icon: Award },
        { label: 'Live Prediction', href: '/features/predictions', icon: Users },
        { label: 'Analytics', href: '/features/analytics', icon: TrendingUp },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/docs', icon: FileText },
        { label: 'API Reference', href: '/api-docs', icon: Globe },
        { label: 'Security', href: '/security', icon: Lock },
        { label: 'Whitepaper', href: '/whitepaper', icon: FileText },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Discord', href: 'https://discord.gg/vaultorverse', icon: MessageCircle },
        { label: 'Twitter', href: 'https://twitter.com/vaultorverse', icon: Twitter },
        { label: 'GitHub', href: 'https://github.com/vaultorverse', icon: Github },
        { label: 'Support', href: '/support', icon: Mail },
      ]
    }
  ];

  const stats = [
    { label: 'Total Volume', value: '$2.8B', icon: TrendingUp },
    { label: 'Active Users', value: '125K+', icon: Users },
    { label: 'Markets Created', value: '50K+', icon: Star },
    { label: 'Rewards Paid', value: '$45M+', icon: Award },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-950"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-luxury"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative">
        {/* Stats Section */}
        <div className="border-b border-gray-800/50">
          <div className="max-w-[1800px] mx-auto px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl font-bold mb-4">
                <span 
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37 0%, #F7E7A3 50%, #D4AF37 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Trusted by Elite Traders Worldwide
                </span>
              </h3>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Join the most sophisticated prediction market platform built for the future of finance
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center group"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-luxury/10 to-champagne-gold/10 rounded-2xl border border-luxury/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-luxury" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-[1800px] mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center gap-3 mb-6 group">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="w-12 h-12 bg-gradient-to-br from-luxury via-champagne-gold to-luxury rounded-2xl flex items-center justify-center shadow-lg shadow-luxury/30 border border-luxury/20"
                  >
                    <Shield className="w-6 h-6 text-gray-900" />
                  </motion.div>
                  <div>
                    <div className="text-xl font-bold text-luxury">VaultorVerse</div>
                    <div className="text-xs text-gray-400">Elite Trading</div>
                  </div>
                </Link>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  The world's most advanced prediction market platform with revolutionary Shield protection 
                  and V1-V5 token ecosystem.
                </p>
                
                {/* Social Links */}
                <div className="flex items-center gap-4">
                  {[
                    { icon: Twitter, href: 'https://twitter.com/vaultorverse' },
                    { icon: Github, href: 'https://github.com/vaultorverse' },
                    { icon: MessageCircle, href: 'https://discord.gg/vaultorverse' },
                    { icon: Mail, href: 'mailto:hello@vaultorverse.com' }
                  ].map((social, index) => {
                    const SocialIcon = social.icon;
                    return (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-gray-800/50 hover:bg-luxury/10 border border-gray-700/30 hover:border-luxury/30 rounded-xl flex items-center justify-center text-gray-400 hover:text-luxury transition-all"
                      >
                        <SocialIcon className="w-5 h-5" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-luxury" />
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => {
                      const LinkIcon = link.icon;
                      return (
                        <li key={linkIndex}>
                          <Link
                            href={link.href}
                            className="flex items-center gap-2 text-gray-400 hover:text-luxury transition-colors group"
                          >
                            <LinkIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50">
          <div className="max-w-[1800px] mx-auto px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm">
                <p>© {currentYear} VaultorVerse. All rights reserved.</p>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link href="/privacy" className="hover:text-luxury transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-luxury transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-luxury transition-colors">
                  Cookie Policy
                </Link>
              </div>

              {/* Scroll to Top Button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-luxury/10 hover:bg-luxury/20 border border-luxury/30 rounded-xl flex items-center justify-center text-luxury transition-all"
                title="Scroll to top"
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Premium Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="absolute top-8 right-8 hidden lg:block"
        >
          <div className="px-4 py-2 bg-gradient-to-r from-luxury/10 to-champagne-gold/10 border border-luxury/30 rounded-full">
            <div className="flex items-center gap-2 text-luxury text-xs font-semibold">
              <Crown className="w-3 h-3" />
              Elite Platform
              <div className="w-2 h-2 bg-luxury rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}

export default LuxuryFooter;