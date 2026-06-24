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
          api.teams.byId(id),
          api.teams.matches(id, { limit: '10' }),
        ])
        setTeam(teamRes.data)
        setMatches(matchesRes.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!team) return <div className="text-center py-20 text-gray-400">Team not found</div>

  return (
    <div>
      <Link to="/" className="text-sm text-emerald-600 hover:underline">&larr; Back</Link>
      <div className="flex items-center gap-4 mt-2 mb-6">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500">
          {team.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold">{team.name}</h1>
          <p className="text-sm text-gray-500">{team.country}</p>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-3">Matches</h2>
      {matches.length === 0 ? (
        <p className="text-sm text-gray-400">No matches found</p>
      ) : (
        <div className="space-y-2">
          {matches.map((m) => <MatchCard key={m._id} match={m} />)}
        </div>
      )}
    </div>
  )
}
