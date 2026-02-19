# Template Structure Overview

This document explains the high-level folder layout and responsibility boundaries for the Kollab payloadCMS template. It is designed to introduce you to the template's structure and how the different parts interact with each other.

For each section, we will outline the key components and their responsibilities and provide a short explanation and/or [Official Payload Documentation](https://payloadcms.com/docs/getting-started/concepts).

## TABLE OF CONTENTS

- [Root](#root)
- [src/website](#srcwebsite)
- [src/cms](#srccms)
- [src/app](#srcapp)
- [Localization & Translations](#localization--translations)
- [Analytics & Privacy](#analytics--privacy)
- [Search & Discovery](#search--discovery)
- [Breadcrumbs & Navigation](#breadcrumbs--navigation)
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
- SearchBlock (`src/website/blocks/SearchBlock/Component.tsx`) - Search input block that links to a page with SearchHero - allows users to search from any page. See [Search & Discovery](#search--discovery)

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
    - SearchHero (`src/website/layout/heros/SearchHero/index.tsx`) - See [Search & Discovery](#search--discovery) section

### src/website/components

Reusable components that can be used across blocks and layout sections. These components use the components from the elements directory as their building blocks to create the fully fledged components that apply the design needs of the application.

- **Breadcrumbs** (`src/website/components/Breadcrumbs/index.tsx`) - Automatic breadcrumb navigation component that builds hierarchical page paths. See [Breadcrumbs & Navigation](#breadcrumbs--navigation) section for details.

- **Card** (`src/website/components/Card/CustomCard.tsx`) - A card component for where you can add custom content, used in CardBlock or Carousel, this component is build from the elements card.tsx with a specific design and layout, it also contains variants for different looks, this component should be used when you need a card in a Block. It has the ability to link to internal or external links like posts or pages, but unlike PostCard you have to specify the content manually. If variants go beyond color changes, consider creating a new component instead of adding more complexity to this one.

- **Card** (`src/website/components/Card/PostCard.tsx`) - A card component specifically for displaying posts, it also uses card.tsx, but its content is generated from the posts SEO fields. It is used in the ArchiveBlock and Search results.

- **CollectionArchive** (`src/website/components/CollectionArchive/index.tsx`) - A component that fetches and displays a list of items from a specified Payload collection. It supports pagination and is used in the ArchiveBlock to display posts or other collection items, think of it as the layout component for PostCard.

- **Link** (`src/website/components/Link/index.tsx`) - A versatile link component that intelligently handles both internal and external links. It supports various appearances such as 'button', 'link' 'icon', allowing for consistent styling across the application. This is the component you use whenever you need a link/Button in a block or layout section most of the time, it is build with the link field in mind, allowing for easy implementation.

- **Search** (`src/website/components/Search/`) - Search components including SearchShell, SearchPosts, and SearchPeople for flexible search functionality. See [Search & Discovery](#search--discovery) section.

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
    - ConsentTokens (`src/cms/collections/ConsentTokens.ts`) - Stores user consent preferences for analytics and GDPR compliance. See [Analytics & Privacy](#analytics--privacy).
    - AnalyticsAggregates (`src/cms/collections/AnalyticsAggregates.ts`) - Aggregated analytics data storage for privacy-first tracking.
- **components/**
  - `/src/cms/components` contains shared data-type and UI pieces for the admin panel (like live preview, admin bar). Because they model your content layer, changes here can have wide-ranging side effects—only modify if you know the impact.
- **fields/**  
  Custom field definitions (e.g., `src/cms/fields/linkGroup.ts`, `defaultLexical.ts`). The custom fields we use in configs to allow for the correct data to be sent to the components. These are reusable field definitions that can be used across multiple collections or blocks.
- **plugins/**  
  Payload plugins setup (`src/cms/plugins/index.ts`). - Plugins can be either from payloadCMS itself, custom or third-party extensions - they extend the functionality of PayloadCMS.
  - Notable plugins:
    - `redirectsPlugin` - Manages URL redirects, used for breadcrumb parent path customization
    - `nestedDocsPlugin` - Enables page nesting and automatic breadcrumb generation
    - `seoPlugin` - SEO metadata management
    - `formBuilderPlugin` - Dynamic form creation
    - `searchPlugin` - Powers the search functionality
- **utilities/**  
  Helpers (e.g., `src/cms/utilities/getURL.ts`, `ui.ts`). Utility functions that assist with various tasks across the codebase. Such as URL generation, UI helpers, etc.
  - Notable utilities:
    - `analytics-server.ts` - Client-side tracking functions
    - `analytics-allowlist.ts` - Server-side event data validation
    - `consent-cookie.ts` - First-party consent cookie management
    - `getRedirects.ts` - Cached redirects fetching for breadcrumbs
- **endpoints/**  
  API endpoints for the admin panel (`src/cms/endpoints/...`). Here the API endpoints are defined for the admin panel, allowing for custom data fetching and manipulation. If you for example need to seed the database with initial data, you would create an endpoint here to handle that logic. We have one endpoint here that gives us an initial home page for when the CMS is first installed.
- **globals/**
  - `Branding` (`src/cms/endpoints/globals/Branding.ts`) - This is where the logic for the branding global is handled. It is used to customize Logos and Favicons both in light and dark mode.
  - `AnalyticsConfig` (`src/cms/globals/AnalyticsConfig/`) - Admin UI configuration for enabling/disabling analytics tracking services.
- **jobs/**
  - `analytics-tasks.ts` - Payload native tasks for analytics aggregation and third-party forwarding (GA4, Matomo)
  - `analytics-workflow.ts` - Workflow combining analytics tasks with retry logic
  - `cleanup-task.ts` & `cleanup-workflow.ts` - Automated job cleanup workflows

- **access/**  
  Centralized access control rules (like `src/cms/access/authenticated.ts`). Defines who and where can access different parts of the Application both public and CMS. [DOCS](https://payloadcms.com/docs/authentication/overview). - Payload comes with a lot of built-in authentication and access control logic, so you can easily set up a secure application powered by the local API. - consider using a third-party auth service if you need more advanced stuff like social login, SSO etc Plugins like PayloadAuth uses next-auth out of the box for example.
- **hooks/**
  React hooks for common functionality:
  - `useAnalytics.ts` - Hooks for tracking page views, button clicks, and component impressions

### - providers/

Providers provide the specified logic for the application. This is where the logic for dark mode is handled - you would also add an auth provider here if you were to use a third-party auth service or need client-side auth handling.

- **Privacy** (`src/providers/Privacy/`) - Privacy context and consent banner component for GDPR-compliant analytics opt-in. See [Analytics & Privacy](#analytics--privacy).

## src/app

Next.js App Router — handles routing, WARNING! Except for the global.css/custom.css files, it should not be modified unless you know what you're doing.

- **(frontend)/**  
  Public routes and data fetching (`src/app/(frontend)/[locale]/[slug]/page.tsx`, posts).
  Also includes the global.css file for the public site.
  - Now uses `[locale]` dynamic segment for internationalization routing
  - Page view tracking is implemented in `page.client.tsx` files
- **(payload)/**  
  Admin panel routes and import map (`src/app/(payload)/admin/importMap.js`, API endpoints).
  You can override the default Payload admin panel. For example, if you wanted to add a custom css styles to the admin panel, you would do that in custom.css here. You can also add custom pages to the admin panel if needed.
- **api/**
  - `analytics/route.ts` - POST endpoint for analytics event collection with consent verification and rate limiting
  - `consent/route.ts` - POST endpoint for managing user consent preferences
  - `cron/cleanup-jobs/route.ts` - Cron endpoint for cleaning up completed analytics jobs

## Localization & Translations

The template comes with a comprehensive multi-language setup using **PayloadCMS localization** for backend content and **next-intl** for frontend internationalization, integrated via a proxy middleware.

### Key Features

- **Default locale**: Danish (`da`) with English (`en`) as additional locale
- **URL strategy**: "as-needed" - default locale served at `/`, non-default locales prefixed (e.g., `/en/about`)
- **Fallback logic**: English falls back to Danish when content is missing
- **Cookie-based preference**: User's locale preference is remembered across sessions via `NEXT_LOCALE` cookie
- **Opt-in feature**: Language switcher can be toggled on/off from the dashboard - if disabled, site behaves as single-locale

### Architecture

1. **PayloadCMS Backend** (`src/payload.config.ts`):
   - Content localization with fallback support
   - Admin UI translations for both Danish and English
   - All collections support localized fields

2. **Next-intl Frontend** (`src/i18n/`):
   - `localization.ts` - Central locale configuration matching Payload
   - `routing.ts` - Next-intl routing with "as-needed" prefix mode
   - `request.ts` - Message loader for UI translations
   - `messages/` - Translation JSON files for UI strings

3. **Middleware Proxy** (`src/proxy.ts`):
   - Detects locale from URL prefix or `NEXT_LOCALE` cookie
   - Redirects unprefixed paths to appropriate locale
   - Seamlessly integrates Payload and next-intl routing

### How to Use

**Adding translations to content:**

- In Payload admin, use the locale selector (top-right) to switch languages
- Fill in localized fields for each language
- Missing translations automatically fall back to default locale

**Adding UI translations:**

```tsx
import { useTranslations } from 'next-intl'

const t = useTranslations()
return <h1>{t('welcome')}</h1>
```

**Don't want localization?**

- Simply turn off the language switcher in the Header global settings
- The site will work as single-locale (Danish default)
- DO NOT remove localization config - it's required for routing

**Adding a new language:**

- Update `src/i18n/localization.ts` with new locale
- Update `src/payload.config.ts` with new locale
- Add translation files in `src/i18n/messages/[locale].json`
- Restart the application

For detailed documentation, see [`docs/LOCALIZATION.md`](docs/LOCALIZATION.md).

## Analytics & Privacy

The template includes a **GDPR-compliant, privacy-first analytics system** with server-side aggregation, consent management, and optional third-party forwarding (GA4, Matomo).

### Key Features

- **First-party consent cookies** - No third-party tracking without permission
- **Server-side aggregation** - No PII stored, events processed on your server
- **Dual consent mechanism** - Secure token (DB) + fast cookie (client)
- **Async job processing** - Payload native jobs with automatic retries
- **Privacy banner** - GDPR-compliant opt-in with customizable content
- **Rate limiting** - Per-token and per-IP protection against abuse
- **Security headers** - Origin allowlist and request validation
- **Dual tracking** - Local aggregates + optional GA4/Matomo forwarding

### Architecture

**Consent Token System:**

The system uses TWO mechanisms for consent verification:

1. **Consent Token** (`consent_token` cookie - HttpOnly):
   - Server-side verification, cannot be manipulated by user
   - Stored in `consent-tokens` collection
   - Used as GA4 `client_id` for user identification
   - Provides audit trail for GDPR compliance

2. **Consent Cookie** (`analytics_consent` - Client-readable):
   - Fast, synchronous consent check in browser
   - Blocks tracking immediately if consent not given
   - Performance optimization to avoid unnecessary API calls

**Data Flow:**

```
1. User accepts consent in privacy banner
   ↓
2. Client tracks event with track() function
   ↓
3. Quick check: analytics_consent cookie exists?
   ↓
4. Send to /api/analytics with consent_token
   ↓
5. Server validates: origin allowlist, consent in DB, rate limits
   ↓
6. Queue Payload job with event data
   ↓
7. Job runs every 5 min: aggregate + forward to GA4/Matomo
```

### Key Files

- `src/providers/Privacy/` - Privacy context and consent banner UI
- `src/cms/utilities/analytics-server.ts` - Client-side tracking functions
- `src/cms/utilities/consent-cookie.ts` - Consent cookie management
- `src/cms/hooks/useAnalytics.ts` - React hooks for tracking
- `src/app/api/analytics/route.ts` - Analytics collection endpoint
- `src/app/api/consent/route.ts` - Consent management endpoint
- `src/cms/jobs/` - Analytics tasks, workflows, and cleanup jobs
- `src/cms/collections/ConsentTokens.ts` - Consent token storage
- `src/cms/collections/AnalyticsAggregates.ts` - Aggregated analytics data
- `src/cms/globals/AnalyticsConfig/` - Admin UI for enabling/disabling GA4/Matomo

### How to Use

**Track page views (automatic):**
Already implemented in `page.client.tsx` files.

**Track button clicks:**

```tsx
import { trackButtonClick } from '@/cms/utilities/analytics-server'
;<button onClick={() => trackButtonClick('Sign Up', 'Hero Section', '/signup')}>Sign Up</button>
```

**Track with hooks:**

```tsx
import { useTrackClick, useTrackImpression } from '@/cms/hooks/useAnalytics'

const trackClick = useTrackClick('CTA Button', 'Pricing Section')
const impressionRef = useTrackImpression('Hero Banner', 'hero')

<button onClick={() => trackClick('/contact')}>Contact</button>
<div ref={impressionRef}>Hero content</div>
```

**Enable GA4/Matomo:**

- Go to Payload admin → Globals → Analytics Config
- Enable desired tracking services
- Add your measurement IDs
- Events will automatically forward after aggregation

**Privacy Policy Requirements:**

- Link privacy policy from consent banner (default configured)
- Describe what data is collected (anonymous analytics events)
- List third-party services if enabled (GA4, Matomo)
- Explain consent withdrawal process

**Replace Custom privacy banner with thirdparty CMP (Example for Cookiebot)**

- Replace the code in `PrivacyBanner/index.tsx` with Cookiebot <Script/> and values
- Add so on Cookiebot consent change, call existing /api/consent with mapped analytics boolean.
- Remove cookie-consent translation strings and footer cookie link.

For detailed implementation guide, see [`docs/ANALYTICS_IMPLEMENTATION_GUIDE.md`](docs/ANALYTICS_IMPLEMENTATION_GUIDE.md) and [`docs/ANALYTICS_OVERVIEW.md`](docs/ANALYTICS_OVERVIEW.md).

## Search & Discovery

The template features a **flexible search system** that's no longer tied to a hardcoded route. Search is now implemented as a **SearchHero** that can be added to any page, with optional **SearchBlock** components that link to it from other pages.

### Key Features

- **SearchHero** - A hero variant that displays search input + results on any page
- **SearchBlock** - A search input block that can be placed anywhere and links to a SearchHero page
- **Collection flexibility** - Search Posts, People, or other collections
- **Live search mode** - Search on the same page or redirect to search results page
- **Category filtering** - Filter posts by categories
- **Customizable empty states** - Define custom "no results" messages

### Architecture

**SearchHero** (`src/website/layout/heros/SearchHero/index.tsx`):

- A hero type you select when creating/editing a page
- Includes search input + results display on the same page
- Configure which collection to search (`posts` or `people`)
- Set results per page, filter by categories, customize empty text
- Two path modes:
  - **Current** - Search happens on this page (live search)
  - **Select** - Results appear on a different page (redirect search)

**SearchBlock** (`src/website/blocks/SearchBlock/`):

- A block you can add to any page's layout
- Displays a search input with title and description
- Configure which page contains the SearchHero (via relationship field)
- When user searches, they're redirected to that SearchHero page

**Search Components** (`src/website/components/Search/`):

- `SearchShell` - The search input UI component
- `SearchPosts` - Fetches and displays post results with PostCard
- `SearchPeople` - Fetches and displays people results
- `resolveSearchPath` - Utility to determine search result URL

### How to Use

**Create a search page:**

1. Create a new page in Payload admin
2. Choose "Search Hero" as the hero type
3. Configure:
   - Add rich text description (optional)
   - Select search path mode: "Current" (live search on this page)
   - Choose collection: Posts or People
   - Set results per page: e.g., 12
   - If searching posts, optionally filter by categories
   - Add custom "no results" text
4. Add additional blocks below (content, CTAs, etc.) - they'll appear below results
5. Publish the page (e.g., at `/search`)

**Add search input on another page:**

1. Edit any page (e.g., homepage)
2. Add a "Search Input" block
3. Configure:
   - Title: "Search our content"
   - Description: Optional helper text
   - Search Page: Select the page with SearchHero (e.g., `/search`)
4. Save - users can now search from this page and see results on the SearchHero page

**Example use cases:**

- Dedicated `/search` page with SearchHero
- Homepage search block that links to `/search`
- `/cases` page with SearchHero filtering case posts by category
- `/team` page with SearchHero searching people collection

**Old hardcoded /search route:**
The old Search layout component has been deprecated. All search functionality now uses SearchHero for maximum flexibility.

## Breadcrumbs & Navigation

The template includes **automatic breadcrumb generation** using the `nestedDocsPlugin`, making hierarchical navigation seamless and customizable.

### Key Features

- **Automatic breadcrumbs** - Generated from page hierarchy
- **Page nesting** - Pages can have parent pages, creating multi-level breadcrumbs
- **Post breadcrumbs** - Posts show breadcrumbs pointing to `/posts` by default
- **Redirect-based customization** - Use the Redirects collection to change the parent route for all posts
- **Manual override** - Option to manually define breadcrumbs in the admin UI

### How It Works

**Page Breadcrumbs:**

When you create a page in Payload:

- Leave parent empty → No breadcrumbs (top-level page)
- Set a parent page → Breadcrumbs automatically show: `Parent Page / Page Title`
- Nest multiple levels → `Grandparent / Parent / Page Title`

The `nestedDocsPlugin` in `src/cms/plugins/index.ts` handles this automatically:

```typescript
nestedDocsPlugin({
  collections: ['categories', 'pages'],
  parentFieldSlug: 'parent',
  breadcrumbsFieldSlug: 'breadcrumbs',
  generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
})
```

**Post Breadcrumbs:**

By default, all posts show: `Posts / Post Title`

**To customize the parent route for all posts:**

1. Go to Payload admin → Redirects
2. Create a new redirect:
   - From: `/posts` (the default parent path)
   - To: Select a page (e.g., "Cases" page) or enter a custom URL
3. Save the redirect

Now all post breadcrumbs will show: `Cases / Post Title` (or your custom parent)

This works through the `getPostsParentCrumb` function in `src/website/components/Breadcrumbs/index.tsx`, which checks the redirects collection for `/posts` and uses that destination as the parent.

**Manual Breadcrumbs:**

Pages have a `breadcrumbs` field where you can manually override the automatic breadcrumbs:

- Add custom labels
- Link to specific pages or custom URLs
- Useful for complex navigation that doesn't follow strict hierarchy

### Component

The `Breadcrumbs` component (`src/website/components/Breadcrumbs/index.tsx`) is already integrated into page and post templates. It automatically:

- Fetches parent pages for nested pages
- Checks redirects collection for post parent customization
- Renders structured breadcrumb navigation with proper schema
- Shows current page as non-clickable, parents as clickable links

### How to Use

**For pages:**

- Edit any page → Set "Parent" field to another page
- Breadcrumbs automatically appear: `Parent / Current Page`

**For posts:**

- Create redirect: From `/posts` → To your desired parent
- All post breadcrumbs update automatically

**Manual override:**

- Edit page → Scroll to "Breadcrumbs" field (array)
- Add custom breadcrumb items with labels and URLs

**In code:**

```tsx
import { Breadcrumbs } from '@/website/components/Breadcrumbs'

// Automatic breadcrumbs from page data
<Breadcrumbs page={page} />

// For posts with custom parent
<Breadcrumbs
  post={post}
  postsParentPath="/cases"
  postsParentLabel="Cases"
/>

// Manual breadcrumbs
<Breadcrumbs items={[
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' },
  { label: 'Team' }
]} />
```

The breadcrumbs automatically integrate with the `redirectsPlugin` to provide flexible, dashboard-configurable navigation hierarchies without code changes.

## How It Fits Together

1. **Payload** serves content via its local API configured in `src/payload.config.ts`, with localization support for multi-language content.
2. **Next.js App Router** (`src/app`) fetches and correctly routes our app with locale-based paths (`/[locale]/...`) and powers the navigation.
3. **Middleware** (`src/proxy.ts`) handles locale detection from cookies and redirects, seamlessly integrating Payload and next-intl routing.
4. **Page.tsx** files in `src/app/(frontend)/[locale]/[slug]/page.tsx` serve as the entry point for rendering pages. They fetch the relevant page data from Payload based on the URL slug and locale.
5. **RenderHero** + **RenderBlocks** in `src/website` render the public site components. Content fetched by Next.js and defined in Payload is sent to the client, including SearchHero for flexible search pages.
6. **Breadcrumbs** are automatically generated for nested pages and posts using the `nestedDocsPlugin` and `redirectsPlugin`.
7. **Analytics tracking** happens client-side via `analytics-server.ts`, events are sent to `/api/analytics`, validated server-side, and processed via Payload jobs.
8. **PrivacyProvider** in `src/providers/Privacy` manages consent state and displays the privacy banner for GDPR compliance.
9. **ThemeProvider** in `src/providers/Theme` manages light/dark mode and theme persistence.
10. **CMS UI** (`src/cms`) powers the admin panel, live previews, and analytics configuration.

This separation keeps the public site components (`src/website`) distinct from CMS logic (`src/cms`) and routing (`src/app`), while new features like localization, analytics, search, and breadcrumbs integrate seamlessly across all layers.

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

8. **Configure Localization**: If you need additional languages beyond Danish and English:
   - Update `src/i18n/localization.ts` and `src/payload.config.ts` with new locales
   - Add translation files in `src/i18n/messages/[locale].json`
   - Toggle the language switcher on/off from Header global settings
   - See [Localization & Translations](#localization--translations) section for details

9. **Setup Analytics**: The analytics system is pre-configured but opt-in:
   - Privacy banner appears automatically on first visit
   - Enable GA4/Matomo from Payload admin → Globals → Analytics Config
   - Track custom events using hooks in `src/cms/hooks/useAnalytics.ts`
   - Configure trusted origins in `.env` (`ANALYTICS_TRUSTED_ORIGINS`)
   - See [Analytics & Privacy](#analytics--privacy) section for implementation details

10. **Create Search Pages**: Use the flexible SearchHero system:
    - Add SearchHero to any page for search functionality
    - Choose collection (posts, people) and configure filters
    - Add SearchBlock on other pages to link to your search page
    - See [Search & Discovery](#search--discovery) section for usage

11. **Test Changes**: Use the development server to test changes in real-time.
    - Breadcrumbs will automatically appear for nested pages and posts
    - Analytics events can be monitored in Payload admin → Collections → Analytics Aggregates
    - Test locale switching if language switcher is enabled

12. **Remove unused code**: As this is a template, you will likely want to remove unused code and components that are not relevant to your project. This can include unused blocks, components, or even entire collections in Payload.
    - If not using analytics, you can remove analytics-related collections, jobs, and API routes
    - If staying single-language, keep localization config but disable the language switcher

13. **Build for Production**: When ready, use docker or run `yarn run build` to build the application for production.

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

1. **Migrations**: When we are developing the application payload uses drizzles ORM with Push = true under the hood to automatically update the Postgress database schema. This is not recommended for production. In production, you should use migrations to manage database schema changes. This allows for better control and rollback capabilities. Payloads CLI has built in migration support, you use the commands `yarn migrate:create` to create a new migration and `yarn migrate` to run the migrations. It goes without saying that you preferably should not create the migrations on production, but create the migrations locally and push them up. The docker build then runs the migrations on startup.
   Recommendation is to test your migrations in a staging environment before adding them in production. [DOCS](https://payloadcms.com/docs/database/migrations)

2. **Maintenance**: Regularly check and update dependencies to keep your application secure and performant. This includes both frontend and backend packages. Payload upgrades are thankfully very simple as they are just dependency updates, but make sure to check release notes on their github and make sure the other dependencies you are using are compatible with the new version. Additionally, monitor your application for any performance issues or errors.

3. **Docker**: This template is designed to be used with Docker for deployment and development, make sure your Dockerfiles are optimized for production. Apply pipelines and other best practices in accordance with client or organizational standards.

4. **Environment Variables**: Double-check your environment variables for production. This includes API keys, database URLs, and any other sensitive information.

5. **Cookies & GDPR**: The template now includes a **built-in GDPR-compliant analytics system** with:
   - Privacy banner with opt-in consent (see `src/providers/Privacy/`)
   - First-party consent cookies (`consent_token` and `analytics_consent`)
   - Server-side validation and aggregation
   - No PII storage, rate limiting, and security headers
   - You still need to provide a privacy policy page (link it from the banner)
   - Additional third-party cookie consent tools can be integrated if needed
   - See [Analytics & Privacy](#analytics--privacy) section for full details

6. **Backup & Recovery**: Implement a backup and recovery plan for your database and any other critical data. This will help you recover quickly in case of a failure.

By taking these steps, you can ensure a smooth deployment process and a stable production environment.
