# 07 — COMPONENT MAP
## MARTAL 2.0: Complete Component Inventory & Ownership Reference

**Document Type:** Component Architecture & Ownership Map  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Pre-Development — Component Engineering Reference  
**Prepared by:** Staff Frontend Engineering  
**Reads after:** 06_ARCHITECTURE.md  
**Audience:** Frontend Engineers

> **Relationship to the Architecture document.** The Architecture document (06) defines *how* the system is engineered — rendering strategies, data flows, state management choices, API layer design. This document defines *what* the system is made of — every component, its responsibilities, its props contract, its state dependencies, and who owns it. These documents are companions. Architecture explains the rules; the Component Map applies them to every concrete component in the application.

> **No implementation code.** This document contains no TypeScript, no Tailwind, no JSX. It contains prop contracts (what a component accepts), state ownership (where data comes from), and dependency maps (what a component needs to function). Implementation is the engineer's responsibility; this map is the specification they implement against.

---

## Table of Contents

1. [Component Philosophy](#1-component-philosophy)
2. [Component Taxonomy](#2-component-taxonomy)
3. [Global Layout Components](#3-global-layout-components)
4. [Header Component Tree](#4-header-component-tree)
5. [Homepage Component Map](#5-homepage-component-map)
6. [Shop Page Component Map](#6-shop-page-component-map)
7. [Product Page Component Map](#7-product-page-component-map)
8. [ProductCard Deep Dive](#8-productcard-deep-dive)
9. [Search System Component Map](#9-search-system-component-map)
10. [Cart System Component Map](#10-cart-system-component-map)
11. [Checkout Component Map](#11-checkout-component-map)
12. [Account System Component Map](#12-account-system-component-map)
13. [Wishlist Component Map](#13-wishlist-component-map)
14. [Brand Page Component Map](#14-brand-page-component-map)
15. [Contact & FAQ Component Maps](#15-contact--faq-component-maps)
16. [Shared Commerce Components](#16-shared-commerce-components)
17. [Props Contracts](#17-props-contracts)
18. [State Ownership Matrix](#18-state-ownership-matrix)
19. [Server vs Client Component Matrix](#19-server-vs-client-component-matrix)
20. [Reuse Strategy](#20-reuse-strategy)
21. [Component Ownership Rules](#21-component-ownership-rules)
22. [Component Dependency Graph](#22-component-dependency-graph)
23. [Future Components Roadmap](#23-future-components-roadmap)

---

## 1. Component Philosophy

### 1.1 The Five Component Layers

MARTAL 2.0 organizes every component into one of five layers. The layer determines where the component lives, what it is allowed to know about, and what it must remain ignorant of.

**Layer 1 — Design System Components (`components/ui/`)**  
Primitive, visually-styled, headless components. Button, Input, Badge, Modal, Drawer, Skeleton, Toast. These components know about the design system (colors, radius, spacing) and nothing else. They have no knowledge of WooCommerce, cart state, product types, or any business concept. They are the LEGO bricks that all higher-layer components are built from.

**Layer 2 — Layout Components (`components/layout/`)**  
Application shell components. They appear on every page and manage the structural frame of the application. They know about routing (active link states) and global UI state (cart drawer open, search open), but they have no knowledge of individual business domains like products or orders.

**Layer 3 — Feature Components (`components/search/`, `components/account/`, `components/wishlist/`)**  
Domain-specific, self-contained feature implementations. A search component knows about the search state machine. An account component knows about localStorage order history. Each feature component domain is internally cohesive and externally isolated — it does not reach into other feature domains.

**Layer 4 — Commerce Components (`components/product/`, `components/shop/`, `components/cart/`, `components/checkout/`, `components/brand/`)**  
Components that implement commerce-specific behavior. They consume data that originates from WooCommerce (via props or server-fetched data passed in) and connect to commerce state (cart, wishlist). This layer knows about `Product`, `CartItem`, `Brand` types, but it does not call APIs directly — data arrives via props from server components or via Zustand stores.

**Layer 5 — Common Components (`components/common/`)**  
Cross-domain shared components that don't belong to a single feature. SectionHeader, TrustBar, EmptyState, ErrorState, ReviewCard, FAQAccordion, WhatsAppFAB. They are reusable across all higher layers but have no specific domain knowledge.

---

### 1.2 Core Engineering Principles Applied to Components

**Single Responsibility Principle.** Every component has one job. `ProductCard` presents a product. `WishlistToggle` manages the wishlist action. `PriceDisplay` formats and renders a price. When a component starts doing two things, it should become two components.

**Composition Over Inheritance.** Complex components are built by composing simpler ones, not by extending a base class. `ProductCard` contains `ProductBadge`, `PriceDisplay`, `WishlistToggle`, and `RatingStars` — each independently usable — rather than inheriting from a `BaseCard` that tries to anticipate all variations.

**Reusable-First Approach.** Before building a new component, determine whether an existing one can be extended via props. `EmptyState` is not built five times for five empty contexts — it is built once and accepts `headline`, `body`, and `cta` props. Every new component is evaluated: "does this already exist, or can something existing serve this purpose?"

**Server-First Architecture.** Every component is a React Server Component by default. The `'use client'` directive is applied only when a component requires browser APIs, React state, event listeners, Framer Motion animations, or Zustand store access. The principle: push the client boundary as deep as possible in the component tree to maximize server-rendered HTML.

**Client-Only When Necessary.** The three legitimate reasons a component becomes a Client Component: (1) it needs browser state, (2) it needs interactive event listeners, (3) it needs animation. Styling, layout, and data presentation do not require client-side rendering.

**Ownership Boundaries.** Each component owns its visual presentation and internal layout. It does not own state that belongs to a store, data that belongs to an API, or validation that belongs to a form schema. These are injected via props. A component that reaches outside its boundary is a component that cannot be tested, reused, or understood in isolation.

---

## 2. Component Taxonomy

Complete inventory of all components in MARTAL 2.0, organized by layer and domain.

```
MARTAL 2.0 Component System
│
├── UI LAYER (components/ui/)
│   ├── Button
│   ├── IconButton
│   ├── Badge
│   ├── Input
│   ├── Textarea
│   ├── Select (native)
│   ├── Checkbox
│   ├── Radio
│   ├── Modal
│   ├── Drawer (side)
│   ├── BottomSheet (mobile drawer)
│   ├── Accordion
│   ├── Tabs
│   ├── Toast
│   ├── Tooltip
│   ├── Skeleton
│   ├── ProgressBar
│   └── Separator
│
├── LAYOUT LAYER (components/layout/)
│   ├── Navbar (desktop)
│   ├── MobileHeader
│   ├── MobileBottomNav
│   ├── AnnouncementBar
│   ├── Footer
│   ├── MinimalHeader (checkout only)
│   ├── Container
│   ├── Section
│   └── PageShell
│
├── COMMON LAYER (components/common/)
│   ├── Breadcrumb
│   ├── SectionHeader
│   ├── TrustBar
│   ├── TrustStrip
│   ├── WhatsAppFAB
│   ├── ReviewCard
│   ├── FAQAccordion
│   ├── CTABanner
│   ├── EmptyState
│   ├── ErrorState
│   ├── SkeletonCard
│   ├── CODBadge
│   └── OriginBadge
│
├── PRODUCT DOMAIN (components/product/)
│   ├── ProductCard
│   ├── ProductBadge
│   ├── PriceDisplay
│   ├── RatingStars
│   ├── WishlistToggle
│   ├── SoldCount
│   ├── ProductGallery
│   │   └── GalleryThumbnail (internal)
│   ├── ColorSwatches
│   │   └── ColorSwatch (internal)
│   ├── QuantitySelector
│   ├── ProductTabs
│   │   ├── DescriptionTab (internal)
│   │   ├── SpecificationsTable (internal)
│   │   ├── HowToUseTab (internal)
│   │   └── ReviewsTab (internal)
│   ├── ProductBenefits
│   ├── DeliveryEstimate
│   ├── StickyMobilePDPBar
│   ├── RelatedProducts
│   └── RecentlyViewed
│
├── SHOP DOMAIN (components/shop/)
│   ├── ProductGrid
│   ├── FilterSidebar
│   ├── FilterDrawer
│   ├── FilterSection (internal)
│   ├── FilterChip
│   ├── ActiveFilters
│   ├── SortDropdown
│   ├── ShopToolbar
│   ├── QuickViewModal
│   ├── LoadMoreButton
│   └── EmptyShopState
│
├── CART DOMAIN (components/cart/)
│   ├── CartDrawer
│   ├── CartDrawerHeader (internal)
│   ├── CartItem
│   ├── FreeShippingProgress
│   ├── CartSummary
│   ├── EmptyCartState
│   └── CODDrawerBadge (internal)
│
├── CHECKOUT DOMAIN (components/checkout/)
│   ├── CheckoutForm
│   ├── CheckoutFormField (internal)
│   ├── GovernorateSelect
│   ├── OrderSummaryPanel (desktop sticky)
│   ├── OrderSummaryAccordion (mobile)
│   ├── OrderReviewList (internal)
│   ├── CODConfirmation
│   └── CheckoutHeader
│
├── SEARCH DOMAIN (components/search/)
│   ├── SearchOverlay
│   ├── SearchInput
│   ├── RecentSearches
│   │   └── RecentSearchItem (internal)
│   ├── TrendingSearches
│   │   └── TrendingSearchItem (internal)
│   ├── SearchSuggestions
│   │   ├── SearchProductSuggestion (internal)
│   │   ├── SearchBrandSuggestion (internal)
│   │   └── SearchColorSuggestion (internal)
│   └── NoSearchResults
│
├── BRAND DOMAIN (components/brand/)
│   ├── BrandHero
│   ├── BrandCard
│   ├── RelatedBrands
│   └── BrandOriginBadge
│
├── ACCOUNT DOMAIN (components/account/)
│   ├── AccountLayout
│   ├── AccountTabBar (mobile)
│   ├── AccountSidebar (desktop)
│   ├── LocalStorageBanner
│   ├── OrderCard
│   ├── OrderHistory
│   ├── AddressCard
│   ├── AddressForm (inline edit)
│   └── ProfileDisplay
│
└── WISHLIST DOMAIN (components/wishlist/)
    ├── WishlistToolbar
    └── EmptyWishlistState
```

---

## 3. Global Layout Components

These components form the persistent shell of the application. They appear on every page (or every page within their scope) and must remain visually and functionally stable across all routes.

---

### `AnnouncementBar`

| Property | Value |
|---|---|
| **Purpose** | Scrolling marquee of trust messages. First content the user sees on any page. |
| **Used On** | All pages (root layout) |
| **Component Type** | Server Component |
| **State Dependencies** | None |
| **Data Source** | Static configuration (`src/lib/constants/announcements.ts`) |
| **Reuse Level** | Singleton — one instance, root layout |
| **Owner** | Layout domain |

Messages are static strings from content configuration. No API calls. No state. The marquee animation is CSS-only (no Framer Motion required) — keeping it in the Server Component.

---

### `Navbar` (desktop)

| Property | Value |
|---|---|
| **Purpose** | Primary navigation for desktop users. Sticky header with logo, nav links, and action icons. |
| **Used On** | All pages except Checkout (replaced by MinimalHeader) |
| **Component Type** | Mixed: shell is Server Component; action icons (Cart, Wishlist, Search) are Client Components |
| **State Dependencies** | CartStore (item count badge), UIStore (search trigger, cart drawer trigger) |
| **Reuse Level** | Singleton |
| **Owner** | Layout domain |

The Navbar shell and navigation links render server-side. The cart count badge, wishlist count badge, and search trigger button are isolated Client Components (`CartCountBadge`, `WishlistCountBadge`, `SearchTriggerButton`) that hydrate independently without making the entire Navbar a Client Component.

---

### `MobileHeader`

| Property | Value |
|---|---|
| **Purpose** | Simplified header for mobile: hamburger, centered logo, search icon, cart icon |
| **Used On** | All pages (mobile breakpoint only, rendered via responsive visibility) |
| **Component Type** | Client Component (needs scroll behavior for height reduction) |
| **State Dependencies** | CartStore (count badge), UIStore (search trigger) |
| **Reuse Level** | Singleton |
| **Owner** | Layout domain |

Reduces height after 60px scroll via scroll event listener — requires Client Component. The scroll behavior uses a passive event listener to avoid blocking the main thread.

---

### `MobileBottomNav`

| Property | Value |
|---|---|
| **Purpose** | Fixed bottom navigation for mobile. Five tabs: Home, Shop, Search, Wishlist, Account. |
| **Used On** | All pages (mobile only) |
| **Component Type** | Client Component (needs active route state from `usePathname`) |
| **State Dependencies** | Active route (Next.js `usePathname`) |
| **Reuse Level** | Singleton |
| **Owner** | Layout domain |

Active tab highlighted based on current route. RTL implementation: tab order reverses (Account | Wishlist | Search | Shop | Home) via CSS logical properties.

---

### `Footer`

| Property | Value |
|---|---|
| **Purpose** | Site-wide footer with navigation groups, trust badges, social links, copyright |
| **Used On** | All pages except Checkout |
| **Component Type** | Server Component |
| **State Dependencies** | None |
| **Reuse Level** | Singleton |
| **Owner** | Layout domain |

Entirely static — no dynamic data, no state. On mobile, link groups are collapsible accordions using the `Accordion` UI primitive.

---

### `MinimalHeader`

| Property | Value |
|---|---|
| **Purpose** | Logo-only header for the checkout page. Removes all navigation to minimize distraction. |
| **Used On** | `/checkout` route only (via checkout layout) |
| **Component Type** | Server Component |
| **State Dependencies** | None |
| **Reuse Level** | Scoped to checkout layout |
| **Owner** | Checkout domain |

---

### `Container`

| Property | Value |
|---|---|
| **Purpose** | Consistent max-width wrapper with horizontal padding. Applied to all content sections. |
| **Used On** | Every page, multiple times per page |
| **Component Type** | Server Component |
| **Props** | `size: 'content' | 'prose' | 'narrow' | 'full'` |
| **Reuse Level** | Universal primitive |
| **Owner** | Layout domain |

---

### `PageShell`

| Property | Value |
|---|---|
| **Purpose** | Wraps page content with correct top padding to account for sticky header height |
| **Used On** | Every route page |
| **Component Type** | Server Component |
| **Props** | `variant: 'default' | 'full-width' | 'checkout'` |
| **Reuse Level** | Universal |
| **Owner** | Layout domain |

---

## 4. Header Component Tree

```
Navbar (Server Component — outer shell)
├── AnnouncementBar (Server Component)
├── NavbarInner (Server Component)
│   ├── Logo (Server Component)
│   │   └── Next.js Link wrapping the SVG/Image logo asset
│   │   └── RTL: positioned on the right edge
│   │
│   ├── NavLinks (Server Component)
│   │   ├── NavLink — الرئيسية (Home)
│   │   ├── NavDropdown — المتجر (Shop)
│   │   │   ├── DropdownItem — الكل
│   │   │   ├── DropdownItem — الأكثر مبيعاً
│   │   │   ├── DropdownItem — عروض
│   │   │   └── DropdownItem — جديد
│   │   ├── NavDropdown — البراندات (Brands)
│   │   │   ├── DropdownItem — Hypnose
│   │   │   ├── DropdownItem — Labella
│   │   │   ├── DropdownItem — FXEyes
│   │   │   ├── DropdownItem — ElAmore
│   │   │   └── DropdownItem — ICONIC
│   │   └── NavLink — تواصلي معنا
│   │
│   └── NavActions (Client Component — boundary here)
│       ├── SearchTriggerButton
│       │   └── Dispatches: UIStore.openSearch()
│       ├── WishlistButton
│       │   └── Reads: WishlistStore.count()
│       │   └── Shows count badge if count > 0
│       └── CartButton
│           └── Reads: CartStore.itemCount()
│           └── Dispatches: UIStore.openCartDrawer()
│           └── Shows count badge (animated on cart change)
│
MobileHeader (Client Component — separate mobile render)
├── HamburgerButton
│   └── Dispatches: UIStore.openMobileMenu()
├── Logo (shared with desktop)
├── SearchTriggerButton (shared with desktop)
└── CartButton (shared with desktop, compact variant)
```

**State ownership in the header:**
- Navigation link active states: derived from `usePathname()` in NavLink components
- Cart count: reads `CartStore.itemCount()` — updates reactively when cart changes
- Wishlist count: reads `WishlistStore.count()`
- Search open state: `UIStore.searchOpen` — SearchTriggerButton is the writer, SearchOverlay is the reader

---

## 5. Homepage Component Map

```
HomePage (Server Component — ISR)
├── AnnouncementBar (Server)
├── Navbar (Server + Client leaf nodes)
│
├── HeroSection (Server Component)
│   ├── HeroContent (headline, subheadline, CTAs — Server)
│   └── HeroImage (next/image — Server)
│
├── TrustBar (Server Component — common/TrustBar)
│   └── TrustBarItem × 4 (COD, Korean, Shipping, Returns)
│
├── ShopByLookSection (Server Component)
│   ├── SectionHeader (common/SectionHeader)
│   └── LookCard × 5 (natural, bridal, dramatic, everyday, bold)
│       └── Each: image + label + link
│
├── BrandShowcaseSection (Server Component)
│   ├── SectionHeader
│   └── BrandCard × 5 (brand/BrandCard — shared with RelatedBrands)
│
├── BestsellersSection (Server Component — fetches top 8 products)
│   ├── SectionHeader (with "View All" link)
│   └── ProductGrid (shop/ProductGrid)
│       └── ProductCard × 8 (product/ProductCard — full shared component)
│
├── WhyMARTALSection (Server Component)
│   └── WhyMARTALCard × 4 (static content)
│
├── ReviewsSection (Server Component)
│   ├── SectionHeader
│   └── ReviewCard × 3 (common/ReviewCard — shared with PDP)
│
├── FAQPreviewSection (Server Component)
│   ├── SectionHeader
│   ├── FAQAccordion (common/FAQAccordion, teaser variant — 3 items)
│   └── Link → /faq
│
├── FinalCTABanner (Server Component — common/CTABanner)
│
├── WhatsAppFAB (Client Component — common/WhatsAppFAB)
│   └── Fixed position, always visible
│
├── Footer (Server Component)
└── MobileBottomNav (Client Component)
```

**Data sources:**
- `BestsellersSection`: fetches from `lib/woocommerce/products.ts:getBestsellers(8)` at build/revalidation time
- `BrandShowcaseSection`: brand data from static configuration (`lib/constants/brands.ts`)
- All other sections: static content from content configuration or hardcoded strings

**Reuse decisions:**
- `ProductCard` here is the identical component used on the Shop page, Brand page, and Wishlist — no homepage-specific variant
- `BrandCard` here is the same component used on Brand pages (RelatedBrands section)
- `FAQAccordion` here uses a `maxItems={3}` prop; the full FAQ page passes no `maxItems`

---

## 6. Shop Page Component Map

```
ShopPage (Server Component — SSR, dynamic per URL params)
├── Navbar
├── Breadcrumb (common/Breadcrumb)
│
├── ShopLayout (two-column on desktop)
│   │
│   ├── FilterSidebar (Client Component — desktop only)
│   │   ├── FilterSection: Brands
│   │   │   └── FilterCheckbox × 5 (Hypnose, Labella, FXEyes, ElAmore, ICONIC)
│   │   ├── FilterSection: Colors
│   │   │   └── ColorFilterSwatch × N
│   │   ├── FilterSection: Price Range
│   │   │   └── PriceRangeSlider
│   │   ├── FilterSection: Flags
│   │   │   └── FilterCheckbox × 4 (Bestseller, New, Sale, Monthly)
│   │   └── ResetFiltersButton
│   │
│   └── ShopContent
│       ├── ShopToolbar (Client Component)
│       │   ├── ResultCount (reads from URL params + product response)
│       │   ├── SortDropdown (Client — writes to URL params)
│       │   └── FilterTriggerButton (Client — dispatches UIStore.openFilterDrawer())
│       │       └── FilterCountBadge (shows active filter count)
│       │
│       ├── ActiveFilters (Client Component)
│       │   ├── FilterChip × N (one per active filter)
│       │   └── ClearAllChip (if > 1 active filter)
│       │
│       ├── ProductGrid (shop/ProductGrid — Server Component shell)
│       │   └── ProductCard × N (product/ProductCard — Client leaf nodes for interactivity)
│       │
│       ├── LoadMoreButton (Client Component)
│       │   └── Appends next page to grid on click
│       │
│       └── EmptyShopState (Server Component — shown when 0 results)
│           ├── EmptyState (common/EmptyState)
│           └── BestsellerFallback (4 bestseller ProductCards)
│
├── FilterDrawer (Client Component — mobile, dispatched by FilterTriggerButton)
│   ├── BottomSheet (ui/BottomSheet)
│   └── [same filter content as FilterSidebar]
│
├── WhatsAppFAB (Client)
├── Footer
└── MobileBottomNav
```

**URL state ownership:**
- Active filters: read and written via `useSearchParams` / `useRouter` in FilterSidebar and FilterDrawer
- Sort: read and written via URL param `sort` in SortDropdown
- Page number: read and written via URL param `page` in LoadMoreButton

**Filter state does not live in Zustand.** URL is the single source of truth. This is a firm architecture decision (ADR-010 in the Architecture document).

---

## 7. Product Page Component Map

```
ProductPage (Server Component — ISR, revalidate: 300)
├── Navbar
├── Breadcrumb (Server — rendered with server-fetched product/brand names)
│
├── ProductLayout (two-column above fold on desktop)
│   │
│   ├── ProductGallery (Client Component)
│   │   ├── MainImage (with desktop zoom on hover)
│   │   ├── GalleryThumbnailStrip
│   │   │   └── GalleryThumbnail × N (internal — not exported)
│   │   └── [On mobile: full-width swipe carousel with dot indicators]
│   │
│   └── ProductInfoPanel (Server Component — passes data to Client leaf nodes)
│       ├── BrandLabel (Server — Inter font, linked to brand page)
│       ├── ProductTitle (Server — H1, Cairo 700)
│       ├── ProductSubtitle (Server — Cairo 400)
│       │
│       ├── RatingStars (Server — reads pre-fetched rating)
│       ├── ReviewCount (Server — links to #reviews tab)
│       ├── SoldCount (Server — from product meta)
│       │
│       ├── ColorSwatches (Client Component)
│       │   ├── ColorSwatch × N (internal — not exported)
│       │   └── SelectedColorLabel (updates on swatch click)
│       │
│       ├── PriceDisplay (Client Component)
│       │   └── Updates when ColorSwatches selection changes
│       │   └── Shows: current price, crossed-out old price, discount badge
│       │
│       ├── QuantitySelector (Client Component)
│       │   └── Min: 1, Max: 10
│       │
│       ├── ProductActions (Client Component)
│       │   ├── AddToCartButton → dispatches CartStore.addItem()
│       │   ├── BuyNowButton → adds to cart + navigates to /checkout
│       │   └── WishlistToggle → dispatches WishlistStore.toggle()
│       │
│       ├── TrustStrip (Server — common/TrustStrip, 4 inline items)
│       └── DeliveryEstimate (Server — static content from config)
│
├── ProductTabs (Client Component — tab switching)
│   ├── DescriptionTab (Server Component — pure content)
│   ├── SpecificationsTable (Server Component — structured data table)
│   ├── HowToUseTab (Server Component — numbered steps)
│   └── ReviewsTab (Client Component — lazy-loaded, paginated)
│       ├── ReviewAggregate (star average + count)
│       └── ReviewCard × N (common/ReviewCard)
│
├── RelatedProducts (Server Component — fetches by category)
│   ├── SectionHeader
│   └── ProductCard × 4
│
├── RecentlyViewed (Client Component — reads UIStore.recentlyViewed)
│   ├── SectionHeader (hidden if empty)
│   └── ProductCard × N (up to 6)
│
├── StickyMobilePDPBar (Client Component — fixed bottom on mobile)
│   ├── SelectedColorAndPrice (reads ColorSwatches selection)
│   └── AddToCartButton (compact variant)
│
├── WhatsAppFAB
├── Footer
└── MobileBottomNav
```

**Server/Client split rationale on the PDP:**
- Product title, subtitle, specs, description, trust strip, delivery estimate: all static relative to the product slug → Server Components
- Gallery, color swatches, price display, quantity, add-to-cart: all interactive or reactive to user selection → Client Components
- The InfoPanel is a Server Component that renders server-side data and passes it as props to Client children

---

## 8. ProductCard Deep Dive

`ProductCard` is the most reused component in the system. It appears on 8 distinct page contexts. It must handle every variation through props, not through forking.

### Component Tree

```
ProductCard (Client Component — needs wishlist state access)
├── ProductCardImageContainer
│   ├── ProductImage (next/image)
│   ├── ProductBadge (Server-renderable, passed as prop or derived)
│   │   └── Variants: 'bestseller' | 'new' | 'sale' | null
│   ├── WishlistToggle (Client — reads/writes WishlistStore)
│   └── QuickViewTrigger (Client — dispatches UIStore.openQuickView())
│       └── [Desktop: overlay pill on hover]
│       └── [Mobile: text link, always visible]
│
└── ProductCardContent
    ├── BrandLabel (Inter font — English brand name)
    ├── ProductName (Cairo — Arabic-first, max 2 lines with ellipsis)
    ├── ColorSwatchRow
    │   ├── ColorSwatch × N (mini — 18px diameter, max 5 visible)
    │   └── OverflowCount ("+N" if > 5 variants)
    └── PriceRow
        ├── OldPrice (if on sale — crossed out, muted)
        └── CurrentPrice (brand color if on sale, primary if not)
```

### Props Contract

| Prop | Type | Required | Description |
|---|---|---|---|
| `product` | `Product` | Yes | Full product object including variations |
| `variant` | `'grid' \| 'list' \| 'mini'` | No (default: 'grid') | Visual layout variant |
| `showQuickView` | `boolean` | No (default: true) | Whether to render Quick View trigger |
| `showWishlist` | `boolean` | No (default: true) | Whether to render Wishlist Toggle |
| `showBadge` | `boolean` | No (default: true) | Whether to render badge |
| `priority` | `boolean` | No (default: false) | Passed to `next/image` for LCP images (first 4 cards in grid) |
| `onAddToCart` | `(productId, variationId, qty) => void` | No | Override default cart behavior |

### States

| State | Trigger | Visual Result |
|---|---|---|
| Default | Page load | Image + badge + brand + name + swatches + price |
| Hover (desktop) | Mouse enters card | Card lifts (Y -4px), shadow increases, Quick View pill appears, image zooms 1.05x |
| Wishlisted | WishlistStore.has(slug) = true | Heart icon filled, brand color |
| On Sale | product.onSale = true | Sale badge shown, old price crossed out, current price in brand color |
| Bestseller | product.badge = 'bestseller' | Bestseller badge shown (amber) |
| New | product.badge = 'new' | New badge shown (green) |
| Out of Stock | product.inStock = false | Out of Stock badge shown, Add to Cart disabled |
| Loading (skeleton) | During data fetch | SkeletonCard replaces ProductCard |

### Skeleton State

`SkeletonCard` is a separate component in `components/common/` that matches `ProductCard`'s exact dimensions (3:4 image + content area height). Rendered inside `<Suspense fallback={<SkeletonCard />}>` wrappers.

### Responsive Behavior

| Breakpoint | Columns in Grid | Card Width | Image Height |
|---|---|---|---|
| Mobile (375px) | 2 | ~164px | ~219px (3:4) |
| Tablet (768px) | 3 | ~235px | ~313px |
| Desktop (1280px) | 4 | ~290px | ~387px |

### Reuse Contexts

`ProductCard` renders identically across all contexts, with different prop configurations:

| Context | `showQuickView` | `showWishlist` | `priority` | Notes |
|---|---|---|---|---|
| Shop grid | true | true | true for first 4 | Standard |
| Homepage Bestsellers | true | true | true for first 4 | Standard |
| Brand page grid | true | true | false | Standard |
| PDP Related Products | false | true | false | No Quick View in related |
| PDP Recently Viewed | false | false | false | Minimal — no overlay actions |
| Wishlist page | false | true (show remove variant) | false | WishlistToggle shows "remove" |
| Search results | true | true | false | Standard |
| QuickView "related" | false | false | false | Mini variant |

---

## 9. Search System Component Map

```
SearchOverlay (Client Component — global, mounted in root layout)
├── Backdrop (dismisses on click)
│
└── SearchPanel
    ├── SearchInput (Client Component)
    │   ├── Back/Close button
    │   ├── Text input (autofocus on open)
    │   └── Clear input button (appears when input non-empty)
    │
    ├── [State: Empty — no input yet]
    │   ├── RecentSearches
    │   │   ├── RecentSearches Header + "Clear all" link
    │   │   └── RecentSearchItem × N (tap to repopulate input)
    │   └── TrendingSearches
    │       └── TrendingSearchItem × N (tap to submit search)
    │
    ├── [State: Active — user is typing]
    │   └── SearchSuggestions
    │       ├── SuggestionGroup: منتجات
    │       │   └── SearchProductSuggestion × 3 (max)
    │       │       └── Thumbnail + name + price
    │       ├── SuggestionGroup: براندات
    │       │   └── SearchBrandSuggestion × 2 (max)
    │       └── SuggestionGroup: ألوان
    │           └── SearchColorSuggestion × 3 (max)
    │           └── Each shows color swatch + name + product count
    │
    └── [State: No Results]
        └── NoSearchResults
            ├── "لا نتائج لـ [query]"
            ├── SuggestedSearches (static trending terms)
            └── WhatsAppCTA
```

**State and data flow:**

| State Layer | Owner | What It Holds |
|---|---|---|
| Search overlay open/closed | UIStore | `searchOpen: boolean` |
| Query string | SearchInput local state | Input value (controlled) |
| Debounced query | `useSearch` hook | 200ms delayed version of query |
| Search suggestions | TanStack Query cache | `{ products, brands, colors }` keyed by query |
| Recent searches | localStorage | Array of query strings (max 8) |
| Trending searches | Static config | `lib/constants/trending.ts` |

**Component boundaries:**
- `SearchOverlay` is mounted once in root layout, hidden/shown via `UIStore.searchOpen`
- The overlay is not unmounted on close — it persists with `display: none` equivalent to preserve recent searches and avoid remount cost
- `useSearch` hook owns the TanStack Query call, debounce logic, and recent search persistence
- `SearchInput` is a controlled input — the value lives in local state, not in a store

---

## 10. Cart System Component Map

### Cart Drawer

```
CartDrawer (Client Component — global, mounted in root layout)
├── Backdrop (dismisses on click)
│
└── DrawerPanel (slides in from left in RTL)
    ├── CartDrawerHeader
    │   ├── Title: "سلتك (N منتجات)"
    │   └── Close button
    │
    ├── CartItemsList (scrollable)
    │   └── CartItem × N
    │       ├── ProductThumbnail (40px × 53px — 3:4)
    │       ├── ItemDetails (brand, name, color)
    │       ├── QuantitySelector (mini variant — inline −/+ )
    │       ├── LineTotal
    │       └── RemoveButton
    │
    ├── FreeShippingProgress
    │   ├── ProgressBar (ui/ProgressBar)
    │   └── ProgressMessage (dynamic — see §11.3)
    │
    ├── CartSummary
    │   ├── SubtotalRow
    │   ├── ShippingRow (50 EGP or "مجاني")
    │   └── TotalRow
    │
    ├── CODDrawerBadge
    │   └── "ستدفعي عند الاستلام"
    │
    ├── CheckoutButton (primary)
    │   └── Navigates to /checkout, closes drawer
    └── ContinueShoppingButton (ghost)
        └── Closes drawer, stays on page
```

### Cart Page

```
CartPage (Client Component — CSR, reads Zustand)
├── Breadcrumb
├── [Two-column on desktop, single-column on mobile]
│
├── CartTable
│   └── CartItem × N (full variant — larger than drawer variant)
│       ├── ProductThumbnail (80px × 107px)
│       ├── ItemDetails (brand, name, color, variant)
│       ├── QuantitySelector (standard variant)
│       ├── UnitPrice
│       ├── LineTotal
│       └── RemoveButton
│
├── FreeShippingProgress (same component as drawer, full-width)
│
├── OrderSummaryPanel (sticky on desktop / inline on mobile)
│   ├── SubtotalRow
│   ├── ShippingRow
│   ├── TotalRow
│   ├── CODBadge (common/CODBadge)
│   ├── CheckoutButton (primary, full-width on mobile — sticky bottom)
│   └── ReturnsLink
│
└── EmptyCartState (shown when cart is empty)
    └── EmptyState (common/EmptyState)
```

**State ownership in the cart system:**

| Data | Owner | Notes |
|---|---|---|
| Cart items array | CartStore (Zustand) | Persisted to `martal_cart_v2` localStorage key |
| Subtotal calculation | CartStore selector | `cartStore.subtotal()` |
| Shipping cost | Derived from subtotal | Computed in CartSummary — not stored |
| Free shipping progress | Derived from subtotal | Computed in FreeShippingProgress |
| Item count badge | CartStore selector | `cartStore.itemCount()` |
| Drawer open state | UIStore | `uiStore.cartDrawerOpen` |

---

## 11. Checkout Component Map

```
CheckoutPage (Client Component — CSR)
├── CheckoutHeader (MinimalHeader — logo only, no nav)
│
├── CheckoutLayout (two-column on desktop)
│   │
│   ├── CheckoutFormColumn
│   │   └── CheckoutForm (Client Component — React Hook Form)
│   │       │
│   │       ├── Section 1: بياناتك الشخصية
│   │       │   ├── CheckoutFormField: الاسم كامل
│   │       │   └── CheckoutFormField: رقم الموبايل
│   │       │
│   │       ├── Section 2: عنوان التوصيل
│   │       │   ├── GovernorateSelect (Client — native <select>)
│   │       │   ├── CheckoutFormField: المدينة / الحي
│   │       │   ├── CheckoutFormField: العنوان بالتفصيل
│   │       │   ├── CheckoutFormField: المبنى والدور (optional)
│   │       │   └── CheckoutFormField: ملاحظات (optional, textarea)
│   │       │
│   │       ├── Section 3: مراجعة الطلب
│   │       │   ├── OrderReviewList (read-only — from CartStore)
│   │       │   └── EditCartLink → /cart
│   │       │
│   │       ├── Section 4: طريقة الدفع
│   │       │   └── CODConfirmation
│   │       │       └── "ستدفعي عند الاستلام — لا دفع الآن"
│   │       │
│   │       └── ConfirmOrderButton (primary, full-width)
│   │           ├── Default: "تأكيدي الطلب"
│   │           ├── Loading: "جارٍ تأكيد طلبك..."
│   │           └── Disabled when: form invalid or isSubmitting
│   │
│   └── OrderSummaryColumn (sticky on desktop)
│       └── OrderSummaryPanel
│           ├── OrderSummaryAccordion (mobile collapsed)
│           ├── ProductLineItems × N
│           ├── SubtotalRow
│           ├── ShippingRow
│           ├── TotalRow
│           └── CODBadge
│
└── StickyConfirmButton (mobile — fixed bottom)
    └── Always visible regardless of scroll position
```

**Validation ownership:**
- All validation logic lives in the Zod schema (`lib/validations/checkout.ts`)
- `CheckoutForm` connects the schema via `@hookform/resolvers/zod`
- `CheckoutFormField` receives errors as props — it renders them but does not compute them
- The ConfirmOrderButton receives `isValid` from React Hook Form — it does not check the form itself

**Submission ownership:**
- `CheckoutForm` is the single owner of the submit handler
- On submit: validates → POST `/api/orders` → handles success/failure
- On success: calls `CartStore.clearCart()`, saves order to localStorage, navigates to `/order-success`
- On failure: shows error toast with WhatsApp fallback CTA

---

## 12. Account System Component Map

```
AccountPage (Client Component — CSR, reads localStorage)
├── Breadcrumb
├── AccountPageHeader: "حسابي"
├── LocalStorageBanner (conditional — shown in v2.0)
│   └── Explains localStorage limitation and v2.1 preview
│
├── AccountLayout
│   ├── AccountSidebar (desktop — fixed left-side nav in RTL = right)
│   │   ├── NavItem: طلباتي (active state via usePathname-like tab state)
│   │   ├── NavItem: عنوان التوصيل
│   │   ├── NavItem: بياناتي
│   │   └── NavItem: المفضلة (links to /wishlist)
│   │
│   ├── AccountTabBar (mobile — horizontal tabs)
│   │   └── [same 4 tabs as sidebar]
│   │
│   └── AccountContentArea
│       │
│       ├── [Tab: Orders]
│       │   └── OrderHistory
│       │       ├── [If orders exist]: OrderCard × N
│       │       │   ├── Order number + date
│       │       │   ├── ProductThumbnail × N (mini)
│       │       │   ├── Total + payment method
│       │       │   ├── Status badge
│       │       │   └── WhatsApp tracking link
│       │       └── [If no orders]: EmptyState
│       │           └── "لم تقومي بأي طلبات بعد"
│       │
│       ├── [Tab: Address]
│       │   └── [If address exists]: AddressCard
│       │       ├── Saved address display
│       │       └── EditButton → reveals AddressForm (inline)
│       │   └── [If no address]: EmptyState
│       │       └── "سيتم حفظ عنوانك تلقائياً بعد أول طلب"
│       │
│       ├── [Tab: Profile]
│       │   └── ProfileDisplay
│       │       ├── Name (from last order localStorage)
│       │       └── Phone (from last order localStorage)
│       │
│       └── [Tab: Wishlist]
│           └── WishlistMiniGrid
│               ├── ProductCard × N (wishlist page preview, max 6)
│               └── Link → /wishlist (if more than 6)
│
└── MobileBottomNav
```

**localStorage ownership:**
- `OrderHistory` reads from `localStorage:martal_orders` via `useLocalStorage` hook
- `AddressCard` / `AddressForm` reads/writes `localStorage:martal_address`
- `ProfileDisplay` reads from most recent order in `localStorage:martal_orders`
- `WishlistMiniGrid` reads from `WishlistStore` (which persists to `localStorage:martal_wishlist_v2`)

**v2.1 migration path:**
- `LocalStorageBanner` is removed
- `OrderHistory` data source switches from `useLocalStorage('martal_orders')` to a TanStack Query call to `/api/account/orders`
- `AddressForm` switches from localStorage write to `PATCH /api/account/address`
- The component tree is identical — only the data source hooks change

---

## 13. Wishlist Component Map

```
WishlistPage (Client Component — CSR, reads WishlistStore)
├── Breadcrumb
├── WishlistPageHeader
│   └── "المفضلة (N منتجات)"
│
├── [If items exist]
│   ├── WishlistToolbar
│   │   ├── AddAllToCartButton → CartStore.addItem() × N, opens drawer
│   │   └── ClearWishlistButton → WishlistStore.clear() + confirm dialog
│   │
│   └── ProductGrid (shop/ProductGrid — shared component)
│       └── ProductCard × N (wishlist configuration)
│           ├── showWishlist: true (shows "remove" variant)
│           ├── showQuickView: false
│           └── WishlistToggle acts as Remove in this context
│
└── [If no items]
    └── EmptyWishlistState
        └── EmptyState (common/EmptyState)
```

**Wishlist state ownership:**
- All wishlist state lives in `WishlistStore` (Zustand, persisted)
- `WishlistPage` reads the slug list from the store
- Product data for wishlisted items is fetched client-side via TanStack Query using the stored slugs
- This means wishlisted products' data (price, stock, images) is always fresh — not stale from when they were wishlisted

---

## 14. Brand Page Component Map

### Shared Brand Page Structure

```
BrandPage (Server Component — ISR, revalidate: 3600)
├── Navbar
│
├── BrandHero (Server Component — brand/BrandHero)
│   ├── BrandName (Inter font — English)
│   ├── BrandTagline (Cairo — Arabic)
│   ├── BrandOriginBadge ("مصنّع في كوريا")
│   ├── BrandDescription (Cairo — 2-3 sentences)
│   └── ShopBrandCTA (links to filtered shop view)
│
├── BrandSEOContent (Server Component — SEO paragraph, visually subtle)
│   └── H1 + opening paragraph (see Content document §16.2)
│
├── ShopToolbar (Client Component — same as Shop page)
│
├── ActiveFilters (Client Component)
│   └── Brand chip shown but NOT removable on brand page
│
├── ProductGrid (Server Component shell, Client leaf nodes)
│   └── ProductCard × N (pre-filtered to this brand)
│
├── LoadMoreButton (Client Component)
│
├── RelatedBrands (Server Component)
│   ├── SectionHeader: "براندات أخرى"
│   └── BrandCard × 4 (the other 4 brands — brand/BrandCard)
│
├── FAQPreview (Server Component — brand-relevant FAQ items)
│   └── FAQAccordion (3 items filtered to brand/product questions)
│
├── WhatsAppFAB (Client)
├── Footer
└── MobileBottomNav
```

### Per-Brand Differentiation

All five brand pages use the identical component tree. Differentiation is achieved through data props, not component variants.

| Property | Hypnose | Labella | FXEyes | ElAmore | ICONIC |
|---|---|---|---|---|---|
| `BrandHero` background treatment | Warm cream | Soft rose | Warm stone | Deep rose | Near-black |
| `BrandTagline` (from Content §3) | الأناقة الهادية | جمال يومي | دفء العسل والأرض | لأيامك الاستثنائية | جريئة ومعاصرة |
| Pre-filtered products | `brand=hypnose` | `brand=labella` | `brand=fxeyes` | `brand=elamore` | `brand=iconic` |
| FAQ items | Natural lens care | Daily wear care | Warm tone guidance | Occasion/bridal | Bold color guidance |
| `SEOContent` paragraph | From Content §3.1 | From Content §3.2 | From Content §3.3 | From Content §3.4 | From Content §3.5 |

**What is shared:** The component structure, the filter system, the product grid, the related brands row, and the FAQ accordion.

**What differs:** The data passed as props (brand story text, background treatment token, pre-applied filter slug, FAQ content selection).

---

## 15. Contact & FAQ Component Maps

### Contact Page

```
ContactPage (Server Component — SSG)
├── Navbar
├── Breadcrumb
│
├── ContactPageHero (Server)
│   ├── Headline: "تواصلي معنا"
│   └── Subheadline
│
├── ContactChannels (Server — two-column on desktop)
│   ├── ContactChannelCard: WhatsApp (Server)
│   │   └── WhatsApp link (NEXT_PUBLIC_WHATSAPP_NUMBER from env)
│   └── ContactChannelCard: Email (Server)
│       └── Copy-to-clipboard button (Client Component — tiny isolated leaf)
│
├── ContactForm (Client Component — React Hook Form)
│   ├── CheckoutFormField: الاسم (reused from checkout domain)
│   ├── CheckoutFormField: الموبايل (reused from checkout domain)
│   ├── SubjectSelect (ui/Select)
│   ├── MessageTextarea (ui/Textarea)
│   └── SubmitButton
│       └── On submit: generates WhatsApp deep-link → opens WhatsApp
│
├── FAQPreviewSection (Server — same component as Homepage)
│   └── FAQAccordion (3 most-asked support questions)
│
├── WhatsAppFAB (Client)
├── Footer
└── MobileBottomNav
```

### FAQ Page

```
FAQPage (Server Component — SSG)
├── Navbar
├── Breadcrumb
│
├── FAQPageHero (Server)
│   └── FAQSearchInput (Client Component — filters accordion client-side)
│
├── CategoryTabs (Client Component — tab switching)
│   ├── Tab: الطلبات والشراء
│   ├── Tab: الشحن والتوصيل
│   ├── Tab: المنتجات والعدسات
│   ├── Tab: العناية والاستخدام
│   └── Tab: الاسترجاع والاستبدال
│
├── FAQContent (Server Component — initial render, all categories)
│   └── FAQAccordion (full variant — common/FAQAccordion)
│       └── All 30+ questions from Content §11
│
├── StillHaveQuestionsBlock (Server)
│   ├── "لم تجدي إجابة سؤالك؟"
│   └── WhatsAppCTA
│
├── WhatsAppFAB (Client)
├── Footer
└── MobileBottomNav
```

**FAQAccordion variants:**
- `maxItems={3}` → teaser variant (Homepage, Contact)
- `maxItems={undefined}` → full variant (FAQ page)
- `categoryFilter="orders"` → category-filtered variant (FAQ page tab content)

**FAQSearchInput behavior:**
- Typing filters the accordion items client-side using string matching on question text
- Does not make any API call — all FAQ content is already in the DOM (SSG)
- Empty state on no matches: "لا نتائج — تواصلي معنا"

---

## 16. Shared Commerce Components

The following components are used across multiple domains. They are defined once and never duplicated.

| Component | File Location | Used On | Server/Client | External Dependencies |
|---|---|---|---|---|
| `ProductCard` | `components/product/ProductCard` | Home, Shop, Brand, PDP (related+recent), Wishlist, Search | Client | WishlistStore, UIStore |
| `PriceDisplay` | `components/product/PriceDisplay` | ProductCard, PDP, StickyMobilePDPBar, CartItem | Client | None (pure display) |
| `WishlistToggle` | `components/product/WishlistToggle` | ProductCard, PDP | Client | WishlistStore |
| `RatingStars` | `components/product/RatingStars` | ProductCard, PDP, ReviewCard | Server | None |
| `SoldCount` | `components/product/SoldCount` | ProductCard, PDP | Server | None |
| `ProductBadge` | `components/product/ProductBadge` | ProductCard, PDP | Server | None |
| `BrandCard` | `components/brand/BrandCard` | Homepage BrandShowcase, Brand page RelatedBrands | Server | None |
| `BrandOriginBadge` | `components/brand/BrandOriginBadge` | BrandHero, PDP TrustStrip | Server | None |
| `FreeShippingProgress` | `components/cart/FreeShippingProgress` | CartDrawer, CartPage | Client | CartStore |
| `CartSummary` | `components/cart/CartSummary` | CartDrawer, CartPage | Client | CartStore |
| `CODBadge` | `components/common/CODBadge` | CartDrawer, CartPage, CheckoutPage | Server | None |
| `TrustBar` | `components/common/TrustBar` | Homepage | Server | None |
| `TrustStrip` | `components/common/TrustStrip` | PDP (inline), Brand page | Server | None |
| `SectionHeader` | `components/common/SectionHeader` | Home, Shop, Brand, PDP | Server | None |
| `FAQAccordion` | `components/common/FAQAccordion` | Home, FAQ, Contact, Brand | Client (Accordion animation) | None |
| `ReviewCard` | `components/common/ReviewCard` | Homepage Reviews, PDP Reviews tab | Server | None |
| `EmptyState` | `components/common/EmptyState` | Cart, Wishlist, Shop, Account, Search | Server | None |
| `ErrorState` | `components/common/ErrorState` | Error boundaries, API failure states | Server | None |
| `Breadcrumb` | `components/common/Breadcrumb` | Shop, PDP, Brand, Cart, Checkout, Account, FAQ | Server | None |
| `WhatsAppFAB` | `components/common/WhatsAppFAB` | All pages except Checkout | Client | Config (WA number) |
| `LoadMoreButton` | `components/shop/LoadMoreButton` | Shop, Brand, Search results | Client | URL state |
| `FilterChip` | `components/shop/FilterChip` | Shop ActiveFilters, Brand ActiveFilters | Client | URL state |
| `QuickViewModal` | `components/shop/QuickViewModal` | Shop, Brand (anywhere ProductCard is) | Client | UIStore, CartStore |
| `SkeletonCard` | `components/common/SkeletonCard` | Suspense fallback for ProductCard | Server | None |
| `OrderSummaryPanel` | `components/checkout/OrderSummaryPanel` | CartPage, CheckoutPage | Client | CartStore |

---

## 17. Props Contracts

Props contracts define what each major component accepts. These are the specifications engineers implement against — the interface agreement between the caller and the component.

---

### `ProductCardProps`

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `product` | `Product` | Yes | — | Full product object |
| `variant` | `'grid' \| 'mini'` | No | `'grid'` | Layout variant |
| `showQuickView` | `boolean` | No | `true` | Show/hide Quick View trigger |
| `showWishlist` | `boolean` | No | `true` | Show/hide Wishlist Toggle |
| `showBadge` | `boolean` | No | `true` | Show/hide ProductBadge |
| `priority` | `boolean` | No | `false` | LCP hint for next/image |

---

### `ProductGalleryProps`

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `images` | `ProductImage[]` | Yes | — | Ordered array of product images |
| `activeVariationImages` | `ProductImage[] \| null` | No | `null` | Images to show when a color is selected |
| `productName` | `string` | Yes | — | Used in image alt text |

---

### `ColorSwatchesProps`

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `variations` | `ProductVariation[]` | Yes | — | All color variants |
| `selectedVariationId` | `number \| null` | Yes | — | Currently selected (controlled) |
| `onSelect` | `(variationId: number) => void` | Yes | — | Selection callback |
| `maxVisible` | `number` | No | `6` | Max swatches before "+N" overflow |

---

### `CartItemProps`

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `item` | `CartItem` | Yes | — | Cart item data |
| `variant` | `'drawer' \| 'page'` | No | `'drawer'` | Compact vs full layout |
| `onQuantityChange` | `(qty: number) => void` | Yes | — | Caller manages update |
| `onRemove` | `() => void` | Yes | — | Caller manages removal |

---

### `BrandHeroProps`

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `brand` | `Brand` | Yes | — | Brand data object |
| `backgroundVariant` | `'cream' \| 'rose' \| 'stone' \| 'dark'` | No | `'cream'` | Hero background treatment |

---

### `EmptyStateProps`

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `headline` | `string` | Yes | — | Primary message in Arabic |
| `body` | `string` | No | — | Supporting explanation |
| `ctaLabel` | `string` | No | — | CTA button text |
| `ctaHref` | `string` | No | — | If provided, renders as link |
| `ctaOnClick` | `() => void` | No | — | If provided, renders as button |
| `secondaryCtaLabel` | `string` | No | — | Optional secondary action |
| `secondaryCtaHref` | `string` | No | — | Optional secondary link |

---

### `FAQAccordionProps`

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `items` | `FAQItem[]` | Yes | — | Array of {question, answer} |
| `maxItems` | `number` | No | `undefined` | Truncate to first N items |
| `categoryFilter` | `string` | No | `undefined` | Filter items by category tag |
| `searchQuery` | `string` | No | `''` | Client-side filter on question text |

---

### `SearchProductSuggestionProps`

| Prop | Type | Required | Notes |
|---|---|---|---|
| `product` | `SearchProductResult` | Yes | Lightweight: id, slug, name, brand, price, thumbnail |
| `query` | `string` | Yes | Used to highlight matched text |
| `onSelect` | `(slug: string) => void` | Yes | Navigation handler |

---

### `FreeShippingProgressProps`

| Prop | Type | Required | Default | Notes |
|---|---|---|---|---|
| `subtotal` | `number` | Yes | — | Current cart subtotal in EGP |
| `threshold` | `number` | No | `800` | Free shipping threshold |
| `shippingCost` | `number` | No | `50` | Standard shipping cost |
| `variant` | `'drawer' \| 'page'` | No | `'drawer'` | Compact vs full width |

---

## 18. State Ownership Matrix

This matrix is the definitive reference for where each piece of state lives, how long it persists, and which components read or write it.

| State | Owner | Storage | Persistence | Writer Components | Reader Components |
|---|---|---|---|---|---|
| Cart items | CartStore (Zustand) | localStorage `martal_cart_v2` | Session-persistent | AddToCartButton, CartItem (qty/remove), WishlistPage (add all) | CartDrawer, CartPage, OrderSummaryPanel, CartCountBadge, FreeShippingProgress, CheckoutForm |
| Wishlist slugs | WishlistStore (Zustand) | localStorage `martal_wishlist_v2` | Session-persistent | WishlistToggle, WishlistToolbar (clear) | ProductCard, WishlistPage, AccountPage (mini grid), WishlistCountBadge |
| Cart drawer open | UIStore (Zustand) | Memory only | Ephemeral | CartButton, AddToCartButton, CheckoutButton (closes) | CartDrawer |
| Search overlay open | UIStore (Zustand) | Memory only | Ephemeral | SearchTriggerButton, MobileBottomNav Search tab | SearchOverlay |
| Filter drawer open | UIStore (Zustand) | Memory only | Ephemeral | FilterTriggerButton (shop) | FilterDrawer |
| Quick View product | UIStore (Zustand) | Memory only | Ephemeral | QuickViewTrigger (ProductCard) | QuickViewModal |
| Recently viewed | UIStore (Zustand) | localStorage `martal_recently_viewed` | Session-persistent | ProductPage (on mount) | RecentlyViewed section on PDP |
| Search query | SearchInput (local state) | Memory only | Ephemeral | SearchInput (controlled input) | useSearch hook (reads debounced value) |
| Search suggestions | TanStack Query | Memory cache | Session cache (5min) | — (fetched by useSearch) | SearchSuggestions |
| Recent searches | useSearch hook | localStorage `martal_recent_searches` | Session-persistent | SearchInput (on submit) | RecentSearches |
| Shop filters | URL search params | URL | Navigation-persistent | FilterSidebar, FilterDrawer, FilterChip | ShopPage (SSR reads params), ActiveFilters, ShopToolbar |
| Shop sort | URL search param `sort` | URL | Navigation-persistent | SortDropdown | ShopPage (SSR reads params) |
| Checkout form | React Hook Form | Memory only | Ephemeral | All CheckoutFormField components | ConfirmOrderButton (isValid), CheckoutForm (onSubmit) |
| Orders history | useLocalStorage hook | localStorage `martal_orders` | Session-persistent | CheckoutForm (writes on success) | OrderHistory, AccountPage |
| Saved address | useLocalStorage hook | localStorage `martal_address` | Session-persistent | AddressForm | AddressCard, GovernorateSelect (pre-fill), CheckoutForm (pre-fill) |
| Active account tab | AccountLayout local state | Memory only | Ephemeral | AccountSidebar / AccountTabBar | AccountContentArea (shows correct tab) |
| FAQ search query | FAQSearchInput local state | Memory only | Ephemeral | FAQSearchInput | FAQAccordion (receives as prop) |

---

## 19. Server vs Client Component Matrix

| Component | SC | CC | Primary Reason for Classification |
|---|---|---|---|
| `Navbar` (shell) | ✅ | — | Pure HTML structure, server-rendered nav links |
| `NavActions` (cart/wishlist/search icons) | — | ✅ | Needs Zustand store access for counts and dispatch |
| `MobileHeader` | — | ✅ | Needs scroll event listener for height behavior |
| `MobileBottomNav` | — | ✅ | Needs `usePathname` for active tab state |
| `AnnouncementBar` | ✅ | — | CSS animation only, static content |
| `Footer` | ✅ | — | Fully static, no interactions beyond links |
| `MinimalHeader` | ✅ | — | Static logo only |
| `HomePage` | ✅ | — | ISR page, fetches product data server-side |
| `HeroSection` | ✅ | — | Static editorial content |
| `TrustBar` | ✅ | — | Static content |
| `BestsellersSection` | ✅ | — | Server fetches product data, passes to ProductGrid |
| `ProductGrid` | ✅ | — | Renders ProductCard list from props |
| `ProductCard` | — | ✅ | Needs WishlistStore access; Framer Motion hover animations |
| `ProductBadge` | ✅ | — | Pure display, no interaction |
| `PriceDisplay` | — | ✅ | Needs to react to color swatch selection (price changes per variant) |
| `WishlistToggle` | — | ✅ | Needs WishlistStore read and write |
| `RatingStars` | ✅ | — | Pure display from props |
| `SoldCount` | ✅ | — | Pure display from props |
| `ProductGallery` | — | ✅ | Swipe interactions, zoom behavior, variant image switching |
| `ColorSwatches` | — | ✅ | Controlled selection state, triggers gallery and price updates |
| `QuantitySelector` | — | ✅ | Controlled number input |
| `AddToCartButton` | — | ✅ | Needs CartStore.addItem() dispatch |
| `BuyNowButton` | — | ✅ | Needs CartStore + router.push('/checkout') |
| `StickyMobilePDPBar` | — | ✅ | Needs scroll position detection, CartStore dispatch |
| `ProductTabs` | — | ✅ | Tab switching state |
| `DescriptionTab` | ✅ | — | Static content rendered from HTML |
| `SpecificationsTable` | ✅ | — | Static structured data |
| `RelatedProducts` | ✅ | — | Server fetches related products |
| `RecentlyViewed` | — | ✅ | Needs UIStore.recentlyViewed |
| `ShopPage` | ✅ | — | SSR reads URL params, fetches products server-side |
| `FilterSidebar` | — | ✅ | Reads/writes URL params |
| `FilterDrawer` | — | ✅ | Reads/writes URL params + UIStore.filterDrawerOpen |
| `ActiveFilters` | — | ✅ | Reads URL params, dispatches URL updates |
| `SortDropdown` | — | ✅ | Writes to URL params |
| `ShopToolbar` | — | ✅ | Reads URL params, dispatches filter drawer |
| `LoadMoreButton` | — | ✅ | Appends to URL page param |
| `QuickViewModal` | — | ✅ | Reads UIStore.quickViewProduct, CartStore dispatch |
| `SearchOverlay` | — | ✅ | Reads UIStore.searchOpen, manages query state, TanStack Query |
| `SearchInput` | — | ✅ | Controlled input |
| `RecentSearches` | — | ✅ | Reads/writes localStorage |
| `TrendingSearches` | ✅ | — | Static config data — could be server-rendered |
| `CartDrawer` | — | ✅ | Reads UIStore.cartDrawerOpen, CartStore |
| `CartItem` | — | ✅ | Quantity updates dispatch to CartStore |
| `FreeShippingProgress` | — | ✅ | Derived from CartStore.subtotal() |
| `CartSummary` | — | ✅ | Reads CartStore |
| `CheckoutPage` | — | ✅ | CSR, reads CartStore, manages form state |
| `CheckoutForm` | — | ✅ | React Hook Form, API calls |
| `GovernorateSelect` | — | ✅ | Controlled select |
| `OrderSummaryPanel` | — | ✅ | Reads CartStore |
| `CODConfirmation` | ✅ | — | Static trust copy |
| `BrandPage` | ✅ | — | ISR, fetches brand and product data server-side |
| `BrandHero` | ✅ | — | Static content from props |
| `BrandCard` | ✅ | — | Static display, no state needed |
| `AccountPage` | — | ✅ | CSR, reads all localStorage |
| `OrderHistory` | — | ✅ | Reads localStorage orders |
| `AddressCard` | — | ✅ | Reads/writes localStorage address |
| `WishlistPage` | — | ✅ | CSR, reads WishlistStore |
| `WishlistToolbar` | — | ✅ | Dispatches WishlistStore actions |
| `FAQPage` | ✅ | — | SSG, static content |
| `FAQAccordion` | — | ✅ | Accordion animation (Framer Motion) |
| `CategoryTabs` | — | ✅ | Tab switching state |
| `FAQSearchInput` | — | ✅ | Controlled input, filters accordion |
| `ContactPage` | ✅ | — | SSG, static content |
| `ContactForm` | — | ✅ | React Hook Form, WhatsApp link generation |
| `ReviewCard` | ✅ | — | Static display |
| `EmptyState` | ✅ | — | Static content from props |
| `ErrorState` | ✅ | — | Static content from props |
| `CODBadge` | ✅ | — | Static trust signal |
| `WhatsAppFAB` | — | ✅ | Fixed position needs client scroll awareness |
| `Breadcrumb` | ✅ | — | Server-rendered from route data |

---

## 20. Reuse Strategy

### `ProductCard` — The Most Reused Component

`ProductCard` appears in 8 distinct contexts across the application. Its reuse strategy relies entirely on props — no context-specific logic exists inside the component.

| Context | Customization via Props | Special Notes |
|---|---|---|
| Shop grid | All defaults | Standard use |
| Homepage Bestsellers | `priority={true}` for first 4 | LCP optimization |
| Brand page grid | `priority={false}` | Below the fold |
| PDP Related Products | `showQuickView={false}` | Less visual noise on PDP |
| PDP Recently Viewed | `showQuickView={false}`, `showWishlist={false}` | Minimal — discovery only |
| Wishlist page | WishlistToggle shows "remove" mode | Via WishlistStore.has() returning true |
| Search results | All defaults | Standard use |
| QuickView related | `variant="mini"`, `showQuickView={false}` | Compact inside modal |

**The principle:** `ProductCard` makes no assumption about where it is rendered. It receives data and behavioral configuration via props. The calling context decides what to show.

---

### `FAQAccordion` — Three Contexts, One Component

| Context | Props Passed | Result |
|---|---|---|
| Homepage (teaser) | `maxItems={3}`, items from config | Shows 3 questions, no search |
| Contact page (teaser) | `maxItems={3}`, support-focused items | Shows 3 support questions |
| FAQ page (full) | `categoryFilter="orders"` (etc.), `searchQuery` from input | Full category-filtered, searchable |

---

### `EmptyState` — Seven Contexts, One Component

| Context | Headline | Body | CTA |
|---|---|---|---|
| Empty cart | سلتك فارغة | ابدئي تسوقك | تصفحي المتجر |
| Empty wishlist | قائمتك المفضلة فارغة | احفظي المنتجات... | ابدئي التصفح |
| Empty orders | لم تقومي بأي طلبات بعد | طلباتك ستظهر... | تسوّقي الآن |
| No search results | مفيش نتايج لـ "[query]" | جربي كلمة تانية... | تصفحي المتجر |
| No filter results | مفيش منتجات | حاولي تغيري الفلاتر | امسحي الفلاتر |
| Product unavailable | المنتج غير متاح | ... | ارجعي للمتجر |
| No address saved | لا يوجد عنوان | سيتم حفظه... | (no CTA) |

---

### `SectionHeader` — Universal Section Titling

Used on every page that has a named section. Accepts `title`, optional `subtitle`, and optional `linkLabel` + `linkHref` for "see all" behavior. Renders consistently across all contexts — no per-page variant.

---

### `OrderSummaryPanel` — Cart and Checkout

The same component provides the sticky sidebar on the Cart page and the sticky sidebar on the Checkout page. On Checkout, it receives `isReadOnly={true}` — quantities and remove actions are hidden. On Cart, they are visible.

---

## 21. Component Ownership Rules

These 20 rules define the engineering contract for component development and review. A PR that violates these rules must be revised before merge.

1. **A component owns its presentation.** It does not own state that belongs to a Zustand store, data that belongs to an API, or validation that belongs to a Zod schema.

2. **UI components (`components/ui/`) have no business knowledge.** `Button` does not know it is used to "Add to Cart." It knows it is a primary button. Business context is injected by callers.

3. **Commerce components receive data as props.** `ProductCard` does not fetch its own product data. It receives a `Product` object. The calling server component or page fetches it.

4. **Client Components are as leaf-level as possible.** If a page has 10 components and 2 need client-side behavior, those 2 are Client Components — not the page and not their parents.

5. **`WishlistToggle` is the only component that writes to `WishlistStore`.** No other component calls `WishlistStore.toggle()` directly. All wishlist mutations flow through this single component.

6. **`CartStore` is written by three components only:** `AddToCartButton`, `CartItem` (quantity/remove), and `WishlistToolbar` (add all to cart). No other component writes to `CartStore`.

7. **`UIStore` is written by trigger components only.** `SearchTriggerButton` opens the search. `CartButton` opens the cart drawer. `FilterTriggerButton` opens the filter drawer. `QuickViewTrigger` opens Quick View. The thing being opened never opens itself.

8. **Components never import from `lib/woocommerce/` directly.** All WooCommerce data is fetched in server components (pages, layout files) or in API routes and passed downward as props.

9. **`FilterSidebar` and `FilterDrawer` contain the same filter state logic.** They are distinct components because their layouts differ (sidebar vs. bottom sheet). Their filter change handlers write to the same URL params via the same `useFilters` custom hook.

10. **`ProductGrid` is a layout component.** It handles the grid layout and column rules. It does not know what it is rendering — it receives children. `ProductCard`s are passed to it, not imported by it.

11. **`EmptyState` never knows where it is used.** All context is injected via props. There is no `EmptyState` variant for "cart" that has cart-specific logic.

12. **`CheckoutForm` owns the submission lifecycle.** It initiates the POST request, handles success (clearing cart, navigating), and handles failure (error toast, WhatsApp fallback). No other component handles checkout submission.

13. **`Breadcrumb` is always server-rendered.** Route-level data for breadcrumbs is available server-side. There is no reason to make breadcrumbs a Client Component.

14. **Animation components are always Client Components.** Any component using Framer Motion `motion.*` elements requires `'use client'`. There are no exceptions.

15. **`BrandCard` and `ProductCard` are never modified to add context-specific behavior.** If a context needs different behavior, it is expressed through props that the component already supports.

16. **`SkeletonCard` must match `ProductCard` dimensions exactly.** If `ProductCard` changes its size, `SkeletonCard` is updated in the same PR. Layout shift from a dimension mismatch is a performance regression.

17. **Error states are never inline in feature components.** Error rendering is delegated to `ErrorState` (from `components/common/`) or the nearest `error.tsx` boundary. Feature components do not contain their own error UI.

18. **`WhatsAppFAB` is mounted once in the root layout.** It is not added to individual pages. Pages that should not show it (Checkout) hide it via the checkout layout, which renders the `MinimalHeader` instead of the full layout stack.

19. **`RecentlyViewed` reads from `UIStore`, not from an API.** Recently viewed products are tracked client-side by recording product slug + metadata on PDP mount. There is no API for this in v2.0.

20. **Internal sub-components are never exported from barrel files.** `GalleryThumbnail` inside `ProductGallery` is not in `components/product/index.ts`. If a component needs to be used outside its parent, it should be promoted to a standalone component with its own export.

---

## 22. Component Dependency Graph

This graph shows the allowed dependency directions. Arrows point from dependent → dependency. No circular dependencies are permitted.

```
Page/Route Layer (app/)
  ↓ passes data as props to
  ↓ imports
Commerce Components (components/product/, shop/, cart/, checkout/, brand/, account/, wishlist/)
  ↓ uses primitives from
  ↓ reads state from
Common Components (components/common/)
  ↓ uses
Layout Components (components/layout/)
  ↓ uses primitives from
UI Components (components/ui/)

State Layer (store/)
  ← written by Client Commerce Components
  ← read by Client Commerce Components and Client Layout Components

API Integration Layer (lib/woocommerce/)
  ← called by server-side Page components and API routes ONLY
  NOT accessed by any component directly

Validation Layer (lib/validations/)
  ← used by Form components (CheckoutForm, ContactForm)
  ← used by API routes for server-side validation

Utilities Layer (lib/utils/, lib/constants/)
  ← used by any layer
```

**Forbidden dependency directions:**
- `components/ui/` → anything in `components/commerce/` or `store/`
- `components/product/` → `lib/woocommerce/` (data must come through props or API routes)
- `store/` → any component (stores are passive — they don't import components)
- `lib/woocommerce/` → any component (integration layer is server-only and unaware of UI)
- Any component → `lib/woocommerce/client.ts` (server-only; build fails if attempted)

---

## 23. Future Components Roadmap

### v2.1 Components

These components require new engineering but slot into the existing system without structural changes.

**Authentication:**
- `LoginModal` (Client) — Email/phone + password form, mounts as overlay
- `RegisterModal` (Client) — Registration flow
- `AuthGuard` (Client) — Wrapper that redirects unauthenticated users from account pages
- `UserMenu` (Client) — Replaces the current Account icon in NavActions — shows avatar + dropdown when authenticated

**Reviews:**
- `ReviewForm` (Client) — Controlled form for submitting reviews, calls `POST /api/reviews`
- `ReviewSubmitPrompt` (Client) — CTA shown post-purchase prompting review submission

**Order Tracking:**
- `OrderStatusBadge` (Server) — Replaces the static "قيد التوصيل" in v2.0 OrderCard with a live status from WooCommerce
- `OrderTrackingTimeline` (Client) — Visual order status timeline, replaces WhatsApp tracking link

**Payments:**
- `PaymentMethodSelector` (Client) — COD + online payment toggle in checkout
- `PaymentGatewayForm` (Client) — Paymob/Fawry embedded form

**Email Capture:**
- `NewsletterSignup` (Client) — Email collection component for footer and modal

---

### v3.0 Components

**Progressive Web App:**
- `InstallPWAPrompt` (Client) — Browser install prompt for PWA
- `OfflineState` (Client) — Shown when network is unavailable in PWA context

**Multi-language:**
- `LanguageSwitcher` (Client) — Arabic ↔ English toggle in the Navbar
- All string-bearing components refactored to accept strings via `i18n` hooks rather than hardcoded Arabic

**Headless CMS (Sanity/Contentful):**
- `CMSHeroSection` (Server) — Homepage hero driven by CMS data instead of static config
- `CMSBrandStory` (Server) — BrandHero content from CMS instead of constants
- `CMSEditorialSection` (Server) — Flexible editorial blocks for campaign content

**Product enhancements:**
- `ARTryOnButton` (Client) — Triggers camera-based lens preview
- `SizeGuide` (Client) — Modal with lens fit and base curve guidance
- `BundleBuilder` (Client) — Lens + accessories bundle configurator

---

*This document is the engineering reference for every component in MARTAL 2.0. Before building any component, locate it here. Before adding a new component, verify it does not already exist. Before changing a component's interface, update this document in the same PR. The component map and the running codebase must stay in sync.*

*Document Owner: Staff Frontend Engineering*  
*Last Updated: June 2026*  
*Next: 08_IMPLEMENTATION_PLAN.md — Sprint breakdown, task sequencing, development milestones, and launch readiness checklist*
