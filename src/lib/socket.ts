import { useEffect, useRef, useCallback } from 'react'
import { io, type Socket } from 'socket.io-client'
import type { Match } from './types'

interface MatchScoreEvent {
  externalId: number
  homeScore: number | null
  awayScore: number | null
  status: string
  timestamp: string
}

interface MatchStatusEvent {
  externalId: number
  status: string
  timestamp: string
}

type MatchUpdateHandler = (match: Match) => void
type MatchScoreHandler = (event: MatchScoreEvent) => void
type MatchStatusHandler = (event: MatchStatusEvent) => void

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io({ transports: ['websocket', 'polling'] })
    socketRef.current = socket
    return () => { socket.close() }
  }, [])

  const subscribeMatch = useCallback((matchId: string) => {
    socketRef.current?.emit('subscribe:match', matchId)
  }, [])

  const unsubscribeMatch = useCallback((matchId: string) => {
    socketRef.current?.emit('unsubscribe:match', matchId)
  }, [])

  const subscribeLive = useCallback(() => {
    socketRef.current?.emit('subscribe:live')
  }, [])

  const unsubscribeLive = useCallback(() => {
    socketRef.current?.emit('unsubscribe:live')
  }, [])

  const onMatchUpdate = useCallback((handler: MatchUpdateHandler) => {
    socketRef.current?.on('match:update', handler)
    return () => { socketRef.current?.off('match:update', handler) }
  }, [])

  const onMatchScore = useCallback((handler: MatchScoreHandler) => {
    socketRef.current?.on('match:score', handler)
    return () => { socketRef.current?.off('match:score', handler) }
  }, [])

  const onMatchStatus = useCallback((handler: MatchStatusHandler) => {
    socketRef.current?.on('match:status', handler)
    return () => { socketRef.current?.off('match:status', handler) }
  }, [])

  return {
    subscribeMatch,
    unsubscribeMatch,
    subscribeLive,
    unsubscribeLive,
    onMatchUpdate,
    onMatchScore,
    onMatchStatus,
  }
}
