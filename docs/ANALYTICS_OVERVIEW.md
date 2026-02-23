## Non-Technical GDPR & Safety Overview (Plain Language)

This template uses **opt-in, server-side analytics**.

- No analytics are processed unless the user has granted analytics consent.
- Events are sent to our server first, then validated/sanitized before storage or forwarding.
- The setup is designed for data minimization and safer defaults.

---

## Cookie + Consent Summary

Two consent-related cookies are used:

- `consent_token` (HttpOnly, 12 months): pseudonymous token used by the server to verify consent state.
- `analytics_consent` (client-readable, 12 months): stores consent preferences so client tracking can stay off until consent is granted.

Users can reopen consent settings at any time from the footer and update/revoke choices.

The customize panel uses clear categories with expandable explanations:
- Strictly necessary
- Statistical
- Third-party statistical sharing
- Marketing
- Ad personalization

---

## First-Party Cookies In The Flow

Both cookies are first-party (set by this site, not by third-party ad networks).

1. On first visit, no analytics cookie state is treated as consent.
2. User chooses in the banner.
3. `/api/consent` stores preferences server-side and sets `consent_token` (HttpOnly).
4. The client also stores `analytics_consent` so browser tracking logic can immediately allow/block event collection.
5. When events are sent to `/api/analytics`, the server uses `consent_token` to verify active consent before processing anything.
6. If consent is revoked, client tracking is disabled, queued events are cleared client-side, and pending server jobs for that token are removed.

Why two cookies:
- `consent_token` is the server trust anchor and is not readable by JavaScript.
- `analytics_consent` is the client-side gate so tracking can be blocked before requests are sent.

---

## GDPR Position (Plain Language)

This setup is intended to support GDPR principles, assuming policy and operations are configured correctly.

- Lawfulness/consent: analytics is opt-in and can be changed later.
- Data minimization: only allowlisted fields are accepted; known PII fields are dropped.
- Security/integrity: origin checks, consent-version checks, request limits, and rate limiting are enforced server-side.
- Storage limitation: consent tokens expire after 12 months and are cleaned up automatically.
- Accountability: consent state is persisted server-side and analytics processing is centralized.


---

## How Data Flows

1. User chooses consent in the banner.
2. Client sends events to `/api/analytics` only when analytics consent is active.
3. Server verifies trusted origin, valid consent token, consent version, request size, and rate limits.
4. Server sanitizes data:
   - drops unknown fields (allowlist model)
   - drops known PII keys (email/phone/address/user IDs, etc.)
   - normalizes URL paths to remove IDs/hashes
5. Cleaned events are sent to enabled sinks:
   - local aggregated storage (`analytics-aggregates`) if allowed
   - GA4/Matomo only if project settings + third-party sharing consent both allow it

IP addresses are used transiently for request rate-limiting and are not stored in analytics aggregates.

---

## What We Track

Anonymous usage events such as:
- page views
- clicks (buttons/cards/links)
- form submit events (not form values)
- search terms
- video interactions
- scroll/engagement signals

We do not intentionally collect personal identifiers in analytics payloads.

---

## Ops Checklist (Non-Code)

- Keep a public privacy policy linked from banner/footer.
- Document consent choices and how users can change them.
- If GA4/Matomo is enabled, list those providers and purposes.
- Set `ANALYTICS_TRUSTED_ORIGINS` correctly, or analytics requests will be rejected.
- Decide and document retention for analytics aggregates (consent tokens expire after 12 months and are cleaned up).

---

## Cookie Categories (Current Implementation)

| Cookie / Storage | Type | Category | Purpose | Retention |
|---|---|---|---|---|
| Consent verification cookie (`consent_token`) | Cookie (HttpOnly) | Strictly necessary | Verifies consent server-side before analytics processing | 12 months (refreshed on consent update) |
| Consent preferences cookie (`analytics_consent`) | Cookie (client-readable) | Strictly necessary | Remembers your analytics choices in the browser | 12 months |
| Language preference cookie (`NEXT_LOCALE`) | Cookie | Strictly necessary | Remembers selected language for correct locale routing and content delivery | Browser-managed / framework default |
| Admin sign-in session (`payload-token`) | Cookie | Strictly necessary | Keeps admin users signed in securely | Session or auth config controlled |
| Theme preference (`payload-theme`) | Local storage (not cookie) | Functional | Remembers light/dark mode preference | Until changed/cleared |

Notes:
- “Functional” means preference/experience support (for example theme), not analytics/ads.
- `payload-theme` is local storage, so include it in your privacy/cookie disclosures even though it is not a cookie.
