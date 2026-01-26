# Server-Side Analytics - Implementation Summary

## What I Built

A **minimal, GDPR-first** server-side analytics system that:

✅ Keeps your current tracking API (no component changes needed)
✅ Validates consent server-side BEFORE processing events
✅ Strips all PII automatically
✅ Uses HttpOnly cookies (more secure)
✅ Stores aggregated data only (no individual tracking)
✅ Works with Matomo or GA4

## Files Created

### Collections & Globals
- `src/cms/collections/ConsentTokens.ts` - Stores user consent (pseudonymous)
- `src/cms/collections/AnalyticsAggregates.ts` - Stores aggregated events (no PII)
- `src/cms/globals/AnalyticsConfig/config.ts` - Admin panel configuration

### API Endpoints
- `src/app/api/analytics/route.ts` - Receives events, validates consent, sanitizes data
- `src/app/api/consent/route.ts` - Manages consent (GET/POST)

### Client Library
- `src/cms/utilities/analytics-server.ts` - Same API as before, sends to server instead

### Updates
- `src/payload.config.ts` - Added new collections & global
- `src/providers/Privacy/index.tsx` - Uses server-side consent now
- `src/cms/hooks/useAnalytics.ts` - Imports from analytics-server

### Documentation
- `docs/QUICK_START_SERVER_ANALYTICS.md` - Step-by-step migration guide

## How to Use

### 1. Generate types and migrate database

```bash
npm run generate:types
npm run migrate:create
# Apply the migration when prompted
```

### 2. Update your components (simple find & replace)

```typescript
// OLD:
import { track, trackButtonClick } from '@/cms/utilities/analytics'

// NEW:
import { track, trackButtonClick } from '@/cms/utilities/analytics-server'
```

All the same functions work: `trackButtonClick`, `trackCardClick`, `trackPostView`, etc.

### 3. Remove old client-side scripts (optional)

You can delete these if you're not using them:
- `src/cms/components/Analytics/GoogleTagManager/`
- `src/cms/components/Analytics/GoogleAnalytics/`

### 4. Configure in Payload Admin

Go to: **Globals → Analytics Config**

- ✅ Enable Analytics
- ✅ Store Aggregated Data
- ✅ Anonymize IP to Country Only

**For Matomo** (recommended, GDPR-friendly):
- Check "Forward to Matomo"
- Add your Matomo URL and Site ID

**For GA4** (⚠️ has GDPR concerns):
- Check "Forward to Google Analytics 4"
- Add Measurement ID and API Secret

### 5. Test

1. `npm run dev`
2. Accept consent banner
3. Click around your site
4. Check: **Collections → Analytics Aggregates**

## What Changed from Client-Side

| Aspect | Before (Client) | After (Server) |
|--------|----------------|----------------|
| **Consent** | localStorage | HttpOnly cookie + DB |
| **Validation** | Client-side (bypassable) | Server-side (enforced) |
| **PII** | May leak to Google | Stripped before storage |
| **IPs** | Full IP sent to GA | Country code only |
| **URLs** | Full URLs with params | Normalized (`/products/[id]`) |
| **Storage** | Only in GA | Your Postgres (aggregated) |
| **Size** | ~100KB GTM/GA scripts | ~2KB beacon |
| **Ad blockers** | Blocked (30% data loss) | Works (server-side) |

## GDPR Benefits

✅ **Consent-first**: Server checks consent BEFORE processing
✅ **Data minimization**: Only aggregates stored, no individual tracking
✅ **Purpose limitation**: Analytics data separate from user data
✅ **Right to erasure**: Can delete by consent token
✅ **Transparency**: You control what's sent to third parties
✅ **No PII**: Automatic stripping of emails, IDs, etc.

## Example: What Happens When User Clicks a Button

### Old (Client-Side)
```
1. Browser runs GTM script (~50KB loaded)
2. GTM collects full URL, IP, user agent, etc.
3. Sends directly to Google servers
4. You have no control over what Google does with it
```

### New (Server-Side)
```
1. Browser calls track('button_click', { button_name: 'Sign Up' })
2. Lightweight client batches event (~2KB total)
3. POST /api/analytics
4. Server checks: Does consent token exist? Is analytics enabled?
   → If NO: Reject with 403
   → If YES: Continue
5. Server sanitizes:
   - URL: /signup?ref=email → /signup
   - IP: 192.168.1.123 → country: 'DK'
   - Remove any email/name fields
6. Server stores aggregate: "button_click: +1 count for date=2026-01-26, country=DK"
7. Server forwards to Matomo/GA4 (if configured)
```

## Current vs. Server-Side API

**No changes needed!** All these still work:

```typescript
import { track, trackButtonClick, trackCardClick, trackPostView } from '@/cms/utilities/analytics-server'

// Same as before
trackButtonClick('Sign Up', 'Hero')
trackCardClick('Product Card', 'featured', '/products/123')
trackPostView('Blog Post Title', 'blog-post-slug', ['Tutorial'])
```

## Next Steps (Optional)

- Set up Matomo in Docker (see QUICK_START)
- Add automated data cleanup after 90 days
- Create analytics dashboard in Payload admin
- Configure cookieless Matomo tracking

## Questions?

Check `docs/QUICK_START_SERVER_ANALYTICS.md` for detailed setup instructions, or `docs/SERVER_SIDE_ANALYTICS_MIGRATION.md` for the full technical plan.

---

**Ready to migrate?** Follow the Quick Start guide!
