export interface RepoOwner {
  login: string
  id: number
  avatar_url?: string
}

export interface RepoResult {
  id: number
  name: string
  full_name: string
  description: string | null
  owner: RepoOwner
  stargazers_count: number
  default_branch: string
  html_url: string
}

export interface PatternMatch {
  patternId: string
  patternName: string
  match: string
  index: number
}

export interface ScanResult {
  path: string
  matches: PatternMatch[]
}
