export interface Team {
  _id: string
  externalId: number
  name: string
  country: string
  logo: string | null
  flag: string | null
  teamRef?: string
}

export interface Score {
  home: number | null
  away: number | null
}

export interface Match {
  _id: string
  externalId: number
  espnId: number | null
  leagueId: string
  homeTeam: Team
  awayTeam: Team
  score: {
    fulltime: Score
    halftime: Score
  }
  date: string
  localDate: string | null
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
  teamFlag: string | null
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

export interface MatchEvent {
  _id: string
  matchId: string
  espnEventId: string | null
  type: 'goal' | 'ownGoal' | 'yellowCard' | 'redCard' | 'yellowRedCard' | 'substitution'
        | 'penalty' | 'missedPenalty' | 'var' | 'kickoff' | 'halftime' | 'fulltime'
        | 'startDelay' | 'endDelay' | 'startHalf' | 'other'
  minute: number | null
  extraMinute: number | null
  period: number
  teamName: string | null
  playerName: string | null
  playerOut: string | null
  description: string | null
  scoringPlay: boolean
  sortOrder: number
}

export interface TeamStats {
  teamName: string | null
  possessionPct: number | null
  totalShots: number | null
  shotsOnTarget: number | null
  foulsCommitted: number | null
  wonCorners: number | null
  saves: number | null
  yellowCards: number | null
  redCards: number | null
  offsides: number | null
  totalPasses: number | null
  accuratePasses: number | null
  passPct: number | null
  blockedShots: number | null
  totalTackles: number | null
  interceptions: number | null
  totalClearance: number | null
}

export interface MatchStats {
  _id: string
  matchId: string
  espnEventId: number | null
  homeTeam: TeamStats
  awayTeam: TeamStats
  lastSyncedAt: string | null
}

export interface LineupPlayer {
  jersey: string | null
  playerName: string | null
  athleteId: string | null
  position: string | null
  isStarter: boolean
  isCaptain: boolean
  subbedIn: boolean
  subbedOut: boolean
  formationPlace: number | null
  active: boolean
}

export interface TeamLineup {
  teamName: string | null
  formation: string | null
  players: LineupPlayer[]
}

export interface MatchLineup {
  _id: string
  matchId: string
  espnEventId: number | null
  homeTeam: TeamLineup
  awayTeam: TeamLineup
  lastSyncedAt: string | null
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

export interface ArrayResponse<T> {
  success: boolean
  data: T[]
}
