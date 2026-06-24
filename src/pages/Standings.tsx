import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Standing } from '../lib/types'

export default function Standings() {
  const [standing, setStanding] = useState<Standing | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const leagues = await api.leagues.list()
        if (leagues.data.length === 0) return
        const res = await api.leagues.standings(leagues.data[0]._id)
        setStanding(res.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>
  if (!standing) return <div className="text-center py-20 text-gray-400">No standings data</div>

  const groups = new Map<string, typeof standing.entries>()
  for (const e of standing.entries) {
    if (!groups.has(e.group)) groups.set(e.group, [])
    groups.get(e.group)!.push(e)
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Group Standings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from(groups.entries()).map(([group, entries]) => (
          <div key={group} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-800 text-white text-sm font-bold px-4 py-2">
              Group {group}
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-3 py-2 text-left">#</th>
                  <th className="px-3 py-2 text-left">Team</th>
                  <th className="px-3 py-2 text-center">P</th>
                  <th className="px-3 py-2 text-center">W</th>
                  <th className="px-3 py-2 text-center">D</th>
                  <th className="px-3 py-2 text-center">L</th>
                  <th className="px-3 py-2 text-center">GF</th>
                  <th className="px-3 py-2 text-center">GA</th>
                  <th className="px-3 py-2 text-center">GD</th>
                  <th className="px-3 py-2 text-center font-bold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {entries
                  .sort((a, b) => a.position - b.position)
                  .map((e, i) => (
                    <tr
                      key={e.teamId}
                      className={`border-t border-gray-100 ${
                        i < 2 ? 'bg-green-50' : ''
                      }`}
                    >
                      <td className="px-3 py-2 text-gray-400">{e.position}</td>
                      <td className="px-3 py-2 font-medium">{e.teamName}</td>
                      <td className="px-3 py-2 text-center">{e.played}</td>
                      <td className="px-3 py-2 text-center">{e.won}</td>
                      <td className="px-3 py-2 text-center">{e.drawn}</td>
                      <td className="px-3 py-2 text-center">{e.lost}</td>
                      <td className="px-3 py-2 text-center">{e.goalsFor}</td>
                      <td className="px-3 py-2 text-center">{e.goalsAgainst}</td>
                      <td className="px-3 py-2 text-center">{e.goalDifference}</td>
                      <td className="px-3 py-2 text-center font-bold text-base">{e.points}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
