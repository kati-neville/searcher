import { ScanResult } from '../types'
import { PAT_TOKEN } from './constants'

export function buildIssueBody(results: ScanResult[]) {
  const lines: string[] = ['Potential secrets detected by *Searcher*', '\n']
  for (const r of results) {
    lines.push(`- **${r.path}**`)
    for (const m of r.matches) {
      lines.push(`  - ${m.patternName}: \`${truncate(m.match, 200)}\``)
    }
  }
  lines.push(
    '\n**Advice:** Rotate any keys found, remove from git history, add to a secret manager, and consider updating `.gitignore`.'
  )
  return lines.join('\n')
}

export function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + '...' : s
}

export function getToken() {
  const stored = sessionStorage.getItem(PAT_TOKEN)
  if (stored) return stored
}

export function saveToken(token: string) {
  sessionStorage.setItem(PAT_TOKEN, token.trim())
}
