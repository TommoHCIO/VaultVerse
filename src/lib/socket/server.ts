import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { prisma } from '../prisma'
import { EventStatus } from '@prisma/client'

export interface ServerToClientEvents {
  // Event management
  eventStarted: (eventData: {
    eventId: string
    title: string
    questionCount: number
    duration: number
  }) => void
  
  eventEnded: (eventData: {
    eventId: string
    results: any[]
  }) => void
  
  // Live event updates
  questionChanged: (questionData: {
    eventId: string
    questionIndex: number
    question: string
    options: string[]
    timeRemaining: number
  }) => void
  
  participantJoined: (data: { eventId: string; participantCount: number }) => void
  participantLeft: (data: { eventId: string; participantCount: number }) => void
  
  // Real-time leaderboard
  leaderboardUpdate: (data: {
    eventId: string
    leaderboard: Array<{
      userId: string
      username: string
      score: number
      rank: number
    }>
  }) => void
  
  // User-specific updates
  scoreUpdate: (data: {
    eventId: string
    newScore: number
    questionScore: number
    streak: number
  }) => void
  
  // Market updates
  marketOddsUpdate: (data: {
    marketId: string
    newOdds: number[]
    totalVolume: string
  }) => void
  
  marketResolved: (data: {
    marketId: string
    winningOutcome: number
    totalWinners: number
  }) => void
  
  // System notifications
  notification: (data: {
    type: 'info' | 'warning' | 'error' | 'success'
    title: string
    message: string
  }) => void
}

export interface ClientToServerEvents {
  // Event participation
  joinEvent: (eventId: string) => void
  leaveEvent: (eventId: string) => void
  
  // Answer submission
  submitAnswer: (data: {
    eventId: string
    questionIndex: number
    answer: number
    timeStamp: number
  }) => void
  
  // Market subscriptions
  subscribeMarket: (marketId: string) => void
  unsubscribeMarket: (marketId: string) => void
  
  // General
  ping: () => void
}

export interface InterServerEvents {
  eventSync: (eventData: any) => void
}

export interface SocketData {
  userId?: string
  username?: string
  subscribedEvents: Set<string>
  subscribedMarkets: Set<string>
}

let io: SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>

export function initializeSocket(httpServer: HTTPServer) {
  io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    httpServer,
    {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    }
  )

  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const userId = socket.handshake.auth.userId
      const token = socket.handshake.auth.token
      
      if (userId && token) {
        // In production, verify the JWT token here
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, username: true, displayName: true }
        })
        
        if (user) {
          socket.data.userId = user.id
          socket.data.username = user.username || user.displayName || 'Anonymous'
          socket.data.subscribedEvents = new Set()
          socket.data.subscribedMarkets = new Set()
        }
      }
      
      next()
    } catch (error) {
      console.error('Socket authentication error:', error)
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
    console.log(`User connected: ${socket.data.username} (${socket.id})`)

    // Event participation handlers
    socket.on('joinEvent', async (eventId: string) => {
      try {
        const event = await prisma.vaultorEvent.findUnique({
          where: { id: eventId },
          include: {
            _count: { select: { participations: true } }
          }
        })

        if (!event) {
          socket.emit('notification', {
            type: 'error',
            title: 'Event Not Found',
            message: 'The requested event does not exist.'
          })
          return
        }

        // Check if event is live
        if (event.status !== EventStatus.LIVE) {
          socket.emit('notification', {
            type: 'warning',
            title: 'Event Not Live',
            message: 'This event is not currently live.'
          })
          return
        }

        // Join event room
        socket.join(`event:${eventId}`)
        socket.data.subscribedEvents.add(eventId)

        // Update participant count
        const participantCount = event._count.participations + 1
        socket.to(`event:${eventId}`).emit('participantJoined', {
          eventId,
          participantCount
        })

        console.log(`User ${socket.data.username} joined event ${eventId}`)
      } catch (error) {
        console.error('Error joining event:', error)
        socket.emit('notification', {
          type: 'error',
          title: 'Error',
          message: 'Failed to join event.'
        })
      }
    })

    socket.on('leaveEvent', (eventId: string) => {
      socket.leave(`event:${eventId}`)
      socket.data.subscribedEvents.delete(eventId)

      // Update participant count
      socket.to(`event:${eventId}`).emit('participantLeft', {
        eventId,
        participantCount: 0 // Would calculate actual count in production
      })

      console.log(`User ${socket.data.username} left event ${eventId}`)
    })

    socket.on('submitAnswer', async (data) => {
      try {
        const { eventId, questionIndex, answer, timeStamp } = data
        
        if (!socket.data.userId) {
          socket.emit('notification', {
            type: 'error',
            title: 'Authentication Required',
            message: 'You must be logged in to submit answers.'
          })
          return
        }

        // Validate the submission
        const event = await prisma.vaultorEvent.findUnique({
          where: { id: eventId }
        })

        if (!event || event.status !== EventStatus.LIVE) {
          socket.emit('notification', {
            type: 'error',
            title: 'Invalid Submission',
            message: 'Cannot submit answer for this event.'
          })
          return
        }

        // Process answer and calculate score
        const questions = event.questions as any[]
        const currentQuestion = questions[questionIndex]
        
        if (!currentQuestion) {
          socket.emit('notification', {
            type: 'error',
            title: 'Invalid Question',
            message: 'Question not found.'
          })
          return
        }

        const isCorrect = answer === currentQuestion.correctAnswer
        const timeBonus = Math.max(0, 10 - Math.floor((Date.now() - timeStamp) / 1000))
        const questionScore = isCorrect ? (100 + timeBonus) : 0

        // Update user participation
        await prisma.eventParticipation.upsert({
          where: {
            userId_eventId: {
              userId: socket.data.userId,
              eventId
            }
          },
          update: {
            score: { increment: questionScore },
            correctAnswers: isCorrect ? { increment: 1 } : undefined,
            answers: {
              // Would update answers array in production
            }
          },
          create: {
            userId: socket.data.userId,
            eventId,
            score: questionScore,
            correctAnswers: isCorrect ? 1 : 0,
            answers: [{ questionIndex, answer, timeStamp, isCorrect, score: questionScore }]
          }
        })

        // Send score update to user
        socket.emit('scoreUpdate', {
          eventId,
          newScore: questionScore, // Would calculate total score
          questionScore,
          streak: 0 // Would calculate streak
        })

        // Update leaderboard
        await updateEventLeaderboard(eventId)

      } catch (error) {
        console.error('Error submitting answer:', error)
        socket.emit('notification', {
          type: 'error',
          title: 'Submission Failed',
          message: 'Failed to submit your answer.'
        })
      }
    })

    // Market subscription handlers
    socket.on('subscribeMarket', (marketId: string) => {
      socket.join(`market:${marketId}`)
      socket.data.subscribedMarkets.add(marketId)
      console.log(`User ${socket.data.username} subscribed to market ${marketId}`)
    })

    socket.on('unsubscribeMarket', (marketId: string) => {
      socket.leave(`market:${marketId}`)
      socket.data.subscribedMarkets.delete(marketId)
      console.log(`User ${socket.data.username} unsubscribed from market ${marketId}`)
    })

    socket.on('ping', () => {
      socket.emit('notification', {
        type: 'info',
        title: 'Pong',
        message: 'Connection is healthy!'
      })
    })

    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.data.username} (${socket.id}) - ${reason}`)
      
      // Clean up subscriptions
      socket.data.subscribedEvents.forEach(eventId => {
        socket.to(`event:${eventId}`).emit('participantLeft', {
          eventId,
          participantCount: 0 // Would calculate actual count
        })
      })
    })
  })

  console.log('Socket.IO server initialized')
  return io
}

// Utility functions for event management
export async function startEvent(eventId: string) {
  const event = await prisma.vaultorEvent.findUnique({
    where: { id: eventId }
  })

  if (!event) return

  // Update event status
  await prisma.vaultorEvent.update({
    where: { id: eventId },
    data: {
      status: EventStatus.LIVE,
      startedAt: new Date()
    }
  })

  // Notify all participants
  io.to(`event:${eventId}`).emit('eventStarted', {
    eventId,
    title: event.title,
    questionCount: event.questionCount,
    duration: event.duration
  })

  // Start question sequence
  await runEventQuestions(eventId, event.questions as any[], event.duration)
}

async function runEventQuestions(eventId: string, questions: any[], totalDuration: number) {
  const questionDuration = totalDuration / questions.length

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]
    
    // Send question to participants
    io.to(`event:${eventId}`).emit('questionChanged', {
      eventId,
      questionIndex: i,
      question: question.text,
      options: question.options,
      timeRemaining: questionDuration
    })

    // Wait for question duration
    await new Promise(resolve => setTimeout(resolve, questionDuration * 1000))
  }

  // End event
  await endEvent(eventId)
}

export async function endEvent(eventId: string) {
  // Update event status
  await prisma.vaultorEvent.update({
    where: { id: eventId },
    data: {
      status: EventStatus.COMPLETED,
      endedAt: new Date()
    }
  })

  // Get final results
  const results = await prisma.eventParticipation.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, username: true, displayName: true }
      }
    },
    orderBy: { score: 'desc' },
    take: 100
  })

  // Notify participants
  io.to(`event:${eventId}`).emit('eventEnded', {
    eventId,
    results: results.map((r, index) => ({
      rank: index + 1,
      userId: r.userId,
      username: r.user.username || r.user.displayName,
      score: r.score
    }))
  })

  // Calculate and distribute prizes
  await distributePrizes(eventId)
}

async function updateEventLeaderboard(eventId: string) {
  const leaderboard = await prisma.eventParticipation.findMany({
    where: { eventId },
    include: {
      user: {
        select: { id: true, username: true, displayName: true }
      }
    },
    orderBy: { score: 'desc' },
    take: 20
  })

  io.to(`event:${eventId}`).emit('leaderboardUpdate', {
    eventId,
    leaderboard: leaderboard.map((entry, index) => ({
      userId: entry.userId,
      username: entry.user.username || entry.user.displayName || 'Anonymous',
      score: entry.score,
      rank: index + 1
    }))
  })
}

async function distributePrizes(eventId: string) {
  const event = await prisma.vaultorEvent.findUnique({
    where: { id: eventId },
    include: {
      participations: {
        orderBy: { score: 'desc' }
      }
    }
  })

  if (!event) return

  const prizeDistribution = event.prizeDistribution as any
  const totalPrizePool = event.totalPrizePool

  // Distribute prizes based on configuration
  for (let i = 0; i < Math.min(event.participations.length, prizeDistribution.positions); i++) {
    const participation = event.participations[i]
    const prizeAmount = (totalPrizePool * BigInt(prizeDistribution.percentages[i])) / 100n

    await prisma.eventParticipation.update({
      where: { id: participation.id },
      data: {
        prizeWon: prizeAmount,
        paidOut: false // Will be processed by payment system
      }
    })
  }
}

// Market update functions
export function broadcastMarketUpdate(marketId: string, newOdds: number[], totalVolume: bigint) {
  io.to(`market:${marketId}`).emit('marketOddsUpdate', {
    marketId,
    newOdds,
    totalVolume: totalVolume.toString()
  })
}

export function broadcastMarketResolution(marketId: string, winningOutcome: number, totalWinners: number) {
  io.to(`market:${marketId}`).emit('marketResolved', {
    marketId,
    winningOutcome,
    totalWinners
  })
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized')
  }
  return io
}

export default { initializeSocket, getIO }