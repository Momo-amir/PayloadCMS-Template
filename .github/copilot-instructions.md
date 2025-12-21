# Copilot instructions for kollab-payload-template

This repo is a Next.js frontend integrated with a Payload CMS backend (Payload v3.x). The guidance below is focused, actionable, and specific to this codebase so an AI coding agent can be immediately productive.

- **Big picture**: The project is a Next 15 frontend and a Payload 3.68.5 backend shipped together. The frontend lives under `src/app` (split into `(frontend)` and `(payload)` zones). The Payload configuration and collections live under `src/payload.config.ts` and `src/cms/collections`. The repo often runs the Payload server inside Docker (see `docker-compose.yml`).

- **Key locations**:
  - `src/payload.config.ts` — central Payload config (auth, collections, plugins).
  - `src/cms/collections/*` — collection and field definitions; edit here to change data model.
  - `src/app/(payload)/admin` — Payload admin customizations and CSS for the admin UI.
  - `src/app/(frontend)` — public-facing Next pages and layout.
  - `src/migrations` — code + JSON migrations. New migrations follow the timestamped filename pattern.
  - `scss-loader.mjs` — imported by some Payload CLI commands via `NODE_OPTIONS` to enable SCSS in payload tooling.

- **Build / dev / run commands** (use `npm run <script>` or yarn equivalents):
  - `npm run dev` — runs Next dev server on `PORT` (default 8890).
  - `npm run build` and `npm run start` — production Next build/start. `postbuild` runs `next-sitemap`.
  - `npm run docker-dev` — starts only the `payload` service via Docker Compose (useful to run Payload locally in a container).
  - `npm run docker-prod`, `docker-prod:build`, `docker-prod:up-build` — production compose helpers.
  - Payload CLI that manipulates types/importmaps/migrations is usually executed inside the payload container. Use the provided wrappers:
    - `npm run generate:types` (execs into `payload` container)
    - `npm run generate:importmap` (execs into `payload` container)
    - `npm run migrate:create` (creates migrations via the container)

- **Node / env**: Engines require Node `^18.20.2` or `>=20.9.0`. Environment variables follow common Next/Payload patterns; dev runs pass `PORT` if set.

- **Conventions & patterns to follow**:
  - Model/schema changes: update files in `src/cms/collections`, then run `npm run generate:types` to refresh generated types and consider creating a migration (`npm run migrate:create`). Most payload dev tasks are performed inside the container — prefer the `docker compose exec payload yarn ...` flow used in `package.json` scripts.
  - Styling: admin-specific styles are in `src/app/(payload)/custom.scss` / `custom.css`. Frontend globals live in `src/app/(frontend)/globals.css`.
  - Migrations: both `.ts` and `.json` migration artifacts are committed in `src/migrations`. Follow the timestamped naming convention used there.

- **What to update when changing collections or fields**:
  1. Edit collection under `src/cms/collections`.
  2. Run `npm run generate:types` (inside container via the wrapper) to refresh TypeScript types used by frontend.
  3. If schema changes require DB migrations, create a migration with `npm run migrate:create`.
  4. Restart payload server (e.g., `docker compose restart payload` or `npm run docker-dev` lifecycle) so changes take effect.

- **Debugging tips**:
  - When Payload behaves differently than expected, check container logs: `docker compose logs -f payload`.
  - For Next errors during development, use `npm run dev` and inspect browser console + terminal stack traces.

- **Dependencies & integration notes**:
  - Payload plugins and admin customizations are in `package.json` as `@payloadcms/*` packages — be careful to keep plugin versions aligned with the `payload` dependency (this repo pins 3.68.5 in many places).
  - SCSS support for payload CLI uses `scss-loader.mjs` via `NODE_OPTIONS` in the `_generate:*` and `_migrate:create` scripts. When invoking payload CLI directly, replicate that `NODE_OPTIONS` usage.

- **Files to open first when investigating a feature**:
  - `src/payload.config.ts` — understand data model registration and plugins.
  - `src/cms/collections/Posts` (or other collection folders) — concrete schema examples.
  - `src/app/(payload)/admin` — admin UI customizations.
  - `package.json` — canonical dev/build scripts (run these, don't guess ad-hoc compose commands).

- **What not to change lightly**:
  - Do not change the pinned `payload` and `@payloadcms/*` versions without testing the admin and migrations locally — plugins are interdependent.
  - Avoid removing the `NODE_OPTIONS='--import ./scss-loader.mjs'` usage from the payload-related dev scripts unless you add equivalent SCSS handling.

If you'd like I can iterate on tone, add exact example file links, or merge content from an existing agent file if you have one to preserve. Want me to commit this file now or adjust any sections first?
