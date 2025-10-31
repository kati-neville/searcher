import React, { useEffect, useState } from 'react'
import { getRepoTree, getRawFile } from '../lib/github'
import { scanContent } from '../lib/scanner'
import { RepoResult, ScanResult } from '../types'

type Status = 'idle' | 'list-files' | 'scanning' | 'done' | 'error'
export default function ScannerPanel({
  repo,
  onResults,
}: {
  repo: RepoResult
  onResults: (res: ScanResult[], err?: Error) => void
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [progress, setProgress] = useState({ total: 0, done: 0 })

  async function runScan() {
    setStatus('list-files')
    try {
      const owner = repo.owner.login
      const name = repo.name
      const branch = repo.default_branch || 'main'
      const tree = await getRepoTree(owner, name, branch)
      const files = (tree.tree || []).filter((f: any) => f.type === 'blob')
      setProgress({ total: files.length, done: 0 })

      const results: ScanResult[] = []
      const MAX = 200
      let scanned = 0
      for (const f of files) {
        if (scanned >= MAX) break
        if (/(?:\.png|\.jpg|\.jpeg|\.gif|\.zip|\.tar|\.gz|\.exe|\.dll)$/i.test(f.path)) continue
        try {
          const content = await getRawFile({
            owner,
            repo: name,
            branch,
            path: f.path,
          })

          const matches = scanContent(content)
          if (matches.length) {
            results.push({ path: f.path, matches })
          }
        } catch (err) {
          // ignore file fetch errors
        }
        scanned++
        setProgress((p) => ({ ...p, done: p.done + 1 }))
      }
      setStatus('done')
      onResults(results)
    } catch (err: any) {
      setStatus('error')
      onResults([], err)
    }
  }

  useEffect(() => {
    setProgress({ total: 0, done: 0 })
  }, [repo])

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Scanner — {repo.full_name}</h3>
      <div className="mt-3">
        <p className="capitalize">Status: {status}</p>
        <p>
          Progress: {progress.done}/{progress.total}
        </p>
        <div className="mt-3">
          <button onClick={runScan} className="px-3 py-1 bg-green-600 text-white rounded">
            Run Scan
          </button>
        </div>
      </div>
    </div>
  )
}
