import type { StandingEntry } from '../lib/types'

interface Props {
  group: string
  entries: StandingEntry[]
}

export default function GroupOverviewGrid({ group, entries }: Props) {
  const sorted = [...entries].sort((a, b) => a.position - b.position)

  return (
    <div className="rounded-xl border border-border-dark overflow-hidden bg-bg-card">
      <div className="bg-bg-card border-b border-border-dark px-3 py-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
        Group {group}
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-text-muted border-b border-border-dark">
            <th className="px-2 py-1.5 text-left">#</th>
            <th className="px-2 py-1.5 text-left">Team</th>
            <th className="px-2 py-1.5 text-center">P</th>
            <th className="px-2 py-1.5 text-center">W</th>
            <th className="px-2 py-1.5 text-center">D</th>
            <th className="px-2 py-1.5 text-center">L</th>
            <th className="px-2 py-1.5 text-center font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e) => (
            <tr key={e.teamId} className="border-t border-border-dark hover:bg-bg-card-hover transition-colors">
              <td className="px-2 py-1.5 text-text-muted">{e.position}</td>
              <td className="px-2 py-1.5">
                <div className="flex items-center gap-1.5">
                  {e.teamFlag ? (
                    <img src={e.teamFlag} alt="" className="w-4 h-3 object-contain shrink-0" />
                  ) : null}
                  <span className="font-medium text-white truncate">{e.teamName}</span>
                </div>
              </td>
              <td className="px-2 py-1.5 text-center text-text-secondary">{e.played}</td>
              <td className="px-2 py-1.5 text-center text-text-secondary">{e.won}</td>
              <td className="px-2 py-1.5 text-center text-text-secondary">{e.drawn}</td>
              <td className="px-2 py-1.5 text-center text-text-secondary">{e.lost}</td>
              <td className="px-2 py-1.5 text-center font-bold text-accent">{e.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
