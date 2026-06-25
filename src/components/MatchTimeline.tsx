import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { MatchEvent } from '../lib/types'

interface Props {
  matchId: string
}

const ICON_MAP: Record<string, string> = {
  goal: '⚽',
  ownGoal: '⚽',
  penalty: '⚽',
  missedPenalty: '❌',
  yellowCard: '🟨',
  redCard: '🟥',
  substitution: '🔄',
  var: '📺',
}

function formatMinute(minute: number | null, extraMinute: number | null): string {
  if (minute === null) return ''
  return extraMinute ? `${minute}+${extraMinute}'` : `${minute}'`
}

function EventIcon({ type }: { type: string }) {
  const icon = ICON_MAP[type]
  if (icon) return <span className="text-sm">{icon}</span>

  if (type === 'goal' || type === 'ownGoal' || type === 'penalty') {
    return (
      <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" />
      </svg>
    )
  }
  if (type === 'yellowCard') {
    return (
      <div className="w-3.5 h-4.5 rounded-[1px] bg-yellow-400 shadow-sm" />
    )
  }
  if (type === 'redCard') {
    return (
      <div className="w-3.5 h-4.5 rounded-[1px] bg-red-600 shadow-sm" />
    )
  }
  if (type === 'substitution') {
    return (
      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  }
  return <span className="text-xs text-text-muted">•</span>
}

export default function MatchTimeline({ matchId }: Props) {
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.matches.events(matchId)
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [matchId])

  if (loading) {
    return (
      <div className="rounded-xl border border-border-dark bg-bg-card p-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Timeline</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-4 bg-bg-card-hover rounded" />
              <div className="w-4 h-4 bg-bg-card-hover rounded-full" />
              <div className="flex-1 h-4 bg-bg-card-hover rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const visibleEvents = events.filter(
    (ev) => ['goal', 'ownGoal', 'penalty', 'missedPenalty', 'yellowCard', 'redCard', 'substitution', 'var'].includes(ev.type),
  )

  if (visibleEvents.length === 0) {
    return (
      <div className="rounded-xl border border-border-dark bg-bg-card p-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Timeline</h3>
        <div className="text-center py-6">
          <svg className="w-8 h-8 mx-auto mb-2 text-text-muted opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-text-muted">Scrape to see match events</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border-dark bg-bg-card p-4">
      <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[60px] top-0 bottom-0 w-px bg-border-dark" />

        <div className="space-y-0">
          {visibleEvents.map((ev) => (
            <div key={ev._id} className="relative flex items-start gap-3 py-2 group">
              {/* Time */}
              <span className="w-10 flex-shrink-0 text-right text-text-muted font-mono text-xs leading-5 pt-0.5 z-10">
                {formatMinute(ev.minute, ev.extraMinute)}
              </span>

              {/* Dot on timeline */}
              <div className="relative z-10 flex items-center justify-center w-5 h-5 -ml-2.5">
                <div className={`w-2 h-2 rounded-full ring-2 ring-bg-card ${
                  ev.type === 'goal' || ev.type === 'ownGoal' || ev.type === 'penalty'
                    ? 'bg-green-400'
                    : ev.type === 'yellowCard'
                    ? 'bg-yellow-400'
                    : ev.type === 'redCard'
                    ? 'bg-red-600'
                    : ev.type === 'substitution'
                    ? 'bg-blue-400'
                    : 'bg-text-muted'
                }`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-3 border-b border-border-dark/50 group-last:border-0">
                <div className="flex items-center gap-1.5">
                  <EventIcon type={ev.type} />
                  <span className="text-xs font-medium text-white">
                    {ev.playerName || ''}
                  </span>
                  {ev.playerOut && (
                    <span className="text-xs text-text-muted">
                      <svg className="w-3 h-3 inline mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      {ev.playerOut}
                    </span>
                  )}
                  {ev.teamName && !ev.playerOut && (
                    <span className="text-[10px] text-text-muted ml-auto">{ev.teamName}</span>
                  )}
                </div>
                {ev.description && !ev.playerOut && (
                  <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                    {ev.description.length > 100 ? ev.description.slice(0, 100) + '...' : ev.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
