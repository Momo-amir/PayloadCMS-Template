# Kollab Payload Template

A comprehensive Next.js + Payload CMS template with built-in GDPR-compliant Google Analytics.

## Table of Contents

- [Docker (recommended)](#docker-recommended)
  - [Development (Docker)](#development-docker)
  - [Production (Docker)](#production-docker)
- [Local (host)](#local-host)
  - [Development (Local)](#development-local)
  - [Production (Local)](#production-local)
- [Analytics Setup](#analytics-setup)
- [Kollab CLI](#kollab-cli)
- [Personalization](#personalization)

## Docker (recommended)

This runs Payload, PostgreSQL, and the app inside containers.

Requirements:

- Docker Desktop (includes Compose)

Clone once and set up env:

```bash
git clone git@bitbucket.org:it-kartellet/kollab-payload-template.git kollab-payload-template
cd kollab-payload-template
cp .env.example .env
# Optional: install node modules on host for IDE linting/type-check
yarn install
```

### Development (Docker)

Start the stack (Next.js dev on port 8890):

```bash
yarn docker-dev
```

- App: http://localhost:8890
- Admin: http://localhost:8890/admin (create the first admin user on first visit)

Schema changes in dev: Drizzle auto-pushes schema to the DB. If a destructive change needs confirmation, attach to the container:

```bash
yarn attach
```

- Detach: press Ctrl+P, then Ctrl+Q

Remove containers (keep volumes):

```bash
docker compose down
```

Remove containers + volumes:

```bash
docker compose down -v
```

### Production (Docker)

Migrations are required for production. Generate them before building images:

```bash
yarn migrate:create
```

This creates/updates the `migrations/` folder. Commit migration files with your changes. In production, migrations run automatically on container start (see `docker-entrypoint.sh`).

Build and run production stack:

```bash
yarn docker-prod:build      # build images only
yarn docker-prod            # start containers
# or
yarn docker-prod:up-build   # build and start in one go
```

Shutdown:

```bash
yarn docker-prod:down
```

Notes:

- Public port 8890 maps to container port 3000 in prod (`docker-compose.prod.yml`). - This is to be changed later
- Media is persisted in the `payload_media` volume.

---

## Local (host)

Requirements:

- Node.js ≥ 18 (or ≥ 20)
- Yarn (or npm/pnpm)
- PostgreSQL ≥ 14 running locally

### Development (Local)

```bash
git clone git@bitbucket.org:it-kartellet/kollab-payload-template.git kollab-payload-template
cd kollab-payload-template
cp .env.example .env
yarn install
# or npm install / pnpm install

# ensure your .env DB settings point to your local PostgreSQL
yarn dev
# or npm run dev / pnpm dev
```

- App: http://localhost:8890
- Admin: http://localhost:8890/admin

In local development Drizzle auto-pushes schema changes; do not run migrations in dev.

### Production (Local)

Create migrations, build, and start:

```bash
yarn migrate:create
yarn build
yarn start
# or npm run migrate:create && npm run build && npm run start
```

This produces an optimized build. Migrations should be generated and applied as part of your deployment process.

---

## Analytics & Tracking

### How It Works

The template includes **automatic, GDPR-compliant tracking** that helps you understand how users interact with your website:

- **Automatic tracking** on all CMS links and buttons (no extra code needed)
- **Cookie consent banner** appears for GDPR regions, blocks tracking until accepted
- **Google Consent Mode v2** ensures privacy-compliant analytics
- **Custom event tracking** via simple React hooks for forms, videos, downloads, etc.

### What You Can Track

Out of the box, the system tracks:

- **Button clicks** - Every CTA, link, and navigation action
- **Page views** - User navigation patterns
- **Component visibility** - Which sections users actually see
- **Form interactions** - Submissions, field focus, errors
- **Video engagement** - Play, pause, completion rates
- **File downloads** - Track PDF, image, and document downloads
- **Search queries** - What users are looking for
- **Scroll depth** - How far users read content

### Why It's Valuable

1. **Understand user behavior** - See which CTAs work, which content engages, and where users drop off
2. **Optimize conversions** - Data-driven decisions on layout, copy, and CTAs
3. **Client reporting** - Professional analytics dashboards showing real impact
4. **Privacy-compliant** - Automatic GDPR consent management builds trust
5. **Zero configuration** - Works automatically with your components

### Quick Setup

1. Get your Google Analytics ID from [analytics.google.com](https://analytics.google.com/)
2. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Deploy - tracking works automatically on all CMS components

**Full Documentation:** [docs/ANALYTICS.md](./docs/ANALYTICS.md)

---

## Kollab CLI

Use the custom CLI to scaffold new Blocks. Generated blocks are immediately available in the Admin Page Builder.

```bash
yarn cli create-block <BlockName>
# Example:
yarn cli create-block Accordion
```

Details:

- Writes to `src/website/blocks/<BlockName>` and updates `src/website/blocks/exports.ts`.
- Default behavior exposes the block on the Page collection. You can later set an optional `showOnPage` flag to false in the block’s config if desired.

---

## Payload CLI

You should use the Payload CLI for some specific tasks, we have already talked about `migrate:create` but there are more commands you might find useful:

```bash
yarn generate:types
yarn generate:importmap
yarn migrate:create
```

Details:

- These commands are the most common ones that we also have aliased in the `package.json` file.
  - `generate:types` generates the types in `payload-types.ts` any code that writes to the database gets reflected here.
  - `generate:importmap` generates the import map in `payload-import-map.json` This way Payload keeps track of where everything is.
  - `migrate:create`creates the migrations you will need to push for the database structure in production or when not using the auto push to database in development.

Payload has more commands that you can use a full list here:

```bash
yarn payload <command>

  - generate:db-schema
  - generate:importmap
  - generate:types
  - info
  - jobs:run
  - jobs:handle-schedules
  - run
  - migrate
  - migrate:create
  - migrate:down
  - migrate:refresh
  - migrate:reset
  - migrate:status
  - migrate:fresh

```

Details:

- You can run any of these commands by prefixing them with `yarn payload <command>`. Most noteworthy are the ones regarding Jobs. Payload's Jobs gives you a simple, yet powerful way to offload large or future tasks to separate compute resources. You can read more about it in the [official documentation](https://payloadcms.com/docs/jobs-queue/overview).

## Personalization

You can customize the template here:

- Logo: replace files in `public/assets` (keep names to avoid code changes). `logo-on-light.svg` for light backgrounds and `logo-on-dark.svg` for dark.
- Favicon: replace files in `public/assets` (dark/light variants supported by default).
- Colors: adjust global styles in `src/app/(frontend)/globals.css`. Keep `src/cssVariables.js` in sync with your design tokens as needed.
- Component/Layout color themes: many blocks/components support theme variants. Update labels/values in their `config.ts`/`component.tsx` files under:
  - `src/website/blocks/<YourBlock>/`
  - `src/website/components/`

---

### Notes and tips

- Ports: dev uses 8890; prod maps 8890 -> 3000 in Docker. Change this as needed for actual production use.
- Next.js `output: 'standalone'` is required for the Docker prod image and is safe to keep for dev.
- Scripts you’ll likely use:
  - `yarn docker-dev`, `yarn attach`, `yarn docker-prod`, `yarn docker-prod:build`, `yarn docker-prod:up-build`, `yarn docker-prod:down`
  - `yarn dev`, `yarn build`, `yarn start`, `yarn migrate:create`
