# create-kollab-payload — roadmap

The scaffolder is **discovery-driven**: new blocks/collections added to the template appear in the
selection menu automatically. `discover()` parses `exports.ts`, collection `BlocksFeature` lists, and
`payload.config.ts` at scaffold time — there is no hardcoded feature list. The only manual step is
`features/overrides.json`, and only for facts code cannot infer (a `group` label, a bare `relationTo`
prerequisite, a required plugin, or collection-owned app files). A plain block with no external deps
needs zero override entries. Use `/author-feature` or the `feature-manifest-author` agent when a new
feature has hidden prerequisites.

## Now (robustness & polish)

- [x] **ts-morph field-remover keyed on `relationTo`** — replaced the fragile multi-line find/replace
      patches in `overrides.json` (Posts `authors`/`categories` field objects) with an engine codemod
      (`removeFieldByRelationTo` / `applyFieldRelationRemovals` in `codemod.ts`, wired in `generate.ts`
      step 5a2) that removes a Payload field object by its `relationTo` value. Whitespace-independent;
      never silently no-ops if formatting changes. Verified: prunes `authors`/`categories`, keeps
      `relatedPosts`.
- [x] **Group the Ungrouped blocks** — `callToActionBlock`, `accordionBlock`, `contentBlock`,
      `promoStripBlock` now grouped under `Content` in `overrides.json`; no Ungrouped group remains.
- [ ] Fill prune metadata (`ownedFiles`/`patches`) for any remaining optional collection as they gain
      dedicated routes/components.

## Next (deeper config prompts)

- [x] **Site/brand name** — prompt (defaults to title-cased project name; `--brand=`), replaces the
      `Kollab Website Template` literal across og/meta/seo/seed in the generated project.
- [x] **Selectable heros** — HighImpact/MediumImpact/LowImpact prunable (`--heros=`), cleaning the hero
      config select options + RenderHero map/imports. `none`/`search`/PostHero excluded.
- [x] **Selectable plugins** — redirects/form-builder/search prunable (`--plugins=`): removes the plugin
      call + orphaned imports + package.json deps + config-owned files; cascades (form-builder→formBlock,
      injected collections vanish); warns on search-hero coupling. seo + nested-docs intentionally always-on.
- [ ] Scaffold-time prompts still to wire: which **locales** to keep

  (currently da+en fixed — needs localization.ts + next-intl + messages pruning),**payload plugins** and which to keep same as collections and blocks, but just for all the plugins

## Add features into an existing project

- [x] **`create-kollab-payload add <blockSlug>`** — pull a block + its transitive file closure from
      the template into an already-generated project (`.cli/lib/add.ts`, engine command `add:block`,
      initializer `add` subcommand). Copies only files the project lacks, registers the block in
      `exports.ts` (mirrors the `create:block` splice), pulls container children, and refuses if a
      required collection/plugin is missing instead of dangling a `relationTo`. Verified: adding
      `cardBlock` into a media-only site copies all 41 closure files; the collection guard refuses
      `peopleArchiveBlock` when `people` was pruned.
- [ ] Extend `add` to collections + plugins — needs ts-morph *insertion* codemods (add-to-array,
      add-import, add-plugin-call, add-relationField), `ownedFiles` copy, reverse-`patches`, and a
      dependency-version source for new `package.json` entries. Removal codemods don't invert cheaply.

## Later (distribution & DX)

- [x] **No more double install.** The pruning engine is now bundled inside the initializer package
      (`engine/`, built by `scripts/bundle-engine.ts` from `../.cli`) with `ts-morph`/`prompts`/`tsx`
      as real deps, and runs against the clone via `--root` with the initializer's own `tsx`. The
      temp clone is no longer installed at all — the single remaining install is the output project's.
- [x] **yarn without a manual global install.** Root `package.json` now pins
      `"packageManager": "yarn@1.22.22"` so corepack auto-provisions the right yarn; the initializer
      prefers `corepack yarn`, then a host `yarn`, then falls back to `npm install` (with a warning
      that the generated project's scripts/Docker still expect yarn).
- [x] **Automated release.** `.github/workflows/release.yml` fires on a `main` push that changes the
      initializer: if the `package.json` version has no matching `vX.Y.Z` tag it builds, `npm
      publish`es, and tags the commit — so version→tag→npm can't drift. Day-to-day pushes go to
      Bitbucket; `bitbucket-pipelines.yml` mirrors `main` + tags to GitHub (where npx clones and the
      Action runs). One-time setup: `NPM_TOKEN` (GitHub secret), `GITHUB_TOKEN` + `GITHUB_REPO`
      (Bitbucket variables). See README "Releasing".
- [ ] `--template-ref` / version picker; `--dry-run` in the initializer to preview the prune plan.
- [ ] Offline / cached clone; faster shallow fetch.
- [ ] Engine tests (Vitest) covering discovery + prune plan for representative selections.

## Growing features (ongoing, automatic)

Add blocks via `yarn cli create:block <Name>` and collections via the Posts pattern; they surface in
the menu with no scaffolder changes. Only add an `overrides.json` entry when the feature has a
non-derivable prerequisite. Candidate blocks to grow into: testimonials, hero variants, pricing table,
FAQ, gallery. Candidate collections: events, team, FAQ.
