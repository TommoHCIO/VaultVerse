'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation, useInView, AnimatePresence, MotionProps } from 'framer-motion';
import { useRef } from 'react';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Zap,
  Heart,
  Star,
  Trophy,
  Shield,
  Coins
} from 'lucide-react';

// Enhanced Button with Micro-interactions
export interface AnimatedButtonProps extends MotionProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  success?: boolean;
  className?: string;
}

export function AnimatedButton({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  success = false,
  className = '',
  ...motionProps
}: AnimatedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary': return 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white';
      case 'secondary': return 'bg-glass-bg border border-glass-border text-white';
      case 'success': return 'bg-gradient-to-r from-neon-green to-green-500 text-white';
      case 'warning': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'danger': return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      default: return 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-3 py-1.5 text-sm';
      case 'md': return 'px-6 py-3 text-base';
      case 'lg': return 'px-8 py-4 text-lg';
      default: return 'px-6 py-3 text-base';
    }
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-xl font-semibold transition-all duration-300
        ${getVariantClasses()} ${getSizeClasses()} ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      animate={{
        y: isPressed ? 1 : 0,
      }}
      {...motionProps}
    >
      {/* Ripple Effect */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: isPressed ? 4 : 0, opacity: isPressed ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Success State */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-neon-green rounded-xl"
          >
            <CheckCircle className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* Button Content */}
      <motion.span
        className={`flex items-center justify-center gap-2 ${loading ? 'invisible' : 'visible'}`}
        animate={{ opacity: showSuccess ? 0 : 1 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

// Floating Feedback Notifications
export interface FloatingFeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
  duration?: number;
}

export function FloatingFeedback({
  type,
  message,
  isVisible,
  onClose,
  position = 'top-right',
  duration = 3000
}: FloatingFeedbackProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-neon-green" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'info': return <Sparkles className="w-5 h-5 text-neon-cyan" />;
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default: return 'top-4 right-4';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed z-50 ${getPositionClasses()}`}
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="glass-card rounded-xl p-4 flex items-center gap-3 min-w-[300px] shadow-2xl"
            animate={{ x: [0, -5, 5, 0] }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {getIcon()}
            <span className="text-white font-medium flex-1">{message}</span>
            {onClose && (
              <motion.button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <XCircle className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Progress Indicators with Animations
export interface AnimatedProgressProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

export function AnimatedProgress({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showValue = true,
  animated = true,
  className = ''
}: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getVariantColors = () => {
    switch (variant) {
      case 'success': return 'from-neon-green to-green-500';
      case 'warning': return 'from-yellow-400 to-orange-500';
      case 'danger': return 'from-red-400 to-red-600';
      default: return 'from-neon-purple to-neon-cyan';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-2';
      case 'md': return 'h-3';
      case 'lg': return 'h-4';
      default: return 'h-3';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-glass-bg rounded-full overflow-hidden ${getSizeClasses()}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${getVariantColors()} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1.5 : 0, ease: 'easeOut' }}
        >
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </motion.div>
      </div>
      {showValue && (
        <motion.div
          className="mt-2 text-sm text-gray-300 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(percentage)}%
        </motion.div>
      )}
    </div>
  );
}

// Scroll-triggered Animations
export interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className = ''
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-10% 0px',
    amount: threshold 
  });

  const getDirectionVariant = () => {
    switch (direction) {
      case 'up': return { y: 40, opacity: 0 };
      case 'down': return { y: -40, opacity: 0 };
      case 'left': return { x: 40, opacity: 0 };
      case 'right': return { x: -40, opacity: 0 };
      default: return { y: 40, opacity: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getDirectionVariant()}
      animate={isInView ? { x: 0, y: 0, opacity: 1 } : getDirectionVariant()}
      transition={{ 
        duration,
        delay,
        type: 'spring',
        stiffness: 100,
        damping: 10
      }}
    >
      {children}
    </motion.div>
  );
}

// Interactive Card Hover Effects
export interface InteractiveCardProps {
  children: React.ReactNode;
  tiltEffect?: boolean;
  glowEffect?: boolean;
  scaleEffect?: boolean;
  className?: string;
  onClick?: () => void;
}

export function InteractiveCard({
  children,
  tiltEffect = true,
  glowEffect = true,
  scaleEffect = true,
  className = '',
  onClick
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{
        scale: scaleEffect ? 1.05 : 1,
        rotateX: tiltEffect ? 5 : 0,
        rotateY: tiltEffect ? 5 : 0,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Glow Effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 rounded-2xl blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle Highlight */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Achievement Celebration Animation
export interface CelebrationProps {
  isVisible: boolean;
  type?: 'success' | 'level-up' | 'achievement' | 'win';
  onComplete?: () => void;
}

export function Celebration({
  isVisible,
  type = 'success',
  onComplete
}: CelebrationProps) {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-16 h-16 text-neon-green" />;
      case 'level-up': return <TrendingUp className="w-16 h-16 text-neon-purple" />;
      case 'achievement': return <Trophy className="w-16 h-16 text-shield-gold" />;
      case 'win': return <Star className="w-16 h-16 text-neon-cyan" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={onComplete}
        >
          {/* Confetti Effect */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-3 h-3 ${
                i % 4 === 0 ? 'bg-neon-green' :
                i % 4 === 1 ? 'bg-neon-purple' :
                i % 4 === 2 ? 'bg-neon-cyan' : 'bg-shield-gold'
              } rounded`}
              initial={{ 
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 800,
                y: Math.random() * -400 - 200,
                opacity: 0,
                scale: [0, 1, 0],
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}

          {/* Main Icon */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: [0, 1.2, 1], y: 0 }}
            exit={{ scale: 0, y: -50 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 15
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.8,
                repeat: 2
              }}
            >
              {getIcon()}
            </motion.div>
            
            <motion.div
              className="text-2xl font-bold text-white bg-glass-card rounded-xl px-6 py-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {type === 'success' && 'Success!'}
              {type === 'level-up' && 'Level Up!'}
              {type === 'achievement' && 'Achievement Unlocked!'}
              {type === 'win' && 'You Won!'}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}