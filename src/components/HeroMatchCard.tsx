import type { Match } from '../lib/types'
import { Link } from 'react-router-dom'
import { formatLocalDateTime } from '../lib/date'

interface Props {
  match: Match
}

export default function HeroMatchCard({ match }: Props) {
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <Link
      to={`/matches/${match._id}`}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bg-card via-bg-card to-[#1a1f33] border border-border-dark block hover:border-accent/30 transition-colors"
    >
      {/* Accent glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative px-6 py-6 md:py-8">
        {/* Status bar */}
        <div className="flex items-center justify-center mb-5">
          {isLive ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-live/10 border border-live/20">
              <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
              <span className="text-xs font-bold text-live uppercase tracking-widest">Live</span>
              {match.minute != null && (
                <span className="text-xs font-semibold text-live/80">{match.minute}&rsquo;</span>
              )}
            </div>
          ) : isFinished ? (
            <div className="px-3 py-1 rounded-full bg-white/5 border border-border-dark">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-widest">Full Time</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-white/5 border border-border-dark">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-widest">Scheduled</span>
            </div>
          )}
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-center gap-2 md:gap-8 mb-5">
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-bg-base/50 flex items-center justify-center overflow-hidden ring-1 ring-white/5">
              {match.homeTeam?.flag ? (
                <img src={match.homeTeam.flag} alt="" className="w-11 h-11 md:w-14 md:h-14 object-contain" />
              ) : (
                <span className="text-2xl font-bold text-text-muted">
                  {match.homeTeam?.name?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <span className="text-sm md:text-base font-semibold text-white text-center truncate max-w-32 md:max-w-40">
              {match.homeTeam?.name || 'TBD'}
            </span>
          </div>

          {/* Score */}
          <div className="shrink-0 flex items-baseline gap-1.5">
            <span className={`text-4xl md:text-5xl font-bold tabular-nums ${isLive ? 'text-live' : 'text-white'}`}>
              {match.score?.fulltime?.home ?? '-'}
            </span>
            <span className="text-3xl md:text-4xl font-light text-text-muted">:</span>
            <span className={`text-4xl md:text-5xl font-bold tabular-nums ${isLive ? 'text-live' : 'text-white'}`}>
              {match.score?.fulltime?.away ?? '-'}
            </span>
          </div>

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-bg-base/50 flex items-center justify-center overflow-hidden ring-1 ring-white/5">
              {match.awayTeam?.flag ? (
                <img src={match.awayTeam.flag} alt="" className="w-11 h-11 md:w-14 md:h-14 object-contain" />
              ) : (
                <span className="text-2xl font-bold text-text-muted">
                  {match.awayTeam?.name?.charAt(0) || '?'}
                </span>
              )}
            </div>
            <span className="text-sm md:text-base font-semibold text-white text-center truncate max-w-32 md:max-w-40">
              {match.awayTeam?.name || 'TBD'}
            </span>
          </div>
        </div>

        {/* Venue & Date */}
        <div className="text-center">
          <p className="text-xs text-text-muted">
            {match.localDate && formatLocalDateTime(match.localDate)}
          </p>
          {(match.round || match.group) && (
            <p className="text-xs text-text-muted mt-0.5">
              {match.round}{match.round && match.group ? ' · ' : ''}{match.group}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
