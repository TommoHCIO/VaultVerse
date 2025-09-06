'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';

interface TouchGestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPullToRefresh?: () => void;
  onLongPress?: () => void;
  swipeThreshold?: number;
  pullThreshold?: number;
  longPressDelay?: number;
  className?: string;
  disabled?: boolean;
}

export function TouchGestureHandler({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPullToRefresh,
  onLongPress,
  swipeThreshold = 100,
  pullThreshold = 120,
  longPressDelay = 500,
  className = '',
  disabled = false
}: TouchGestureHandlerProps) {
  const { settings, announceToScreenReader } = useAccessibility();
  const containerRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Transform values for visual feedback
  const rotateX = useTransform(y, [-pullThreshold, 0, pullThreshold], [-10, 0, 10]);
  const rotateY = useTransform(x, [-swipeThreshold, 0, swipeThreshold], [10, 0, -10]);
  const scale = useTransform([x, y], ([latestX, latestY]) => {
    const distance = Math.sqrt(latestX * latestX + latestY * latestY);
    return 1 + Math.min(distance / 500, 0.1);
  });

  // Haptic feedback for supported devices
  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // Handle pan start
  const handlePanStart = useCallback(() => {
    if (disabled || settings.reducedMotion) return;
    
    hapticFeedback('light');
    
    // Start long press timer
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        hapticFeedback('heavy');
        onLongPress();
        announceToScreenReader('Long press action triggered');
      }, longPressDelay);
    }
  }, [disabled, settings.reducedMotion, hapticFeedback, onLongPress, longPressDelay, announceToScreenReader]);

  // Handle pan
  const handlePan = useCallback((_: Event, info: PanInfo) => {
    if (disabled) return;
    
    x.set(info.offset.x);
    y.set(info.offset.y);
    
    // Clear long press timer on movement
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Pull to refresh feedback
    if (onPullToRefresh && info.offset.y > pullThreshold * 0.7) {
      hapticFeedback('medium');
    }
  }, [disabled, x, y, onPullToRefresh, pullThreshold, hapticFeedback]);

  // Handle pan end
  const handlePanEnd = useCallback((_: Event, info: PanInfo) => {
    if (disabled) return;
    
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    const { offset, velocity } = info;
    const absOffsetX = Math.abs(offset.x);
    const absOffsetY = Math.abs(offset.y);
    const absVelocityX = Math.abs(velocity.x);
    const absVelocityY = Math.abs(velocity.y);
    
    // Determine if it's a valid swipe based on distance and velocity
    const isHorizontalSwipe = absOffsetX > swipeThreshold || absVelocityX > 300;
    const isVerticalSwipe = absOffsetY > swipeThreshold || absVelocityY > 300;
    
    // Prioritize the direction with more movement
    if (isHorizontalSwipe && absOffsetX > absOffsetY) {
      hapticFeedback('medium');
      if (offset.x > 0 && onSwipeRight) {
        onSwipeRight();
        announceToScreenReader('Swiped right');
      } else if (offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
        announceToScreenReader('Swiped left');
      }
    } else if (isVerticalSwipe && absOffsetY > absOffsetX) {
      hapticFeedback('medium');
      if (offset.y > 0 && offset.y > pullThreshold && onPullToRefresh) {
        onPullToRefresh();
        announceToScreenReader('Pull to refresh triggered');
      } else if (offset.y > 0 && onSwipeDown) {
        onSwipeDown();
        announceToScreenReader('Swiped down');
      } else if (offset.y < 0 && onSwipeUp) {
        onSwipeUp();
        announceToScreenReader('Swiped up');
      }
    }
    
    // Reset position with animation
    x.set(0);
    y.set(0);
  }, [
    disabled,
    swipeThreshold,
    pullThreshold,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPullToRefresh,
    hapticFeedback,
    announceToScreenReader,
    x,
    y
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Touch-specific event handlers for better mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Prevent default scroll behavior for certain gestures
    if (onPullToRefresh && window.scrollY === 0) {
      e.preventDefault();
    }
  }, [onPullToRefresh]);

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={containerRef}
      className={`touch-manipulation ${className}`}
      style={{
        x: settings.reducedMotion ? 0 : x,
        y: settings.reducedMotion ? 0 : y,
        rotateX: settings.reducedMotion ? 0 : rotateX,
        rotateY: settings.reducedMotion ? 0 : rotateY,
        scale: settings.reducedMotion ? 1 : scale,
      }}
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      onTouchStart={handleTouchStart}
      drag={false}
      whileTap={settings.reducedMotion ? {} : { scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: settings.reducedMotion ? 0 : undefined
      }}
    >
      {children}
      
      {/* Pull to Refresh Indicator */}
      {onPullToRefresh && (
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
          style={{
            opacity: useTransform(y, [0, pullThreshold], [0, 1]),
            scale: useTransform(y, [0, pullThreshold], [0.5, 1]),
          }}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-neon-green/20 rounded-full backdrop-blur-sm">
            <motion.div
              className="w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Hook for handling touch gestures in components
export function useTouchGestures() {
  const { settings } = useAccessibility();
  
  const createGestureHandler = useCallback((
    gestures: Partial<TouchGestureHandlerProps>
  ) => {
    return {
      onTouchStart: (e: TouchEvent) => {
        if (settings.reducedMotion) return;
        // Handle touch start
      },
      onTouchMove: (e: TouchEvent) => {
        if (settings.reducedMotion) return;
        // Handle touch move
      },
      onTouchEnd: (e: TouchEvent) => {
        if (settings.reducedMotion) return;
        // Handle touch end
      }
    };
  }, [settings.reducedMotion]);
  
  return { createGestureHandler };
}

// Higher-order component for adding touch gestures to any component
export function withTouchGestures<P extends object>(
  Component: React.ComponentType<P>,
  defaultGestures?: Partial<TouchGestureHandlerProps>
) {
  return function TouchGestureEnhanced(props: P & Partial<TouchGestureHandlerProps>) {
    const {
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
      onPullToRefresh,
      onLongPress,
      swipeThreshold,
      pullThreshold,
      longPressDelay,
      ...componentProps
    } = props;

    const gestureProps = {
      onSwipeLeft: onSwipeLeft || defaultGestures?.onSwipeLeft,
      onSwipeRight: onSwipeRight || defaultGestures?.onSwipeRight,
      onSwipeUp: onSwipeUp || defaultGestures?.onSwipeUp,
      onSwipeDown: onSwipeDown || defaultGestures?.onSwipeDown,
      onPullToRefresh: onPullToRefresh || defaultGestures?.onPullToRefresh,
      onLongPress: onLongPress || defaultGestures?.onLongPress,
      swipeThreshold,
      pullThreshold,
      longPressDelay,
    };

    return (
      <TouchGestureHandler {...gestureProps}>
        <Component {...(componentProps as P)} />
      </TouchGestureHandler>
    );
  };
}

// Preset gesture configurations for common use cases
export const gesturePresets = {
  navigation: {
    onSwipeLeft: () => window.history.forward(),
    onSwipeRight: () => window.history.back(),
    swipeThreshold: 80
  },
  
  refresh: {
    onPullToRefresh: () => window.location.reload(),
    pullThreshold: 100
  },
  
  modal: {
    onSwipeDown: () => {
      // Close modal
      const closeButton = document.querySelector('[data-close-modal]') as HTMLElement;
      closeButton?.click();
    },
    swipeThreshold: 120
  },
  
  cards: {
    onSwipeLeft: () => {}, // Implement card dismiss
    onSwipeRight: () => {}, // Implement card action
    onLongPress: () => {}, // Implement card options
    swipeThreshold: 100,
    longPressDelay: 400
  }
};