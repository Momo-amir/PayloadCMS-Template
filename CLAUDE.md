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
| **Styling** | Tailwind v4. Frontend = theme tokens + `container`; shadcn/ui is mostly admin-panel UI. |
| **Icons** | **Tabler** (`@tabler/icons-react`) on the frontend. (`lucide-react` is admin/shadcn only.) |
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
yarn cli create:block <BlockName>   # scaffold a new block (note the COLON in create:block)
yarn cli list                       # list discoverable features (blocks + collections)
yarn cli manifest validate          # validate feature discovery + features/overrides.json
yarn cli generate --out=<dir> [--blocks=..] [--collections=..] [--heros=..] [--plugins=..] [--dry-run]
yarn cli add --target=<dir>                    # interactively pull blocks into an existing generated project
yarn cli add:block <slug> --target=<dir>       # pull one block + its file closure non-interactively
```

> **Linting is currently broken.** `yarn lint` / `next lint` fails in Next 16 (arg misrouting) and
> ESLint 10 throws a circular-structure error with the `eslint-config-next` flat-config compat. This
> is pre-existing, not from recent changes. Use `npx tsc --noEmit` for typechecking until the lint
> setup is migrated to `eslint .` directly. Don't treat lint failures as your regression without checking.

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
deploy-only). Local verification is the only safety net — run `generate:types` + `tsc` + tests, and
**drive the running app** (`tsc`/`generate:types` do NOT catch runtime module-init cycles — see Conventions).

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
  - **Readable names, always.** Variables, params, and callbacks get descriptive names — `event`
    not `e`, `variant` not `v`, `item`/`index` not `t`/`i`. Single-letter names read as messy and
    are not allowed in component code. Match the surrounding file's existing names and conventions.
- **Path aliases** (prefer over relative imports): `@/*`→`src/*`, `@/cms/*`, `@site/*`→`src/website/*`, `@public/*`, `@payload-config`.
- **Type-only imports** use `import type { … }`.
- **Reusable fields are factories** with a default options object, applying caller overrides via
  `deepMerge(result, overrides)` (`src/cms/utilities/deepMerge.ts`). See `src/cms/fields/link.ts`.
- **Class names** via `cn()` from `@/cms/utilities/ui` (clsx + tailwind-merge).
- **Styling is theme-driven and responsive.** Colors come **only** from the theme tokens
  (`--color-*` in `src/app/(frontend)/[locale]/globals.css`) and typography from the same theme
  section — never hardcode hex/px or off-theme values. Everything is responsive by default: use the
  `container` class for page-width layout and Tailwind's responsive utilities. Both light and dark
  themes are defined in that file — style for both.
- **Collections are typed** `CollectionConfig<'slug'>`; labels are inline localized objects `{ en, da }`.
- **Validation is hand-written type guards, NOT zod** (there is no zod in the repo). See
  `normalizeConsentState` / `sanitizePreferences` in `src/core/privacy/models/consent-model.ts`.
- **Blocks** carry their own React component via the `ComponentBlock` type
  (`src/website/types/ComponentBlock.ts`); page-builder blocks are registered in
  `src/website/blocks/exports.ts` and rendered by `RenderBlocks.tsx`. Inline-only (rich-text) blocks
  are registered in a collection's `BlocksFeature` instead (e.g. `bannerBlock`/`codeBlock` in Posts).
- **Blocks are composed from components + elements**, not built inline. Reuse primitives in
  `src/website/components/elements/` (buttons, etc.) and shared `src/website/components/*`; a block's
  `Component.tsx` assembles these, it does not reinvent them. New shared UI → a component/element,
  then use it from the block.
- **New blocks must emit analytics.** Wrap block content in `TrackImpression`
  (`@/cms/components/Analytics/TrackImpression`) like every existing block does (see
  `src/website/blocks/Card/Component.tsx`), and track the obvious interactions (CTA clicks, etc.).
  All tracking is consent-gated and GDPR-compliant by construction — go through the existing
  analytics client / hooks (`src/cms/hooks/useAnalytics.ts`), never add ad-hoc/third-party tracking.
  See `docs/ANALYTICS_OVERVIEW.md`.
- **Variations over customization.** Empower editors with a clean, safe editing experience — do NOT
  expose free-form styling knobs that let them break the design (this is not WordPress). Offer a
  curated `variant`/scenario select and reuse shared field factories; every option must map to a
  design we've planned and built for. When a block needs to serve multiple scenarios, model them as
  named variations, not as loose per-instance overrides.
- **Block naming is normalized** (do not deviate): folder = PascalCase noun with no redundant `Block`
  (`Media`, `Card`, `TwoColumn`); export const = interfaceName = `<Folder>Block`; the component import
  is aliased `<Name>BlockComponent` to avoid colliding with the export const; slug = camelCase with a
  `*Block` suffix (`mediaBlock`, `twoColumnBlock`). Long slugs use a short `dbName` so generated
  Postgres identifiers stay under 63 chars (e.g. `callToActionBlock` → `dbName: 'cta'`).
- **Container blocks** (nest other blocks via a `type: 'blocks'` field, e.g. `twoColumnBlock`) must
  build their child slug→component map **from the config's `blocks` arrays**, lazily, not from a
  hardcoded map/switch — see `src/website/blocks/TwoColumn/fields.tsx`. This keeps rendering data-driven
  (so the scaffolder can prune children) AND avoids a runtime import cycle.
- **Runtime import cycles:** a block's `config.ts` → `Component.tsx` → `fields.tsx` → back to `config.ts`
  forms a cycle. Anything reading the config at **module top-level** throws
  `ReferenceError: Cannot access 'XBlock' before initialization`. `tsc`/`generate:types` do NOT catch
  it — only the running admin does. Compute config-derived data lazily (memoized inside a function).
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

## Feature distribution / scaffolder (`create-kollab-payload`)

This template is a maximal superset; a `.cli` generator produces client sites by **copy-then-prune** —
keep selected blocks/collections/heros/plugins, remove the rest. Full design: `docs/DISTRIBUTION.md`.
Engine lives in `.cli/lib/` (`discovery.ts`, `closure.ts`, `codemod.ts` (ts-morph), `generate.ts`,
`select.ts`, `add.ts`), driven via `yarn cli <command>` (see Commands above).

**`create-kollab-payload` is a published, shipped npm package** (`.create-kollab-payload/`, currently
`1.0.6`) — not a work-in-progress. It bundles the `.cli` engine at build time
(`scripts/bundle-engine.ts`) and is what `npx create-kollab-payload my-site` actually runs. Releases are
automated: bump `.create-kollab-payload/package.json`'s version and push to `main`; Bitbucket Pipelines
mirrors to GitHub, then `.github/workflows/release.yml` builds, publishes to npm (trusted
publishing/OIDC, no stored token), and tags `vX.Y.Z` — keeping npm version, git tag, and template ref in
lockstep. Full runbook: `.create-kollab-payload/README.md` "Releasing". Status/next-up:
`.create-kollab-payload/ROADMAP.md`.

- **Discovery is convention + one sidecar.** Blocks come from `exports.ts` + collection `BlocksFeature`
  lists; collections from `payload.config.ts`. `features/overrides.json` (schema:
  `features/overrides.schema.json`) holds only what code can't express: `group`, `requiresCollections`,
  `requiresPlugins`, `onlyInside`, and per-collection `ownedFiles` + `patches`.
- **When authoring a new block/collection**, keep discovery working: register it correctly, and if it
  has non-derivable prerequisites, add an `overrides.json` entry. Blocks that read an optional
  collection must be **collection-agnostic** — drive `relationTo` from an editable const (see
  `ARCHIVE_COLLECTIONS` in `Archive/config.ts`) and compile with an empty list; guard optional module
  imports dynamically (see the posts branch in `src/app/(frontend)/[locale]/[...slug]/page.tsx`).
- **Adding a block/collection to the template automatically grows the scaffolder's menu** — no
  scaffolder code changes needed for a plain feature with no external prerequisites.
- **Adding a block into an already-generated project** (not the template) uses
  `yarn cli add`/`add:block` or `npx create-kollab-payload add <blockSlug>` — collections and plugins
  aren't addable this way yet, blocks only.
- Skills: `/generate-site`, `/author-feature`. Agent: `feature-manifest-author`.
- Status: block, container-child, hero, and plugin pruning, plus deep collection pruning, all work and
  are tested (`tests/cli/generate.test.ts`). Only `posts`/`categories`/`people` have full
  `ownedFiles`/`patches` filled in; other optional collections need theirs filled in when pruned. Locale
  selection is not yet wired (da+en fixed).

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
- `docs/DISTRIBUTION.md` — feature-selectable scaffolder (copy-then-prune) design + conventions.
