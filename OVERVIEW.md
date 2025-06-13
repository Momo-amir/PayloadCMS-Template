# Project Structure Overview

This document explains the high-level folder layout and responsibility boundaries in this project.

## Root

- `package.json`, `tsconfig.json`, `tailwind.config.mjs`  
  Core config files for build, TypeScript and Tailwind.
- `src/payload.config.ts`  
  PayloadCMS server configuration and collection/global definitions.

## src/website

Contains all **public-facing** React components and layout logic.

### src/website/blocks

Repeatable “layout builder” blocks you can drop into any page or post:

- ArchiveBlock (`src/website/blocks/ArchiveBlock/Component.tsx`)
- CallToActionBlock (`src/website/blocks/CallToAction/Component.tsx`)
- ContentBlock (`src/website/blocks/Content/Component.tsx`)
- FormBlock (`src/website/blocks/Form/Component.tsx`)
- MediaBlock (`src/website/blocks/MediaBlock/Component.tsx`)
- TwoBlock (`src/website/blocks/TwoBlock/Component.tsx`)

Each block has:

- A Payload config (`src/website/blocks/.../config.ts`)
- A React component under `Component.tsx`
- Any field-specific subcomponents under for example `Form/fields`.

### src/website/layout

Single-use or global layout sections:

- **Header**
  - Config: `src/website/layout/Header/config.ts`
  - Server render entry: `src/website/layout/Header/Component.tsx`
  - Client nav/theme logic: `src/website/layout/Header/Component.client.tsx`
- **Footer**
  - Config: `src/website/layout/Footer/config.ts`
  - Render: `src/website/layout/Footer/Component.tsx`
- **Heros**
  - Hero configs: `src/website/layout/heros/config.ts`
  - Render logic: `src/website/layout/heros/RenderHero.tsx`
  - Variants:
    - HighImpact (`src/website/layout/heros/HighImpact/index.tsx`)
    - MediumImpact (`src/website/layout/heros/MediumImpact/index.tsx`)
    - LowImpact (`src/website/layout/heros/LowImpact/index.tsx`)

## src/cms

Contains CMS-specific logic and Payload plugins:

- **collections/**  
  Payload collection configs (`src/cms/collections/...`). Collections define the content types and their fields. think of these as the data holders for the CMS.
- **components/**  
  Shared UI for admin & live preview (e.g., `src/cms/components/RichText`, `Card`, `Link`, `Media`).
- **fields/**  
  Custom field definitions (e.g., `src/cms/fields/linkGroup.ts`, `defaultLexical.ts`). The custom fields extend Payload's capabilities, allowing for more complex data structures for specific needs.
- **plugins/**  
  Payload plugins setup (`src/cms/plugins/index.ts`).
- **utilities/**  
  Helpers (e.g., `src/cms/utilities/getURL.ts`, `ui.ts`).

## src/app

Next.js App Router — handles routing only, no new components needed here.

- **(frontend)/**  
  Public routes and data fetching (`src/app/(frontend)/[slug]/page.tsx`, search, posts).
- **(payload)/**  
  Admin panel routes and import map (`src/app/(payload)/admin/importMap.js`, API endpoints).

## How It Fits Together

1. **Payload** serves content via API configured in `src/payload.config.ts`.
2. **Next.js App Router** (`src/app`) fetches that content.
3. **RenderHero** + **RenderBlocks** in `src/website` choose the Right React components.
4. **CMS UI** (`src/cms`) powers the admin panel and live previews.

This separation keeps the public site components (`src/website`) distinct from CMS logic (`src/cms`) and routing (`src/app`).# Project Structure Overview

# TBD FOR TEMPLATE

### Database change, we need to remove the sqlite database and decide on what to use instead.
