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
   yarn install
   ```
2. Start dev server:
   ```
   yarn start
   ```
3. Open http://localhost:5173

## 🧹 Code Formatting with Prettier

This project uses [Prettier](https://prettier.io/) to maintain consistent code style.

### 📦 Install Prettier

If not already installed, run:

```
yarn add --dev --exact prettier
```

### Format all files

```
yarn format
```

### Check for formatting issues without changing files

```
yarn format:check
```
