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

  const gk = starters.filter((p) => p.position === 'G' || p.formationPlace === 1)
  if (gk.length > 0) {
    result.push([gk[0]])
  } else {
    result.push([starters[0]])
  }

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
      stroke="rgba(255,255,255,0.12)"
      strokeWidth="2"
    >
      <rect x="20" y="20" width="640" height="920" rx="4" />
      <line x1="20" y1="480" x2="660" y2="480" />
      <circle cx="340" cy="480" r="80" />
      <circle cx="340" cy="480" r="4" fill="rgba(255,255,255,0.12)" />
      <rect x="20" y="140" width="640" height="280" />
      <rect x="20" y="540" width="640" height="280" />
      <rect x="110" y="320" width="460" height="100" />
      <rect x="110" y="540" width="460" height="100" />
      <circle cx="340" cy="220" r="4" fill="rgba(255,255,255,0.12)" />
      <circle cx="340" cy="740" r="4" fill="rgba(255,255,255,0.12)" />
      <path d="M 260 220 A 80 80 0 0 0 420 220" />
      <path d="M 260 740 A 80 80 0 0 1 420 740" />
      <path d="M 20 20 A 20 20 0 0 0 40 0" />
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
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {player.headshot && !imgFailed ? (
        <img
          src={player.headshot}
          alt={player.playerName || ''}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover shadow-lg ring-2 ring-white/20 bg-bg-base"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className={`
            w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center
            shadow-lg ring-2 ring-white/20 transition-transform hover:scale-110 cursor-default
            ${side === 'home' ? 'bg-accent/90 text-white' : 'bg-amber-500/90 text-white'}
          `}
        >
          <span className="text-[11px] md:text-xs font-bold tabular-nums leading-none">
            {player.jersey || ''}
          </span>
        </div>
      )}
      <span className="text-[10px] md:text-xs text-white font-medium mt-1 whitespace-nowrap drop-shadow-lg text-center leading-tight max-w-20 truncate">
        {player.playerName?.split(' ').pop() || ''}
      </span>
      {isCaptain && (
        <span className="text-[9px] text-yellow-400 font-bold -mt-0.5">(C)</span>
      )}
    </div>
  )
}

function PlayerList({ players, title }: { players: LineupPlayer[]; title: string }) {
  if (players.length === 0) return null
  return (
    <div>
      <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-1">{title}</p>
      <div className="space-y-0.5">
        {players.map((p, i) => (
          <div key={p.athleteId || i} className="flex items-center gap-2 text-xs">
            <span className="w-5 text-right text-text-muted font-mono tabular-nums">{p.jersey}</span>
            <span className="text-white truncate">{p.playerName}</span>
            {p.isCaptain && <span className="text-[9px] text-yellow-400 font-bold">(C)</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function calcY(rowIdx: number, rowCount: number, side: 'home' | 'away'): number {
  const totalSpan = 42
  const offset = 6
  if (side === 'away') {
    return offset + ((rowIdx + 0.5) / rowCount) * totalSpan
  }
  return (100 - offset) - ((rowIdx + 0.5) / rowCount) * totalSpan
}

function calcX(colIdx: number, count: number): number {
  if (count <= 1) return 50
  return ((colIdx + 0.5) / count) * 80 + 10
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

  const pitchPlayers: { player: LineupPlayer; x: number; y: number; side: 'home' | 'away' }[] = []

  if (awayRows.length >= 2) {
    for (let rowIdx = 0; rowIdx < awayRows.length; rowIdx++) {
      const rowPlayers = awayRows[rowIdx]
      const y = calcY(rowIdx, awayRows.length, 'away')
      for (let colIdx = 0; colIdx < rowPlayers.length; colIdx++) {
        pitchPlayers.push({
          player: rowPlayers[colIdx],
          x: calcX(colIdx, rowPlayers.length),
          y,
          side: 'away',
        })
      }
    }
  }

  if (homeRows.length >= 2) {
    for (let rowIdx = 0; rowIdx < homeRows.length; rowIdx++) {
      const rowPlayers = homeRows[rowIdx]
      const y = calcY(rowIdx, homeRows.length, 'home')
      for (let colIdx = 0; colIdx < rowPlayers.length; colIdx++) {
        pitchPlayers.push({
          player: rowPlayers[colIdx],
          x: calcX(colIdx, rowPlayers.length),
          y,
          side: 'home',
        })
      }
    }
  }

  const homeSubs = (lineup.homeTeam?.players || []).filter((p) => !p.isStarter)
  const awaySubs = (lineup.awayTeam?.players || []).filter((p) => !p.isStarter)

  return (
    <div className="rounded-xl border border-border-dark bg-bg-card p-4">
      <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">Formations</h3>

      <div className="relative aspect-[3/4] max-h-[650px] w-full rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d2818] via-[#163a26] to-[#0d2818]" />
        <PitchSVG />

        <div className="absolute inset-0">
          {pitchPlayers.map((pp, i) => (
            <PlayerDot
              key={`${pp.side}-${pp.player.athleteId || i}`}
              player={pp.player}
              x={pp.x}
              y={pp.y}
              side={pp.side}
            />
          ))}
        </div>

        {/* Away team label — top */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs md:text-sm font-bold text-white/90 drop-shadow-lg truncate">
              {lineup.awayTeam?.teamName || 'Away'}
            </span>
          </div>
          {lineup.awayTeam?.formation && (
            <span className="text-[10px] md:text-xs font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded">
              {lineup.awayTeam.formation}
            </span>
          )}
        </div>

        {/* Home team label — bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs md:text-sm font-bold text-white/90 drop-shadow-lg truncate">
              {lineup.homeTeam?.teamName || 'Home'}
            </span>
          </div>
          {lineup.homeTeam?.formation && (
            <span className="text-[10px] md:text-xs font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded">
              {lineup.homeTeam.formation}
            </span>
          )}
        </div>
      </div>

      {/* Roster lists below pitch */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home team roster */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
            <span className="text-sm font-semibold text-white">{lineup.homeTeam?.teamName || 'Home'}</span>
          </div>
          {homeRows.length >= 2 && <PlayerList players={homeRows.flat()} title="Starting XI" />}
          {homeSubs.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border-dark">
              <PlayerList players={homeSubs} title="Substitutes" />
            </div>
          )}
        </div>

        {/* Away team roster */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-white">{lineup.awayTeam?.teamName || 'Away'}</span>
          </div>
          {awayRows.length >= 2 && <PlayerList players={awayRows.flat()} title="Starting XI" />}
          {awaySubs.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border-dark">
              <PlayerList players={awaySubs} title="Substitutes" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
