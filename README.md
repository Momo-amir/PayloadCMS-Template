# Kollab Payload Template

Pick one setup path below. Docker is recommended and supports both development and production with minimal host dependencies.

## Table of Contents

- [Docker (recommended)](#docker-recommended)
  - [Development (Docker)](#development-docker)
  - [Production (Docker)](#production-docker)
- [Local (host)](#local-host)
  - [Development (Local)](#development-local)
  - [Production (Local)](#production-local)
- [Kollab CLI](#kollab-cli)
- [Personalization](#personalization)

---

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
