import { useState } from 'react'
import SearchBar from './components/SearchBar'
import RepoList from './components/RepoList'
import ScannerPanel from './components/ScannerPanel'
import ResultsList from './components/ResultsList'
import { RepoResult, ScanResult } from './types'

export default function App() {
  const [repos, setRepos] = useState<RepoResult[]>([])
  const [selectedRepo, setSelectedRepo] = useState<RepoResult | null>(null)
  const [results, setResults] = useState<ScanResult[]>([])

  function handleReselt() {
    setResults([])
    setSelectedRepo(null)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Public Repo Secret Hunter</h1>
      </div>

      <SearchBar onSearch={setRepos} defaultQuery={'rainforest-builder/tech-test-scannable-repo'} />

      <div className="flex gap-6 mt-6 flex-1 overflow-hidden">
        <div className="col-span-2 flex-1 overflow-auto">
          <RepoList repos={repos} onScan={(r) => setSelectedRepo(r)} />
        </div>
        <div className="max-w-72 overflow-auto pb-5">
          {selectedRepo ? (
            <ScannerPanel
              repo={selectedRepo}
              onResults={(res, err) => {
                if (err) alert(err.message || String(err))
                else setResults(res)
              }}
            />
          ) : (
            <div className="p-4 border rounded text-gray-500">Select a repo to begin scanning</div>
          )}

          {results?.length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold">Results</h2>
              <ResultsList selectedRepo={selectedRepo} results={results} reset={handleReselt} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
