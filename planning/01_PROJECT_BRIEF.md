# 01 — PROJECT BRIEF
## MARTAL 2.0: Headless Commerce Rebuild

**Document Type:** Product & Engineering Strategy Brief  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Pre-Development — Foundation Document  
**Prepared by:** Product Strategy  
**Audience:** Design, Engineering, Stakeholders

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Brand Context](#2-brand-context)
3. [Problem Statement](#3-problem-statement)
4. [Project Goals](#4-project-goals)
5. [Target Audience](#5-target-audience)
6. [Market & Competitive Context](#6-market--competitive-context)
7. [Technical Strategy](#7-technical-strategy)
8. [Information Architecture](#8-information-architecture)
9. [Page Inventory & Intent](#9-page-inventory--intent)
10. [Feature Scope](#10-feature-scope)
11. [Design Principles](#11-design-principles)
12. [Localization & RTL Strategy](#12-localization--rtl-strategy)
13. [SEO Strategy](#13-seo-strategy)
14. [Performance Targets](#14-performance-targets)
15. [Data Architecture](#15-data-architecture)
16. [State Management Strategy](#16-state-management-strategy)
17. [Integration Architecture](#17-integration-architecture)
18. [Migration Considerations from v1](#18-migration-considerations-from-v1)
19. [Out of Scope (v2+)](#19-out-of-scope-v2)
20. [Success Metrics](#20-success-metrics)
21. [Risks & Mitigations](#21-risks--mitigations)
22. [Glossary](#22-glossary)

---

## 1. Executive Summary

MARTAL is a premium beauty e-commerce brand selling Korean-manufactured colored contact lenses to the Egyptian market. The brand occupies the intersection of Korean cosmetic quality, Turkish aesthetic sensibility, and Egyptian consumer culture — a niche that commands emotional loyalty and strong word-of-mouth when served well.

MARTAL 1.0 was built as a static, multi-page HTML/CSS/JavaScript application. It delivered a strong visual identity and established the core user flows: browsing, searching, product evaluation, and cart management. However, it carries fundamental architectural constraints — a client-side product data model with no backend integration, localStorage-only persistence, no real order management, and limited scalability — that make it unfit for a production commerce operation beyond prototype scale.

MARTAL 2.0 is a complete rebuild as a modern headless commerce application. The frontend will be a Next.js application backed by a WooCommerce REST API, delivering a luxury brand experience with production-grade performance, server-side rendering, real order processing, and a scalable component architecture.

This document defines everything that must be true before a single line of code is written: the brand's strategic intent, the architectural choices made and why, the complete page and feature inventory, design principles, localization requirements, SEO strategy, and the success criteria against which this project will be evaluated.

---

## 2. Brand Context

### 2.1 Brand Identity

| Attribute | Definition |
|---|---|
| **Brand Name** | MARTAL |
| **Category** | Premium beauty / colored contact lenses |
| **Origin Story** | Korean-manufactured lenses, distributed with a Turkish × Egyptian aesthetic sensibility |
| **Primary Market** | Egypt (EGP pricing, Arabic-first, COD-dominant payment) |
| **Tone of Voice** | Confident, feminine, aspirational — speaks directly to Egyptian women |
| **Visual Language** | Deep red (`#D50000`) on near-white (`#FCFCFC`), rose and nude accents, clean geometry, generous whitespace |
| **Typography** | Cairo (Google Fonts) — a modern Arabic geometric typeface with strong Latin support |

### 2.2 Product Catalog

MARTAL carries colored contact lenses across five brand lines, all Korean-manufactured, sold as monthly disposables:

| Brand | Positioning | Price Range (EGP) |
|---|---|---|
| **Hypnose** | Premium natural shades, bestseller anchor | 420 – 520 |
| **Labella** | Soft tones, everyday wear | 430 – 450 |
| **FXEyes** | Warm honey and earthy palettes | 390 – 480 |
| **ElAmore** | Statement colors, bridal collection | 390 – 550 |
| **ICONIC** | Bold contemporary shades | 460 – 520 |

Each product exists in multiple color variants, each with its own price, discount status, and visual identity.

### 2.3 Commerce Model

- **Payment:** Cash on Delivery (COD) is the primary and currently only payment method. This is standard for Egyptian e-commerce and a trust signal, not a limitation.
- **Fulfillment:** Shipping to all Egyptian governorates. Free shipping on orders above 800 EGP.
- **Order Communication:** WhatsApp is currently the primary post-order communication channel.
- **Currency:** Egyptian Pound (EGP).

---

## 3. Problem Statement

### 3.1 What MARTAL 1.0 Got Right

MARTAL 1.0 demonstrated real product-market intuition. The design system — the red/nude/rose palette, Cairo typeface, card-based product layout, RTL-first architecture, mobile bottom navigation, and the premium search overlay — all reflect a strong aesthetic sense and genuine understanding of the target user. The v1 codebase is well-structured for a static site and is documented to a standard most static projects never reach.

### 3.2 Where MARTAL 1.0 Falls Short

The v1 architecture has reached the boundary of what a static application can do:

**No real commerce backend.** Products live in a JavaScript array (`window.PRODUCTS`). There is no inventory management, no order processing, no payment integration, and no admin interface. Scaling the catalog requires editing source code.

**No persistent user sessions.** Cart and wishlist state lives in module-scoped JavaScript variables and localStorage. A page refresh can lose cart state. There is no user authentication, no order history that persists across sessions, and no saved addresses.

**No server-side rendering.** All content is rendered client-side. Product pages, category pages, and the homepage receive no server-rendered HTML for search engine crawlers, meaning the catalog is effectively invisible to Google.

**No scalable data layer.** Every filter, sort, and search operation runs on a hardcoded 8-product array. There is no path from this architecture to a real catalog of hundreds of SKUs.

**No real order processing.** The checkout page collects form data but has no backend to receive it. The MVP relies on WhatsApp message generation as a checkout proxy — functional for prototyping but not for a production operation.

**No analytics or conversion tracking.** There is no instrumentation to understand where users drop off, what they search for, or which products drive the most consideration.

### 3.3 The Strategic Gap

MARTAL is not a portfolio project or a prototype. It is a real brand selling a real product in a real market. The gap between the current static site and a production commerce operation is not a cosmetic one — it is architectural. MARTAL 2.0 must close this gap entirely.

---

## 4. Project Goals

### 4.1 Primary Goals

**G1 — Production Commerce Operation**  
MARTAL 2.0 must support real order processing: customers place orders, inventory decrements, orders route to fulfillment, and customers receive confirmation. This requires a live WooCommerce backend connected to a Next.js frontend.

**G2 — Premium Brand Experience at Scale**  
The luxury aesthetic of MARTAL 1.0 must be preserved and elevated — not diluted by a generic component library. Framer Motion animations, fluid micro-interactions, and the brand's distinctive red/nude/rose visual identity must feel native to the application, not cosmetic additions.

**G3 — Mobile-First, RTL-Native**  
Egyptian users are overwhelmingly mobile-first. The application must be designed for a 375px viewport first and for RTL Arabic as its primary language. LTR and desktop are secondary considerations, not the base.

**G4 — Search Engine Visibility**  
Every product page, category page, and content page must be server-rendered with accurate meta tags, structured data, and Open Graph markup. MARTAL 2.0 must be indexable and rankable from day one.

**G5 — Scalable Component Architecture**  
The component system must support a growing catalog, new product categories, new brands, and seasonal campaigns without requiring architectural changes. It must be documented well enough that a new developer can contribute without breaking the design system.

**G6 — Case-Study Quality Engineering**  
This project is simultaneously a production application and a demonstration of senior-level frontend architecture. Every technical decision must be deliberate, documented, and defensible.

### 4.2 Secondary Goals

- Reduce time-to-purchase by minimizing friction in the browse → cart → checkout funnel
- Build the foundation for future features: reviews, loyalty points, size guides, and AR lens try-on
- Establish a design system that can support future brand extensions

---

## 5. Target Audience

### 5.1 Primary User: The Egyptian Beauty Consumer

**Demographics:** Women, 18–35, urban Egypt (Cairo, Alexandria, Giza, and second-tier governorates)  
**Device:** Mobile-first; iPhone and mid-range Android dominate  
**Language:** Arabic primary; English brand names and product terminology are expected and trusted  
**Payment preference:** Strong preference for Cash on Delivery; credit card trust is low  
**Purchase behavior:** Discovery through social media (TikTok, Instagram Reels); validation through customer reviews and WhatsApp inquiry; conversion through COD trust signals

### 5.2 User Psychology

Egyptian beauty consumers are discerning and skeptical about product authenticity. For contact lenses specifically, trust signals are not optional — they are conversion prerequisites. A shopper who doubts a lens is genuinely Korean-manufactured will not purchase, regardless of price. The application must communicate authenticity, safety, and quality at every touchpoint.

Social proof is disproportionately powerful. Review counts, sold counts, bestseller badges, and visible user testimonials carry more weight than editorial copy.

Urgency works. Limited stock, sale countdowns, and "bestseller" signals drive conversion with this audience.

### 5.3 Secondary User: The MARTAL Administrator

The brand owner or operations manager using the WooCommerce admin panel to manage products, process orders, update inventory, and run promotions. This user never interacts with the Next.js frontend directly — their surface is WooCommerce. The frontend must be designed to surface whatever the backend exposes correctly and gracefully.

---

## 6. Market & Competitive Context

### 6.1 Category Dynamics

The colored contact lens market in Egypt is growing, driven by beauty content on TikTok and Instagram. Most purchases currently happen through:

- Instagram DMs to individual resellers
- Generic e-commerce platforms (e.g., Jumia) with minimal brand differentiation
- WhatsApp group purchasing

A branded, product-quality e-commerce experience at MARTAL's level is genuinely differentiated in this market. The competitive moat is brand trust, user experience quality, and product curation — not price.

### 6.2 Consumer Trust Factors (Egypt-Specific)

| Factor | Why It Matters |
|---|---|
| COD payment | Non-negotiable for most buyers; absence kills conversion |
| Arabic-first UI | Builds familiarity and trust vs. English-only competitors |
| Visible review counts | Social proof is primary evaluation mechanism |
| Authenticity signals | "Korean original" (أصلية كورية) is a purchase trigger |
| WhatsApp accessibility | Users expect to be able to contact the brand directly |
| Governorate shipping | Buyers outside Cairo need to see they are served |

---

## 7. Technical Strategy

### 7.1 Stack Rationale

| Technology | Role | Rationale |
|---|---|---|
| **Next.js 14+ (App Router)** | Frontend framework | SSR/SSG for SEO; file-based routing matches page inventory; React Server Components reduce client bundle size; image optimization built-in |
| **TypeScript** | Language | Type safety across the data layer, API responses, and component props; eliminates an entire class of runtime errors that plagued v1's dynamic product resolution |
| **Tailwind CSS** | Styling | Utility-first, purged for production; works cleanly with RTL via `dir="rtl"` and logical properties; design tokens map directly from v1's CSS custom properties |
| **Framer Motion** | Animation | Production-quality animation library; declarative API integrates naturally with React; handles the entrance animations, page transitions, and micro-interactions that define the brand experience |
| **Shadcn/UI** | Component primitives | Accessible, unstyled primitives that can be fully re-skinned to match MARTAL's design system; avoids the visual override burden of opinionated UI libraries |
| **Zustand** | State management | Minimal boilerplate; ideal for cart, wishlist, and UI state; supports localStorage persistence via `persist` middleware; replaces the fragile module-scoped state of v1 |
| **WooCommerce REST API** | Commerce backend | Headless WooCommerce provides a complete e-commerce backend (products, inventory, orders, customers, coupons) with a mature REST API, without requiring a custom backend to be built |

### 7.2 Rendering Strategy

Each route type uses the appropriate Next.js rendering pattern:

| Route Type | Strategy | Rationale |
|---|---|---|
| Homepage | ISR (revalidate: 3600) | Frequently updated but not real-time; editorial content benefits from caching |
| Shop / Category | SSR | Filter and sort parameters are dynamic; fresh inventory data required |
| Product Detail Page | ISR (revalidate: 300) | Product data changes infrequently; aggressive caching justified; revalidate on stock changes |
| Brand Page | ISR (revalidate: 3600) | Brand metadata is near-static |
| Cart / Checkout | CSR | Fully user-specific; no benefit to server rendering |
| Account | CSR | Authenticated; per-user data |
| Static content pages | SSG | About, FAQ, Policies — content never changes without a deployment |

### 7.3 Project Structure

```
martal-2.0/
├── app/                          # Next.js App Router
│   ├── (shop)/                   # Route group: commerce pages
│   │   ├── page.tsx              # Homepage
│   │   ├── shop/page.tsx         # Shop / collection
│   │   ├── shop/[category]/page.tsx
│   │   ├── brand/[slug]/page.tsx
│   │   ├── product/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── account/page.tsx
│   │   └── search/page.tsx
│   ├── (content)/                # Route group: static content
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── shipping-policy/page.tsx
│   │   ├── returns/page.tsx
│   │   ├── privacy-policy/page.tsx
│   │   └── terms/page.tsx
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx
│   └── globals.css
├── components/
│   ├── ui/                       # Shadcn/UI primitives (re-skinned)
│   ├── layout/                   # Navbar, Footer, AnnouncementBar
│   ├── product/                  # ProductCard, ProductGallery, ColorSwatches
│   ├── shop/                     # FilterSidebar, SortBar, FilterChips, QuickView
│   ├── cart/                     # CartItem, CartSummary, CartDrawer
│   ├── checkout/                 # CheckoutForm, OrderSummary
│   ├── search/                   # SearchOverlay, SearchBar, SearchResults
│   └── common/                   # Button, Badge, Toast, Breadcrumb, Loading
├── lib/
│   ├── woocommerce/              # WooCommerce API client and helpers
│   ├── utils/                    # Formatting, validation, slugify
│   └── constants/                # Routes, config, Egypt governorates
├── store/
│   ├── cart.store.ts             # Zustand cart store
│   ├── wishlist.store.ts         # Zustand wishlist store
│   └── ui.store.ts               # Search overlay, drawer, modal state
├── types/
│   ├── product.ts
│   ├── order.ts
│   ├── customer.ts
│   └── woocommerce.ts
├── hooks/
│   ├── useCart.ts
│   ├── useWishlist.ts
│   ├── useSearch.ts
│   └── useLocalStorage.ts
└── public/
    └── fonts/ images/ icons/
```

---

## 8. Information Architecture

### 8.1 Navigation Structure

```
MARTAL
├── الرئيسية (Home)
├── المتجر (Shop)
│   ├── الكل (All Products)
│   ├── الأكثر مبيعاً (Bestsellers)
│   ├── عروض (Sale)
│   └── جديد (New Arrivals)
├── البراندات (Brands)
│   ├── Hypnose
│   ├── Labella
│   ├── FXEyes
│   ├── ElAmore
│   └── ICONIC
├── [Search — overlay, not a nav item]
├── سلتي (Cart)
├── المفضلة (Wishlist)
├── حسابي (Account)
└── تواصلي معنا (Contact)

Footer:
├── من نحن (About)
├── تواصلي معنا (Contact)
├── الأسئلة الشائعة (FAQ)
├── سياسة الشحن (Shipping Policy)
├── الاستبدال والإرجاع (Returns & Exchanges)
├── سياسة الخصوصية (Privacy Policy)
└── الشروط والأحكام (Terms & Conditions)
```

### 8.2 URL Structure

| Page | URL Pattern |
|---|---|
| Homepage | `/` |
| Shop (all) | `/shop` |
| Shop (filtered) | `/shop?brand=hypnose&color=brown&sort=bestseller` |
| Category | `/shop/[category-slug]` |
| Brand | `/brand/[brand-slug]` |
| Product Detail | `/product/[product-slug]` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Wishlist | `/wishlist` |
| Account | `/account` |
| Search | `/search?q=[query]` |
| About | `/about` |
| Contact | `/contact` |
| FAQ | `/faq` |
| Shipping Policy | `/shipping-policy` |
| Returns | `/returns` |
| Privacy Policy | `/privacy-policy` |
| Terms | `/terms` |

---

## 9. Page Inventory & Intent

### 9.1 Commerce Pages

#### HOME (`/`)
**Primary intent:** Convert first-time visitors into browsers; reinforce brand identity.

The homepage is an editorial and commercial document simultaneously. It must immediately communicate who MARTAL is, what it sells, and why it can be trusted. Key sections:

- Announcement bar (free shipping threshold, COD, authenticity)
- Hero section with primary CTA to shop
- "Shop by Look" editorial grid (bridal, natural, dramatic, etc.)
- Brand showcase (five brand cards)
- Bestsellers product grid
- Trust bar (authenticity, COD, shipping, satisfaction)
- Customer reviews carousel
- Instagram-style UGC section (placeholder for v1, live content in v2)

#### SHOP (`/shop`)
**Primary intent:** Product discovery and filtering. The highest-traffic page after the homepage.

- Sidebar filter panel (brands, colors, price range, flags: bestseller/new/sale/monthly)
- Mobile filter drawer (full-screen, accessible)
- Sort controls (relevance, bestseller, price asc/desc, newest, rating)
- Active filter chips with individual removal
- Product grid with `ProductCard` components
- Pagination or infinite scroll (decision: defer to design phase; both are supported by the API)
- Empty state for no-results
- Quick View modal for rapid product evaluation without leaving the grid

#### CATEGORY (`/shop/[category]`)
**Primary intent:** SEO-targeted landing pages for specific product segments (e.g., `/shop/natural-lenses`, `/shop/bridal-lenses`).

Architecturally similar to Shop but with a category-specific hero and pre-applied filters. Each category page is a static route with its own metadata.

#### BRAND (`/brand/[slug]`)
**Primary intent:** Brand storytelling and filtered product discovery.

- Brand hero: logo, origin story, Korean manufacturing badge, brand tagline
- Full product grid pre-filtered to this brand (same grid component as Shop)
- Remaining filters still functional within the brand context
- SEO: each brand page is a standalone indexable document

#### PRODUCT DETAIL (`/product/[slug]`)
**Primary intent:** Conversion. This is where the purchase decision is made.

Every element on this page serves conversion or trust. Key components:

- Image gallery: desktop zoom-on-hover, mobile swipe carousel
- Color variant swatches with per-variant pricing
- Price display: current price, crossed-out old price, discount percentage
- Rating stars + review count + sold count
- Add to Cart / Buy Now CTAs
- Sticky bottom bar (mobile): price + Add to Cart, always visible while scrolling
- Product tabs: Description / Specifications / How to Use / Reviews
- Specifications table (water content, base curve, diameter, duration, origin)
- Related products grid
- Wishlist toggle on product and from grid card

#### CART (`/cart`)
**Primary intent:** Order review and progression to checkout.

- Line items: product thumbnail, name, brand, selected color, quantity selector, per-item total
- Remove item action
- Dynamic order total (subtotal, shipping estimate, final total)
- COD trust badge
- Proceed to Checkout CTA
- Empty cart state with CTA to Shop
- Cart persists across sessions via Zustand + localStorage

#### CHECKOUT (`/checkout`)
**Primary intent:** Collect order information and confirm purchase.

- Customer information form: full name, phone number (Egyptian format validation), governorate dropdown (all 27 Egyptian governorates), street address, apartment/floor, notes
- Order summary sidebar: line items, subtotal, shipping, total
- COD confirmation: "You will pay upon delivery" — prominent, not buried
- Form validation: real-time, Arabic error messages
- Order submission: POST to WooCommerce Orders API
- On success: clear cart, redirect to Order Confirmation

#### WISHLIST (`/wishlist`)
**Primary intent:** Retention — save products for later, move to cart when ready.

- Product grid of wishlisted items (same `ProductCard` component)
- "Add to Cart" from wishlist without navigating to PDP
- Remove from wishlist
- "Move all to Cart" action
- Share wishlist (generate shareable URL — v2 stretch goal)
- Empty state with CTA to Shop
- Wishlist persists via Zustand + localStorage

#### ACCOUNT (`/account`)
**Primary intent:** Order history, saved information, and wishlist management.

v2.0 scope (no authentication yet — localStorage-driven):
- Order history: list of past orders pulled from localStorage (set during checkout)
- Each order: order number, date, items, total, status
- Saved address (from last checkout, editable)
- Wishlist tab (links to `/wishlist`)
- Clear history action

v2.1 scope (authentication): full WooCommerce customer account integration.

#### SEARCH (`/search?q=`)
**Primary intent:** Intent-matched product discovery.

- Search results grid matching the query
- Relevance-ranked by: brand match, color match, name match, description match
- Arabic ↔ English synonym resolution (e.g., "رمادي" → gray)
- Filter and sort available on top of search results
- Result count and query headline ("نتائج البحث عن: brown")
- No-results state with suggestions (trending, related colors)
- Recent searches (localStorage)

---

### 9.2 Content Pages

All content pages share a common structure: page hero, content body, and a CTA section linking back to the shop. They are statically generated at build time.

#### ABOUT MARTAL (`/about`)
**Intent:** Build emotional connection and trust with skeptical buyers.  
**Content:** Brand origin story, mission statement, the Korean × Turkish × Egyptian identity, sourcing transparency, authenticity guarantees.

#### CONTACT (`/contact`)
**Intent:** Provide a trust signal and a path to resolution.  
**Content:** Contact form (name, phone, message → WhatsApp or email), WhatsApp direct link, FAQ preview, operating hours.

#### FAQ (`/faq`)
**Intent:** Reduce pre-purchase anxiety and post-purchase friction.  
**Content:** Accordion-format Q&A covering: lens safety, wearing duration, care instructions, ordering process, delivery timelines, return eligibility, authenticity verification.

#### SHIPPING POLICY (`/shipping-policy`)
**Intent:** Eliminate a common abandonment trigger.  
**Content:** Free shipping threshold (800 EGP), standard delivery timelines per governorate, Cairo vs. other governorates, handling time, tracking process.

#### RETURNS & EXCHANGES (`/returns`)
**Intent:** Reduce purchase risk perception.  
**Content:** Return eligibility (unopened, original packaging), exchange process, timelines, contact method for returns.

#### PRIVACY POLICY (`/privacy-policy`)
**Intent:** Legal compliance; trust signal for data-conscious users.  
**Content:** What data is collected (name, phone, address), how it is used (order fulfillment, no third-party sale), data retention, user rights.

#### TERMS & CONDITIONS (`/terms`)
**Intent:** Legal compliance.  
**Content:** Purchase terms, product use disclaimer (contact lens safety), liability limitations, governing law (Egyptian law).

---

## 10. Feature Scope

### 10.1 In Scope — v2.0

| Feature | Priority | Notes |
|---|---|---|
| Product catalog from WooCommerce API | Critical | Replaces hardcoded `window.PRODUCTS` |
| Product filtering (brand, color, price, flags) | Critical | SSR-compatible URL-based filters |
| Product sorting | Critical | Bestseller, new, price, rating |
| Product search with Arabic/English synonym support | Critical | Replaces v1 `MartalSearch` engine |
| Product detail page with color variants | Critical | Per-variant pricing, images, availability |
| Cart (persistent, localStorage) | Critical | Zustand + persist middleware |
| Checkout form with Egypt governorate selector | Critical | WooCommerce order POST |
| Order confirmation page | Critical | Clears cart, displays order summary |
| Wishlist (persistent, localStorage) | High | Zustand + persist middleware |
| Quick View modal | High | Product preview without leaving grid |
| Search overlay (global) | High | Accessible, animated, suggestions |
| RTL layout (Arabic-first) | Critical | `dir="rtl"`, logical CSS properties throughout |
| Mobile-first responsive design | Critical | Base breakpoint: 375px |
| Mobile bottom navigation | High | Cart, Wishlist, Account, Home shortcuts |
| Sticky mobile Add-to-Cart bar (PDP) | High | Visible at all scroll positions |
| COD trust signals throughout | High | At product card, PDP, cart, checkout |
| WhatsApp FAB (floating action button) | Medium | Direct contact link, present on all pages |
| SEO metadata per page | Critical | Title, description, OG tags, canonical |
| Structured data (JSON-LD) | High | Product, BreadcrumbList, Organization |
| Announcement bar with promotions | Medium | Free shipping threshold, COD, authenticity |
| Page transitions (Framer Motion) | Medium | Elevates brand perception |
| Scroll-triggered entrance animations | Medium | Fade-in-up on section entry |
| 404 page | High | With CTAs back to Shop |
| Loading states and skeletons | High | Perceived performance |
| Error boundaries | High | Graceful API failure handling |
| All 7 content pages (About, Contact, FAQ, Policies) | Medium | Static, SEO-indexed |

### 10.2 Explicitly Out of Scope — v2.0

- User authentication and login (designed for in account page; implemented in v2.1)
- Payment gateway integration (v2.1; COD only in v2.0)
- Product reviews submission (display only; submission in v2.1)
- Loyalty/points system (v3)
- AR lens try-on (v3)
- Multi-language support (Arabic only in v2.0)
- Email marketing integration (v2.1)
- Push notifications (v3)
- Admin dashboard UI (WooCommerce admin is the admin surface)

---

## 11. Design Principles

### 11.1 Luxury Without Pretension

MARTAL's target customer is a young Egyptian woman who aspires to beauty and quality but is practical and price-conscious. The design must feel premium without feeling inaccessible. Luxury is communicated through restraint: generous whitespace, intentional typography, smooth animation, and high-quality photography — not by excess ornamentation.

Every component must earn its visual complexity. If an animation does not serve a purpose (direct attention, communicate state, provide feedback), it should not exist.

### 11.2 Trust Is a Design Element

Trust signals are not footnotes — they are first-class UI components. The COD badge, the "Korean original" authentication mark, review counts, sold counts, and the WhatsApp contact link are as important to the design as the Add-to-Cart button. They must be designed with the same care as primary conversion elements.

### 11.3 Mobile Is Not a Constraint — It Is the Canvas

Designs are created at 375px width first. Desktop is an enhancement. The mobile bottom navigation, the sticky PDP bar, the full-screen filter drawer, and the swipe gallery are not responsive adaptations — they are the primary interaction patterns.

### 11.4 The Brand Color Is Sacred

The MARTAL red (`#D50000`) is the brand's primary action color and the single most important visual element in the system. It appears on CTAs, prices, badges, active states, and brand marks. It does not appear on destructive actions, error states, or secondary elements that would dilute its signal strength.

### 11.5 Arabic Is the Primary Language

RTL is not an afterthought — it is the base writing mode. All layout, spacing, component composition, and icon directionality is designed for RTL first. LTR should not be possible to accidentally introduce.

---

## 12. Localization & RTL Strategy

### 12.1 Language Configuration

- **Primary language:** Arabic (ar-EG)
- **`lang` attribute:** `ar` on `<html>`
- **`dir` attribute:** `rtl` on `<html>`
- **Font:** Cairo (supports Arabic and Latin; Arabic-optimized metrics)
- **Number formatting:** Arabic-Indic numerals are acceptable but Latin numerals (0–9) are preferred for price display per Egyptian convention
- **Currency:** EGP, displayed as "جنيه" or "ج.م" — not the ISO code

### 12.2 RTL Implementation in Tailwind

All layout and spacing utilities must use CSS logical properties to avoid manual RTL overrides:

| Physical (avoid) | Logical (use) |
|---|---|
| `pl-4` / `pr-4` | `ps-4` / `pe-4` |
| `ml-auto` / `mr-auto` | `ms-auto` / `me-auto` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l` / `rounded-r` | `rounded-s` / `rounded-e` |

Icons that communicate directionality (arrows, chevrons, back/forward) must mirror in RTL. Framer Motion slide animations must account for RTL direction.

### 12.3 Arabic Typography Rules

- Minimum body text: 16px (Arabic letterforms require slightly larger sizes for equivalent legibility)
- Line height: 1.7 minimum for Arabic body text (Arabic script has more vertical complexity than Latin)
- Avoid `font-weight: 300` and below — Cairo thin weights render poorly in Arabic at small sizes
- Kerning: disable manual letter-spacing on Arabic text (it breaks Arabic ligatures)

---

## 13. SEO Strategy

### 13.1 Technical SEO Requirements

Every page must include:

- `<title>`: Arabic-first, includes brand name and primary keyword
- `<meta name="description">`: 120–160 characters, Arabic, includes primary keyword and conversion signal
- `<link rel="canonical">`: Absolute URL
- `<meta property="og:*">`: Full Open Graph suite for social sharing
- `lang="ar"` and `dir="rtl"` on `<html>`

### 13.2 Structured Data

| Page Type | Schema.org Type |
|---|---|
| Product Detail | `Product`, `Offer`, `AggregateRating` |
| Shop / Category | `ItemList`, `BreadcrumbList` |
| Brand | `Brand`, `ItemList` |
| FAQ | `FAQPage` |
| Contact | `ContactPage`, `Organization` |
| Homepage | `Organization`, `WebSite` |

### 13.3 Page-Specific SEO

**Product pages** are the highest-priority SEO surface. Each product page must render server-side with the full product name, brand, color variants, price, and description in the HTML — not injected by JavaScript.

**Category and brand pages** are the second tier. URLs should be keyword-rich and consistent (e.g., `/shop/natural-lenses`, `/brand/hypnose`).

**FAQ and policy pages** are long-tail SEO opportunities and trust signals. They also reduce inbound support volume.

### 13.4 Performance as SEO Signal

Core Web Vitals targets (see Section 14) directly affect Google ranking. LCP, CLS, and FID targets must be treated as SEO requirements, not merely UX goals.

---

## 14. Performance Targets

| Metric | Target | Priority |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 90 | Critical |
| LCP (Largest Contentful Paint) | < 2.5s | Critical |
| CLS (Cumulative Layout Shift) | < 0.1 | Critical |
| FID / INP (Interaction to Next Paint) | < 200ms | High |
| TTI (Time to Interactive) | < 3.5s | High |
| Total JS bundle (initial load) | < 200KB gzipped | High |
| API response (product list) | < 500ms | High |
| API response (product detail) | < 300ms | High |

### 14.1 Performance Strategy

**Image optimization:** Next.js `<Image>` component required for all product images. WebP format, responsive `sizes`, lazy loading below the fold.

**Font loading:** Cairo loaded via `next/font/google` with `display: swap`. Subset to Arabic + Latin characters only.

**Code splitting:** Each route chunk is automatically code-split by Next.js App Router. Heavy libraries (Framer Motion) are loaded only on pages that require them.

**API caching:** WooCommerce API responses are cached at the Next.js layer using `fetch` cache options per rendering strategy (see Section 7.2). Product data is not fetched on every request.

**Prefetching:** Next.js `<Link>` components prefetch routes on hover. Product card links prefetch the product detail page.

---

## 15. Data Architecture

### 15.1 WooCommerce Data Model

The WooCommerce REST API exposes the following primary resources consumed by the frontend:

| Resource | Endpoint | Usage |
|---|---|---|
| Products | `GET /products` | Shop grid, search, homepage grid |
| Product | `GET /products/{id}` | Product detail page |
| Product Variations | `GET /products/{id}/variations` | Color swatches, per-variant pricing |
| Product Categories | `GET /products/categories` | Category pages, filter options |
| Product Tags | `GET /products/tags` | Filter flags (bestseller, new, sale) |
| Orders | `POST /orders` | Checkout form submission |
| Customers | `GET /customers/{id}` | Account page (v2.1) |

### 15.2 TypeScript Type Definitions

Core types must be defined before any component is written:

```typescript
// types/product.ts
interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;           // Mapped from product category or custom attribute
  subtitle: string;        // Short description
  description: string;
  price: string;           // WooCommerce returns prices as strings
  regularPrice: string;
  salePrice: string;
  onSale: boolean;
  rating: number;          // average_rating
  reviewCount: number;     // rating_count
  soldCount: number;       // Custom meta field
  badge: ProductBadge | null;
  images: ProductImage[];
  variations: ProductVariation[];
  attributes: ProductAttribute[];
  categories: ProductCategory[];
  tags: ProductTag[];
}

interface ProductVariation {
  id: number;
  colorName: string;
  colorHex: string;
  price: string;
  regularPrice: string;
  salePrice: string;
  onSale: boolean;
  image: ProductImage;
  stockStatus: 'instock' | 'outofstock' | 'onbackorder';
}
```

### 15.3 API Client

A typed WooCommerce API client (`lib/woocommerce/client.ts`) will wrap all API calls, handle authentication (consumer key/secret), implement error handling, and return typed responses. No raw `fetch` calls to the WooCommerce API should exist outside this client.

---

## 16. State Management Strategy

### 16.1 Zustand Stores

**Cart Store (`store/cart.store.ts`)**

```typescript
interface CartStore {
  items: CartItem[];
  addItem: (product: Product, variation: ProductVariation, qty: number) => void;
  removeItem: (productId: number, variationId: number) => void;
  updateQty: (productId: number, variationId: number, qty: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}
```

Persisted to localStorage via Zustand `persist` middleware. Key: `martal_cart`.

**Wishlist Store (`store/wishlist.store.ts`)**

```typescript
interface WishlistStore {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
}
```

Persisted to localStorage. Key: `martal_wishlist`.

**UI Store (`store/ui.store.ts`)**

```typescript
interface UIStore {
  searchOpen: boolean;
  filterDrawerOpen: boolean;
  quickViewProduct: Product | null;
  openSearch: () => void;
  closeSearch: () => void;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}
```

Not persisted (in-memory only).

---

## 17. Integration Architecture

### 17.1 WooCommerce REST API

WooCommerce runs as a headless backend. All product, order, and customer data flows through its REST API. The frontend has no direct database access.

**Authentication:** WooCommerce REST API consumer key + secret, stored in environment variables, used only in server-side API calls. Never exposed to the browser.

**Environment variables required:**
```
WOOCOMMERCE_URL=https://admin.martal.store
WOOCOMMERCE_KEY=ck_xxxxxxxxxxxx
WOOCOMMERCE_SECRET=cs_xxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://martal.store
```

### 17.2 Order Submission Flow

```
Customer fills checkout form
  → Client validates (phone format, required fields)
  → POST /api/orders (Next.js API route — server-side)
    → API route calls WooCommerce POST /orders
    → WooCommerce creates order, returns order ID and number
  → Client receives order confirmation
  → Zustand cart.clearCart()
  → Redirect to /order-success?id={orderId}
```

The order submission routes through a Next.js API route to keep WooCommerce credentials server-side only.

### 17.3 WhatsApp Integration

WhatsApp remains the primary customer communication channel. Integration points:

- **Global FAB:** `https://wa.me/+20[phone]` — opens WhatsApp with no pre-filled message
- **Contact page:** Pre-filled message with inquiry context
- **Order confirmation:** "Track your order via WhatsApp" deep link with order number pre-filled
- **Checkout fallback (MVP):** If API submission fails, a fallback generates a WhatsApp message with the full order details

---

## 18. Migration Considerations from v1

MARTAL 1.0 established several architectural decisions that must be explicitly revisited in v2.0:

### 18.1 What Carries Forward

| v1 Decision | v2 Equivalent | Notes |
|---|---|---|
| Brand color system (red/nude/rose) | Tailwind CSS custom theme | Direct token mapping |
| Cairo typeface | `next/font/google` | Same font, optimized loading |
| Mobile-first, RTL | `dir="rtl"` on `<html>`, logical Tailwind utilities | Same priority, better implementation |
| Card-based product grid | `ProductCard` component | Reuses v1 visual design |
| Search overlay pattern | `SearchOverlay` component | Same UX pattern, React implementation |
| Color swatch variant selection | `ColorSwatches` component | Connected to real WooCommerce variations |
| Product data schema | TypeScript interfaces | v1 schema informs the type definitions |
| Egyptian governorate list | `lib/constants/governorates.ts` | Static data from v1 |
| Arabic/English synonym map | `lib/utils/search.ts` | Directly migrated from `search-engine.js` |

### 18.2 What Does Not Carry Forward

| v1 Pattern | Reason for Replacement |
|---|---|
| `window.PRODUCTS` global array | Replaced by WooCommerce API + TypeScript types |
| Module-scoped cart state (`cartCount`) | Replaced by Zustand cart store |
| localStorage-direct wishlist toggle | Replaced by Zustand wishlist store |
| `buildProductCard()` global function | Replaced by `<ProductCard>` React component |
| `shopState` global object | Replaced by URL search params + React state |
| Script load order dependencies | Eliminated by module system |
| Dual-role `shop.html?q=` for search | Replaced by dedicated `/search` route |
| Inline CSS in HTML | Eliminated by Tailwind |
| Manual DOM manipulation | Eliminated by React |

---

## 19. Out of Scope (v2+)

The following are explicitly deferred to future versions. They should be designed for (don't create architectural barriers) but not built in v2.0:

**v2.1 — Authentication & Payments**
- Customer accounts with WooCommerce authentication
- Saved addresses per account
- Order history from WooCommerce (not localStorage)
- Payment gateway integration (Paymob, Fawry, or Stripe)
- Product review submission

**v2.2 — Personalization & Retention**
- Email marketing integration (Klaviyo or Mailchimp)
- Abandoned cart recovery emails
- Personalized product recommendations
- Loyalty points / rewards system
- Push notification opt-in

**v3 — Advanced Commerce & Experience**
- AR lens try-on (front camera integration)
- "Shop the Look" editorial with shoppable UGC
- Bundle builder (lens + solution + case)
- Subscriptions (monthly lens auto-refill)
- Affiliate / influencer referral program
- Multi-language support (English UI)

---

## 20. Success Metrics

### 20.1 Technical Metrics (Measurable at Launch)

| Metric | Target |
|---|---|
| Lighthouse Performance score (mobile) | ≥ 90 |
| Lighthouse Accessibility score | ≥ 95 |
| Lighthouse SEO score | ≥ 95 |
| Core Web Vitals: LCP | < 2.5s |
| Core Web Vitals: CLS | < 0.1 |
| TypeScript strict mode compliance | 100% (no `any`) |
| Zero console errors in production | Required |
| All 404/500 states handled | Required |

### 20.2 Commerce Metrics (Measurable Post-Launch)

| Metric | Baseline | 90-Day Target |
|---|---|---|
| Checkout completion rate | — (no v1 data) | ≥ 45% of cart initiations |
| Cart abandonment rate | — | ≤ 55% |
| Mobile conversion rate | — | ≥ 2.5% |
| Average session duration | — | ≥ 3 minutes |
| Pages per session | — | ≥ 4 |
| Search usage rate | — | ≥ 20% of sessions use search |
| Wishlist usage rate | — | ≥ 15% of sessions add to wishlist |

### 20.3 Portfolio / Case Study Metrics

- Production deployment on a custom domain with a live WooCommerce backend
- Full Lighthouse audit screenshots
- Documented architecture decisions with rationale
- Component library documented (Storybook or equivalent)
- Performance comparison: v1 vs. v2 side-by-side

---

## 21. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| WooCommerce API rate limits under load | Medium | High | Implement ISR caching aggressively; avoid waterfall API calls |
| RTL layout regressions during development | High | Medium | Establish RTL testing checklist; review at component level, not just page level |
| Framer Motion performance on low-end Android | Medium | High | Use `will-change: transform` sparingly; test on mid-range Android (≤4GB RAM); respect `prefers-reduced-motion` |
| TypeScript `any` type creep | High | Medium | Enable strict mode from day one; enforce in CI |
| WooCommerce product schema mismatch | Medium | High | Define TypeScript interfaces from API docs before writing components; add runtime validation |
| COD order fraud | Low | High | Out of scope for frontend; WooCommerce admin handles order review |
| Arabic text rendering inconsistency across devices | Medium | Medium | Test Cairo font on Android WebView, iOS Safari, and Chrome; define minimum font size floor |
| Scope creep toward v2.1 features | High | Medium | This document is the scope contract; any addition requires explicit approval and timeline adjustment |

---

## 22. Glossary

| Term | Definition |
|---|---|
| **COD** | Cash on Delivery — the primary payment method in Egyptian e-commerce |
| **PDP** | Product Detail Page (`/product/[slug]`) |
| **ISR** | Incremental Static Regeneration — Next.js rendering mode that serves a cached static page and regenerates it in the background on a schedule |
| **SSR** | Server-Side Rendering — page rendered on the server on every request |
| **SSG** | Static Site Generation — page rendered at build time; no runtime server cost |
| **RTL** | Right-to-Left — text and layout direction for Arabic, Hebrew, and other scripts |
| **SKU** | Stock Keeping Unit — a unique identifier for a specific product variant |
| **Headless Commerce** | An architecture where the frontend (Next.js) is decoupled from the backend (WooCommerce), communicating only via API |
| **WooCommerce** | Open-source e-commerce plugin for WordPress, used as the MARTAL backend |
| **Zustand** | Lightweight React state management library |
| **Framer Motion** | React animation library used for page transitions and micro-interactions |
| **Shadcn/UI** | A collection of accessible, re-skinnable React component primitives |
| **Cairo** | Google Fonts typeface used across all MARTAL surfaces; supports Arabic and Latin |
| **EGP** | Egyptian Pound — the currency of all MARTAL transactions |
| **FAB** | Floating Action Button — the persistent WhatsApp contact button |
| **QV** | Quick View — the product preview modal accessible from the shop grid |
| **LCP** | Largest Contentful Paint — Core Web Vital measuring load performance |
| **CLS** | Cumulative Layout Shift — Core Web Vital measuring visual stability |
| **INP** | Interaction to Next Paint — Core Web Vital measuring responsiveness |

---

*This document represents the complete strategic foundation for MARTAL 2.0. It is the authoritative reference for all design and engineering decisions made during the project. Changes to scope, architecture, or priorities must be reflected here and versioned accordingly.*

*Document Owner: Product Strategy*  
*Last Updated: June 2026*  
*Next Review: Upon completion of technical architecture document (02_TECH_ARCHITECTURE.md)*
