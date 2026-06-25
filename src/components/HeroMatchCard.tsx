import { Link } from 'react-router-dom'
import type { Match } from '../lib/types'

interface Props {
  match: Match
}

export default function HeroMatchCard({ match }: Props) {
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-bg-card via-bg-card to-[#1a1f33] border border-border-dark">
      {/* Background accent glow */}
      {isLive && (
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-live/10 rounded-full blur-3xl" />
      )}

      <div className="relative px-4 py-5">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-4">
          {isLive ? (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
              <span className="text-xs font-bold text-live uppercase tracking-wider">Live</span>
              {match.minute != null && (
                <span className="text-xs text-live font-semibold">{match.minute}&rsquo;</span>
              )}
            </div>
          ) : (
            <span className="text-xs text-text-muted uppercase tracking-wider">
              {isFinished ? 'Full Time' : 'Upcoming'}
            </span>
          )}
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-bg-base flex items-center justify-center overflow-hidden">
              {match.homeTeam?.flag ? (
                <img src={match.homeTeam.flag} alt="" className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-lg font-bold text-text-muted">
                  {match.homeTeam?.name?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-white text-center truncate max-w-28">
              {match.homeTeam?.name || 'TBD'}
            </span>
          </div>

          {/* Score */}
          <div className="shrink-0 text-center">
            <div className="text-3xl font-bold tabular-nums text-white">
              <span>{match.score?.fulltime?.home ?? '-'}</span>
              <span className="mx-2 text-text-muted">:</span>
              <span>{match.score?.fulltime?.away ?? '-'}</span>
            </div>
          </div>

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-bg-base flex items-center justify-center overflow-hidden">
              {match.awayTeam?.flag ? (
                <img src={match.awayTeam.flag} alt="" className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-lg font-bold text-text-muted">
                  {match.awayTeam?.name?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-white text-center truncate max-w-28">
              {match.awayTeam?.name || 'TBD'}
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to={`/matches/${match._id}`}
            className="inline-block px-5 py-1.5 text-xs font-semibold text-white bg-accent hover:bg-accent-hover rounded-full transition-colors"
          >
            Match Centre
          </Link>
        </div>
      </div>
    </div>
  )
}
