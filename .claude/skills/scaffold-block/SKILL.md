---
name: scaffold-block
description: Scaffold a new Payload page-builder block in kollab-payload-template using the built-in CLI, then wire up its config and component. Use when the user wants to add a new block to the website page builder (e.g. "add a Testimonial block", "create a new block").
---

# Scaffold a block

Blocks are page-builder components under `src/website/blocks/<Name>/`. There's a CLI that scaffolds
the folder and registers the block; you fill in the fields and rendering.

## Steps

1. **Pick a PascalCase name** (e.g. `Testimonial`). Confirm it doesn't already exist:
   `ls src/website/blocks/`.

2. **Run the CLI** (note the colon — it's `create:block`, not `create-block`):
   ```bash
   yarn cli create:block <Name>
   ```
   This copies `.cli/templates/block/` to `src/website/blocks/<Name>/` (creating `config.ts` +
   `Component.tsx` with `{{BLOCK}}` replaced by the name) and inserts `<Name>Block` into
   `src/website/blocks/exports.ts`.

3. **Verify registration** — open `src/website/blocks/exports.ts` and confirm `<Name>Block` is both
   imported and present in the `blocks` array. (The CLI edits this via regex; double-check it landed.)

4. **Fill in `config.ts`** — define the block's fields. It's typed `ComponentBlock` (see
   `src/website/types/ComponentBlock.ts`) and carries `component`, `slug`, `interfaceName`,
   `showOnPage`. Add fields following existing blocks; localize with `localized: true` where content
   varies per language. Reference a rich example: `src/website/blocks/Accordion/config.ts`.

5. **Fill in `Component.tsx`** — the renderer. Server component by default; if it needs
   interactivity, put the interactive part in a `Component.client.tsx` with `'use client'`. Props
   should extend the generated type from `@/payload-types` (import it as
   `import type { <Name>Block as <Name>Props } from '@/payload-types'`). Keep the `<TrackImpression>`
   wrapper from the template (analytics). Use `cn()` from `@/cms/utilities/ui` for classes.

6. **Regenerate types** so the block's generated interface exists:
   ```bash
   yarn generate:types   # container: docker compose exec payload yarn _generate:types
   ```

7. **Verify:** `yarn lint`, then check the block appears in the admin page builder at
   `:8890/admin` and renders on a page.

Report the files created/edited and any follow-up (types regen, restart) the user still needs.
