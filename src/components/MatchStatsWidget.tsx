export default function MatchStatsWidget() {
  return (
    <div className="rounded-xl border border-border-dark bg-bg-card p-4">
      <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Match Stats</h3>
      <div className="flex flex-col items-center justify-center py-8 text-text-muted">
        <svg className="w-8 h-8 mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-xs text-center">Stats will appear during live matches</p>
      </div>
    </div>
  )
}
