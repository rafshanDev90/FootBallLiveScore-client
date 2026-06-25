import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { MatchStats, TeamStats } from '../lib/types'

interface Props {
  matchId: string
  compact?: boolean
}

interface StatRow {
  label: string
  key: keyof TeamStats
  suffix?: string
}

const COMPACT_ROWS: StatRow[] = [
  { label: 'Possession', key: 'possessionPct', suffix: '%' },
  { label: 'Shots on Target', key: 'shotsOnTarget' },
  { label: 'Corners', key: 'wonCorners' },
  { label: 'Fouls', key: 'foulsCommitted' },
  { label: 'Yellow Cards', key: 'yellowCards' },
]

const FULL_ROWS: StatRow[] = [
  { label: 'Possession', key: 'possessionPct', suffix: '%' },
  { label: 'Total Shots', key: 'totalShots' },
  { label: 'Shots on Target', key: 'shotsOnTarget' },
  { label: 'Blocked Shots', key: 'blockedShots' },
  { label: 'Corners', key: 'wonCorners' },
  { label: 'Fouls', key: 'foulsCommitted' },
  { label: 'Yellow Cards', key: 'yellowCards' },
  { label: 'Red Cards', key: 'redCards' },
  { label: 'Offsides', key: 'offsides' },
  { label: 'Saves', key: 'saves' },
  { label: 'Passes', key: 'totalPasses' },
  { label: 'Pass Accuracy', key: 'passPct', suffix: '%' },
  { label: 'Tackles', key: 'totalTackles' },
  { label: 'Interceptions', key: 'interceptions' },
  { label: 'Clearances', key: 'totalClearance' },
]

function formatVal(val: number | null | undefined): string {
  if (val === null || val === undefined) return '-'
  if (Number.isInteger(val)) return String(val)
  return val.toFixed(1)
}

export default function MatchStatsPanel({ matchId, compact }: Props) {
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
      <div className="rounded-xl border border-border-dark bg-bg-card p-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
          {compact ? 'Key Stats' : 'Match Stats'}
        </h3>
        <div className="space-y-3">
          {rows.map((_, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs text-text-muted mb-0.5">
                <span className="animate-pulse bg-bg-card-hover rounded h-3 w-8" />
                <span className="animate-pulse bg-bg-card-hover rounded h-3 w-12" />
                <span className="animate-pulse bg-bg-card-hover rounded h-3 w-8" />
              </div>
              <div className="h-1.5 rounded-full bg-bg-base animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="rounded-xl border border-border-dark bg-bg-card p-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
          {compact ? 'Key Stats' : 'Match Stats'}
        </h3>
        <div className="flex flex-col items-center justify-center py-6 text-text-muted">
          <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-xs text-center">Scrape to see stats</p>
        </div>
      </div>
    )
  }

  const home = stats.homeTeam
  const away = stats.awayTeam

  return (
    <div className="rounded-xl border border-border-dark bg-bg-card p-4">
      <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">
        {compact ? 'Key Stats' : 'Match Stats'}
      </h3>
      <div className="space-y-3">
        {rows.map((row) => {
          const homeVal = home?.[row.key] as number | null | undefined
          const awayVal = away?.[row.key] as number | null | undefined

          if (homeVal === null && awayVal === null && homeVal === undefined && awayVal === undefined) return null
          if (homeVal === null && homeVal === undefined) return null
          if (awayVal === null && awayVal === undefined) return null

          const hStr = formatVal(homeVal)
          const aStr = formatVal(awayVal)

          const maxVal = Math.max(homeVal ?? 0, awayVal ?? 0) || 1
          const hPct = (homeVal ?? 0) / maxVal * 100
          const aPct = (awayVal ?? 0) / maxVal * 100

          return (
            <div key={row.key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-white w-12 text-right">{hStr}<span className="text-text-muted font-normal">{row.suffix || ''}</span></span>
                <span className="text-text-muted uppercase text-[10px] tracking-wider font-medium px-2">{row.label}</span>
                <span className="font-semibold text-white w-12">{aStr}<span className="text-text-muted font-normal">{row.suffix || ''}</span></span>
              </div>
              <div className="flex h-2 gap-0.5 rounded-full overflow-hidden bg-bg-base">
                <div className="bg-accent transition-all duration-500" style={{ width: `${hPct}%` }} />
                <div className="bg-indigo-400/60 transition-all duration-500" style={{ width: `${aPct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
