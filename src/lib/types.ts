export interface Team {
  _id: string
  externalId: number
  name: string
  country: string
  logo: string | null
}

export interface Score {
  home: number | null
  away: number | null
}

export interface Match {
  _id: string
  externalId: number
  leagueId: string
  homeTeam: Team
  awayTeam: Team
  score: {
    fulltime: Score
    halftime: Score
  }
  date: string
  status: 'scheduled' | 'live' | 'finished' | 'cancelled'
  minute: number | null
  round: string
  group: string
}

export interface League {
  _id: string
  externalId: number
  name: string
  season: number
  logo: string | null
  country: string
}

export interface StandingEntry {
  group: string
  position: number
  teamId: number
  teamName: string
  teamLogo: string | null
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface Standing {
  _id: string
  leagueId: string
  season: number
  entries: StandingEntry[]
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface SingleResponse<T> {
  success: boolean
  data: T
}
