import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Match, Standing } from '../lib/types'
import HeroMatchCard from '../components/HeroMatchCard'
import MatchScheduleTable from '../components/MatchScheduleTable'
import GroupOverviewGrid from '../components/GroupOverviewGrid'

export default function Home() {
  const [live, setLive] = useState<Match[]>([])
  const [upcoming, setUpcoming] = useState<Match[]>([])
  const [recent, setRecent] = useState<Match[]>([])
  const [standings, setStandings] = useState<Standing | null>(null)
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
          const standingRes = await api.leagues.standings(leaguesRes.data[0]._id)
          setStandings(standingRes.data)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="text-center py-20 text-text-muted">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Live / Hero */}
      <section>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
          {live.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />}
          Live Now
        </h2>
        {live.length === 0 ? (
          <p className="text-sm text-text-muted">No live matches at the moment</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {live.slice(0, 2).map((m) => (
              <HeroMatchCard key={m._id} match={m} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming */}
      <section>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Upcoming</h2>
        <MatchScheduleTable matches={upcoming} emptyMessage="No upcoming matches" />
      </section>

      {/* Recent */}
      <section>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Recent Results</h2>
        <MatchScheduleTable matches={recent} emptyMessage="No recent matches" />
      </section>

      {/* Standings preview */}
      {standings && (
        <section>
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Group Standings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {groupBy(standings.entries, 'group').map(([group, entries]) => (
              <GroupOverviewGrid key={group} group={group} entries={entries} />
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
