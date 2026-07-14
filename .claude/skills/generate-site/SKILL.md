---
name: generate-site
description: Generate a new client site from this template by selecting which blocks/collections/features to keep (create-kollab-app, agent-driven). Uses copy-then-prune — copies the template, removes unselected features, cleans registrations. Use when the user wants to scaffold a new project from the template with a chosen subset of features.
---

# Generate a site (create-kollab-app, agent path)

Produces a fresh project from this template containing only the selected features, by copy-then-prune.
Architecture: `docs/DISTRIBUTION.md`.

## Inputs
- Target directory (new project).
- Selected blocks / collections / features (ask if not given; list options from discovery below).

## Steps
1. **Discover** the menu:
   - Blocks: parse `src/website/blocks/exports.ts` + `BlocksFeature` lists in collection configs.
   - Collections: the `collections: [...]` array in `src/payload.config.ts`; plugin-injected ones from
     `src/cms/plugins/index.ts`.
   - Metadata/prereqs: `features/overrides.json` (groups, `requiresCollections`, `requiresPlugins`,
     `onlyInside`).
2. **Resolve keep-closure** — selected features + their static-import dependency closure + overrides
   prerequisites + the always-keep foundation (see DISTRIBUTION.md). Warn if a selection needs a
   collection/plugin the user deselected; auto-keep or ask.
3. **Copy** the template into the target dir verbatim (aliases resolve — base is shared).
4. **Prune** unselected features: remove their owned files; clean their registrations from
   `payload.config.ts`, `exports.ts`, `BlocksFeature` lists, `providers/index.tsx`,
   `i18n/messages/*.json` + `localization.ts`, `app/api/*`, `next.config.js`; drop now-unused
   `package.json` deps.
5. **Finalize** — `.env.example`→`.env`, git init, install.
6. **Post** — `yarn generate:types`; for prod, `yarn migrate:create`. Then `tsc`/build to confirm the
   output compiles. Report kept vs pruned features, env to fill, remaining manual steps.

## Rules
- Never edit `@/payload-types` — regenerate it in the target.
- De-registering from `payload.config.ts` is the fragile step — edit semantically, then verify the
  output compiles before declaring done.
- Parity with the CLI: same selection → same file set + equivalent registrations.
