# Server-Side Analytics Migration - Quick Start

Simple migration from client-side GTM/GA4 to server-side analytics with better GDPR compliance.

## What Changed

✅ **Same tracking API** - Your components don't need changes
✅ **Server validates consent** - GDPR-first approach
✅ **No PII stored** - URLs normalized, IPs anonymized
✅ **HttpOnly cookies** - More secure than localStorage
✅ **Aggregated data** - No individual user tracking

## Step 1: Add Collections to Payload Config

Edit `src/payload.config.ts`:

```typescript
// Add imports
import { ConsentTokens } from './cms/collections/ConsentTokens'
import { AnalyticsAggregates } from './cms/collections/AnalyticsAggregates'
import { AnalyticsConfig } from './cms/globals/AnalyticsConfig/config'

// In buildConfig:
export default buildConfig({
  collections: [
    // ... existing collections
    ConsentTokens,
    AnalyticsAggregates,
  ],
  globals: [
    // ... existing globals
    AnalyticsConfig,
  ],
  // ... rest of config
})
```

## Step 2: Generate Types & Create Migration

```bash
# Inside Docker container or locally
npm run generate:types
npm run migrate:create
```

This creates the new database tables.

## Step 3: Update Import in Your Components

**FIND & REPLACE across your codebase:**

```typescript
// OLD:
import { track, trackButtonClick, ... } from '@/cms/utilities/analytics'

// NEW:
import { track, trackButtonClick, ... } from '@/cms/utilities/analytics-server'
```

That's it! Your components keep working with the same API.

## Step 4: Remove Client-Side Analytics Components

You can delete or disable these files (no longer needed):

- `src/cms/components/Analytics/GoogleTagManager/index.tsx`
- `src/cms/components/Analytics/GoogleAnalytics/index.tsx`

Remove them from your layout if you were including them.

## Step 5: Configure Analytics (Optional)

Login to Payload admin → Globals → Analytics Config:

- ✅ Enable Analytics
- ✅ Store Aggregated Data (recommended)
- ✅ Anonymize IP to Country Only (GDPR-friendly)

### To use Matomo (recommended):

1. Add Matomo to `docker-compose.yml`:

```yaml
matomo:
  image: matomo:latest
  restart: unless-stopped
  ports:
    - "8080:80"
  environment:
    - MATOMO_DATABASE_HOST=postgres
    - MATOMO_DATABASE_DBNAME=matomo
    - MATOMO_DATABASE_USERNAME=${POSTGRES_USER}
    - MATOMO_DATABASE_PASSWORD=${POSTGRES_PASSWORD}
  depends_on:
    - postgres
  volumes:
    - matomo_data:/var/www/html

volumes:
  # ... existing volumes
  matomo_data:
```

2. Start Matomo: `docker compose up -d matomo`
3. Visit `http://localhost:8080` and complete setup
4. In Payload admin → Analytics Config:
   - ✅ Forward to Matomo
   - Matomo URL: `http://matomo`
   - Matomo Site ID: `1` (from setup)

### To use Google Analytics 4 (⚠️ GDPR risk):

1. Create GA4 property: https://analytics.google.com/
2. Get Measurement ID (G-XXXXXXXXXX)
3. Create API Secret: Admin → Data Streams → Measurement Protocol API secrets
4. In Payload admin → Analytics Config:
   - ✅ Forward to Google Analytics 4
   - Add Measurement ID
   - Add API Secret

**Note**: GA4 may not be fully GDPR-compliant due to US data transfers. Use Matomo if possible.

## Step 6: Test

1. Start your dev server: `npm run dev`
2. Open browser, you should see consent banner
3. Accept analytics
4. Click around, trigger events
5. Check Payload admin → Analytics → Aggregates
6. Check Matomo dashboard (if configured)

## How It Works

### Before (Client-Side)
```
Browser → GTM Scripts (50KB) → Google Servers
- PII may leak
- Ad blockers block it
- No control over data
```

### After (Server-Side)
```
Browser (2KB beacon)
  ↓
/api/consent (check consent FIRST)
  ↓
/api/analytics (sanitize PII)
  ↓
Postgres (aggregates only)
  ↓
Forward to Matomo/GA4 (optional)
```

## What's Different

### Consent Management

**Old**: Stored in localStorage (can be cleared, less secure)
**New**: HttpOnly cookie with server-side token lookup

### Data Storage

**Old**: Client sends everything to Google directly
**New**: Server aggregates data, no individual tracking

### URLs & IDs

**Old**: Full URLs with query params sent to GA
**New**: Normalized paths (`/products/[id]`), no query strings

### IP Addresses

**Old**: Google sees full IP
**New**: Converted to country code only, IP never stored

## Troubleshooting

### "Analytics consent not given" error

The server is correctly blocking events because user hasn't consented. This is correct behavior!

### Events not showing in Matomo/GA4

1. Check Payload admin → Globals → Analytics Config is enabled
2. Check provider is enabled and credentials are correct
3. Check browser console for errors
4. Check Docker logs: `docker compose logs -f payload`

### Consent banner keeps showing

Clear your cookies and refresh. The new system uses server-side cookies, not localStorage.

## Migration Checklist

- [ ] Add collections & globals to payload.config.ts
- [ ] Run `npm run generate:types`
- [ ] Run `npm run migrate:create` and apply migration
- [ ] Find & replace analytics imports in all components
- [ ] Remove old GTM/GA components
- [ ] Test consent banner
- [ ] Test event tracking
- [ ] Configure Matomo or GA4 (optional)
- [ ] Deploy to staging
- [ ] Test in production

## Benefits You Get

✅ **GDPR Compliant**: Consent checked server-side, PII stripped
✅ **Faster**: ~2KB client code vs ~100KB GTM/GA scripts
✅ **Ad-blocker Proof**: Server-side requests can't be blocked
✅ **Provider Flexibility**: Switch Matomo ↔ GA4 without code changes
✅ **Data Ownership**: Analytics data in your Postgres
✅ **Same API**: Components keep working unchanged

## Next Steps

- Set up automated data retention cleanup (optional)
- Add GDPR data export endpoint (optional)
- Configure Matomo for cookieless tracking (optional)
- Monitor aggregate data in Payload admin

---

**Need help?** Check the full migration plan in `SERVER_SIDE_ANALYTICS_MIGRATION.md`
