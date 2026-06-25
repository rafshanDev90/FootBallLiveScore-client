import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Standing } from '../lib/types'
import GroupOverviewGrid from '../components/GroupOverviewGrid'

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

  if (loading) return <div className="text-center py-20 text-text-muted">Loading...</div>
  if (!standing) return <div className="text-center py-20 text-text-muted">No standings data</div>

  const groups = new Map<string, typeof standing.entries>()
  for (const e of standing.entries) {
    if (!groups.has(e.group)) groups.set(e.group, [])
    groups.get(e.group)!.push(e)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-6">Group Standings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from(groups.entries()).map(([group, entries]) => (
          <GroupOverviewGrid key={group} group={group} entries={entries} />
        ))}
      </div>
    </div>
  )
}
