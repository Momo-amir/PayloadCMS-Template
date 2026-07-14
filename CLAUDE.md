# CLAUDE.md

Guidance for Claude / AI agents working in **kollab-payload-template** — a Payload CMS + Next.js
website template by Kollab Solutions. This file is the canonical agent reference; keep it in sync
with `package.json`. Human docs in `docs/` and `README.md` go deeper — link to them, don't duplicate.

## Stack

| | |
|---|---|
| **Package manager** | **yarn** (Berry, `nodeLinker: node-modules`). Not npm, not pnpm. |
| **Payload CMS** | `3.86.0` — all `@payloadcms/*` packages pinned to this exact version, they move together. |
| **Next.js** | `16.2.6` (App Router, `output: 'standalone'`). |
| **React** | `19.2.6`. |
| **DB** | Postgres via `@payloadcms/db-postgres` (Drizzle). |
| **Node** | `>=20.9.0`; `.nvmrc` pins `24.5.0`. |
| **Styling** | Tailwind v4 + shadcn/ui conventions. |
| **i18n** | Payload localization (content) + next-intl (UI). Default locale **Danish (`da`)**, English fallback. |
| **Tests** | Vitest (`tests/**`, node env). |

## Commands

Dev is **Docker-first**. `yarn docker-dev` boots the `payload` service + Postgres on port **8890**
(admin at `/admin`) and auto-runs `yarn install && yarn dev` inside the container.

```bash
yarn docker-dev          # start payload + postgres (port 8890)
yarn dev                 # Next dev server directly on host (port 8890)
yarn build               # production Next build (+ postbuild sitemap)
yarn test                # vitest run
yarn test:watch          # vitest watch
yarn lint                # next lint (ESLint 10, flat config)
yarn lint:fix            # next lint --fix
yarn cli create:block <BlockName>   # scaffold a new block (note the COLON in create:block)
```

**Payload tooling runs through the container** (assume Docker is running; verify with
`docker compose ps` first). These wrappers `docker compose exec payload yarn _...`:

```bash
yarn generate:types      # regenerate src/payload-types.ts  — run after ANY schema change
yarn generate:importmap  # regenerate the admin import map
yarn migrate:create      # create a DB migration (PRODUCTION only, see below)
```

The `_`-prefixed twins (`_generate:types`, etc.) run bare-metal with
`NODE_OPTIONS='--import ./scss-loader.mjs'` — only for when you are not in Docker. Don't remove that
`NODE_OPTIONS` flag; the Payload CLI needs the scss-loader shim.

There are **no git hooks, no lint-staged, and no CI lint/test gate** (CI is Bitbucket Pipelines,
deploy-only). Local verification is the only safety net — run lint + `generate:types` + tests yourself.

## Architecture

```
src/
  core/       Portable, framework-agnostic domain logic. Organized by RUNTIME TARGET
              (client/ · server/ · models/ · payload/). Currently analytics/ and privacy/.
  cms/        Payload wiring: collections/ globals/ fields/ access/ hooks/ jobs/ plugins/
              utilities/ components/ (admin UI) endpoints/ forms/ search/.
  website/    Public frontend: blocks/ components/ (elements/ = primitives) layout/ types/.
  app/        Next App Router — (frontend)/[locale]/ · (payload)/ (admin+API) · api/.
  providers/  React context providers (Theme, Privacy, CollectionPaths…) + index.tsx barrel.
  i18n/       next-intl config + messages/{da,en}.json.
  migrations/ Postgres migrations (.ts + .json, committed).
```

### ⚠️ The `core/` ↔ `cms/` boundary — read this before touching analytics/privacy

`src/core/` is intended to become a **centrally-maintained package shared across ALL Kollab
templates**. It holds concerns that don't vary per project — analytics and GDPR/consent/privacy —
so they can be upgraded from one central place and every template stays current.

To make that possible, `src/cms/*` files that touch these concerns are **thin one-line shims**:

```ts
// src/cms/collections/ConsentTokens.ts
export * from '@/core/analytics/payload/collections/ConsentTokens'
```

**Rules:**
- Portable / compliance logic → implement in `core/`, under the correct `client`/`server`/`models`/`payload` subdir.
- `cms/` gets (or keeps) a thin `export * from '@/core/...'` shim — **never** put real logic in the shim.
- Project-specific logic that will never be shared → normal `cms/` file, no shim.
- The consent/privacy/analytics code is the only tested part of the repo (`tests/`). Change it carefully and keep tests green.

For work inside `core/`, prefer the **`core-maintainer`** subagent.

## Conventions (from real code)

- **Naming:**
  - Payload collections/globals/blocks/components → **PascalCase dir** + `index.ts` or `config.ts` inside.
  - `core/` & `utilities/` files → **kebab-case** (`cleanup-consent-tokens-task.ts`).
  - `access/` & server `hooks/` files → **camelCase** matching the export (`authenticatedOrPublished.ts`).
  - Client components → **`.client.tsx` suffix** + `'use client'`. Server components are the default (plain `Component.tsx`).
  - Constants `SCREAMING_SNAKE_CASE`. Job/task slugs `camelCase`. Collection slugs `kebab`/lowercase. Analytics data keys `snake_case`.
- **Path aliases** (prefer over relative imports): `@/*`→`src/*`, `@/cms/*`, `@site/*`→`src/website/*`, `@public/*`, `@payload-config`.
- **Type-only imports** use `import type { … }`.
- **Reusable fields are factories** with a default options object, applying caller overrides via
  `deepMerge(result, overrides)` (`src/cms/utilities/deepMerge.ts`). See `src/cms/fields/link.ts`.
- **Class names** via `cn()` from `@/cms/utilities/ui` (clsx + tailwind-merge).
- **Collections are typed** `CollectionConfig<'slug'>`; labels are inline localized objects `{ en, da }`.
- **Validation is hand-written type guards, NOT zod** (there is no zod in the repo). See
  `normalizeConsentState` / `sanitizePreferences` in `src/core/privacy/models/consent-model.ts`.
- **Blocks** carry their own React component via the `ComponentBlock` type
  (`src/website/types/ComponentBlock.ts`); every block is registered in
  `src/website/blocks/exports.ts` and rendered by `RenderBlocks.tsx`.
- **Hooks** are typed with Payload's specific hook types; revalidation hooks are **locale-aware**
  (revalidate both `/path` and `/en/path`, tag `x:slug:da` / `x:slug:en`) and guard on
  `context.disableRevalidate`.
- **Comments: prefer none; no multi-line blocks.** Default to no comment when the code is
  self-explanatory. A single descriptive one-liner is fine for a non-obvious *why*; avoid multi-line
  `//` / `/* */` blocks and never narrate *what* the code does.

**Reference files:** collection `src/cms/collections/Posts/index.ts` · access
`src/cms/access/authenticatedOrPublished.ts` · field factory `src/cms/fields/link.ts` · block
`src/website/blocks/Accordion/{config.ts,Component.tsx}` · block contract
`src/website/types/ComponentBlock.ts` · job
`src/core/analytics/payload/jobs/cleanup-consent-tokens-task.ts` · validation
`src/core/privacy/models/consent-model.ts` · core→cms shim `src/cms/collections/ConsentTokens.ts`.

## Workflows

**Change a collection or field:**
1. Edit under `src/cms/collections/**` (or `src/cms/fields/**`).
2. `yarn generate:types` (container) to refresh `src/payload-types.ts`.
3. **Prod only:** `yarn migrate:create` and commit both `.ts` + `.json` artifacts. **Dev needs no
   migration** — Drizzle auto-pushes the schema. Do NOT run migrations in dev.
4. Restart payload if needed (`docker compose restart payload`).

**Add a block:** `yarn cli create:block <Name>` (creates `src/website/blocks/<Name>/` and updates
`exports.ts`), then fill in `config.ts` fields + `Component.tsx`. Or use `/scaffold-block`.

**Add a collection:** follow the `Posts` pattern (there is no CLI for this yet) — see
`payload-collection-builder` subagent or `/scaffold-collection`.

**Add a locale / translations:** update Payload localization (`src/i18n/localization.ts`), next-intl
routing, and add keys to **all** `src/i18n/messages/*.json`. See `docs/LOCALIZATION.md` or `/add-locale`.

## Guardrails — don't change lightly

- Don't bump `payload` / `@payloadcms/*` versions individually — they're interdependent, move all
  together and test. Use the `dependency-upgrader` subagent.
- Don't remove `NODE_OPTIONS='--import ./scss-loader.mjs'` from the payload scripts.
- Don't remove the localization config or middleware in `src/proxy.ts` — it breaks the site.
- `src/app/**` (outside `globals.css` / `custom.scss`) and `src/cms/components/**` are sensitive —
  only modify when you understand the impact.
- Don't run migrations in dev. Don't run `yarn reinstall` unless the user asks.

## Verify before you're done

1. `yarn lint` clean (or only pre-existing warnings).
2. `yarn generate:types` succeeds (this is the effective typecheck for schema changes).
3. `yarn test` green — especially if you touched anything under `core/` analytics/privacy.
4. Drive the actual flow (admin at `:8890/admin`, or the affected page) — don't rely on tests alone.

## More docs

- `README.md` — setup, Docker/local, personalization.
- `docs/OVERVIEW.md` — full architecture + request lifecycle + dev workflow.
- `docs/DEV_HANDBOOK_QUICK.md` — where-to-change-things map + recipes.
- `docs/LOCALIZATION.md` — i18n deep dive.
- `docs/ANALYTICS_OVERVIEW.md` — GDPR/consent/analytics model.
