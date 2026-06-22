# 11 — OPERATIONS & RUNBOOK
## MARTAL 2.0: Production Operations Manual

**Document Type:** Operations Runbook & Production Reference  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Pre-Launch — Authoritative Operations Reference  
**Prepared by:** Engineering Operations  
**Reads after:** 06_ARCHITECTURE.md, 09_IMPLEMENTATION_PLAN.md, 10_API_CONTRACTS.md  
**Audience:** Developer (Engineering Layer) + Business Owner (Operator Layer)

> **How this document is structured.** Every operational procedure is written in two layers. The **Operator Layer** (marked 🟦) contains plain-language steps for the business owner — no technical commands, no code, no jargon. The **Engineering Layer** (marked 🟩) contains technical diagnosis, CLI commands where applicable, and developer-specific detail. In an emergency, the operator reads the 🟦 section and contacts the developer for the 🟩 actions. During normal operations, the developer handles both layers.

> **Priority of this document.** MARTAL 2.0 is a revenue-generating commerce platform. Downtime costs money. This runbook exists so that when something goes wrong — at any hour, for any operator — the correct response is documented and does not need to be invented under pressure.

---

## Table of Contents

1. [Operations Philosophy](#1-operations-philosophy)
2. [Roles & Responsibilities](#2-roles--responsibilities)
3. [Environment Management](#3-environment-management)
4. [Secrets Management](#4-secrets-management)
5. [Deployment Procedures](#5-deployment-procedures)
6. [Release Management](#6-release-management)
7. [Monitoring Stack](#7-monitoring-stack)
8. [Alerting Strategy](#8-alerting-strategy)
9. [Incident Severity Matrix](#9-incident-severity-matrix)
10. [Incident Response Playbooks](#10-incident-response-playbooks)
11. [WooCommerce Failure Procedures](#11-woocommerce-failure-procedures)
12. [Checkout Failure Procedures](#12-checkout-failure-procedures)
13. [Search Failure Procedures](#13-search-failure-procedures)
14. [WhatsApp Fallback Procedures](#14-whatsapp-fallback-procedures)
15. [Backup & Recovery](#15-backup--recovery)
16. [Security Operations](#16-security-operations)
17. [SEO Operations](#17-seo-operations)
18. [Performance Operations](#18-performance-operations)
19. [Analytics Operations](#19-analytics-operations)
20. [Maintenance Schedule](#20-maintenance-schedule)
21. [Smoke Test Checklists](#21-smoke-test-checklists)
22. [Launch Day Checklist](#22-launch-day-checklist)
23. [Post-Launch Operations](#23-post-launch-operations)
24. [Operational Governance Rules](#24-operational-governance-rules)

---

## 1. Operations Philosophy

### 1.1 Core Principles

**Checkout availability is the highest priority.** A customer who cannot place an order is a customer who places the order with a competitor. Everything else is secondary to keeping the checkout flow functional, fast, and reliable.

**Every failure has a human fallback.** No automated system can be guaranteed available at all times. Every failure mode in MARTAL 2.0 has a manual WhatsApp recovery path so that a customer who encounters an error can still complete their purchase through direct contact.

**Operators should never be blocked by their tools.** The monitoring stack, deployment pipeline, and runbook are free-tier tools that work without enterprise agreements, vendor relationships, or specialized knowledge. The business owner should be able to understand the operational status of MARTAL 2.0 from a mobile phone.

**Document everything that has happened.** Every incident is recorded — what failed, when, what the impact was, what was done, and what was changed to prevent recurrence. The incident log is the institutional memory of the platform.

**Proactive over reactive.** Weekly reviews of dashboards, monthly Lighthouse audits, and quarterly security checks catch problems before they affect customers. The maintenance schedule (§20) defines these proactive activities.

### 1.2 Operational Priorities (in order)

1. Checkout is functional — customers can place orders
2. Product pages are loading — customers can browse products
3. Search is functional — customers can find products
4. Performance is within budget — pages load fast enough to convert
5. Analytics are capturing — data is available for decisions
6. SEO is healthy — organic traffic is growing

When resources are limited, work down this list. Never sacrifice #1 to fix #5.

---

## 2. Roles & Responsibilities

### 2.1 Role Definitions

| Role | Who | Responsibilities |
|---|---|---|
| **Primary Operator** | Business Owner | Monitors dashboards, receives alerts, executes Operator Layer procedures, escalates to Developer |
| **Primary Developer** | Solo Developer | Code changes, deployments, incident Engineering Layer, infrastructure decisions, runbook maintenance |
| **On-call** | Developer (v2.0) | All P0/P1 incidents — single-person on-call |

### 2.2 Responsibility Matrix

| Activity | Operator | Developer |
|---|---|---|
| Daily dashboard review | ✅ Primary | Reviews weekly |
| Responding to customer WhatsApp inquiries | ✅ Primary | Not involved |
| Monitoring Sentry error alerts | ✅ Receives summary | ✅ Primary action |
| GA4 weekly review | ✅ Primary | Supports |
| Deploying new code | ❌ Not involved | ✅ Primary |
| Rolling back a deployment | ❌ Not involved | ✅ Primary (< 5 min) |
| WooCommerce product management | ✅ Primary | Not involved |
| WooCommerce order management | ✅ Primary | Not involved |
| Weekly backup verification | ✅ Executes | ✅ Documents |
| Incident response | ✅ Operator Layer | ✅ Engineering Layer |
| Security credential rotation | ❌ Not involved | ✅ Primary (quarterly) |

### 2.3 Contact & Escalation

```
P0/P1 Incident escalation path:
  1. Operator detects issue (alert, customer report, personal observation)
  2. Operator executes §10 Operator Layer steps immediately
  3. Operator contacts Developer via [preferred channel] within 15 minutes
  4. Developer executes §10 Engineering Layer steps
  5. Joint status update every 30 minutes until resolved
  6. Post-incident review within 48 hours
```

---

## 3. Environment Management

### 3.1 Environment Inventory

MARTAL 2.0 operates across three environments. Each has its own configuration and purpose.

| Environment | URL | Branch | Purpose | WooCommerce |
|---|---|---|---|---|
| **Production** | `https://martal.store` | `main` | Live customer-facing site | Production WooCommerce |
| **Preview** | `https://martal-[hash].vercel.app` | Any PR branch | Pre-merge review | Staging WooCommerce (or production read-only) |
| **Development** | `http://localhost:3000` | Local | Feature development | MSW mocks (Phase 1) or staging WC |

### 3.2 Environment Variable Inventory

**Complete list of all environment variables for MARTAL 2.0:**

| Variable | Scope | Example Value | Classification |
|---|---|---|---|
| `WOOCOMMERCE_URL` | Server-only | `https://admin.martal.store` | Secret (server) |
| `WOOCOMMERCE_KEY` | Server-only | `ck_abc123...` | Secret (credential) |
| `WOOCOMMERCE_SECRET` | Server-only | `cs_xyz789...` | Secret (credential) |
| `REVALIDATION_SECRET` | Server-only | `sk_reval_32charstring...` | Secret (webhook) |
| `NEXT_PUBLIC_SITE_URL` | Public | `https://martal.store` | Public |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | `+201XXXXXXXXX` | Public |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | Public | `G-XXXXXXXXXX` | Public |
| `NEXT_PUBLIC_SENTRY_DSN` | Public | `https://...@sentry.io/...` | Public |
| `SENTRY_AUTH_TOKEN` | Server-only (CI) | `sntrys_...` | Secret (CI only) |

**Rules:**
- Variables without `NEXT_PUBLIC_` prefix are server-only — never accessible in browser
- Variables with `NEXT_PUBLIC_` prefix are bundled into the client — safe to expose
- `WOOCOMMERCE_KEY` and `WOOCOMMERCE_SECRET` must never appear in any file committed to git

### 3.3 Setting Variables in Vercel

🟦 **Operator Layer:** You do not manage environment variables. Contact the developer if a configuration change is needed.

🟩 **Engineering Layer:**

1. Open Vercel Dashboard → Project → Settings → Environment Variables
2. For production secrets: set Environment = "Production" only (do not expose to Preview)
3. For preview/development: set Environment = "Preview" + "Development"
4. After adding/changing any variable: redeploy the affected environment (Vercel does not auto-redeploy on variable change)
5. Verify the new value is active: check `/api/health` endpoint after redeploy

**Variable change log:** Record every variable change in the project changelog with date, variable name (not value), and reason. Never log the actual secret value anywhere.

### 3.4 Local Development Setup

🟩 **Engineering Layer:**

```bash
# Clone and install
git clone https://github.com/[org]/martal-2.0
cd martal-2.0
npm install

# Copy environment template
cp .env.example .env.local

# Fill in .env.local:
# WOOCOMMERCE_URL — use staging WooCommerce (not production)
# WOOCOMMERCE_KEY — staging consumer key
# WOOCOMMERCE_SECRET — staging consumer secret
# REVALIDATION_SECRET — any random string for local dev
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
# NEXT_PUBLIC_WHATSAPP_NUMBER — your test number

# Start development server
npm run dev
```

**Rule:** Never use production WooCommerce credentials in `.env.local`. Development activity (test orders, test products) on the production WooCommerce contaminates the order history and inventory.

---

## 4. Secrets Management

### 4.1 Secret Inventory and Ownership

| Secret | Owner | Rotation Frequency | Stored In |
|---|---|---|---|
| WooCommerce Consumer Key | Developer | Quarterly or on compromise | Vercel Environment Variables |
| WooCommerce Consumer Secret | Developer | Quarterly or on compromise | Vercel Environment Variables |
| Revalidation Secret | Developer | Quarterly | Vercel Environment Variables |
| Sentry Auth Token | Developer | On rotation | Vercel Environment Variables (CI) |

### 4.2 Secret Rotation Procedure

🟩 **Engineering Layer:**

**WooCommerce API key rotation (quarterly or on suspected compromise):**

1. Log into WooCommerce Admin (`admin.martal.store/wp-admin`)
2. Navigate to: WooCommerce → Settings → Advanced → REST API
3. Click "Add Key" to generate a new key pair (do not delete the old one yet)
4. Copy the new Consumer Key and Consumer Secret immediately — WooCommerce only shows the secret once
5. Update `WOOCOMMERCE_KEY` and `WOOCOMMERCE_SECRET` in Vercel dashboard (Production environment)
6. Trigger a production redeployment (Vercel → Deployments → Redeploy)
7. Verify `/api/health` returns `"woocommerce": "ok"` with the new credentials
8. Delete the old API key from WooCommerce Admin → REST API → delete old entry
9. Record the rotation in the changelog: `date, WOOCOMMERCE_KEY rotated, reason`

**Revalidation Secret rotation:**

1. Generate a new 32-character random string
2. Update `REVALIDATION_SECRET` in Vercel dashboard
3. Update the WooCommerce webhook payload to send the new secret (WooCommerce Admin → Settings → Advanced → Webhooks → edit)
4. Redeploy
5. Verify: trigger a test product update in WooCommerce and confirm the revalidation fires without a 401 error

### 4.3 Credential Exposure Response

If credentials are accidentally committed to git or otherwise exposed:

🟩 **Engineering Layer — immediate response (within 15 minutes):**

1. **Rotate immediately** — follow §4.2 above before doing anything else
2. Check git history: `git log --all -p | grep "ck_\|cs_"` — identify the commit
3. Revoke the exposed key in WooCommerce Admin immediately
4. Review WooCommerce order history for any orders placed in the exposure window that were not placed by real customers
5. If git history is public (GitHub public repo): contact GitHub support to purge the commit from their servers
6. Review Vercel function logs for the exposure window for unauthorized order creation attempts
7. Document in incident log: what was exposed, when, what action was taken

---

## 5. Deployment Procedures

### 5.1 Deployment Architecture

```
Developer's local machine
    ↓ git push origin feature/[name]
GitHub repository
    ↓ PR opened
Vercel Preview Deployment (automatic)
    ↓ Manual review (developer + operator if UI change)
GitHub PR approved and merged to main
    ↓ Automatic trigger
Vercel Production Deployment
    ↓ Post-deployment smoke test (§21)
Production live
```

### 5.2 Deployment Types

| Type | Trigger | Duration | Rollback |
|---|---|---|---|
| **Feature deployment** | Merge to main | 2–4 minutes | One click in Vercel dashboard |
| **Hotfix deployment** | Merge hotfix branch to main | 2–4 minutes | One click |
| **Configuration-only** | Environment variable change | Immediate (requires redeploy) | Revert variable + redeploy |
| **Content-only** | WooCommerce product/content update | ISR: 5 min (products), 1 hr (brands) | No deployment needed |

### 5.3 Standard Deployment Procedure

🟩 **Engineering Layer:**

**Before deploying:**
- [ ] All tests pass: `npm run test` exits 0
- [ ] TypeScript check: `npm run type-check` exits 0
- [ ] Build succeeds: `npm run build` exits 0
- [ ] Lighthouse CI passes (if visual/performance changes included)
- [ ] PR has been reviewed on preview deployment
- [ ] CHANGELOG.md updated with this release's changes

**Deploying:**
1. Merge PR to `main` branch on GitHub
2. Navigate to Vercel Dashboard → Deployments
3. Confirm new deployment is building (status: "Building")
4. Wait for status: "Ready" (2–4 minutes)
5. Execute post-deployment smoke test (§21.1)

**After deploying:**
- [ ] `/api/health` returns `{ "status": "ok", "woocommerce": "ok" }`
- [ ] Homepage loads correctly in browser
- [ ] No new errors in Sentry (check immediately after deploy)
- [ ] If the deploy included any ISR route changes, verify those pages load

### 5.4 Rollback Procedure

🟦 **Operator Layer:** If the website appears broken after a recent update, contact the developer immediately. Do not attempt to rollback yourself — a rollback takes the developer less than 2 minutes.

🟩 **Engineering Layer:**

**When to rollback:** A P0 incident caused by a deployment, where the fix is more than 15 minutes away.

**How to rollback (< 2 minutes):**
1. Open Vercel Dashboard → Project → Deployments
2. Find the last known-good deployment (the one before the problematic deploy)
3. Click the three-dot menu → "Promote to Production"
4. Confirm the promotion
5. Wait 60 seconds for propagation
6. Execute smoke test (§21.1) to confirm rollback succeeded
7. Investigate the cause on a branch — do not push a fix directly to main under pressure

**Rollback does not roll back:**
- WooCommerce database changes (product updates, orders, settings)
- Environment variable changes (must be reverted separately)
- DNS changes

### 5.5 Emergency Hotfix Procedure

For P0 incidents requiring immediate code changes:

🟩 **Engineering Layer:**

```bash
# Create hotfix branch from main
git checkout main
git pull
git checkout -b hotfix/[description]

# Make the minimal fix
# Test locally
# Push branch

git push origin hotfix/[description]
```

Open a PR with the label "hotfix". Bypass the standard review time. The developer approves and merges directly. No other approval required for a P0 hotfix.

---

## 6. Release Management

### 6.1 Versioning Scheme

MARTAL 2.0 uses semantic versioning: `vMAJOR.MINOR.PATCH`

| Increment | When | Example |
|---|---|---|
| **PATCH** (`0.0.X`) | Bug fixes, copy changes, minor UI corrections | `v2.0.1`, `v2.0.2` |
| **MINOR** (`0.X.0`) | New features, significant UX changes, new pages | `v2.1.0`, `v2.2.0` |
| **MAJOR** (`X.0.0`) | Breaking architecture changes, major platform shifts | `v3.0.0` |

### 6.2 Branch Strategy

```
main                    ← Production (always deployable)
  ↑
feature/[name]          ← Feature development
  ↑
bugfix/[name]           ← Bug fixes
  ↑
hotfix/[name]           ← Emergency production fixes (merges to main directly)
```

**Rules:**
- No direct commits to `main`
- Feature branches are created from `main` and merged back via PR
- Hotfix branches bypass standard review time for P0 incidents only
- Branches are deleted after merging

### 6.3 Pull Request Checklist

Every PR requires these checks before merge:

**Code Quality**
- [ ] TypeScript: no type errors (`npm run type-check`)
- [ ] Tests: all tests pass (`npm run test`)
- [ ] Build: production build succeeds (`npm run build`)
- [ ] No `console.log` statements left in production code
- [ ] No `TODO` comments that are launch-blocking

**Visual & UX (for UI changes)**
- [ ] Reviewed on preview deployment at 375px (mobile)
- [ ] Reviewed on preview deployment at 1280px (desktop)
- [ ] RTL layout correct (Arabic content displays right-to-left)
- [ ] No layout shift visible during page load
- [ ] Any new interactive elements meet 44px minimum touch target

**Performance (for any new dependencies or heavy components)**
- [ ] Bundle size checked at bundlephobia.com for any new npm packages
- [ ] `@next/bundle-analyzer` run if a large component or library was added
- [ ] Lighthouse CI still passing (automated on PR via GitHub Actions)

**Security (for API route changes)**
- [ ] No secrets in client-side code
- [ ] New API route has Zod validation
- [ ] New API route has rate limiting if it's a mutation

**Content (for copy/content changes)**
- [ ] Arabic copy reviewed against voice guidelines (05_CONTENT.md §1)
- [ ] No placeholder text or lorem ipsum
- [ ] Translated product/UI terms match the standard glossary (05_CONTENT.md §1.4)

### 6.4 Changelog Maintenance

**File:** `CHANGELOG.md` in the project root (committed to git)

**Format:**
```markdown
# Changelog

## [v2.0.1] — 2026-06-30

### Fixed
- Checkout phone validation now accepts numbers without leading zero
- Cart FreeShippingProgress bar renders correctly at 375px

### Changed
- FAQ page: added 3 new questions on lens care

---

## [v2.0.0] — 2026-06-23

### Initial Release
- Full platform launch
- All pages implemented
- WooCommerce integration live
```

**Rule:** The changelog is updated in the same PR as the code changes. A PR without a changelog entry is incomplete.

### 6.5 Release Tag Procedure

After every merge to main that constitutes a release:

🟩 **Engineering Layer:**

```bash
git checkout main
git pull
git tag v2.0.1 -m "v2.0.1: Checkout phone validation fix"
git push origin v2.0.1
```

Tags are visible in GitHub → Releases. A tagged release is also a rollback reference point — easier to identify than a commit hash when rolling back under pressure.

---

## 7. Monitoring Stack

### 7.1 Tool Inventory

| Tool | Purpose | Access URL | Who Checks |
|---|---|---|---|
| **Vercel Dashboard** | Deployment status, function logs, bandwidth | vercel.com/dashboard | Developer daily |
| **Sentry (Free)** | JavaScript errors, API errors, checkout failures | sentry.io | Developer (alerts) / Operator (summary) |
| **Google Analytics 4** | Traffic, conversions, user behavior | analytics.google.com | Operator weekly |
| **Google Search Console** | SEO rankings, indexing, Core Web Vitals | search.google.com/search-console | Developer weekly |
| **Microsoft Clarity** | Heatmaps, session recordings, rage clicks | clarity.microsoft.com | Developer weekly |
| **Vercel Analytics** | Web Vitals, performance metrics from real users | vercel.com/analytics | Developer weekly |

### 7.2 Dashboard Setup Guide

🟦 **Operator Layer — GA4 Dashboard:**

The primary operator dashboard is Google Analytics 4. Bookmark the GA4 property for MARTAL. The most important reports:

**Daily check (5 minutes):**
1. Open GA4 → Home
2. Review: Sessions, Users, Events
3. Check: any dramatic drop vs. yesterday? If sessions drop > 50% with no known cause — contact developer

**Weekly check (15 minutes):**
1. GA4 → Reports → Monetization → Ecommerce purchases
2. Review: purchase count, purchase revenue
3. GA4 → Reports → Engagement → Events
4. Check: `purchase` event count matches WooCommerce order count (roughly)

🟩 **Engineering Layer — Sentry Dashboard:**

Configure Sentry alert rules:
- Alert when: new issue is created (first occurrence of a new error type) → email + [Slack/WhatsApp]
- Alert when: issue volume exceeds 10 occurrences in 1 hour → urgent notification
- Weekly digest: summary of all issues, resolved vs. new

**Critical Sentry filters to set up:**
- Issue tag `transaction: POST /api/orders` → any checkout error alerts immediately
- Issue tag `transaction: GET /api/search` → search errors alert same-day

### 7.3 Health Check Monitoring

🟩 **Engineering Layer:**

The `/api/health` endpoint (10_API_CONTRACTS.md §10.1) is the canonical health signal.

**Automated health check:** Use a free uptime monitor (UptimeRobot free tier, Freshping free tier, or similar) to ping `https://martal.store/api/health` every 5 minutes.

**Alert configuration:**
- Health check fails 2 consecutive times → immediate notification to developer
- Response time > 3 seconds → warning notification

**Manual health check:**
Visit `https://martal.store/api/health` and confirm:
```json
{
  "status": "ok",
  "services": {
    "nextjs": "ok",
    "woocommerce": "ok"
  }
}
```

If `woocommerce` is `"error"` but `nextjs` is `"ok"` → WooCommerce is down but the site may still serve cached pages. Check §11.

---

## 8. Alerting Strategy

### 8.1 Alert Channels

| Channel | Used For | Who Receives |
|---|---|---|
| Email | Non-urgent alerts, daily digests, Sentry summaries | Developer + Operator |
| WhatsApp (personal) | P0 and P1 incidents only | Developer |
| Sentry in-app | Error details, issue tracking | Developer |
| Vercel email | Deployment success/failure | Developer |

### 8.2 Alert Triggers

| Trigger | Source | Severity | Action |
|---|---|---|---|
| Health check fails 2× | Uptime monitor | P0 | Immediately execute §10 |
| `POST /api/orders` error rate > 5% | Sentry | P0 | Immediately execute §12 |
| New Sentry issue with > 10 occurrences/hour | Sentry | P1 | Same-day investigation |
| Lighthouse score drops below 85 | Lighthouse CI | P2 | Within 48 hours |
| Search Console coverage errors increase | Search Console | P2 | Within 48 hours |
| GA4 sessions drop > 50% day-over-day | GA4 alert | P1 | Same-day investigation |
| Deployment failure | Vercel | P1 | Investigate before retrying |

### 8.3 GA4 Alert Configuration

🟩 **Engineering Layer:**

In GA4 → Admin → Custom Alerts:

```
Alert 1: Zero purchases
  Condition: purchases = 0 for 3 consecutive days
  Applies to: martal.store
  Send to: [email]

Alert 2: Session drop
  Condition: sessions decrease > 50% compared to previous week
  Applies to: All sessions
  Send to: [email]
```

---

## 9. Incident Severity Matrix

### 9.1 Severity Definitions

| Severity | Name | Definition | Response Target | Escalation |
|---|---|---|---|---|
| **P0** | Revenue Blocking | Checkout unavailable, site offline, orders failing completely | Immediate (within 15 min) | Developer contacted immediately |
| **P1** | Major Feature Failure | Search broken, product pages failing, WooCommerce API down, significant performance degradation | Same day (within 4 hours) | Developer notified within 1 hour |
| **P2** | Degraded Experience | Slow pages, analytics failure, non-critical UI errors, single page broken | Within 48 hours | Developer notified next business day |
| **P3** | Cosmetic / Content | Copy errors, minor styling bugs, broken non-critical links, outdated content | Next scheduled release | Added to backlog |

### 9.2 P0 Examples — Immediate Response

- Site returns 500 on all pages
- Checkout form does not submit
- `/api/orders` returning errors on > 50% of requests
- Site completely unreachable (DNS failure, Vercel outage)
- SSL certificate expired
- WooCommerce is down and no cached pages are serving

### 9.3 P1 Examples — Same-Day Response

- Search overlay shows "error" state for all queries
- Product pages fail to load (WooCommerce returning 404/503 for product data)
- Cart drawer does not open
- Images not loading (CDN issue or WooCommerce media server issue)
- Mobile layout broken on a specific device/browser
- GA4 events not firing (analytics blackout)

### 9.4 P2 Examples — 48-Hour Response

- Pages loading in 4–6 seconds (above budget but not broken)
- Wishlist not persisting (localStorage bug)
- Account page showing empty state when orders exist
- One FAQ accordion item not opening
- Sentry has new recurring error that is non-blocking

### 9.5 P3 Examples — Next Release

- Arabic copy error in a non-conversion-critical section
- Minor spacing or alignment issue on desktop
- A footer link goes to the wrong page
- About page has outdated content

---

## 10. Incident Response Playbooks

### 10.1 General Incident Response Flow

```
1. DETECT — Alert fires, customer reports, or operator observes issue
2. TRIAGE — Classify severity (§9)
3. COMMUNICATE — Operator executes §10.2 (P0/P1 only)
4. INVESTIGATE — Operator Layer steps, then Engineering Layer
5. RESOLVE — Fix deployed or fallback activated
6. MONITOR — Verify resolution, watch for recurrence
7. DOCUMENT — Post-incident record within 48 hours
```

### 10.2 P0 Customer Communication Template

When checkout or the site is down during business hours:

🟦 **Operator Layer — WhatsApp broadcast to recent customers:**

```
🚨 إشعار مهم

نعتذر عن بعض الاضطراب المؤقت في موقعنا الإلكتروني.

إذا واجهتِ صعوبة في إتمام طلبك، يمكنك:
1️⃣ التواصل معنا مباشرة على هذا الرقم
2️⃣ إرسال تفاصيل طلبك وسنقوم بتأكيده

نعتذر عن أي إزعاج ونعمل على حل المشكلة بأسرع وقت ممكن.

— فريق MARTAL
```

This message is sent when a P0 incident is expected to last more than 30 minutes during peak hours (10am–10pm EGT).

### 10.3 Incident Log Template

Every P0 and P1 incident gets a record added to `INCIDENTS.md`:

```markdown
## Incident [DATE] — [TITLE]

**Severity:** P0 / P1
**Detected at:** [time]
**Resolved at:** [time]
**Total duration:** [minutes/hours]
**Impact:** [number of affected users / orders affected]

### Timeline
- [time]: Issue detected by [alert / customer report / observation]
- [time]: Developer contacted
- [time]: Root cause identified
- [time]: Fix deployed / fallback activated
- [time]: Resolved and verified

### Root Cause
[What failed and why]

### Resolution
[What was done to fix it]

### Prevention
[What change was made to prevent recurrence]
[Link to PR if a code change was made]
```

---

## 11. WooCommerce Failure Procedures

WooCommerce failure affects product data loading on the shop and PDP, and order creation on checkout. ISR-cached pages may continue serving even while WooCommerce is down.

### 11.1 Detecting WooCommerce Failure

🟦 **Operator Layer — Signs of WooCommerce failure:**
- Product pages show error or blank content instead of products
- `/api/health` shows `"woocommerce": "error"` (visit `martal.store/api/health`)
- WooCommerce Admin (`admin.martal.store/wp-admin`) is not loading
- Customers report "خطأ في الموقع" (error messages) on product or shop pages

🟩 **Engineering Layer — Diagnosis:**

```
1. Check /api/health → woocommerce field:
   "ok" → WooCommerce is reachable (issue is elsewhere)
   "error" → WooCommerce is unreachable (proceed below)

2. Check WooCommerce Admin directly:
   Visit https://admin.martal.store/wp-admin
   If login page loads → WordPress is up, possible plugin/API issue
   If page does not load → server/hosting issue

3. Check hosting dashboard:
   Log into hosting control panel → Server Status section
   Look for reported outages, memory limits, disk space issues

4. Check Vercel function logs:
   Vercel Dashboard → Project → Functions → filter by "woocommerce"
   Look for timeout errors or 503 responses
```

### 11.2 WooCommerce Down — Response Steps

🟦 **Operator Layer:**

1. Visit your hosting provider's status page or control panel — check if server is listed as "down" or "under maintenance"
2. If hosting reports an outage: wait for their resolution, they will fix it
3. If hosting shows "all systems operational": log into WordPress Admin and check WooCommerce → Status for any plugin errors
4. Contact the developer with: what page is failing, what error message appears, and whether `martal.store/api/health` shows `woocommerce: error`
5. Activate WhatsApp manual order process (§14)

🟩 **Engineering Layer:**

```
Recovery steps in priority order:

1. VERIFY: Is WooCommerce API specifically broken or is WordPress down?
   - Visit admin.martal.store/wp-admin → if blank/error → server issue
   - Visit admin.martal.store/wp-json/wc/v3/products?consumer_key=...&consumer_secret=... → if 401/503 → API auth issue

2. RESTART WooCommerce API (if plugin issue):
   - WP Admin → Plugins → deactivate/reactivate WooCommerce
   - Clear any caching plugins

3. FORCE ISR CACHE SERVE (while WooCommerce recovers):
   - ISR-cached product pages continue serving from Vercel edge
   - Shop page (SSR) will fail — acceptable for < 1 hour outage
   - Notify operator: "product pages are serving but shop browsing may be slow"

4. IF outage > 1 hour:
   - Update announcement bar copy to indicate temporary issue
   - Deploy the copy change as a hotfix
   - Enable WhatsApp fallback mode (§14)

5. WHEN WooCommerce recovers:
   - Trigger manual revalidation: POST /api/revalidate with { type: 'all' }
   - Verify health check: /api/health shows "woocommerce": "ok"
   - Verify a product page loads fresh data
```

---

## 12. Checkout Failure Procedures

Checkout failure is always P0. Every checkout error costs a potential order.

### 12.1 Detecting Checkout Failure

🟦 **Operator Layer — Signs of checkout failure:**
- Customer messages on WhatsApp saying "حاولت أطلب وما اشتغل"
- Sentry alert fires for `/api/orders` errors
- You attempt a test order and it fails
- GA4 shows `begin_checkout` events with no corresponding `purchase` events (check in GA4 → Events)

🟩 **Engineering Layer — Diagnosis:**

```
1. Check Sentry: filter by transaction "POST /api/orders"
   What is the error type?
   
   ValidationError → Zod schema rejecting a valid form (schema bug)
   WooCommerceError → WooCommerce rejecting the order payload
   WooCommerceTimeoutError → WooCommerce not responding
   NetworkError → Vercel cannot reach WooCommerce

2. Test the API directly:
   curl -X POST https://martal.store/api/orders \
     -H "Content-Type: application/json" \
     -d '{
       "customer": {
         "fullName": "اختبار",
         "phone": "01012345678",
         "governorate": "Cairo",
         "city": "القاهرة",
         "addressLine1": "شارع الاختبار 123"
       },
       "items": [{"productId":124,"variationId":207,"quantity":1,"price":450}]
     }'
   
   Expected response: 201 { orderId, orderNumber }
   
3. If WooCommerce is rejecting orders:
   Check WooCommerce Admin → Orders for any failed order attempts
   Check WooCommerce Admin → Status → Tools → WC System Status
   Look for: API access disabled, out of disk space, expired SSL

4. If validation error:
   Check what field is failing in Sentry error details
   May indicate a schema mismatch after a WooCommerce configuration change
```

### 12.2 Checkout Failure — Response Steps

🟦 **Operator Layer:**

1. Send the following WhatsApp broadcast immediately (P0 — do not delay):
```
نعتذر عن مشكلة مؤقتة في نظام الطلبات.
لتكملة طلبك، يرجى التواصل معنا مباشرة على هذا الرقم
وسنأخذ طلبك يدوياً في أسرع وقت.
```
2. Accept manual orders via WhatsApp while the developer investigates
3. Record every manual order in a spreadsheet: name, phone, product, governorate, address
4. Contact developer immediately with: what error message the customer sees, when the issue started

🟩 **Engineering Layer:**

```
Recovery paths by root cause:

ROOT CAUSE: WooCommerce API down
  → Follow §11 WooCommerce failure procedures
  → WhatsApp fallback is already in the UI (checkout failure response includes whatsappFallback URL)

ROOT CAUSE: Validation schema mismatch
  → Identify the failing field in Sentry
  → If WooCommerce now requires a field that wasn't required before:
    update the WCOrderCreatePayload in lib/woocommerce/orders.ts
    update OrderTransformer in transformers.ts
    deploy hotfix

ROOT CAUSE: Rate limiting (10 orders/hour/IP)
  → Check: is this legitimate high traffic or a bot?
  → If legitimate: temporarily raise rate limit in Vercel Edge Config
  → If bot: check IP patterns in Vercel logs, block specific IPs

ROOT CAUSE: Vercel deployment broken
  → Rollback immediately (§5.4)
  → Investigate on the broken branch

ALWAYS AFTER RESOLUTION:
  1. Place a test order and confirm it appears in WooCommerce
  2. Verify Sentry error rate for /api/orders returns to 0
  3. Send resolution message to any affected customers via WhatsApp
  4. Document incident in INCIDENTS.md
```

---

## 13. Search Failure Procedures

Search failure is P1 — it blocks product discovery but not checkout for customers who already have a product in mind.

### 13.1 Detecting Search Failure

🟦 **Operator Layer — Signs:**
- Open the MARTAL website, tap the search icon, type "brown" — if no suggestions appear → search may be broken
- Sentry shows errors on `GET /api/search`
- Customers report "البحث مش شغال"

🟩 **Engineering Layer:**

```
1. Test search API directly:
   curl "https://martal.store/api/search?q=brown"
   Expected: 200 with products array
   
   If 400: query validation issue
   If 500: WooCommerce search unavailable
   If timeout: WooCommerce response > 10 seconds

2. Check WooCommerce search manually:
   Visit admin.martal.store/wp-json/wc/v3/products?search=brown
   (Use your consumer key as URL params for quick test)
   If this returns products → WooCommerce is searchable, issue is in API route
   If this returns error → WooCommerce search is broken
```

### 13.2 Search Failure — Response Steps

🟦 **Operator Layer:**

No immediate customer communication needed (P1 — search doesn't block checkout). Customers can still browse via shop categories. Contact developer within 1 hour to investigate.

🟩 **Engineering Layer:**

```
Recovery paths:

WooCommerce search broken:
  → Most WooCommerce search issues resolve with:
    WP Admin → Tools → Reindex search (if using a search plugin)
    Or: wait for WooCommerce to recover (§11)

API route error:
  → Check Sentry for specific error in GET /api/search
  → Most common: synonym map resolution throwing on unexpected input
  → Hotfix if schema-level issue

Timeout issue:
  → Search response time > 10s indicates WooCommerce under load
  → Temporary fix: increase search timeout in wcGet() options
  → Long-term: consider Algolia migration (06_ARCHITECTURE.md §10.5)
```

---

## 14. WhatsApp Fallback Procedures

When digital checkout fails, WhatsApp is MARTAL's revenue safety net. This section defines how to operate in manual WhatsApp order mode.

### 14.1 Activating WhatsApp Manual Order Mode

🟦 **Operator Layer:**

WhatsApp manual order mode is activated when checkout is unavailable for more than 30 minutes during business hours (10am–10pm EGT).

**Standard manual order intake process:**

1. Customer messages on WhatsApp with order details (the checkout failure response automatically pre-fills a WhatsApp message with their cart contents)
2. Confirm the order by replying:
```
شكراً لطلبك! 🌸
تأكيد طلبك:
[list the items they ordered]
الإجمالي: [X] جنيه
هيتم التواصل معك لتأكيد موعد التوصيل.
رقم طلبك: WA-[date]-[sequence, e.g., WA-0623-01]
```
3. Record the order in the manual orders spreadsheet (keep this spreadsheet on Google Sheets, always accessible from phone)
4. When the digital system is restored, enter any manual orders into WooCommerce Admin manually: WooCommerce → Orders → Add Order

**Manual order spreadsheet columns:**
| WA Order # | Date | Customer Name | Phone | Products | Total | Governorate | Address | Status |

### 14.2 WhatsApp Message Templates

These templates are used by the operator during manual order intake. Save them to WhatsApp's "Saved Replies" or keep this document accessible:

**Order confirmation:**
```
شكراً نورهان على طلبك! ✨
طلبك اتسجل برقم: WA-0623-01
سيتواصل معكِ المندوب خلال 1-3 أيام عمل.
أي سؤال، نحن هنا! 💙
```

**Out of stock during manual mode:**
```
آسفين، [اسم المنتج] نفذ مؤقتاً.
بيرجع خلال [X] أيام — هل تريدين الانتظار؟
أو يمكنك اختيار [بديل مقترح].
```

**Delivery confirmation request:**
```
مرحباً [الاسم]! 😊
طلبك اتشحن اليوم.
المندوب هيتصل بكِ على رقم [رقم العميل] قبل الوصول.
— فريق MARTAL
```

---

## 15. Backup & Recovery

### 15.1 What Needs Backing Up

| Data | Location | Backup Frequency | Backup Method |
|---|---|---|---|
| WooCommerce products | WooCommerce database | Weekly | WooCommerce export (CSV + JSON) |
| WooCommerce orders | WooCommerce database | Daily | Hosting automated backup |
| WooCommerce settings | WordPress database | Weekly | Hosting automated backup |
| WordPress media | Hosting file system | Weekly | Hosting automated backup |
| Next.js source code | GitHub repository | Every commit (automatic) | Git |
| Environment variables | Vercel + personal secure note | On change | Manual record in 1Password or similar |
| Manual order spreadsheet | Google Sheets | Always online | Google auto-saves |

**What does NOT need separate backup:**
- localStorage data (customer-side only, not recoverable, not critical to business)
- Vercel deployment history (retained automatically by Vercel)
- Sentry error history (retained by Sentry on free tier)

### 15.2 WooCommerce Backup Procedures

🟦 **Operator Layer — Weekly product export:**

1. Log into WooCommerce Admin (`admin.martal.store/wp-admin`)
2. Navigate to: WooCommerce → Products → Export
3. Select: Export all products, all columns
4. Click "Generate CSV" → download the file
5. Name the file: `martal-products-[YYYY-MM-DD].csv`
6. Save to a designated backup folder (Google Drive or similar)

🟩 **Engineering Layer — Database backup:**

Your hosting provider's automated backup is the primary database backup. Verify it is configured:
1. Log into hosting control panel
2. Navigate to Backups section
3. Confirm: automated daily backups are enabled
4. Confirm: retention period is at least 14 days
5. Confirm: backups are stored off-server (not just on the same server)
6. Monthly: actually download and verify a backup by restoring to a staging environment

**Backup verification test (monthly):**
1. Download the most recent hosting backup
2. Restore it to a WordPress staging environment (most hosts provide this)
3. Verify: products load correctly, orders are present, WooCommerce settings intact
4. Do not restore to production unless in a recovery scenario

### 15.3 Recovery Procedures

🟦 **Operator Layer:**

Data recovery (restoring from backup) is never performed by the operator without developer involvement. If you suspect data loss, contact the developer immediately and do not make any changes in WooCommerce Admin.

🟩 **Engineering Layer — Product data recovery:**

If product data is lost or corrupted:
1. Download the most recent product CSV backup
2. WooCommerce Admin → Products → Import
3. Upload CSV → map columns → run import
4. Verify: spot-check 5 products for correct price, image, and variations
5. Trigger revalidation: POST /api/revalidate with `{ type: 'all' }`

**Order data recovery:** Orders are in the database backup and in WooCommerce's order history. Individual order recovery:
1. Find the order in the hosting database backup (requires hosting control panel access)
2. Or: recreate the order manually in WooCommerce Admin with the customer's details

---

## 16. Security Operations

### 16.1 Security Monitoring

🟩 **Engineering Layer — Weekly security checks:**

```
1. Check Vercel function logs for unusual patterns:
   - More than 50 requests to /api/orders from a single IP in 24 hours → potential fraud
   - More than 200 requests to /api/search from a single IP in 1 minute → potential scraping
   - Any 401 responses on /api/revalidate → webhook secret probing

2. Check Sentry for security-related errors:
   - ZodError on /api/orders with unusual field patterns → may indicate probing
   - Rate limit exceeded errors → check if legitimate users or bots

3. Check WooCommerce for suspicious orders:
   - Orders with identical addresses, different names → investigate
   - Orders marked cancelled at unusually high rate → potential COD fraud
```

### 16.2 COD Fraud Prevention

Since orders require no payment upfront, MARTAL is exposed to COD fraud (placing orders with no intent to receive/pay).

🟦 **Operator Layer — Signs of suspicious orders:**
- Multiple orders from the same phone number with different names
- Orders with incomplete or nonsensical addresses
- Orders where the delivery person cannot reach the customer after repeated attempts

**Response to suspected fraud:**
1. In WooCommerce Admin → order → add a note: "مشكوك في صحته — تأكيد قبل الشحن"
2. Call or WhatsApp the customer number to confirm before shipping
3. If no response after 2 attempts: hold the order, do not ship
4. Contact developer if a pattern is observed across multiple orders

🟩 **Engineering Layer:**

```
Rate limiting (already configured in /api/orders):
  10 orders per IP per hour — sufficient for normal customers
  
If a pattern of fraud is detected:
  1. In Vercel → Settings → Edge Config or Middleware:
     Block specific IPs showing fraud patterns
  2. Consider adding honeypot field to checkout form (v2.1)
  3. Consider requiring phone verification before order (v2.1)
```

### 16.3 Security Headers Verification

🟩 **Engineering Layer — Monthly check:**

Visit `https://securityheaders.com/?q=martal.store`

Target grade: A or A+

Required headers (from 06_ARCHITECTURE.md §15.2):
- `X-Frame-Options: SAMEORIGIN` ✓
- `X-Content-Type-Options: nosniff` ✓
- `Referrer-Policy: strict-origin-when-cross-origin` ✓
- `Content-Security-Policy` ✓

If grade drops below A: review `next.config.ts` security header configuration, redeploy if changed.

### 16.4 Dependency Security Audit

🟩 **Engineering Layer — Monthly:**

```bash
npm audit

# Review output:
# "0 vulnerabilities" → proceed
# "X vulnerabilities" → assess each:
#   Critical/High: fix immediately
#   Moderate: fix in next sprint
#   Low: add to backlog
```

If `npm audit fix` is available for the vulnerability: run it, test, and deploy in a hotfix.

---

## 17. SEO Operations

### 17.1 Weekly SEO Monitoring

🟩 **Engineering Layer — Google Search Console (weekly, 10 minutes):**

1. Open Search Console → martal.store property
2. Check: Performance → Search Results
   - Are impressions growing week-over-week?
   - Are there any queries with high impressions but low CTR? (may indicate poor title/description)
3. Check: Indexing → Pages
   - Are product pages indexed? (target: all published products)
   - Are there any "Page with redirect" or "Crawled - currently not indexed" issues?
4. Check: Enhancements → Core Web Vitals
   - Any URLs in "Poor" or "Needs Improvement" categories?

🟦 **Operator Layer — Simple SEO check (monthly, 5 minutes):**

1. Open a new browser window (incognito)
2. Search Google for: `عدسات Hypnose كورية مصر`
3. Does MARTAL appear on the first page? Record the position in the monthly log
4. Search for: `عدسات ملونة شهرية مصر`
5. Record position
6. Share the screenshots with the developer monthly

### 17.2 New Product SEO Checklist

Every time a new product is added to WooCommerce:

🟦 **Operator Layer — WooCommerce product setup:**
- [ ] Product name is in the format: `[Brand] [Color]` (e.g., `Hypnose Steel Gray`)
- [ ] Short description (subtitle) is written in Arabic, 1–2 sentences
- [ ] Long description is complete, in Arabic, including safety information
- [ ] Images are uploaded with meaningful filenames (not `IMG_001.jpg`)
- [ ] Product is tagged: bestseller / new / monthly (as appropriate)
- [ ] Product is categorized under the correct brand category

🟩 **Engineering Layer:**
- [ ] After adding the product: trigger revalidation for the shop page
- [ ] Verify the product appears in search: `GET /api/search?q=[color-name]`
- [ ] Verify the product page has correct metadata (view source, check `<title>` and `<meta name="description">`)
- [ ] Submit the new product URL to Search Console: Inspect URL → Request Indexing

### 17.3 Sitemap Maintenance

The sitemap (`martal.store/sitemap.xml`) is generated automatically by Next.js and includes all published WooCommerce products and brand pages.

🟩 **Engineering Layer — After major catalog changes:**

1. Visit `martal.store/sitemap.xml` — verify new products appear
2. If products are missing: the ISR cache may be stale
   - Trigger: POST /api/revalidate with `{ type: 'all' }`
   - Or: trigger a new deployment (sitemap is regenerated on each build)
3. After significant catalog expansion (> 20 new products): go to Google Search Console → Sitemaps → remove and re-add the sitemap URL to force a fresh crawl

### 17.4 Core Web Vitals Monitoring

🟩 **Engineering Layer — Monthly:**

1. Vercel Analytics → Web Vitals tab
   - Filter by "Mobile" device type
   - Check LCP, CLS, FID/INP values from real user data
   - Target: LCP < 2.5s, CLS < 0.1, INP < 200ms
2. Google Search Console → Core Web Vitals
   - Any pages in "Poor" status need immediate attention (P2 incident)
3. Run Lighthouse manually on homepage and bestselling product page:
   `npx lighthouse https://martal.store --preset=perf`

---

## 18. Performance Operations

### 18.1 Performance Budget Reference

From 06_ARCHITECTURE.md §14.1:

| Metric | Target | Alert Threshold |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 90 | < 85 |
| LCP | < 2.5s | > 3.0s |
| CLS | < 0.1 | > 0.15 |
| INP | < 200ms | > 300ms |
| JS initial bundle | < 150KB gzipped | > 200KB |

### 18.2 Performance Regression Investigation

🟩 **Engineering Layer:**

If Lighthouse score drops below 85 or LCP exceeds 3.0s:

```
1. Run Lighthouse locally on the affected page:
   npx lighthouse http://localhost:3000 --only-categories=performance

2. Check the Lighthouse diagnostics section:
   - "Avoid enormous network payloads" → image sizes
   - "Reduce unused JavaScript" → bundle analysis needed
   - "Eliminate render-blocking resources" → check fonts, scripts
   - "Largest Contentful Paint element" → what is the LCP element?

3. Run bundle analysis:
   ANALYZE=true npm run build
   Check: has any recent PR added a large dependency?

4. Check for ISR cache miss rate:
   Vercel Dashboard → Functions → check invocation frequency
   High invocation frequency on product pages = ISR not working
   → Check revalidate values in page components

5. If a specific PR caused the regression:
   Identify the commit that caused it
   Revert that change or fix it before next deploy
```

### 18.3 Image Performance Operations

🟩 **Engineering Layer — When adding product images to WooCommerce:**

1. Before uploading: resize images to max 2000px wide (WooCommerce will create smaller sizes)
2. File format: JPEG at 85% quality for photographs (WebP conversion handled by Next.js)
3. After uploading: verify Next.js serves WebP by inspecting Network tab → image URLs should include `?w=...&q=75&f=webp`
4. If images are not being optimized: check `next.config.ts` `images.remotePatterns` includes `admin.martal.store`

---

## 19. Analytics Operations

### 19.1 GA4 Event Reference

These are the events MARTAL tracks and what they mean. Full event schema: 06_ARCHITECTURE.md §18.2.

| Event | What It Measures | Business Meaning |
|---|---|---|
| `view_item` | Product page viewed | Customer is evaluating this product |
| `add_to_cart` | Product added to cart | High purchase intent |
| `begin_checkout` | Checkout page opened | Strong purchase intent |
| `purchase` | Order confirmed | Revenue realized |
| `wishlist_add` | Product wishlisted | Deferred interest |
| `search` | Search query submitted | Discovery behavior |
| `whatsapp_click` | WhatsApp button tapped | Assisted conversion |
| `filter_apply` | Shop filter used | Browsing refinement |

### 19.2 Weekly Analytics Review (Operator)

🟦 **Operator Layer — 15-minute weekly review:**

**Open GA4 → Reports → Monetization → Ecommerce Purchases**

Answer these questions each week:

1. **How many orders were placed this week?** Compare to last week. Growing or declining?
2. **Which products were purchased most?** Are the bestsellers what you expected?
3. **What is the average order value?** Is it above or below 800 EGP (free shipping threshold)?

**Open GA4 → Reports → Acquisition → Traffic Acquisition**

4. **Where is traffic coming from?** Social / Organic Search / Direct? Is organic search growing (good SEO sign)?
5. **Which channel drives the most purchases?** This tells you where to invest more effort.

**Record these numbers in a weekly log spreadsheet.** The trend over weeks is more informative than any single week's numbers.

### 19.3 Conversion Funnel Review (Monthly)

🟩 **Engineering Layer — GA4 Funnel Exploration:**

Create a GA4 Funnel Exploration with these steps:
1. `view_item` → product page viewed
2. `add_to_cart` → added to cart
3. `begin_checkout` → checkout opened
4. `purchase` → order confirmed

**Target conversion rates at each step** (from 02_STRATEGY.md §14.2):
- view_item → add_to_cart: ≥ 25%
- add_to_cart → begin_checkout: ≥ 55%
- begin_checkout → purchase: ≥ 70%

If any step falls significantly below target:
- view_item → add_to_cart too low: product page trust signals may be insufficient
- add_to_cart → begin_checkout too low: cart page friction or unexpected costs
- begin_checkout → purchase too low: checkout form friction (check Sentry for form errors)

### 19.4 WhatsApp Conversion Tracking

Since WhatsApp orders cannot be tracked automatically in GA4:

🟦 **Operator Layer — Monthly WhatsApp order log:**

1. Count all WhatsApp orders placed in the month (from the manual orders spreadsheet or WooCommerce orders tagged "WA-")
2. Calculate: WhatsApp orders / Total orders = WhatsApp order percentage
3. If WhatsApp orders > 15% of total: checkout may have issues or WhatsApp customers have specific needs that should be addressed in FAQ/PDP copy

---

## 20. Maintenance Schedule

### 20.1 Daily Tasks (5 minutes)

🟦 **Operator Layer:**
- [ ] Check GA4 for any dramatic session or purchase drops vs. yesterday
- [ ] Check WooCommerce Admin → Orders for new orders, process any pending
- [ ] Review WhatsApp messages from customers; respond to any pre-purchase inquiries

🟩 **Engineering Layer (business days only):**
- [ ] Check Sentry for any new issues created in the last 24 hours
- [ ] Check Vercel for any failed deployments or function errors

### 20.2 Weekly Tasks (30 minutes)

🟦 **Operator Layer:**
- [ ] GA4 weekly review (§19.2)
- [ ] Manual product CSV backup (§15.2)
- [ ] Check Google Search Console for any new indexing issues
- [ ] Verify `martal.store/api/health` returns ok

🟩 **Engineering Layer:**
- [ ] Review Sentry issues: resolve/assign any open issues
- [ ] Check Vercel Analytics: Web Vitals trends
- [ ] Review Microsoft Clarity: any rage clicks or confusing user flows?
- [ ] Check `npm audit` — any new vulnerabilities?
- [ ] Review ISR cache hit rates in Vercel Analytics

### 20.3 Monthly Tasks (2 hours)

🟩 **Engineering Layer:**
- [ ] Run Lighthouse audit on homepage + top product page (record scores)
- [ ] Run `@next/bundle-analyzer` — verify bundle has not grown unexpectedly
- [ ] Review and verify hosting backup (§15.2 backup verification test)
- [ ] Security headers check: `securityheaders.com/?q=martal.store`
- [ ] Check dependency security: `npm audit`
- [ ] Review GA4 conversion funnel (§19.3) — identify any optimization opportunities
- [ ] Review CHANGELOG.md — ensure all changes since last month are documented
- [ ] Search Console: Core Web Vitals report — any URLs in "Poor" category?
- [ ] Test the complete checkout flow manually with a real test order

### 20.4 Quarterly Tasks (half day)

🟩 **Engineering Layer:**
- [ ] Rotate WooCommerce API credentials (§4.2)
- [ ] Rotate revalidation secret (§4.2)
- [ ] Update all dependencies: `npm update` → test → deploy
- [ ] Review all environment variables — any unused? Any that should be rotated?
- [ ] Review incident log — patterns? Recurring failures?
- [ ] Review performance trends — has LCP or CLS drifted over 3 months?
- [ ] GA4: export quarterly revenue and order data for business review
- [ ] Review and update this runbook — has anything changed that should be documented?

---

## 21. Smoke Test Checklists

### 21.1 Post-Deployment Smoke Test (every production deployment)

Run within 5 minutes of every production deployment. Estimated time: 3 minutes.

🟩 **Engineering Layer:**

```
CRITICAL PATH (must pass — deployment is not live until these pass):

[ ] /api/health returns { status: "ok", woocommerce: "ok" }
[ ] Homepage loads without JavaScript errors (check browser console)
[ ] One product page loads with correct content (visible in page source)
[ ] Cart: add a product, verify cart count badge updates
[ ] Search: type "brown" — suggestions appear within 2 seconds

SECONDARY (verify within 30 minutes of deployment):

[ ] Shop page loads with products visible
[ ] A brand page loads with correct brand content
[ ] Mobile: verify at 375px — no broken layout
[ ] Checkout form: verify validation error appears for invalid phone
[ ] No new errors in Sentry in the 10 minutes after deployment
```

### 21.2 Full Commerce Smoke Test (weekly + after P0 incidents)

Estimated time: 10 minutes. Tests the complete revenue path.

🟦 **Operator Layer:**

1. Visit `martal.store` on your phone (mobile browser)
2. Tap the search icon → type "brown" → verify suggestions appear
3. Tap a product → verify product page loads with image and price
4. Tap a color swatch → verify price updates
5. Tap "أضيفي للسلة" → verify cart drawer opens
6. Tap "إتمام الطلب" → verify checkout page loads
7. Fill the form with test data:
   - Name: اختبار
   - Phone: 01012345678
   - Governorate: القاهرة
   - City: مدينة نصر
   - Address: شارع الاختبار عمارة 1
8. Tap "تأكيدي الطلب" → verify order success page appears with order number
9. Check WooCommerce Admin → Orders → verify the test order appears
10. Delete the test order from WooCommerce Admin

🟩 **Engineering Layer:**

After step 8, also verify:
- Cart is empty (count badge shows 0)
- Order exists in `localStorage:martal_orders_v2`
- No errors in Sentry during the test session

### 21.3 RTL Layout Smoke Test (after any CSS/layout changes)

🟩 **Engineering Layer:**

```
[ ] Navbar: logo appears on the RIGHT, navigation reads right-to-left
[ ] Shop filters: sidebar appears on the RIGHT (desktop)
[ ] Product card: brand name text aligns right, price aligns correctly
[ ] PDP: gallery on right, product info on left (desktop)
[ ] Checkout form: labels and inputs align right, error messages appear below fields
[ ] Cart drawer: slides in from the LEFT (RTL: left = start = where drawers anchor)
[ ] Search overlay: input text flows right-to-left when typing Arabic
[ ] All chevron/arrow icons point in the correct RTL direction
[ ] Footer accordion: text right-aligned, chevron on left
```

### 21.4 SEO Smoke Test (monthly)

🟩 **Engineering Layer:**

```
[ ] View source of homepage: <html lang="ar" dir="rtl">
[ ] View source of homepage: <title> contains Arabic text
[ ] View source of a product page: <title> contains product name
[ ] View source of a product page: JSON-LD Product schema present
[ ] Visit martal.store/sitemap.xml: valid XML, product URLs present
[ ] Visit martal.store/robots.txt: /checkout and /api/ are disallowed
[ ] Rich Results Test passes: https://search.google.com/test/rich-results?url=martal.store/product/[slug]
```

---

## 22. Launch Day Checklist

This checklist is executed on the day of initial production launch only. It is more comprehensive than the post-deployment smoke test.

### 22.1 Pre-Launch (2 hours before)

🟩 **Engineering Layer:**

**Infrastructure**
- [ ] Production Vercel deployment is live and accessible at `martal.store`
- [ ] DNS is fully propagated (check with `dig martal.store` or `dnschecker.org`)
- [ ] SSL certificate is valid and auto-renewing (padlock in browser)
- [ ] `martal.store` redirects from `www.martal.store` (or vice versa, consistently)
- [ ] Security headers: A grade on `securityheaders.com`

**WooCommerce**
- [ ] All products are published with correct prices
- [ ] All brand categories are set up with correct slugs (hypnose, labella, fxeyes, elamore, iconic)
- [ ] WooCommerce webhook is configured pointing to `martal.store/api/revalidate`
- [ ] Test order placed and visible in WooCommerce Admin
- [ ] COD is enabled as the only payment method

**Environment**
- [ ] All production environment variables set in Vercel (complete list §3.2)
- [ ] `WOOCOMMERCE_URL` points to production WooCommerce (not staging)
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` is the correct business WhatsApp number
- [ ] `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is the production GA4 property

### 22.2 Launch Verification (at launch)

🟦 **Operator Layer:**
- [ ] Homepage loads on your phone
- [ ] You can complete a test order (then delete it)
- [ ] WhatsApp button opens WhatsApp with your business number

🟩 **Engineering Layer:**
- [ ] Full commerce smoke test (§21.2) passes
- [ ] RTL layout smoke test (§21.3) passes
- [ ] SEO smoke test (§21.4) passes
- [ ] `/api/health` returns `{ "status": "ok", "woocommerce": "ok" }`
- [ ] Sentry: confirm test error reaches Sentry (`Sentry.captureMessage('Launch test')`)
- [ ] GA4: real-time view shows your test session
- [ ] GA4: `purchase` event fired for your test order (verify in GA4 → Real-time → Events)
- [ ] Microsoft Clarity: session is being recorded (verify in Clarity → Recordings)
- [ ] Google Search Console: property is verified, sitemap submitted

### 22.3 First 24 Hours Post-Launch

🟦 **Operator Layer:**
- [ ] Respond to all customer WhatsApp inquiries within 2 hours
- [ ] Monitor GA4 Real-time every hour
- [ ] Check WooCommerce Admin → Orders at least twice (morning + evening)
- [ ] If any customer reports an issue: document exactly what they said and contact developer

🟩 **Engineering Layer:**
- [ ] Monitor Sentry every 2 hours for the first 24 hours
- [ ] Monitor Vercel function invocations — any unusual spikes?
- [ ] Verify 5 real customer orders appear correctly in WooCommerce after they are placed
- [ ] Check Google Search Console → URL Inspection on `martal.store` — is it indexed?
- [ ] Submit sitemap to Search Console if not already done
- [ ] First Lighthouse run on live production URL — record scores as baseline

---

## 23. Post-Launch Operations

### 23.1 Week 1 Post-Launch

🟩 **Engineering Layer — Daily:**
- Monitor Sentry — all new issues require triage
- Check Vercel Analytics — Web Vitals from real users (first real-user data)
- Run full commerce smoke test daily

🟦 **Operator Layer — Daily:**
- Respond to all customer inquiries promptly
- Document any customer-reported issues
- Record order counts in the weekly analytics log

### 23.2 First-Month Priorities

After launch, these are the operational priorities for the first 30 days in order:

1. **Respond to every Sentry error** — launch surfaces issues that development didn't catch
2. **Fix any P1+ issues immediately** — first impressions are not recoverable
3. **Collect first reviews from customers** — use the WhatsApp follow-up sequence from 05_CONTENT.md §15.8
4. **Monitor conversion funnel** — identify if any funnel step has an unexpected drop
5. **Submit to Google** — Search Console → Coverage → request indexing for key pages
6. **First Lighthouse baseline** — compare week-4 vs. launch day performance

### 23.3 30-Day Review Agenda

At 30 days post-launch, conduct a structured review:

🟦 **Operator Layer provides:**
- Total orders placed in month 1
- Customer feedback themes from WhatsApp
- Top-selling products
- Any operational difficulties observed

🟩 **Engineering Layer provides:**
- Lighthouse score trend (launch → day 30)
- Sentry: all resolved issues, any recurring patterns
- GA4 funnel conversion rates vs. targets from 02_STRATEGY.md §14.2
- Search Console: impressions, clicks, indexed page count
- Bundle size: has it grown since launch?
- Any technical debt accumulated during launch week that needs addressing

**Outcome:** Prioritized list for v2.0.1 (first patch release) and updated v2.1 roadmap.

### 23.4 Repeat Purchase Monitoring

MARTAL's business model depends on repeat purchases (monthly lens replacements). Monitor these signals:

🟦 **Operator Layer — Monthly:**
- In WooCommerce Admin → Orders: filter by customer email or phone — are any customers ordering again?
- Track: what percentage of this month's orders are from customers who ordered in a previous month?
- Target (from 02_STRATEGY.md): ≥ 25% of first-time buyers return within 30 days

🟩 **Engineering Layer:**
- GA4: create a User cohort report to track 30-day retention
- If repeat purchase rate is below 25%: review WhatsApp follow-up execution (are the Day 25 messages being sent?)

---

## 24. Operational Governance Rules

These 22 rules define the operational standards for MARTAL 2.0. They apply at all times and are not suspended for convenience.

**O-01: No direct commits to main.** Every change goes through a PR with a preview deployment. The main branch is always deployable. A "quick fix" committed directly to main skips tests, skips review, and cannot be properly traced.

**O-02: The post-deployment smoke test is not optional.** Every production deployment is followed by §21.1 smoke test within 5 minutes. A deployment that has not been smoke-tested is not considered complete.

**O-03: P0 incidents receive immediate response, no exceptions.** A P0 incident at 2am is addressed at 2am. Checkout down during business hours is direct revenue loss. The on-call developer is always the solo developer in v2.0.

**O-04: WhatsApp manual order mode is always available.** If the digital checkout fails, manual order intake via WhatsApp activates immediately. The operator has the message templates (§14.2) accessible at all times. No customer is turned away during a checkout outage.

**O-05: Cart is never cleared on failure.** `CartStore.clearCart()` is called only after a confirmed successful order response from `/api/orders`. A failed order, a timeout, a navigation — none of these authorize cart clearing. This rule protects customers from losing their cart during a checkout error.

**O-06: Every incident is documented.** P0 and P1 incidents are recorded in `INCIDENTS.md` within 48 hours of resolution. The incident log is reviewed quarterly for patterns.

**O-07: Environment variables are never in source code.** A variable value found in any committed file (including `.env.local`, `README.md`, or a comment) is treated as an immediate P0 security incident requiring credential rotation.

**O-08: Production WooCommerce credentials are never used in local development.** Local development uses staging WooCommerce or MSW mocks. Using production credentials locally risks polluting the live order history with test data.

**O-09: Rollback is always faster than a hotfix under pressure.** If a deployment causes a P0 or P1 issue and the fix requires more than 15 minutes, rollback first, fix second. A broken site cannot wait for a careful fix.

**O-10: Backups are verified, not just created.** A backup that has not been tested is not a backup. Monthly backup verification (§15.2) is not optional.

**O-11: The CHANGELOG.md is updated in the same PR as the code change.** A changelog entry added retroactively is incomplete — it may miss important context. The engineer writing the code writes the changelog entry.

**O-12: Security headers are checked monthly.** Vercel configuration can drift. A monthly check at `securityheaders.com` catches any header regression before it becomes a vulnerability.

**O-13: WooCommerce credentials are rotated quarterly.** API keys have no automatic expiry. Quarterly rotation limits the exposure window if a key is ever compromised without detection.

**O-14: No paid monitoring tools are introduced without approval.** The monitoring stack is deliberately free-tier. Adding a paid tool increases operational costs and creates a dependency. Any paid tool requires documented justification and explicit approval.

**O-15: Analytics events are verified after every deployment that includes checkout or cart changes.** GA4 event tracking that breaks silently is invisible. After any change to the checkout flow, cart flow, or related components, manually verify the `purchase` event fires in GA4 Real-time.

**O-16: The operator is never blocked by a technical step.** Every procedure in §10–14 has an Operator Layer that requires no technical knowledge. If an Operator Layer step requires code or CLI, it is redesigned. Operators should be able to respond to P0 incidents without waiting for the developer on every action.

**O-17: ISR cache is manually invalidated after WooCommerce recovery.** When WooCommerce comes back online after an outage, stale ISR-cached pages may be serving. POST `/api/revalidate` with `{ type: 'all' }` is executed as the final step of every WooCommerce recovery procedure.

**O-18: Manual WhatsApp orders are entered into WooCommerce within 24 hours.** Orders taken during manual mode exist only in the spreadsheet until entered into WooCommerce. They must be entered within 24 hours to maintain accurate inventory and order history.

**O-19: The smoke test at §21.2 is run weekly, not just after deployments.** Gradual degradation (ISR cache issues, WooCommerce configuration drift, third-party script failures) does not trigger deployments. The weekly full commerce test catches these before customers do.

**O-20: Performance regressions are treated as bugs.** A Lighthouse score drop below 85, an LCP above 3 seconds, or a CLS above 0.15 on any page is treated as a P2 incident. Performance debt is not deferred to "later."

**O-21: This runbook is reviewed and updated quarterly.** Procedures change. Tools evolve. A runbook that is not maintained becomes incorrect, and an incorrect runbook is worse than no runbook (it gives false confidence). Quarterly review is a scheduled task (§20.4).

**O-22: The first action in any incident is to determine whether checkout is affected.** Checkout availability is the highest operational priority. Every incident assessment begins with: "Can customers place orders?" If yes, the incident is P1 or lower. If no, it is P0 regardless of the technical cause.

---

*This document is the operational foundation for MARTAL 2.0. The platform's reliability is a direct input to customer trust and revenue. A business that operates its technology platform professionally earns the same trust from customers that its product quality does. Operations is not infrastructure management — it is brand management.*

*Document Owner: Engineering Operations*  
*Last Updated: June 2026*  
*Review Schedule: Quarterly (next review: September 2026)*  
*Documentation Stack: 01_PROJECT_BRIEF → 11_OPERATIONS_AND_RUNBOOK — Complete*
