# Template Structure Overview

This document explains the high-level folder layout and responsibility boundaries for the Kollab payloadCMS template. It is designed to introduce you to the template's structure and how the different parts interact with each other.

For each section, we will outline the key components and their responsibilities and provide a short explanation and/or [Official Payload Documentation](https://payloadcms.com/docs/getting-started/concepts).

## TABLE OF CONTENTS

- [Root](#root)
- [src/website](#srcwebsite)
- [src/cms](#srccms)
- [src/app](#srcapp)
- [How It Fits Together](#how-it-fits-together)
- [Development Workflow](#development-workflow)
- [Theming & Personalization](#theming--personalization)
- [Getting ready for Production - Migrations, Maintenance & Docker in Production](#getting-ready-for-production---migrations-maintenance--docker-in-production)

## Root

- `package.json`, `tsconfig.json`
  Core config files for build, TypeScript settings, and dependencies.
- `src/payload.config.ts`  
  PayloadCMS' main configuration and collection/global definitions. [DOCS](https://payloadcms.com/docs/configuration/overview)
- `src/payload-types.ts`  
  Auto-generated TypeScript types for Payload.

- `.cli/`
  Custom CLI for generating blocks and components. Extremely useful for speeding up development and ensuring consistency.
- `Dockerfile`, `docker-compose.yml`  
  Docker setup for local development and production builds.
- `.env.example`  
  Example environment variables file.
- `README.md`  
  Quick start, setup instructions & CLI commands for Payloads own CLI and this templates custom CLI. Get familiar with it.
- `Public/`
  Static assets like images and fonts go here. In addition Media uploads from the CMS are stored here.

## src/website

Contains all **public-facing** React components and layout logic.

### src/website/blocks

Repeatable “layout builder” blocks you can drop into any page or post [DOCS](https://payloadcms.com/docs/fields/blocks). Some work as layout/structure sections with relations to other blocks and collections, others as content deliverers:

- ArchiveBlock (`src/website/blocks/ArchiveBlock/Component.tsx`) - Layout type with relations to Posts using the CollectionArchive component - this displays a list of posts in a card layout
- TwoBlock (`src/website/blocks/TwoBlock/Component.tsx`) - Layout type with two columns with relations to other blocks
- CallToActionBlock (`src/website/blocks/CallToAction/Component.tsx`) - Content type for a call to action
- CodeBlock (`src/website/blocks/CodeBlock/Component.tsx`) - Content type for displaying code snippets
- ContactBlock (`src/website/blocks/Contact/Component.tsx`) - Content type for a contact information component
- ContentBlock (`src/website/blocks/Content/Component.tsx`) - Content type for text content with rich text editor - supports different section sizes
- FormBlock (`src/website/blocks/Form/Component.tsx`) - Content type for forms that can be build and customized in the CMS
- MediaBlock (`src/website/blocks/MediaBlock/Component.tsx`) - Content type for media content

Each block has:

- A Payload block config (`src/website/blocks/.../config.ts`) - Defines the block's fields, relations and structure in Payload [DOCS](https://payloadcms.com/docs/fields/blocks#block-configs).
- A React component under `Component.tsx`

Optionally, some blocks may have:

- Field-specific subcomponents for example `Form/fields` can be used to handle all the relation logic to components or blocks. It is kind of bad naming, but it is what it is. Should be renamed.

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
  Hero components are used to display prominent content at the top of pages, such as banners or featured sections. They can vary in impact and design, allowing for different visual emphasis based on the content's importance. Keeping this as a single use per page layout-component rather than using a block, as it is a common design practice.
  - Hero configs: `src/website/layout/heros/config.ts`
  - Render logic: `src/website/layout/heros/RenderHero.tsx`
  - Variants:
    - HighImpact (`src/website/layout/heros/HighImpact/index.tsx`)
    - MediumImpact (`src/website/layout/heros/MediumImpact/index.tsx`)
    - LowImpact (`src/website/layout/heros/LowImpact/index.tsx`)
- **Search**
  Search layout automatically shows posts in a ArchiveBlock style and has a search input to filter posts by title or content. It is a single use layout-component as it is only used on the /search route.
  - Before Sync: `src/website/layout/Search/Component.tsx`
  - Component: `src/website/layout/Search/Component.client.tsx`
  - field Overrides: `src/website/layout/Search/fields.ts`

### src/website/components

Reusable components that can be used across blocks and layout sections. These components use the components from the elements directory as their building blocks to create the fully fledged components that apply the design needs of the application.

- **Card** (`src/website/components/Card/CustomCard.tsx`) - A card component for where you can add custom content, used in CardBlock or Carousel, this component is build from the elements card.tsx with a specific design and layout, it also contains variants for different looks, this component should be used when you need a card in a Block. It has the ability to link to internal or external links like posts or pages, but unlike PostCard you have to specify the content manually. If variants go beyond color changes, consider creating a new component instead of adding more complexity to this one.

- **Card** (`src/website/components/Card/PostCard.tsx`) - A card component specifically for displaying posts, it also uses card.tsx, but its content is generated from the posts SEO fields. It is used in the ArchiveBlock and Search results.

- **CollectionArchive** (`src/website/components/CollectionArchive/index.tsx`) - A component that fetches and displays a list of items from a specified Payload collection. It supports pagination and is used in the ArchiveBlock to display posts or other collection items, think of it as the layout component for PostCard.

- **Link** (`src/website/components/Link/index.tsx`) - A versatile link component that intelligently handles both internal and external links. It supports various appearances such as 'button', 'link' 'icon', allowing for consistent styling across the application. This is the component you use whenever you need a link/Button in a block or layout section most of the time, it is build with the link field in mind, allowing for easy implementation.

### src/website/components/elements

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
  - Noteable collections:
    - Pages (`src/cms/collections/Pages.ts`) - Core page content type with flexible blocks.
    - Posts (`src/cms/collections/Posts.ts`) - Blog post content type with SEO and author relations - would be used for stuff like cases, job listings, webinars etc etc.
    - Categories (`src/cms/collections/Categories.ts`) - Categories for organizing posts.
    - Forms (`src/cms/collections/Forms.ts`) - Form definitions for the FormBlock.
      - Define forms and submission logic from the dashboard.
    - Media (`src/cms/collections/Media.ts`) - Media library for images/files.
    - Users (`src/cms/collections/Users.ts`) - Users both CMS and public, with roles and permissions. Roles included are admin, editor, and user (user is for public site access).
- **components/**
  - `/src/cms/components` contains shared data-type and UI pieces for the admin panel (like live preview, admin bar). Because they model your content layer, changes here can have wide-ranging side effects—only modify if you know the impact.
- **fields/**  
  Custom field definitions (e.g., `src/cms/fields/linkGroup.ts`, `defaultLexical.ts`). The custom fields we use in configs to allow for the correct data to be sent to the components. These are reusable field definitions that can be used across multiple collections or blocks.
- **plugins/**  
  Payload plugins setup (`src/cms/plugins/index.ts`). - Plugins can be either from payloadCMS itself, custom or third-party extensions - they extend the functionality of PayloadCMS.
- **utilities/**  
  Helpers (e.g., `src/cms/utilities/getURL.ts`, `ui.ts`). Utility functions that assist with various tasks across the codebase. Such as URL generation, UI helpers, etc.
- **endpoints/**  
  API endpoints for the admin panel (`src/cms/endpoints/...`). Here the API endpoints are defined for the admin panel, allowing for custom data fetching and manipulation. If you for example need to seed the database with initial data, you would create an endpoint here to handle that logic. We have one endpoint here that gives us an initial home page for when the CMS is first installed.
- **globals/**
  - `Branding` (`src/cms/endpoints/globals/Branding.ts`) - This is where the logic for the branding global is handled. It is used to customize Logos and Favicons both in light and dark mode.

- **access/**  
  Centralized access control rules (like `src/cms/access/authenticated.ts`). Defines who and where can access different parts of the Application both public and CMS. [DOCS](https://payloadcms.com/docs/authentication/overview). - Payload comes with a lot of built-in authentication and access control logic, so you can easily set up a secure application powered by the local API. - consider using a third-party auth service if you need more advanced stuff like social login, SSO etc Plugins like PayloadAuth uses next-auth out of the box for example.

### - providers/

Providers provide the specified logic for the application. This is where the logic for dark mode is handled - you would also add an auth provider here if you were to use a third-party auth service or need client-side auth handling.

## src/app

Next.js App Router — handles routing, WARNING! Except for the global.css/custom.css files, it should not be modified unless you know what you're doing.

- **(frontend)/**  
  Public routes and data fetching (`src/app/(frontend)/[slug]/page.tsx`, search, posts).
  also includes the global.css file for the public site.
- **(payload)/**  
  Admin panel routes and import map (`src/app/(payload)/admin/importMap.js`, API endpoints).
  You can override the default Payload admin panel. For example, if you wanted to add a custom css styles to the admin panel, you would do. that in custom.css here. You can also add custom pages to the admin panel if needed.

## How It Fits Together

1. **Payload** serves content via its local API configured in `src/payload.config.ts`.
2. **Next.js App Router** (`src/app`) fetches and correctly routes our app and powers the navigation.
3. **Page.tsx** files in `src/app/(frontend)/[slug]/page.tsx` Technically, this is the entry point for rendering pages. It fetches the relevant page data from Payload based on the URL slug, and what we defined in the pages collection in the dashboard
4. **RenderHero** + **RenderBlocks** in `src/website` our public site components render, the content fetched by Next.js and defined in Payload will be sent to the client.
5. **ThemeProvider** in `src/providers/Theme` manages light/dark mode and theme persistence.
6. **CMS UI** (`src/cms`) powers the admin panel and live previews.

This separation keeps the public site components (`src/website`) distinct from CMS logic (`src/cms`) and routing (`src/app`).

## Development Workflow

To work with this template, follow these steps:

1. **Follow the README**: Use README.md for quick start of the template to set up development environment
2. **Run the Development Server**: Use docker or run `yarn run dev` to start the development server.
   - If using Docker, run `docker compose up` to build the images and start the containers.
   - If running locally, ensure your local DB is running and configured in `.env`.
   - NOTICE - Yarn is the package manager used in this template, make sure you have it installed globally. it can be installed via npm with `npm install -g yarn`. It is used since Docker has better support for it and it is generally faster than npm.
3. **Access the Admin Panel**: Navigate to `http://localhost:8890/admin` to manage your content, first time you access the admin panel, you will need to create an admin user.
   - Use the credentials you set in your `.env` file for easy credentials management.
4. **Configure Payload**: Update `src/payload.config.ts` to add or modify collections, globals, additionally add necessary branding like logos, icons, etc.
   - For more information a link to the official Payload documentation is provided in the root section of this document.
5. **Setup Tailwind**: Use `globals.css` to customize Tailwind theme settings like typography, custom styles and more. For color management, it is recommended to change the global.css variable values to serve your needs instead of creating new ones. This allows for quicker theme changes without having to update the styles in all the components.
6. **Develop Components**: Create or modify components in `src/website/components` or `src/website/components/elements` as needed.
   - In regard to cms/components, refer to src/cms section in this document before making changes.
7. **Develop Blocks**: Edit or add new blocks in `src/website/blocks` to match the needs of the application.

- NOTICE - We have a custom CLI command to generate Blocks, run yarn cli to see the options. This will create the necessary files and boilerplate for a new block, including adding it to the block map in `src/website/blocks/index.ts`.

8. **Test Changes**: Use the development server to test changes in real-time.
9. **Remove unused code**: As this is a template, you will likely want to remove unused code and components that are not relevant to your project. This can include unused blocks, components, or even entire collections in Payload.
10. **Build for Production**: When ready, use docker or run `yarn run build` to build the application for production.

## Theming & Personalization

The template comes with a default light/dark theme setup that can be easily customized. The theming is handled using CSS variables defined in `globals.css` and applied globally via initTheme before hydration.

Color should be changed in `src/app/(frontend)/globals.css` There are two sections, one for light theme and one for dark theme. Change the hex values to your desired colors, you should not need to change @theme section for colors, but you can add typography or spacing variables if needed. The tailwind config is set up to use these variables so you can use the tailwind classes like bg-primary, text-secondary etc.

You can personalize the template by modifying logos and colors in the Admin dashboard - There is a global "Branding" configuration that allows you to upload logos and favicons for light and dark mode

Logos are used in the header and footer layout sections, plus the admin dashboard login screen.
Favicons updates the websites side browser tab icon and dashboard icon - though if you want to change admin dashboard favicon you need to do that in Payload.config.ts.

if Dark-mode is not enabled, consider removing the dark mode logo field or use it for an alternative logo.

Remove any unused colors in the css file to keep it clean.
Some components and layout-blocks come with support for different color themes and have Variants by default like Card and Button, you can add the variants in the config for the block you want to use them in. The variants will be applied as Tailwind classes to the component.

If you don't need the dark mode functionality, you can remove the logic in `src/providers/Theme` and the toggle in the header component.

## Getting ready for Production - Migrations, Maintenance & Docker in Production

When you are ready to deploy your application to production, there are a few things you should consider:

1. **Migrations**: When we are developing the application payload uses drizzles ORM with Push = true under the hood to automatically update the Postgress database schema. This is not recommended for production. In production, you should use migrations to manage database schema changes. This allows for better control and rollback capabilities. Payloads CLI has built in migration support, you use the commands `yarn generate:migration` to create a new migration and `yarn migrate` to run the migrations. It goes without saying that you preferably should not run the migrations on production, but create the migrations locally and push them up.
   Recommendation is to test your migrations in a staging environment before adding them in production. [DOCS](https://payloadcms.com/docs/database/migrations)

2. **Maintenance**: Regularly check and update dependencies to keep your application secure and performant. This includes both frontend and backend packages. Payload upgrades are thankfully very simple as they are just dependency updates, but make sure to check release notes on their github and make sure the other dependencies you are using are compatible with the new version. Additionally, monitor your application for any performance issues or errors.

3. **Docker**: This template is designed to be used with Docker for deployment and development, make sure your Dockerfiles are optimized for production. Apply pipelines and other best practices in accordance with client or organizational standards.

4. **Environment Variables**: Double-check your environment variables for production. This includes API keys, database URLs, and any other sensitive information.

5. **Cookies & GDPR** PayloadCMS does not come with built in cookie consent or GDPR compliance features. A recommended approach is to use a third-party service like Piwik or other cookie consent management platforms. The template has on purpose not implemented any cookie consent logic, as it is very likely the client will have their own requirements and preferred service for this. If you need to implement a designed/custom styled component consider adding it for future use in the template styled to match the default template design.

6. **Backup & Recovery**: Implement a backup and recovery plan for your database and any other critical data. This will help you recover quickly in case of a failure.

By taking these steps, you can ensure a smooth deployment process and a stable production environment.
