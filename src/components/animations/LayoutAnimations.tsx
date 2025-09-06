'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  Grid3X3,
  List,
  BarChart3,
  TrendingUp,
  Zap,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';

// Advanced Layout Switcher with Smooth Transitions
export interface LayoutSwitcherProps {
  layouts: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    component: React.ReactNode;
  }>;
  defaultLayout?: string;
  onLayoutChange?: (layoutId: string) => void;
  className?: string;
}

export function LayoutSwitcher({
  layouts,
  defaultLayout,
  onLayoutChange,
  className = ''
}: LayoutSwitcherProps) {
  const [activeLayout, setActiveLayout] = useState(defaultLayout || layouts[0]?.id);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLayoutChange = (layoutId: string) => {
    if (layoutId === activeLayout) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveLayout(layoutId);
      setIsTransitioning(false);
      onLayoutChange?.(layoutId);
    }, 150);
  };

  const currentLayout = layouts.find(layout => layout.id === activeLayout);

  return (
    <div className={`w-full ${className}`}>
      {/* Layout Controls */}
      <motion.div 
        className="flex items-center gap-2 mb-6"
        layout
      >
        {layouts.map((layout) => (
          <motion.button
            key={layout.id}
            onClick={() => handleLayoutChange(layout.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
              ${activeLayout === layout.id 
                ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/25' 
                : 'bg-glass-bg text-gray-400 hover:text-white hover:bg-glass-bg-light'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            {layout.icon}
            {layout.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Layout Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLayout}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTransitioning ? 0.5 : 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          layout
        >
          {currentLayout?.component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Expandable Panel with Advanced Layout Animations
export interface ExpandablePanelProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function ExpandablePanel({
  title,
  children,
  defaultExpanded = false,
  icon,
  badge,
  variant = 'default',
  className = ''
}: ExpandablePanelProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getVariantClasses = () => {
    switch (variant) {
      case 'success': return 'border-neon-green/30 bg-neon-green/5';
      case 'warning': return 'border-yellow-400/30 bg-yellow-400/5';
      case 'danger': return 'border-red-400/30 bg-red-400/5';
      default: return 'border-glass-border bg-glass-bg';
    }
  };

  return (
    <motion.div
      className={`overflow-hidden rounded-2xl border ${getVariantClasses()} ${className}`}
      layout
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Panel Header */}
      <motion.div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <motion.div
              animate={{ rotate: isExpanded ? 15 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
          )}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {badge && (
            <motion.div
              className="px-2 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {badge}
            </motion.div>
          )}
        </div>
        
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>

      {/* Panel Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              height: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 }
            }}
            className="overflow-hidden"
          >
            <motion.div
              className="p-4 border-t border-white/10"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ delay: isExpanded ? 0.1 : 0 }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Dynamic Grid Layout with Item Animations
export interface DynamicGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: number;
  gap?: number;
  itemKey: (item: T) => string;
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
  filterFn?: (item: T) => boolean;
  className?: string;
}

export function DynamicGrid<T>({
  items,
  renderItem,
  columns = 3,
  gap = 6,
  itemKey,
  sortBy,
  sortDirection = 'asc',
  filterFn,
  className = ''
}: DynamicGridProps<T>) {
  // Apply filtering
  const filteredItems = filterFn ? items.filter(filterFn) : items;
  
  // Apply sorting
  const sortedItems = sortBy ? [...filteredItems].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  }) : filteredItems;

  return (
    <LayoutGroup>
      <motion.div
        className={`grid gap-${gap} ${className}`}
        style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
        layout
      >
        <AnimatePresence>
          {sortedItems.map((item, index) => (
            <motion.div
              key={itemKey(item)}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                delay: index * 0.05
              }}
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}

// Modal with Advanced Entry/Exit Animations
export interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'slide-up' | 'scale' | 'slide-right' | '3d-flip';
  className?: string;
}

export function AnimatedModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'scale',
  className = ''
}: AnimatedModalProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-2xl';
      case 'lg': return 'max-w-4xl';
      case 'xl': return 'max-w-6xl';
      default: return 'max-w-2xl';
    }
  };

  const getVariantAnimation = () => {
    switch (variant) {
      case 'slide-up':
        return {
          initial: { y: '100vh', opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: '100vh', opacity: 0 }
        };
      case 'slide-right':
        return {
          initial: { x: '100vw', opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: '100vw', opacity: 0 }
        };
      case '3d-flip':
        return {
          initial: { rotateX: 90, opacity: 0, scale: 0.5 },
          animate: { rotateX: 0, opacity: 1, scale: 1 },
          exit: { rotateX: -90, opacity: 0, scale: 0.5 }
        };
      case 'scale':
      default:
        return {
          initial: { scale: 0.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.5, opacity: 0 }
        };
    }
  };

  const animation = getVariantAnimation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className={`
              relative w-full ${getSizeClasses()} max-h-[90vh] overflow-hidden
              glass-card rounded-2xl shadow-2xl ${className}
            `}
            style={{ perspective: '1000px' }}
            {...animation}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30 
            }}
          >
            {/* Header */}
            {title && (
              <motion.div
                className="flex items-center justify-between p-6 border-b border-glass-border"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <motion.button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </motion.div>
            )}

            {/* Content */}
            <motion.div
              className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Stagger Container for Coordinated Animations
export interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  direction = 'up',
  duration = 0.6,
  className = ''
}: StaggerContainerProps) {
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
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          variants={{
            hidden: getDirectionVariant(),
            visible: { 
              x: 0, 
              y: 0, 
              opacity: 1,
              transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12,
                duration
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Morphing Shape Component
export interface MorphingShapeProps {
  shapes: string[]; // SVG path data
  currentShape: number;
  size?: number;
  color?: string;
  duration?: number;
  className?: string;
}

export function MorphingShape({
  shapes,
  currentShape,
  size = 100,
  color = '#00ff88',
  duration = 0.8,
  className = ''
}: MorphingShapeProps) {
  const currentPath = shapes[currentShape] || shapes[0];

  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: 'visible' }}
    >
      <motion.path
        d={currentPath}
        fill={color}
        animate={{ d: currentPath }}
        transition={{ 
          duration,
          type: 'spring',
          stiffness: 100,
          damping: 15
        }}
      />
    </motion.svg>
  );
}