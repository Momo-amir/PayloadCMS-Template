# Analytics Implementation Guide

**Version**: 2.0 (Payload Jobs Native)  
**Last Updated**: January 26, 2026  
**Status**: Production-Ready

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Consent Token Architecture](#consent-token-architecture)
3. [System Architecture](#system-architecture)
4. [File Structure](#file-structure)
5. [How to Use](#how-to-use)
6. [Configuration](#configuration)
7. [Data Flow](#data-flow)
8. [Monitoring & Debugging](#monitoring--debugging)
9. [Performance](#performance)
10. [GDPR Compliance](#gdpr-compliance)

---

## Overview

This analytics system provides **GDPR-compliant, privacy-first tracking** with:

- First-party consent cookies (no third-party tracking)
- Server-side aggregation (no PII stored)
- Async job processing (Payload native Jobs/Tasks/Workflows)
- Dual-tracking: Local aggregates + GA4 + Matomo
- Automatic retry logic and error handling
- Built-in monitoring via Payload admin UI

---

## Consent Token Architecture

### Why TWO Consent Mechanisms?

The system uses **both** a consent token AND a consent cookie for different purposes:

#### 1. **Consent Token** (`consent_token` cookie - HttpOnly)

**Purpose**: Server-side verification and user identification

**Storage**: 
- HttpOnly cookie (not accessible to JavaScript)
- Database collection `consent-tokens`

**Created**: When user first visits the site (before consent given)

**Contains**: UUID v4 (e.g., `550e8400-e29b-41d4-a716-446655440000`)

**Used For**:
- Server-side verification in `/api/analytics` endpoint
- GA4 `client_id` (identifies unique user across sessions)
- Audit trail for GDPR compliance
- Cannot be manipulated by user

**Flow**:
```
1. User visits site → consent_token cookie created (UUID)
2. User accepts/rejects → consent_tokens.analytics updated in DB
3. Analytics POST checks DB: if consent_tokens[token].analytics === true → allow
```

---

#### 2. **Consent Cookie** (`analytics_consent` cookie - Client-readable)

**Purpose**: Fast, synchronous consent checking in browser

**Storage**: First-party cookie (readable by JavaScript)

**Contains**: 
```json
{
  "analytics": true,
  "timestamp": 1706284800000,
  "version": 1
}
```

**Used For**:
- Synchronous consent check in `track()` function (no async DB call)
- Instant blocking if consent not given
- Performance optimization

**Flow**:
```javascript
// In analytics-server.ts (client-side)
const consentState = getConsentFromCookie()
if (!consentState?.analytics) {
  return // Block immediately, no API call
}
```

---

### Why Both Are Necessary

| Aspect | Consent Token (DB) | Consent Cookie (Client) |
|--------|-------------------|------------------------|
| **Security** | ✅ Cannot be faked | ❌ Can be modified by user |
| **Speed** | ❌ Requires DB query | ✅ Instant synchronous check |
| **Audit Trail** | ✅ GDPR compliance | ❌ No history |
| **Use Case** | Server verification | Client-side blocking |

**Both together**: Fast client checks + secure server verification

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (BROWSER)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User Action (page view, click, etc.)                           │
│       ↓                                                          │
│  track('event_name', { data })                                  │
│       ↓                                                          │
│  Check analytics_consent cookie ←─────────────┐                 │
│       ↓                                        │                 │
│  ❌ No consent? → Block (no-op)               │                 │
│  ✅ Has consent? → Add to queue               │                 │
│       ↓                                        │                 │
│  Queue: 10 events OR 25 seconds               │                 │
│       ↓                                        │                 │
│  POST /api/analytics                           │                 │
│       ↓                                        │                 │
└───────┼────────────────────────────────────────┼─────────────────┘
        │                                        │
        │                                        │
┌───────▼────────────────────────────────────────┼─────────────────┐
│                       SERVER (Next.js)         │                 │
├────────────────────────────────────────────────┼─────────────────┤
│                                                │                 │
│  /api/analytics (route.ts)                    │                 │
│       ↓                                        │                 │
│  1. Origin allowlist check (ANALYTICS_TRUSTED_ORIGINS)          │
│  2. Read consent_token cookie (HttpOnly) ─────┘                 │
│  3. Verify in DB: consent-tokens[token].analytics === true      │
│       ↓                                                          │
│  ❌ No consent in DB? → 403 Forbidden                           │
│  ✅ Has consent? → Continue                                     │
│       ↓                                                          │
│  4. Validate body size + max events per request                 │
│  5. Dual rate limiting (per consent token + per IP)             │
│  6. Sanitize allowlisted fields + strip PII                     │
│  7. Normalize URLs (/123 → /[id], /UUID → /[uuid])              │
│  8. Queue job: payload.jobs.queue({                             │
│       workflow: 'processAnalyticsEvent',                        │
│       input: { event_name, page_path, event_data, ... }         │
│     })                                                           │
│       ↓                                                          │
│  Return 201 (< 50ms response)                                   │
│       ↓                                                          │
└───────┼──────────────────────────────────────────────────────────┘
        │
        │
┌───────▼──────────────────────────────────────────────────────────┐
│                  PAYLOAD JOBS SYSTEM (Cron)                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  autoRun: */5 * * * * (every 5 minutes)                         │
│       ↓                                                          │
│  Process 100 queued jobs                                        │
│       ↓                                                          │
│  Workflow: processAnalyticsEvent (3 retries)                    │
│       ├─→ Task 1: aggregateAnalyticsEvent (2 retries)           │
│       │     └─→ Find or create aggregate in analytics-aggregates│
│       │         (grouped by event+path+date+country+metadata)   │
│       │                                                          │
│       ├─→ Task 2: forwardToGA4 (3 retries)                      │
│       │     └─→ POST to GA4 Measurement Protocol                │
│       │                                                          │
│       └─→ Task 3: forwardToMatomo (3 retries)                   │
│             └─→ GET to Matomo tracking API                      │
│                                                                  │
│  Jobs stored in: payload-jobs collection                        │
│  Results stored in: analytics-aggregates collection             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## File Structure

### Core Files

```
src/
├── cms/
│   ├── collections/
│   │   ├── ConsentTokens.ts          # Consent token DB schema
│   │   └── AnalyticsAggregates.ts    # Aggregated analytics storage
│   │
│   ├── globals/
│   │   └── AnalyticsConfig/          # Admin UI config (enable/disable tracking)
│   │
│   ├── utilities/
│   │   ├── analytics-server.ts       # Client-side tracking functions
│   │   ├── analytics-allowlist.ts    # Server-side allowlist for event_data
│   │   └── consent-cookie.ts         # First-party cookie utilities
│   │
│   ├── hooks/
│   │   └── useAnalytics.ts           # React hooks for tracking
│   │
│   ├── jobs/
│   │   ├── analytics-tasks.ts        # 3 Payload tasks (aggregate, GA4, Matomo)
│   │   ├── analytics-workflow.ts     # Workflow combining tasks
│   │   ├── cleanup-task.ts           # Job cleanup task
│   │   └── cleanup-workflow.ts       # Job cleanup workflow
│   │
│   └── components/
│       └── Widgets/                  # Admin dashboard analytics widgets
│
├── app/
│   ├── api/
│   │   ├── analytics/
│   │   │   └── route.ts              # POST /api/analytics endpoint
│   │   │
│   │   ├── consent/
│   │   │   └── route.ts              # POST /api/consent endpoint
│   │   │
│   │   └── cron/
│   │       └── cleanup-jobs/
│   │           └── route.ts          # Cleanup jobs cron endpoint
│   │
│   └── (frontend)/[locale]/
│       ├── [slug]/
│       │   └── page.client.tsx       # Page view tracking
│       ├── posts/[slug]/
│       │   └── page.client.tsx       # Post view tracking
│       └── search/
│           └── page.client.tsx       # Search tracking
│
├── providers/
│   └── Privacy/
│       └── index.tsx                 # Privacy context & consent banner
│
└── payload.config.ts                 # Payload config (jobs, tasks, workflows)
```

---

## How to Use

### 1. Track Page Views

**Automatic** - Already implemented in `page.client.tsx` files:

```tsx
// src/app/(frontend)/[locale]/[slug]/page.client.tsx
import { trackPageView } from '@/cms/utilities/analytics-server'

useEffect(() => {
  const pageTitle = page.title || page.slug || 'Unknown Page'
  trackPageView(pageTitle, document.referrer)
}, [page])
```

---

### 2. Track Button Clicks

```tsx
import { trackButtonClick } from '@/cms/utilities/analytics-server'

<button onClick={() => trackButtonClick('Sign Up', 'Hero Section', '/signup')}>
  Sign Up
</button>
```

**Or with hook**:

```tsx
import { useTrackClick } from '@/cms/hooks/useAnalytics'

const trackClick = useTrackClick('CTA Button', 'Pricing Section')

<button onClick={() => trackClick('/contact')}>
  Contact Us
</button>
```

---

### 3. Track Component Impressions

```tsx
import { useTrackImpression } from '@/cms/hooks/useAnalytics'

const MyComponent = () => {
  const ref = useTrackImpression('Hero Banner', 'hero')
  
  return (
    <section ref={ref}>
      {/* Component visible for 1+ second = tracked */}
    </section>
  )
}
```

**Features**:
- Tracks when 50%+ of component visible for 1+ second
- **Session deduplication**: Each component tracked once per session
- Configurable threshold and visibility time

---

### 4. Track Searches

**Automatic** - Already implemented in search page:

```tsx
// src/app/(frontend)/[locale]/search/page.client.tsx
useEffect(() => {
  if (query) {
    track('search', { search_term: query })
  }
}, [query])
```

---

### 5. Track Custom Events

```tsx
import { track } from '@/cms/utilities/analytics-server'

// Simple event
track('video_play', { video_title: 'Product Demo' })

// Event with metadata
track('purchase', {
  product_id: '123',
  price: 49.99,
  currency: 'USD',
})
```

---

### 6. Available Tracking Functions

| Function | Purpose | Parameters |
|----------|---------|------------|
| `trackPageView(title, referrer)` | Track page visits | `title: string, referrer?: string` |
| `trackButtonClick(name, section, url)` | Track button clicks | `name: string, section?: string, url?: string` |
| `trackCardClick(cardTitle, cardType, url)` | Track card clicks | `cardTitle: string, cardType: string, url?: string` |
| `trackSearch(term, resultsCount)` | Track searches | `term: string, resultsCount?: number` |
| `trackVideoInteraction(action, title, progress)` | Track video events | `action: 'play'\|'pause'\|'complete', title: string, progress?: number` |
| `trackFormSubmit(formName, success, errorMsg)` | Track form submissions | `formName: string, success: boolean, errorMsg?: string` |
| `track(eventName, data)` | Track custom event | `eventName: string, data?: Record<string, unknown>` |

---

## Configuration

### Environment Variables

```bash
# Required
DATABASE_URI=postgresql://...
PAYLOAD_SECRET=your-secret-key
CRON_SECRET=your-cron-secret

# Optional - GA4 Forwarding
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your-ga4-api-secret

# Optional - Matomo Forwarding
MATOMO_URL=https://matomo.example.com
MATOMO_SITE_ID=1

# Optional - Analytics Security
ANALYTICS_TRUSTED_ORIGINS=https://example.com,http://localhost:8890

# Optional - Development
NODE_ENV=development
```

---

### Admin Configuration

Navigate to **Globals → Analytics Config** in Payload admin:

| Setting | Description | Default |
|---------|-------------|---------|
| **Enabled** | Master on/off switch | `true` |
| **Store Aggregates** | Save to analytics-aggregates collection | `true` |
| **GA4 Enabled** | Forward events to Google Analytics | `false` |
| **Matomo Enabled** | Forward events to Matomo | `false` |
| **Anonymize IP** | Store only country code from host headers (if available); never store raw IP | `true` |

---

### Job Configuration

**File**: `src/payload.config.ts`

```typescript
jobs: {
  tasks: [
    aggregateEventTask,    // 2 retries
    forwardToGA4Task,      // 3 retries
    forwardToMatomoTask,   // 3 retries
    cleanupOldJobsTask     // 0 retries
  ],
  workflows: [
    processAnalyticsEventWorkflow,  // 3 retries
    cleanupJobsWorkflow
  ],
  autoRun: [
    {
      cron: '*/5 * * * *',  // Every 5 minutes
      limit: 100,           // Process 100 jobs per run
      queue: 'default'
    }
  ]
}
```

---

## Data Flow

### 1. User Consent Flow

```
User visits site
    ↓
Privacy banner shown
    ↓
User clicks "Accept" or "Reject"
    ↓
1. setConsentCookie(accepted) → Write analytics_consent cookie
2. setCookieConsent(accepted) → Update React context
3. updateAnalyticsConsent(accepted) → Update analytics client
4. POST /api/consent → Persist to DB (consent-tokens)
    ↓
Banner hidden
```

---

### 2. Event Tracking Flow

```
Component calls track('event_name', { data })
    ↓
Check analytics_consent cookie
    ↓
No consent? → Block (no-op)
    ↓
Add to queue (max 10 events OR 25 seconds)
    ↓
Flush queue → POST /api/analytics
    ↓
Server verifies consent_token in DB
    ↓
Sanitize PII, normalize URLs
    ↓
payload.jobs.queue({ workflow: 'processAnalyticsEvent', ... })
    ↓
Return 201 immediately
```

---

### 3. Job Processing Flow (Every 5 Minutes)

```
Cron triggers: */5 * * * *
    ↓
Process up to 100 queued jobs
    ↓
For each job:
    ↓
Workflow: processAnalyticsEvent
    ↓
├─→ Task 1: aggregateAnalyticsEvent
│       ↓
│   Calculate metadata_hash = MD5(event_data)
│       ↓
│   Find existing: event_name + page_path + date + country + metadata_hash
│       ↓
│   Found? → Increment count
│   Not found? → Create new (count = 1)
│       ↓
│   ✅ Success or retry (2x)
│
├─→ Task 2: forwardToGA4
│       ↓
│   POST to GA4 Measurement Protocol
│   {
│     client_id: consent_token.substring(0, 32),
│     events: [{ name, params }]
│   }
│       ↓
│   ✅ Success or retry (3x)
│
└─→ Task 3: forwardToMatomo
        ↓
    GET /matomo.php?idsite=X&rec=1&action_name=Y&url=Z
        ↓
    ✅ Success or retry (3x)
```

---

## Monitoring & Debugging

### View Jobs in Admin UI

Add collection to Payload admin in `payload.config.ts`:
Navigate to: `/admin/collections/payload-jobs`

**Filter Options**:
- `hasError: true` - View failed jobs
- `workflow: processAnalyticsEvent` - View analytics jobs only
- `completedAt: null` - View pending jobs

**Job Details**:
- Input data (event details)
- Output results (task outputs)
- Retry attempts (`totalTried`)
- Error messages
- Execution timestamps

---

### View Aggregated Analytics
Add collection to Payload admin in `payload.config.ts`:

Navigate to: `/admin/collections/analytics-aggregates`

**Example Query** (via GraphQL):
```graphql
query {
  AnalyticsAggregates(
    where: { event_name: { equals: "page_view" } }
    sort: "-count"
    limit: 10
  ) {
    docs {
      event_name
      page_path
      count
      date
      country
      metadata
    }
  }
}
```

---

### Dashboard Widgets

**Admin Dashboard** shows:
1. **Analytics Events** - Recent event counts
2. **Event Tracker Graph** - Visual chart of top events

---

### Debug Logging

**Development mode logs**:

```bash
# Rate limit map size (every minute)
[Analytics] Rate limit map size (tokens): 5 entries
[Analytics] Rate limit map size (ips): 3 entries

# Blocked events (no consent)
[Analytics] Event blocked - no consent: button_click
```

**Job failures** logged to Payload:
- Check `payload-jobs` collection
- Filter by `hasError: true`
- View `error` field for details

---

## Performance

### Optimizations Implemented

| Optimization | Impact | Description |
|--------------|--------|-------------|
| **Client batching** | -96% requests | 10 events OR 25s intervals |
| **Config caching** | -30% DB queries | 1-minute TTL on analytics config |
| **Rate limiting** | Security | Event-weighted dual limits (per token + per IP) |
| **Async processing** | <50ms response | Jobs process in background |
| **Session deduplication** | -90% duplicates | Component impressions once per session |
| **Scroll reduction** | -50% events | Only track 50% and 100% scroll |
| **Viewport bucketing** | GDPR safe | Mobile/tablet/desktop (no fingerprinting) |
| **Metadata hashing** | Accurate aggregation | MD5 hash prevents false duplicates |
| **Request limits** | Stability | Max body size + max events per request |

### Security Hardening (Server-Side)

- **Origin allowlist**: requests must match `ANALYTICS_TRUSTED_ORIGINS`
- **Request caps**: max body size 64 KB, max 25 events per request
- **Rate limits**: per consent token (600 events/min) and per IP (3,000 events/min)
- **Allowlist**: only approved `event_data` keys are stored/forwarded (see `src/cms/utilities/analytics-allowlist.ts`)

---

### Performance Metrics

| Metric | Value | Baseline |
|--------|-------|----------|
| `/api/analytics` response | **< 50ms** | 200-500ms (pre-jobs) |
| Client requests | **0.04/sec** | 1/sec (real-time) |
| Job processing | **Automatic** | Manual worker |
| Memory usage | **Stable** | Growing (pre-cleanup) |

---

## GDPR Compliance

### Privacy Features

✅ **No PII Collected**:
- Email/phone/name/address keys are dropped by allowlist
- IP is never stored; country code is used only when provided by the host
- No user IDs or customer IDs
- Do not send form field values or user‑entered content in analytics events

✅ **Explicit Consent Required**:
- Privacy banner on first visit
- No tracking until user accepts
- Consent stored in database (audit trail)

✅ **Right to Withdraw**:
- User can revoke consent anytime
- Queue cleared immediately on revoke

✅ **Data Minimization**:
- Only event name, page path, aggregated metadata
- Allowlist enforced for `event_data` keys (unknown fields dropped)
- URLs normalized (`/posts/123` → `/posts/[id]`, UUIDs/hashes masked)
- Viewport sizes bucketed (no fingerprinting)

✅ **Pseudonymization**:
- UUID token (not linked to user identity)
- No cross-site tracking
- First-party cookies only

✅ **Retention**:
- **Aggregated analytics data**: Kept indefinitely (no automatic deletion yet, undecided as of writing)
  - Average size: ~500 bytes per unique event combination
  - Estimated growth: ~180MB per year (based on 1000 unique events/day)
  - Data is aggregated counts, not individual user actions
- **Jobs (payload-jobs)**: Completed jobs deleted after 30 days (cleanup task)
- **Jobs (failed)**: Kept indefinitely for debugging (admin only access)

### Example Aggregate Size after testing 

``` SQL

FROM analytics_aggregates;
 total_size | table_size | num_records 
------------+------------+-------------
 192 kB     | 24 kB      |         106
(1 row)
---

```

### Consent Cookie Details

**Name**: `analytics_consent`  
**Type**: First-party (same domain)  
**Expiry**: 1 year  
**SameSite**: Lax  
**HttpOnly**: No (readable by JavaScript)  
**Secure**: Yes (HTTPS only in production)

**Content**:
```json
{
  "analytics": true,
  "timestamp": 1706284800000,
  "version": 1
}
```

---

## Troubleshooting

### Issue: Events Not Appearing

**Check**:
1. User has accepted consent (check `analytics_consent` cookie)
2. Analytics config enabled (`/admin/globals/analytics-config`)
3. Jobs processing (`/admin/collections/payload-jobs`)
4. No failed jobs (`hasError: false`)

---

### Issue: High Memory Usage

**Causes**:
1. Rate limit map not cleaning up → Fixed with lazy cleanup
2. Job queue growing → Check cron is running
3. Development hot-reload → Normal in dev mode

**Solutions**:
- Check rate limit map size in logs
- Verify cron execution: `*/5 * * * *`
- Increase cleanup frequency if needed

---

### Issue: Search Not Tracking

**Check**:
1. `useSearchParams()` hook working
2. Query parameter present: `?q=search_term`
3. Consent given
4. Check browser console for blocks

---

### Issue: Duplicate Events

**Check**:
1. Multiple `page.client.tsx` files calling same function
2. Component re-rendering (use session deduplication)
3. Search component + page both tracking

**Solution**: Use session deduplication hook for impressions

---

## Migration & Deployment

### First Deployment

1. **Generate types**:
   ```bash
   npm run generate:types
   ```

2. **Create migration**:
   ```bash
   npm run migrate:create
   ```

3. **Run migration**:
   ```bash
   npm run migrate
   ```

4. **Set environment variables** in production



5. **Deploy** and verify jobs processing

---

### Updating Configuration

**Change tracking settings**:
1. Go to `/admin/globals/analytics-config`
2. Toggle settings (enabled, store_aggregates, etc.)
3. Changes take effect immediately (1-minute cache)

**Add new event type**:
1. Call `track('new_event_name', { data })` in code
2. No configuration needed (dynamic)
3. Appears in aggregates automatically

---

## Best Practices

### DO ✅

- Use descriptive event names (`button_click`, `form_submit`)
- Include relevant metadata (`button_name`, `section`)
- Use hooks for components (`useTrackImpression`, `useTrackClick`)
- Leverage session deduplication for impressions
- Check admin UI regularly for failed jobs
- Monitor rate limit map size in production

### DON'T ❌

- Track PII (email, phone, name) - auto-removed but avoid
- Track on every render (causes duplicates)
- Use exact viewport dimensions (use buckets)
- Skip consent checks (already handled by `track()`)
- Create custom queue systems (use Payload Jobs)
- Use `setInterval` in API routes (causes memory leaks)

---

## FAQ

**Q: Why do I need both consent_token and analytics_consent?**  
A: `consent_token` (DB) is secure source of truth. `analytics_consent` (cookie) enables fast client-side checks without DB calls.

**Q: How do I view analytics data?**  
A: Check `/admin/collections/analytics-aggregates` or build custom dashboard widgets.

**Q: Can I export analytics data?**  
A: Yes, use Payload's GraphQL API or export CSV from admin UI.

**Q: How long are jobs kept?**  
A: Completed jobs deleted after 30 days. Failed jobs kept indefinitely (admin can delete).

**Q: What happens if GA4/Matomo is down?**  
A: Tasks retry 3x. If all fail, job marked `hasError: true` for manual review.

**Q: Can I add custom event types?**  
A: Yes! Just call `track('your_event_name', { data })`. No config needed.

**Q: How do I disable analytics temporarily?**  
A: Go to `/admin/globals/analytics-config` and uncheck "Enabled".

---

## Support & Resources

- **Payload Jobs Docs**: https://payloadcms.com/docs/jobs
- **Current State**: See `docs/ANALYTICS_CURRENT_STATE.md`
- **Architecture Analysis**: See `docs/ANALYTICS_ARCHITECTURE_ANALYSIS.md`
- **Optimization Report**: See `docs/ANALYTICS_OPTIMIZATION_REPORT.md`

---

*Last Updated: January 26, 2026*  
*System Version: 2.0 (Payload Jobs Native)*

Hey any chance you can help me look at some architecture stuff for the Hackathon instead of UI stuff? I added server-side analytics tracking, because Henrik wanted a good analytics approach and I wanted to try and see if I could get it working as SSR since the client is entirely reliant on third parties and is less optimized. It basically works like this: we collect the tracking events kind of like you normally would, and I added wrappers for tracking that work in React Server Components and client components for the most basic stuff. I’m looking for a sanity check on the architecture, security/consent handling, and any testing gaps.
