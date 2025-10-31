import React, { useState } from 'react'
import { searchRepos } from '../lib/github'
import { RepoResult } from '../types'

export default function SearchBar({
  onSearch,
  defaultQuery,
}: {
  onSearch: (r: RepoResult[]) => void
  defaultQuery?: string
}) {
  const [q, setQ] = useState(defaultQuery || '')
  const [loading, setLoading] = useState(false)

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!q) return
    try {
      setLoading(true)
      const items = await searchRepos(q)
      onSearch(items)
    } catch (err: any) {
      alert('Search error: ' + (err.message || String(err)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="border rounded p-2 flex-1"
        placeholder="search repos, e.g. stripe examples"
      />
      <button className="px-3 py-1 bg-blue-600 text-white rounded" type="submit" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
