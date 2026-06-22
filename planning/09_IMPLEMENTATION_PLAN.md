# 09 — IMPLEMENTATION PLAN
## MARTAL 2.0: Engineering Execution Blueprint

**Document Type:** Implementation Sequencing & Launch Readiness Specification  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Pre-Development — Execution Reference  
**Prepared by:** Lead Engineering  
**Reads after:** 01–08 (full documentation stack)  
**Audience:** Solo Developer  
**Execution Model:** Solo full-stack developer, milestone-based sprints

> **Purpose of this document.** The previous eight documents answer *what* MARTAL 2.0 is and *how* it is designed. This document answers *in what order do you build it*, *what blocks what*, *what can you skip for now*, and *how do you know when you are done*. It is written for a single experienced developer working sequentially. Every section is operational.

> **Relationship to previous documents.** Architecture decisions, data models, component specifications, and content are already defined in documents 01–08. This document references those decisions but does not repeat them. When this plan says "implement the WooCommerce client," it means implement it per the specification in 06_ARCHITECTURE.md §7.2. When it says "implement the Product type," it means per 08_DATA_MODEL.md §2.1. Cross-references are the navigation layer — the source documents are the specification.

---

## Table of Contents

1. [Implementation Philosophy](#1-implementation-philosophy)
2. [Development Stages Overview](#2-development-stages-overview)
3. [Dependency Graph](#3-dependency-graph)
4. [Environment Setup](#4-environment-setup)
5. [Sprint Breakdown](#5-sprint-breakdown)
6. [Detailed Build Order](#6-detailed-build-order)
7. [Component Implementation Order](#7-component-implementation-order)
8. [Page Implementation Order](#8-page-implementation-order)
9. [WooCommerce Integration Plan](#9-woocommerce-integration-plan)
10. [Search Implementation Plan](#10-search-implementation-plan)
11. [Checkout Implementation Plan](#11-checkout-implementation-plan)
12. [SEO Implementation Plan](#12-seo-implementation-plan)
13. [Performance Plan](#13-performance-plan)
14. [Testing Strategy](#14-testing-strategy)
15. [Security Review Checklist](#15-security-review-checklist)
16. [Accessibility Checklist](#16-accessibility-checklist)
17. [Launch Readiness Checklist](#17-launch-readiness-checklist)
18. [Risk Register](#18-risk-register)
19. [Post-Launch Roadmap](#19-post-launch-roadmap)
20. [Definition of Done](#20-definition-of-done)

---

## 1. Implementation Philosophy

These six principles govern every sequencing decision in this plan. When two tasks could be done in either order, these principles determine which comes first.

### 1.1 Build Foundations Before Features

No feature is implemented before its foundation exists. A product card is not built before the design system tokens are wired. A checkout form is not built before the validation layer exists. A search overlay is not built before the WooCommerce search integration is wired.

The practical test: if feature B depends on foundation A, and A is not complete, building B produces throwaway work or introduces debt that takes longer to fix than it saved to skip.

**Build order rule:** Infrastructure → Data layer → State layer → UI primitives → Layout → Feature components → Pages → SEO → QA.

### 1.2 Server-First Architecture

Every page is implemented as a Server Component first. Client interactivity is added only after the server-rendered shell is working correctly. This catches SEO and data-fetching problems before they are buried under client-side state logic.

**Practical consequence:** When implementing a product page, the first working version renders the product title, description, and price from server-fetched data with no interactivity. Gallery swipe, color selection, and add-to-cart are layered in afterward as Client Components.

### 1.3 Mobile-First Implementation

Every component is built and reviewed at 375px before any desktop layout work begins. This is not aesthetic preference — it is risk management. In a mobile-first codebase, mobile is simple and desktop is an enhancement. In a desktop-first codebase, mobile is an adaptation and frequently broken.

**Practical consequence:** When working in the browser during development, Devtools is set to 375px (iPhone SE profile). Desktop layout is added via responsive utility classes after the mobile layout passes visual review.

### 1.4 SEO-First Implementation

Every page that contains commerce content gets its `generateMetadata` function and JSON-LD structured data implemented in the same sprint as the page itself — not deferred to a later "SEO sprint." SEO that is bolted on after pages are built is incomplete SEO.

**Practical consequence:** No ISR or SSR page is considered complete without `generateMetadata`, a canonical URL, Arabic meta description, and the appropriate JSON-LD schema.

### 1.5 Progressive Enhancement

Each sprint produces a working, deployable increment. The application is never in a broken state at a sprint boundary. Features are added on top of working foundations, not woven into partially-working code.

**Practical consequence:** After Sprint 1, the homepage renders with mock data. After Sprint 2, it renders with real WooCommerce data. The site is always deployable; it just has less functionality at earlier sprints.

### 1.6 Performance Budget Enforcement

Performance is not a final-sprint concern. Lighthouse CI is configured in Sprint 0. Bundle size is monitored from the first dependency added. If a library addition would push the JS budget over threshold, a decision is made immediately — not deferred until launch week when the budget is far exceeded and the solution requires refactoring.

**Practical consequence:** Every `npm install` of a non-trivial library is preceded by checking its gzipped bundle size at bundlephobia.com.

---

## 2. Development Stages Overview

Ten stages from initialization to production. Each stage has a clear objective, defined outputs, explicit dependencies, and success criteria. No stage begins before the previous stage's success criteria are met.

---

### Stage 1 — Foundation
**Objective:** Working Next.js application with design system, types, and API layer established.  
**Outputs:** Configured project, Tailwind tokens, TypeScript strict, WooCommerce client (mock), Zustand stores, base layout.  
**Dependencies:** None — this is the start.  
**Success Criteria:** `next build` passes with zero errors. Root layout renders with Navbar, Footer, AnnouncementBar. No TypeScript errors in strict mode.

---

### Stage 2 — Commerce Core
**Objective:** Cart and wishlist functional with mock data. Core commerce state working end-to-end.  
**Outputs:** Cart drawer, Cart page, Wishlist page, CartStore, WishlistStore, ProductCard, all persisted to localStorage.  
**Dependencies:** Stage 1 (design system, stores, UI primitives).  
**Success Criteria:** Adding a mock product to the cart persists across page reload. Wishlist toggle persists across page reload. Cart count badge updates correctly.

---

### Stage 3 — Catalog
**Objective:** Product browsing experience — Shop page, Brand pages, filters, sort.  
**Outputs:** Shop page with filters and sort, Brand pages (all 5), ProductGrid, FilterSidebar, FilterDrawer, ActiveFilters, BrandHero.  
**Dependencies:** Stage 2 (ProductCard).  
**Success Criteria:** Shop page renders with mock products. Filters modify URL params correctly. Brand pages render with correct brand content.

---

### Stage 4 — Product Experience
**Objective:** Complete Product Detail Page with gallery, color selection, specs, and reviews.  
**Outputs:** PDP with gallery, ColorSwatches, QuantitySelector, ProductTabs, StickyMobilePDPBar, RelatedProducts, RecentlyViewed.  
**Dependencies:** Stage 3 (catalog foundation, ProductCard).  
**Success Criteria:** Color selection updates gallery and price. Add to Cart works and opens drawer. PDP renders server-side HTML correctly (visible in page source, not only after JS).

---

### Stage 5 — Checkout
**Objective:** Complete guest checkout flow from cart to WooCommerce order creation.  
**Outputs:** Checkout page, CheckoutForm with validation, /api/orders route, order confirmation page, WhatsApp fallback.  
**Dependencies:** Stage 2 (cart), Stage 1 (WooCommerce integration layer).  
**Success Criteria:** A complete order is created in WooCommerce. Form validates correctly in Arabic. WhatsApp fallback generates correctly. Cart clears on success.

---

### Stage 6 — Search
**Objective:** Instant search overlay with suggestions, recent searches, and full results page.  
**Outputs:** SearchOverlay, SearchInput, SearchSuggestions, /api/search, RecentSearches, TrendingSearches, /search page.  
**Dependencies:** Stage 1 (WooCommerce integration layer), Stage 2 (ProductCard for results).  
**Success Criteria:** Search with "brown" returns correct products. Arabic query "بني" returns same products. Recent searches persist across sessions. No-results state renders correctly.

---

### Stage 7 — Account & Wishlist Polish
**Objective:** Account dashboard with order history, address management, profile display.  
**Outputs:** Account page (all 4 tabs), OrderCard, AddressCard, AddressForm, LocalStorageBanner.  
**Dependencies:** Stage 5 (orders write to localStorage), Stage 2 (wishlist).  
**Success Criteria:** Orders placed in Stage 5 appear in Account dashboard. Address from last order pre-fills checkout form. All 4 account tabs render correctly with empty and populated states.

---

### Stage 8 — Content & SEO
**Objective:** All static content pages live. Complete SEO implementation across all routes.  
**Outputs:** About, Contact, FAQ, Shipping Policy, Returns, Privacy Policy, Terms pages. `generateMetadata` on all routes. JSON-LD on product/brand pages. Sitemap. Robots.txt.  
**Dependencies:** Stage 3 (routes exist for brand/product SEO), Stage 4 (PDP exists).  
**Success Criteria:** Google Rich Results Test passes for a product page. Sitemap is valid XML. All pages have unique Arabic meta descriptions. No `<title>` is missing.

---

### Stage 9 — QA & Hardening
**Objective:** Security review, accessibility audit, performance verification, cross-device testing.  
**Outputs:** All security checklist items verified. Lighthouse ≥ 90 mobile. All accessibility checklist items verified. E2E checkout test passing.  
**Dependencies:** All previous stages.  
**Success Criteria:** All items in §15 Security Checklist checked. All items in §16 Accessibility Checklist checked. Lighthouse mobile Performance ≥ 90, LCP < 2.5s, CLS < 0.1.

---

### Stage 10 — Launch
**Objective:** Production deployment with monitoring, analytics, and error tracking live.  
**Outputs:** Production Vercel deployment, GA4 events firing, Sentry capturing errors, Search Console submitted.  
**Dependencies:** Stage 9 (all QA passed).  
**Success Criteria:** All items in §17 Launch Readiness Checklist checked. A complete order can be placed end-to-end in production. Definition of Done (§20) fully satisfied.

---

## 3. Dependency Graph

This graph shows the strict dependency chain. Nothing lower on the graph can be built before everything above it is complete.

```
LEVEL 0 — INFRASTRUCTURE
  Next.js project init
  TypeScript strict config
  Tailwind config + design tokens (04_DESIGN_SYSTEM.md §14.2)
  ESLint + Prettier config
  .env.example + .env.local structure
  Vercel project created + dev deployment working
  Lighthouse CI configured in CI pipeline
         ↓

LEVEL 1 — TYPE SYSTEM
  src/types/woocommerce.ts    (WC DTOs — 08_DATA_MODEL.md §9)
  src/types/product.ts        (Application models — 08_DATA_MODEL.md §2)
  src/types/cart.ts           (Commerce models — 08_DATA_MODEL.md §3)
  src/types/order.ts          (Order models — 08_DATA_MODEL.md §6)
  src/types/search.ts         (Search models — 08_DATA_MODEL.md §7)
  src/types/api.ts            (API contracts — 08_DATA_MODEL.md §9)
         ↓

LEVEL 2 — CONSTANTS & CONFIG
  src/lib/constants/brands.ts
  src/lib/constants/colors.ts
  src/lib/constants/governorates.ts
  src/lib/constants/config.ts  (thresholds, limits)
  src/lib/constants/storage.ts (localStorage key registry)
  src/lib/constants/trending.ts
  src/config/index.ts          (typed env var object)
         ↓

LEVEL 3 — UTILITIES
  src/lib/utils/currency.ts    (EGP formatting)
  src/lib/utils/phone.ts       (Egyptian phone normalization)
  src/lib/utils/slugify.ts
  src/lib/utils/seo.ts         (metadata generation helpers)
         ↓

LEVEL 4 — VALIDATION SCHEMAS
  src/lib/validations/checkout.ts  (Zod — 08_DATA_MODEL.md §11.1)
  src/lib/validations/order.ts     (Zod — 08_DATA_MODEL.md §11.2)
  src/lib/validations/contact.ts   (Zod — 08_DATA_MODEL.md §11.3)
  src/lib/validations/search.ts    (Zod — 08_DATA_MODEL.md §11.6)
  src/lib/validations/woocommerce.ts (Zod runtime WC validation)
         ↓

LEVEL 5 — WOOCOMMERCE INTEGRATION LAYER
  src/lib/woocommerce/client.ts        (authenticated fetch — server-only)
  src/lib/woocommerce/transformers.ts  (WC DTOs → Application models)
  src/lib/woocommerce/products.ts
  src/lib/woocommerce/categories.ts
  src/lib/woocommerce/brands.ts
  src/lib/woocommerce/orders.ts
  src/lib/woocommerce/search.ts
         ↓

LEVEL 6 — STATE STORES
  src/store/cart.store.ts      (Zustand + persist — 08_DATA_MODEL.md §13.1)
  src/store/wishlist.store.ts  (Zustand + persist — 08_DATA_MODEL.md §13.2)
  src/store/ui.store.ts        (Zustand — 08_DATA_MODEL.md §13.3)
         ↓

LEVEL 7 — HOOKS
  src/hooks/useCart.ts
  src/hooks/useWishlist.ts
  src/hooks/useSearch.ts
  src/hooks/useLocalStorage.ts
  src/hooks/useDebounce.ts
  src/hooks/useMediaQuery.ts
  src/hooks/useRecentlyViewed.ts
         ↓

LEVEL 8 — UI PRIMITIVES (components/ui/)
  Button, IconButton, Badge, Input, Textarea,
  Select, Checkbox, Modal, Drawer, BottomSheet,
  Accordion, Tabs, Toast, Skeleton, ProgressBar
         ↓

LEVEL 9 — COMMON COMPONENTS (components/common/)
  Container, SectionHeader, Breadcrumb,
  EmptyState, ErrorState, SkeletonCard,
  TrustBar, TrustStrip, CODBadge, OriginBadge,
  WhatsAppFAB, ReviewCard, FAQAccordion, CTABanner
         ↓

LEVEL 10 — LAYOUT COMPONENTS (components/layout/)
  AnnouncementBar, Navbar, MobileHeader,
  MobileBottomNav, Footer, MinimalHeader, PageShell
         ↓

LEVEL 11 — ROOT APP SHELL
  src/app/layout.tsx       (providers, fonts, dir="rtl")
  src/providers/
  src/app/globals.css
  src/app/not-found.tsx
  src/app/error.tsx
  src/app/loading.tsx
         ↓

LEVEL 12 — PRODUCT DOMAIN COMPONENTS
  ProductBadge, PriceDisplay, RatingStars, SoldCount,
  WishlistToggle, ColorSwatches, QuantitySelector,
  ProductGallery, ProductCard, ProductTabs,
  ProductBenefits, SpecificationsTable,
  StickyMobilePDPBar, RelatedProducts, RecentlyViewed
         ↓

LEVEL 13 — SHOP DOMAIN COMPONENTS
  FilterSidebar, FilterDrawer, FilterChips,
  ActiveFilters, SortDropdown, ShopToolbar,
  ProductGrid, QuickViewModal, LoadMoreButton,
  EmptyShopState
         ↓

LEVEL 14 — CART DOMAIN COMPONENTS
  CartDrawer, CartItem, FreeShippingProgress,
  CartSummary, EmptyCartState
         ↓

LEVEL 15 — BRAND DOMAIN COMPONENTS
  BrandCard, BrandHero, RelatedBrands, BrandOriginBadge
         ↓

LEVEL 16 — PAGES (commerce)
  Homepage, Shop, Brand pages, Product pages,
  Cart page, Checkout, Order Success,
  Wishlist, Account
         ↓

LEVEL 17 — CHECKOUT DOMAIN + API ROUTES
  CheckoutForm, GovernorateSelect, OrderSummaryPanel,
  CODConfirmation, /api/orders, /api/contact,
  /api/search, /api/revalidate
         ↓

LEVEL 18 — SEARCH DOMAIN
  SearchOverlay, SearchInput, SearchSuggestions,
  RecentSearches, TrendingSearches, NoSearchResults
         ↓

LEVEL 19 — CONTENT PAGES + SEO
  FAQ, About, Contact, Policy pages
  generateMetadata on all routes
  JSON-LD structured data
  Sitemap, Robots.txt
         ↓

LEVEL 20 — QA, MONITORING, LAUNCH
  Vitest + RTL + Playwright tests passing
  Lighthouse CI green
  Analytics + error tracking live
```

**Critical path bottlenecks** — these items block the most downstream work:

1. **TypeScript types (Level 1)** — every subsequent level depends on correct types
2. **WooCommerce transformers (Level 5)** — product data shape flows into every commerce component
3. **CartStore (Level 6)** — blocks all cart UI, checkout, and order completion
4. **UI primitives (Level 8)** — blocks all component layers above
5. **ProductCard (Level 12)** — blocks Shop, Brand, Homepage, Wishlist, Search results

---

## 4. Environment Setup

### 4.1 Project Initialization

**Sequence:**

```
1. npx create-next-app@latest martal-2.0
   Options: TypeScript=yes, ESLint=yes, Tailwind=yes, src/=yes,
            App Router=yes, import alias=@/*

2. Verify next.config.ts exists (not .js)

3. Configure tsconfig.json
   Add: strict=true, noUnusedLocals=true, noUnusedParameters=true,
        exactOptionalPropertyTypes=true, noUncheckedIndexedAccess=true
   Add path aliases: @/components, @/lib, @/hooks, @/store, @/types, @/config

4. Create src/ subdirectory structure
   mkdir -p src/{app,components/{ui,layout,product,shop,cart,checkout,
   search,brand,account,wishlist,common},lib/{woocommerce,validations,
   utils,constants},hooks,store,types,config,providers}

5. Install dependencies (grouped by concern):

   # Design system
   npx shadcn@latest init
   npx shadcn@latest add button input select textarea accordion tabs badge

   # State management
   npm install zustand

   # Server state
   npm install @tanstack/react-query

   # Forms + validation
   npm install react-hook-form zod @hookform/resolvers

   # Animation
   npm install framer-motion

   # Utilities
   npm install clsx tailwind-merge lucide-react

   # Dev dependencies
   npm install -D vitest @vitejs/plugin-react jsdom
   npm install -D @testing-library/react @testing-library/user-event
   npm install -D msw playwright @playwright/test
   npm install -D @next/bundle-analyzer

   # Monitoring (install but configure later)
   npm install @sentry/nextjs
```

**Bundle size check before each install:**
Visit bundlephobia.com for every non-trivial package. Log the gzipped sizes.

| Package | Gzipped | Acceptable |
|---|---|---|
| framer-motion | ~44KB | Yes — tree-shakeable |
| zustand | ~1KB | Yes |
| @tanstack/react-query | ~13KB | Yes |
| zod | ~13KB | Yes |
| react-hook-form | ~9KB | Yes |

---

### 4.2 Tailwind Configuration

Apply the complete `tailwind.config.ts` from **04_DESIGN_SYSTEM.md §14.2** immediately after project creation. This is not optional deferred configuration — the design tokens must exist before the first component is built. Building components against default Tailwind colors and then migrating is double work.

**Order:**
1. Paste the complete config from the design system document
2. Verify `globals.css` has the CSS custom properties from §14.3
3. Test: create a throwaway component using `bg-brand-primary` and verify the burgundy renders

---

### 4.3 Environment Variables

Create `.env.local` immediately. Create `.env.example` (committed) with all keys present but values redacted.

```
# Development (.env.local — gitignored)
# Phase 1: Mock data — WooCommerce values are placeholder
WOOCOMMERCE_URL=https://admin.martal.store
WOOCOMMERCE_KEY=ck_PLACEHOLDER
WOOCOMMERCE_SECRET=cs_PLACEHOLDER
REVALIDATION_SECRET=dev-secret-change-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=+201XXXXXXXXX
```

During Phase 1 (mock data), the WooCommerce values are placeholders — the integration layer uses mock handlers via MSW instead. The environment variable structure is correct from day one so no refactoring occurs when switching to real API.

---

### 4.4 Vercel Project Setup

Create the Vercel project and connect to the Git repository before writing a single component. Reason: every push to any branch creates a preview deployment. This is the development workflow from day one — not something configured at launch.

**Steps:**
1. `vercel link` — connect to project
2. Add environment variables in Vercel dashboard (production + preview)
3. Verify preview deployment URL works
4. Configure `vercel.json` with security headers (from 06_ARCHITECTURE.md §15.2)

---

### 4.5 Lighthouse CI Setup

Configure Lighthouse CI in the first day of setup. This ensures performance regressions are caught immediately — not discovered at launch.

**`.lighthouserc.json`:**
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/", "http://localhost:3000/shop"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Note:** The initial threshold is 0.85 for performance (not the target 0.90) to account for development-mode overhead. Raise to 0.90 in Stage 9.

---

## 5. Sprint Breakdown

### Sprint 0 — Project Foundation
**Estimated effort:** 1–2 days

**Goals:**
- Project initialized, configured, and deployed to Vercel preview
- All tooling working: TypeScript strict, Tailwind tokens, Lighthouse CI
- Empty application shell that builds and deploys with zero errors

**Deliverables:**
- `next.config.ts` with security headers and image remote patterns
- `tailwind.config.ts` with complete design system tokens
- `tsconfig.json` with strict config and path aliases
- `.env.example` with all required variables
- `src/app/layout.tsx` — root layout with `dir="rtl"`, `lang="ar"`, fonts
- `src/app/globals.css` — CSS custom properties
- Vercel project linked and preview deployment live
- Lighthouse CI configured in GitHub Actions or local script
- `vitest.config.ts` — test runner configured
- `playwright.config.ts` — E2E test runner configured
- `msw` handlers directory created: `src/mocks/`

**Acceptance Criteria:**
- [ ] `npm run build` exits 0 with no TypeScript errors
- [ ] `npm run test` runs Vitest with 0 tests (configured, not broken)
- [ ] Vercel preview deployment is accessible
- [ ] `bg-brand-primary` renders the correct burgundy (#8B1A2B) in browser
- [ ] Page has `dir="rtl"` and `lang="ar"` in `<html>`
- [ ] Cairo font loads from Google Fonts (visible in Network tab)

---

### Sprint 1 — Data Layer & Stores
**Estimated effort:** 3–5 days

**Goals:**
- Complete type system established
- WooCommerce integration layer implemented against mock data (MSW)
- All three Zustand stores implemented and tested
- All Zod validation schemas defined

**Deliverables:**
- All files in `src/types/` (woocommerce.ts, product.ts, cart.ts, order.ts, search.ts, api.ts)
- All files in `src/lib/constants/` (brands, colors, governorates, config, storage)
- All files in `src/lib/utils/` (currency, phone, seo, slugify)
- All files in `src/lib/validations/` (checkout, order, contact, search, woocommerce)
- `src/lib/woocommerce/` — complete integration layer
- `src/mocks/handlers/` — MSW handlers for products, brands, search, orders
- `src/store/cart.store.ts`, `wishlist.store.ts`, `ui.store.ts`
- All files in `src/hooks/`
- `src/providers/QueryProvider.tsx`, `src/providers/AppProvider.tsx`
- Unit tests: all transformer functions, all utility functions, all store actions

**Files created:**
```
src/types/
  woocommerce.ts, product.ts, cart.ts, order.ts, search.ts, api.ts, brand.ts

src/lib/constants/
  brands.ts, colors.ts, governorates.ts, config.ts, storage.ts, trending.ts, routes.ts

src/lib/utils/
  currency.ts, phone.ts, seo.ts, slugify.ts

src/lib/validations/
  checkout.ts, order.ts, contact.ts, search.ts, woocommerce.ts

src/lib/woocommerce/
  client.ts, transformers.ts, products.ts, brands.ts, categories.ts, orders.ts, search.ts

src/mocks/
  handlers/products.ts, handlers/orders.ts, handlers/search.ts, server.ts

src/store/
  cart.store.ts, wishlist.store.ts, ui.store.ts

src/hooks/
  useCart.ts, useWishlist.ts, useSearch.ts, useLocalStorage.ts,
  useDebounce.ts, useMediaQuery.ts, useRecentlyViewed.ts

src/providers/
  QueryProvider.tsx, AppProvider.tsx

src/config/index.ts
```

**Acceptance Criteria:**
- [ ] `ProductTransformer.transform(mockWCProduct)` returns a valid `Product` with all prices as numbers
- [ ] `CartStore.addItem()` persists to localStorage and survives page reload
- [ ] `WishlistStore.toggle()` persists to localStorage
- [ ] `checkoutSchema.safeParse({phone: '010123456789'})` succeeds
- [ ] `checkoutSchema.safeParse({phone: '02012345678'})` fails with Arabic error message
- [ ] All Vitest unit tests pass with 0 failures
- [ ] `import 'server-only'` in `client.ts` — build fails if imported in a Client Component (verify this)

---

### Sprint 2 — UI Primitives & Layout
**Estimated effort:** 4–6 days

**Goals:**
- Complete UI primitive layer (Shadcn/UI reskinned to MARTAL design system)
- Complete layout system (Navbar, Footer, all shell components)
- Application shell renders correctly at 375px and 1280px

**Deliverables:**
- All `components/ui/` components with MARTAL design tokens applied
- All `components/layout/` components
- All `components/common/` components
- Root layout with all providers, AnnouncementBar, Navbar, Footer, WhatsAppFAB, MobileBottomNav
- `not-found.tsx`, `error.tsx`, `loading.tsx` — all rendering with Arabic content from Content doc §14

**Key implementation notes:**
- AnnouncementBar CSS marquee uses `animation-marquee` keyframe from Tailwind config — no Framer Motion
- MobileHeader scroll behavior (height reduction after 60px) uses `useScroll` hook from Framer Motion — test on both iOS Safari and Android Chrome
- Navbar active link states via `usePathname()` — verify RTL navigation renders right-to-left
- WhatsAppFAB: fixed position, 56px × 56px, z-index 35, uses `NEXT_PUBLIC_WHATSAPP_NUMBER` env var

**Acceptance Criteria:**
- [ ] Navbar renders with correct RTL layout: logo right, nav center (RTL order), actions left
- [ ] MobileBottomNav renders correctly at 375px; active tab highlights on route change
- [ ] AnnouncementBar scrolls horizontally
- [ ] WhatsAppFAB is visible on mobile and desktop
- [ ] Footer accordion works on mobile (tap to expand link groups)
- [ ] `not-found.tsx` renders Arabic 404 content from Content doc §14.1
- [ ] All UI primitives render with MARTAL design tokens (verify `bg-brand-primary` on Button)
- [ ] No console errors in browser

---

### Sprint 3 — Product Catalog
**Estimated effort:** 5–8 days

**Goals:**
- ProductCard built to spec (the most critical reused component)
- Shop page functional with mock data, filters, sort, load more
- All 5 Brand pages functional
- QuickView modal working

**Deliverables:**
- `components/product/`: ProductCard, ProductBadge, PriceDisplay, RatingStars, SoldCount, WishlistToggle, ColorSwatches (card variant), SkeletonCard
- `components/shop/`: ProductGrid, FilterSidebar, FilterDrawer, FilterChips, ActiveFilters, SortDropdown, ShopToolbar, QuickViewModal, LoadMoreButton, EmptyShopState
- `components/brand/`: BrandCard, BrandHero, RelatedBrands, BrandOriginBadge
- `src/app/(shop)/shop/page.tsx` — SSR with URL params
- `src/app/(shop)/brand/[slug]/page.tsx` — ISR
- Homepage hero, TrustBar, BrandShowcase, BestsellersSection (all with mock data)
- `src/app/(marketing)/page.tsx` — ISR

**ProductCard implementation is the most important work in this sprint.** It must:
- Handle all 8 reuse contexts via props (§07_COMPONENT_MAP.md §8)
- Render correctly with `priority={true}` for LCP images
- Wishlist toggle functional (WishlistStore integration)
- Quick View trigger fires UIStore.openQuickView()
- Aspect ratio 3:4 via `aspect-ratio: 3/4` CSS class

**Acceptance Criteria:**
- [ ] ProductCard renders at 375px with correct 3:4 ratio and no layout shift
- [ ] ProductCard's wishlist toggle persists across page reload
- [ ] Shop page filters update URL params and re-render grid
- [ ] `?brand=hypnose` URL shows only Hypnose products
- [ ] `?sort=price_asc` sorts products low-to-high
- [ ] ActiveFilters chips render; removing a chip updates URL
- [ ] All 5 brand pages render with correct Arabic tagline
- [ ] FilterDrawer opens from bottom (mobile) on filter trigger
- [ ] QuickViewModal opens with correct product data
- [ ] EmptyShopState renders when filters return 0 results
- [ ] No TypeScript errors

---

### Sprint 4 — Product Detail Page
**Estimated effort:** 4–6 days

**Goals:**
- Complete PDP with all sections
- Gallery swipe on mobile
- Color selection updates gallery and price
- Add to Cart functional end-to-end

**Deliverables:**
- `components/product/`: ProductGallery (desktop zoom + mobile carousel), ColorSwatches (PDP variant), QuantitySelector, ProductTabs (all 4 tabs), SpecificationsTable, HowToUseTab, ReviewsTab, ProductBenefits, DeliveryEstimate, StickyMobilePDPBar, RelatedProducts, RecentlyViewed
- `src/app/(shop)/product/[slug]/page.tsx` — ISR with `generateStaticParams`
- `src/app/(shop)/product/[slug]/loading.tsx` — skeleton

**Server/Client split to implement correctly:**
- Page component (Server): fetches product + variations, renders title, subtitle, specs, trust strip
- ProductGallery (Client): drag/swipe via Framer Motion `drag` prop
- ColorSwatches (Client): selection state, triggers gallery image update + price update
- PriceDisplay (Client): listens to selected variation state
- AddToCartButton (Client): CartStore.addItem() + UIStore.openCartDrawer()
- StickyMobilePDPBar (Client): scroll detection via Intersection Observer on the main CTA button

**Acceptance Criteria:**
- [ ] Product title and description visible in page source HTML (server-rendered)
- [ ] Swiping gallery on mobile changes image (Framer Motion drag works on touch)
- [ ] Selecting a color swatch updates gallery to show that variant's images
- [ ] Selecting a color swatch with a different price updates the displayed price
- [ ] Add to Cart opens cart drawer with the correct product, color, and price
- [ ] StickyMobilePDPBar appears only after user scrolls past the main Add to Cart button
- [ ] Out-of-stock swatch is visually disabled and not tappable
- [ ] ProductTabs switch correctly; Reviews tab shows mock reviews
- [ ] RecentlyViewed persists after navigating away and back
- [ ] `generateStaticParams` pre-generates top 20 products at build time

---

### Sprint 5 — Checkout Flow
**Estimated effort:** 5–7 days

**Goals:**
- Complete single-page checkout with COD
- WooCommerce order creation via API route
- Order confirmation page
- WhatsApp fallback on failure

**Deliverables:**
- `components/checkout/`: CheckoutForm, CheckoutFormField, GovernorateSelect, OrderSummaryPanel, OrderSummaryAccordion, CODConfirmation, CheckoutHeader
- `src/app/(commerce)/checkout/page.tsx` — CSR
- `src/app/(commerce)/checkout/layout.tsx` — MinimalHeader, no footer
- `src/app/(commerce)/order-success/page.tsx`
- `src/app/api/orders/route.ts` — POST handler
- Cart page — `src/app/(commerce)/cart/page.tsx`
- `components/cart/` completion (CartItem full variant, all cart page components)

**Critical implementation detail — cart price validation:**
On checkout page mount, fetch current prices for all cart items from `/api/prices` (or directly via TanStack Query using product slugs). Compare with stored `CartItem.price`. If delta > 5%, show `CartStalenessWarning` component above the form. This prevents order price discrepancies.

**WooCommerce mock for checkout (Phase 1):**
MSW handler for `POST /api/orders` returns `{ orderId: 9999, orderNumber: "ORD-9999" }` without calling real WooCommerce. The real API call is wired in Phase 2.

**Acceptance Criteria:**
- [ ] Checkout page redirects to `/shop` if cart is empty
- [ ] Form validates in real-time; error messages appear in Arabic below each field
- [ ] Phone "01012345678" passes validation; "02012345678" fails with Arabic error
- [ ] "تأكيدي الطلب" button is disabled while form has errors
- [ ] Submitting a valid form creates an order (mock response in Phase 1)
- [ ] Cart clears after successful order
- [ ] Order appears in `localStorage:martal_orders_v2` after success
- [ ] `/order-success` page shows order number and WhatsApp tracking link
- [ ] If API fails, WhatsApp fallback button appears with pre-filled order details
- [ ] Cart page shows FreeShippingProgress correctly at multiple subtotal values
- [ ] CartItem quantity can be changed; price updates immediately

---

### Sprint 6 — Search
**Estimated effort:** 3–5 days

**Goals:**
- Full search overlay with all states
- Arabic/English synonym resolution working
- Recent searches persisting
- Full results page

**Deliverables:**
- `components/search/`: all search components
- `src/app/api/search/route.ts`
- `src/app/(shop)/search/page.tsx`
- `src/lib/woocommerce/search.ts` with synonym map

**Acceptance Criteria:**
- [ ] Search overlay opens on SearchTrigger click; input autofocuses
- [ ] Typing "brown" shows product and color suggestions within 200ms (debounced)
- [ ] Typing "بني" shows same products as "brown"
- [ ] Typing "hypnoz" shows Hypnose brand suggestion (typo tolerance via WC search)
- [ ] Recent searches persist and appear on overlay open
- [ ] Clicking a recent search repopulates input
- [ ] No-results state shows trending searches
- [ ] Pressing Enter navigates to `/search?q=...` full results page
- [ ] Search overlay closes on backdrop click and Escape key

---

### Sprint 7 — Account & Wishlist
**Estimated effort:** 2–4 days

**Goals:**
- Account dashboard with all 4 tabs
- Orders from Sprint 5 visible in account
- Address pre-fills checkout
- Wishlist page complete

**Deliverables:**
- `components/account/`: all account components
- `src/app/(commerce)/account/page.tsx`
- `src/app/(commerce)/wishlist/page.tsx`
- Integration: address from account pre-fills checkout form

**Acceptance Criteria:**
- [ ] Orders placed in Sprint 5 appear in Account → Orders tab
- [ ] LocalStorageBanner renders with v2.0 limitation message
- [ ] Editing address in Account → Addresses tab updates stored address
- [ ] Updated address pre-fills checkout form on next visit
- [ ] Wishlist page shows all wishlisted products with fresh data
- [ ] "Add all to cart" moves all wishlist items to cart and opens drawer
- [ ] Empty states for all tabs render with correct Arabic content

---

### Sprint 8 — Content, SEO & Static Pages
**Estimated effort:** 4–5 days

**Goals:**
- All static content pages implemented
- Complete SEO layer across all routes
- Sitemap and robots.txt live

**Deliverables:**
- All content pages: FAQ, About, Contact, Shipping Policy, Returns, Privacy, Terms
- `generateMetadata` on every route
- JSON-LD structured data on Product, Brand, FAQ, Homepage
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- Contact form WhatsApp integration
- `/api/contact/route.ts`
- `/api/revalidate/route.ts`

**Acceptance Criteria:**
- [ ] `<title>` on every page is unique and in Arabic
- [ ] Google Rich Results Test passes for a product page (use `https://search.google.com/test/rich-results`)
- [ ] `sitemap.xml` is valid XML with all product and brand URLs
- [ ] `robots.txt` disallows `/api/`, `/checkout`, `/account`, `/order-success`
- [ ] FAQ page has `FAQPage` JSON-LD schema
- [ ] Contact form generates correct WhatsApp URL on submit
- [ ] All content pages have prose-width layout (`max-w-prose`)

---

### Sprint 9 — QA, Performance & Hardening
**Estimated effort:** 5–8 days

**Goals:**
- Security checklist §15 fully verified
- Accessibility checklist §16 fully verified
- Lighthouse mobile Performance ≥ 90 on homepage and product page
- E2E checkout test passing with real WooCommerce (Phase 3)

**Deliverables:**
- All Playwright E2E tests passing
- Lighthouse CI threshold raised from 0.85 to 0.90
- Sentry configured and receiving test errors
- GA4 events firing and verified in DebugView
- All security checklist items checked
- All accessibility checklist items checked

**Acceptance Criteria:** See §17 Launch Readiness Checklist — all items checked.

---

## 6. Detailed Build Order

The 60-step sequential build order for a solo developer. Each step has a defined output. No step begins before the previous is complete.

```
FOUNDATION (Days 1–3)
01. npx create-next-app martal-2.0 (TypeScript, App Router, src/, Tailwind)
02. Configure tsconfig.json — strict mode, path aliases
03. Apply tailwind.config.ts from 04_DESIGN_SYSTEM.md §14.2
04. Apply globals.css from 04_DESIGN_SYSTEM.md §14.3
05. Create folder structure (all src/ subdirectories)
06. Install all dependencies (see §4.1)
07. Configure .env.local and .env.example
08. Create Vercel project, link repo, verify preview deployment
09. Configure Lighthouse CI (.lighthouserc.json)
10. Configure Vitest (vitest.config.ts)
11. Configure Playwright (playwright.config.ts)
12. Setup MSW (src/mocks/server.ts, src/mocks/handlers/)

TYPE SYSTEM (Days 3–5)
13. src/types/woocommerce.ts — all WC DTOs
14. src/types/product.ts, brand.ts
15. src/types/cart.ts, order.ts
16. src/types/search.ts, api.ts

CONSTANTS & CONFIG (Days 5–6)
17. src/lib/constants/brands.ts (5 brand configs with Arabic taglines from Content §3)
18. src/lib/constants/colors.ts (color name → hex mapping)
19. src/lib/constants/governorates.ts (27 governorates with codes and delivery days)
20. src/lib/constants/config.ts (FREE_SHIPPING_THRESHOLD=800, MAX_CART_ITEMS=10, etc.)
21. src/lib/constants/storage.ts (all localStorage key exports)
22. src/lib/constants/trending.ts (trending search terms)
23. src/config/index.ts (typed env var object — validates required vars on startup)

UTILITIES & VALIDATION (Days 6–8)
24. src/lib/utils/currency.ts (formatEGP function)
25. src/lib/utils/phone.ts (normalizeEgyptianPhone, isValidEgyptianPhone)
26. src/lib/utils/seo.ts (generateProductMeta, generateBrandMeta helpers)
27. src/lib/validations/woocommerce.ts (Zod WC DTO schemas)
28. src/lib/validations/checkout.ts (full checkout Zod schema)
29. src/lib/validations/order.ts (API route order request schema)
30. src/lib/validations/contact.ts, search.ts

INTEGRATION LAYER (Days 8–12)
31. src/lib/woocommerce/client.ts (import 'server-only', authenticated fetch)
32. src/lib/woocommerce/transformers.ts (ProductTransformer, VariationTransformer, BrandTransformer)
33. src/mocks/handlers/products.ts (MSW product mock data — 8 mock products across 5 brands)
34. src/lib/woocommerce/products.ts (getProducts, getProduct, getProductVariations, getBestsellers)
35. src/lib/woocommerce/brands.ts (getBrands, getBrand)
36. src/lib/woocommerce/orders.ts (createOrder)
37. src/lib/woocommerce/search.ts (searchProducts with synonym map)
38. Write Vitest tests for all transformers (critical — §14.2)

STORES & HOOKS (Days 12–14)
39. src/store/cart.store.ts (all actions + selectors + persist middleware)
40. src/store/wishlist.store.ts
41. src/store/ui.store.ts
42. src/providers/QueryProvider.tsx, AppProvider.tsx
43. All hooks in src/hooks/
44. Write Vitest tests for all store actions (critical — §14.2)

UI PRIMITIVES (Days 14–18)
45. Apply MARTAL design tokens to all Shadcn/UI components
    (Button variants, Input states, Select, Textarea, Modal, Drawer, BottomSheet,
    Accordion, Tabs, Toast, Skeleton, ProgressBar, Separator)

LAYOUT & COMMON (Days 18–23)
46. AnnouncementBar (CSS marquee)
47. Navbar (Server shell) + NavActions (Client — cart/wishlist/search)
48. MobileHeader (Client — scroll behavior)
49. MobileBottomNav (Client — active route)
50. Footer (Server — accordion on mobile)
51. MinimalHeader (Server — checkout)
52. Container, Section, PageShell
53. All components/common/ (EmptyState, ErrorState, SkeletonCard, Breadcrumb,
    TrustBar, TrustStrip, CODBadge, WhatsAppFAB, ReviewCard, FAQAccordion, CTABanner)
54. Root layout: src/app/layout.tsx (dir=rtl, lang=ar, fonts, providers)
55. src/app/not-found.tsx, error.tsx, loading.tsx

PRODUCT DOMAIN (Days 23–30)
56. ProductBadge, PriceDisplay, RatingStars, SoldCount (Server — pure display)
57. WishlistToggle (Client — WishlistStore)
58. ColorSwatches — card variant (Client)
59. ProductCard (Client) — THE most important component
60. SkeletonCard (Server — matches ProductCard dimensions exactly)
```

*(Steps 61–120 continue through Shop → PDP → Checkout → Search → Account → SEO → QA — these are detailed in §7 and §8.)*

---

## 7. Component Implementation Order

### Tier 1 — Design System Primitives (no dependencies)
Must be complete before any higher tier begins.

```
Button (all variants: primary, secondary, ghost, text)
IconButton
Badge (all variants: bestseller, new, sale, out-of-stock)
Input (all states: default, focus, error, success, disabled)
Textarea (same states as Input)
Select (native, MARTAL-styled)
Checkbox, Radio
Modal (with backdrop + focus trap)
Drawer (side — RTL: slides from left)
BottomSheet (mobile — slides from bottom)
Accordion (Shadcn/UI + MARTAL tokens)
Tabs (Shadcn/UI + MARTAL tokens)
Toast (success, error, info variants)
Skeleton (base — used as building block for SkeletonCard)
ProgressBar (for FreeShippingProgress)
Separator
```

**Test requirement:** Every UI primitive with interactive behavior (Button states, Input focus/error, Accordion open/close) has a Vitest + RTL test.

---

### Tier 2 — Layout Components (depends on Tier 1)

```
Container (max-width variants)
Section (padding variants)
PageShell (top padding for sticky header)
AnnouncementBar (CSS animation)
Navbar + NavActions
MobileHeader
MobileBottomNav
Footer
MinimalHeader
```

---

### Tier 3 — Common Components (depends on Tier 1–2)

```
Breadcrumb
SectionHeader (title + subtitle + "see all" link)
EmptyState (all 7 variant configurations)
ErrorState (all error type configurations)
SkeletonCard (MUST match ProductCard dimensions)
TrustBar, TrustStrip
CODBadge, OriginBadge
WhatsAppFAB
ReviewCard
FAQAccordion (teaser and full variants)
CTABanner
```

**Build SkeletonCard only after ProductCard is sized.** The skeleton must be dimensionally identical to prevent CLS.

---

### Tier 4 — Product Domain (depends on Tier 1–3 + stores + types)

Build in this exact order — each depends on the previous:

```
1. ProductBadge (Server — simplest, no deps)
2. RatingStars (Server — pure display)
3. SoldCount (Server — pure display)
4. PriceDisplay (Client — needs variation state)
5. WishlistToggle (Client — needs WishlistStore)
6. ColorSwatches, card variant (Client — selection state)
7. ProductCard (Client — composes all above) ← CRITICAL MILESTONE
8. SkeletonCard (Server — now that ProductCard is sized)
9. QuantitySelector (Client — +/- with min/max)
10. ProductGallery (Client — Framer Motion drag + desktop zoom)
11. ColorSwatches, PDP variant (Client — larger, updates gallery)
12. ProductTabs (Client — tab switching)
   → DescriptionTab (Server)
   → SpecificationsTable (Server)
   → HowToUseTab (Server)
   → ReviewsTab (Client — lazy loaded)
13. ProductBenefits (Server)
14. DeliveryEstimate (Server)
15. StickyMobilePDPBar (Client — Intersection Observer)
16. RelatedProducts (Server shell — ProductCard grid)
17. RecentlyViewed (Client — UIStore)
```

---

### Tier 5 — Shop Domain (depends on ProductCard)

```
ProductGrid (Server shell)
FilterSidebar (Client — URL params)
FilterDrawer (Client — BottomSheet + same logic as sidebar)
FilterChip (Client — URL param removal)
ActiveFilters (Client — URL params)
SortDropdown (Client — URL params)
ShopToolbar (Client — result count + sort + filter trigger)
LoadMoreButton (Client — URL page param)
EmptyShopState (uses EmptyState + ProductCard for fallback)
QuickViewModal (Client — UIStore + CartStore + Modal)
```

---

### Tier 6 — Cart Domain (depends on Tier 4 + CartStore)

```
CartItem, drawer variant (Client)
CartItem, page variant (Client — larger)
FreeShippingProgress (Client — CartStore.subtotal())
CartSummary (Client — CartStore)
EmptyCartState (uses EmptyState)
CartDrawer (Client — UIStore.cartDrawerOpen + all above)
```

---

### Tier 7 — Brand Domain (depends on Tier 4)

```
BrandOriginBadge (Server)
BrandCard (Server)
BrandHero (Server — brand data from props)
RelatedBrands (Server — BrandCard row)
```

---

### Tier 8 — Checkout Domain (depends on Tier 6 + validation)

```
CheckoutFormField (Client — RHF field + Zod error)
GovernorateSelect (Client — native select + RHF)
OrderReviewList (Client — CartStore read-only)
OrderSummaryPanel (Client — CartStore)
OrderSummaryAccordion (Client — mobile collapsed variant)
CODConfirmation (Server — static trust copy)
CheckoutForm (Client — RHF + all fields + /api/orders)
```

---

### Tier 9 — Search Domain (depends on /api/search + ProductCard)

```
SearchInput (Client — controlled + autofocus)
RecentSearchItem (Client)
RecentSearches (Client — localStorage)
TrendingSearchItem (Server-renderable — static config)
TrendingSearches (Server)
SearchProductSuggestion (Client — thumbnail + highlight)
SearchBrandSuggestion (Client)
SearchColorSuggestion (Client)
SearchSuggestions (Client — TanStack Query)
NoSearchResults (Server — static + WhatsApp CTA)
SearchOverlay (Client — UIStore.searchOpen + all above)
```

---

## 8. Page Implementation Order

Pages are built in dependency order. Each page depends on the components it contains.

### 1. Homepage (`/`) — Sprint 3, ISR

**Why first:** Validates that the layout shell, ProductCard, BrandCard, and WooCommerce data fetching all work together before building more complex pages.

Build order within the page:
1. Static sections (HeroSection, TrustBar, WhyMARTAL) — no data required
2. BrandShowcaseSection — static config data
3. BestsellersSection — first real WooCommerce data fetch (mocked in Phase 1)
4. ReviewsSection — mock reviews
5. FAQPreviewSection — static content
6. FinalCTABanner — static

---

### 2. Shop (`/shop`) — Sprint 3, SSR

**Why second:** Builds on ProductCard and validates the filter/URL param architecture.

Complexity: highest of all pages. Implement:
1. Basic grid render with mock products (no filters)
2. Add FilterSidebar (desktop)
3. Add SortDropdown
4. Add FilterDrawer (mobile)
5. Add ActiveFilters with chip removal
6. Add LoadMore
7. Add EmptyShopState

---

### 3. Brand Pages (`/brand/[slug]`) — Sprint 3, ISR

**Why third:** Shares most Shop page infrastructure. Brand pages are the same as Shop but with a locked brand filter and a hero section. Adding them after Shop is minimal work.

---

### 4. Product Detail Page (`/product/[slug]`) — Sprint 4, ISR

**Why fourth:** Requires ProductGallery, ColorSwatches, and the cart integration — all built after the shop infrastructure proves out.

---

### 5. Cart Page (`/cart`) — Sprint 5, CSR

**Why fifth:** Requires CartStore to be thoroughly tested first. Builds on CartItem (drawer variant was already built in Tier 6 — reuse it as a prop variant).

---

### 6. Checkout (`/checkout`) — Sprint 5, CSR

**Why sixth:** Directly depends on Cart. Cannot be tested without a working cart.

---

### 7. Order Success (`/order-success`) — Sprint 5, CSR

**Why seventh:** Immediate successor to Checkout. Build in the same sprint.

---

### 8. Search (`/search`) — Sprint 6, SSR

**Why eighth:** Can be built in parallel with Checkout, but search requires the API route which requires the WooCommerce search integration — put it after Checkout to avoid context-switching.

---

### 9. Wishlist (`/wishlist`) — Sprint 7, CSR

**Why ninth:** Requires ProductCard (done) and WishlistStore (done). Low complexity. Build after Checkout because it's lower conversion priority.

---

### 10. Account (`/account`) — Sprint 7, CSR

**Why tenth:** Requires orders (from Checkout sprint). Build immediately after Wishlist.

---

### 11–17. Content Pages — Sprint 8, SSG

FAQ, About, Contact, Shipping Policy, Returns, Privacy, Terms. Build all in Sprint 8 because they share a prose layout and involve no new components — only content from the Content document (05).

---

## 9. WooCommerce Integration Plan

### Phase 1 — Mock Data (Sprints 0–6)

WooCommerce does not need to be running. MSW intercepts all API calls.

**MSW mock data requirements:**
- 8 mock products: 2 per brand (Hypnose × 2, Labella × 2, FXEyes × 2, ElAmore × 1, ICONIC × 1)
- Each product has 3–4 color variations
- Mock variations have different prices to test per-variant pricing display
- 2 mock products are "on sale" (to test sale badge and discount display)
- 1 mock product is "out of stock" (to test out-of-stock swatch)
- Mock order response returns `{ orderId: 9999, orderNumber: "ORD-9999" }`

**MSW setup in Next.js:**
MSW in App Router requires a service worker in the browser for client components, and a node server for server components and API routes. Use `msw/node` for server-side mocking, `msw/browser` for client-side.

**Phase 1 acceptance:** Every page renders with mock data. No real WooCommerce calls are made.

---

### Phase 2 — Real API Connection (Sprint 5, mid-integration)

**Prerequisites:**
- WooCommerce is live with at least 5 real products (one per brand)
- WooCommerce consumer key and secret configured
- Products have correct attributes: `pa_color` with color name values
- Products are tagged with: `bestseller`, `new`, `sale` as appropriate
- Brand categories exist in WooCommerce with correct slugs

**Transition steps:**
1. Add real credentials to `.env.local`
2. Remove MSW interception for products endpoint
3. Run the app — verify products load from real WooCommerce
4. Check that prices are numbers (transformer working)
5. Check that brand is resolved from categories
6. Check that badge is resolved from tags
7. Place a test order — verify it appears in WooCommerce admin
8. Remove remaining MSW handlers one by one as each integration is verified

**Phase 2 rollback:** If WooCommerce is unavailable, re-enable MSW handlers. The mock data layer is never deleted — it remains available for local development.

---

### Phase 3 — Validation & Hardening (Sprint 9)

**Checklist:**
- [ ] All 27 Egyptian governorates appear in the checkout dropdown
- [ ] An order placed from the frontend appears in WooCommerce with correct billing data
- [ ] Product price changes in WooCommerce are reflected within 5 minutes (ISR revalidation)
- [ ] Brand page cache clears when a product in that brand is updated (webhook)
- [ ] `/api/revalidate` webhook endpoint rejects requests with wrong secret
- [ ] Rate limiting on `/api/orders`: 11th request from same IP returns 429
- [ ] WooCommerce credentials are not visible in any client-side bundle (verify with `npm run build && grep -r "ck_" .next/`)

---

### Phase 4 — Production Hardening (pre-launch)

- Switch all environment variables in Vercel dashboard from development to production values
- Configure WooCommerce webhook to point to production `/api/revalidate` URL
- Verify ISR works in production (product change → cache clears within 5 minutes)
- Load test: simulate 50 concurrent product page requests via Vercel's load testing

---

## 10. Search Implementation Plan

### Step 1 — Synonym Map (before any search UI)

Implement `lib/woocommerce/search.ts` with the complete synonym map from 05_CONTENT.md §12.2 and 06_ARCHITECTURE.md §10.2. Write Vitest tests for synonym resolution before building any UI:

```
Test: resolveQuery('بني') === 'brown'
Test: resolveQuery('هيبنوز') === 'hypnose'
Test: resolveQuery('رمادي') === 'gray'
Test: resolveQuery('عروسة') includes 'bridal'
```

### Step 2 — API Route

`/api/search` route validates query param, calls `searchProducts()`, returns `SearchSuggestionsResponse`. Test with `curl "localhost:3000/api/search?q=brown"` before building any UI.

### Step 3 — Search Overlay (empty state)

Build the overlay shell and empty state (recent searches + trending) before connecting to the API. Verify UIStore.openSearch/closeSearch works. Verify ESC key closes overlay.

### Step 4 — Live Suggestions

Connect SearchInput to TanStack Query via `useSearch` hook. Verify debounce (200ms) works — type rapidly and confirm only one API call fires per debounce window.

### Step 5 — Recent Searches

Wire `localStorage:martal_recent_searches_v2` read/write. Verify entries persist and evict at max 8.

### Step 6 — Full Results Page

`/search?q=...` page uses SSR (every query unique). Displays ProductGrid with search results. Shares FilterSidebar/SortDropdown with Shop page.

### Future: Algolia Migration Path

When search volume justifies Algolia:
1. Install `algoliasearch`
2. Create `lib/algolia/search.ts` with same interface as `lib/woocommerce/search.ts`
3. Replace the import in `/api/search/route.ts`
4. Zero component changes required

---

## 11. Checkout Implementation Plan

Checkout is the highest-risk feature in the application. Any bug here directly loses revenue. Build it methodically.

### Step 1 — Form Structure (no submission)

Build the form UI with all fields, labels, and placeholder text from the Content document. No validation, no submission. Just HTML structure. Verify RTL layout: labels right-aligned, inputs right-to-left, error messages below fields.

### Step 2 — React Hook Form Integration

Wire all fields to React Hook Form. No Zod yet. Verify that `formState.isValid` is `false` on load and `true` when all fields have values.

### Step 3 — Zod Validation

Add `@hookform/resolvers/zod` and connect `checkoutSchema`. Test:
- Empty form: all required field errors show in Arabic
- Phone `01012345678`: valid
- Phone `02012345678`: Arabic error "يبدأ بـ 010 أو 011 أو 012 أو 015"
- Governorate not selected: "اختاري محافظتك من القائمة"

### Step 4 — Order Summary

Implement OrderSummaryPanel (desktop) and OrderSummaryAccordion (mobile). Verify it reads correctly from CartStore. CartSummary components from cart domain are already built — reuse them.

### Step 5 — API Route (mock)

`/api/orders/route.ts` validates the request body with Zod. In Phase 1, returns mock `{ orderId: 9999, orderNumber: "ORD-9999" }`. This is sufficient to test the full client-side flow.

### Step 6 — Success Flow

On mock success:
1. `CartStore.clearCart()`
2. Build `Order` object from form data + cart items
3. Prepend to `localStorage:martal_orders_v2`
4. Navigate to `/order-success?id=9999&number=ORD-9999`
5. Verify order appears in Account dashboard

### Step 7 — Failure Flow

Test with a mock that returns 503. Verify:
- Cart is NOT cleared
- Toast shows Arabic error
- WhatsApp fallback button appears with pre-filled order details
- "Try again" button resubmits without requiring re-entry of form data

### Step 8 — Real WooCommerce (Phase 2)

Replace mock response with real `lib/woocommerce/orders.createOrder()` call. Place a real test order. Verify it appears in WooCommerce admin with correct:
- Customer name and phone
- Governorate in `billing.state`
- Payment method: `cod`
- All line items
- Source meta: `martal-2.0-web`

### Step 9 — Cart Price Validation

Implement the staleness check on checkout mount:
1. Extract `{ productId, variationId, price }` from each CartItem
2. Fetch current prices via a batch API call
3. Compare. If delta > 5% on any item, show `CartStalenessWarning`
4. Do not block checkout — warn the user and let them proceed

### Step 10 — WhatsApp Integration

Ensure the pre-filled WhatsApp URL template produces a parseable message. Test the actual WhatsApp link on a real mobile device — not just in browser.

---

## 12. SEO Implementation Plan

SEO is not a final sprint. The following items are implemented **in the same sprint as the page they belong to**.

### Sprint 3 (Homepage, Shop, Brand pages)

**Homepage:**
```
generateMetadata → title: "MARTAL — عدسات ملونة كورية أصلية | مصر"
description: [from Content §16.1]
openGraph: type website, locale ar_EG
JSON-LD: Organization schema
```

**Brand pages:**
```
generateMetadata → async, fetches brand data
title: "عدسات [Brand] الملونة الكورية | MARTAL"
description: [from Content §16.2 template]
JSON-LD: BreadcrumbList
```

### Sprint 4 (Product pages)

```
generateMetadata → async, fetches product data
title: "[product.name] — عدسة ملونة كورية | MARTAL"
description: [from Content §16.3 template — includes price]
openGraph: type website, product image
canonical: absolute URL
JSON-LD: Product schema (name, brand, offers, aggregateRating)
JSON-LD: BreadcrumbList
generateStaticParams: pre-generates top 20 slugs
```

**Product SEO test:** After building the first product page, test immediately with Google Rich Results Test (`https://search.google.com/test/rich-results`). Fix any issues before building more pages.

### Sprint 8 (Content pages + infrastructure)

**FAQ page:**
```
generateMetadata
JSON-LD: FAQPage schema with all 30+ Q&As
All questions from Content §11 included in schema
```

**Sitemap (`src/app/sitemap.ts`):**
```
Fetches all product slugs + all brand slugs
Returns MetadataRoute.Sitemap with priorities:
  homepage: 1.0, shop: 0.9, products: 0.8,
  brands: 0.7, content: 0.6
```

**Robots (`src/app/robots.ts`):**
```
Allow: /
Disallow: /api/, /checkout, /account, /order-success
Sitemap: https://martal.store/sitemap.xml
```

### Arabic SEO Verification Checklist

- [ ] `<html lang="ar" dir="rtl">` present on every page
- [ ] Arabic `<meta name="description">` on every page (check in page source, not just Devtools)
- [ ] Brand names appear in both Arabic and Latin in metadata: "عدسات Hypnose الملونة"
- [ ] No `<title>` contains only English content on any Arabic-primary page
- [ ] Canonical URL is absolute (https://...) on every page
- [ ] No duplicate titles across pages

---

## 13. Performance Plan

### 13.1 Performance Budget

Defined in the Architecture document (06 §14.1). This section covers *enforcement* — how you stay within budget during development.

| Metric | Target | Fail Threshold |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 90 | < 85 |
| LCP | < 2.5s | > 3.0s |
| CLS | < 0.1 | > 0.15 |
| INP | < 200ms | > 300ms |
| JS bundle (initial load) | < 150KB gzipped | > 200KB |
| JS bundle (per route chunk) | < 80KB gzipped | > 100KB |
| Hero/LCP image | < 100KB WebP | > 150KB |

---

### 13.2 Lighthouse CI Enforcement

Lighthouse CI runs on every push. Configured in `.lighthouserc.json` (see §4.5). **A push that drops performance below the fail threshold must be fixed before the next sprint begins.** Performance debt compounds and is expensive to repay later.

**Development workflow:**
1. Build feature
2. `npm run build && npm run lighthouse` (local check)
3. Fix any regressions before committing
4. Push — CI confirms

**The "Lighthouse Sprint Tax" rule:** If Lighthouse CI fails, the current sprint does not close until the failure is resolved. This is non-negotiable.

---

### 13.3 Bundle Size Monitoring

**`@next/bundle-analyzer`** is configured and run manually whenever a new dependency is added:

```bash
ANALYZE=true npm run build
```

This opens the bundle visualizer. Check:
- Is the new library tree-shaken correctly?
- Is framer-motion being imported selectively or as a barrel?
- Are any unexpectedly large modules appearing in the initial bundle?

**Target:** Framer Motion should contribute < 15KB to the initial bundle when imported selectively. If it shows > 40KB, barrel imports are present — fix immediately.

---

### 13.4 Image Optimization Workflow

All product images come from WooCommerce. WooCommerce stores images on its own domain. The `next/image` component handles optimization, but the workflow must be correct:

**Configuration in `next.config.ts`:**
```
images: {
  remotePatterns: [
    { hostname: 'admin.martal.store' }
  ],
  formats: ['image/avif', 'image/webp']
}
```

**Per-component image rules:**

| Surface | `sizes` prop | `priority` |
|---|---|---|
| Hero image | `100vw` | `true` |
| ProductCard (first 4 in grid) | `(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw` | `true` |
| ProductCard (rest) | same sizes | `false` (lazy) |
| PDP main image | `(max-width: 768px) 100vw, 50vw` | `true` |
| Brand hero image | `100vw` | `true` |

**Image audit (Sprint 9):**
Open Chrome DevTools → Network → Filter by Img. Verify:
- No images are downloaded larger than their display size
- Hero image LCP payload < 100KB
- Product card images load as WebP

---

### 13.5 Core Web Vitals During Development

**LCP monitoring:** The LCP element is almost always the hero image or the first product image. If it changes to a text element, something is wrong with image loading. Check with Chrome DevTools Performance panel after every Sprint.

**CLS prevention rules:**
1. All images have `width` and `height` props (or `aspect-ratio` class) — no layout shift during image load
2. `SkeletonCard` must match `ProductCard` dimensions exactly — no shift when content loads
3. Fonts use `display: 'swap'` — text may shift when font loads, but FOUT is acceptable; FOIT (invisible text) is not
4. No dynamically injected content above existing content — announcements, toasts, and notifications go below or in fixed position

**INP monitoring:** In Sprint 9, use Chrome's Interaction to Next Paint devtools panel. Test the critical interactions:
- "Add to Cart" tap → cart drawer opens
- Color swatch selection → gallery and price update
- Filter toggle → grid update
These should all resolve in < 200ms.

---

### 13.6 Performance Regression Prevention

**Rules applied throughout development:**

1. **Never import an entire library when you need one function.** `import { motion } from 'framer-motion'` not `import * as Framer from 'framer-motion'`.

2. **Lazy load heavy components that are below the fold.** `next/dynamic` for ProductTabs (especially ReviewsTab) — loaded only when the user taps the tab.

3. **Never add a `useEffect` that runs on every render without a dependency array.** This is an INP killer.

4. **Every `<Suspense>` boundary has a meaningful skeleton fallback.** An empty fallback causes CLS when content loads. A correctly-sized skeleton does not.

5. **The search overlay is mounted once, not remounted on open.** `display: none` equivalent is cheaper than unmount/remount for a component with a TanStack Query cache.

---

## 14. Testing Strategy

### 14.1 Testing Stack

| Tool | Purpose | When Used |
|---|---|---|
| Vitest | Unit tests — transformers, utilities, stores, validation | Sprint 1 + as each module is built |
| React Testing Library | Component tests — behavior, not implementation | Sprint 2+ as each component is built |
| MSW | API mocking for component and integration tests | All phases |
| Playwright | E2E tests — critical user journeys | Sprint 5 (checkout) + Sprint 9 (full QA) |

---

### 14.2 Risk-Based Testing Priority

Test what can break revenue, in order of impact:

**P1 — Test these before moving to the next sprint:**

```
Checkout flow (Playwright E2E)
  - Complete a full order end-to-end
  - Form validation rejects invalid phone
  - Form validation rejects missing governorate
  - Cart clears after successful order
  - Order appears in localStorage after success
  - WhatsApp fallback generates on API failure

CartStore (Vitest)
  - addItem() persists to localStorage
  - addItem() with existing variation increments quantity
  - addItem() at max quantity (10) does not exceed 10
  - removeItem() removes correct item, leaves others
  - clearCart() empties array
  - subtotal() calculates correctly
  - itemCount() calculates correctly
  - Cart survives page reload (Zustand persist)

ProductTransformer (Vitest)
  - price "450.00" → 450 (number)
  - sale_price "" → null
  - average_rating "4.5" → 4.5 (number)
  - brand resolved from categories
  - badge priority: sale beats bestseller
  - soldCount from meta_data key '_sold_count'
  - alt text fallback when WC alt is empty

Checkout validation (Vitest)
  - Phone 01012345678 → valid
  - Phone 02012345678 → invalid (wrong prefix)
  - Phone 1012345678 → valid (normalized, leading 0 optional)
  - Governorate not in enum → invalid
  - Empty required field → Arabic error message
  - Address < 5 chars → invalid
```

**P2 — Test these in Sprint 9:**

```
WishlistStore (Vitest)
  - toggle() adds slug, toggle() again removes it
  - has() returns correct boolean
  - Survives page reload

SearchTransformer + synonym map (Vitest)
  - Arabic queries resolve to English
  - Typos in brand names still resolve

FilterChip (RTL)
  - Removing a chip updates URL params
  - Clear all removes all params

ProductCard (RTL)
  - Renders with all required props
  - WishlistToggle fires onToggle
  - Correct badge rendered by priority

StickyMobilePDPBar (RTL)
  - Hidden when Add to Cart button is visible in viewport
  - Visible when scrolled past Add to Cart button
```

**P3 — Test these before launch:**

```
Playwright E2E — search flow
  - Arabic query returns products
  - Recent search appears after first search
  - No-results state renders on nonsense query

Playwright E2E — wishlist flow
  - Add product to wishlist
  - Refresh page — still wishlisted
  - Remove from wishlist

All 404/500/error pages render correctly
Contact form generates correct WhatsApp URL
```

---

### 14.3 What Not to Test

- Tailwind CSS class application (visual regressions — use Lighthouse + manual review instead)
- Next.js internal routing behavior
- Framer Motion animation physics
- WooCommerce API responses (that's WooCommerce's concern — we test our transformer, not their API)

---

### 14.4 E2E Test — Full Checkout (Playwright)

This is the most important test in the application. It runs against the application with MSW intercepting the WooCommerce order creation API.

```
Test: Complete Order Flow
1. Navigate to / (homepage)
2. Click a product card → PDP
3. Select a color swatch
4. Click "أضيفي للسلة"
5. Verify cart drawer opens
6. Click "إتمام الطلب"
7. Fill checkout form:
   - Name: "نورهان أحمد"
   - Phone: "01012345678"
   - Governorate: "القاهرة"
   - City: "مدينة نصر"
   - Address: "شارع عباس العقاد، عمارة 5"
8. Click "تأكيدي الطلب"
9. Assert: redirect to /order-success
10. Assert: order number visible on page
11. Assert: cart is empty (cart icon shows 0)
12. Assert: order in localStorage:martal_orders_v2
```

---

## 15. Security Review Checklist

All 26 items must be verified before launch.

**Credential Security**
- [ ] S-01: `WOOCOMMERCE_KEY` and `WOOCOMMERCE_SECRET` are not in any file committed to git
- [ ] S-02: `lib/woocommerce/client.ts` has `import 'server-only'` at top
- [ ] S-03: Build fails if `client.ts` is imported in a Client Component (test by temporarily importing in a page.tsx)
- [ ] S-04: `npm run build && grep -r "ck_" .next/` returns no results
- [ ] S-05: `REVALIDATION_SECRET` is a random 32+ character string in production

**API Route Security**
- [ ] S-06: `/api/orders` validates input with Zod before any WooCommerce call
- [ ] S-07: `/api/orders` rate limit tested: 11th request returns HTTP 429
- [ ] S-08: `/api/contact` rate limit tested: 6th request returns HTTP 429
- [ ] S-09: `/api/revalidate` returns 401 for wrong secret
- [ ] S-10: `/api/revalidate` uses `crypto.timingSafeEqual` for secret comparison (not `===`)
- [ ] S-11: All API routes return generic Arabic error messages on failure (no WooCommerce internals exposed)
- [ ] S-12: API route error responses are logged server-side but not echoed to client

**Input Validation & Sanitization**
- [ ] S-13: All form inputs are validated server-side (not only client-side)
- [ ] S-14: Order notes field: HTML tags are stripped before WooCommerce submission
- [ ] S-15: Contact form message: HTML tags are stripped
- [ ] S-16: `dangerouslySetInnerHTML` is not used for any user-generated content
- [ ] S-17: WooCommerce product HTML descriptions are rendered through a controlled sanitizer (not raw `dangerouslySetInnerHTML`)

**HTTP Security**
- [ ] S-18: `X-Frame-Options: SAMEORIGIN` header present on all responses
- [ ] S-19: `X-Content-Type-Options: nosniff` present
- [ ] S-20: Content Security Policy header present (verify in Network tab → Response Headers)
- [ ] S-21: `Referrer-Policy: strict-origin-when-cross-origin` present
- [ ] S-22: HTTPS enforced in production (Vercel handles this — verify redirect from http:// works)

**Privacy & Data**
- [ ] S-23: `localStorage:martal_orders_v2` contains no payment card data (COD only — verify by placing test order and inspecting localStorage)
- [ ] S-24: GA4 is configured to not send PII (no name/phone/address in event parameters)
- [ ] S-25: Sentry's `beforeSend` hook strips PII fields from error events
- [ ] S-26: `.env.local` is in `.gitignore` and not in any commit history

---

## 16. Accessibility Checklist

All 27 items verified before launch.

**Keyboard Navigation**
- [ ] A-01: Tab key navigates through all interactive elements in logical order
- [ ] A-02: Tab order follows visual reading order (RTL: right to left)
- [ ] A-03: Cart drawer traps focus when open; focus returns to cart button on close
- [ ] A-04: Search overlay traps focus when open; focus returns to search trigger on close
- [ ] A-05: FilterDrawer traps focus when open
- [ ] A-06: QuickView modal traps focus when open
- [ ] A-07: Escape key closes all overlays, drawers, and modals
- [ ] A-08: Color swatches are navigable by keyboard (arrow keys)

**Focus Indicators**
- [ ] A-09: All interactive elements have visible focus ring (2px solid #8B1A2B, 2px offset)
- [ ] A-10: Focus ring is never removed without a visible equivalent
- [ ] A-11: `focus-visible` is used (not `focus`) — mouse clicks do not show focus ring

**Screen Reader**
- [ ] A-12: Product cards have `aria-label` including name, brand, color, and price
- [ ] A-13: WishlistToggle has `aria-label` that updates between "أضيفي للمفضلة" and "أزيلي من المفضلة"
- [ ] A-14: Cart count badge has `aria-label="السلة: N منتجات"` (updates reactively)
- [ ] A-15: Image carousel has `role="region"` and `aria-label="معرض الصور"`
- [ ] A-16: Gallery prev/next buttons are labeled (not just icon)
- [ ] A-17: Product image `alt` text is meaningful (not empty, not "image")
- [ ] A-18: Loading skeletons have `aria-busy="true"` or are hidden from screen readers

**Color & Contrast**
- [ ] A-19: Primary text on surface-base: ≥ 4.5:1 contrast (verify with Lighthouse or WebAIM)
- [ ] A-20: Text-on-brand-primary (button labels): ≥ 4.5:1 contrast (#FAFAF9 on #8B1A2B)
- [ ] A-21: Badge text on badge backgrounds: all ≥ 4.5:1
- [ ] A-22: No information is conveyed by color alone (out-of-stock also has strikethrough, not only grey color)

**RTL & Arabic**
- [ ] A-23: All directional icons (arrows, chevrons) mirror in RTL
- [ ] A-24: Form error messages appear in Arabic (not English fallback)
- [ ] A-25: `lang="ar"` is on `<html>`; if any section is in English (brand names), `lang` is not overridden (brand names are proper nouns — do not add `lang="en"` for them)

**Motion & Touch**
- [ ] A-26: `prefers-reduced-motion` respected — all Framer Motion components check `useReducedMotion()`
- [ ] A-27: All touch targets are ≥ 44px × 44px (verify with Chrome DevTools → Rendering → Show layout shift regions + tap target indicator)

---

## 17. Launch Readiness Checklist

Every item below must be checked before deploying to production. No exceptions for "we'll fix it post-launch."

**Functionality**
- [ ] L-01: Complete order can be placed end-to-end (Playwright E2E passing on staging)
- [ ] L-02: Order appears in WooCommerce admin with correct customer data
- [ ] L-03: Cart persists across page reload and browser close
- [ ] L-04: Wishlist persists across page reload
- [ ] L-05: Search returns correct products for Arabic and English queries
- [ ] L-06: All 5 brand pages render with correct content
- [ ] L-07: All product pages render with server-side HTML
- [ ] L-08: Contact form opens WhatsApp with pre-filled message
- [ ] L-09: WhatsApp FAB present and clickable on all pages
- [ ] L-10: 404 page renders with Arabic content and link back to shop
- [ ] L-11: 500 error page renders with Arabic content and WhatsApp contact
- [ ] L-12: Checkout error state shows WhatsApp fallback correctly

**Performance**
- [ ] L-13: Lighthouse Performance ≥ 90 on mobile (homepage)
- [ ] L-14: Lighthouse Performance ≥ 90 on mobile (product page)
- [ ] L-15: LCP < 2.5s on mobile profile
- [ ] L-16: CLS < 0.1 on homepage and product page
- [ ] L-17: JS initial bundle < 150KB gzipped (verified in `.next/analyze/`)
- [ ] L-18: Hero image < 100KB (WebP)

**SEO**
- [ ] L-19: `sitemap.xml` is valid and submitted to Google Search Console
- [ ] L-20: `robots.txt` is correct — checkout/account/api disallowed
- [ ] L-21: Google Rich Results Test passes for at least one product page
- [ ] L-22: All pages have unique `<title>` tags in Arabic
- [ ] L-23: All pages have unique `<meta name="description">` tags
- [ ] L-24: No `<title>` contains "[object Object]" or is empty
- [ ] L-25: `canonical` URL is present and correct on all pages
- [ ] L-26: Open Graph image is set for homepage and product pages

**Security**
- [ ] L-27: All 26 items in §15 Security Checklist verified
- [ ] L-28: `npm run build` shows no "exposed secret" warnings
- [ ] L-29: WooCommerce admin URL (`admin.martal.store`) is not linked or indexed

**Analytics & Monitoring**
- [ ] L-30: GA4 `view_item` event fires on product page load (verify in GA4 DebugView)
- [ ] L-31: GA4 `add_to_cart` event fires on Add to Cart click
- [ ] L-32: GA4 `purchase` event fires on order success page
- [ ] L-33: Sentry is receiving events (trigger a test error, verify in Sentry dashboard)
- [ ] L-34: Sentry does not capture PII in error events
- [ ] L-35: Google Search Console property verified for martal.store

**Accessibility**
- [ ] L-36: All 27 items in §16 Accessibility Checklist verified
- [ ] L-37: Lighthouse Accessibility ≥ 95

**Content**
- [ ] L-38: All 5 brand pages have Arabic tagline and SEO intro paragraph
- [ ] L-39: FAQ page has minimum 25 questions from Content §11
- [ ] L-40: All policy pages (Shipping, Returns, Privacy, Terms) are live
- [ ] L-41: No "[placeholder]" or "[coming soon]" text visible on any page
- [ ] L-42: No English-only content on any Arabic-primary page

**Infrastructure**
- [ ] L-43: Production environment variables set correctly in Vercel dashboard
- [ ] L-44: WooCommerce webhook configured for `/api/revalidate`
- [ ] L-45: Custom domain `martal.store` points to Vercel
- [ ] L-46: HTTPS works; HTTP redirects to HTTPS
- [ ] L-47: Preview deployments are working (push to a branch → preview URL accessible)

---

## 18. Risk Register

### R-01: WooCommerce API Rate Limiting
| | |
|---|---|
| **Risk** | WooCommerce's default rate limit (50 requests/minute) is hit during shop browsing with many simultaneous users |
| **Probability** | Medium |
| **Impact** | High — shop pages fail to load |
| **Mitigation** | ISR caches product pages aggressively (300s–3600s). Shop pages (SSR) are the main risk — implement request coalescing via Next.js `fetch` cache tags. |
| **Fallback** | ISR-cached versions serve from edge cache during rate limit windows. A "temporarily unavailable" state with WhatsApp contact CTA renders if all cache misses. |

---

### R-02: WooCommerce Unavailable During Checkout
| | |
|---|---|
| **Risk** | WooCommerce is unreachable when a customer submits an order |
| **Probability** | Low–Medium |
| **Impact** | Critical — direct revenue loss |
| **Mitigation** | `/api/orders` has a 10-second timeout. On timeout, returns the WhatsApp fallback URL pre-filled with order details. The customer can complete the order manually. |
| **Fallback** | WhatsApp fallback is always generated and always surfaced on checkout failure. Cart is never cleared on failure. |

---

### R-03: Arabic RTL Layout Breaks on a Major Browser
| | |
|---|---|
| **Risk** | Safari on iOS or Samsung Internet on Android renders RTL layout incorrectly |
| **Probability** | Medium |
| **Impact** | High — affects majority of Egyptian users |
| **Mitigation** | Test RTL on real devices in Sprint 9 — physical iPhone (Safari), Samsung Galaxy (Chrome and Samsung Internet). Use CSS logical properties exclusively (no `margin-left` / `margin-right`). |
| **Fallback** | Critical RTL failures (overlapping text, broken navigation) block launch. Minor visual regressions are documented and fixed in first post-launch patch. |

---

### R-04: Product Catalog Not Ready in WooCommerce for Phase 2 Transition
| | |
|---|---|
| **Risk** | WooCommerce products lack correct attributes (`pa_color`, `pa_color_hex`), missing brand categories, or wrong tag structure — causing transformer failures |
| **Probability** | High |
| **Impact** | Medium — development blocked on real API integration |
| **Mitigation** | Provide WooCommerce setup checklist to whoever manages the backend before Phase 2 begins (see §9 Phase 2 prerequisites). Develop a "data audit" script that checks each product for required attributes and reports issues. |
| **Fallback** | Continue on mock data in Phase 1 while WooCommerce data issues are resolved. |

---

### R-05: Framer Motion Performance on Low-End Android
| | |
|---|---|
| **Risk** | Framer Motion animations cause janky scrolling or dropped frames on mid-range Android devices |
| **Probability** | Medium |
| **Impact** | Medium — degrades experience for largest user segment |
| **Mitigation** | Test animations on a real mid-range Android (Samsung A-series or equivalent) in Sprint 9. Limit animations to opacity and transform properties only (GPU-composited — no layout-triggering animations). Respect `prefers-reduced-motion`. Stagger no more than 8 cards. |
| **Fallback** | If a specific animation consistently drops below 60fps on test device, replace with a CSS animation or remove entirely. |

---

### R-06: Cart/Wishlist localStorage Data Corruption
| | |
|---|---|
| **Risk** | Malformed localStorage data from a MARTAL 1.0 session causes store hydration failure, breaking cart or wishlist on first visit |
| **Probability** | Medium |
| **Impact** | High — cart loss on first visit destroys conversion |
| **Mitigation** | Zustand persist middleware has an `onRehydrateStorage` callback that catches parse errors. Wrap rehydration in try/catch: on failure, start with empty state rather than crashing. The `_v2` suffix on storage keys prevents collision with any v1 keys. |
| **Fallback** | On hydration failure: clear the corrupted key and start fresh. A customer who had nothing in their cart before loses nothing. |

---

### R-07: WooCommerce Price Changes Causing Checkout Discrepancy
| | |
|---|---|
| **Risk** | A product's price changes in WooCommerce after a customer has added it to their cart. The customer checks out at the old price. |
| **Probability** | Low |
| **Impact** | Medium — financial discrepancy; customer dissatisfaction |
| **Mitigation** | Cart price validation on checkout mount (§11 Step 9): compare stored price with live WooCommerce price. If delta > 5%, warn the user. |
| **Fallback** | For v2.0 with COD, the fulfillment team can resolve discrepancies manually. The server-side order creation uses current WooCommerce pricing regardless of what the client submits. |

---

### R-08: Google Does Not Index Arabic Content Correctly
| | |
|---|---|
| **Risk** | Google indexes pages but does not rank for Arabic search queries due to incorrect lang attributes, non-Arabic metadata, or JavaScript-rendered content |
| **Probability** | Low |
| **Impact** | High — organic search is a primary growth channel |
| **Mitigation** | SSR/ISR ensures all content is in page source HTML. `lang="ar"` on `<html>`. All metadata in Arabic. Submit sitemap to Google Search Console on launch day. Monitor Search Console coverage report weekly for first month. |
| **Fallback** | If indexing issues appear in Search Console (pages discovered but not indexed), use URL Inspection tool to diagnose. Common fixes: canonical URL mismatch, noindex header accidentally applied. |

---

### R-09: Solo Developer Burnout / Scope Creep
| | |
|---|---|
| **Risk** | Without a team to scope-check, the developer adds features not in the v2.0 spec (authentication, reviews, payment gateway) and delays launch |
| **Probability** | High |
| **Impact** | High — delayed time-to-revenue |
| **Mitigation** | This document is the scope contract. Anything not in the sprint breakdown is v2.1. When the temptation to add something arises, add it to the v2.1 backlog (§19) and continue the current sprint. |
| **Fallback** | Review §19 Post-Launch Roadmap for the correct placement of deferred features. |

---

## 19. Post-Launch Roadmap

### v2.1 — Revenue Optimization (Target: 4–8 weeks post-launch)

These features are designed but intentionally deferred. Their architecture slots are reserved.

| Feature | Effort | Revenue Impact | Architecture Slot |
|---|---|---|---|
| Customer authentication (WooCommerce JWT + NextAuth.js) | High | High — repeat purchase |Account page (localStorage → API swap) |
| Review submission (`POST /api/reviews`) | Medium | High — trust + SEO (review count in schema) | ReviewsTab already has the display; submission adds one API call |
| Payment gateway (Paymob or Fawry) | High | High — reduces COD friction | Checkout form adds PaymentMethodSelector; `/api/orders` extends with paymentIntentId |
| Order status updates (WooCommerce webhook) | Medium | Medium — customer satisfaction | `/api/webhooks/order-status` → localStorage order status update |
| Saved address per account | Low | Medium — checkout friction | Account → Addresses tab writes to WooCommerce customer (not just localStorage) |
| Discount codes / coupons | Medium | Medium — campaign capability | Cart summary adds coupon input; `/api/coupon/validate` route; WooCommerce coupon API |
| Email/WhatsApp marketing automation | Medium | High — retention | GA4 `purchase` event → Klaviyo or Meta CAPI trigger |
| UGC photo reviews | Medium | High — social proof | ReviewForm extends to accept image uploads → WooCommerce media upload |

---

### v2.2 — Retention & Conversion (Target: 3–6 months post-launch)

| Feature | Notes |
|---|---|
| Wishlist sharing (shareable URL) | `GET /api/wishlist/[token]` returns wishlisted products |
| Abandoned cart recovery | Vercel Cron → WhatsApp API outreach (Day 1 follow-up) |
| Recently viewed sync (per account) | UIStore.recentlyViewed → WooCommerce customer meta in v2.2 |
| "Complete the look" bundles | WooCommerce grouped products + BundleBuilder component |
| Product Q&A | WooCommerce product reviews extension |
| Lens care accessories catalog | Catalog expansion — no architecture changes required |
| Brand campaign landing pages | CMSEditorialSection from headless CMS (Sanity) |

---

### v3.0 — Platform Scale (Target: 6–12 months post-launch)

| Feature | Notes |
|---|---|
| Progressive Web App | `next-pwa` plugin; service worker for offline browsing |
| Multi-language (Arabic/English) | `next-intl` wraps all strings; LanguageSwitcher in Navbar |
| Headless CMS (Sanity) | Replaces static brand config and homepage editorial |
| AR lens try-on | Camera API + custom lens overlay compositing |
| Mobile app (React Native) | Shared WooCommerce backend; separate frontend codebase |
| Loyalty/points program | WooCommerce points plugin + frontend integration |
| Multi-country (GCC expansion) | Currency switching, regional shipping rules |

---

## 20. Definition of Done

MARTAL 2.0 is not complete until every condition below is met. "Nearly done" is not done.

### Functional Completeness

- [ ] Every page listed in 01_PROJECT_BRIEF.md §8 is live and accessible
- [ ] A customer can discover a product, add to cart, check out, and receive order confirmation — entirely in Arabic — in under 5 minutes on a mid-range Android device
- [ ] Cart persists across browser close and reopen
- [ ] Wishlist persists across browser close and reopen
- [ ] Orders placed are visible in WooCommerce admin with correct data
- [ ] All 5 brand pages render with correct Arabic content
- [ ] FAQ has minimum 25 questions from Content §11
- [ ] All policy pages (Shipping, Returns, Privacy, Terms) are live
- [ ] Contact form generates a valid WhatsApp link
- [ ] 404 page is in Arabic with navigation back to shop
- [ ] No broken links on any page

### Performance Completeness

- [ ] Lighthouse Performance ≥ 90 on mobile (homepage)
- [ ] Lighthouse Performance ≥ 90 on mobile (most-trafficked product page)
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms
- [ ] Initial JS bundle < 150KB gzipped

### SEO Completeness

- [ ] Sitemap submitted to Google Search Console
- [ ] Google Rich Results Test passes for a product page
- [ ] All pages have unique Arabic meta titles and descriptions
- [ ] All pages have canonical URLs
- [ ] Product pages have Schema.org Product JSON-LD
- [ ] FAQ page has Schema.org FAQPage JSON-LD

### Security Completeness

- [ ] All 26 items in §15 Security Checklist verified
- [ ] WooCommerce credentials not in client bundle
- [ ] All API routes rate-limited
- [ ] All API routes validate input with Zod

### Testing Completeness

- [ ] All P1 Vitest tests passing (transformers, stores, checkout validation)
- [ ] Playwright E2E checkout test passing on staging
- [ ] Playwright E2E search test passing
- [ ] No TypeScript errors (`tsc --noEmit` exits 0)
- [ ] No ESLint errors

### Monitoring Completeness

- [ ] GA4 purchase event confirmed firing in DebugView
- [ ] Sentry receiving test error in production
- [ ] Google Search Console property verified
- [ ] Microsoft Clarity installed and receiving sessions

---

**MARTAL 2.0 is complete when every checkbox in this section is checked. Not before.**

---

*This document is the execution contract for MARTAL 2.0. Every sprint, every build step, every checklist item is derived from the architecture, data model, component map, design system, and strategy documents that precede it. The documentation stack is complete: from project brief to launch readiness. Build in the order specified. Test what can break revenue. Ship when every condition in §20 is met.*

*Document Owner: Lead Engineering*  
*Last Updated: June 2026*  
*Documentation Stack: Complete — 01_PROJECT_BRIEF through 09_IMPLEMENTATION_PLAN*
