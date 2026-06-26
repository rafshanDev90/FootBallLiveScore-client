import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { MatchStats, TeamStats } from '../lib/types'

interface Props {
  matchId: string
  compact?: boolean
  homeLogo?: string | null
  awayLogo?: string | null
}

interface StatRow {
  label: string
  key: keyof TeamStats
  suffix?: string
}

const COMPACT_ROWS: StatRow[] = [
  { label: 'Possession', key: 'possessionPct', suffix: '%' },
  { label: 'Shots on target', key: 'shotsOnTarget' },
  { label: 'Corners', key: 'wonCorners' },
  { label: 'Fouls', key: 'foulsCommitted' },
  { label: 'Yellow cards', key: 'yellowCards' },
]

const FULL_ROWS: StatRow[] = [
  { label: 'Shots', key: 'totalShots' },
  { label: 'Shots on target', key: 'shotsOnTarget' },
  { label: 'Possession', key: 'possessionPct', suffix: '%' },
  { label: 'Passes', key: 'totalPasses' },
  { label: 'Pass accuracy', key: 'passPct', suffix: '%' },
  { label: 'Fouls', key: 'foulsCommitted' },
  { label: 'Yellow cards', key: 'yellowCards' },
  { label: 'Red cards', key: 'redCards' },
  { label: 'Offsides', key: 'offsides' },
  { label: 'Corners', key: 'wonCorners' },
]

function formatVal(val: number | null | undefined): number | null {
  if (val === null || val === undefined) return null
  return val
}

export default function MatchStatsPanel({ matchId, compact, homeLogo, awayLogo }: Props) {
  const [stats, setStats] = useState<MatchStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.matches.stats(matchId)
      .then((res) => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [matchId])

  const rows = compact ? COMPACT_ROWS : FULL_ROWS

  if (loading) {
    return (
      <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-4">
        <div className="h-4 bg-zinc-800 rounded w-24 mx-auto mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center gap-4 animate-pulse">
              <div className="w-8 h-5 bg-zinc-800 rounded" />
              <div className="w-24 h-4 bg-zinc-800 rounded" />
              <div className="w-8 h-5 bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const home = stats.homeTeam
  const away = stats.awayTeam

  return (
    <div className="bg-[#18181b] border border-zinc-800/80 rounded-xl p-4 shadow-2xl">

      {/* 1. Header Row (Team Logos/Flags Context) */}
      <div className="grid grid-cols-3 items-center text-center border-b border-zinc-800 pb-3 mb-4">
        <div className="flex justify-start pl-2">
          {homeLogo ? (
            <img src={homeLogo} alt="Home" className="w-6 h-4 object-cover rounded-[2px]" />
          ) : (
            <div className="w-6 h-4 bg-zinc-700 rounded-[2px]" />
          )}
        </div>
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
          TEAM STATS
        </span>
        <div className="flex justify-end pr-2">
          {awayLogo ? (
            <img src={awayLogo} alt="Away" className="w-6 h-4 object-cover rounded-[2px]" />
          ) : (
            <div className="w-6 h-4 bg-zinc-700 rounded-[2px]" />
          )}
        </div>
      </div>

      {/* 2. Structured Stat Feed */}
      <div className="space-y-3">
        {rows.map((row) => {
          const homeRaw = formatVal(home?.[row.key] as number)
          const awayRaw = formatVal(away?.[row.key] as number)

          // Fallback if data fields are totally blank
          if (homeRaw === null && awayRaw === null) return null

          const hVal = homeRaw ?? 0
          const aVal = awayRaw ?? 0

          // Determine who gets the highlight pill (highest value wins)
          // Exception: For fouls, typically lower is better, but layouts usually highlight highest raw volume.
          const isHomeWinner = hVal > aVal
          const isAwayWinner = aVal > hVal

          const hString = `${hVal}${row.suffix || ''}`
          const aString = `${aVal}${row.suffix || ''}`

          return (
            <div key={row.key} className="grid grid-cols-3 items-center text-center">
              
              {/* Left Value Slot */}
              <div className="flex justify-start pl-2">
                <span className={`text-xs font-mono font-bold min-w-[28px] h-7 flex items-center justify-center transition-all ${
                  isHomeWinner 
                    ? 'bg-blue-600 text-white rounded-full px-2' 
                    : 'text-zinc-300'
                }`}>
                  {hString}
                </span>
              </div>

              {/* Central Metric Label */}
              <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">
                {row.label}
              </span>

              {/* Right Value Slot */}
              <div className="flex justify-end pr-2">
                <span className={`text-xs font-mono font-bold min-w-[28px] h-7 flex items-center justify-center transition-all ${
                  isAwayWinner 
                    ? 'bg-zinc-100 text-black rounded-full px-2' 
                    : 'text-zinc-300'
                }`}>
                  {aString}
                </span>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}
