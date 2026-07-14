# Next session kickoff prompt

Copy-paste the block below to start the next session.

---

We're building `npx create-kollab-payload` — a real, published initializer that generates a client
site from this template. The generator ENGINE is already built and verified in `.cli/lib/` on branch
`feature/create-kollab-app-scaffolder` (uncommitted). Read `docs/DISTRIBUTION.md` and the
`create-kollab-app-scaffolder` memory first, then the `.cli/lib/` files, before proposing anything.

What already works (don't rebuild — reuse):
- `yarn cli list`, `yarn cli manifest validate`, `yarn cli generate --out=<dir> [--blocks=..]
  [--collections=..] [--dry-run]` (interactive when flags omitted).
- Copy-then-prune with block pruning, container-child pruning, and full deep collection pruning
  (ownedFiles delete, config/plugin/search removal, relationTo trim, per-collection find/replace
  patches). Verified: a posts-pruned output compiles; the base app still runs.
- Engine modules: `discovery.ts`, `closure.ts`, `codemod.ts` (ts-morph), `generate.ts`, `select.ts`.
- Metadata sidecar: `features/overrides.json` (+ schema).

This session's goal: turn the in-repo engine into a standalone `npx create-kollab-payload` initializer.
Before coding, plan with me: decide (1) template source — git tag/branch clone vs published npm tarball
vs degit; (2) where the initializer package lives — separate repo vs a workspace here; (3) how it
version-pins the template; (4) how the engine code is shared (published as a lib, vendored, or run from
the fetched template's own `.cli`). Then propose a build order and we'll go.

Constraints/gotchas already learned (in CLAUDE.md): lint is broken (use `npx tsc --noEmit`); always
verify against the running dev app (Docker up on :8890) because tsc misses runtime import cycles; only
`posts` has full `ownedFiles`/`patches` in overrides — categories/people need theirs when pruned;
comment style = no multi-line blocks.

Start by confirming the branch state (`git status`), then let's plan the packaging approach.

---
