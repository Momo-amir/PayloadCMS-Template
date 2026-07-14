---
name: add-locale
description: Add a new language or new translation keys to kollab-payload-template, keeping Payload localization and next-intl in sync. Use when the user wants to add a locale (e.g. German), add/translate UI strings, or work with messages/*.json. See docs/LOCALIZATION.md for the full guide.
---

# Add a locale / translations

Localization is **two parallel systems** that must stay in sync:
- **Payload localization** — backend content (`src/i18n/localization.ts`). Default `da`, `en` falls back to `da`.
- **next-intl** — frontend UI strings (`src/i18n/routing.ts` + `src/i18n/messages/{code}.json`).
  `localePrefix: 'as-needed'` (default locale unprefixed).

The next-intl routing derives its locale list from the Payload `localization` config
(`localization.locales.map(l => l.code)`), so **add the locale in `localization.ts` first** and the
frontend list follows automatically.

> ⚠️ Never remove the localization config or the middleware in `src/proxy.ts` — it breaks the site.

## To add a new language (e.g. German `de`)

1. **`src/i18n/localization.ts`** — add `{ code: 'de', label: 'German', fallbackLocale: 'da' }` to
   `locales`. Keep `defaultLocale: 'da'`.
2. **Create `src/i18n/messages/de.json`** — copy the full key structure from `da.json` and translate
   every value. All message files must have the **same keys**.
3. **Regenerate types** (localized fields change the generated types):
   `yarn generate:types` (container).
4. **Production:** localization changes can alter the schema — run `yarn migrate:create` and commit
   artifacts. Dev auto-pushes.
5. If the language should be user-switchable, enable the switcher via the Header global toggle
   (`showLanguageSwitcher`) — see `docs/LOCALIZATION.md`.
6. Verify: visit `/` (da) and `/de/...`, confirm content + UI strings resolve and fallback works.

## To add / change UI translation keys

1. Add the key to **every** file in `src/i18n/messages/` (`da.json`, `en.json`, and any others).
2. Use **meaningful, namespaced keys** (`cookie-consent:accept`, not `btn1`).
3. Reference via next-intl's `useTranslations` / `getTranslations` in components.
4. Verify the string renders in all locales.

Keep translation files synced — a missing key in one locale is a bug. See `docs/LOCALIZATION.md`
for advanced topics (localized slugs are intentionally NOT implemented — slugs are shared across locales).
