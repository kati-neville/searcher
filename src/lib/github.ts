// lib/githubHelpers.ts
import { RepoResult } from '../types'

async function query(url: string, token?: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        }
      : {}),
    ...options.headers,
  }

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const data = await res.json()

    throw new Error(data?.message ? data.message : `GitHub request failed: ${res.status}`)
  }

  return res
}

export async function searchRepos(q: string, token?: string): Promise<RepoResult[]> {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&per_page=20`

  const res = await query(url, token)
  const json = await res.json()
  return json.items || []
}

export async function getRepoTree(owner: string, repo: string, branch = 'main', token?: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`

  const res = await query(url, token)
  if (res.status === 404) throw new Error('Tree not found (branch wrong?)')
  return await res.json()
}

type FileParams = {
  owner: string
  repo: string
  branch: string
  path: string
  token?: string
}
export async function getRawFile(data: FileParams) {
  const { owner, repo, branch, path, token } = data

  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
  const res = await query(url, token)
  return await res.text()
}

export async function createIssue(data: {
  owner: string
  repo: string
  title: string
  body: string
  token: string
}) {
  const { owner, repo, title, body, token } = data

  const url = `https://api.github.com/repos/${owner}/${repo}/issues`

  const res = await query(url, token, {
    method: 'POST',
    body: JSON.stringify({
      title,
      body,
    }),
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok) throw new Error(json.message || `Failed to create issue`)
  return json
}
