'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { ServerToClientEvents, ClientToServerEvents } from './server'

type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>

// Socket connection state
export type SocketState = 'disconnected' | 'connecting' | 'connected' | 'error'

// Hook for managing socket connection
export function useSocket(userId?: string, token?: string) {
  const socketRef = useRef<SocketClient | null>(null)
  const [socketState, setSocketState] = useState<SocketState>('disconnected')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !token) {
      return
    }

    // Initialize socket connection
    const socket: SocketClient = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId,
        token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setSocketState('connected')
      setError(null)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setSocketState('disconnected')
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
      setSocketState('error')
      setError(err.message)
    })

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up socket connection')
      socket.disconnect()
      socketRef.current = null
    }
  }, [userId, token])

  return {
    socket: socketRef.current,
    socketState,
    error,
    isConnected: socketState === 'connected'
  }
}

// Hook for live event participation
export function useVaultorEvent(eventId: string, userId?: string, token?: string) {
  const { socket, isConnected } = useSocket(userId, token)
  const [eventState, setEventState] = useState<{
    isLive: boolean
    currentQuestion?: {
      index: number
      text: string
      options: string[]
      timeRemaining: number
    }
    leaderboard: Array<{
      userId: string
      username: string
      score: number
      rank: number
    }>
    userScore: number
    participantCount: number
  }>({
    isLive: false,
    leaderboard: [],
    userScore: 0,
    participantCount: 0
  })

  useEffect(() => {
    if (!socket || !isConnected || !eventId) return

    // Join event
    socket.emit('joinEvent', eventId)

    // Event lifecycle handlers
    socket.on('eventStarted', (data) => {
      if (data.eventId === eventId) {
        setEventState(prev => ({ ...prev, isLive: true }))
      }
    })

    socket.on('eventEnded', (data) => {
      if (data.eventId === eventId) {
        setEventState(prev => ({ ...prev, isLive: false }))
      }
    })

    // Question handlers
    socket.on('questionChanged', (data) => {
      if (data.eventId === eventId) {
        setEventState(prev => ({
          ...prev,
          currentQuestion: {
            index: data.questionIndex,
            text: data.question,
            options: data.options,
            timeRemaining: data.timeRemaining
          }
        }))
      }
    })

    // Leaderboard updates
    socket.on('leaderboardUpdate', (data) => {
      if (data.eventId === eventId) {
        setEventState(prev => ({
          ...prev,
          leaderboard: data.leaderboard
        }))
      }
    })

    // Score updates
    socket.on('scoreUpdate', (data) => {
      if (data.eventId === eventId) {
        setEventState(prev => ({
          ...prev,
          userScore: data.newScore
        }))
      }
    })

    // Participant count updates
    socket.on('participantJoined', (data) => {
      if (data.eventId === eventId) {
        setEventState(prev => ({
          ...prev,
          participantCount: data.participantCount
        }))
      }
    })

    socket.on('participantLeft', (data) => {
      if (data.eventId === eventId) {
        setEventState(prev => ({
          ...prev,
          participantCount: data.participantCount
        }))
      }
    })

    // Cleanup
    return () => {
      socket.emit('leaveEvent', eventId)
      socket.off('eventStarted')
      socket.off('eventEnded')
      socket.off('questionChanged')
      socket.off('leaderboardUpdate')
      socket.off('scoreUpdate')
      socket.off('participantJoined')
      socket.off('participantLeft')
    }
  }, [socket, isConnected, eventId])

  const submitAnswer = (questionIndex: number, answer: number) => {
    if (socket && isConnected) {
      socket.emit('submitAnswer', {
        eventId,
        questionIndex,
        answer,
        timeStamp: Date.now()
      })
    }
  }

  return {
    ...eventState,
    submitAnswer,
    isConnected
  }
}

// Hook for market updates
export function useMarketUpdates(marketIds: string[], userId?: string, token?: string) {
  const { socket, isConnected } = useSocket(userId, token)
  const [marketUpdates, setMarketUpdates] = useState<Record<string, {
    odds: number[]
    totalVolume: string
    isResolved?: boolean
    winningOutcome?: number
  }>>({})

  useEffect(() => {
    if (!socket || !isConnected) return

    // Subscribe to markets
    marketIds.forEach(marketId => {
      socket.emit('subscribeMarket', marketId)
    })

    // Market update handlers
    socket.on('marketOddsUpdate', (data) => {
      setMarketUpdates(prev => ({
        ...prev,
        [data.marketId]: {
          ...prev[data.marketId],
          odds: data.newOdds,
          totalVolume: data.totalVolume
        }
      }))
    })

    socket.on('marketResolved', (data) => {
      setMarketUpdates(prev => ({
        ...prev,
        [data.marketId]: {
          ...prev[data.marketId],
          isResolved: true,
          winningOutcome: data.winningOutcome
        }
      }))
    })

    // Cleanup
    return () => {
      marketIds.forEach(marketId => {
        socket.emit('unsubscribeMarket', marketId)
      })
      socket.off('marketOddsUpdate')
      socket.off('marketResolved')
    }
  }, [socket, isConnected, marketIds])

  return {
    marketUpdates,
    isConnected
  }
}

// Hook for notifications
export function useSocketNotifications(userId?: string, token?: string) {
  const { socket, isConnected } = useSocket(userId, token)
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'info' | 'warning' | 'error' | 'success'
    title: string
    message: string
    timestamp: Date
  }>>([])

  useEffect(() => {
    if (!socket || !isConnected) return

    socket.on('notification', (data) => {
      const notification = {
        id: Math.random().toString(36),
        ...data,
        timestamp: new Date()
      }

      setNotifications(prev => [notification, ...prev.slice(0, 9)]) // Keep last 10
    })

    return () => {
      socket.off('notification')
    }
  }, [socket, isConnected])

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return {
    notifications,
    clearNotification,
    clearAllNotifications,
    isConnected
  }
}

// Utility function to test socket connection
export function useSocketTest() {
  const { socket, isConnected } = useSocket()

  const ping = () => {
    if (socket && isConnected) {
      socket.emit('ping')
    }
  }

  return { ping, isConnected }
}

export default {
  useSocket,
  useVaultorEvent,
  useMarketUpdates,
  useSocketNotifications,
  useSocketTest
}