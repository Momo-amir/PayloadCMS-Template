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

## Later (distribution & DX)

- [ ] Avoid the double `yarn install` (engine clone + output) — reuse or share the install. Also add loading state for the engine clone step.
- [ ] `npm publish` flow finalized; CI (Bitbucket Pipelines) to auto-tag template + publish initializer
      on release so the version→tag contract can't drift.
- [ ] `--template-ref` / version picker; `--dry-run` in the initializer to preview the prune plan.
- [ ] Offline / cached clone; faster shallow fetch.
- [ ] Engine tests (Vitest) covering discovery + prune plan for representative selections.

## Growing features (ongoing, automatic)

Add blocks via `yarn cli create:block <Name>` and collections via the Posts pattern; they surface in
the menu with no scaffolder changes. Only add an `overrides.json` entry when the feature has a
non-derivable prerequisite. Candidate blocks to grow into: testimonials, hero variants, pricing table,
FAQ, gallery. Candidate collections: events, team, FAQ.
