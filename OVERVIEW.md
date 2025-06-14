# Template Structure Overview

This document explains the high-level folder layout and responsibility boundaries for the Kollab payloadCMS template. It is designed to introduce you to the template's structure and how the different parts interact with each other.

For each section, we will outline the key components and their responsibilities and provide a short explanation and/or [Official Payload Documentation](https://payloadcms.com/docs/getting-started/concepts).

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
- CallToActionBlock (`src/website/blocks/CallToAction/Component.tsx`) - Content type for a call to action
- CodeBlock (`src/website/blocks/CodeBlock/Component.tsx`) - Content type for displaying code snippets
- ContactBlock (`src/website/blocks/Contact/Component.tsx`) - Content type for a contact information component
- ContentBlock (`src/website/blocks/Content/Component.tsx`) - Content type for text content
- FormBlock (`src/website/blocks/Form/Component.tsx`) - Content type for forms that can be build and customized in the CMS
- MediaBlock (`src/website/blocks/MediaBlock/Component.tsx`) - Content type for media content

Each block has:

- A Payload block config (`src/website/blocks/.../config.ts`) - Defines the block's fields, relations and structure in Payload [DOCS](https://payloadcms.com/docs/fields/blocks#block-configs).
- A React component under `Component.tsx`

Optionally, some blocks may have:

- Field-specific subcomponents for example `Form/fields` can be used to handle all the relation logic to components or blocks.

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
  Hero components are used to display prominent content at the top of pages, such as banners or featured sections. They can vary in impact and design, allowing for different visual emphasis based on the content's importance. Keeping this for the template rather than using a block, as it is a common design practice.
  - Hero configs: `src/website/layout/heros/config.ts`
  - Render logic: `src/website/layout/heros/RenderHero.tsx`
  - Variants:
    - HighImpact (`src/website/layout/heros/HighImpact/index.tsx`)
    - MediumImpact (`src/website/layout/heros/MediumImpact/index.tsx`)
    - LowImpact (`src/website/layout/heros/LowImpact/index.tsx`)
- **Search**
  - Before Sync: `src/website/layout/Search/Component.tsx`
  - Component: `src/website/layout/Search/Component.client.tsx`
  - field Overrides: `src/website/layout/Search/fields.ts`

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
  Payload collection configs (`src/cms/collections/...`). Collections define the content types and their fields. think of these as the database layer for the CMS [DOCS](https://payloadcms.com/docs/configuration/collections).
- **components/**  
  Shared UI for admin & live preview (e.g., `src/cms/components/RichText`, `Card`, `Link`, `Media`). These components can also be used when creating custom blocks for the public site. fx RichText would be used when creating a block that need to display text, but these components are more akin to data types rather than layout components.
- **fields/**  
  Custom field definitions (e.g., `src/cms/fields/linkGroup.ts`, `defaultLexical.ts`). The custom fields extend Payload's capabilities, allowing for more complex data structures for specific needs.
- **plugins/**  
  Payload plugins setup (`src/cms/plugins/index.ts`). - Plugins can be either from payloadCMS itself, custom or third-party extensions
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
2. **Next.js App Router** (`src/app`) fetches and correctly routes our app and powers the navigation.
3. **RenderHero** + **RenderBlocks** in `src/website` our public site components render, the content fetched by Next.js and defined in Payload will be sent to the client.
4. **CMS UI** (`src/cms`) powers the admin panel and live previews.

This separation keeps the public site components (`src/website`) distinct from CMS logic (`src/cms`) and routing (`src/app`).

## Development Workflow

To work with this template, follow these steps:

1. **Install Dependencies**: Run `npm install` or `pnpm install` to set up the project.
2. **Follow the Readme**: Use Readme.md for quick setup of the template to set up development environment
3. **Run the Development Server**: Use docker or run `npm run dev` to start the development server.
   - If using Docker, run `docker compose up --build` to build the images and start the containers.
   - If running locally, ensure PostgreSQL is running and configured in `.env`.
4. **Access the Admin Panel**: Navigate to `http://localhost:3000/admin` to manage your content.
5. **Configure Payload**: Update `src/payload.config.ts` to add or modify collections, globals, add branding like logos etc.
6. **Setup Tailwind**: Use `tailwind.config.mjs` to customize the tailwind setup for the project. Change color variables in global.css to match the design
7. **Develop Components**: Create or modify components in `src/website/components` or `src/cms/components` as needed.
8. **Create Blocks**: Edit or add new blocks in `src/website/blocks` to extend the layout capabilities of the site.
