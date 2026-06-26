import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import type { Match } from '../lib/types'
import HeroMatchCard from '../components/HeroMatchCard'
import MatchTimeline from '../components/MatchTimeline'
import MatchStatsPanel from '../components/MatchStatsPanel'
import MatchFormationPitch from '../components/MatchFormationPitch'
import { formatLocalDateTime } from '../lib/date'

const TABS = ['Overview', 'Stats', 'Lineups'] as const
type Tab = typeof TABS[number]

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('Overview')
  const [scraping, setScraping] = useState(false)
  const [scrapeMsg, setScrapeMsg] = useState('')

  useEffect(() => {
    if (!id) return
    api.matches.byId(id).then((res) => setMatch(res.data)).finally(() => setLoading(false))
  }, [id])

  const handleScrape = useCallback(async () => {
    if (!id) return
    setScraping(true)
    setScrapeMsg('')
    try {
      await api.matches.scrape(id)
      setScrapeMsg('Data loaded')
      setTimeout(() => window.location.reload(), 800)
    } catch (err) {
      setScrapeMsg(`Failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setScraping(false)
    }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-56 rounded-2xl bg-bg-card" />
          <div className="h-10 rounded-lg bg-bg-card w-72" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 h-80 rounded-xl bg-bg-card" />
            <div className="h-80 rounded-xl bg-bg-card" />
          </div>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted text-lg">Match not found</p>
        <Link to="/" className="text-accent hover:underline text-sm mt-2 inline-block">&larr; Back to matches</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors mb-4">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Hero */}
      <HeroMatchCard match={match} />

      {/* Tabs */}
      <div className="mt-5 border-b border-border-dark">
        <div className="flex gap-0 -mb-px">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
                tab === t
                  ? 'text-white border-b-2 border-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {tab === 'Overview' && (
            <>
              <MatchTimeline matchId={match._id} />
              <MatchStatsPanel matchId={match._id} compact homeLogo={match.homeTeam?.flag} awayLogo={match.awayTeam?.flag} />
            </>
          )}
          {tab === 'Stats' && (
            <MatchStatsPanel matchId={match._id} homeLogo={match.homeTeam?.flag} awayLogo={match.awayTeam?.flag} />
          )}
          {tab === 'Lineups' && (
            <MatchFormationPitch matchId={match._id} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Match info card */}
          <div className="rounded-xl border border-border-dark bg-bg-card p-4">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Match Info</h3>
            <div className="space-y-2 text-sm">
              {match.localDate && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Date</span>
                  <span className="text-white">{formatLocalDateTime(match.localDate)}</span>
                </div>
              )}
              {match.round && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Round</span>
                  <span className="text-white">{match.round}</span>
                </div>
              )}
              {match.group && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Group</span>
                  <span className="text-white">{match.group}</span>
                </div>
              )}
              {match.espnId && (
                <div className="flex justify-between">
                  <span className="text-text-muted">ESPN</span>
                  <span className="text-white text-xs">#{match.espnId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick stats card */}
          <div className="rounded-xl border border-border-dark bg-bg-card p-4">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-bg-base/50 rounded-lg py-2.5">
                <div className="text-lg font-bold text-white">{match.score?.fulltime?.home ?? '-'}</div>
                <div className="text-xs text-text-muted truncate">{match.homeTeam?.name || 'Home'}</div>
              </div>
              <div className="bg-bg-base/50 rounded-lg py-2.5">
                <div className="text-lg font-bold text-white">{match.score?.fulltime?.away ?? '-'}</div>
                <div className="text-xs text-text-muted truncate">{match.awayTeam?.name || 'Away'}</div>
              </div>
            </div>
            <div className="mt-2 flex justify-center gap-2 text-xs text-text-muted">
              <span className={`px-2 py-0.5 rounded-full ${match.status === 'live' ? 'bg-live/10 text-live' : match.status === 'finished' ? 'bg-white/5 text-text-secondary' : 'bg-white/5 text-text-muted'}`}>
                {match.status === 'live' ? 'Live' : match.status === 'finished' ? 'FT' : 'SCHED'}
              </span>
              {match.minute != null && (
                <span className="px-2 py-0.5 rounded-full bg-white/5 text-text-muted">{match.minute}&rsquo;</span>
              )}
            </div>
          </div>

          {/* Scrape */}
          <div className="rounded-xl border border-border-dark bg-bg-card p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleScrape}
                disabled={scraping}
                className="flex-1 text-xs bg-accent hover:bg-accent/80 disabled:opacity-50 text-white px-3 py-2 rounded-lg transition-colors font-medium"
              >
                {scraping ? 'Scraping...' : match.espnId ? 'Scrape ESPN' : 'Map & Scrape'}
              </button>
              {!match.espnId && (
                <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            {scrapeMsg && (
              <p className="text-xs text-text-muted mt-2">{scrapeMsg}</p>
            )}
          </div>

          {/* Team links */}
          {match.homeTeam?.teamRef && match.awayTeam?.teamRef && (
            <div className="flex gap-2">
              <Link
                to={`/teams/${match.homeTeam.teamRef}`}
                className="flex-1 text-center text-xs bg-bg-card hover:bg-bg-card-hover border border-border-dark rounded-lg py-2 font-medium text-text-secondary hover:text-white transition-colors truncate"
              >
                {match.homeTeam.name}
              </Link>
              <Link
                to={`/teams/${match.awayTeam.teamRef}`}
                className="flex-1 text-center text-xs bg-bg-card hover:bg-bg-card-hover border border-border-dark rounded-lg py-2 font-medium text-text-secondary hover:text-white transition-colors truncate"
              >
                {match.awayTeam.name}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
