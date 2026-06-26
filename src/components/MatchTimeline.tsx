import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { MatchEvent } from '../lib/types'

interface Props {
  matchId: string
}

function formatMinute(minute: number | null, extraMinute: number | null): string {
  if (minute === null) return ''
  return extraMinute ? `${minute}+${extraMinute}'` : `${minute}'`
}

// Render the action type header with custom icons matching the image style
function EventHeader({ type, minute }: { type: string; minute: string }) {
  let title = type.toUpperCase()
  let iconElement = null

  if (type === 'yellowCard') {
    title = 'YELLOW CARD'
    iconElement = <div className="w-3 h-4 bg-yellow-400 rounded-[1px] shadow-sm" />
  } else if (type === 'redCard') {
    title = 'RED CARD'
    iconElement = <div className="w-3 h-4 bg-red-600 rounded-[1px] shadow-sm" />
  } else if (type === 'substitution') {
    title = 'SUBSTITUTION'
    iconElement = (
      <div className="flex items-center gap-[2px] text-xs font-bold font-mono">
        <span className="text-green-500">↑</span>
        <span className="text-red-500">↓</span>
      </div>
    )
  } else if (type === 'goal' || type === 'penalty') {
    title = type === 'penalty' ? 'PENALTY GOAL' : 'GOAL'
    iconElement = <span className="text-sm">⚽</span>
  }

  return (
    <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
      <div className="flex items-center gap-2">
        {iconElement}
        <span className="text-xs font-bold text-zinc-100 tracking-wide">{title}</span>
      </div>
      <span className="text-xs font-semibold text-zinc-400 font-mono">{minute}</span>
    </div>
  )
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
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 h-36" />
        ))}
      </div>
    )
  }

  const visibleEvents = events.filter((ev) =>
    ['goal', 'ownGoal', 'penalty', 'missedPenalty', 'yellowCard', 'redCard', 'substitution', 'var'].includes(ev.type)
  )

  if (visibleEvents.length === 0) {
    return (
      <div className="text-center py-8 bg-zinc-900/30 rounded-xl border border-zinc-800 p-4">
        <p className="text-xs text-zinc-500">No match timeline events available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {visibleEvents.map((ev) => {
        const timeStr = formatMinute(ev.minute, ev.extraMinute)

        return (
          <div key={ev._id} className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-3 shadow-lg">
            {/* 1. Header Row */}
            <EventHeader type={ev.type} minute={timeStr} />

            {/* 2. Main Content Body */}
            <div className="space-y-2">
              {ev.type === 'substitution' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-green-500 uppercase tracking-wider mb-0.5">IN</span>
                      <h4 className="text-sm font-semibold text-zinc-100 truncate">{ev.playerName}</h4>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{ev.teamName}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-red-500 uppercase tracking-wider mb-0.5">OUT</span>
                      <h4 className="text-sm font-semibold text-zinc-100 truncate">{ev.playerOut}</h4>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{ev.teamName}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-100 truncate">{ev.playerName}</h4>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{ev.teamName}</p>
                  </div>
                </div>
              )}

              {/* 3. Narrative Live Text Description */}
              {ev.description && (
                <p className="text-xs text-zinc-400 border-t border-zinc-800/50 pt-2 leading-relaxed">
                  {ev.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
