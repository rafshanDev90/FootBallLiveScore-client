import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Match } from '../lib/types'

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.matches.byId(id).then((res) => setMatch(res.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!match) return <div className="text-center py-20 text-gray-400">Match not found</div>

  const date = new Date(match.date)
  const isLive = match.status === 'live'
  const isFinished = match.status === 'finished'

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/" className="text-sm text-emerald-600 hover:underline">&larr; Back</Link>

      <div className="mt-4 border rounded-lg overflow-hidden">
        {/* Header */}
        <div className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wide ${
          isLive ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500'
        }`}>
          {isLive ? `LIVE ${match.minute != null ? `${match.minute}'` : ''}` : match.status}
        </div>

        {/* Scoreboard */}
        <div className="bg-white px-6 py-6">
          <div className="text-center text-sm text-gray-400 mb-4">
            {date.toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
            })}
            {' — '}
            {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>

          <div className="flex items-center justify-center gap-6">
            {/* Home */}
            <div className="flex-1 text-right">
              <div className="text-lg font-bold truncate">{match.homeTeam?.name || 'TBD'}</div>
            </div>

            {/* Score */}
            <div className="text-center shrink-0">
              <div className="text-4xl font-bold tabular-nums">
                <span>{match.score?.fulltime?.home ?? '-'}</span>
                <span className="mx-2 text-gray-300">:</span>
                <span>{match.score?.fulltime?.away ?? '-'}</span>
              </div>
              {isLive && match.minute != null && (
                <div className="text-sm text-red-500 font-semibold mt-1">{match.minute}'</div>
              )}
            </div>

            {/* Away */}
            <div className="flex-1 text-left">
              <div className="text-lg font-bold truncate">{match.awayTeam?.name || 'TBD'}</div>
            </div>
          </div>

          {/* Halftime score */}
          {isFinished && (match.score?.halftime?.home != null || match.score?.halftime?.away != null) && (
            <div className="text-center text-xs text-gray-400 mt-3">
              HT: {match.score.halftime.home}–{match.score.halftime.away}
            </div>
          )}
        </div>
      </div>

      {/* Match info */}
      <div className="mt-4 text-sm text-gray-500 space-y-1">
        {match.round && <p>Round: <span className="font-medium">{match.round}</span></p>}
        {match.group && <p>Group: <span className="font-medium">{match.group}</span></p>}
      </div>

      {/* Team links */}
      {match.homeTeam?.teamRef && match.awayTeam?.teamRef && (
        <div className="mt-6 flex gap-4">
          <Link
            to={`/teams/${match.homeTeam.teamRef}`}
            className="flex-1 text-center text-sm bg-gray-100 hover:bg-gray-200 rounded-lg py-2 font-medium transition-colors"
          >
            {match.homeTeam.name} page
          </Link>
          <Link
            to={`/teams/${match.awayTeam.teamRef}`}
            className="flex-1 text-center text-sm bg-gray-100 hover:bg-gray-200 rounded-lg py-2 font-medium transition-colors"
          >
            {match.awayTeam.name} page
          </Link>
        </div>
      )}
    </div>
  )
}
