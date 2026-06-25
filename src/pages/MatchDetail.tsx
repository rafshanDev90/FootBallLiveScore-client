import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Match } from '../lib/types'
import HeroMatchCard from '../components/HeroMatchCard'
import MatchStatsWidget from '../components/MatchStatsWidget'
import { formatLocalDateTime } from '../lib/date'

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    api.matches.byId(id).then((res) => setMatch(res.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="text-center py-20 text-text-muted">Loading...</div>
  if (!match) return <div className="text-center py-20 text-text-muted">Match not found</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Link to="/" className="text-sm text-accent hover:underline">&larr; Back</Link>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          <HeroMatchCard match={match} />

          {/* Match info */}
          <div className="rounded-xl border border-border-dark bg-bg-card p-4">
            <div className="text-sm text-text-muted mb-3">
              {formatLocalDateTime(match.localDate)}
            </div>

            {match.round && (
              <p className="text-sm text-text-secondary">
                Round: <span className="font-medium text-white">{match.round}</span>
              </p>
            )}
            {match.group && (
              <p className="text-sm text-text-secondary">
                Group: <span className="font-medium text-white">{match.group}</span>
              </p>
            )}
          </div>

          {/* Team links */}
          {match.homeTeam?.teamRef && match.awayTeam?.teamRef && (
            <div className="flex gap-3">
              <Link
                to={`/teams/${match.homeTeam.teamRef}`}
                className="flex-1 text-center text-sm bg-bg-card hover:bg-bg-card-hover border border-border-dark rounded-xl py-2.5 font-medium text-white transition-colors"
              >
                {match.homeTeam.name} page
              </Link>
              <Link
                to={`/teams/${match.awayTeam.teamRef}`}
                className="flex-1 text-center text-sm bg-bg-card hover:bg-bg-card-hover border border-border-dark rounded-xl py-2.5 font-medium text-white transition-colors"
              >
                {match.awayTeam.name} page
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <MatchStatsWidget />
        </div>
      </div>
    </div>
  )
}
