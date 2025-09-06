'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, PanInfo } from 'framer-motion';
import { 
  RotateCcw, 
  RotateCw, 
  Move, 
  ZoomIn, 
  ZoomOut,
  Trash2,
  Heart,
  Star,
  Bookmark,
  Share,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

// Draggable Card with Swipe Actions
export interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  swipeThreshold?: number;
  leftAction?: { icon: React.ReactNode; color: string; label: string };
  rightAction?: { icon: React.ReactNode; color: string; label: string };
  upAction?: { icon: React.ReactNode; color: string; label: string };
  downAction?: { icon: React.ReactNode; color: string; label: string };
  className?: string;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 150,
  leftAction = { icon: <Trash2 className="w-6 h-6" />, color: 'bg-red-500', label: 'Delete' },
  rightAction = { icon: <Heart className="w-6 h-6" />, color: 'bg-neon-green', label: 'Like' },
  upAction = { icon: <Bookmark className="w-6 h-6" />, color: 'bg-neon-purple', label: 'Save' },
  downAction = { icon: <Share className="w-6 h-6" />, color: 'bg-neon-cyan', label: 'Share' },
  className = ''
}: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const opacity = useTransform([x, y], ([xVal, yVal]) => {
    const distance = Math.sqrt(xVal * xVal + yVal * yVal);
    return Math.max(1 - distance / 300, 0.3);
  });

  // Action visibility based on drag direction
  const leftActionOpacity = useTransform(x, [-swipeThreshold, 0], [1, 0]);
  const rightActionOpacity = useTransform(x, [0, swipeThreshold], [0, 1]);
  const upActionOpacity = useTransform(y, [-swipeThreshold, 0], [1, 0]);
  const downActionOpacity = useTransform(y, [0, swipeThreshold], [0, 1]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    const { offset, velocity } = info;
    const swipeX = Math.abs(offset.x) > Math.abs(offset.y);
    
    if (swipeX) {
      if (offset.x > swipeThreshold || velocity.x > 500) {
        onSwipeRight?.();
      } else if (offset.x < -swipeThreshold || velocity.x < -500) {
        onSwipeLeft?.();
      }
    } else {
      if (offset.y < -swipeThreshold || velocity.y < -500) {
        onSwipeUp?.();
      } else if (offset.y > swipeThreshold || velocity.y > 500) {
        onSwipeDown?.();
      }
    }
    
    // Reset position
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative">
      {/* Action Indicators */}
      {leftAction && (
        <motion.div
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${leftAction.color} rounded-full p-3 text-white`}
          style={{ opacity: leftActionOpacity }}
        >
          {leftAction.icon}
        </motion.div>
      )}
      
      {rightAction && (
        <motion.div
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 ${rightAction.color} rounded-full p-3 text-white`}
          style={{ opacity: rightActionOpacity }}
        >
          {rightAction.icon}
        </motion.div>
      )}
      
      {upAction && (
        <motion.div
          className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 ${upAction.color} rounded-full p-3 text-white`}
          style={{ opacity: upActionOpacity }}
        >
          {upAction.icon}
        </motion.div>
      )}
      
      {downAction && (
        <motion.div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 ${downAction.color} rounded-full p-3 text-white`}
          style={{ opacity: downActionOpacity }}
        >
          {downAction.icon}
        </motion.div>
      )}

      {/* Draggable Card */}
      <motion.div
        className={`cursor-grab active:cursor-grabbing ${className}`}
        style={{ x, y, rotate, opacity }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.7}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.95 }}
        animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Pinch-to-Zoom Image Viewer
export interface PinchZoomProps {
  src: string;
  alt: string;
  className?: string;
  maxZoom?: number;
  minZoom?: number;
}

export function PinchZoom({
  src,
  alt,
  className = '',
  maxZoom = 3,
  minZoom = 1
}: PinchZoomProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const scaleMotionValue = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(minZoom, Math.min(maxZoom, scale + delta));
    setScale(newScale);
    scaleMotionValue.set(newScale);
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    scaleMotionValue.set(1);
    x.set(0);
    y.set(0);
  };

  const zoomIn = () => {
    const newScale = Math.min(maxZoom, scale + 0.5);
    setScale(newScale);
    scaleMotionValue.set(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(minZoom, scale - 0.5);
    setScale(newScale);
    scaleMotionValue.set(newScale);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-glass-bg ${className}`}>
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <motion.button
          className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
          onClick={zoomIn}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomIn className="w-4 h-4" />
        </motion.button>
        <motion.button
          className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
          onClick={zoomOut}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ZoomOut className="w-4 h-4" />
        </motion.button>
        <motion.button
          className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
          onClick={resetZoom}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Zoomable Image */}
      <motion.div
        className="w-full h-full flex items-center justify-center cursor-move"
        style={{ scale: scaleMotionValue, x, y }}
        drag={scale > 1}
        dragConstraints={{
          left: -(scale - 1) * 200,
          right: (scale - 1) * 200,
          top: -(scale - 1) * 150,
          bottom: (scale - 1) * 150
        }}
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
        />
      </motion.div>
    </div>
  );
}

// Interactive 3D Card with Tilt Effect
export interface TiltCardProps {
  children: React.ReactNode;
  tiltMaxAngle?: number;
  glareEffect?: boolean;
  scaleOnHover?: number;
  className?: string;
}

export function TiltCard({
  children,
  tiltMaxAngle = 15,
  glareEffect = true,
  scaleOnHover = 1.05,
  className = ''
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [tiltMaxAngle, -tiltMaxAngle]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-tiltMaxAngle, tiltMaxAngle]);

  const handleMouse = (event: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((event.clientX - centerX) / rect.width);
    y.set((event.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative perspective-1000 ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: scaleOnHover }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="relative transform-gpu">
        {children}
        
        {/* Glare Effect */}
        {glareEffect && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-xl pointer-events-none"
            style={{
              background: useTransform(
                [x, y],
                ([xPos, yPos]) => 
                  `linear-gradient(${135 + xPos * 20 + yPos * 20}deg, rgba(255,255,255,${0.1 + Math.abs(xPos) * 0.1 + Math.abs(yPos) * 0.1}) 0%, transparent 50%)`
              )
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

// Long Press Gesture Component
export interface LongPressProps {
  children: React.ReactNode;
  onLongPress: () => void;
  duration?: number;
  className?: string;
}

export function LongPress({
  children,
  onLongPress,
  duration = 1000,
  className = ''
}: LongPressProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const startPress = () => {
    setIsPressed(true);
    setProgress(0);
    
    const startTime = Date.now();
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1) * 100;
      setProgress(newProgress);
    }, 16);
    
    timeoutRef.current = setTimeout(() => {
      setIsPressed(false);
      setProgress(0);
      onLongPress();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, duration);
  };

  const endPress = () => {
    setIsPressed(false);
    setProgress(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <motion.div
      className={`relative cursor-pointer select-none ${className}`}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      whilePressed={{ scale: 0.95 }}
    >
      {children}
      
      {/* Progress Ring */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(0, 255, 136, 0.3)"
              strokeWidth="4"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#00ff88"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="100%"
              strokeDashoffset={`${100 - progress}%`}
              transition={{ duration: 0.1 }}
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}

// Pull-to-Refresh Component
export interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  refreshThreshold?: number;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  refreshThreshold = 80,
  className = ''
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);
  
  const refreshProgress = useTransform(
    y,
    [0, refreshThreshold],
    [0, 100]
  );

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (pullDistance >= refreshThreshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        y.set(0);
      }
    } else {
      setPullDistance(0);
      y.set(0);
    }
  };

  const handleDrag = (event: any, info: PanInfo) => {
    const newDistance = Math.max(0, info.offset.y);
    setPullDistance(newDistance);
    y.set(newDistance);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Pull Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 z-10"
        style={{
          opacity: useTransform(y, [0, refreshThreshold], [0, 1]),
          y: useTransform(y, [0, refreshThreshold], [-40, 0])
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full"
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            style={{ 
              rotate: useTransform(refreshProgress, [0, 100], [0, 360])
            }}
            transition={isRefreshing ? {
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            } : { duration: 0 }}
          />
          <motion.span
            className="text-sm text-gray-400"
            animate={{ opacity: pullDistance >= refreshThreshold ? 1 : 0.6 }}
          >
            {isRefreshing ? 'Refreshing...' : 
             pullDistance >= refreshThreshold ? 'Release to refresh' : 'Pull to refresh'}
          </motion.span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </div>
  );
}