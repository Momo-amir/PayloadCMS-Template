# Copilot instructions for kollab-payload-template

**The canonical agent guide for this repo is [`CLAUDE.md`](../CLAUDE.md) at the repo root.** Read it
first — it has the full architecture, conventions, workflows, and guardrails. This file is a short
mirror so Copilot and Claude stay in sync; when in doubt, `CLAUDE.md` wins.

## Essentials

- **Stack:** Payload CMS `3.86.0` (all `@payloadcms/*` pinned to this exact version, move together) +
  Next.js `16.2.6` + React `19.2.6`, Postgres (Drizzle). Node `>=20.9.0`.
- **Package manager: yarn** (not npm, not pnpm). Dev is **Docker-first** (`yarn docker-dev`, port 8890,
  admin at `/admin`).
- **Payload tooling runs in the container:** `yarn generate:types`, `yarn generate:importmap`,
  `yarn migrate:create` (all `docker compose exec payload yarn _...`). Run `yarn generate:types` after
  any schema change. Don't remove `NODE_OPTIONS='--import ./scss-loader.mjs'` from payload scripts.
- **Schema:** dev = Drizzle auto-push (no migrations in dev); production = `yarn migrate:create`, commit
  both `.ts` + `.json` under `src/migrations`.
- **Scaffold a block:** `yarn cli create:block <BlockName>` (note the colon).
- **Verify locally** — there is no CI lint/test gate: `yarn lint`, `yarn generate:types`, `yarn test`.

## Architecture (see CLAUDE.md for detail)

- `src/core/` — **portable, centrally-upgradeable package** (analytics, privacy, GDPR). `src/cms/*`
  files for these concerns are **thin `export * from '@/core/...'` shims** — never put logic in a shim.
- `src/cms/` — Payload wiring (collections, fields, access, hooks, jobs). `src/website/` — frontend
  (blocks, components). `src/app/` — Next App Router. `src/i18n/` — dual localization (Payload + next-intl).

## Don't change lightly
Pinned `@payloadcms/*` versions (bump together), the scss-loader `NODE_OPTIONS`, and the localization
middleware in `src/proxy.ts`. See `CLAUDE.md` → **Guardrails**.
