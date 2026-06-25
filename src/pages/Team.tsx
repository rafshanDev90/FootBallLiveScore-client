import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Team, Match } from '../lib/types'
import MatchCard from '../components/MatchCard'

export default function TeamPage() {
  const { id } = useParams<{ id: string }>()
  const [team, setTeam] = useState<Team | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const [teamRes, matchesRes] = await Promise.all([
          api.teams.byId(id!),
          api.teams.matches(id!, { limit: '10' }),
        ])
        setTeam(teamRes.data)
        setMatches(matchesRes.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="text-center py-20 text-text-muted">Loading...</div>
  if (!team) return <div className="text-center py-20 text-text-muted">Team not found</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Link to="/" className="text-sm text-accent hover:underline">&larr; Back</Link>
      <div className="flex items-center gap-4 mt-2 mb-6">
        <div className="w-12 h-12 rounded-full bg-bg-card border border-border-dark flex items-center justify-center overflow-hidden">
          {team.flag ? (
            <img src={team.flag} alt="" className="w-8 h-8 object-contain" />
          ) : (
            <span className="text-lg font-bold text-text-muted">{team.name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{team.name}</h1>
          <p className="text-sm text-text-muted">{team.country}</p>
        </div>
      </div>

      <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Matches</h2>
      {matches.length === 0 ? (
        <p className="text-sm text-text-muted">No matches found</p>
      ) : (
        <div className="space-y-2">
          {matches.map((m) => <MatchCard key={m._id} match={m} />)}
        </div>
      )}
    </div>
  )
}
