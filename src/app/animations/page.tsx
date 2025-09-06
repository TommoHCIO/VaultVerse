'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Sparkles,
  Wand2,
  Play,
  Pause,
  RotateCw,
  Heart,
  Star,
  Trophy,
  Gift,
  Coins,
  Shield,
  Grid3X3,
  List,
  BarChart3
} from 'lucide-react';

// Import all animation components
import {
  AnimatedButton,
  FloatingFeedback,
  AnimatedProgress,
  ScrollReveal,
  InteractiveCard,
  Celebration,
  LayoutSwitcher,
  ExpandablePanel,
  AnimatedModal,
  SwipeableCard,
  TiltCard,
  LongPress,
  PullToRefresh
} from '@/components/animations';

export default function AnimationsPage() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'success' | 'level-up' | 'achievement' | 'win'>('success');
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProgressRunning, setIsProgressRunning] = useState(false);

  // Mock data for demonstrations
  const mockItems = [
    { id: '1', name: 'Bitcoin Prediction', value: 15000, category: 'crypto' },
    { id: '2', name: 'Election Outcome', value: 8500, category: 'politics' },
    { id: '3', name: 'Sports Match', value: 12000, category: 'sports' },
    { id: '4', name: 'Tech Launch', value: 9500, category: 'tech' },
    { id: '5', name: 'Market Movement', value: 18000, category: 'finance' },
    { id: '6', name: 'Weather Prediction', value: 3500, category: 'weather' }
  ];

  const [items, setItems] = useState(mockItems);
  // Removed unused sorting state to satisfy strict TS checks

  // Progress simulation
  const runProgress = () => {
    if (isProgressRunning) return;
    
    setIsProgressRunning(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProgressRunning(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  // Layout options for LayoutSwitcher
  const layoutOptions = [
    {
      id: 'grid',
      label: 'Grid View',
      icon: <Grid3X3 className="w-4 h-4" />,
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 6).map((item) => (
            <InteractiveCard key={item.id} className="glass-card rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">{item.name}</h3>
              <p className="text-neon-green font-bold">${item.value.toLocaleString()}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full">
                {item.category}
              </span>
            </InteractiveCard>
          ))}
        </div>
      )
    },
    {
      id: 'list',
      label: 'List View',
      icon: <List className="w-4 h-4" />,
      component: (
        <div className="space-y-3">
          {items.slice(0, 6).map((item) => (
            <InteractiveCard key={item.id} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">{item.name}</h3>
                <span className="text-xs text-gray-400 capitalize">{item.category}</span>
              </div>
              <p className="text-neon-green font-bold">${item.value.toLocaleString()}</p>
            </InteractiveCard>
          ))}
        </div>
      )
    },
    {
      id: 'chart',
      label: 'Chart View',
      icon: <BarChart3 className="w-4 h-4" />,
      component: (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Value Distribution</h3>
          <div className="space-y-4">
            {items.slice(0, 6).map((item, index) => (
              <div key={item.id} className="flex items-center gap-4">
                <span className="text-sm text-gray-300 w-24 truncate">{item.name}</span>
                <div className="flex-1 bg-glass-bg rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / 20000) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                  />
                </div>
                <span className="text-sm text-neon-green font-medium w-20 text-right">
                  ${(item.value / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-vaultor-dark mesh-gradient">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Interactive{' '}
              <span className="text-neon bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green bg-clip-text text-transparent">
                Animations
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience cutting-edge micro-interactions and animations designed for 2025. 
              Built with Framer Motion and optimized for performance and accessibility.
            </p>
          </div>
        </ScrollReveal>

        {/* Pull to Refresh Demo */}
        <ScrollReveal delay={0.1}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <RotateCw className="w-6 h-6 text-neon-cyan" />
              Pull to Refresh
            </h2>
            <PullToRefresh
              onRefresh={async () => {
                await new Promise(resolve => setTimeout(resolve, 2000));
                setItems([...items].sort(() => Math.random() - 0.5));
              }}
              className="glass-card rounded-xl"
            >
              <div className="p-6 min-h-[200px]">
                <p className="text-gray-300 mb-4">Pull down on this area to refresh the content!</p>
                <div className="grid grid-cols-2 gap-4">
                  {items.slice(0, 4).map((item) => (
                    <div key={item.id} className="p-3 bg-glass-bg rounded-lg">
                      <h4 className="text-white font-medium text-sm">{item.name}</h4>
                      <p className="text-neon-green text-xs">${item.value.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </PullToRefresh>
          </div>
        </ScrollReveal>

        {/* Button Animations */}
        <ScrollReveal delay={0.2}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-neon-purple" />
              Interactive Buttons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatedButton
                variant="primary"
                onClick={() => {
                  setFeedbackType('success');
                  setShowFeedback(true);
                }}
              >
                <Sparkles className="w-4 h-4" />
                Show Success
              </AnimatedButton>

              <AnimatedButton
                variant="warning"
                onClick={() => {
                  setFeedbackType('warning');
                  setShowFeedback(true);
                }}
              >
                <Gift className="w-4 h-4" />
                Show Warning
              </AnimatedButton>

              <AnimatedButton
                variant="success"
                onClick={() => {
                  setCelebrationType('achievement');
                  setShowCelebration(true);
                }}
              >
                <Trophy className="w-4 h-4" />
                Celebrate
              </AnimatedButton>

              <AnimatedButton
                variant="secondary"
                onClick={() => setShowModal(true)}
              >
                <Wand2 className="w-4 h-4" />
                Open Modal
              </AnimatedButton>
            </div>
          </div>
        </ScrollReveal>

        {/* Progress Animations */}
        <ScrollReveal delay={0.3}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-neon-green" />
              Progress Indicators
            </h2>
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-300">Watch the animated progress bars in action:</p>
                <AnimatedButton
                  size="sm"
                  onClick={runProgress}
                  disabled={isProgressRunning}
                >
                  {isProgressRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isProgressRunning ? 'Running...' : 'Start Demo'}
                </AnimatedButton>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-2">Default Progress</h4>
                  <AnimatedProgress value={progress} animated={true} />
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Success Progress</h4>
                  <AnimatedProgress value={progress} variant="success" animated={true} />
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Warning Progress</h4>
                  <AnimatedProgress value={progress} variant="warning" animated={true} />
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Large Progress</h4>
                  <AnimatedProgress value={progress} size="lg" variant="danger" animated={true} />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Layout Animations */}
        <ScrollReveal delay={0.4}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Grid3X3 className="w-6 h-6 text-neon-cyan" />
              Layout Transitions
            </h2>
            <LayoutSwitcher
              layouts={layoutOptions}
              defaultLayout="grid"
              onLayoutChange={(layoutId) => console.log('Layout changed to:', layoutId)}
            />
          </div>
        </ScrollReveal>

        {/* Swipeable Cards */}
        <ScrollReveal delay={0.5}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-400" />
              Swipeable Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.slice(0, 2).map((item) => (
                <SwipeableCard
                  key={item.id}
                  onSwipeLeft={() => {
                    setFeedbackType('error');
                    setShowFeedback(true);
                  }}
                  onSwipeRight={() => {
                    setFeedbackType('success');
                    setShowFeedback(true);
                  }}
                  onSwipeUp={() => {
                    setFeedbackType('info');
                    setShowFeedback(true);
                  }}
                  onSwipeDown={() => {
                    setFeedbackType('warning');
                    setShowFeedback(true);
                  }}
                >
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-gray-300 mb-4">Swipe in any direction to trigger actions!</p>
                    <div className="flex justify-between items-center">
                      <span className="text-neon-green font-bold text-lg">
                        ${item.value.toLocaleString()}
                      </span>
                      <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple text-sm rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </SwipeableCard>
              ))}
            </div>
            <p className="text-center text-gray-400 text-sm mt-4">
              ← Delete | ♡ Like | ↑ Save | ↓ Share
            </p>
          </div>
        </ScrollReveal>

        {/* 3D Tilt Cards */}
        <ScrollReveal delay={0.6}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Coins className="w-6 h-6 text-shield-gold" />
              3D Tilt Effects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.slice(0, 3).map((item) => (
                <TiltCard key={item.id} tiltMaxAngle={12} glareEffect={true}>
                  <div className="glass-card rounded-2xl p-6 h-48 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                      <p className="text-gray-300 text-sm">
                        Hover and move your mouse to see the 3D tilt effect in action.
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neon-green font-bold">
                        ${item.value.toLocaleString()}
                      </span>
                      <Star className="w-5 h-5 text-shield-gold" />
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Long Press Demo */}
        <ScrollReveal delay={0.7}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-neon-purple" />
              Long Press Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LongPress
                duration={2000}
                onLongPress={() => {
                  setCelebrationType('win');
                  setShowCelebration(true);
                }}
              >
                <div className="glass-card rounded-2xl p-8 text-center cursor-pointer hover:bg-glass-bg-light transition-colors">
                  <Shield className="w-16 h-16 text-neon-purple mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Shield Activation</h3>
                  <p className="text-gray-300">Hold for 2 seconds to activate shield protection</p>
                </div>
              </LongPress>

              <LongPress
                duration={1500}
                onLongPress={() => {
                  setCelebrationType('level-up');
                  setShowCelebration(true);
                }}
              >
                <div className="glass-card rounded-2xl p-8 text-center cursor-pointer hover:bg-glass-bg-light transition-colors">
                  <Trophy className="w-16 h-16 text-shield-gold mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Level Up</h3>
                  <p className="text-gray-300">Hold for 1.5 seconds to level up</p>
                </div>
              </LongPress>
            </div>
          </div>
        </ScrollReveal>

        {/* Expandable Panels */}
        <ScrollReveal delay={0.8}>
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Expandable Content</h2>
            <div className="space-y-4">
              <ExpandablePanel
                title="Animation Performance"
                icon={<Zap className="w-5 h-5 text-neon-green" />}
                badge="Optimized"
                variant="success"
              >
                <p className="text-gray-300 leading-relaxed">
                  All animations are built with performance in mind using Framer Motion's 
                  optimized animation engine. Hardware acceleration, reduced layout shifts, 
                  and efficient re-renders ensure smooth 60fps animations across all devices.
                </p>
              </ExpandablePanel>

              <ExpandablePanel
                title="Accessibility Features"
                icon={<Heart className="w-5 h-5 text-neon-purple" />}
                badge="WCAG 2.1"
              >
                <p className="text-gray-300 leading-relaxed">
                  Respects user preferences for reduced motion, includes proper ARIA labels, 
                  maintains focus management, and provides alternative interaction methods 
                  for users with different abilities.
                </p>
              </ExpandablePanel>

              <ExpandablePanel
                title="Gesture Support"
                icon={<Sparkles className="w-5 h-5 text-neon-cyan" />}
                badge="Multi-touch"
              >
                <p className="text-gray-300 leading-relaxed">
                  Full support for touch gestures including swipe, pinch-to-zoom, long press, 
                  and pull-to-refresh. All gestures work seamlessly across desktop, tablet, 
                  and mobile devices with appropriate feedback.
                </p>
              </ExpandablePanel>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Floating Feedback */}
      <FloatingFeedback
        type={feedbackType}
        message={
          feedbackType === 'success' ? 'Action completed successfully!' :
          feedbackType === 'error' ? 'Action was cancelled' :
          feedbackType === 'warning' ? 'Warning: Please review your action' :
          'Information: Action noted'
        }
        isVisible={showFeedback}
        onClose={() => setShowFeedback(false)}
        position="top-right"
      />

      {/* Celebration Animation */}
      <Celebration
        isVisible={showCelebration}
        type={celebrationType}
        onComplete={() => setShowCelebration(false)}
      />

      {/* Modal Demo */}
      <AnimatedModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Interactive Modal"
        variant="3d-flip"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-gray-300 leading-relaxed">
            This modal demonstrates advanced entry and exit animations using Framer Motion. 
            The 3D flip effect creates an engaging user experience while maintaining 
            performance and accessibility standards.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card rounded-xl p-4">
              <h4 className="font-semibold text-white mb-2">Performance</h4>
              <p className="text-sm text-gray-400">
                Optimized animations with hardware acceleration and minimal layout shifts.
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <h4 className="font-semibold text-white mb-2">Accessibility</h4>
              <p className="text-sm text-gray-400">
                Respects reduced motion preferences and maintains focus management.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <AnimatedButton
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Close
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              onClick={() => {
                setShowModal(false);
                setFeedbackType('success');
                setShowFeedback(true);
              }}
            >
              Confirm
            </AnimatedButton>
          </div>
        </div>
      </AnimatedModal>
    </div>
  );
}
