# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### SplitKaro – Hisab App (`artifacts/splitkaro`)
- **Type**: React + Vite web app (frontend only)
- **Preview path**: `/`
- **Description**: Mobile-friendly expense splitting app. No backend — data persists in localStorage.
- **Features**: Create groups with members, add expenses with payer tracking, view expense list, calculate equal splits, show who owes whom.
- **Structure**:
  - `src/store.ts` — useStore hook with all state + business logic (localStorage persistence)
  - `src/pages/GroupsPage.tsx` — group list, create/delete groups
  - `src/pages/AddExpensePage.tsx` — add/remove expenses, expense list
  - `src/pages/ResultPage.tsx` — settlement calculator showing who pays whom
  - `src/App.tsx` — header, bottom navigation, tab routing
