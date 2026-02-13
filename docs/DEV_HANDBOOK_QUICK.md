# Developer Quick Reference

Fast orientation for new developers. This file is intentionally short: use it to find where to change things, then jump to detailed docs.

## Table of Contents

- [1) Start Here](#1-start-here)
- [2) Where Things Live](#2-where-things-live)
- [3) Change Guide (Most Common)](#3-change-guide-most-common)
- [4) Core Collections](#4-core-collections)
- [5) UI Building Blocks (One-Line Overview)](#5-ui-building-blocks-one-line-overview)
- [6) Useful Commands](#6-useful-commands)
- [7) Deep Docs](#7-deep-docs)

## 1) Start Here

```bash
cp .env.example .env
yarn install
docker compose up
# Admin: http://localhost:8890/admin
```

Required baseline content:
- Page with slug `home` (used as `/`)
- Privacy policy page at `/privatlivspolitik` (needed if consent/analytics is enabled)

## 2) Where Things Live

- `src/website/` Frontend UI (blocks, components, elements)
- `src/cms/` Payload config (collections, globals, fields, hooks)
- `src/app/` Next.js app/router
- `src/i18n/` Translations and locale config
- `public/assets/` Logos, favicon, static assets

## 3) Change Guide (Most Common)

### Content Model (CMS)
- Edit collections: `src/cms/collections/`
- Global settings: `src/cms/globals/`
- Shared fields: `src/cms/fields/`
- After schema changes:

```bash
yarn generate:types
```

### Page Builder Blocks
- Block files: `src/website/blocks/<BlockName>/`
- `config.ts` = admin fields
- `Component.tsx` = frontend rendering

### Reusable UI
- Global primitives: `src/website/components/elements/`
- Reusable components: `src/website/components/`

Impact shortcuts:
- `PostCard` affects post cards in archives/search/related
- `CustomCard` + `InfoCard` affect CardBlock cards
- `CMSLink` affects CMS-driven links/buttons
- `Media` affects image/video rendering globally

### Forms
- Actions config: `src/cms/forms/actions.ts`
- Form block UI: `src/website/blocks/Form/Component.tsx`
- Inputs: `src/website/components/elements/`
- Submissions: Admin -> Forms -> Submissions

Add a custom action:
1. Add action in `formActions`
2. Add handler in `formActionHandlers`

Add a custom field type:
1. Create field in `src/cms/fields/formBuilder/`
2. Register in `src/cms/plugins/index.ts`

### Styling / Brand
- Global styles + CSS variables: `src/app/(frontend)/globals.css`
- Logos/favicons: replace assets in `public/assets/`

### Localization
- Content translations: use locale selector in admin
- UI strings: `src/i18n/messages/da.json`, `src/i18n/messages/en.json`
- Full setup guide: `docs/LOCALIZATION.md`

### Breadcrumbs
- Pages: set `Parent` in page settings admin; breadcrumbs are generated automatically with nested hierarchy.
- Posts: default parent path is `/posts`; change breadcrumb parent by adding a redirect in Admin (from `/posts` to your desired parent page e.g `/cases`).

### Analytics
- Config in admin: Globals -> Analytics Config
- Consent banner links to `/privatlivspolitik`
- Impression tracking wrapper: `src/cms/components/Analytics/TrackImpression`
- Full guide: `docs/ANALYTICS_IMPLEMENTATION_GUIDE.md`

## 4) Core Collections

- `Pages` Page content and blocks
- `Posts` Articles/cases/blog entries
- `Categories` Post taxonomy/filtering
- `People` Team members/authors
- `Forms` Form definitions + submissions
- `Media` Images/video assets
- `Users` Admin users and roles

## 5) UI Building Blocks (One-Line Overview)

### Layouts (`src/website/layout/`)
- `Header` Site header layout with navigation, branding, and locale-aware/top-level controls.
- `Footer` Site footer layout with global links, legal/consent links, and contact/meta content.
- `heros` Page hero system (High/Medium/Low/Post/Search) used for top-of-page intro/context sections.
- `search` Search integration layout/config used for indexing and search behavior wiring.

### Blocks (`src/website/blocks/`)
- `ArchiveBlock` Shows a grid/list of posts with optional filters and limits. Uses: `CollectionArchive`, `RichText`, `ArchiveCategoryFilter`.
- `Banner` Renders a highlighted message banner (info/warning/success/error style content). Uses: `RichText`.
- `CallToAction` Displays CTA content with text and one or more links/buttons. Uses: `RichText`, `CMSLink`.
- `CardBlock` Renders a card grid for manual marketing/service/content cards. Uses: `CustomCard`, `InfoCard`, `RichText`.
- `CardCarousel` Renders cards in a horizontal carousel/slider layout. Uses: `CustomCard`, `InfoCard`, `RichText`, `button`.
- `Code` Displays formatted syntax-highlighted code content. Uses: block-local `Code` client renderer.
- `Columns` Splits rich content into multiple column layouts. Uses: `RichText`, `Media`.
- `Content` Standard rich-text content section with width/layout controls. Uses: `RichText`, `CMSLink`.
- `Form` Renders CMS-configured forms and handles form submission flow. Uses: `RichText`, `button`, form-builder field components.
- `MediaBlock` Displays an image or video with optional caption/context. Uses: `Media`, `RichText`.
- `PeopleArchive` Lists people entries (team/archive style) from the People collection. Uses: `PersonCard`, `RichText`.
- `PromoStrip` Displays a horizontal strip of short promotional value points. Uses: inline icon/text rendering.
- `RelatedPosts` Shows posts related to the current post with breadcrumbs. Uses: `PostCard`, `Breadcrumbs`.
- `RichTextBlock` Reusable rich-text + optional links block used in composed layouts. Uses: `RichText`, `CMSLink`.
- `SearchBlock` Provides a search input block that routes to a search results page. Uses: `layout/search` `Search`, `SearchShell` resolver.
- `TwoBlock` Two-column container that holds nested block content. Uses: nested block renderer (`renderChildField`), `Media`.
- `UserLogin` Public login block/form for user authentication flows. Uses: block-local UI.

### Components (`src/website/components/`)
- `Breadcrumbs` Builds and renders breadcrumb navigation for page hierarchy.
- `Card/CustomCard` Generic linked content card used in manual card layouts.
- `Card/InfoCard` Informational non-linked card variant for highlights/metadata.
- `Card/PersonCard` Person/team profile card for People listings.
- `Card/PostCard` Post/article preview card for archives and related content - uses SEO meta image and description.
- `CollectionArchive` Fetches and renders collection items in archive/grid form.
- `Link` Central CMS-aware link/button renderer (`CMSLink` behavior).
- `LocaleSwitcher` UI control for switching active site locale.
- `Media` Shared image/video renderer with project-wide media behavior.
- `PageRange` Displays current page range metadata for paginated lists.
- `Pagination` Pagination controls for navigating multi-page list results.
- `RichText` Renderer for CMS rich-text content.
- `Search/SearchPeople` People search results view.
- `Search/SearchPosts` Post search results view.
- `Search/SearchShell` Shared wrapper/orchestrator for search UI/results state.

### Elements (`src/website/components/elements/`)
- `Logo` Brand logo primitive for header/footer and shared brand spots.
- `button` Base button primitive used across component and block UIs variables live here.
- `card` Base card container primitive (layout/spacing/style wrapper).
- `checkbox` Base checkbox form control.
- `input` Base text-style input form control.
- `label` Base form label primitive.
- `pagination` Base UI primitives used by pagination controls.
- `phone-input` Phone input primitive with country code support.
- `select` Base select/dropdown form control.
- `textarea` Base multiline text input form control.

## 6) Useful Commands

```bash
# local dev
docker compose up
docker compose down

# payload workflows
yarn generate:types
yarn generate:importmap
yarn migrate:create
yarn payload migrate:status

# prod
yarn docker-prod:up-build # Build and start prod container
yarn docker-prod # Start prod container (after build)
```

## 7) Deep Docs

- Project overview: `OVERVIEW.md`
- Localization: `docs/LOCALIZATION.md`
- Analytics: `docs/ANALYTICS_IMPLEMENTATION_GUIDE.md`
- Payload docs: https://payloadcms.com/docs
