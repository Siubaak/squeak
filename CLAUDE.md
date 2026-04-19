# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Squeak is a pnpm monorepo with two apps:

- **`apps/native`** — React Native mobile app built with Expo (SDK 54, React 19, New Architecture enabled)
- **`apps/server`** — NestJS backend API (NestJS 11, TypeScript, Jest for testing)

## Commands

All commands are run from the repo root using pnpm workspace filters.

### Install dependencies
```bash
pnpm install
```

### Server (NestJS)
```bash
pnpm server start:dev        # dev with watch mode
pnpm server build             # compile
pnpm server start:prod        # run production build
pnpm server lint              # ESLint with auto-fix
pnpm server format            # Prettier
pnpm server test              # unit tests (Jest)
pnpm server test -- --testPathPattern=<pattern>  # run a single test file
pnpm server test:e2e          # e2e tests
pnpm server test:cov          # coverage
```

### Native (Expo)
```bash
pnpm native start             # start Expo dev server
pnpm native ios               # run on iOS
pnpm native android           # run on Android
pnpm native web               # run on web
```

## Architecture

- **Monorepo**: pnpm workspaces defined in `pnpm-workspace.yaml`, packages live under `apps/`
- **Server entry**: `apps/server/src/main.ts` — bootstraps NestJS on `process.env.PORT` (default 3000)
- **Server structure**: standard NestJS module pattern — modules, controllers, services in `apps/server/src/`
- **Native entry**: `apps/native/index.ts` → `apps/native/App.tsx`

## Code Style (Server)

- Prettier: single quotes, trailing commas (`all`)
- ESLint: typescript-eslint with type-checked rules, `no-explicit-any` is off, `no-floating-promises` and `no-unsafe-argument` are warnings
- Server tests use `.spec.ts` suffix (unit) and live alongside source; e2e tests are in `apps/server/test/`
