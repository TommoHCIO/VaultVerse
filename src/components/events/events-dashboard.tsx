'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Zap, 
  Star,
  Play,
  Timer,
  Target,
  Flame,
  Crown,
  RefreshCw,
  Plus,
  Gift,
  TrendingUp
} from 'lucide-react'
import { formatEther } from 'viem'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface VaultorEventData {
  id: string
  title: string
  description: string
  imageUrl?: string
  questionCount: number
  duration: number
  entryFee: bigint
  maxParticipants?: number
  totalPrizePool: bigint
  prizeDistribution: {
    positions: number
    percentages: number[]
  }
  scheduledAt: Date
  startedAt?: Date
  endedAt?: Date
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED'
  participantCount: number
  isUserParticipating?: boolean
  userRank?: number
  userScore?: number
}

interface EventsDashboardProps {
  className?: string
  userId?: string
}

// Mock data - in production, this would come from your API
const mockEvents: VaultorEventData[] = [
  {
    id: '1',
    title: 'Crypto Knowledge Championship',
    description: 'Test your knowledge of cryptocurrency, DeFi, and blockchain technology in this high-energy prediction battle!',
    imageUrl: '/events/crypto-championship.jpg',
    questionCount: 25,
    duration: 900, // 15 minutes
    entryFee: BigInt('100000000000000000'), // 0.1 ETH
    maxParticipants: 1000,
    totalPrizePool: BigInt('50000000000000000000'), // 50 ETH
    prizeDistribution: {
      positions: 10,
      percentages: [40, 20, 15, 10, 5, 3, 2, 2, 2, 1]
    },
    scheduledAt: new Date(Date.now() + 3600000), // 1 hour from now
    status: 'SCHEDULED',
    participantCount: 247,
    isUserParticipating: true
  },
  {
    id: '2',
    title: 'Sports Prediction Showdown',
    description: 'Predict outcomes in various sports matches and tournaments. From football to esports!',
    imageUrl: '/events/sports-showdown.jpg',
    questionCount: 25,
    duration: 900,
    entryFee: BigInt('50000000000000000'), // 0.05 ETH
    totalPrizePool: BigInt('25000000000000000000'), // 25 ETH
    prizeDistribution: {
      positions: 5,
      percentages: [50, 25, 15, 7, 3]
    },
    scheduledAt: new Date(Date.now() + 7200000), // 2 hours from now
    status: 'SCHEDULED',
    participantCount: 156,
    isUserParticipating: false
  },
  {
    id: '3',
    title: 'Tech Giants Battle',
    description: 'Live prediction event about the latest tech news, stock movements, and industry developments.',
    imageUrl: '/events/tech-battle.jpg',
    questionCount: 25,
    duration: 900,
    entryFee: BigInt('200000000000000000'), // 0.2 ETH
    totalPrizePool: BigInt('100000000000000000000'), // 100 ETH
    prizeDistribution: {
      positions: 15,
      percentages: [30, 20, 12, 8, 6, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2]
    },
    scheduledAt: new Date(Date.now() - 3600000), // 1 hour ago (LIVE)
    startedAt: new Date(Date.now() - 600000), // Started 10 minutes ago
    status: 'LIVE',
    participantCount: 892,
    isUserParticipating: true,
    userRank: 45,
    userScore: 1250
  }
]

export function EventsDashboard({ className, userId }: EventsDashboardProps) {
  const [events, setEvents] = useState<VaultorEventData[]>(mockEvents)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<VaultorEventData | null>(null)

  const liveEvents = events.filter(e => e.status === 'LIVE')
  const upcomingEvents = events.filter(e => e.status === 'SCHEDULED')
  const completedEvents = events.filter(e => e.status === 'COMPLETED')

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // In production, fetch fresh data from API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Events refreshed!')
    } catch (error) {
      toast.error('Failed to refresh events')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleJoinEvent = async (eventId: string) => {
    const event = events.find(e => e.id === eventId)
    if (!event) return

    try {
      // In production, this would interact with smart contracts
      toast.success(`Joined ${event.title}!`)
      
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, isUserParticipating: true, participantCount: e.participantCount + 1 }
          : e
      ))
    } catch (error) {
      toast.error('Failed to join event')
    }
  }

  const handleWatchLive = (eventId: string) => {
    // In production, navigate to live event page
    toast.info(`Opening live event ${eventId}`)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Vaultor Events
          </h1>
          <p className="text-muted-foreground">
            Live prediction battles with real-time competition
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Live Now</span>
            </div>
            <p className="text-2xl font-bold text-red-500">{liveEvents.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Upcoming</span>
            </div>
            <p className="text-2xl font-bold">{upcomingEvents.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Total Players</span>
            </div>
            <p className="text-2xl font-bold">
              {events.reduce((sum, e) => sum + e.participantCount, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Prize Pool</span>
            </div>
            <p className="text-2xl font-bold">
              {(Number(events.reduce((sum, e) => sum + e.totalPrizePool, 0n)) / 1e18).toFixed(0)} ETH
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Events Alert */}
      {liveEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Play className="w-6 h-6 text-red-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-red-500">
                  {liveEvents.length} Event{liveEvents.length > 1 ? 's' : ''} Live Now!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Join the action before it's too late
                </p>
              </div>
            </div>
            <Button 
              className="bg-red-500 hover:bg-red-600"
              onClick={() => handleWatchLive(liveEvents[0].id)}
            >
              Watch Live
            </Button>
          </div>
        </motion.div>
      )}

      {/* Events Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Upcoming ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="live" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Live ({liveEvents.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Completed ({completedEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          <EventGrid 
            events={upcomingEvents} 
            onJoinEvent={handleJoinEvent}
            onWatchLive={handleWatchLive}
          />
        </TabsContent>

        <TabsContent value="live" className="mt-6">
          <EventGrid 
            events={liveEvents} 
            onJoinEvent={handleJoinEvent}
            onWatchLive={handleWatchLive}
            isLive
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <EventGrid 
            events={completedEvents} 
            onJoinEvent={handleJoinEvent}
            onWatchLive={handleWatchLive}
            isCompleted
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface EventGridProps {
  events: VaultorEventData[]
  onJoinEvent: (eventId: string) => void
  onWatchLive: (eventId: string) => void
  isLive?: boolean
  isCompleted?: boolean
}

function EventGrid({ events, onJoinEvent, onWatchLive, isLive, isCompleted }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No events found</h3>
        <p className="text-muted-foreground">
          {isLive ? 'No events are currently live' : 
           isCompleted ? 'No completed events to show' : 
           'No upcoming events scheduled'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <AnimatePresence>
        {events.map((event, index) => (
          <EventCard
            key={event.id}
            event={event}
            onJoinEvent={onJoinEvent}
            onWatchLive={onWatchLive}
            index={index}
            isLive={isLive}
            isCompleted={isCompleted}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

interface EventCardProps {
  event: VaultorEventData
  onJoinEvent: (eventId: string) => void
  onWatchLive: (eventId: string) => void
  index: number
  isLive?: boolean
  isCompleted?: boolean
}

function EventCard({ event, onJoinEvent, onWatchLive, index, isLive, isCompleted }: EventCardProps) {
  const timeUntilEvent = event.scheduledAt.getTime() - Date.now()
  const timeUntilString = getTimeUntilString(timeUntilEvent)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden border transition-all duration-200 hover:shadow-xl",
        isLive && "border-red-500/50 bg-gradient-to-br from-red-500/5 to-pink-500/5",
        isCompleted && "border-green-500/50 bg-gradient-to-br from-green-500/5 to-emerald-500/5",
        !isLive && !isCompleted && "hover:border-purple-500/30 hover:shadow-purple-500/10"
      )}>
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          {isLive && (
            <Badge className="bg-red-500 text-white animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-2" />
              LIVE
            </Badge>
          )}
          {isCompleted && (
            <Badge className="bg-green-500 text-white">
              <Trophy className="w-3 h-3 mr-1" />
              COMPLETED
            </Badge>
          )}
          {!isLive && !isCompleted && (
            <Badge variant="outline" className="bg-background/80">
              <Clock className="w-3 h-3 mr-1" />
              {timeUntilString}
            </Badge>
          )}
        </div>

        {/* Participating Badge */}
        {event.isUserParticipating && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-vaultor-primary text-white">
              <Star className="w-3 h-3 mr-1" />
              Joined
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          {event.imageUrl && (
            <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-3" />
          )}
          
          <CardTitle className="line-clamp-2 group-hover:text-purple-500 transition-colors">
            {event.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Event Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>Players</span>
              </div>
              <p className="font-medium">{event.participantCount}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Trophy className="w-3 h-3" />
                <span>Prize Pool</span>
              </div>
              <p className="font-medium">{formatEther(event.totalPrizePool)} ETH</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Target className="w-3 h-3" />
                <span>Questions</span>
              </div>
              <p className="font-medium">{event.questionCount}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Timer className="w-3 h-3" />
                <span>Duration</span>
              </div>
              <p className="font-medium">{Math.floor(event.duration / 60)}m</p>
            </div>
          </div>

          {/* User Performance (if participating and live/completed) */}
          {event.isUserParticipating && (isLive || isCompleted) && event.userRank && (
            <div className="bg-vaultor-primary/10 border border-vaultor-primary/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Your Performance</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rank #{event.userRank}</span>
                    <span>•</span>
                    <span>{event.userScore?.toLocaleString()} pts</span>
                  </div>
                </div>
                {event.userRank <= 3 && (
                  <Crown className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>
          )}

          {/* Entry Fee */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Entry Fee</span>
            <span className="font-medium">{formatEther(event.entryFee)} ETH</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {isLive ? (
              <Button 
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={() => onWatchLive(event.id)}
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Live
              </Button>
            ) : isCompleted ? (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onWatchLive(event.id)}
              >
                View Results
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onWatchLive(event.id)}
                  className="flex-1"
                >
                  Details
                </Button>
                <Button
                  size="sm"
                  onClick={() => onJoinEvent(event.id)}
                  disabled={event.isUserParticipating}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {event.isUserParticipating ? (
                    <>
                      <Star className="w-4 h-4 mr-2" />
                      Joined
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Join Event
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function getTimeUntilString(milliseconds: number): string {
  if (milliseconds <= 0) return 'Starting soon'

  const hours = Math.floor(milliseconds / (1000 * 60 * 60))
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export default EventsDashboard