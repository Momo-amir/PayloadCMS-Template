## Non-Technical GDPR & Safety Overview (Plain Language)

This section explains the **why** behind the analytics setup in simple terms, so a non‑technical reader can understand the benefits and GDPR posture.

This is an **out‑of‑the‑box, opt‑in analytics implementation** for this template, designed to help set up compliant analytics quickly for client websites as a built‑in service.

### The analytics structure (in plain language)

We do **server‑side analytics**. That means the browser sends events to *our* server first, and then the server decides what to keep and what to discard.

Why this is useful:
- It lets us **control and strip data** before anything is stored or sent to third parties (like Google or Matomo).
- It prevents raw personal data from being forwarded even if a mistake happens in the browser.
- It lets us **enforce consent** and security checks in one place.

### What happens step‑by‑step

1. The visitor gives consent in the privacy banner.
2. Only after consent, the browser sends analytics events to **our server**, not directly to Google/Matomo.
3. The server checks:
   - Is this request coming from our website?
   - Has the person actually consented?
   - Is the request size and volume reasonable?
4. The server then **filters and sanitizes** the data:
   - Drops unknown fields (allowlist, so not a blacklist, we choose what to allow in)
   - Removes known personal identifier keys (e.g., email/phone fields)
   - Normalizes URLs so IDs are not stored
5. Only the cleaned, minimal data is:
   - stored in our database (as aggregates), and/or
   - forwarded to external providers

### Why this improves privacy and safety

- **Consent first**: no consent = no tracking (requests are blocked before any analytics is processed).
- **Data minimization**: only allowed fields are kept; everything else is dropped.
- **No raw IP storage**: IPs are not stored. If your host provides a country header, we store only that country code; otherwise it stays `unknown`.
- **Server‑side guardrails**: request limits + rate limits + origin allowlist.
- **Aggregation**: we store counts, not individual behavior histories.

### What we track (and what we don’t)

We track only **anonymous usage signals**, such as:
- Which page was viewed
- Basic actions (button clicks, form submits, search terms)
- General device category (mobile/tablet/desktop)
 - Form submits are tracked as events only (not the form fields/values)

We do **not** track:
- Names, emails, phone numbers, addresses
- Raw IP addresses
- User IDs or customer IDs

### What this means for GDPR

This setup aligns with GDPR principles:
- **Lawfulness & consent**: explicit opt‑in required
- **Data minimization**: only necessary, non‑PII data kept
- **Purpose limitation**: tracking only for site analytics
- **Security**: server‑side checks before storage or forwarding

### What a non‑technical reviewer can verify

- Privacy banner appears on first visit
- No tracking without consent
- Consent can be revoked at any time
- Analytics data does not include personal identifiers

If needed, analytics data can be exported from the admin UI for audit.

---

## What’s Needed Beyond Code (Operational Requirements)

To run this analytics setup correctly and legally, the website owner should also have:

### 1) Privacy Policy Page

A public privacy policy page that is:
- Linked from the consent banner (comes default in the templates privacy-banner)
- Linked in the website footer

It should clearly describe:
- What data is collected (anonymous analytics events)
- Why it is collected (site performance and product decisions)
- Which services may receive it (e.g., Google Analytics, Matomo comes default as opt in services at the time of writing)
- How consent can be withdrawn
- How long data is retained (currently aggregated data is kept indefinitely; automatic cleanup can be added)

### 2) Consent Banner Language

The banner should clearly state:
- That consent is stored (a consent token cookie is set for verification)
- That analytics only run after opt‑in
- That essential cookies may still be used for required functionality

This is typically limited to the minimum language needed for:
- Consent storage and verification
- Locale preferences
- Essential/functional cookies (e.g., login sessions, security)

### 3) Service Disclosure (if used)

If GA4 or Matomo is enabled, list them explicitly in the privacy policy:
- Provider name and purpose
- Data processed (anonymized event data)
- Opt‑out instructions

---

## What We Send to GA4 (and How It Differs from Standard Client Analytics)

We do **not** run the standard GA4 browser client directly. Instead, we send events to GA4 from the server using the **GA4 Measurement Protocol** after consent.

Key differences:
- **Client ID source**: We use a server‑issued consent token (UUID) as the GA4 `client_id` instead of GA’s default browser identifiers/cookies.
- **Server‑side filtering**: Only allow‑listed, sanitized event fields are forwarded.
- **No raw IP storage**: IPs are not stored; coarse country is only derived when your host supplies a country header.
- **Consent enforced centrally**: Events are blocked server‑side if consent is missing or revoked.

Practically, this means GA4 receives **minimal, sanitized event data** that we control, rather than whatever the browser would normally send.
