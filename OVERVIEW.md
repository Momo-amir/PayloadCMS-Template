# Template Structure Overview

This document explains the high-level folder layout and responsibility boundaries for the Kollab template. It is designed to introduce you to the template's structure and how the different parts interact with each other.

For each section, we will outline the key components and their responsibilities and provide relevant examples or [Official Payload Documentation](https://payloadcms.com/docs/getting-started/concepts).

## Root

- `package.json`, `tsconfig.json`, `tailwind.config.mjs`  
  Core config files for build, TypeScript and Tailwind.
- `src/payload.config.ts`  
  PayloadCMS' main configuration and collection/global definitions. [DOCS](https://payloadcms.com/docs/configuration/overview)
- `src/payload-types.ts`  
  Auto-generated TypeScript types for Payload.

## src/website

Contains all **public-facing** React components and layout logic.

### src/website/blocks

Repeatable “layout builder” blocks you can drop into any page or post [DOCS](https://payloadcms.com/docs/fields/blocks). Some work as layout/structure sections with relations to other blocks and collections, others as content deliverers:

- ArchiveBlock (`src/website/blocks/ArchiveBlock/Component.tsx`) - Layout type with relations to Posts
- TwoBlock (`src/website/blocks/TwoBlock/Component.tsx`) - Layout type with two columns with relations to other blocks
- CallToActionBlock (`src/website/blocks/CallToAction/Component.tsx`) - Content type with a call to action
- CodeBlock (`src/website/blocks/CodeBlock/Component.tsx`) - Content type for displaying code snippets
- ContactBlock (`src/website/blocks/Contact/Component.tsx`) - Content type for contact information
- ContentBlock (`src/website/blocks/Content/Component.tsx`) - Content type for text content
- FormBlock (`src/website/blocks/Form/Component.tsx`) - Content type for forms
- MediaBlock (`src/website/blocks/MediaBlock/Component.tsx`) - Content type for media content

Each block has:

- A Payload block config (`src/website/blocks/.../config.ts`) - Defines the block's fields, relations and structure in Payload [DOCS](https://payloadcms.com/docs/fields/blocks#block-configs).
- A React component under `Component.tsx`

Optionally, some blocks may have:

- Field-specific subcomponents for example `Form/fields`.

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

### src/website/components

Components such as Button, Input, Card, and others serve as our core UI primitives. Built with modularity and flexibility in mind, these components offer a wide range of configurable options through props, enabling extensive customization and reuse across the application.

- **Button** (`src/website/components/Button/Component.tsx`) - A reusable button component built to account for all variations.
- **Card** (`src/website/components/Card/Component.tsx`) - A card component for displaying content.
- **Input** (`src/website/components/Input/Component.tsx`) - A reusable input component.
- **Label** (`src/website/components/Label/Component.tsx`) - A label component.
- **Select** (`src/website/components/Select/Component.tsx`) - A reusable select component.
- **Textarea** (`src/website/components/Textarea/Component.tsx`) - A text area component.
- **Checkbox** (`src/website/components/Checkbox/Component.tsx`) - A reusable checkbox component.
- **Pagination** (`src/website/components/Pagination/Component.tsx`) - A pagination component for displaying paginated content.

## src/cms

Contains CMS-specific logic and Payload plugins:

- **collections/**  
  Payload collection configs (`src/cms/collections/...`). Collections define the content types and their fields. think of these as the database layer for the CMS.
- **components/**  
  Shared UI for admin & live preview (e.g., `src/cms/components/RichText`, `Card`, `Link`, `Media`). These components can also be used when creating custom blocks for the public site. fx RichText would be used when creating a block that need to display text, but these components are more akin to data types rather than layout components.
- **fields/**  
  Custom field definitions (e.g., `src/cms/fields/linkGroup.ts`, `defaultLexical.ts`). The custom fields extend Payload's capabilities, allowing for more complex data structures for specific needs.
- **plugins/**  
  Payload plugins setup (`src/cms/plugins/index.ts`).
- **utilities/**  
  Helpers (e.g., `src/cms/utilities/getURL.ts`, `ui.ts`).
- **endpoints/**  
  API endpoints for the admin panel (`src/cms/endpoints/...`). Here the API endpoints are defined for the admin panel, allowing for custom data fetching and manipulation. If you for example need to seed the database with initial data, you would create an endpoint here to handle that logic.

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

This separation keeps the public site components (`src/website`) distinct from CMS logic (`src/cms`) and routing (`src/app`).

# TBD FOR TEMPLATE

### Database change, we need to remove the sqlite database and decide on what to use instead.
