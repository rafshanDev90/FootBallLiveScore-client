import type { Match } from '../lib/types'
import MatchRow from './MatchRow'

interface Props {
  matches: Match[]
  emptyMessage?: string
}

export default function MatchScheduleTable({ matches, emptyMessage = 'No matches' }: Props) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted text-sm">{emptyMessage}</div>
    )
  }

  return (
    <div className="rounded-xl border border-border-dark overflow-hidden bg-bg-card">
      <div className="divide-y divide-border-dark">
        {matches.map((m) => (
          <MatchRow key={m._id} match={m} />
        ))}
      </div>
    </div>
  )
}
