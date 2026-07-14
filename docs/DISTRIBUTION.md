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
