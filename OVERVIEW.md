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
  - `/src/cms/components` contains shared data-type and UI pieces for the admin panel (and live preview). Some (RichText, Media, Link, etc.) are also used on the public site, while others power CMS-only features. Because they model your content layer, changes here can have wide-ranging side effects—only modify if you know the impact.
- **fields/**  
  Custom field definitions (e.g., `src/cms/fields/linkGroup.ts`, `defaultLexical.ts`). The custom fields extend Payload's capabilities, allowing for more complex data structures for specific needs.
- **plugins/**  
  Payload plugins setup (`src/cms/plugins/index.ts`). - Plugins can be either from payloadCMS itself, custom or third-party extensions
- **utilities/**  
  Helpers (e.g., `src/cms/utilities/getURL.ts`, `ui.ts`).
- **endpoints/**  
  API endpoints for the admin panel (`src/cms/endpoints/...`). Here the API endpoints are defined for the admin panel, allowing for custom data fetching and manipulation. If you for example need to seed the database with initial data, you would create an endpoint here to handle that logic.
- **globals/**
  - `Branding` (`src/cms/endpoints/globals/Branding.ts`) - This is where the logic for the branding global is handled. It is used to customize the look and feel of the public site and some parts of the admin panel.

## src/app

Next.js App Router — handles routing only, no new components needed here.

- **(frontend)/**  
  Public routes and data fetching (`src/app/(frontend)/[slug]/page.tsx`, search, posts).
- **(payload)/**  
  Admin panel routes and import map (`src/app/(payload)/admin/importMap.js`, API endpoints).

## src/providers

Contains the logic for head tags, global styles, and other providers that wrap the application. This is where the logic for dark mode is handled

## How It Fits Together

1. **Payload** serves content via its local API configured in `src/payload.config.ts`.
2. **Next.js App Router** (`src/app`) fetches and correctly routes our app and powers the navigation.
3. **RenderHero** + **RenderBlocks** in `src/website` our public site components render, the content fetched by Next.js and defined in Payload will be sent to the client.
4. **CMS UI** (`src/cms`) powers the admin panel and live previews.

This separation keeps the public site components (`src/website`) distinct from CMS logic (`src/cms`) and routing (`src/app`).

## Development Workflow

To work with this template, follow these steps:

1. **Follow the README**: Use README.md for quick start of the template to set up development environment
2. **Run the Development Server**: Use docker or run `pnpm run dev` to start the development server.
   - If using Docker, run `docker compose up --build` to build the images and start the containers.
   - If running locally, ensure your local DB is running and configured in `.env`.
3. **Access the Admin Panel**: Navigate to `http://localhost:8890/admin` to manage your content, first time you access the admin panel, you will need to create an admin user.
   - Use the credentials you set in your `.env` file for easy credentials management.
4. **Configure Payload**: Update `src/payload.config.ts` to add or modify collections, globals, additionally add necessary branding like logos, icons, etc.
   - For more information a link to the official Payload documentation is provided in the root section of this document.
5. **Setup Tailwind**: Use `tailwind.config.mjs` to customize the theme settings like typography, custom styles and more. For color management, it is recommended to change the global.css variable values to serve your needs instead of creating new ones in the Tailwind config. This allows for quicker theme changes without having to update the styles in all the components.
6. **Develop Components**: Create or modify components in `src/website/components` or `src/cms/components` as needed.
   - In regard to cms/components, refer to src/cms section in this document before making changes.
7. **Develop Blocks**: Edit or add new blocks in `src/website/blocks` to match the needs of the application.
8. **Test Changes**: Use the development server to test changes in real-time.
9. **Remove unused code**: As this is a template, you will likely want to remove unused code and components that are not relevant to your project. This can include unused blocks, components, or even entire collections in Payload.
10. **Build for Production**: When ready, use docker or run `pnpm run build` to build the application for production.

## Theming & Personalization

The template comes with a default light/dark theme setup that can be easily customized. The theming is handled using CSS variables defined in `src/providers/Theme/InitTheme/defaultTheme.ts` and applied globally via `src/providers/Theme/InitTheme/InitTheme.tsx`.
You can personalize the template by modifying logos and colors in the Admin dashboard - There is a global "Branding" singleton that allows you to upload logos and favicons for light and dark mode. The theme tab allows you to change all the colors used in the template.

For more granular control, you can modify the CSS variables in `src/providers/Theme/InitTheme/defaultTheme.ts` to change the color scheme. The palette names are purposely kept non-descriptive and will apply globally.
Remove any unused colors in the theme file to keep it clean.
The components and layout-blocks come with support for different color themes. You should update the labels and values in their config.ts or component.tsx files in accordance with your design requirements. These can be found in the `src/website/blocks/yourblock/` directory for layout blocks and `src/website/components/component.tsx` file for individual components.
