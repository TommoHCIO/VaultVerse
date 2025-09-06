'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Users, Trophy, Target } from 'lucide-react';

export interface QuestionOption {
  id: string;
  text: string;
  odds: number;
  votes: number;
}

export interface LiveQuestion {
  id: string;
  question: string;
  timeRemaining: number;
  totalTime: number;
  options: QuestionOption[];
  category: 'CRYPTO' | 'POLITICS' | 'SPORTS' | 'ENTERTAINMENT' | 'TECHNOLOGY';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionNumber: number;
  totalQuestions: number;
}

export interface QuestionCarouselProps {
  questions: LiveQuestion[];
  currentQuestionIndex: number;
  onAnswerSelect: (questionId: string, optionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLive?: boolean;
  className?: string;
}

export function QuestionCarousel({
  questions,
  currentQuestionIndex,
  onAnswerSelect,
  onNext,
  onPrevious,
  isLive = false,
  className = ''
}: QuestionCarouselProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!currentQuestion) return;
    
    setTimeLeft(currentQuestion.timeRemaining);
    setSelectedAnswer(null);

    if (isLive && currentQuestion.timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, isLive]);

  const handleAnswerSelect = (optionId: string) => {
    if (timeLeft > 0 || !isLive) {
      setSelectedAnswer(optionId);
      onAnswerSelect(currentQuestion.id, optionId);
    }
  };

  const getTimeProgress = () => {
    if (!currentQuestion || currentQuestion.totalTime === 0) return 100;
    return ((currentQuestion.totalTime - timeLeft) / currentQuestion.totalTime) * 100;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / currentQuestion?.totalTime) * 100;
    if (percentage > 50) return 'text-emerald-400';
    if (percentage > 20) return 'text-amber-400';
    return 'text-red-400';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'MEDIUM': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'HARD': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CRYPTO': return '₿';
      case 'POLITICS': return '🏛️';
      case 'SPORTS': return '⚽';
      case 'ENTERTAINMENT': return '🎬';
      case 'TECHNOLOGY': return '💻';
      default: return '❓';
    }
  };

  if (!currentQuestion) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 animate-pulse"></div>
          <p className="text-gray-400">No questions available</p>
        </div>
      </div>
    );
  }

  const totalVotes = currentQuestion.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className={`relative ${className}`}>
      {/* Question Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">
            Question {currentQuestion.questionNumber} of {currentQuestion.totalQuestions}
          </span>
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </span>
            <span className="text-xs text-gray-400">
              {getCategoryIcon(currentQuestion.category)} {currentQuestion.category}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-luxury to-champagne-gold"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion.questionNumber - 1) / currentQuestion.totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Timer */}
      {isLive && (
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={`font-bold text-xl ${getTimeColor()}`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>
          {/* Time Progress Bar */}
          <div className="mt-3 w-full bg-gray-800 rounded-full h-1 overflow-hidden">
            <motion.div
              className={`h-full ${timeLeft > 10 ? 'bg-luxury' : 'bg-red-500'}`}
              style={{ width: `${100 - getTimeProgress()}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden"
        >
          {/* Question Header */}
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 leading-relaxed">
              {currentQuestion.question}
            </h3>
            
            {/* Live Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{totalVotes} votes</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Live Prediction</span>
              </div>
              {isLive && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-medium">LIVE</span>
                </div>
              )}
            </div>
          </div>

          {/* Answer Options */}
          <div className="p-6 space-y-3">
            {currentQuestion.options.map((option, index) => {
              const votePercentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              const isSelected = selectedAnswer === option.id;
              const isDisabled = isLive && timeLeft === 0;

              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={isDisabled}
                  whileHover={!isDisabled ? { scale: 1.02 } : {}}
                  whileTap={!isDisabled ? { scale: 0.98 } : {}}
                  className={`
                    relative w-full p-4 rounded-xl border-2 transition-all duration-200 overflow-hidden
                    ${isSelected
                      ? 'border-luxury bg-luxury/10 shadow-lg shadow-luxury/20'
                      : isDisabled
                      ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed opacity-60'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-700/50'
                    }
                  `}
                >
                  {/* Vote Progress Bar */}
                  <motion.div
                    className={`absolute inset-0 ${isSelected ? 'bg-luxury/5' : 'bg-gray-700/20'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${votePercentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />

                  <div className="relative flex items-center justify-between">
                    <div className="flex-1 text-left">
                      <span className={`font-medium ${isSelected ? 'text-luxury' : 'text-white'}`}>
                        {option.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span className="text-sm text-gray-400">
                        {votePercentage.toFixed(1)}%
                      </span>
                      <span className={`text-sm font-bold ${isSelected ? 'text-luxury' : 'text-champagne-gold'}`}>
                        {option.odds}x
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-luxury flex items-center justify-center"
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="p-6 border-t border-gray-700 flex items-center justify-between">
            <button
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-luxury'
                      : index < currentQuestionIndex
                      ? 'bg-champagne-gold'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={onNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-luxury border border-luxury/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-luxury/90 transition-colors text-white font-medium"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default QuestionCarousel;