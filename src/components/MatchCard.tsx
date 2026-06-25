import { Link } from 'react-router-dom'
import type { Match } from '../lib/types'
import { formatLocalTime, formatLocalDate } from '../lib/date'

const statusBadge: Record<string, { label: string; class: string }> = {
  live: { label: 'LIVE', class: 'bg-live text-white' },
  finished: { label: 'FT', class: 'bg-text-muted text-white' },
  scheduled: { label: '', class: '' },
  cancelled: { label: 'CANC', class: 'bg-text-muted text-white' },
}

interface Props {
  match: Match
}

export default function MatchCard({ match }: Props) {
  const badge = statusBadge[match.status] || statusBadge.scheduled

  return (
    <Link
      to={`/matches/${match._id}`}
      className="block rounded-xl border border-border-dark bg-bg-card hover:bg-bg-card-hover px-4 py-3 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-14 shrink-0 text-center">
          {badge.label ? (
            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.class}`}>
              {badge.label}
            </span>
          ) : (
            <span className="text-xs text-text-muted">{formatLocalTime(match.localDate)}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm truncate">
            <span className="truncate font-medium text-white">{match.homeTeam?.name || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm truncate">
            <span className="truncate font-medium text-white">{match.awayTeam?.name || 'TBD'}</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg font-bold tabular-nums text-white">
            {match.score?.fulltime?.home ?? '-'}:{match.score?.fulltime?.away ?? '-'}
          </div>
          {match.status === 'live' && match.minute != null && (
            <div className="text-[10px] text-live font-semibold">{match.minute}&rsquo;</div>
          )}
        </div>
      </div>

      {match.status === 'scheduled' && (
        <div className="text-[11px] text-text-muted mt-1 pl-[4.5rem]">{formatLocalDate(match.localDate)}</div>
      )}
    </Link>
  )
}
