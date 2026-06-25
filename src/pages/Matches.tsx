import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Match } from '../lib/types'
import MatchScheduleTable from '../components/MatchScheduleTable'

const STATUSES = ['all', 'scheduled', 'live', 'finished'] as const

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [status, setStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const limit = 20

  useEffect(() => {
    setPage(1)
  }, [status])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const params: Record<string, string> = { page: String(page), limit: String(limit) }
        if (status !== 'all') params.status = status
        const res = await api.matches.list(params)
        setMatches(res.data)
        setTotal(res.total)
        setPages(res.pages)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, status])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-white mb-4">Matches</h1>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors capitalize ${
              status === s
                ? 'bg-accent text-white'
                : 'bg-bg-card text-text-secondary hover:bg-bg-card-hover'
            }`}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20 text-text-muted">Loading...</div>
      ) : (
        <>
          <MatchScheduleTable matches={matches} emptyMessage="No matches found" />

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 text-sm mt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-md border border-border-dark bg-bg-card text-text-secondary hover:bg-bg-card-hover disabled:opacity-30 transition-colors"
              >
                Prev
              </button>
              <span className="text-text-muted">
                Page {page} of {pages} ({total} total)
              </span>
              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="px-3 py-1 rounded-md border border-border-dark bg-bg-card text-text-secondary hover:bg-bg-card-hover disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
