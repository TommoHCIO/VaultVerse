'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  Users, 
  Trophy, 
  Zap, 
  Crown,
  Sparkles,
  Timer,
  Award
} from 'lucide-react';

export interface EventCountdownProps {
  eventTitle: string;
  eventDescription: string;
  startTime: Date;
  prizePool: number;
  participantCount: number;
  totalQuestions: number;
  duration: number; // in minutes
  onEventStart?: () => void;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function EventCountdown({
  eventTitle,
  eventDescription,
  startTime,
  prizePool,
  participantCount,
  totalQuestions,
  duration,
  onEventStart,
  className = ''
}: EventCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isEventStarted, setIsEventStarted] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const eventTime = startTime.getTime();
      const timeDiff = eventTime - now;

      if (timeDiff <= 0) {
        setIsEventStarted(true);
        if (onEventStart) {
          onEventStart();
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    const updateCountdown = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      // Add pulse effect when under 10 seconds
      if (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds <= 10 && remaining.seconds > 0) {
        setPulseEffect(true);
        setTimeout(() => setPulseEffect(false), 500);
      }
    };

    // Update immediately
    updateCountdown();

    // Set up interval
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [startTime, onEventStart]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const isUrgent = timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes < 5;
  const isCritical = timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds <= 30;

  if (isEventStarted) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-success/20 via-luxury/10 to-transparent border border-emerald-success/30 backdrop-blur-md ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-success/10 to-luxury/10 animate-pulse" />
        
        <div className="relative z-10 p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-success to-luxury rounded-full flex items-center justify-center"
          >
            <Zap className="w-10 h-10 text-deep-navy" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-emerald-success mb-4">Event is Live!</h2>
          <p className="text-lg text-platinum-dark mb-6">{eventTitle}</p>
          
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-emerald-success">
              <div className="w-3 h-3 rounded-full bg-emerald-success animate-pulse" />
              <span className="font-bold">NOW LIVE</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Countdown Card */}
      <motion.div
        className={`relative overflow-hidden rounded-3xl backdrop-blur-md border transition-all duration-500 ${
          isCritical 
            ? 'bg-gradient-to-br from-burgundy-danger/20 via-deep-navy/90 to-burgundy-danger/10 border-burgundy-danger/50 shadow-2xl shadow-burgundy-danger/20' 
            : isUrgent
            ? 'bg-gradient-to-br from-luxury/20 via-deep-navy/90 to-luxury/10 border-luxury/50 shadow-2xl shadow-luxury/20'
            : 'bg-gradient-to-br from-deep-navy/90 via-navy-medium/80 to-luxury/5 border-luxury/20 shadow-xl shadow-luxury/10'
        } ${pulseEffect ? 'animate-pulse' : ''}`}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-success/10 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 p-8">
          {/* Event Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury/20 border border-luxury/30 mb-4"
              animate={{ 
                boxShadow: [
                  "0 0 0 rgba(255, 215, 0, 0.3)",
                  "0 0 20px rgba(255, 215, 0, 0.5)",
                  "0 0 0 rgba(255, 215, 0, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-4 h-4 text-luxury" />
              <span className="text-sm font-bold text-luxury uppercase tracking-wider">Executive Summit</span>
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-executive mb-3 leading-tight">
              {eventTitle}
            </h1>
            <p className="text-platinum-dark max-w-2xl mx-auto leading-relaxed">
              {eventDescription}
            </p>
          </div>

          {/* Countdown Display */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { value: timeRemaining.days, label: 'Days', icon: Calendar },
              { value: timeRemaining.hours, label: 'Hours', icon: Clock },
              { value: timeRemaining.minutes, label: 'Minutes', icon: Timer },
              { value: timeRemaining.seconds, label: 'Seconds', icon: Sparkles }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.label}
                  className={`relative p-4 md:p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                    item.label === 'Seconds' && isCritical
                      ? 'bg-burgundy-danger/20 border-burgundy-danger/50'
                      : item.label === 'Minutes' && isUrgent
                      ? 'bg-luxury/20 border-luxury/50'
                      : 'bg-glass-bg border-platinum/20'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  animate={item.label === 'Seconds' && timeRemaining.seconds <= 10 ? { 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0 rgba(239, 68, 68, 0.4)",
                      "0 0 20px rgba(239, 68, 68, 0.6)",
                      "0 0 0 rgba(239, 68, 68, 0.4)"
                    ]
                  } : {}}
                  transition={{ 
                    duration: item.label === 'Seconds' && timeRemaining.seconds <= 10 ? 1 : 0.3,
                    repeat: item.label === 'Seconds' && timeRemaining.seconds <= 10 ? Infinity : 0
                  }}
                >
                  <div className="text-center">
                    <IconComponent className={`w-5 h-5 mx-auto mb-2 ${
                      item.label === 'Seconds' && isCritical ? 'text-burgundy-danger' :
                      item.label === 'Minutes' && isUrgent ? 'text-luxury' :
                      'text-platinum'
                    }`} />
                    <div className={`text-3xl md:text-4xl font-bold mb-1 tabular-nums ${
                      item.label === 'Seconds' && isCritical ? 'text-burgundy-danger' :
                      item.label === 'Minutes' && isUrgent ? 'text-luxury' :
                      'text-executive'
                    }`}>
                      {formatNumber(item.value)}
                    </div>
                    <div className="text-xs text-platinum-dark uppercase tracking-wider font-medium">
                      {item.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Event Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              className="p-4 rounded-xl bg-glass-bg border border-luxury/20 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <DollarSign className="w-5 h-5 mx-auto mb-2 text-luxury" />
              <div className="text-lg font-bold text-luxury mb-1">
                ${prizePool.toLocaleString()}
              </div>
              <div className="text-xs text-platinum-dark uppercase tracking-wider">Prize Pool</div>
            </motion.div>

            <motion.div 
              className="p-4 rounded-xl bg-glass-bg border border-emerald-success/20 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <Users className="w-5 h-5 mx-auto mb-2 text-emerald-success" />
              <div className="text-lg font-bold text-emerald-success mb-1">
                {participantCount.toLocaleString()}
              </div>
              <div className="text-xs text-platinum-dark uppercase tracking-wider">Participants</div>
            </motion.div>

            <motion.div 
              className="p-4 rounded-xl bg-glass-bg border border-sapphire-info/20 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <Trophy className="w-5 h-5 mx-auto mb-2 text-sapphire-info" />
              <div className="text-lg font-bold text-sapphire-info mb-1">
                {totalQuestions}
              </div>
              <div className="text-xs text-platinum-dark uppercase tracking-wider">Questions</div>
            </motion.div>

            <motion.div 
              className="p-4 rounded-xl bg-glass-bg border border-executive/20 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <Clock className="w-5 h-5 mx-auto mb-2 text-executive" />
              <div className="text-lg font-bold text-executive mb-1">
                {duration}m
              </div>
              <div className="text-xs text-platinum-dark uppercase tracking-wider">Duration</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Status Indicator */}
      <motion.div
        className={`p-4 rounded-xl backdrop-blur-md border text-center ${
          isCritical 
            ? 'bg-burgundy-danger/10 border-burgundy-danger/30' 
            : isUrgent
            ? 'bg-luxury/10 border-luxury/30'
            : 'bg-emerald-success/10 border-emerald-success/30'
        }`}
        animate={isCritical ? { 
          boxShadow: [
            "0 0 0 rgba(239, 68, 68, 0.3)",
            "0 0 15px rgba(239, 68, 68, 0.5)",
            "0 0 0 rgba(239, 68, 68, 0.3)"
          ]
        } : {}}
        transition={{ duration: 1, repeat: isCritical ? Infinity : 0 }}
      >
        <div className="flex items-center justify-center gap-2">
          <motion.div 
            className={`w-3 h-3 rounded-full ${
              isCritical ? 'bg-burgundy-danger' :
              isUrgent ? 'bg-luxury' : 
              'bg-emerald-success'
            }`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className={`font-semibold ${
            isCritical ? 'text-burgundy-danger' :
            isUrgent ? 'text-luxury' :
            'text-emerald-success'
          }`}>
            {isCritical ? 'STARTING IMMINENTLY' :
             isUrgent ? 'STARTING SOON' :
             'GET READY'}
          </span>
        </div>
        
        {!isCritical && (
          <p className="text-sm text-platinum-dark mt-2">
            Join the most sophisticated prediction market competition. Premium rewards await top performers.
          </p>
        )}
      </motion.div>
    </div>
  );
}