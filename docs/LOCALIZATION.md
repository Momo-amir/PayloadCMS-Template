# Localization Documentation

This project uses **PayloadCMS** for backend content localization and **next-intl** for frontend internationalization. The default locale is Danish (`da`), with English (`en`) as a fallback locale.
All projects built with this template have localization as an opt-in feature, meaning the language switcher in the header can be toggled on or off from the PayloadCMS admin dashboard. 

Don't want localization? Simply turn off the language switcher and the website will behave as a single-locale site. DO NOT remove the localization configuration or middleware as that will break the site and is not necessary. 

We this way allow the website owner to decide if/when they want to offer multiple languages down the line without any code changes.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [PayloadCMS Localization](#payloadcms-localization)
- [Next-intl Frontend Integration](#next-intl-frontend-integration)
- [Language Switcher Control](#language-switcher-control)
- [Adding a New Language](#adding-a-new-language)
- [Adding Translations](#adding-translations)
- [Usage Examples](#usage-examples)
- [File Structure](#file-structure)
- [Middleware Behavior](#middleware-behavior)
- [Localized Slugs (Advanced)](#localized-slugs-advanced)
- [Best Practices](#best-practices)
- [Common Issues](#common-issues)

## Overview

The project supports multiple languages with:
- **Default locale**: Danish (`da`)
- **Additional locales**: English (`en`)
- **URL strategy**: "as-needed" - default locale (`da`) served at `/`, non-default locales prefixed (e.g., `/en/about`)
- **Fallback**: English falls back to Danish when content is missing
- **Cookie-based preference**: User's locale preference is remembered across sessions

## Architecture

The localization system is split into two layers:

1. **PayloadCMS Backend**: Manages content in multiple languages within the CMS
2. **Next-intl Frontend**: Handles UI translations and routing for the Next.js app

## PayloadCMS Localization

### Configuration

PayloadCMS localization is configured in [src/payload.config.ts](../src/payload.config.ts):

```typescript
localization: {
  locales: [
    {
      code: 'da',
      label: 'Danish',
    },
    {
      code: 'en',
      label: 'English',
      fallbackLocale: 'da', // Falls back to Danish when English content is missing
    },
  ],
  defaultLocale: 'da',
  fallback: true,
  defaultLocalePublishOption: 'all',
}
```

### Admin Interface Translations

PayloadCMS admin interface is also localized in [src/payload.config.ts](../src/payload.config.ts):

```typescript
i18n: {
  supportedLanguages: { da, en },
  fallbackLanguage: 'en',
  translations: {
    da: {
      general: {
        noResults: 'Ingen {{label}} fundet. Enten findes der endnu ingen {{label}}, eller også matcher ingen af de filtre angivet ovenfor.',
      },
    },
  },
}
```

### Content Management

When creating or editing content in PayloadCMS:

1. Use the locale selector in the admin UI (top-right corner)
2. Switch between languages to add translations for each field
3. Localized fields will show a language indicator
4. If content is missing in a language, the fallback locale content is used

## Next-intl Frontend Integration

### Core Configuration

The main localization configuration is in [src/i18n/localization.ts](../src/i18n/localization.ts):

```typescript
const localization = {
  locales: [
    {
      code: 'da',
      label: 'Danish',
    },
    {
      code: 'en',
      label: 'English',
      fallbackLocale: 'da',
    },
  ],
  defaultLocale: 'da',
  fallback: true,
  defaultLocalePublishOption: 'all',
}
```

### Routing Configuration

Next-intl routing is configured in [src/i18n/routing.ts](../src/i18n/routing.ts):

```typescript
export const routing = defineRouting({
  locales: localization.locales.map((locale) => locale.code),
  defaultLocale: localization.defaultLocale,
  localePrefix: 'as-needed', // Default locale at '/', others at '/<locale>/...'
  localeDetection: false, // Manual cookie detection in middleware
})
```

### Request Configuration

Messages are loaded in [src/i18n/request.ts](../src/i18n/request.ts):

```typescript
export default getRequestConfig(async (params) => {
  const requestLocale = await params.requestLocale
  let locale = requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: messagesMap[locale as keyof typeof messagesMap] || da,
  }
})
```

## Language Switcher Control

The language switcher in the header can be toggled on or off from the PayloadCMS admin dashboard, making localization truly opt-in for this project.

### Enabling/Disabling the Language Switcher

1. Navigate to **Globals → Header** in the PayloadCMS admin
2. Toggle the **"Show Language Switcher"** checkbox
3. Save your changes

The language switcher will immediately appear or disappear from the header based on this setting.

### Configuration

The toggle is defined in [src/website/layout/Header/config.ts](../src/website/layout/Header/config.ts):

```typescript
{
  name: 'showLanguageSwitcher',
  type: 'checkbox',
  label: {
    en: 'Show Language Switcher',
    da: 'Vis sprogskifter',
  },
  defaultValue: true,
  admin: {
    description: {
      en: 'Toggle the language switcher in the header. Useful for controlling localization features.',
      da: 'Slå sprogskifteren til eller fra i headeren. Nyttigt til at styre lokaliseringsfunktioner.',
    },
  },
}
```

### Use Cases

- **Development**: Turn off when building a project that requires only one locale, without this toggled on there is no way for users to switch languages.
- **Launch**:  Website owner can enable it when/if they want to offer multiple languages down the line.


## Adding a New Language

To add a new language (e.g., German `de`):

### 1. Update Localization Configuration

Edit [src/i18n/localization.ts](../src/i18n/localization.ts):

```typescript
const localization = {
  locales: [
    {
      code: 'da',
      label: 'Danish',
    },
    {
      code: 'en',
      label: 'English',
      fallbackLocale: 'da',
    },
    {
      code: 'de',
      label: 'German',
      fallbackLocale: 'da', // or 'en'
    },
  ],
  defaultLocale: 'da',
  fallback: true,
  defaultLocalePublishOption: 'all', // All locales by default makes it so the dashboard behaves more like when no localization is enabled turn to "active" if its a priority to only publish to certain locales
}
```

### 2. Create Message File

Create [src/i18n/messages/de.json](../src/i18n/messages):

```json
{
  "date-published": "Veröffentlichungsdatum",
  "author": "Autor",
  "page-not-found": "Seite nicht gefunden",
  ...
}
```

### 3. Update Request Configuration

Edit [src/i18n/request.ts](../src/i18n/request.ts):

```typescript
import de from './messages/de.json'

const messagesMap = {
  da,
  en,
  de, // Add new language
}
```

### 4. Add PayloadCMS Admin Translations

Import the language in [src/payload.config.ts](../src/payload.config.ts):

```typescript
import { de } from '@payloadcms/translations/languages/de'

// Then in the config:
i18n: {
  supportedLanguages: { da, en, de },
  fallbackLanguage: 'en',
}
```

## Adding Translations

### Frontend UI Translations

Translation strings are stored in JSON files under [src/i18n/messages/](../src/i18n/messages):

**Danish** ([da.json](../src/i18n/messages/da.json)):
```json
{
  "date-published": "Udgivelsesdato",
  "author": "Forfatter",
  "page-not-found": "Siden blev ikke fundet"
}
```

**English** ([en.json](../src/i18n/messages/en.json)):
```json
{
  "date-published": "Date Published",
  "author": "Author",
  "page-not-found": "Page Not Found"
}
```

### Organizing Translation Keys

Use namespacing with colons for better organization:

```json
{
  "plugin-redirects:fromUrl": "From URL",
  "plugin-redirects:toUrlType": "To URL Type",
  "cookie-consent:title": "Cookie Preferences",
  "cookie-consent:accept": "Accept"
}
```

## Usage Examples

### Client Components

```tsx
'use client'
import { useTranslations } from 'next-intl'

export function MyComponent() {
  const t = useTranslations()
  
  return (
    <div>
      <h1>{t('page-not-found')}</h1>
      <p>{t('date-published')}: {date}</p>
    </div>
  )
}
```

### Server Components

```tsx
import { getTranslations } from 'next-intl/server'

export async function MyServerComponent() {
  const t = await getTranslations()
  
  return (
    <div>
      <h1>{t('page-not-found')}</h1>
    </div>
  )
}
```

### Localized Links

- The `Link` component from Payload is by default localized, you simply just have to give the new locale another label, and works even with Localized slugs.



## File Structure

```
src/
├── i18n/
│   ├── localization.ts         # Core locale configuration
│   ├── routing.ts              # Next-intl routing setup
│   ├── request.ts              # Request config for messages
│   └── messages/               # Translation files
│       ├── da.json             # Danish translations
│       └── en.json             # English translations
├── proxy.ts               # Locale detection middleware
├── payload.config.ts           # PayloadCMS localization config
└── app/
    └── (frontend)/
        └── [locale]/           # Dynamic locale route segment
            ├── layout.tsx      # Root layout with NextIntlClientProvider
            ├── page.tsx        # Home page
            └── [...]/          # Other pages
```

## Middleware Behavior

The middleware in [src/proxy.ts](../src/proxy.ts) handles locale routing:

### Current Strategy: Manual Cookie Detection

The current implementation uses **manual cookie detection** for that opt-in localization approach.

 - Middleware checks for a `NEXT_LOCALE` cookie to determine user preference, but initially serves the default locale no matter preferences on first visit.



**Behavior:**
- **Default locale (da)**: `example.com/about` → served as Danish - no prefix for default locales if you make EN the default same applies
- **Non-default locale (en)**: `example.com/en/about` → served as English
- **Cookie preference**: Users who visited `/en/about` will be redirected from `/about` to `/en/about` on subsequent visits

### Alternative Strategy: Automatic Locale Detection

For projects designed with **localization from the start**, a simpler approach using automatic detection is recommended:

#### Simplified Middleware

Replace [src/proxy.ts](../src/proxy.ts) with:

```typescript
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: '/((?!admin|api|trpc|_next|_vercel|.*\\..*).*)',
}
```

#### Updated Routing Configuration

Update [src/i18n/routing.ts](../src/i18n/routing.ts) to enable automatic detection:

```typescript
import { defineRouting } from 'next-intl/routing'
import localization from './localization'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: localization.locales.map((locale) => locale.code),
  defaultLocale: localization.defaultLocale,
  localePrefix: 'as-needed',
  // Enable automatic locale detection
  // This will detect locale from cookies and Accept-Language headers
  // Remove or set to true (default behavior)
})

export const { Link, redirect, usePathname } = createNavigation(routing)

export type Locale = (typeof routing.locales)[number]
```

**Key Differences:**

| Feature | Manual Detection (Current) | Automatic Detection |
|---------|---------------------------|---------------------|
| **Cookie handling** | Custom logic | Built-in by next-intl |
| **Accept-Language** | Not used | Automatically detected |
| **Redirect behavior** | Only for non-default with cookie | Detects and redirects based on browser settings |
| **Use case** | More control, mixed-language sites | Locale-first design, international audience |
| **Complexity** | More code | Minimal configuration |

**When to use Automatic Detection:**

 Website is designed for localization from the start  
 International audience with diverse language preferences  
 Want users to see content in their browser language automatically  
 Simpler maintenance and less custom code  

**When to use Manual Detection (Current):**

Primary audience uses default locale  
Localization is optional or secondary  
Want full control over when/if localization is applied  
Content is shipped in one language first, with localization added later

- Only around 5% of websites globally use multiple languages, most sites are primarily single-locale, just being able to offer localization as an opt-in feature is a big nice to have.

### Path Exclusions

The middleware does not run on:
- `/admin/*` - PayloadCMS admin routes
- `/api/*` - API routes
- `/_next/*` - Next.js internal routes
- Static files with extensions

```typescript
export const config = {
  matcher: '/((?!admin|api|trpc|_next|_vercel|.*\\..*).*)',
}
```

## Best Practices

1. **Always add translations for all supported locales** to avoid fallback surprises
2. **Use meaningful translation keys** - prefer `cookie-consent:accept` over `btn1`
3. **Keep translation files synced** - ensure all keys exist in all language files
4. **Use namespacing** for grouping related translations
5. **Test in all locales** before deploying content changes
6. **Only enable the language switcher** when multiple languages are actually needed

## Localized Slugs (Advanced)

### Current Status

**Localized slugs are not currently implemented** in this project. The slug field is the same across all locales.
This simplifies routing and avoids complex redirect logic. This is default behavior since the added complexity is currently not worth it by default.

### Enabling Localized Slugs

To enable localized slugs in PayloadCMS collections, add `localized: true` to slug fields:

```typescript
// Example: src/cms/collections/Pages/index.ts
{
  name: 'slug',
  type: 'text',
  localized: true, // Enable per-locale slugs
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [formatSlug('title')],
  },
}
```

### Important Considerations

⚠️ **Localized slugs require custom redirect handling and route modifications:**

#### 1. Payload Redirects Plugin Limitation

The built-in `@payloadcms/plugin-redirects` does **not** handle localized slug redirects. You'll need custom logic to:
- Detect when a user visits a slug in the wrong locale
- Redirect to the correct localized version
- Handle cases where content exists in one locale but not another

#### 2. Dynamic Route Changes Required

When using localized slugs, your dynamic routes must be updated to handle the correct slug based on locale.

**Example**: Update your page route (e.g., `src/app/(frontend)/[locale]/[slug]/page.tsx`)

```typescript
// Before: Using the URL slug directly
const page = await payload.find({
  collection: 'pages',
  where: { slug: { equals: params.slug } },
  locale: params.locale,
})

// After: Query across all locales to find the page, then redirect if needed
const pages = await payload.find({
  collection: 'pages',
  where: { slug: { equals: params.slug } },
  locale: 'all', // Query all locales
})

if (pages.docs.length === 0) {
  notFound()
}

const page = pages.docs[0]

// Check if the current slug matches the locale-specific slug
if (page.slug[params.locale] && page.slug[params.locale] !== params.slug) {
  // Redirect to the correct localized slug
  redirect(`/${params.locale}/${page.slug[params.locale]}`)
}
```

This ensures:
- `/en/om-os` redirects to `/en/about-us`
- `/about-us` redirects to `/om-os` (default locale)
- Each locale displays its proper slug


### Workflow with Localized Slugs

1. **Create page** in default locale (da): slug is `/om-os` (About Us in Danish)
2. **Switch to English** in admin: slug becomes `/about-us`
3. **User visits** `/en/om-os`: dynamic route detects mismatch, redirects to `/en/about-us`
4. **User visits** `/about-us`: served as Danish content (default locale)
5. **Direct link** `/en/about-us`: works correctly without redirect

### Recommendation

**Implement localized slugs if:**
- Content is designed for localization from the start
- SEO requires native-language URLs (e.g., `/om-os` vs `/about-us`)


**Avoid localized slugs if:**
- Project is primarily single-locale with localization as nice bonus
- You want simpler maintenance (shared slugs work fine)


## Common Issues

### Translation key not found

If you see `[missing translation]` or similar:
1. Verify the key exists in the JSON file
2. Check spelling and casing
3. Restart the dev server

### Content not showing in new locale

1. Ensure the locale is added to `localization.ts`
2. Verify PayloadCMS has been restarted: `docker compose restart payload`
3. Check that types have been regenerated: `npm run generate:types`
4. Verify the collection has localization enabled


### Localized slug not working

1. Ensure `localized: true` is set on the slug field
2. Verify custom redirect logic is implemented
3. Check that the page exists in the requested locale
4. Test slug redirects in both locales

## Resources

- [Next-intl Documentation](https://next-intl-docs.vercel.app/)
- [PayloadCMS Localization](https://payloadcms.com/docs/configuration/localization)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Next-intl Routing](https://next-intl-docs.vercel.app/docs/routing)
