import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { MatchLineup as MatchLineupType, LineupPlayer } from '../lib/types'

interface Props {
  matchId: string
}

function parseFormation(formation: string | null | undefined): number[] {
  if (!formation) return [4, 4, 2]
  const parts = formation.split('-').map(Number)
  return parts.length >= 2 ? parts : [4, 4, 2]
}

function assignRows(players: LineupPlayer[], formation: string | null | undefined): LineupPlayer[][] {
  const rows = parseFormation(formation)
  const starters = players
    .filter((p) => p.isStarter)
    .sort((a, b) => (a.formationPlace ?? 99) - (b.formationPlace ?? 99))

  if (starters.length < 2) return []

  const result: LineupPlayer[][] = []

  // GK is row 0
  const gk = starters.filter((p) => p.position === 'G' || p.formationPlace === 1)
  if (gk.length > 0) {
    result.push([gk[0]])
  } else {
    result.push([starters[0]])
  }

  // Assign remaining starters to rows based on formation
  let idx = result[0].length
  for (const count of rows) {
    const row: LineupPlayer[] = []
    for (let i = 0; i < count && idx < starters.length; i++, idx++) {
      row.push(starters[idx])
    }
    if (row.length > 0) result.push(row)
  }

  return result
}

function PitchSVG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 680 960"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="2"
    >
      {/* Border */}
      <rect x="20" y="20" width="640" height="920" rx="4" />

      {/* Center line */}
      <line x1="20" y1="480" x2="660" y2="480" />

      {/* Center circle */}
      <circle cx="340" cy="480" r="80" />
      <circle cx="340" cy="480" r="4" fill="rgba(255,255,255,0.15)" />

      {/* Penalty areas */}
      <rect x="20" y="140" width="640" height="280" />
      <rect x="20" y="540" width="640" height="280" />

      {/* Goal areas */}
      <rect x="110" y="320" width="460" height="100" />
      <rect x="110" y="540" width="460" height="100" />

      {/* Penalty spots */}
      <circle cx="340" cy="220" r="4" fill="rgba(255,255,255,0.15)" />
      <circle cx="340" cy="740" r="4" fill="rgba(255,255,255,0.15)" />

      {/* Penalty arcs */}
      <path d="M 260 220 A 80 80 0 0 0 420 220" />
      <path d="M 260 740 A 80 80 0 0 1 420 740" />

      {/* Corner arcs */}
      <path d="M 20 20 A 20 20 0 0 0 40 0" transform="translate(0,0)" />
      <path d="M 660 20 A 20 20 0 0 1 640 0" />
      <path d="M 20 940 A 20 20 0 0 1 40 960" />
      <path d="M 660 940 A 20 20 0 0 0 640 960" />
    </svg>
  )
}

function PlayerDot({
  player,
  x,
  y,
  side,
}: {
  player: LineupPlayer
  x: number
  y: number
  side: 'home' | 'away'
}) {
  const isCaptain = player.isCaptain

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Jersey circle */}
      <div
        className={`
          w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center
          shadow-lg ring-2 ring-white/20
          transition-transform hover:scale-110 cursor-default
          ${side === 'home'
            ? 'bg-accent/90 text-white'
            : 'bg-amber-500/90 text-white'}
        `}
      >
        <span className="text-[11px] md:text-xs font-bold tabular-nums leading-none">
          {player.jersey || ''}
        </span>
      </div>
      {/* Player name */}
      <span className="text-[10px] md:text-xs text-white font-medium mt-1 whitespace-nowrap drop-shadow-lg text-center leading-tight max-w-20 truncate">
        {player.playerName?.split(' ').pop() || ''}
      </span>
      {isCaptain && (
        <span className="text-[9px] text-yellow-400 font-bold -mt-0.5">(C)</span>
      )}
    </div>
  )
}

export default function MatchFormationPitch({ matchId }: Props) {
  const [lineup, setLineup] = useState<MatchLineupType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.matches.lineups(matchId)
      .then((res) => setLineup(res.data))
      .catch(() => setLineup(null))
      .finally(() => setLoading(false))
  }, [matchId])

  if (loading) {
    return (
      <div className="rounded-xl border border-border-dark bg-bg-card p-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Formations</h3>
        <div className="aspect-[3/4] max-h-[600px] rounded-xl bg-bg-base animate-pulse" />
      </div>
    )
  }

  if (!lineup || (!lineup.homeTeam?.players?.length && !lineup.awayTeam?.players?.length)) {
    return (
      <div className="rounded-xl border border-border-dark bg-bg-card p-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Formations</h3>
        <div className="text-center py-10">
          <svg className="w-10 h-10 mx-auto mb-3 text-text-muted opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-sm text-text-muted">Scrape to see formations</p>
        </div>
      </div>
    )
  }

  const homeRows = assignRows(lineup.homeTeam?.players || [], lineup.homeTeam?.formation)
  const awayRows = assignRows(lineup.awayTeam?.players || [], lineup.awayTeam?.formation)

  const renderPitch = (
    rows: LineupPlayer[][],
    side: 'home' | 'away',
    formation: string | null | undefined,
    teamName: string | null | undefined,
  ) => {
    if (rows.length < 2) {
      return (
        <div className="aspect-[3/4] max-h-[600px] rounded-xl bg-bg-base flex items-center justify-center">
          <p className="text-text-muted text-sm">Lineup data unavailable</p>
        </div>
      )
    }

    const pitchPlayers: { player: LineupPlayer; x: number; y: number }[] = []
    const rowCount = rows.length

    for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
      const rowPlayers = rows[rowIdx]
      const y = rowIdx === 0
        ? 92
        : (rowIdx / (rowCount - 1)) * 70 + 8

      const count = rowPlayers.length
      for (let colIdx = 0; colIdx < count; colIdx++) {
        const x = count === 1
          ? 50
          : ((colIdx + 0.5) / count) * 80 + 10
        pitchPlayers.push({ player: rowPlayers[colIdx], x, y })
      }
    }

    return (
      <div className="relative aspect-[3/4] max-h-[600px] w-full rounded-xl overflow-hidden">
        {/* Pitch background */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-700 via-green-600 to-green-700" />

        {/* Pitch SVG markings */}
        <PitchSVG />

        {/* Players */}
        <div className="absolute inset-0">
          {pitchPlayers.map((pp, i) => (
            <PlayerDot
              key={pp.player.athleteId || i}
              player={pp.player}
              x={pp.x}
              y={pp.y}
              side={side}
            />
          ))}
        </div>

        {/* Team & formation label */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-xs md:text-sm font-bold text-white/90 drop-shadow-lg truncate">{teamName || ''}</span>
          <span className="text-[10px] md:text-xs font-mono text-white/70 bg-black/30 px-2 py-0.5 rounded">
            {formation || 'N/A'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border-dark bg-bg-card p-4">
      <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Formations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-sm font-semibold text-white">{lineup.homeTeam?.teamName || 'Home'}</span>
          </div>
          {renderPitch(homeRows, 'home', lineup.homeTeam?.formation, lineup.homeTeam?.teamName)}
          <div className="mt-3 space-y-0.5">
            {homeRows.length > 1 && (
              <>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-1">Starting XI</p>
                {homeRows.flat().map((p, i) => (
                  <div key={p.athleteId || i} className="flex items-center gap-2 text-xs">
                    <span className="w-5 text-right text-text-muted font-mono tabular-nums">{p.jersey}</span>
                    <span className="text-white">{p.playerName}</span>
                    {p.isCaptain && <span className="text-[9px] text-yellow-400 font-bold">(C)</span>}
                  </div>
                ))}
              </>
            )}
            {(() => {
              const subs = (lineup.homeTeam?.players || []).filter((p) => !p.isStarter)
              return subs.length > 0 ? (
                <div className="mt-3 pt-3 border-t border-border-dark">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-1">Substitutes</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {subs.map((p, i) => (
                      <span key={p.athleteId || i} className="text-xs text-text-muted">
                        <span className="font-mono text-white">{p.jersey}</span> {p.playerName}
                        {i < subs.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null
            })()}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-white">{lineup.awayTeam?.teamName || 'Away'}</span>
          </div>
          {renderPitch(awayRows, 'away', lineup.awayTeam?.formation, lineup.awayTeam?.teamName)}
          <div className="mt-3 space-y-0.5">
            {awayRows.length > 1 && (
              <>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-1">Starting XI</p>
                {awayRows.flat().map((p, i) => (
                  <div key={p.athleteId || i} className="flex items-center gap-2 text-xs">
                    <span className="w-5 text-right text-text-muted font-mono tabular-nums">{p.jersey}</span>
                    <span className="text-white">{p.playerName}</span>
                    {p.isCaptain && <span className="text-[9px] text-yellow-400 font-bold">(C)</span>}
                  </div>
                ))}
              </>
            )}
            {(() => {
              const subs = (lineup.awayTeam?.players || []).filter((p) => !p.isStarter)
              return subs.length > 0 ? (
                <div className="mt-3 pt-3 border-t border-border-dark">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-1">Substitutes</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    {subs.map((p, i) => (
                      <span key={p.athleteId || i} className="text-xs text-text-muted">
                        <span className="font-mono text-white">{p.jersey}</span> {p.playerName}
                        {i < subs.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
