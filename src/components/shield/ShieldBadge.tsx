'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export interface ShieldBadgeProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'icon-only';
  animate?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: {
    container: 'px-2 py-1',
    icon: 'w-3 h-3',
    text: 'text-xs'
  },
  md: {
    container: 'px-3 py-1.5',
    icon: 'w-4 h-4',
    text: 'text-sm'
  },
  lg: {
    container: 'px-4 py-2',
    icon: 'w-5 h-5',
    text: 'text-base'
  }
};

export function ShieldBadge({ 
  percentage, 
  size = 'md', 
  variant = 'default', 
  animate = true,
  className = '' 
}: ShieldBadgeProps) {
  const sizes = sizeClasses[size];

  const badgeContent = () => {
    switch (variant) {
      case 'icon-only':
        return (
          <motion.div
            className="relative"
            whileHover={animate ? { scale: 1.1 } : {}}
          >
            <Shield className={`${sizes.icon} text-luxury`} />
            {animate && (
              <motion.div
                className="absolute inset-0"
                animate={{ 
                  boxShadow: [
                    "0 0 0 rgba(255, 215, 0, 0.4)",
                    "0 0 10px rgba(255, 215, 0, 0.6)",
                    "0 0 0 rgba(255, 215, 0, 0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        );

      case 'compact':
        return (
          <div className="flex items-center gap-1">
            <Shield className={`${sizes.icon} text-luxury`} />
            <span className={`${sizes.text} font-bold text-luxury`}>
              {percentage}%
            </span>
          </div>
        );

      default:
        return (
          <div className="flex items-center gap-1.5">
            <Shield className={`${sizes.icon} text-luxury`} />
            <span className={`${sizes.text} font-semibold text-luxury uppercase tracking-wider`}>
              Shield {percentage}%
            </span>
          </div>
        );
    }
  };

  const containerClasses = variant === 'icon-only' 
    ? `p-2 rounded-full` 
    : `${sizes.container} rounded-full`;

  return (
    <motion.div
      className={`
        inline-flex items-center justify-center
        ${containerClasses}
        bg-luxury/20 
        border border-luxury/50 
        backdrop-blur-sm
        shadow-lg shadow-luxury/25
        ${className}
      `}
      whileHover={animate ? { scale: 1.05 } : {}}
      whileTap={animate ? { scale: 0.95 } : {}}
      initial={animate ? { scale: 0 } : {}}
      animate={animate ? { scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {badgeContent()}
      
      {animate && (
        <motion.div
          className="absolute inset-0 rounded-full bg-luxury/10"
          animate={{ 
            opacity: [0, 0.5, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
}