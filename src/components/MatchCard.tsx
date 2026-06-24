import { Link } from 'react-router-dom'
import type { Match } from '../lib/types'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const statusBadge: Record<string, { label: string; class: string }> = {
  live: { label: 'LIVE', class: 'bg-red-500 text-white animate-pulse' },
  finished: { label: 'FT', class: 'bg-gray-500 text-white' },
  scheduled: { label: '', class: 'bg-blue-100 text-blue-800' },
  cancelled: { label: 'CANC', class: 'bg-gray-300 text-gray-600' },
}

interface Props {
  match: Match
}

export default function MatchCard({ match }: Props) {
  const badge = statusBadge[match.status] || statusBadge.scheduled
  const homeBg = match.status === 'live' ? 'bg-green-50' : ''

  return (
    <Link
      to={`/matches/${match._id}`}
      className={`block border rounded-lg px-4 py-3 hover:shadow-md transition-shadow ${homeBg}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-16 shrink-0 text-center">
          {badge.label ? (
            <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.class}`}>
              {badge.label}
            </span>
          ) : (
            <span className="text-xs text-gray-500">{formatTime(match.date)}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm truncate">
            <span className="truncate font-medium">{match.homeTeam?.name || 'TBD'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm truncate">
            <span className="truncate font-medium">{match.awayTeam?.name || 'TBD'}</span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg font-bold tabular-nums">
            {match.score?.fulltime?.home ?? '-'}:{match.score?.fulltime?.away ?? '-'}
          </div>
          {match.status === 'live' && match.minute != null && (
            <div className="text-[10px] text-red-500 font-semibold">{match.minute}&rsquo;</div>
          )}
        </div>
      </div>

      {match.status === 'scheduled' && (
        <div className="text-[11px] text-gray-400 mt-1 pl-16">{formatDate(match.date)}</div>
      )}
    </Link>
  )
}
