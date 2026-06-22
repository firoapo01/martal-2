# 06 — ARCHITECTURE
## MARTAL 2.0: Complete Technical Architecture Specification

**Document Type:** Engineering Architecture Specification  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Pre-Development — Authoritative Engineering Reference  
**Prepared by:** Lead Architecture  
**Reads after:** 01_PROJECT_BRIEF.md → 05_CONTENT.md  
**Audience:** Frontend Engineers, DevOps, Technical Leads

> **How to use this document.** This is the single source of truth for every engineering decision in MARTAL 2.0. Before writing any component, route, API handler, or utility function, the responsible engineer must locate the relevant section here and understand the architectural context. Decisions made here supersede individual preference. Deviations require documented justification and team review.

> **Scope.** This document covers frontend architecture only. WooCommerce (WordPress) backend configuration, hosting, plugin selection, and database management are out of scope. This document treats WooCommerce as a black-box REST API — a data and order management system accessed via authenticated HTTP.

---

## Table of Contents

1. [Architecture Principles](#1-architecture-principles)
2. [System Overview](#2-system-overview)
3. [Next.js App Router Architecture](#3-nextjs-app-router-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Component Architecture](#5-component-architecture)
6. [TypeScript Architecture](#6-typescript-architecture)
7. [WooCommerce Integration Layer](#7-woocommerce-integration-layer)
8. [API Route Architecture](#8-api-route-architecture)
9. [State Management Architecture](#9-state-management-architecture)
10. [Search Architecture](#10-search-architecture)
11. [Cart Architecture](#11-cart-architecture)
12. [Checkout Architecture](#12-checkout-architecture)
13. [SEO Architecture](#13-seo-architecture)
14. [Performance Architecture](#14-performance-architecture)
15. [Security Architecture](#15-security-architecture)
16. [Error Handling Architecture](#16-error-handling-architecture)
17. [Deployment Architecture](#17-deployment-architecture)
18. [Observability Architecture](#18-observability-architecture)
19. [Scalability Roadmap](#19-scalability-roadmap)
20. [Architecture Decision Record](#20-architecture-decision-record)

---

## 1. Architecture Principles

These nine principles are the foundation of every engineering decision in MARTAL 2.0. When a trade-off must be made, these principles — in the order listed — determine the correct choice.

### 1.1 Performance First

**Principle:** Every architectural decision is evaluated through the lens of runtime performance before aesthetic preference or developer convenience.

**Why it exists:** MARTAL's primary users are on mid-range Android devices on 4G LTE in Egypt. A 200ms difference in Time to Interactive is not an academic benchmark — it is a measurable difference in conversion rate. MARTAL 1.0's fully client-side rendering meant product pages produced no meaningful HTML for 2–4 seconds on these devices. That is the business problem this principle exists to solve.

**Practical implications:**
- Server Components by default; Client Components only when interactivity requires it
- ISR over SSR where freshness requirements permit it
- Zero blocking resources in the critical rendering path
- Images served at correct size and format via `next/image` everywhere
- No library is added to the dependency tree without first checking its bundle cost

### 1.2 Mobile First

**Principle:** Every layout, interaction, component, and performance budget is designed for a 375px portrait viewport on a mid-range Android device first. Desktop is an enhancement.

**Why it exists:** As established in the Strategy document (§8.1), approximately 65% of MARTAL's expected traffic is on mid-range Android devices. Building desktop-first and adapting downward produces fundamentally inferior mobile experiences. The cost is paid in conversion rate, not just aesthetics.

**Practical implications:**
- Tailwind utilities applied mobile-first: `class="text-sm md:text-base"`, never the reverse
- Touch targets are 44px minimum before hover states are considered
- Interaction patterns (bottom sheets, swipe gestures, sticky bars) designed for touch first
- Performance budgets measured on a Moto G4-equivalent device profile in Lighthouse

### 1.3 SEO First

**Principle:** Every page that contains content a potential customer might search for must be server-rendered with complete, accurate metadata before any other concern.

**Why it exists:** MARTAL 1.0 had zero organic search visibility because all content was client-rendered. A potential customer searching "عدسات Hypnose Brown مصر" received no result from MARTAL regardless of product quality. This is a structural revenue limitation that MARTAL 2.0 eliminates from day one.

**Practical implications:**
- Product pages, brand pages, category pages, and all content pages use SSR or ISR
- Every page exports a `generateMetadata` function with Arabic-first title and description
- JSON-LD structured data is rendered server-side on all commerce pages
- No content that a search engine should index is rendered exclusively client-side

### 1.4 Accessibility First

**Principle:** The application must be operable by users relying on keyboard navigation, screen readers, and assistive technology. WCAG 2.1 AA is the minimum standard.

**Why it exists:** Beyond ethical obligation, accessibility is an SEO signal and a quality signal. Accessible HTML is semantically rich HTML, which is better for all users. Retrofitting accessibility after launch is expensive and incomplete — it must be built in from the first component.

**Practical implications:**
- Semantic HTML elements used correctly (`<nav>`, `<main>`, `<article>`, `<button>` not `<div>` with onClick)
- All images have meaningful `alt` text in Arabic
- Focus management is handled correctly for all modal and drawer interactions
- Color contrast meets WCAG AA on every surface (verified in the Design System, §13.1)
- `prefers-reduced-motion` is respected in all Framer Motion implementations

### 1.5 Type Safety Everywhere

**Principle:** TypeScript strict mode is enabled from day one. `any` is forbidden. Every API response, component prop, and store action is fully typed.

**Why it exists:** MARTAL 1.0 ran into runtime errors caused by the dynamic nature of the `window.PRODUCTS` array — undefined color variants, missing price fields, incorrect shape assumptions. TypeScript with strict mode eliminates this category of error entirely and makes the WooCommerce API integration — which returns complex, nullable data structures — safe to work with at scale.

**Practical implications:**
- `strict: true` in `tsconfig.json` from project initialization, never relaxed
- All WooCommerce API responses are typed before they are used
- Zod schemas validate runtime API data before it enters typed application state
- Generic utility types (`Partial<T>`, `Pick<T>`, `Omit<T>`) used over duplicated type definitions
- No `// @ts-ignore` comments permitted without documented justification

### 1.6 Component Reuse

**Principle:** A component that appears in more than one place in the application exists exactly once in the component library. Duplication is a defect.

**Why it exists:** The wireframes document (§Component Reuse Map) identified 14 components that appear across multiple pages. Each one built twice is a maintenance liability — a design change requires two code changes, creating inevitable divergence. The Product Card alone appears on six different page types.

**Practical implications:**
- Shared components live in `src/components/` with no page-specific logic
- Page-specific variants are achieved through props, not forked components
- The component library is organized by domain, not by page (product components, cart components, layout components — not home-page components, shop-page components)

### 1.7 API Isolation

**Principle:** No component, hook, or page makes a direct HTTP call to the WooCommerce API. All WooCommerce communication passes through the typed integration layer in `src/lib/woocommerce/`.

**Why it exists:** Direct API calls from components create untestable, un-cacheable, credential-exposing code. The abstraction layer provides a single surface for: authentication, error handling, response transformation, caching, and type validation. When the WooCommerce API changes (endpoint paths, response shape, authentication method), the fix lives in one file.

**Practical implications:**
- `src/lib/woocommerce/` contains all WooCommerce communication
- Components call service functions; they never call `fetch` directly to external APIs
- WooCommerce credentials exist only in server-side code; they never reach the browser bundle

### 1.8 Security by Default

**Principle:** All sensitive operations (API authentication, order creation, contact form processing) happen server-side. The browser receives only what it needs to render the UI.

**Why it exists:** WooCommerce API credentials in a browser bundle are a critical security vulnerability. COD orders with no payment validation are susceptible to abuse. Contact forms without server-side validation are spam vectors. Security posture must be correct from the first line of production code.

**Practical implications:**
- All environment variables containing secrets are prefixed without `NEXT_PUBLIC_` — they never reach the client
- All API routes validate input before processing it
- Rate limiting is applied to all mutation API routes (order creation, contact form)
- Security headers are set at the Vercel deployment layer

### 1.9 Progressive Enhancement

**Principle:** The application's core experience — browsing products, reading descriptions, understanding pricing — must be functional without JavaScript. JavaScript enhances but does not gate.

**Why it exists:** On poor mobile connections in Egypt, JavaScript bundles can fail to load. Server-rendered HTML ensures a meaningful, readable page exists before any JavaScript executes. This is also the reason React Server Components are preferred over client components — they produce real HTML, not a blank shell waiting for hydration.

**Practical implications:**
- Product information, pricing, and brand content are in the server-rendered HTML
- Cart and wishlist interactions are the only features that genuinely require JavaScript
- No content critical to purchase decisions (price, description, stock status) is fetched exclusively client-side

---

## 2. System Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER                                   │
│                   (Mobile Browser / Desktop)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                          │
│              (CDN, SSL Termination, Edge Config)                │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  NEXT.JS 15 APPLICATION                         │
│                    (Vercel Deployment)                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               APP ROUTER                                │   │
│  │  /          /shop      /product/[slug]  /brand/[slug]   │   │
│  │  /cart      /checkout  /wishlist        /account        │   │
│  │  /search    /faq       /contact         /about          │   │
│  └─────────────────────┬───────────────────────────────────┘   │
│                        │                                        │
│  ┌─────────────────────▼───────────────────────────────────┐   │
│  │               API ROUTES (Server-side only)             │   │
│  │  /api/search    /api/orders    /api/contact             │   │
│  │  /api/revalidate               /api/whatsapp            │   │
│  └─────────────────────┬───────────────────────────────────┘   │
│                        │                                        │
│  ┌─────────────────────▼───────────────────────────────────┐   │
│  │         WOOCOMMERCE INTEGRATION LAYER                   │   │
│  │    lib/woocommerce/client.ts  (authenticated fetch)     │   │
│  │    lib/woocommerce/products.ts                          │   │
│  │    lib/woocommerce/orders.ts                            │   │
│  │    lib/woocommerce/brands.ts                            │   │
│  │    lib/woocommerce/categories.ts                        │   │
│  └─────────────────────┬───────────────────────────────────┘   │
│                        │                                        │
│  ┌─────────────────────▼───────────────────────────────────┐   │
│  │              CLIENT-SIDE STATE                          │   │
│  │    Zustand: Cart Store / Wishlist Store / UI Store      │   │
│  │    TanStack Query: Server state cache                   │   │
│  │    localStorage: Persistence layer                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS + Basic Auth
┌────────────────────────────▼────────────────────────────────────┐
│                   WOOCOMMERCE REST API                          │
│                (WordPress + WooCommerce Plugin)                 │
│              https://admin.martal.store/wp-json/               │
│                                                                 │
│  Products  │  Variations  │  Categories  │  Orders  │  Reviews  │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  WORDPRESS DATABASE                             │
│                     (MySQL / MariaDB)                           │
│           Managed by WooCommerce — no direct access            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Patterns

**Pattern 1: Server-rendered product page (ISR)**
```
User requests /product/hypnose-brown
  → Vercel Edge: checks CDN cache
  → Cache HIT: serve cached HTML (< 50ms)
  → Cache MISS: Next.js ISR handler invokes
    → lib/woocommerce/products.ts: fetchProduct('hypnose-brown')
    → WooCommerce API: GET /products?slug=hypnose-brown
    → Response transformed to ProductPage type
    → generateMetadata() produces Arabic SEO tags
    → Page component renders server-side HTML
    → Cached at Vercel Edge with revalidate: 300
    → HTML delivered to user
  → Client-side hydration adds interactivity (gallery swipe, color selection)
```

**Pattern 2: Cart interaction (client-side)**
```
User taps "Add to Cart" on PDP
  → CartStore.addItem() called (Zustand)
  → Zustand middleware persists new cart to localStorage
  → Cart count badge updates via store subscription
  → Cart drawer opens (UI Store state change)
  → No server communication — fully local
```

**Pattern 3: Order submission (API route)**
```
User taps "تأكيدي الطلب" on checkout page
  → Client validates form (React Hook Form + Zod)
  → POST /api/orders with order payload (no WooCommerce credentials)
  → API route validates input with Zod schema
  → API route calls lib/woocommerce/orders.createOrder()
  → WooCommerce API: POST /orders (with server-side credentials)
  → WooCommerce returns order ID and number
  → API route returns { orderId, orderNumber } to client
  → Client clears cart (CartStore.clearCart())
  → Client navigates to /order-success?id=[orderId]
```

---

## 3. Next.js App Router Architecture

### 3.1 Complete Route Tree

```
src/app/
│
├── layout.tsx                    # Root layout — html, body, RTL dir, providers
├── globals.css                   # Global styles, CSS custom properties
├── not-found.tsx                 # Global 404 page
├── error.tsx                     # Global error boundary
├── loading.tsx                   # Global loading state
│
├── (marketing)/                  # Route group: no shared layout changes
│   ├── page.tsx                  # Homepage /
│   ├── about/
│   │   └── page.tsx              # /about
│   └── contact/
│       └── page.tsx              # /contact
│
├── (shop)/                       # Route group: shop layout (with sidebar on desktop)
│   ├── layout.tsx                # Shop layout wrapper
│   ├── shop/
│   │   ├── page.tsx              # /shop (all products)
│   │   └── [category]/
│   │       └── page.tsx          # /shop/[category-slug]
│   ├── brand/
│   │   └── [slug]/
│   │       └── page.tsx          # /brand/[slug]
│   ├── product/
│   │   └── [slug]/
│   │       ├── page.tsx          # /product/[slug]
│   │       └── loading.tsx       # Product page skeleton
│   └── search/
│       └── page.tsx              # /search?q=...
│
├── (commerce)/                   # Route group: commerce pages (minimal chrome)
│   ├── cart/
│   │   └── page.tsx              # /cart
│   ├── checkout/
│   │   ├── page.tsx              # /checkout
│   │   └── layout.tsx            # Minimal layout (no footer, logo-only header)
│   ├── order-success/
│   │   └── page.tsx              # /order-success?id=...
│   ├── wishlist/
│   │   └── page.tsx              # /wishlist
│   └── account/
│       └── page.tsx              # /account
│
├── (content)/                    # Route group: static content pages
│   ├── faq/
│   │   └── page.tsx              # /faq
│   ├── shipping-policy/
│   │   └── page.tsx              # /shipping-policy
│   ├── returns/
│   │   └── page.tsx              # /returns
│   ├── privacy-policy/
│   │   └── page.tsx              # /privacy-policy
│   └── terms/
│       └── page.tsx              # /terms
│
└── api/                          # API Routes (server-side only)
    ├── search/
    │   └── route.ts              # GET /api/search?q=...
    ├── orders/
    │   └── route.ts              # POST /api/orders
    ├── contact/
    │   └── route.ts              # POST /api/contact
    ├── revalidate/
    │   └── route.ts              # POST /api/revalidate (webhook)
    └── health/
        └── route.ts              # GET /api/health
```

### 3.2 Rendering Strategy Table

| Route | Strategy | Revalidate | Rationale |
|---|---|---|---|
| `/` | ISR | 3600s | Editorial content changes infrequently; homepage bestsellers grid tolerates 1hr staleness |
| `/shop` | SSR | — | Filter/sort URL params are dynamic; results must reflect current inventory state |
| `/shop/[category]` | ISR | 3600s | Category landing pages are near-static; product grid within still uses SSR data |
| `/brand/[slug]` | ISR | 3600s | Brand hero and description are near-static; on-demand revalidation via webhook |
| `/product/[slug]` | ISR | 300s | Stock changes and price updates need to propagate quickly; 5-min window acceptable |
| `/search` | SSR | — | Every query is unique; caching at route level provides no value |
| `/cart` | CSR | — | Pure client state; no server data needed |
| `/checkout` | CSR | — | Form-only; WooCommerce submission via API route |
| `/order-success` | CSR | — | Post-purchase confirmation; order ID from URL param |
| `/wishlist` | CSR | — | Pure localStorage state |
| `/account` | CSR | — | Pure localStorage state |
| `/faq` | SSG | Build-time | Static content; changes require deployment |
| `/about` | SSG | Build-time | Static content |
| `/contact` | SSG | Build-time | Form UI is static; submission handled by API route |
| `/shipping-policy` | SSG | Build-time | Legal/policy content |
| `/returns` | SSG | Build-time | Legal/policy content |
| `/privacy-policy` | SSG | Build-time | Legal/policy content |
| `/terms` | SSG | Build-time | Legal/policy content |

### 3.3 Route Groups Strategy

Route groups (parenthesized directories) are used not for URL segmentation but for layout sharing. The four groups and their purpose:

**`(marketing)`** — Homepage, About, Contact. These pages share no special layout beyond the global root layout. Group exists for organizational clarity.

**`(shop)`** — All browsing pages. The `layout.tsx` within this group provides the shopping context: recently viewed product tracking, search overlay availability. The sidebar layout logic for the Shop page is handled at the page component level, not the route group layout.

**`(commerce)`** — Cart, Checkout, Wishlist, Account. The Checkout page has its own layout (minimal header, no footer). Other commerce pages use the standard layout. The checkout layout is defined at `/checkout/layout.tsx` — it overrides the root layout's footer and replaces the full header with a logo-only header.

**`(content)`** — Static informational pages. All share the same prose layout (constrained max-width, generous vertical spacing). The route group layout provides this shared prose wrapper.

### 3.4 generateStaticParams for ISR

Product and brand pages use `generateStaticParams` to pre-render the most important slugs at build time. All other slugs are generated on first request and cached:

```typescript
// app/(shop)/product/[slug]/page.tsx
export async function generateStaticParams() {
  // Pre-generate the 20 bestselling products at build time
  const products = await getProducts({ per_page: 20, orderby: 'popularity' });
  return products.map((p) => ({ slug: p.slug }));
}
```

For brand pages: all five brand slugs are always pre-generated (the brand list is finite and known).

---

## 4. Folder Structure

### 4.1 Complete Project Structure

```
martal-2.0/
├── src/
│   ├── app/                          # Next.js App Router (routes only)
│   │   └── [... see §3.1]
│   │
│   ├── components/                   # All React components
│   │   ├── ui/                       # Primitive, unstyled-base components (Shadcn/UI)
│   │   ├── layout/                   # Application shell components
│   │   ├── product/                  # Product display components
│   │   ├── shop/                     # Shop browsing components
│   │   ├── cart/                     # Cart drawer and cart page components
│   │   ├── checkout/                 # Checkout form components
│   │   ├── search/                   # Search overlay and results
│   │   ├── brand/                    # Brand page components
│   │   ├── account/                  # Account dashboard components
│   │   ├── wishlist/                 # Wishlist components
│   │   └── common/                   # Cross-domain shared components
│   │
│   ├── lib/                          # Pure library code (no React)
│   │   ├── woocommerce/              # WooCommerce API integration
│   │   │   ├── client.ts             # Authenticated fetch client
│   │   │   ├── products.ts           # Product fetching functions
│   │   │   ├── categories.ts         # Category fetching functions
│   │   │   ├── orders.ts             # Order creation functions
│   │   │   ├── brands.ts             # Brand (category) fetching functions
│   │   │   ├── search.ts             # Search functions
│   │   │   └── transformers.ts       # WC response → app types
│   │   ├── validations/              # Zod schemas
│   │   │   ├── checkout.ts           # Checkout form schema
│   │   │   ├── contact.ts            # Contact form schema
│   │   │   └── order.ts              # Order payload schema
│   │   ├── utils/                    # Pure utility functions
│   │   │   ├── currency.ts           # EGP formatting
│   │   │   ├── slugify.ts            # Arabic-safe slug generation
│   │   │   ├── governorates.ts       # Egypt governorate data
│   │   │   ├── seo.ts                # SEO helper functions
│   │   │   └── phone.ts              # Egyptian phone validation
│   │   └── constants/                # Application constants
│   │       ├── routes.ts             # Route path constants
│   │       ├── brands.ts             # Brand configuration
│   │       └── config.ts             # App-wide configuration
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useCart.ts                # Cart store interface
│   │   ├── useWishlist.ts            # Wishlist store interface
│   │   ├── useSearch.ts              # Search logic
│   │   ├── useRecentlyViewed.ts      # Recently viewed products
│   │   ├── useLocalStorage.ts        # Generic localStorage hook
│   │   ├── useDebounce.ts            # Input debouncing
│   │   └── useMediaQuery.ts          # Responsive breakpoint detection
│   │
│   ├── store/                        # Zustand stores
│   │   ├── cart.store.ts
│   │   ├── wishlist.store.ts
│   │   └── ui.store.ts
│   │
│   ├── types/                        # TypeScript type definitions
│   │   ├── product.ts                # Product and variation types
│   │   ├── order.ts                  # Order types
│   │   ├── brand.ts                  # Brand types
│   │   ├── category.ts               # Category types
│   │   ├── cart.ts                   # Cart state types
│   │   ├── search.ts                 # Search types
│   │   ├── woocommerce.ts            # Raw WooCommerce API types
│   │   └── api.ts                    # API request/response types
│   │
│   ├── config/                       # Environment and app configuration
│   │   └── index.ts                  # Typed config object from env vars
│   │
│   └── providers/                    # React context providers
│       ├── QueryProvider.tsx          # TanStack Query provider
│       └── AppProvider.tsx            # Root app provider (wraps all others)
│
├── public/
│   ├── fonts/                        # Self-hosted fallback fonts (if needed)
│   ├── images/                       # Static images (logo, OG default)
│   └── icons/                        # Favicon, PWA icons
│
├── tailwind.config.ts                # Tailwind configuration (see §14)
├── next.config.ts                    # Next.js configuration
├── tsconfig.json                     # TypeScript configuration
├── .env.local                        # Local environment (gitignored)
├── .env.example                      # Environment variable template (committed)
└── package.json
```

### 4.2 Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Component files | PascalCase | `ProductCard.tsx` |
| Hook files | camelCase with `use` prefix | `useCart.ts` |
| Utility files | camelCase | `currency.ts` |
| Type files | camelCase | `product.ts` |
| Store files | camelCase with `.store` suffix | `cart.store.ts` |
| Route files | Next.js convention | `page.tsx`, `layout.tsx`, `route.ts` |
| Component directories | kebab-case | `product-card/` |

### 4.3 Absolute Imports

Configured in `tsconfig.json` with path aliases to eliminate `../../../` hell:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"],
      "@/lib/*":        ["src/lib/*"],
      "@/hooks/*":      ["src/hooks/*"],
      "@/store/*":      ["src/store/*"],
      "@/types/*":      ["src/types/*"],
      "@/config":       ["src/config/index.ts"],
      "@/providers/*":  ["src/providers/*"]
    }
  }
}
```

**Usage:** `import { ProductCard } from '@/components/product/ProductCard'` — never relative paths that cross directory boundaries.

### 4.4 Barrel Exports

Each component subdirectory exposes an `index.ts` that re-exports its public API:

```typescript
// src/components/product/index.ts
export { ProductCard } from './ProductCard';
export { ProductGallery } from './ProductGallery';
export { ColorSwatches } from './ColorSwatches';
export { ProductTabs } from './ProductTabs';
// ... etc
```

**Rule:** Only export what is intended for use outside the domain directory. Internal sub-components (e.g., `GalleryThumbnail` used only inside `ProductGallery`) are not exported from the barrel.

---

## 5. Component Architecture

### 5.1 Component Organization Philosophy

MARTAL 2.0 uses a domain-driven component organization, not an atomic design hierarchy. The reason: atomic design (atoms → molecules → organisms) maps poorly to feature development in a commerce application. A developer working on the checkout feature needs to find all checkout-related components together, not scattered across atom/molecule/organism directories.

The `ui/` directory contains the one exception: truly primitive, headless components from Shadcn/UI that have no domain awareness. Everything above that level is organized by domain.

### 5.2 Component Directory Responsibilities

**`components/ui/`** — Reskinned Shadcn/UI primitives. Button, Input, Select, Dialog, Sheet, Accordion, Tabs, Badge. These components have MARTAL's visual style applied but no business logic. They accept standard HTML props plus any design system variants.

**`components/layout/`** — Application shell. Navbar (desktop), MobileHeader, MobileBottomNav, AnnouncementBar, Footer, MinimalHeader (checkout). These components appear on every page and manage the overall page structure.

**`components/product/`** — All product display logic. ProductCard, ProductGallery, ColorSwatches, StickyPDPBar, ProductTabs, SpecificationsTable, RelatedProducts, RecentlyViewed, ProductBadge, SoldCount, RatingStars.

**`components/shop/`** — Shop-specific browsing UI. FilterSidebar, FilterDrawer, FilterChips, SortDropdown, ShopToolbar, QuickViewModal, ProductGrid, LoadMoreButton, EmptyShopState.

**`components/cart/`** — Cart drawer and cart page. CartDrawer, CartItem, CartSummary, FreeShippingProgress, CartDrawerHeader, EmptyCartState, CODBadge.

**`components/checkout/`** — Checkout form system. CheckoutForm, FormField, GovernorateSelect, OrderSummaryPanel, OrderSummaryAccordion, CODConfirmation, CheckoutHeader.

**`components/search/`** — Search overlay system. SearchOverlay, SearchInput, SearchSuggestions, RecentSearches, TrendingSearches, SearchResultProduct, SearchResultBrand, NoSearchResults.

**`components/brand/`** — Brand page components. BrandHero, BrandCard, RelatedBrands, OriginBadge.

**`components/account/`** — Account dashboard. AccountLayout, AccountNav, AccountTabBar, OrderCard, OrderHistory, AddressCard, ProfileDisplay, LocalStorageBanner.

**`components/wishlist/`** — Wishlist page. WishlistToolbar, EmptyWishlist.

**`components/common/`** — Cross-domain shared components that don't fit a single domain. SectionHeader, TrustBar, TrustStrip, WhatsAppFAB, Breadcrumb, ReviewCard, FAQAccordion, CTABanner, EmptyState, ErrorState, SkeletonCard.

### 5.3 Server vs. Client Component Decision

**Default: Server Component.** Every component is a React Server Component unless it explicitly requires:
- Browser APIs (`window`, `localStorage`, `navigator`)
- React state (`useState`, `useReducer`)
- React effects (`useEffect`, `useLayoutEffect`)
- Event listeners
- Framer Motion animations (requires client-side hydration)
- Zustand store access

**Marking Client Components:**
Add `'use client'` directive at the top of the file. This makes the component and all its imports client-side. Keep the boundary as deep as possible — pass server-fetched data as props rather than making the entire page client-side.

**Pattern — Passing server data to client components:**
```
Page (Server Component)
  → fetches product data from WooCommerce
  → renders server-side HTML for SEO
  → passes data as props to:
    ColorSwatches (Client Component — needs state for selection)
    ProductGallery (Client Component — needs swipe interactions)
    AddToCartButton (Client Component — needs cart store access)
```

The product title, description, specifications, and price render server-side. Only the interactive elements require client-side hydration.

### 5.4 Component Boundaries

A component boundary violation occurs when:
- A `components/cart/` component imports from `components/checkout/`
- A `components/product/` component directly calls a WooCommerce API function (it should receive data as props)
- A Server Component imports a client-only library at the module level (causes the entire module to become client-side)

---

## 6. TypeScript Architecture

### 6.1 TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

`noUnusedLocals`, `noUnusedParameters`, and `exactOptionalPropertyTypes` are enabled beyond strict mode. `noUncheckedIndexedAccess` forces explicit null-checking on array/object index access — critical when working with WooCommerce API responses where array elements may not exist.

### 6.2 Type Architecture

Types are organized into three layers:

**Layer 1 — WooCommerce Raw Types (`src/types/woocommerce.ts`)**  
Exact TypeScript representations of what the WooCommerce REST API actually returns. These types may include fields that MARTAL never uses. They are named with the `WC` prefix.

```typescript
// src/types/woocommerce.ts
interface WCProduct {
  id: number;
  name: string;
  slug: string;
  type: 'simple' | 'variable' | 'grouped' | 'external';
  status: 'publish' | 'draft' | 'pending' | 'private';
  price: string;           // WooCommerce returns ALL prices as strings
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  average_rating: string;  // Also a string in WooCommerce
  rating_count: number;
  images: WCProductImage[];
  categories: WCTerm[];
  tags: WCTerm[];
  attributes: WCProductAttribute[];
  variations: number[];    // Just IDs at the product level
  meta_data: WCMetaData[];
}
```

**Layer 2 — Application Types (`src/types/product.ts`, `order.ts`, etc.)**  
Transformed, cleaned representations used throughout the application. These are created by the transformer functions in `lib/woocommerce/transformers.ts`. Named without prefix.

```typescript
// src/types/product.ts
interface Product {
  id: number;
  slug: string;
  name: string;           // Cleaned from WC name
  brand: string;          // Derived from WC categories
  subtitle: string;       // From WC short_description
  description: string;
  price: number;          // Parsed from WC string
  regularPrice: number;
  salePrice: number | null;
  onSale: boolean;
  inStock: boolean;
  rating: number;         // Parsed from WC string
  reviewCount: number;
  badge: 'bestseller' | 'new' | 'sale' | null;
  images: ProductImage[];
  variations: ProductVariation[];
  attributes: ProductAttribute[];
  soldCount: number;      // From WC meta_data
}
```

**Layer 3 — UI State Types (`src/types/cart.ts`, `search.ts`, etc.)**  
Types for client-side state that never comes directly from the API.

```typescript
// src/types/cart.ts
interface CartItem {
  productId: number;
  variationId: number;
  slug: string;
  name: string;
  brand: string;
  colorName: string;
  colorHex: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  updatedAt: number;      // Unix timestamp for staleness detection
}
```

### 6.3 Zod Runtime Validation

TypeScript provides compile-time safety. Zod provides runtime safety for data entering from external sources (WooCommerce API, form inputs, URL parameters).

```typescript
// src/lib/validations/checkout.ts
import { z } from 'zod';
import { EGYPT_PHONE_REGEX, EGYPT_GOVERNORATES } from '@/lib/constants';

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().regex(EGYPT_PHONE_REGEX, 'رقم الموبايل غير صحيح'),
  governorate: z.enum(EGYPT_GOVERNORATES as [string, ...string[]]),
  city: z.string().min(2, 'المدينة مطلوبة'),
  address: z.string().min(5, 'العنوان يجب أن يكون 5 أحرف على الأقل'),
  building: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
```

**Rule:** Every form uses a Zod schema. Every API route input is validated against a Zod schema before processing. WooCommerce API responses are validated against a Zod schema in the transformer layer before being typed as application types.

### 6.4 Forbidden TypeScript Patterns

```typescript
// ❌ FORBIDDEN: any type
const product: any = await fetchProduct(slug);

// ❌ FORBIDDEN: type assertion without validation
const product = response as Product;

// ❌ FORBIDDEN: non-null assertion without guards
const firstVariation = product.variations!;

// ❌ FORBIDDEN: implicit any in function params
function formatPrice(price) { ... }

// ✅ REQUIRED: explicit types, validated data, null safety
const rawProduct = await fetchProductRaw(slug);
const parsed = WCProductSchema.safeParse(rawProduct);
if (!parsed.success) throw new ProductFetchError(slug);
const product = transformProduct(parsed.data);
```

---

## 7. WooCommerce Integration Layer

### 7.1 Architectural Rationale

The integration layer exists because direct WooCommerce API calls from page components or hooks create five problems simultaneously:

1. **Security:** WooCommerce consumer key and secret would need to be accessible to the calling code. If that code runs client-side (even accidentally), credentials are exposed in the browser.

2. **Coupling:** Every component that calls the API directly must know the API's URL structure, authentication scheme, pagination format, and response shape. A WooCommerce update that changes any of these breaks every component.

3. **Type unsafety:** Raw `fetch` calls return `unknown`. Without a validation layer, type assertions are required, which defeats TypeScript's purpose.

4. **No caching layer:** Each component manages its own caching, producing inconsistent behavior and cache invalidation complexity.

5. **No error standardization:** Each component handles errors differently, producing inconsistent user-facing error states.

The integration layer solves all five problems in one place.

### 7.2 `lib/woocommerce/client.ts`

The authenticated HTTP client. This is the only file that knows the WooCommerce URL and credentials.

**Responsibilities:**
- Reads `WOOCOMMERCE_URL`, `WOOCOMMERCE_KEY`, `WOOCOMMERCE_SECRET` from environment
- Constructs authenticated requests (WooCommerce uses Basic Auth with consumer key:secret as Base64)
- Sets `Content-Type: application/json` and `Accept: application/json`
- Wraps `fetch` with configurable `next.revalidate` options for ISR integration
- Handles HTTP-level errors (non-2xx responses) and throws typed errors
- Provides `get<T>()`, `post<T>()` generic methods

```typescript
// lib/woocommerce/client.ts
// This file MUST NOT be imported from any client-side code.
// It uses server-only environment variables.
import 'server-only';

const BASE_URL = process.env.WOOCOMMERCE_URL;
const AUTH = Buffer.from(
  `${process.env.WOOCOMMERCE_KEY}:${process.env.WOOCOMMERCE_SECRET}`
).toString('base64');

export async function wcGet<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
  options: { revalidate?: number | false } = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}/wp-json/wc/v3/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${AUTH}`, Accept: 'application/json' },
    next: options.revalidate !== undefined
      ? { revalidate: options.revalidate }
      : { revalidate: 300 },
  });

  if (!response.ok) {
    throw new WooCommerceError(response.status, endpoint, await response.text());
  }

  return response.json() as Promise<T>;
}
```

The `import 'server-only'` directive causes a build-time error if this file is ever imported in a client component, preventing credential exposure accidents.

### 7.3 `lib/woocommerce/products.ts`

**Responsibilities:**
- `getProducts(params)` — fetches paginated product list with filtering
- `getProduct(slug)` — fetches single product by slug
- `getProductVariations(productId)` — fetches all variations for a variable product
- `getBestsellers(limit)` — convenience wrapper for popularity-ordered products
- `getRelatedProducts(productId, limit)` — fetches related products by category

All functions call `wcGet` with typed parameters, pass appropriate `revalidate` values, and pass raw responses through `transformProduct()` before returning.

### 7.4 `lib/woocommerce/transformers.ts`

**Responsibilities:**
- Converts `WCProduct` → `Product`: parses string prices to numbers, resolves brand from categories, extracts sold count from meta_data, maps badge from tags
- Converts `WCProductVariation` → `ProductVariation`: extracts color name and hex from attributes
- Converts `WCOrder` → `Order`: normalizes line items

This is where the messy reality of WooCommerce's data model (string prices, mixed meta, flat category arrays) is converted to the clean application model.

**Key transformations:**
```
WC price string "450.00" → number 450
WC average_rating string "4.5" → number 4.5
WC categories array → brand string (the brand category)
WC meta_data array → soldCount number
WC tags array → badge 'bestseller' | 'new' | 'sale' | null
WC attribute "pa_color" → colorName string + colorHex string
```

### 7.5 `lib/woocommerce/orders.ts`

**Responsibilities:**
- `createOrder(orderData)` — creates a WooCommerce order via POST
- Accepts `OrderCreateInput` (typed from checkout form data + cart items)
- Maps to WooCommerce order creation payload format
- Returns `{ orderId: number, orderNumber: string }`

This function is called only from the `/api/orders` API route — never directly from a component.

### 7.6 Caching Strategy

WooCommerce API responses are cached at the Next.js `fetch` layer using the `revalidate` option:

| Request Type | Cache Duration | Rationale |
|---|---|---|
| Product list (shop page) | 0 (no cache — SSR) | Filter/sort params make each request unique |
| Product detail | 300s (5 min) | Price and stock changes need to propagate |
| Brand data | 3600s (1 hr) | Brand metadata is near-static |
| Category list | 86400s (24 hr) | Categories change only on catalog restructure |
| Search results | 0 (no cache) | Every query is unique |
| Bestsellers | 1800s (30 min) | Acceptable staleness for popularity ranking |

**On-demand revalidation:** WooCommerce can trigger revalidation via the `/api/revalidate` webhook when products are updated. This webhook is called by a WooCommerce action hook on product save and is protected by a shared secret.

### 7.7 Error Handling in the Integration Layer

```typescript
class WooCommerceError extends Error {
  constructor(
    public status: number,
    public endpoint: string,
    public body: string
  ) {
    super(`WooCommerce API error ${status} on ${endpoint}`);
    this.name = 'WooCommerceError';
  }
}
```

Page components that call integration functions wrap them in `try/catch`. Uncaught errors propagate to the nearest `error.tsx` boundary. The error boundary renders the appropriate Arabic error state (§16).

---

## 8. API Route Architecture

All API routes live in `src/app/api/`. They are Next.js Route Handlers and run exclusively on the server. They are the only surface where client-side code can trigger server-side operations.

### 8.1 `POST /api/orders`

**Purpose:** Receive checkout form data from the client, validate it, create a WooCommerce order, return the order ID.

**Input:**
```typescript
interface OrderRequest {
  customer: {
    fullName: string;
    phone: string;
    governorate: string;
    city: string;
    address: string;
    building?: string;
    notes?: string;
  };
  items: Array<{
    productId: number;
    variationId: number;
    quantity: number;
    price: number;
  }>;
}
```

**Output:**
```typescript
interface OrderResponse {
  orderId: number;
  orderNumber: string;
}
```

**Validation:** Zod `orderRequestSchema` — validates all customer fields including Egyptian phone format and governorate enum.

**Error handling:** Returns `400` with field-level validation errors for invalid input. Returns `503` with a generic error for WooCommerce API failures (never exposes API details to client).

**Security:** Rate limited to 10 requests per IP per hour using Vercel's edge rate limiting. No authentication required (guest checkout). Input sanitized before WooCommerce submission.

---

### 8.2 `GET /api/search`

**Purpose:** Serve search suggestions for the instant search overlay. Does not return full product data — returns a lightweight suggestion payload.

**Input (query params):**
```
q: string          (search query, 2+ characters)
limit?: number     (default: 8)
```

**Output:**
```typescript
interface SearchResponse {
  products: SearchProductSuggestion[];
  brands: SearchBrandSuggestion[];
  colors: SearchColorSuggestion[];
}
```

**Rationale for API route:** The search function queries WooCommerce with credentials. It cannot run client-side. The API route decouples the search overlay from knowing anything about WooCommerce.

**Debounce responsibility:** Debouncing is applied client-side (in `useSearch` hook, 200ms delay) before the API is called. The API route itself does not debounce.

**Caching:** Search responses are not cached at the route level. TanStack Query on the client caches results per unique query string for the session duration.

---

### 8.3 `POST /api/contact`

**Purpose:** Process the contact form submission. In v2.0, this generates a WhatsApp deep-link and optionally logs the inquiry.

**Input:**
```typescript
interface ContactRequest {
  name: string;
  phone: string;
  subject: string;
  message: string;
}
```

**Output:**
```typescript
interface ContactResponse {
  whatsappUrl: string;   // Pre-filled WhatsApp link
}
```

**Security:** Rate limited to 5 requests per IP per hour. Honeypot field validation (a hidden field that bots fill but humans don't). Input length limits enforced server-side.

---

### 8.4 `POST /api/revalidate`

**Purpose:** On-demand ISR cache revalidation triggered by WooCommerce webhooks when products are updated.

**Input:**
```typescript
interface RevalidateRequest {
  secret: string;          // Must match REVALIDATION_SECRET env var
  type: 'product' | 'category' | 'brand' | 'all';
  slug?: string;           // Required for type: 'product' or 'brand'
}
```

**Security:** The `secret` field is compared to `REVALIDATION_SECRET` environment variable using `crypto.timingSafeEqual` to prevent timing attacks. Requests with wrong secret return `401`.

**Behavior:** Calls `revalidatePath()` or `revalidateTag()` for the affected route(s).

---

### 8.5 `GET /api/health`

**Purpose:** Health check endpoint for monitoring. Verifies the WooCommerce API is reachable.

**Output:** `{ status: 'ok', woocommerce: 'connected' | 'error', timestamp: string }`

---

## 9. State Management Architecture

### 9.1 State Classification

| State Type | What It Contains | Where It Lives | Technology |
|---|---|---|---|
| Server state | Product data, brand data, category data | TanStack Query cache | TanStack Query |
| Persistent client state | Cart items, wishlist slugs, account data, recently viewed | localStorage + Zustand | Zustand + persist |
| Ephemeral client state | UI state (search open, drawer open, active tab) | React component state or Zustand | Zustand or useState |
| URL state | Shop filters, sort, search query | URL search params | Next.js `useSearchParams` |
| Form state | Checkout form, contact form | React Hook Form | React Hook Form + Zod |

### 9.2 TanStack Query

Used for all server state that is fetched client-side (search suggestions, product data in Quick View, variation data on color selection).

**Why TanStack Query over raw useState + useEffect:**
- Automatic caching and deduplication (two components requesting the same product share one fetch)
- Background refetch on window focus
- Loading, error, and success states without boilerplate
- Query invalidation for stale data management
- Integrates cleanly with the WooCommerce integration layer

**Configuration:**
```typescript
// src/providers/QueryProvider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      gcTime: 10 * 60 * 1000,      // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,  // Avoid re-fetching on WhatsApp tab-switch
    },
  },
});
```

`refetchOnWindowFocus: false` is specifically important for the Egyptian mobile context where users frequently switch between the browser and WhatsApp.

### 9.3 Zustand Stores

**Cart Store (`src/store/cart.store.ts`)**

```typescript
interface CartStore {
  items: CartItem[];
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: number, variationId: number) => void;
  updateQuantity: (productId: number, variationId: number, quantity: number) => void;
  clearCart: () => void;
  // Selectors
  itemCount: () => number;
  subtotal: () => number;
  hasItem: (productId: number, variationId: number) => boolean;
}
```

Persisted to localStorage key `martal_cart_v2`. The `_v2` suffix prevents conflicts with any MARTAL 1.0 data in the same browser.

**Wishlist Store (`src/store/wishlist.store.ts`)**

```typescript
interface WishlistStore {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
  count: () => number;
}
```

Persisted to localStorage key `martal_wishlist_v2`.

**UI Store (`src/store/ui.store.ts`)**

```typescript
interface UIStore {
  // Search
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  // Cart drawer
  cartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  // Filter drawer (mobile)
  filterDrawerOpen: boolean;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  // Recently viewed
  recentlyViewed: RecentlyViewedItem[];
  addToRecentlyViewed: (item: RecentlyViewedItem) => void;
}
```

Not persisted. All UI state resets on page load.

### 9.4 URL State (Shop Filters)

Filter and sort state in the Shop page lives in URL search parameters, not in component state or Zustand. This is a critical architectural decision:

**Why URL state for filters:**
- Filter state survives page navigation and browser back/forward
- Filtered URLs are shareable and bookmarkable
- Filtered URLs are SEO-indexable (brand-specific filtered views can rank)
- Deep-linking from social media directly to filtered views is possible
- No state hydration mismatch between server and client

**Filter URL parameter schema:**
```
/shop?brand=hypnose&color=brown&price_min=300&price_max=600&flag=sale&sort=popularity&page=2
```

All filter reads and writes use Next.js `useSearchParams` and `useRouter` hooks. The `FilterSidebar` component reads from URL params on mount and writes back on change.

### 9.5 React Hook Form

Used for all forms: checkout, contact, address editing. Paired with Zod schemas via `@hookform/resolvers/zod`.

**Why React Hook Form over Formik or uncontrolled forms:**
- Minimal re-renders (uncontrolled inputs by default)
- Built-in validation integration with Zod
- Field-level error messages without custom plumbing
- Easy form state (isSubmitting, isValid) for button states and loading indicators

---

## 10. Search Architecture

### 10.1 System Design

```
User types in search input
  ↓ (client-side debounce: 200ms)
useSearch hook
  ↓
TanStack Query: useQuery({ queryKey: ['search', query], queryFn })
  ↓
GET /api/search?q=[query]
  ↓
API route calls lib/woocommerce/search.ts
  ↓
WooCommerce: GET /products?search=[query]&per_page=8
  + category name matching for brand results
  + attribute matching for color results
  ↓
Transformed to SearchResponse
  ↓
SearchOverlay renders three suggestion groups
```

### 10.2 Arabic/English Query Handling

The synonym resolution map (established in MARTAL 1.0's `search-engine.js` and documented in the brief §12.2) is implemented in `lib/woocommerce/search.ts` before the WooCommerce API call:

```typescript
const SYNONYMS: Record<string, string[]> = {
  'brown':   ['بني', 'براون', 'بن'],
  'gray':    ['رمادي', 'grey', 'جراي'],
  'honey':   ['عسلي', 'هاني', 'عسل'],
  'blue':    ['أزرق', 'بلو'],
  'green':   ['أخضر', 'جرين'],
  'violet':  ['بنفسجي', 'فايوليت'],
  'natural': ['طبيعي', 'نيوترال'],
  'bridal':  ['عروسة', 'زفاف', 'فرح', 'برايدال'],
  'hypnose': ['هيبنوز', 'هيبنوس'],
  // ... complete map
};
```

The search function checks the query against this map bidirectionally and augments the WooCommerce search with resolved synonyms.

### 10.3 Recent Searches

Stored in localStorage key `martal_recent_searches` as an array of strings. Maximum 8 entries. FIFO eviction. Read and written by the `useSearch` hook.

### 10.4 Trending Searches

A static configuration in `src/lib/constants/trending.ts`. Updated manually based on WhatsApp inquiry patterns and WooCommerce sales data. Not dynamically computed in v2.0.

### 10.5 Future Algolia Migration Path

The search architecture is designed so that Algolia can replace the WooCommerce search backend without touching any component. The migration path:

1. Install Algolia and index WooCommerce products (via WooCommerce-Algolia plugin or custom sync script)
2. Replace `lib/woocommerce/search.ts` with `lib/algolia/search.ts`
3. Update `/api/search` to call the new search module
4. No component changes required

The `SearchResponse` type is the stable interface contract. Algolia improves result relevance and adds typo tolerance — the application layer remains identical.

---

## 11. Cart Architecture

### 11.1 Cart Data Flow

```
Add to Cart (from ProductCard, PDP, or QuickView)
  ↓
CartStore.addItem() — Zustand action
  ↓
Store state updates → localStorage via persist middleware
  ↓
UI Store.openCartDrawer() — cart drawer opens
  ↓
CartDrawer reads CartStore.items via useCart() hook
  ↓
CartItem components render from store state
  ↓
CartSummary computes subtotal via CartStore.subtotal()
  ↓
FreeShippingProgress computes progress from subtotal
```

### 11.2 Cart State Persistence

The Zustand `persist` middleware serializes the cart state to localStorage on every state change. On application load, the persisted state is rehydrated before any component renders.

**Staleness detection:** The `CartItem` includes the `price` at time of adding. If the user returns to a cart after a WooCommerce price change, the cart reflects the old price. A cart validation step on checkout page mount re-fetches current prices for all cart items and displays a warning if any price has changed.

**Version migration:** The persist key is `martal_cart_v2`. If cart data structure changes in a future version, increment the version suffix and write a migration function.

### 11.3 Quantity Management Rules

- Minimum quantity: 1 (the UI does not allow 0; remove button must be used to remove)
- Maximum quantity: 10 per variation (enforced in `addItem` and `updateQuantity`)
- Incrementing beyond maximum is silently capped (no error — just doesn't exceed 10)

### 11.4 Free Shipping Progress Logic

```typescript
const FREE_SHIPPING_THRESHOLD = 800; // EGP, from config

function shippingCost(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
}

function freeShippingProgress(subtotal: number): number {
  return Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1);
}

function amountToFreeShipping(subtotal: number): number {
  return Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
}
```

---

## 12. Checkout Architecture

### 12.1 Checkout Page Architecture

The checkout page is a CSR page. It reads the cart from Zustand on mount. If the cart is empty, it immediately redirects to `/shop`. The checkout page never fetches from WooCommerce directly — it sends a POST to `/api/orders`.

### 12.2 Complete Order Submission Flow

```
Step 1: User fills checkout form
  → React Hook Form manages field state
  → Zod validates on blur (field-level errors in Arabic)
  → "تأكيدي الطلب" button disabled until form is valid

Step 2: User submits form
  → React Hook Form validates entire form
  → If valid: sets isSubmitting = true, button shows loading state
  → If invalid: error messages displayed, scroll to first error

Step 3: Client sends POST /api/orders
  → Payload: { customer: FormData, items: CartState.items }
  → Request includes no WooCommerce credentials

Step 4: API route /api/orders
  → Validates request body with Zod orderRequestSchema
  → If invalid: returns 400 with validation errors
  → Constructs WooCommerce order payload:
    {
      payment_method: 'cod',
      payment_method_title: 'الدفع عند الاستلام',
      set_paid: false,
      billing: { first_name, last_name, phone, address_1, city, state, country: 'EG' },
      shipping: { same as billing },
      line_items: [{ product_id, variation_id, quantity }],
      meta_data: [{ key: 'source', value: 'martal-2.0-web' }]
    }
  → Calls lib/woocommerce/orders.createOrder(payload)
  → WooCommerce returns order object
  → Returns { orderId, orderNumber } to client

Step 5: Client handles response
  → SUCCESS: 
    CartStore.clearCart()
    Store order to localStorage: martal_orders (for account page)
    Navigate to /order-success?id=[orderId]&number=[orderNumber]
  → FAILURE (network error, 503):
    Show toast: "حدث خطأ — تواصلي معنا على واتساب"
    WhatsApp fallback CTA with order details pre-filled
    Do NOT clear cart

Step 6: Order Success page
  → Reads orderId and orderNumber from URL params
  → Displays confirmation message in Arabic
  → Renders WhatsApp tracking deep-link
  → Renders "Continue Shopping" CTA
```

### 12.3 WhatsApp Fallback

If the order API call fails, the checkout page shows a fallback WhatsApp button. The WhatsApp message is pre-constructed from the form data and cart items:

```
السلام عليكم MARTAL 🛍
عايزة أطلب:
[product list from cart]
الإجمالي: [X] جنيه
اسمي: [name]
موبايلي: [phone]
العنوان: [governorate], [city], [address]
```

This ensures that even if the WooCommerce backend is temporarily unavailable, the customer can still complete their purchase intent via WhatsApp.

### 12.4 Order Storage in localStorage

On successful order creation:
```typescript
// Structure stored in localStorage key: martal_orders
interface StoredOrder {
  orderId: number;
  orderNumber: string;
  date: string;            // ISO string
  items: CartItem[];
  total: number;
  status: 'processing';    // Always 'processing' in v2.0 (no status updates)
  customer: {
    name: string;
    phone: string;
    governorate: string;
  };
}
```

Maximum 20 orders stored. Oldest orders removed when limit is exceeded.

---

## 13. SEO Architecture

### 13.1 Metadata Generation

Every route exports a `generateMetadata` function that returns Next.js `Metadata` object. The function receives route params and can be async (fetching product/brand data for dynamic pages).

```typescript
// app/(shop)/product/[slug]/page.tsx
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'المنتج غير متاح | MARTAL' };

  return {
    title: `${product.name} — عدسة ملونة كورية | MARTAL`,
    description: `اشتري ${product.name} من MARTAL — عدسة كورية شهرية أصلية. ${product.subtitle}. دفع عند الاستلام.`,
    openGraph: {
      title: `${product.name} | MARTAL`,
      description: product.subtitle,
      images: [{ url: product.images[0]?.url, alt: product.images[0]?.alt }],
      type: 'website',
      locale: 'ar_EG',
      siteName: 'MARTAL',
    },
    alternates: {
      canonical: `https://martal.store/product/${product.slug}`,
    },
    robots: { index: true, follow: true },
  };
}
```

### 13.2 JSON-LD Structured Data

Rendered as a `<script type="application/ld+json">` tag in the `<head>` via a server component. Injected through the `generateMetadata` return or a dedicated `<JsonLd>` server component.

**Product pages:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Hypnose Brown",
  "brand": { "@type": "Brand", "name": "Hypnose" },
  "description": "...",
  "image": ["..."],
  "offers": {
    "@type": "Offer",
    "price": "450",
    "priceCurrency": "EGP",
    "availability": "https://schema.org/InStock",
    "seller": { "@type": "Organization", "name": "MARTAL" }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "124"
  }
}
```

**FAQ page:** `FAQPage` schema with all 30+ questions and answers.

**Organization (homepage):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "MARTAL",
  "url": "https://martal.store",
  "logo": "https://martal.store/images/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Arabic"
  },
  "areaServed": "EG"
}
```

### 13.3 Sitemap

Generated automatically via `src/app/sitemap.ts`:

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts({ per_page: 100 });
  const brands = BRAND_SLUGS; // Static config

  return [
    { url: 'https://martal.store', changeFrequency: 'weekly', priority: 1 },
    { url: 'https://martal.store/shop', changeFrequency: 'daily', priority: 0.9 },
    ...products.map(p => ({
      url: `https://martal.store/product/${p.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...brands.map(b => ({
      url: `https://martal.store/brand/${b}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: 'https://martal.store/faq', changeFrequency: 'monthly', priority: 0.6 },
    // ... all static pages
  ];
}
```

### 13.4 robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /checkout
Disallow: /account
Disallow: /order-success

Sitemap: https://martal.store/sitemap.xml
```

### 13.5 Arabic SEO Considerations

- `<html lang="ar" dir="rtl">` is set in the root layout
- All `<title>` and `<meta name="description">` content is Arabic-first
- Arabic content in meta tags does not require escaping — UTF-8 is the standard
- Google indexes Arabic content fully; no special treatment needed beyond correct `lang` attribute
- Brand names (Hypnose, ICONIC, etc.) appear in both Arabic and Latin in metadata where appropriate: "عدسات Hypnose الملونة"

---

## 14. Performance Architecture

### 14.1 Performance Budgets

| Metric | Budget | Measurement Context |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 90 | Moto G4 profile, 4G throttling |
| LCP | < 2.5s | Same |
| CLS | < 0.05 | Tighter than WCAG — layout shift is perceptible |
| INP | < 200ms | Touch interaction response |
| FCP | < 1.8s | First meaningful paint |
| TTFB | < 600ms | Vercel edge to Egyptian user |
| Total JS (first load) | < 150KB gzipped | Critical path only |
| Total JS (per route) | < 80KB gzipped | Route-specific chunks |
| Largest image (LCP) | < 100KB | WebP, correctly sized |

### 14.2 Image Strategy

All images use `next/image`:
- **Format:** WebP automatically via `next/image` `formats: ['image/webp', 'image/avif']`
- **Sizing:** `sizes` prop defined for every image to prevent oversized downloads
- **Priority:** LCP image (hero, first product image) uses `priority={true}` — pre-loaded
- **Placeholder:** `placeholder="blur"` with `blurDataURL` for all product images above the fold; `lazy` loading below
- **Product card:** `sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"`
- **Hero image:** `sizes="100vw"`, `priority={true}`
- **External domain:** WooCommerce media URL must be added to `next.config.ts` `images.remotePatterns`

### 14.3 Bundle Strategy

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};
```

Framer Motion is tree-shakeable. Only import the specific components used:
```typescript
// ✅ Import only what's needed
import { motion, AnimatePresence } from 'framer-motion';

// ❌ Avoid barrel import of entire library
import * as FramerMotion from 'framer-motion';
```

### 14.4 Suspense and Loading States

Every data-dependent component is wrapped in a `<Suspense>` boundary with a skeleton fallback. This enables streaming server rendering — the page shell renders immediately, data-dependent sections stream in as they resolve.

```
ProductPage
  <Suspense fallback={<ProductGallerySkeleton />}>
    <ProductGallery slug={params.slug} />
  </Suspense>
  <Suspense fallback={<ProductInfoSkeleton />}>
    <ProductInfo slug={params.slug} />
  </Suspense>
  <Suspense fallback={<ReviewsSkeleton />}>
    <ProductReviews productId={product.id} />
  </Suspense>
```

Skeleton components have the same dimensions as the content they replace — preventing CLS when content loads.

### 14.5 Font Loading

```typescript
// src/app/layout.tsx
import { Cairo, Inter } from 'next/font/google';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: false, // Inter is not critical path — Cairo is used for above-fold content
});
```

---

## 15. Security Architecture

### 15.1 Environment Variables

```bash
# .env.example — committed to repository (values redacted)
# .env.local — never committed

# WooCommerce (server-only — NO NEXT_PUBLIC_ prefix)
WOOCOMMERCE_URL=https://admin.martal.store
WOOCOMMERCE_KEY=ck_...
WOOCOMMERCE_SECRET=cs_...

# Webhook protection
REVALIDATION_SECRET=...

# Application
NEXT_PUBLIC_SITE_URL=https://martal.store
NEXT_PUBLIC_WHATSAPP_NUMBER=+201XXXXXXXXX
```

**Rule:** Any variable containing a secret or API credential MUST NOT have the `NEXT_PUBLIC_` prefix. The only public variables are the site URL and WhatsApp number — both are visible in source code anyway.

The `import 'server-only'` directive in `lib/woocommerce/client.ts` prevents accidental inclusion in client bundles at build time.

### 15.2 Security Headers

Configured via `next.config.ts` and Vercel's `vercel.json`:

```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://admin.martal.store",
      "connect-src 'self' https://admin.martal.store https://www.google-analytics.com",
    ].join('; '),
  },
];
```

### 15.3 Rate Limiting

Applied via Vercel's Edge Middleware or Upstash Redis rate limiting on mutation endpoints:

| Endpoint | Limit | Window |
|---|---|---|
| `POST /api/orders` | 10 requests | Per IP per hour |
| `POST /api/contact` | 5 requests | Per IP per hour |
| `GET /api/search` | 60 requests | Per IP per minute |
| `POST /api/revalidate` | 20 requests | Per hour (webhook abuse prevention) |

### 15.4 Input Validation

Every API route validates its input before processing. No WooCommerce call is made with unvalidated data. Zod schemas defined in `src/lib/validations/` are the single source of truth for valid input shapes.

### 15.5 XSS Prevention

- All user-generated content (order notes, contact messages) is sanitized before storage and display
- React's JSX escapes HTML by default — `dangerouslySetInnerHTML` is never used unless absolutely required (and reviewed case by case)
- WooCommerce product descriptions may contain HTML from the admin editor — these are rendered via a controlled HTML renderer that strips `<script>` tags

### 15.6 COD Order Abuse Prevention

Since COD orders require no payment upfront, they can be abused (fake addresses, repeated cancellations). Mitigations:

- Rate limiting on `/api/orders` prevents order flooding from single IPs
- Phone number validation (Egyptian format) reduces non-Egyptian bot orders
- Order notes field is optional — an unusual note pattern can flag suspicious orders for WooCommerce admin review
- WooCommerce order management (fulfillment decisions, cancel policies) is the merchant's responsibility and out of frontend scope

---

## 16. Error Handling Architecture

### 16.1 Error Boundary Hierarchy

```
app/layout.tsx (root)
  app/error.tsx ← catches errors from all routes
    app/(shop)/error.tsx ← shop-specific errors
    app/(commerce)/checkout/error.tsx ← checkout-specific errors
```

Each error boundary renders an Arabic error state (from the Content document, §14) appropriate to its context. The checkout error boundary specifically includes a WhatsApp fallback CTA.

### 16.2 API Error Classification

```typescript
type ApiError =
  | { type: 'validation'; fields: Record<string, string> }
  | { type: 'not_found'; message: string }
  | { type: 'server_error'; message: string }
  | { type: 'network_error' }
  | { type: 'rate_limited'; retryAfter: number };
```

API routes return structured errors matching this union type. Client error handling switches on `error.type` to render the appropriate Arabic message.

### 16.3 Product Loading Failure

If a product page fails to load (WooCommerce is unreachable), the Next.js error boundary catches the error. The product's `loading.tsx` skeleton is shown during the attempt, replaced by the error UI if the attempt fails.

**Graceful degradation:** If only the Reviews tab fails to load, the error is contained within the Reviews `<Suspense>` boundary. The rest of the PDP remains functional. Partial page failure does not break the entire page.

### 16.4 Checkout Failure Recovery

The checkout failure state is the highest-stakes error in the application. Design:

1. The cart is never cleared on a failed order submission
2. The error state explains what happened without technical details
3. The WhatsApp fallback CTA is prominently displayed with the order details pre-filled
4. A "Try Again" button resubmits the form without requiring the user to re-enter data

---

## 17. Deployment Architecture

### 17.1 Infrastructure Overview

```
martal.store (custom domain)
  ↓
Vercel Edge Network (CDN + SSL)
  ↓
Vercel Serverless/Edge Functions (Next.js)
  ↓
WooCommerce (separate VPS or managed WordPress hosting)
  admin.martal.store (subdomain, not publicly linked)
```

### 17.2 Vercel Configuration

```json
// vercel.json
{
  "framework": "nextjs",
  "regions": ["fra1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

**Region:** `fra1` (Frankfurt) is the closest Vercel region to Egypt. This minimizes TTFB for Egyptian users. Vercel's global CDN serves cached ISR pages from edge nodes closer to users regardless of origin region.

### 17.3 Environment Configuration

| Environment | Branch | Variables | Purpose |
|---|---|---|---|
| Production | `main` | `WOOCOMMERCE_*` pointing to live WC | Live site |
| Preview | PR branches | `WOOCOMMERCE_*` pointing to staging WC | PR review |
| Development | local | `.env.local` | Local development |

### 17.4 Build Pipeline

```
Developer pushes to PR branch
  ↓
GitHub Actions (CI):
  → TypeScript type check: tsc --noEmit
  → Lint: eslint
  → Build: next build (catches build-time errors)
  ↓
Vercel Preview Deployment (automatic on PR)
  ↓
Review and approval
  ↓
Merge to main
  ↓
Vercel Production Deployment (automatic on merge to main)
  ↓
Smoke test: /api/health endpoint check
  ↓
Deployment complete
```

### 17.5 Rollback Strategy

Vercel maintains deployment history. A rollback is a single click in the Vercel dashboard to promote a previous deployment. No code changes required. Rollback completes in under 60 seconds.

---

## 18. Observability Architecture

### 18.1 Analytics Stack

| Tool | Purpose | What It Tracks |
|---|---|---|
| Google Analytics 4 | User behavior, funnels | Page views, events, conversions |
| Google Search Console | Search performance | Rankings, impressions, CTR |
| Microsoft Clarity | Heatmaps + session recording | Rage clicks, scroll depth, UX issues |
| Sentry | Error monitoring | JavaScript errors, API errors |

### 18.2 GA4 Event Schema

These events must be instrumented from day one to enable funnel analysis:

| Event Name | Trigger | Parameters |
|---|---|---|
| `view_item` | Product page load | `item_id`, `item_name`, `item_brand`, `price` |
| `add_to_cart` | Add to Cart click | `item_id`, `quantity`, `value` |
| `begin_checkout` | /checkout page load | `value`, `num_items` |
| `checkout_error` | Order API failure | `error_type` |
| `purchase` | Order success page load | `transaction_id`, `value`, `items` |
| `wishlist_add` | Wishlist toggle (add) | `item_id`, `item_name` |
| `search` | Search query submitted | `search_term` |
| `whatsapp_click` | WhatsApp FAB or CTA click | `page`, `context` |
| `filter_apply` | Filter applied in shop | `filter_type`, `filter_value` |
| `view_item_list` | Shop grid viewed | `list_name`, items |

**The `whatsapp_click` event** is particularly important — it quantifies the WhatsApp conversion assist rate and informs when to invest in WhatsApp automation.

### 18.3 Sentry Configuration

```typescript
// Sentry captures:
// - Unhandled JavaScript errors
// - API route errors (with sanitized request/response logging)
// - WooCommerce API failures (with endpoint and status code)
// - Checkout failures (critical — immediate alerting)

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,        // 10% of transactions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0, // 100% capture on errors
  beforeSend(event) {
    // Strip PII from error events
    if (event.request?.data) {
      delete event.request.data.phone;
      delete event.request.data.address;
    }
    return event;
  },
});
```

---

## 19. Scalability Roadmap

### 19.1 v2.1: Authentication and Payments

**Authentication:** WooCommerce JWT authentication plugin + NextAuth.js. The account page localStorage model is replaced with real WooCommerce customer accounts. The localStorage data structure (orders, address) is designed to be 1:1 compatible with WooCommerce customer fields — migration is a data sync operation, not a redesign.

**Payments:** Paymob or Fawry integration via `/api/payment/initiate` and `/api/payment/callback` routes. The checkout architecture already routes order creation through an API route — adding a payment step is an extension of that route, not a restructure.

**Reviews:** WooCommerce reviews API (`POST /products/{id}/reviews`) — the review display is already built; submission adds one API call through a new `/api/reviews` route.

**Architecture decisions today that enable v2.1:**
- Zustand stores are localStorage-first, making the move to server-synced state a non-breaking additive change
- The checkout API route accepts an extensible `OrderRequest` type — adding `paymentIntentId` is a minor schema extension
- User data in localStorage uses WooCommerce field names — migration is a `getLocalOrders()` → `getWooCustomerOrders()` swap in the account components

### 19.2 v2.2: Marketing Automation

**Email/WhatsApp:** Klaviyo or Sendinblue integration. The GA4 event schema defined in §18.2 is already designed as a compatible event stream for marketing automation triggers. The `purchase` event is the entry point for the post-purchase WhatsApp sequence defined in the Content document (§15).

**Abandoned cart recovery:** The cart store's `updatedAt` timestamp enables detection of abandoned carts. A Vercel Cron job reads localStorage-persisted cart data (via a server-side session mechanism in v2.2) and triggers WhatsApp outreach.

### 19.3 v3.0: Platform Evolution

**PWA:** Next.js `next-pwa` plugin adds a service worker. The ISR caching already established means most product content is available offline. The manifest.json for PWA installation is low-effort on top of the existing architecture.

**Headless CMS:** Sanity or Contentful replaces WordPress for editorial content (homepage hero, brand stories, look editorial). WooCommerce remains for commerce data. The separation of concerns already built into the integration layer (WooCommerce handles products, the application handles display) makes the CMS addition additive rather than disruptive.

**Multi-language:** `next-intl` library wraps all Arabic strings in translation functions. The RTL architecture already in place means LTR English is a layout toggle, not a rebuild.

---

## 20. Architecture Decision Record

| # | Decision | Chosen Option | Alternative Rejected | Reason |
|---|---|---|---|---|
| ADR-001 | Commerce backend | Headless WooCommerce | Custom Node.js API | WooCommerce provides complete commerce features (inventory, orders, coupons, variations) with zero custom backend development |
| ADR-002 | Frontend framework | Next.js 15 App Router | Pages Router / Remix / Vite SPA | App Router provides Server Components, ISR, and streaming that directly address SEO and performance requirements |
| ADR-003 | Language | TypeScript strict | JavaScript / TypeScript lenient | v1's dynamic product array produced runtime errors; TypeScript strict eliminates this category entirely |
| ADR-004 | Rendering: product pages | ISR (revalidate: 300) | Full SSR | SSR would hit WooCommerce API on every request at scale; ISR caches with acceptable 5-minute staleness |
| ADR-005 | Rendering: shop/search | SSR | ISR | URL filter params make every request unique; cache provides no benefit for filtered requests |
| ADR-006 | State management | Zustand | Redux / Context / Jotai | Minimal boilerplate, localStorage persistence via middleware, no provider wrapping required |
| ADR-007 | Server state | TanStack Query | SWR / React Query v4 | TanStack Query v5 has superior TypeScript support and consistent API; SWR lacks mutation primitives |
| ADR-008 | Form management | React Hook Form + Zod | Formik / uncontrolled | Minimal re-renders critical for mobile performance; Zod provides shared validation between client and API route |
| ADR-009 | Cart persistence | Zustand + localStorage | Cookies / SessionStorage / Server session | localStorage survives tab close without server round-trips; no auth required in v2.0 |
| ADR-010 | Filter state | URL search params | React state / Zustand | URL state is shareable, bookmarkable, SEO-indexable, and survives navigation |
| ADR-011 | Payment method | COD only | Paymob / Fawry in v2.0 | COD is the trust requirement for the Egyptian market in v2.0; payment gateway deferred to v2.1 |
| ADR-012 | Authentication | None in v2.0 | NextAuth.js / Clerk | localStorage account model ships v2.0 faster and serves the use case; full auth deferred to v2.1 |
| ADR-013 | Search backend | WooCommerce REST search | Algolia / Typesense | WooCommerce search is sufficient for the current catalog size; Algolia migration path is designed in (§10.5) |
| ADR-014 | Component primitives | Shadcn/UI | MUI / Chakra UI / Radix direct | Shadcn/UI provides accessible, copy-owned components that can be fully restyled to MARTAL's design system |
| ADR-015 | CSS framework | Tailwind CSS | CSS Modules / styled-components | Tailwind's utility approach produces consistent, purgeable CSS; logical properties enable RTL without overrides |
| ADR-016 | Animation | Framer Motion | CSS animations only | Framer Motion's declarative API handles complex interactions (drag, spring, stagger) that pure CSS cannot |
| ADR-017 | Deployment | Vercel | AWS Amplify / Netlify / Self-hosted | Vercel's ISR implementation is native and first-class; edge network closest to Egypt; zero-config Next.js optimization |
| ADR-018 | Error monitoring | Sentry | Datadog / LogRocket | Sentry's free tier covers v2.0 volume; best-in-class Next.js integration |
| ADR-019 | Analytics | GA4 + Clarity | Mixpanel / PostHog | GA4 integrates with Google Search Console; Clarity provides heatmaps on free tier; both are zero-cost to start |
| ADR-020 | WC credentials isolation | `import 'server-only'` | Manual review / convention | Build-time enforcement prevents accidental credential exposure regardless of developer attention |

---

*This document is the authoritative engineering reference for MARTAL 2.0. No architectural decision of meaningful consequence should be made without either following this document or formally updating it. An architecture that is inconsistently applied is no architecture at all.*

*Document Owner: Lead Architecture*  
*Last Updated: June 2026*  
*Version History: v1.0 — Initial architecture for MARTAL 2.0 pre-development*  
*Next: 07_IMPLEMENTATION_PLAN.md — Sprint breakdown, task sequencing, and development milestones*
