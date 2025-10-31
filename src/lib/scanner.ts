export const PATTERNS = [
  {
    id: 'aws_key',
    name: 'AWS Access Key ID',
    regex: /AKIA[0-9A-Z]{16}/g,
  },
  {
    id: 'aws_secret',
    name: 'AWS Secret',
    regex: /(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])/g,
  },
  {
    id: 'google_api',
    name: 'Google API Key',
    regex: /AIza[0-9A-Za-z\-_]{35}/g,
  },
  {
    id: 'stripe_key',
    name: 'Stripe Key',
    regex: /sk_(test|live)(_[0-9a-zA-Z]+)?/g,
  },
  {
    id: 'private_key',
    name: 'Private RSA Key',
    regex: /-----BEGIN( RSA)? PRIVATE KEY-----/g,
  },
  {
    id: 'github_pat',
    name: 'GitHub Personal Access Token',
    regex: /gh[pousr]_[A-Za-z0-9]{4,}/g,
  },
  {
    id: 'generic_base64',
    name: 'Long base64-ish string',
    regex: /([A-Za-z0-9+/]{40,}={0,2})/g,
  },
  {
    id: 'keyword_key_like',
    name: 'Keyword indicating possible secret',
    regex:
      /\b(?:api[-_]?key|access[-_]?token|private[-_]?key|client[-_]?secret|auth[-_]?token)\b/gi,
  },
]

export interface PatternMatch {
  patternId: string
  patternName: string
  match: string
  index: number
}

export function scanContent(content: string): PatternMatch[] {
  const matches: PatternMatch[] = []
  for (const p of PATTERNS) {
    let m: RegExpExecArray | null
    while ((m = p.regex.exec(content)) !== null) {
      const original = m[0]

      const masked =
        original.length > 4
          ? original.slice(0, 4) + '*'.repeat(original.length - 4)
          : original.slice(0, 2) + '*'.repeat(original.length - 2)

      matches.push({
        patternId: p.id,
        patternName: p.name,
        match: masked,
        index: m.index,
      })
    }
  }

  return matches
}
