# Public Repo Secret Hunter (React + TypeScript, Vite)

## Overview

Searcher

## Features

- Search public GitHub repositories by keyword
- Scan repository files (via git tree + raw file fetch) for potential secrets using regex heuristics
- Optionally create a GitHub issue summarizing findings (requires Personal Access Token)
- PAT is stored only in sessionStorage

## Run

1. Install dependencies:
   ```
   npm install
   ```
2. Start dev server:
   ```
   npm run dev
   ```
3. Open http://localhost:5173
