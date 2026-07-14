---
name: scaffold-collection
description: Scaffold a new Payload collection in kollab-payload-template following the established Posts pattern (typed slug generic, named access functions, localized da/en labels, co-located hooks, registration, type generation). Use when the user wants to add a new content type / collection (e.g. "add an Events collection"). For analytics/privacy/GDPR data models, use core-maintainer instead.
---

# Scaffold a collection

There is no CLI for collections yet — follow the `Posts` pattern by hand. For anything but trivial
work, delegate to the `payload-collection-builder` subagent, which encodes these steps in detail.

## Steps

1. **Read the reference:** `src/cms/collections/Posts/index.ts` (full example) and
   `src/cms/access/*` (access functions). Pick a PascalCase name + lowercase/kebab slug.

2. **Create `src/cms/collections/<Name>/index.ts`:**
   - `export const <Name>: CollectionConfig<'<slug>'> = { ... }` — pass the slug generic.
   - `slug: '<slug>'` (lowercase/kebab). Field names camelCase.
   - `access:` referencing named functions from `@/cms/access/` (e.g. `authenticatedOrPublished`,
     `authenticated`), not inlined (unless private/trivial — see `ConsentTokens.ts`).
   - `labels: { singular: { en: '…', da: '…' }, plural: { en: '…', da: '…' } }`.
   - Localize content fields with `localized: true`.
   - Add `hooks` in a co-located `hooks/` subdir; type them (`CollectionAfterChangeHook<Name>`).
     For anything user-visible on the frontend, add a locale-aware revalidation hook modeled on
     `src/cms/collections/Posts/hooks/revalidatePost.ts`.

3. **Register it** in `src/payload.config.ts`: import `<Name>` and add it to the `collections` array.

4. **Regenerate types:**
   ```bash
   yarn generate:types   # container: docker compose exec payload yarn _generate:types
   ```

5. **Migrations:** dev needs none (Drizzle auto-push). **Production:** `yarn migrate:create`, commit
   both `.ts` + `.json` under `src/migrations`.

6. **Verify:** `yarn lint`; open `:8890/admin` and confirm the collection appears and CRUD works.

## Future improvement
Consider adding a `create:collection` command to the CLI (`.cli/lib/core.ts` + a
`.cli/templates/collection/` template) so this becomes `yarn cli create:collection <Name>`, matching
the block workflow. Mention this to the user if they scaffold collections often.
