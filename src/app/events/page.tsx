'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Clock,
  Users,
  Trophy,
  Zap,
  Target,
  Shield,
  Star,
  Crown,
  Flame,
  AlertCircle,
  Volume2,
  VolumeX,
  Settings,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  DollarSign,
  Timer,
  CheckCircle,
  XCircle,
  Medal,
  Award,
  Sparkles,
  Activity
} from 'lucide-react';

// Mock event data structure
interface EventQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number; // seconds
  points: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  category: 'crypto' | 'politics' | 'sports' | 'tech' | 'entertainment';
}

interface EventSession {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  duration: number; // minutes
  totalQuestions: number;
  prizePool: number;
  participants: number;
  status: 'upcoming' | 'live' | 'finished';
  questions: EventQuestion[];
  leaderboard: Array<{
    rank: number;
    username: string;
    score: number;
    streak: number;
    avatar: string;
    isVip: boolean;
  }>;
}

interface UserAnswer {
  questionId: string;
  selectedOption: number;
  timeToAnswer: number;
  isCorrect: boolean;
  pointsEarned: number;
}

// Mock data
const mockEvent: EventSession = {
  id: 'event-001',
  title: "💎 Executive Summit: Digital Assets Intelligence Brief",
  description: "25 high-stakes market predictions on institutional-grade digital asset movements. Demonstrate executive market intelligence and earn USDC rewards.",
  startTime: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
  duration: 15,
  totalQuestions: 25,
  prizePool: 250000,
  participants: 347,
  status: 'upcoming' as const,
  questions: [
    {
      id: 'q1',
      question: "Based on institutional flows and macroeconomic indicators, what is Bitcoin's 24-hour price trajectory?",
      options: ["Bullish +2-5% (Institutional accumulation)", "Bearish -2-5% (Risk-off sentiment)", "Range-bound ±2% (Consolidation phase)", "Volatile >5% (Macro catalyst event)"],
      correctAnswer: 0,
      timeLimit: 15,
      points: 10000,
      difficulty: 'medium',
      category: 'crypto'
    },
    {
      id: 'q2',
      question: "Which institutional-grade DeFi protocol will capture the highest total value locked by quarter-end?",
      options: ["Uniswap V4 (Institutional AMM)", "Aave (Enterprise Lending)", "MakerDAO (Corporate Treasury)", "Compound (Institutional Credit)"],
      correctAnswer: 1,
      timeLimit: 20,
      points: 15000,
      difficulty: 'hard',
      category: 'crypto'
    }
  ],
  leaderboard: [
    { rank: 1, username: "InstitutionalAlpha", score: 1245000, streak: 8, avatar: "💼", isVip: true },
    { rank: 2, username: "ExecutiveEdge", score: 1120000, streak: 5, avatar: "👔", isVip: true },
    { rank: 3, username: "WealthAdvisor", score: 1089000, streak: 12, avatar: "💎", isVip: false },
    { rank: 4, username: "HedgeFundCIO", score: 975000, streak: 3, avatar: "🏛️", isVip: false },
    { rank: 5, username: "PortfolioMgr", score: 890000, streak: 7, avatar: "📊", isVip: false }
  ]
};

const difficultyColors = {
  easy: 'text-emerald',
  medium: 'text-luxury',
  hard: 'text-executive',
  extreme: 'text-platinum'
};

const categoryEmojis = {
  crypto: '💎',
  politics: '🏛️',
  sports: '📊',
  tech: '⚡',
  entertainment: '🎯'
};

export default function EventsPage() {
  const [event] = useState<EventSession>(mockEvent);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [eventCountdown, setEventCountdown] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [userScore, setUserScore] = useState(0);
  const [userStreak, setUserStreak] = useState(0);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'live' | 'question' | 'results' | 'finished'>('waiting');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Countdown to event start
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const startTime = event.startTime.getTime();
      const remaining = Math.max(0, startTime - now);
      setEventCountdown(remaining);
      
      if (remaining === 0 && gamePhase === 'waiting') {
        setGamePhase('live');
        startNextQuestion();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event.startTime, gamePhase]);

  // Question timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gamePhase === 'question' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gamePhase, timeRemaining]);

  const startNextQuestion = useCallback(() => {
    if (currentQuestionIndex < event.questions.length) {
      const question = event.questions[currentQuestionIndex];
      setTimeRemaining(question.timeLimit);
      setSelectedAnswer(null);
      setAnswerSubmitted(false);
      setQuestionStartTime(Date.now());
      setGamePhase('question');
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 500);
    } else {
      setGamePhase('finished');
    }
  }, [currentQuestionIndex, event.questions]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (answerSubmitted || gamePhase !== 'question') return;
    
    setSelectedAnswer(optionIndex);
    setAnswerSubmitted(true);
    
    const question = event.questions[currentQuestionIndex];
    const timeToAnswer = Date.now() - questionStartTime;
    const isCorrect = optionIndex === question.correctAnswer;
    
    // Calculate points with time bonus
    const timeBonus = Math.max(0, (question.timeLimit - Math.floor(timeToAnswer / 1000)) * 10);
    const basePoints = isCorrect ? question.points : 0;
    const pointsEarned = basePoints + (isCorrect ? timeBonus : 0);
    
    // Update streak
    const newStreak = isCorrect ? userStreak + 1 : 0;
    setUserStreak(newStreak);
    
    // Streak multiplier
    const streakMultiplier = Math.min(3, 1 + (newStreak * 0.1));
    const finalPoints = Math.floor(pointsEarned * streakMultiplier);
    
    setUserScore(prev => prev + finalPoints);
    
    const answer: UserAnswer = {
      questionId: question.id,
      selectedOption: optionIndex,
      timeToAnswer: timeToAnswer / 1000,
      isCorrect,
      pointsEarned: finalPoints
    };
    
    setUserAnswers(prev => [...prev, answer]);
    
    // Show results for 3 seconds then move to next question
    setGamePhase('results');
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeout(startNextQuestion, 500);
    }, 3000);
  };

  const handleTimeUp = () => {
    if (answerSubmitted) return;
    
    setAnswerSubmitted(true);
    setUserStreak(0);
    
    const question = event.questions[currentQuestionIndex];
    const answer: UserAnswer = {
      questionId: question.id,
      selectedOption: -1, // No answer
      timeToAnswer: question.timeLimit,
      isCorrect: false,
      pointsEarned: 0
    };
    
    setUserAnswers(prev => [...prev, answer]);
    setGamePhase('results');
    
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeout(startNextQuestion, 500);
    }, 2000);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = event.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / event.questions.length) * 100;

  return (
    <div className="min-h-screen bg-vaultor-dark executive-gradient overflow-hidden">
      {/* Premium Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-executive/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-8 py-8">
        {/* Executive Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-luxury to-champagne-gold flex items-center justify-center border border-luxury/30">
                <Crown className="w-8 h-8 text-vaultor-dark" />
              </div>
              <div>
                <h1 className="text-4xl font-bold heading-executive mb-1">Executive Summits</h1>
                <p className="text-lg text-platinum">Institutional Intelligence Competitions</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-4 rounded-xl glass-light border border-executive/20 text-platinum hover:text-luxury transition-all duration-500"
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="p-4 rounded-xl glass-light border border-executive/20 text-platinum hover:text-luxury transition-all duration-500"
            >
              <Trophy className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>

        {/* Event Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${gamePhase === 'live' || gamePhase === 'question' || gamePhase === 'results' ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-white font-semibold">
                  {gamePhase === 'waiting' ? 'Starting Soon' : 
                   gamePhase === 'live' || gamePhase === 'question' || gamePhase === 'results' ? '🔴 LIVE' : 
                   'Event Finished'}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-neon-green">
                <Users className="w-4 h-4" />
                <span className="font-bold">{event.participants.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-1 text-shield-gold">
                <DollarSign className="w-4 h-4" />
                <span className="font-bold">${event.prizePool.toLocaleString()}</span>
              </div>
            </div>

            {gamePhase === 'waiting' && (
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-4 h-4" />
                <span className="font-mono text-lg">{formatTime(eventCountdown)}</span>
              </div>
            )}

            {(gamePhase === 'question' || gamePhase === 'results') && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Question</span>
                  <span className="text-neon font-bold">{currentQuestionIndex + 1}/{event.questions.length}</span>
                </div>
                
                {gamePhase === 'question' && (
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-red-400" />
                    <span className={`font-mono text-lg ${timeRemaining <= 5 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                      {formatCountdown(timeRemaining)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {(gamePhase === 'question' || gamePhase === 'results' || gamePhase === 'finished') && (
            <div className="mt-4">
              <div className="w-full bg-glass-bg rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-2 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Waiting Screen */}
              {gamePhase === 'waiting' && (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-3xl p-8 text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-2xl flex items-center justify-center"
                  >
                    <Play className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {event.title}
                  </h2>
                  <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                    {event.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-bg rounded-xl p-4">
                      <div className="text-2xl font-bold text-neon-green mb-2">{event.totalQuestions}</div>
                      <div className="text-xs text-gray-400">Questions</div>
                    </div>
                    <div className="glass-bg rounded-xl p-4">
                      <div className="text-2xl font-bold text-neon-cyan mb-2">{event.duration}m</div>
                      <div className="text-xs text-gray-400">Duration</div>
                    </div>
                    <div className="glass-bg rounded-xl p-4">
                      <div className="text-2xl font-bold text-shield-gold mb-2">${event.prizePool.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Prize Pool</div>
                    </div>
                    <div className="glass-bg rounded-xl p-4">
                      <div className="text-2xl font-bold text-neon-purple mb-2">{event.participants.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Players</div>
                    </div>
                  </div>
                  
                  <div className="text-6xl font-mono text-neon mb-4">
                    {formatTime(eventCountdown)}
                  </div>
                  <p className="text-gray-400">Event starts in</p>
                </motion.div>
              )}

              {/* Question Screen */}
              {gamePhase === 'question' && currentQuestion && (
                <motion.div
                  key={`question-${currentQuestionIndex}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`glass-card rounded-3xl p-8 ${pulseEffect ? 'animate-pulse' : ''}`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{categoryEmojis[currentQuestion.category]}</div>
                      <div>
                        <div className="text-sm text-gray-400">Question {currentQuestionIndex + 1}</div>
                        <div className={`text-sm font-bold ${difficultyColors[currentQuestion.difficulty]}`}>
                          {currentQuestion.difficulty.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-neon-green">{currentQuestion.points}</div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                  </div>

                  {/* Timer Ring */}
                  <div className="flex justify-center mb-8">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke={timeRemaining <= 5 ? "#ef4444" : "#00d9ff"}
                          strokeWidth="8"
                          fill="transparent"
                          strokeLinecap="round"
                          initial={{ pathLength: 1 }}
                          animate={{ pathLength: timeRemaining / currentQuestion.timeLimit }}
                          transition={{ duration: 1 }}
                          strokeDasharray="226.19"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xl font-bold ${timeRemaining <= 5 ? 'text-red-400' : 'text-white'}`}>
                          {timeRemaining}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Question */}
                  <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
                    {currentQuestion.question}
                  </h2>
                  
                  {/* Answer Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={answerSubmitted}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                          selectedAnswer === index
                            ? 'border-neon-purple bg-neon-purple/20 text-white'
                            : answerSubmitted
                            ? 'border-gray-600 bg-gray-800/50 text-gray-400 cursor-not-allowed'
                            : 'border-glass-border bg-glass-bg hover:border-neon-purple/50 text-white hover:bg-glass-bg-light'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                            selectedAnswer === index ? 'border-white bg-white text-neon-purple' : 'border-gray-400 text-gray-400'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Results Screen */}
              {gamePhase === 'results' && currentQuestion && (
                <motion.div
                  key={`results-${currentQuestionIndex}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-3xl p-8 text-center"
                >
                  {selectedAnswer === currentQuestion.correctAnswer ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-green-400 mb-4">Correct!</h2>
                      <p className="text-xl text-white mb-2">
                        +{userAnswers[userAnswers.length - 1]?.pointsEarned || 0} points
                      </p>
                      {userStreak > 1 && (
                        <p className="text-neon-green">
                          🔥 {userStreak} streak bonus!
                        </p>
                      )}
                    </motion.div>
                  ) : selectedAnswer === -1 ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="w-24 h-24 mx-auto mb-6 bg-gray-500 rounded-full flex items-center justify-center">
                        <Clock className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-400 mb-4">Time's Up!</h2>
                      <p className="text-white">No answer submitted</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
                        <XCircle className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-red-400 mb-4">Incorrect</h2>
                      <p className="text-white mb-2">
                        Correct answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}
                      </p>
                    </motion.div>
                  )}

                  <div className="mt-6 p-4 bg-glass-bg rounded-xl">
                    <p className="text-gray-300">
                      <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Finished Screen */}
              {gamePhase === 'finished' && (
                <motion.div
                  key="finished"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-3xl p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-shield-gold to-yellow-500 rounded-full flex items-center justify-center"
                  >
                    <Crown className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">Event Complete!</h2>
                  <p className="text-xl text-neon-green mb-6">
                    Final Score: {userScore.toLocaleString()} points
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="glass-bg rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-400 mb-2">
                        {userAnswers.filter(a => a.isCorrect).length}
                      </div>
                      <div className="text-xs text-gray-400">Correct</div>
                    </div>
                    <div className="glass-bg rounded-xl p-4">
                      <div className="text-2xl font-bold text-red-400 mb-2">
                        {userAnswers.filter(a => !a.isCorrect).length}
                      </div>
                      <div className="text-xs text-gray-400">Incorrect</div>
                    </div>
                    <div className="glass-bg rounded-xl p-4">
                      <div className="text-2xl font-bold text-neon-purple mb-2">
                        {Math.max(...userAnswers.map(a => a.pointsEarned), 0)}
                      </div>
                      <div className="text-xs text-gray-400">Best Round</div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-neon px-8 py-3 rounded-xl font-semibold text-white"
                  >
                    Join Next Event
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-4"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-neon-green" />
                Your Stats
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Score</span>
                  <span className="text-2xl font-bold text-neon-green">{userScore.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Streak</span>
                  <span className="text-xl font-bold text-neon-cyan">{userStreak}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Correct</span>
                  <span className="text-lg font-bold text-white">
                    {userAnswers.filter(a => a.isCorrect).length}/{userAnswers.length}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Live Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-shield-gold" />
                  Live Leaderboard
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {showLeaderboard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </motion.button>
              </div>
              
              <AnimatePresence>
                {showLeaderboard && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {event.leaderboard.slice(0, 5).map((player, index) => (
                      <motion.div
                        key={player.username}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-xl ${
                          index === 0 ? 'bg-gradient-to-r from-shield-gold/20 to-yellow-500/20' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20' :
                          index === 2 ? 'bg-gradient-to-r from-orange-400/20 to-orange-500/20' :
                          'bg-glass-bg'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-shield-gold text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-400 text-white' :
                            'bg-gray-600 text-gray-300'
                          }`}>
                            {player.rank}
                          </div>
                          <div className="text-lg">{player.avatar}</div>
                          <div>
                            <div className="text-white font-medium flex items-center gap-1">
                              {player.username}
                              {player.isVip && <Crown className="w-3 h-3 text-shield-gold" />}
                            </div>
                            <div className="text-xs text-gray-400">
                              🔥 {player.streak} streak
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-neon-green font-bold">
                            {player.score.toLocaleString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Chat/Social */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-4"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-neon-purple" />
                Live Chat
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="text-gray-400">🔥 CryptoNinja: This is intense!</div>
                <div className="text-gray-400">⚡ QuickShot: 12 streak and counting!</div>
                <div className="text-gray-400">🚀 VaultorPro: BTC to the moon! 🌙</div>
                <div className="text-gray-400">🎯 PredictorX: Nice shield play!</div>
              </div>
              
              <div className="mt-4 p-2 rounded-lg bg-glass-bg border border-glass-border">
                <input
                  type="text"
                  placeholder="Send a message..."
                  className="w-full bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}