---
name: author-feature
description: Add a NEW selectable feature (block or collection) to the kollab-payload-template so it becomes selectable by the create-kollab-app scaffolder. Enforces the normalized naming conventions, keeps the template compiling, and updates features/overrides.json where needed. Use when adding a new block/collection to the template's menu.
---

# Author a feature (grow the template menu)

The template is a maximal superset; adding a feature grows what `create-kollab-app` can select.
See `docs/DISTRIBUTION.md` for the model.

## Naming conventions (must match)
- Block folder = PascalCase noun, no redundant `Block` (`Media`, not `MediaBlock`).
- Export const = interfaceName = `<Folder>Block`. Alias the component import as `<Name>BlockComponent`
  to avoid colliding with the export const.
- Slug = camelCase with `*Block` suffix (`mediaBlock`, `twoColumnBlock`).
- Add `dbName` (short) if the slug is long and the block has nested/array fields — Postgres caps
  generated identifiers at 63 chars.
- Sub-block (only usable inside another block) → `showOnPage: false`.
- Inline-only (rich-text) block → register in a collection's `BlocksFeature`, not `exports.ts`.
- **Container block** (nests other blocks via a `type: 'blocks'` field): its renderer MUST build the
  child slug→component map from the config's `blocks` arrays (data-driven, like `TwoColumn/fields.tsx`),
  never a hardcoded map/switch — this lets the scaffolder prune unwanted children automatically.

## Steps for a new block
1. `yarn cli create:block <Name>` (see `/scaffold-block`) or copy an existing block folder.
2. Set slug/export/interfaceName/labels per the conventions above.
3. Register in `src/website/blocks/exports.ts` (page-builder) or the relevant `BlocksFeature` (inline).
4. If it relates to collections via bare `relationTo` strings, or needs a plugin, or is a sub-block:
   add an entry in `features/overrides.json` (`requiresCollections`, `requiresPlugins`, `onlyInside`,
   `group`). Validate against `features/overrides.schema.json`.
5. `yarn generate:types` (container). Prod: `yarn migrate:create`.
6. Confirm the template still compiles and the block renders at `:8890/admin`.

## Steps for a new collection
Follow `/scaffold-collection`. Then, if a block or the scaffolder needs to know prerequisites, reflect
them in `features/overrides.json`.

## Rules
- Comments: prefer none; single-line only, never multi-line blocks.
- Keep `core/` boundary intact (see `core-maintainer`) if the feature touches analytics/privacy.
- Every new block/collection must be discoverable (in `exports.ts`/`BlocksFeature`/`collections`) and,
  if it has non-derivable prerequisites, present in `overrides.json`.
