# Feature Distribution — `create-kollab-app`

How client sites are generated from this template, and how the template's block/collection menu grows.
This is the architecture; the generator engine and the `create-kollab-app` initializer are built against it.

## Model

The template is a **maximal, ever-growing superset** of blocks, collections, and features. New client
sites are generated `create-next-app`-style: pick the blocks/collections/features you want, get a fresh
project containing only those. No packages — everything is copied source (fork-and-own).

- **Generate a NEW project**, not "add features into an existing repo."
- **Template stays maximal** — adding blocks grows the menu; nothing is deleted from the template.
- **Target DX:** `npx create-kollab-app my-site`. First working version runs in-repo via the `.cli` tool.

## Output model: copy-then-prune

Clone the full (already-compiling) template into the target, then **remove unselected features** and
clean their registrations. Output = template minus deselections.

Chosen over "empty base + add" because the shared foundation is heavy (`@/payload-types` alone has ~58
importers) — reconstructing it per selection is fragile, whereas removing from a compiling template is
verifiable.

## Discovery (near-zero manifest)

~80% of feature metadata is auto-derived; the rest lives in one maintainer-owned
[`features/overrides.json`](../features/overrides.json). Most blocks need no entry there.

Auto-derived:
- **Block menu** — parse `src/website/blocks/exports.ts` plus the `BlocksFeature({ blocks: [...] })`
  lists in collection configs (inline-only blocks like `bannerBlock`/`codeBlock` live there, not in
  `exports.ts`). Do not folder-scan.
- **Collection menu** — parse the `collections: [...]` array in `src/payload.config.ts`; note
  plugin-injected collections (`forms`, `redirects`, `search`) from `src/cms/plugins/index.ts`.
- **Per-block fields** — `slug`, `interfaceName`, `labels`, `imageURL`, `showOnPage`, `dbName`.
- **Dependency closure** — a static import walker (reliable: no runtime dynamic imports; simple tsconfig
  aliases; single-target `@/core` barrels). Treat `@/payload-types` and `node_modules` as leaves. This
  catches the `RichText` hub (a rich-text block transitively pulls Media/Code/Columns/Banner/CTA).

Overrides supply only what code cannot express: plugin/collection prerequisites (bare `relationTo`
strings), grouping, sub-block markers. Schema: [`features/overrides.schema.json`](../features/overrides.schema.json).

## Pruning rules

- **always-keep foundation** (never pruned): `cn`, `deepMerge`, `getURL`, `defaultLexical`, `RichText`,
  `Media`, `Link`, `elements/*`, providers, `globals.css`, i18n plumbing.
- **keep-closure** — a feature survives if selected OR required (import edge, `requiresCollections`,
  `requiresPlugins`, `onlyInside`) by a survivor.
- **de-registration targets** — `payload.config.ts`, `website/blocks/exports.ts`, `BlocksFeature` lists,
  `providers/index.tsx`, `i18n/messages/*.json` + `localization.ts`, `app/api/*`, `next.config.js`,
  `.env.example`, `package.json`. `@/payload-types` is regenerated (`yarn generate:types`), never edited.
- **prerequisites gate** — deselecting `posts` while `archiveBlock` is kept warns/auto-keeps.
- **modes** (design-toward, not built) — localization `none` / `opt-in` / `full` (per-language slugs).

## Container blocks (nested blocks)

A **container block** nests other blocks via a `type: 'blocks'` field (e.g. `twoColumnBlock`). Its
children are auto-detected from the config — no manifest entry needed.

Rules:
- Children are **prunable**: deselecting a child removes it from the container's `blocks: [...]`
  arrays and its import. The container itself is kept.
- Keeping a container does **not** force its children to survive — a child survives only if selected
  or reachable through a non-container import edge.
- A container is kept even if **all** children are pruned (empty `blocks` arrays) — useful for building
  project-specific children from scratch. The generator warns when this happens.
- **Renderer must be data-driven.** A container's renderer builds its slug→component map from the
  config's `blocks` arrays (see `TwoColumn/fields.tsx`), not a hardcoded map/switch — so pruning the
  config automatically prunes rendering with no renderer codemod. New container blocks must follow this.

## Collection pruning

Optional collections (non-core) can be pruned. Core collections (Pages, Media, Users, ConsentTokens,
AnalyticsAggregates) are locked. Pruning a collection performs, in order:

1. **Delete owned files/routes** — declared per-collection as `ownedFiles` in `features/overrides.json`
   (e.g. posts owns `[postsSlug]/`, `post-renderer.tsx`, `PostHero`, the posts sitemap). Only list files
   that exist *solely* for that collection — never shared files.
2. **Remove from `payload.config.ts`** — the collection symbol + import (ts-morph).
3. **Remove from plugin/search string lists** — `collections: ['posts', ...]` entries + now-unused imports.
4. **Trim from kept blocks' relationTo** — a kept block that lists the collection in a config-driven
   array (e.g. `ARCHIVE_COLLECTIONS`) has that entry removed. Blocks must keep such lists in a single
   editable const so this works, and must compile with an **empty** list (kept as a shell to rewire).
5. **Apply shared-file patches** — declared per-collection as `patches` (find/replace) for the few shared
   files that reference the collection and can't be auto-edited (e.g. neutralizing a dynamic import of a
   deleted module in `[...slug]/page.tsx`).

Conflicts (a kept block requires a pruned collection) are allowed with a warning + confirm — you keep the
block as a shell and rewire it. Blocks that read an optional collection must be **collection-agnostic**:
guard optional imports (dynamic + try/catch, like the posts branch in `[...slug]/page.tsx`) and drive
`relationTo` from an editable const.

## Naming conventions (normalized)

- Folder = PascalCase noun (no redundant `Block`): `Media`, `Card`, `TwoColumn`.
- Export const = interfaceName = `<Folder>Block`. Component import aliased `<Name>BlockComponent`.
- Slug = camelCase, always `*Block` suffixed: `mediaBlock`, `twoColumnBlock`.
- `dbName` (short) on long-slug blocks to keep generated Postgres identifiers under 63 chars.
- Sub-blocks use `showOnPage: false`; inline-only blocks register via a collection's `BlocksFeature`.

## AI tooling

- `/generate-site` skill — agent runs the scaffolder from a feature selection (parity with the CLI).
- `/author-feature` skill — adds a NEW selectable feature and keeps `overrides.json` + the template compiling.
- `feature-manifest-author` agent — computes/validates a feature's file + dependency closure.

## Build order (future)

1. `.cli/lib/manifest.ts` — discovery + import walker + keep-closure resolver + registration-op appliers.
2. `.cli/lib/commands/{generate,list,manifest}.ts`.
3. `create-kollab-app` — thin `npx` wrapper at a pinned template version.

Hardest part to prototype first: de-registering from a hand-formatted `payload.config.ts` — likely a
ts-morph codemod, not regex.
