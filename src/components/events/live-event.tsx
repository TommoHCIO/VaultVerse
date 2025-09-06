'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Trophy, 
  Clock, 
  Zap, 
  Target,
  Crown,
  Flame,
  Timer,
  CheckCircle,
  XCircle,
  Medal,
  Star
} from 'lucide-react'
import { useVaultorEvent } from '@/lib/socket/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface LiveEventProps {
  eventId: string
  userId?: string
  token?: string
  className?: string
}

export function LiveEvent({ eventId, userId, token, className }: LiveEventProps) {
  const {
    isLive,
    currentQuestion,
    leaderboard,
    userScore,
    participantCount,
    submitAnswer,
    isConnected
  } = useVaultorEvent(eventId, userId, token)

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)

  // Timer management
  useEffect(() => {
    if (currentQuestion) {
      setTimeRemaining(currentQuestion.timeRemaining)
      setQuestionStartTime(Date.now())
      setHasAnswered(false)
      setSelectedAnswer(null)
    }
  }, [currentQuestion])

  useEffect(() => {
    if (!isLive || !currentQuestion || hasAnswered) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setHasAnswered(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isLive, currentQuestion, hasAnswered])

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered || !isLive || !currentQuestion) return

    setSelectedAnswer(answerIndex)
    setHasAnswered(true)
    
    submitAnswer(currentQuestion.index, answerIndex)
    
    toast.success('Answer submitted!')
  }

  const getProgressPercentage = () => {
    if (!currentQuestion || timeRemaining <= 0) return 0
    return (timeRemaining / currentQuestion.timeRemaining) * 100
  }

  const getUserRank = () => {
    if (!userId) return null
    const userEntry = leaderboard.find(entry => entry.userId === userId)
    return userEntry?.rank || null
  }

  const getTimeBonus = () => {
    if (!questionStartTime || hasAnswered) return 0
    const elapsed = (Date.now() - questionStartTime) / 1000
    return Math.max(0, Math.floor(10 - elapsed))
  }

  if (!isConnected) {
    return (
      <Card className={cn("w-full max-w-4xl mx-auto", className)}>
        <CardContent className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-vaultor-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Connecting to live event...</p>
        </CardContent>
      </Card>
    )
  }

  if (!isLive) {
    return (
      <Card className={cn("w-full max-w-4xl mx-auto", className)}>
        <CardContent className="p-8 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Event Not Live</h3>
          <p className="text-muted-foreground">This event is not currently live. Check back later!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("w-full max-w-6xl mx-auto space-y-6", className)}>
      {/* Event Status Bar */}
      <Card className="bg-gradient-to-r from-vaultor-primary/10 to-purple-500/10 border-vaultor-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className="bg-green-500 text-white animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-2" />
                LIVE
              </Badge>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                <span>{participantCount} players</span>
              </div>
              {getUserRank() && (
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Rank #{getUserRank()}</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-vaultor-primary">
                {userScore.toLocaleString()} pts
              </div>
              {streak > 0 && (
                <div className="flex items-center gap-1 text-orange-500 text-sm">
                  <Flame className="w-3 h-3" />
                  <span>{streak} streak</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="relative overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        Question {currentQuestion.index + 1}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Timer className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-mono">
                          {timeRemaining}s
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {currentQuestion.text}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Timer Bar */}
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-green-500 to-orange-500 h-2 rounded-full"
                        initial={{ width: '100%' }}
                        animate={{ 
                          width: `${getProgressPercentage()}%`,
                          backgroundColor: timeRemaining > 5 ? '#10b981' : '#ef4444'
                        }}
                        transition={{ duration: 1, ease: 'linear' }}
                      />
                    </div>

                    {/* Answer Options */}
                    <div className="grid grid-cols-1 gap-3">
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === index
                        const isDisabled = hasAnswered || timeRemaining <= 0

                        return (
                          <motion.div
                            key={index}
                            whileHover={!isDisabled ? { scale: 1.02 } : {}}
                            whileTap={!isDisabled ? { scale: 0.98 } : {}}
                          >
                            <Button
                              variant={isSelected ? 'default' : 'outline'}
                              size="lg"
                              className={cn(
                                "w-full p-4 h-auto text-left justify-start relative",
                                isSelected && "bg-vaultor-primary border-vaultor-primary",
                                isDisabled && "opacity-50 cursor-not-allowed"
                              )}
                              onClick={() => handleAnswerSelect(index)}
                              disabled={isDisabled}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold",
                                  isSelected 
                                    ? "bg-white text-vaultor-primary border-white" 
                                    : "border-current"
                                )}>
                                  {String.fromCharCode(65 + index)}
                                </div>
                                <span className="flex-1">{option}</span>
                                {isSelected && hasAnswered && (
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                )}
                              </div>

                              {/* Time Bonus Indicator */}
                              {!hasAnswered && getTimeBonus() > 0 && (
                                <div className="absolute top-2 right-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                                  +{getTimeBonus()}
                                </div>
                              )}
                            </Button>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Answer Status */}
                    <AnimatePresence>
                      {hasAnswered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center p-4 bg-muted/50 rounded-lg"
                        >
                          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <p className="font-medium">Answer Submitted!</p>
                          <p className="text-sm text-muted-foreground">
                            Waiting for next question...
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Live Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {leaderboard.slice(0, 10).map((entry, index) => {
                    const isCurrentUser = entry.userId === userId
                    const rank = entry.rank

                    return (
                      <motion.div
                        key={entry.userId}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={cn(
                          "flex items-center gap-3 p-3 border-b last:border-b-0 transition-colors",
                          isCurrentUser && "bg-vaultor-primary/10 border-vaultor-primary/20"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                            rank === 1 && "bg-yellow-500 text-black",
                            rank === 2 && "bg-gray-300 text-black",
                            rank === 3 && "bg-orange-500 text-white",
                            rank > 3 && "bg-muted text-muted-foreground"
                          )}>
                            {rank <= 3 ? (
                              <Crown className="w-3 h-3" />
                            ) : (
                              rank
                            )}
                          </div>

                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {entry.username[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0 flex-1">
                            <p className={cn(
                              "text-sm font-medium truncate",
                              isCurrentUser && "text-vaultor-primary"
                            )}>
                              {entry.username}
                              {isCurrentUser && (
                                <Badge variant="outline" className="ml-1 text-xs">
                                  You
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {entry.score.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">pts</div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {leaderboard.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No participants yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Stats Card */}
          {userId && (
            <Card className="bg-gradient-to-br from-vaultor-primary/5 to-purple-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5" />
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Score</span>
                  <span className="font-bold text-vaultor-primary">
                    {userScore.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rank</span>
                  <span className="font-bold">
                    #{getUserRank() || '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Streak</span>
                  <div className="flex items-center gap-1">
                    {streak > 0 && <Flame className="w-4 h-4 text-orange-500" />}
                    <span className="font-bold">{streak}</span>
                  </div>
                </div>

                {currentQuestion && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Question</span>
                    <span className="font-bold">
                      {currentQuestion.index + 1} of 25
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveEvent