import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Match } from '../lib/types'
import MatchCard from '../components/MatchCard'

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
    <div>
      <h1 className="text-xl font-bold mb-4">Matches</h1>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors capitalize ${
              status === s
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No matches found</div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {matches.map((m) => <MatchCard key={m._id} match={m} />)}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded border disabled:opacity-30 hover:bg-gray-100"
            >
              Prev
            </button>
            <span className="text-gray-500">
              Page {page} of {pages} ({total} total)
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="px-3 py-1 rounded border disabled:opacity-30 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
