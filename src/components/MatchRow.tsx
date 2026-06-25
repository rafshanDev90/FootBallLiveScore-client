import { Link } from 'react-router-dom'
import type { Match } from '../lib/types'
import { formatLocalTime } from '../lib/date'

interface Props {
  match: Match
}

export default function MatchRow({ match }: Props) {
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <Link
      to={`/matches/${match._id}`}
      className="flex items-center gap-3 px-4 py-2.5 bg-bg-card hover:bg-bg-card-hover border-b border-border-dark transition-colors last:border-b-0"
    >
      {/* Status */}
      <div className="w-14 shrink-0 text-center">
        {isLive ? (
          <div className="flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />
            <span className="text-[10px] font-bold text-live">LIVE</span>
            {match.minute != null && (
              <span className="text-[10px] text-live">{match.minute}&rsquo;</span>
            )}
          </div>
        ) : isFinished ? (
          <span className="text-[10px] font-bold text-text-muted">FT</span>
        ) : (
          <span className="text-[10px] text-text-muted">{formatLocalTime(match.localDate)}</span>
        )}
      </div>

      {/* Home team */}
      <div className="flex-1 flex items-center gap-2 min-w-0 justify-end">
        <span className="text-sm text-white truncate">{match.homeTeam?.name || 'TBD'}</span>
        <div className="w-5 h-5 rounded-full bg-bg-base flex items-center justify-center shrink-0 overflow-hidden">
          {match.homeTeam?.flag ? (
            <img src={match.homeTeam.flag} alt="" className="w-4 h-4 object-contain" />
          ) : (
            <span className="text-[8px] font-bold text-text-muted">{match.homeTeam?.name?.charAt(0) || '?'}</span>
          )}
        </div>
      </div>

      {/* Score */}
      <div className="w-12 text-center shrink-0">
        <span className={`text-sm font-bold tabular-nums ${isLive ? 'text-accent' : 'text-white'}`}>
          {match.score?.fulltime?.home ?? '-'}:{match.score?.fulltime?.away ?? '-'}
        </span>
      </div>

      {/* Away team */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <div className="w-5 h-5 rounded-full bg-bg-base flex items-center justify-center shrink-0 overflow-hidden">
          {match.awayTeam?.flag ? (
            <img src={match.awayTeam.flag} alt="" className="w-4 h-4 object-contain" />
          ) : (
            <span className="text-[8px] font-bold text-text-muted">{match.awayTeam?.name?.charAt(0) || '?'}</span>
          )}
        </div>
        <span className="text-sm text-white truncate">{match.awayTeam?.name || 'TBD'}</span>
      </div>
    </Link>
  )
}

