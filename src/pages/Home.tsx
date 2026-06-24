import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Match, Standing } from '../lib/types'
import MatchCard from '../components/MatchCard'

export default function Home() {
  const [live, setLive] = useState<Match[]>([])
  const [upcoming, setUpcoming] = useState<Match[]>([])
  const [recent, setRecent] = useState<Match[]>([])
  const [standings, setStandings] = useState<Standing | null>(null)
  const [leagueId, setLeagueId] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [liveRes, upcomingRes, recentRes, leaguesRes] = await Promise.all([
          api.matches.live(),
          api.matches.upcoming(5),
          api.matches.recent(5),
          api.leagues.list(),
        ])
        setLive(liveRes.data)
        setUpcoming(upcomingRes.data)
        setRecent(recentRes.data)

        if (leaguesRes.data.length > 0) {
          const lid = leaguesRes.data[0]._id
          setLeagueId(lid)
          const standingRes = await api.leagues.standings(lid)
          setStandings(standingRes.data)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* Live */}
      <section>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Live Now
        </h2>
        {live.length === 0 ? (
          <p className="text-sm text-gray-400">No live matches at the moment</p>
        ) : (
          <div className="space-y-2">
            {live.map((m) => <MatchCard key={m._id} match={m} />)}
          </div>
        )}
      </section>

      {/* Upcoming */}
      <section>
        <h2 className="text-lg font-bold mb-3">Upcoming</h2>
        <div className="space-y-2">
          {upcoming.map((m) => <MatchCard key={m._id} match={m} />)}
        </div>
      </section>

      {/* Recent */}
      <section>
        <h2 className="text-lg font-bold mb-3">Recent Results</h2>
        <div className="space-y-2">
          {recent.map((m) => <MatchCard key={m._id} match={m} />)}
        </div>
      </section>

      {/* Standings preview */}
      {standings && (
        <section>
          <h2 className="text-lg font-bold mb-3">Group Standings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {groupBy(standings.entries, 'group').map(([group, entries]) => (
              <div key={group} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5">
                  Group {group}
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100 text-gray-500">
                      <th className="px-2 py-1 text-left">#</th>
                      <th className="px-2 py-1 text-left">Team</th>
                      <th className="px-2 py-1 text-center">P</th>
                      <th className="px-2 py-1 text-center">W</th>
                      <th className="px-2 py-1 text-center">D</th>
                      <th className="px-2 py-1 text-center">L</th>
                      <th className="px-2 py-1 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e) => (
                      <tr key={e.teamId} className="border-t border-gray-100">
                        <td className="px-2 py-1 text-gray-400">{e.position}</td>
                        <td className="px-2 py-1 font-medium truncate max-w-24">{e.teamName}</td>
                        <td className="px-2 py-1 text-center">{e.played}</td>
                        <td className="px-2 py-1 text-center">{e.won}</td>
                        <td className="px-2 py-1 text-center">{e.drawn}</td>
                        <td className="px-2 py-1 text-center">{e.lost}</td>
                        <td className="px-2 py-1 text-center font-bold">{e.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function groupBy<T>(arr: T[], key: keyof T): [string, T[]][] {
  const map = new Map<string, T[]>()
  for (const item of arr) {
    const k = String(item[key])
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(item)
  }
  return Array.from(map.entries())
}
