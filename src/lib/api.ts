import type { Match, League, Team, Standing, PaginatedResponse, SingleResponse } from './types'

const BASE = '/api/v1'

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(path, window.location.origin)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v)
    })
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json()
}

export const api = {
  // Matches
  matches: {
    list: (params?: Record<string, string>) =>
      get<PaginatedResponse<Match>>(`${BASE}/matches`, params),
    live: () => get<{ success: boolean; data: Match[] }>(`${BASE}/matches/live`),
    upcoming: (limit = 20) =>
      get<{ success: boolean; data: Match[] }>(`${BASE}/matches/upcoming`, { limit: String(limit) }),
    recent: (limit = 20) =>
      get<{ success: boolean; data: Match[] }>(`${BASE}/matches/recent`, { limit: String(limit) }),
    byId: (id: string) => get<SingleResponse<Match>>(`${BASE}/matches/${id}`),
  },

  // Leagues
  leagues: {
    list: () => get<PaginatedResponse<League>>(`${BASE}/leagues`),
    byId: (id: string) => get<SingleResponse<League>>(`${BASE}/leagues/${id}`),
    standings: (leagueId: string) =>
      get<SingleResponse<Standing>>(`${BASE}/leagues/${leagueId}/standings`),
  },

  // Teams
  teams: {
    list: (params?: Record<string, string>) =>
      get<PaginatedResponse<Team>>(`${BASE}/teams`, params),
    byId: (id: string) => get<SingleResponse<Team>>(`${BASE}/teams/${id}`),
    matches: (id: string, params?: Record<string, string>) =>
      get<PaginatedResponse<Match>>(`${BASE}/teams/${id}/matches`, params),
  },
}
