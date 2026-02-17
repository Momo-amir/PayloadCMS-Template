# Analytics Production Readiness Checklist

**Purpose**: Security and privacy audit for production deployment  
**Version**: 2.0  
**Last Updated**: February 17, 2026

---

## 1. Privacy Banner & Consent Flow

### 1.1 Privacy Banner Display

**What**: Consent banner that blocks analytics until user explicitly accepts or declines

**Where**: 
- `src/cms/components/PrivacyBanner/index.tsx`
- `src/providers/Privacy/index.tsx`

**Expected Behavior**: Privacy banner appears when visiting site for the first time, or when clicking cookie management link in footer. Required for GDPR compliance (explicit consent before any tracking).

---

### 1.2 Consent Update Flow

**What**: Multi-step consent synchronization across cookie, React state, analytics client, and database

**Where**: 
- `src/providers/Privacy/index.tsx` - `updateCookieConsent()` function

**Expected Behavior**: When privacy banner is clicked (Accept/Decline), consent updates propagate in order: first-party cookie → React state → analytics client → database. This ensures analytics tracking starts/stops immediately while maintaining audit trail. Declining consent flushes event queue and blocks future tracking.

---

### 1.3 First-Party Consent Cookie

**What**: Client-readable cookie for synchronous consent checks

**Where**: 
- `src/cms/utilities/consent-cookie.ts`
- Cookie name: `analytics_consent`

**Expected Behavior**: First-party cookie enables instant opt-in verification without network requests. Analytics client defaults to `consentGiven = false`. Only tracks when cookie exists with `analytics: true`. Not HttpOnly so JavaScript can check synchronously. Missing cookie or `analytics: false` means no tracking (explicit opt-in, not opt-out).

---

### 1.4 HttpOnly UUID Token

**What**: Server-side cryptographic token for immutable audit trail

**Where**: 
- `src/app/api/consent/route.ts`
- Cookie name: `consent_token`

**Expected Behavior**: UUID v4 token stored as HttpOnly cookie prevents client-side consent manipulation. Token in database provides legally-required audit trail of consent decisions. HttpOnly ensures token cannot be read or modified by JavaScript.

---

### 1.5 Third-Party Client ID

**What**: Anonymized identifier sent to external analytics providers

**Where**: 
- `src/cms/jobs/analytics-tasks.ts` - GA4 task
- `client_id` field

**Expected Behavior**: First 32 characters of UUID consent token used as GA4 `client_id`. Provides session continuity across visits without exposing full audit token. Never includes PII or raw user identifiers.

---

## 2. API Security & Protection

### 2.1 Consent API Validation

**What**: Public endpoint for consent persistence with origin validation

**Where**: 
- `src/app/api/consent/route.ts`

**Expected Behavior**: Validates request origin before processing to prevent CSRF attacks. Creates/updates consent token in database and sets HttpOnly cookie. Returns 403 if origin not in `ANALYTICS_TRUSTED_ORIGINS` allowlist. Prevents external sites from manipulating user consent.

---

### 2.2 Analytics API Pre-Flight Checks

**What**: Multi-layer security validation before event processing

**Where**: 
- `src/app/api/analytics/route.ts` - Lines 220-265

**Expected Behavior**: Checks execute in order: consent token present → origin trusted → database consent verified → request size limits → rate limits. Fail-fast approach prevents unnecessary processing of unauthorized requests. Each check returns appropriate HTTP status (403/413/429) for debugging.

---

### 2.3 Rate Limiting

**What**: In-memory request throttling per token and per IP

**Where**: 
- `src/app/api/analytics/route.ts` - Lines 15-92

**Expected Behavior**: Dual rate limits (600 events/min per token, 3000/min per IP) prevent abuse and accidental loops. Both limits must pass. Protects database and job queue from overload. Sliding 60-second windows with automatic cleanup.

---

### 2.4 Origin Allowlist

**What**: CSRF protection via origin header validation

**Where**: 
- `src/cms/utilities/isTrustedOrigin.ts`
- Environment: `ANALYTICS_TRUSTED_ORIGINS`

**Expected Behavior**: Only requests from explicit origin allowlist accepted. Prevents external websites from submitting events to your analytics API. Requires protocol + host match (no wildcards). Combined with SameSite cookies for defense-in-depth.

---

## 3. Data Sanitization & Privacy

### 3.1 Field Allowlist

**What**: Strict allowlist of permitted event data fields

**Where**: 
- `src/cms/utilities/analytics-allowlist.ts`
- `ANALYTICS_ALLOWED_KEYS` constant

**Expected Behavior**: Only pre-approved fields pass through. Unknown fields silently dropped (not logged). Prevents accidental PII collection even if developer mistake includes it. Allowlist approach safer than blocklist (default deny).

---

### 3.2 PII Pattern Detection

**What**: Regex-based removal of email addresses and phone numbers

**Where**: 
- `src/app/api/analytics/route.ts` - `sanitizeEventData()` function (lines 160-225)

**Expected Behavior**: Scans all string values for email/phone patterns. Entire field removed if match found. Protects against PII leaking through form data or URL parameters. Works recursively through nested objects.

---

### 3.3 PII Field Blocklist

**What**: Known PII field names automatically stripped

**Where**: 
- `src/app/api/analytics/route.ts` - Lines 175-186

**Expected Behavior**: Case-insensitive blocking of `email`, `phone`, `user_id`, `address`, `first_name`, `last_name`, etc. Prevents common developer mistakes. Fields removed before storage or forwarding to third parties.

---

### 3.4 URL Normalization

**What**: ID and query parameter removal from page paths

**Where**: 
- `src/app/api/analytics/route.ts` - `normalizeURL()` function (lines 108-126)

**Expected Behavior**: Replaces numeric IDs, UUIDs, and hashes with placeholders (`[id]`, `[uuid]`, `[hash]`). Strips query strings entirely. Prevents user-specific data leaking through URLs. Enables meaningful aggregation without sacrificing privacy.

---

### 3.5 IP Anonymization

**What**: Country-only geolocation with no raw IP storage

**Where**: 
- `src/app/api/analytics/route.ts` - `getCountryFromRequest()` (lines 96-106)

**Expected Behavior**: Extracts country code from CDN headers (Vercel, Cloudflare, etc.). Never stores raw IP addresses. Returns 'unknown' if no header present. Sufficient for geographic analysis without privacy risk.

---

## 4. Client-Side Tracking

### 4.1 Consent Gating

**What**: Synchronous consent check before every analytics call

**Where**: 
- `src/cms/utilities/analytics-server.ts` - `track()` function (lines 45-57)
- `consentGiven` property defaults to `false` (line 20)

**Expected Behavior**: Default state is `consentGiven = false` (no tracking). Only tracks when cookie explicitly has `analytics: true`. Check is `if (!this.consentGiven) return` - requires explicit YES to proceed. Queue cleared immediately on consent revocation. True opt-in: never tracks without explicit consent.

---

### 4.2 Event Batching

**What**: Smart batching to reduce network requests

**Where**: 
- `src/cms/utilities/analytics-server.ts` - Lines 13-38

**Expected Behavior**: Events batched (10 events OR 25 seconds, whichever first). Auto-flush on page close (`beforeunload`) and tab hide (`visibilitychange`). Uses `keepalive: true` for reliability. Balances performance with data freshness.

---

### 4.3 Session Deduplication

**What**: Prevents duplicate impression tracking within session

**Where**: 
- `src/cms/utilities/analytics-server.ts` - `wasTrackedThisSession()` (lines 122-133)

**Expected Behavior**: Uses `sessionStorage` to track what's been logged this session. Component impressions and page views tracked once per user session. Persists until tab close. Prevents inflation from re-renders or navigation.

---

## 5. Backend Processing

### 5.1 Job Workflow Structure

**What**: Async processing pipeline with retry logic

**Where**: 
- `src/cms/jobs/analytics-workflow.ts`

**Expected Behavior**: Each event queued as Payload job. Workflow retries up to 3 times. Tasks execute conditionally based on config flags (store_aggregates, ga4_enabled, matomo_enabled). Returns 201 immediately (non-blocking). Failed jobs kept for debugging.

---

### 5.2 Event Aggregation

**What**: Anonymized count-based storage with no individual events

**Where**: 
- `src/cms/jobs/analytics-tasks.ts` - `aggregateEventTask`

**Expected Behavior**: Groups by event_name + page_path + date + country + metadata hash. Increments existing count or creates new record (count=1). MD5 hash of sanitized metadata enables exact duplicate detection. No raw events stored (GDPR-friendly).

---

### 5.3 GA4 Forwarding

**What**: Optional Google Analytics 4 integration via Measurement Protocol

**Where**: 
- `src/cms/jobs/analytics-tasks.ts` - `forwardToGA4Task`

**Expected Behavior**: Uses UUID token substring as `client_id` for session tracking. Retries 3 times on failure. Skips silently if credentials missing (doesn't fail job). Only sanitized data forwarded.

---

### 5.4 Matomo Forwarding

**What**: Optional self-hosted Matomo integration

**Where**: 
- `src/cms/jobs/analytics-tasks.ts` - `forwardToMatomoTask`

**Expected Behavior**: Sends event_name and page_path to Matomo HTTP API. Retries 3 times. Skips if credentials missing. Enables privacy-first self-hosted analytics as GA4 alternative.

---

### 5.5 Cron Job Processing

**What**: Scheduled job processor for async event handling

**Where**: 
- `src/payload.config.ts` - `jobs.autoRun` configuration

**Expected Behavior**: Runs every 5 minutes. Processes up to 100 jobs per run. Events typically processed within 5 minutes of receipt. Prevents API route blocking while maintaining near-real-time data.

---

## 6. Database Collections

### 6.1 Consent Tokens Collection

**What**: Audit trail of consent decisions with UUID tokens

**Where**: 
- `src/cms/collections/ConsentTokens.ts`

**Expected Behavior**: Stores UUID token, analytics boolean, policy version, timestamps. Admin-only access. Hidden from nav (programmatic use only). Provides legally-required audit trail for GDPR compliance. Tokens immutable (updates only change consent flag).

---

### 6.2 Analytics Aggregates Collection

**What**: Privacy-safe aggregate event counts

**Where**: 
- `src/cms/collections/AnalyticsAggregates.ts`

**Expected Behavior**: Count-based aggregates indexed by event_name, page_path, date, country. Metadata JSON contains only sanitized, allowlisted fields. No raw IPs, no PII, no individual user tracking. Safe for indefinite retention.

---

### 6.3 Payload Jobs Collection

**What**: Built-in job queue with retry and error tracking

**Where**: 
- Payload core collections (no custom config)

**Expected Behavior**: Tracks job state (pending/completed/failed), retry attempts, input/output, errors. Failed jobs kept indefinitely for debugging. Completed jobs auto-deleted after 30 days. Admin can filter by workflow, error state, completion status.

---

## 7. Configuration

### 7.1 Environment Variables

**What**: Required and optional runtime configuration

**Where**: 
- `.env` / Environment settings

**Expected Behavior**:

**Required**:
- `DATABASE_URI` - Postgres connection string
- `PAYLOAD_SECRET` - 64+ char random string
- `CRON_SECRET` - 32+ char random string for cron endpoint auth
- `ANALYTICS_TRUSTED_ORIGINS` - Comma-separated allowed origins (no spaces, with protocol)

**Optional** (only if using external providers):
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` + `GA4_API_SECRET` - For GA4 forwarding
- `MATOMO_URL` + `MATOMO_SITE_ID` - For Matomo forwarding

---

### 7.2 Analytics Config Global

**What**: Admin UI toggles for analytics features

**Where**: 
- `src/cms/globals/AnalyticsConfig/config.ts`
- Admin path: `/admin/globals/analytics-config`

**Expected Behavior**: Master enable/disable switch. Toggles for aggregate storage, GA4, Matomo. IP anonymization flag (should always be true). Admin-only updates. Changes take effect on next cron run. Allows disabling analytics without code deployment.

---

## 8. Security Checklist

### 8.1 Authentication & Authorization

**Expected Behavior**: All analytics collections require admin role. Consent/analytics APIs are public but origin-validated. Server uses `overrideAccess: true` for programmatic writes. No client-side bypass possible.

---

### 8.2 CSRF Protection

**Expected Behavior**: Origin validation on both APIs. SameSite cookies (Strict for token, Lax for consent). Combined defense prevents cross-site attacks.

---

### 8.3 XSS Protection

**Expected Behavior**: JSON-only responses. No user input rendered as HTML. React auto-escapes. Analytics data never inserted into DOM.

---

### 8.4 SQL Injection Protection

**Expected Behavior**: Payload ORM uses parameterized queries exclusively. No raw SQL with user input. Where clauses use query operators.

---

### 8.5 Data Exposure

**Expected Behavior**: Only aggregates visible to admins. No raw tokens exposed. No individual user behavior tracked. Country codes only (no IPs). Sanitized metadata only (no PII).

---

## 9. GDPR Compliance

### 9.1 Legal Requirements Met

**Expected Behavior**: Explicit opt-in required (no pre-checked boxes). Consent revocable anytime via footer link. Privacy policy linked from banner. Data minimization enforced by allowlist. Purpose limitation (analytics only). Audit trail in database.

---

### 9.2 Privacy Policy Requirements

**Expected Behavior**: Must disclose: what data collected, why, how long retained, which third parties receive it, how to withdraw consent, contact information. Should be managed in Payload CMS Pages collection.

---

### 9.3 Data Retention

**Expected Behavior**: Consent tokens kept indefinitely (audit trail). Aggregates kept indefinitely (no PII, low risk). Completed jobs deleted after 30 days. Failed jobs kept for debugging (manual deletion available).

---

## 10. Production Deployment

### 10.1 Pre-Deployment Verification

**Expected Behavior**: All required env vars set. `NODE_ENV=production`. SSL certificates valid (for Secure cookies). Database migrations run. Trusted origins include all production domains (with https://). Secrets are cryptographically random.

---

### 10.2 Post-Deployment Validation

**Expected Behavior**: Privacy banner displays on first visit. Consent persists across sessions. Events tracked after consent. Jobs processing successfully every 5 minutes. No failed jobs accumulating. Aggregates populating in database. External providers receiving events (if configured).

---

### 10.3 Monitoring

**Expected Behavior**: Check failed jobs daily. Monitor job queue size. Verify event processing latency < 5 minutes. Database queries for PII leakage should return zero rows. Rate limit cleanup running (dev logs show map sizes).

---

## Sign-Off

**Audit Completed By**: ______________________  
**Date**: ______________________  
**Production Approved**: [ ] Yes [ ] No  
**Critical Issues Found**: ______________________
