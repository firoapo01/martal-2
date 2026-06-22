# 08 — DATA MODEL
## MARTAL 2.0: Complete Data Architecture & Model Specification

**Document Type:** Data Architecture Specification  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Pre-Development — Authoritative Data Reference  
**Prepared by:** Data Architecture  
**Reads after:** 06_ARCHITECTURE.md, 07_COMPONENT_MAP.md  
**Audience:** Frontend Engineers, API Integration Engineers

> **Relationship to previous documents.** The Architecture document (06) defined the integration layer and established the three-type-layer pattern (WC Raw → Application → UI). The Component Map (07) defined what each component accepts as props. This document is the complete specification of every data structure those layers work with — every field, its type, its source, its purpose, and its transformation path. It does not repeat architectural decisions; it operationalizes them.

> **No implementation code.** All structures in this document are expressed as field tables, transformation diagrams, and validation rules. No TypeScript interfaces, no Zod schemas, no Zustand store implementations. Engineers implement these specifications — this document is what they implement against.

---

## Table of Contents

1. [Data Architecture Overview](#1-data-architecture-overview)
2. [Core Domain Models](#2-core-domain-models)
3. [Commerce Models](#3-commerce-models)
4. [Customer Models](#4-customer-models)
5. [Checkout Models](#5-checkout-models)
6. [Order Models](#6-order-models)
7. [Search Models](#7-search-models)
8. [Filter Models](#8-filter-models)
9. [API DTO Layer](#9-api-dto-layer)
10. [Transformer Layer](#10-transformer-layer)
11. [Validation Layer](#11-validation-layer)
12. [localStorage Models](#12-localstorage-models)
13. [State Store Contracts](#13-state-store-contracts)
14. [TanStack Query Models](#14-tanstack-query-models)
15. [SEO Models](#15-seo-models)
16. [Error Models](#16-error-models)
17. [Security & Privacy Models](#17-security--privacy-models)
18. [Data Lifecycle Diagrams](#18-data-lifecycle-diagrams)
19. [Future Data Models (v2.1+)](#19-future-data-models-v21)
20. [Data Governance Rules](#20-data-governance-rules)

---

## 1. Data Architecture Overview

### 1.1 The Four-Layer Data Pipeline

Every piece of data in MARTAL 2.0 passes through four layers before reaching a component. Understanding this pipeline is prerequisite to understanding any individual model.

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: WooCommerce Raw Data (DTO Layer)                      │
│                                                                 │
│  Raw JSON responses from the WooCommerce REST API.              │
│  Prices are strings. Ratings are strings. Categories are        │
│  flat arrays. Meta fields are key-value pairs.                  │
│  This data is WooCommerce's truth — not MARTAL's.               │
│                                                                 │
│  Lives in: src/types/woocommerce.ts                             │
│  Prefix:   WC (e.g., WCProduct, WCOrder, WCTerm)               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼ Transformer functions
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: Application Domain Models                             │
│                                                                 │
│  Clean, typed, business-semantic data structures.               │
│  Prices are numbers. Ratings are numbers. Brand is a            │
│  string, not a category array. Badge is a union type.           │
│  This data is MARTAL's internal truth.                          │
│                                                                 │
│  Lives in: src/types/product.ts, order.ts, brand.ts, etc.      │
│  Prefix:   None (Product, Order, Brand)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼ Passed as props or fetched via TanStack Query
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: UI/State Models                                       │
│                                                                 │
│  Representations of data as it lives in component state         │
│  or Zustand stores. CartItem is not a Product — it is a         │
│  flattened snapshot of a product at the time of addition,       │
│  carrying only what the cart UI needs.                          │
│                                                                 │
│  Lives in: src/types/cart.ts, search.ts, api.ts                 │
│  Prefix:   None (CartItem, SearchResult, CheckoutFormData)      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼ Rendered by
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4: Components                                            │
│                                                                 │
│  Components receive Layer 2 or Layer 3 models as props.         │
│  They never receive Layer 1 (WC DTOs).                          │
│  They never fetch data themselves (except via TanStack Query    │
│  hooks which return Layer 2 models).                            │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Layer Responsibilities

| Layer | Responsibility | Knows About | Does Not Know |
|---|---|---|---|
| WC DTO | Exact API response shape | WooCommerce API format | MARTAL's UI needs |
| Application Model | Business domain | MARTAL's data needs | React, Zustand, CSS |
| UI/State Model | Component needs | React state, store shape | WooCommerce API |
| Component | Presentation | Props it receives | How data was fetched |

### 1.3 Data Origin Summary

| Data | Origin | Cache Strategy |
|---|---|---|
| Products, variations, brands | WooCommerce REST API | ISR (300s–3600s) |
| Categories, tags | WooCommerce REST API | ISR (86400s) |
| Orders (creation) | WooCommerce REST API via API route | No cache — write operation |
| Orders (display) | localStorage | Persisted — no expiry |
| Cart state | Zustand + localStorage | Persisted — no expiry |
| Wishlist slugs | Zustand + localStorage | Persisted — no expiry |
| Search suggestions | WooCommerce REST API via API route | TanStack Query (5 min) |
| Trending searches | Static configuration | Build-time |
| Recent searches | localStorage | Persisted — max 8 entries |
| Customer address | localStorage | Persisted — no expiry |
| Recently viewed | Zustand + localStorage | Persisted — max 20 entries |

---

## 2. Core Domain Models

### 2.1 Product

The central model of the application. Every product displayed on any page is a `Product` — transformed from WooCommerce's `WCProduct`.

| Field | Type | Required | Source | Purpose |
|---|---|---|---|---|
| `id` | `number` | Yes | WC `id` | Unique identifier for WooCommerce operations |
| `slug` | `string` | Yes | WC `slug` | URL-safe identifier; used in routes `/product/[slug]` |
| `name` | `string` | Yes | WC `name` | Display name (may contain brand name) |
| `brand` | `string` | Yes | Derived from WC `categories` (brand category) | Brand name — Hypnose, Labella, etc. |
| `brandSlug` | `string` | Yes | Derived from WC `categories` | Used for brand page links |
| `subtitle` | `string` | No | WC `short_description` (HTML stripped) | One-line product descriptor for cards |
| `description` | `string` | Yes | WC `description` (HTML preserved) | Full product description for PDP tabs |
| `price` | `number` | Yes | Parsed from WC `price` (string → number) | Current selling price in EGP |
| `regularPrice` | `number` | Yes | Parsed from WC `regular_price` | Original price before any discount |
| `salePrice` | `number \| null` | No | Parsed from WC `sale_price` (empty string → null) | Active sale price, null if not on sale |
| `onSale` | `boolean` | Yes | WC `on_sale` | Whether sale pricing is active |
| `discountPercent` | `number \| null` | No | Derived: `Math.round((1 - salePrice/regularPrice) * 100)` | Discount percentage for badge display |
| `inStock` | `boolean` | Yes | WC `stock_status === 'instock'` | Stock availability |
| `stockStatus` | `'instock' \| 'outofstock' \| 'onbackorder'` | Yes | WC `stock_status` | Granular stock state |
| `rating` | `number` | Yes | Parsed from WC `average_rating` (string → number) | Average review rating 0–5 |
| `reviewCount` | `number` | Yes | WC `rating_count` | Total review count |
| `soldCount` | `number` | No (default: 0) | From WC `meta_data[key='_sold_count']` | Displayed as social proof |
| `badge` | `'bestseller' \| 'new' \| 'sale' \| null` | No | Derived from WC `tags` (tag slug → badge type) | Priority: sale > bestseller > new |
| `images` | `ProductImage[]` | Yes | WC `images` array (transformed) | Gallery images |
| `variations` | `ProductVariation[]` | Yes | Fetched separately: WC `/products/{id}/variations` | Color variant data |
| `attributes` | `ProductAttribute[]` | No | WC `attributes` | Raw attribute data (used in specs tab) |
| `categories` | `string[]` | Yes | WC `categories` (names only) | For breadcrumb and related products |
| `seo` | `ProductSEO` | No | Derived | SEO metadata generated at page level |
| `createdAt` | `string` | No | WC `date_created` | For "New" badge logic |

**Computed / derived fields that do NOT come from WooCommerce:**
- `brand` — extracted from the product's category that matches a known brand slug list
- `discountPercent` — computed from `regularPrice` and `salePrice`
- `badge` — resolved by checking WC tags against a badge-to-tag-slug mapping
- `subtitle` — WC short_description with HTML stripped

---

### 2.2 ProductImage

| Field | Type | Required | Source | Purpose |
|---|---|---|---|---|
| `id` | `number` | Yes | WC `images[n].id` | Unique ID for key prop |
| `url` | `string` | Yes | WC `images[n].src` | Image URL for `next/image` |
| `alt` | `string` | Yes | WC `images[n].alt` (fallback: product name) | Accessibility + SEO alt text |
| `width` | `number` | No | WC `images[n].width` (may be missing) | Passed to `next/image` |
| `height` | `number` | No | WC `images[n].height` | Passed to `next/image` |
| `isPrimary` | `boolean` | No | First image in array = true | Determines gallery hero image |

**Note on alt text:** If WooCommerce returns an empty alt field, the transformer must use the product name + color variant name as the fallback: `"Hypnose Brown عدسة ملونة كورية"`. Empty alt text is an accessibility failure.

---

### 2.3 ProductVariation

Each color option is a separate WooCommerce product variation. The variation carries its own price (may differ from the parent product price), its own stock status, and its own images.

| Field | Type | Required | Source | Purpose |
|---|---|---|---|---|
| `id` | `number` | Yes | WC variation `id` | Used in cart and checkout payloads |
| `colorName` | `string` | Yes | WC attribute `pa_color` value | Display label on swatches |
| `colorNameAr` | `string` | No | From MARTAL color synonym map | Arabic color name for display |
| `colorHex` | `string` | Yes | From WC attribute `pa_color_hex` or MARTAL color config | CSS hex value for swatch circle |
| `price` | `number` | Yes | Parsed from WC variation `price` | Per-variant selling price |
| `regularPrice` | `number` | Yes | Parsed from WC variation `regular_price` | Per-variant compare-at price |
| `salePrice` | `number \| null` | No | Parsed from WC variation `sale_price` | Per-variant sale price |
| `onSale` | `boolean` | Yes | WC variation `on_sale` | Per-variant sale state |
| `inStock` | `boolean` | Yes | WC variation `stock_status === 'instock'` | Per-variant availability |
| `images` | `ProductImage[]` | No | WC variation `image` (single image → array of 1) | Color-specific gallery images |
| `sku` | `string` | No | WC variation `sku` | For order tracking in WooCommerce admin |

**The color hex mapping problem:** WooCommerce attribute values are strings (e.g., "Brown", "Honey Gray"). They do not carry hex values. Two solutions:
1. Add a custom WooCommerce attribute `pa_color_hex` that the admin fills with hex values per variation
2. Maintain a MARTAL-side color configuration (`lib/constants/colors.ts`) that maps color names to hex values

Solution 2 is used in v2.0 because it requires no WooCommerce admin configuration change. The transformer resolves hex from the color name via the mapping. Solution 1 is preferred for v2.1 when the WooCommerce backend is fully configured.

---

### 2.4 ProductAttribute

| Field | Type | Required | Source | Purpose |
|---|---|---|---|---|
| `id` | `number` | Yes | WC attribute `id` | |
| `name` | `string` | Yes | WC attribute `name` | Display label in specs table |
| `slug` | `string` | Yes | WC attribute `slug` | Internal identifier (`pa_color`, `pa_base-curve`, etc.) |
| `values` | `string[]` | Yes | WC attribute `options` | Spec values |
| `isVisible` | `boolean` | Yes | WC attribute `visible` | Whether to show in specs tab |
| `isVariation` | `boolean` | Yes | WC attribute `variation` | Whether this attribute drives variations |

**Standard MARTAL product attributes:**

| Attribute Slug | Display Name (Arabic) | Type |
|---|---|---|
| `pa_water-content` | المحتوى المائي | Specification |
| `pa_base-curve` | الانحناء الأساسي | Specification |
| `pa_diameter` | القطر | Specification |
| `pa_duration` | مدة الاستخدام | Specification |
| `pa_origin` | بلد المنشأ | Specification |
| `pa_color` | اللون | Variation |

---

### 2.5 ProductSpecification

A flattened, display-ready version of ProductAttribute used in the Specifications table on the PDP.

| Field | Type | Required | Purpose |
|---|---|---|---|
| `label` | `string` | Yes | Arabic display label |
| `value` | `string` | Yes | Human-readable value |
| `unit` | `string \| null` | No | Unit suffix (mm, %, etc.) |
| `displayOrder` | `number` | Yes | Sorting position in specs table |

---

### 2.6 ProductReview

| Field | Type | Required | Source | Purpose |
|---|---|---|---|---|
| `id` | `number` | Yes | WC review `id` | |
| `reviewerName` | `string` | Yes | WC `reviewer` (first name + last initial) | Display name |
| `reviewerGovernorate` | `string \| null` | No | From WC review meta (if captured) | Trust signal for Egyptian context |
| `productVariantName` | `string \| null` | No | From WC review meta | "اشتريتُ: Hypnose Brown" |
| `rating` | `number` | Yes | WC `rating` (1–5) | Star display |
| `body` | `string` | Yes | WC `review` (HTML stripped) | Review text |
| `date` | `string` | Yes | WC `date_created` (formatted) | Display date |
| `verified` | `boolean` | Yes | WC `verified` | Verified purchase badge |

---

### 2.7 Brand

| Field | Type | Required | Source | Purpose |
|---|---|---|---|---|
| `id` | `number` | Yes | WC category `id` | |
| `slug` | `string` | Yes | WC category `slug` | Route: `/brand/[slug]` |
| `name` | `string` | Yes | WC category `name` | Display name (English: "Hypnose") |
| `tagline` | `string` | Yes | From MARTAL brand config | Arabic tagline from Content §3 |
| `description` | `string` | Yes | WC category `description` or brand config | Brand story paragraph |
| `productCount` | `number` | Yes | WC category `count` | Used in brand card |
| `image` | `ProductImage \| null` | No | WC category `image` | Brand hero image |
| `heroBackgroundVariant` | `'cream' \| 'rose' \| 'stone' \| 'dark'` | Yes | From MARTAL brand config | Design system background token |
| `seoTitle` | `string` | Yes | Generated from brand name + template | Page `<title>` |
| `seoDescription` | `string` | Yes | From Content §16.2 template | Meta description |
| `seoIntro` | `string` | Yes | From Content §3 | Visible SEO paragraph on brand page |

**MARTAL brand configuration** (`lib/constants/brands.ts`) holds the fields that WooCommerce categories cannot: tagline, heroBackgroundVariant, seoIntro. The transformer merges WC category data with this static config.

**Known brand slugs (static, finite):**

| Brand | WC Category Slug |
|---|---|
| Hypnose | `hypnose` |
| Labella | `labella` |
| FXEyes | `fxeyes` |
| ElAmore | `elamore` |
| ICONIC | `iconic` |

---

### 2.8 ProductSEO

Generated server-side at the page level, not stored in WooCommerce.

| Field | Type | Source |
|---|---|---|
| `title` | `string` | `"{product.name} — عدسة ملونة كورية | MARTAL"` |
| `description` | `string` | Generated from product name, subtitle, price |
| `canonical` | `string` | `"https://martal.store/product/{product.slug}"` |
| `ogTitle` | `string` | Same as title |
| `ogDescription` | `string` | Same as description |
| `ogImage` | `string` | First product image URL |
| `ogImageAlt` | `string` | First product image alt |
| `jsonLd` | `object` | Schema.org `Product` structured data |

---

## 3. Commerce Models

### 3.1 CartItem

A snapshot of a product variation at the time of being added to the cart. It is intentionally denormalized — it carries all display data needed without requiring a product lookup on every render.

| Field | Type | Required | Source | Purpose |
|---|---|---|---|---|
| `productId` | `number` | Yes | `Product.id` | WooCommerce product ID for order submission |
| `variationId` | `number` | Yes | `ProductVariation.id` | WooCommerce variation ID for order submission |
| `slug` | `string` | Yes | `Product.slug` | Link back to PDP |
| `name` | `string` | Yes | `Product.name` | Display in cart |
| `brand` | `string` | Yes | `Product.brand` | Display in cart |
| `colorName` | `string` | Yes | `ProductVariation.colorName` | Selected color display |
| `colorHex` | `string` | Yes | `ProductVariation.colorHex` | Color swatch in cart |
| `image` | `string` | Yes | `ProductVariation.images[0].url` or `Product.images[0].url` | Thumbnail in cart |
| `imageAlt` | `string` | Yes | Image alt text | Accessibility |
| `price` | `number` | Yes | `ProductVariation.price` at time of addition | Subtotal calculation |
| `quantity` | `number` | Yes | User-set (1–10) | Quantity |
| `addedAt` | `number` | Yes | Unix timestamp at time of `addItem()` call | For staleness detection and ordering |

**Price staleness:** The `price` in `CartItem` is the price at time of addition. If WooCommerce changes the price, the stored cart price is stale. The checkout page validates current prices on mount. See §18.2 for the cart lifecycle diagram.

---

### 3.2 Cart

The computed cart object. Not stored directly — derived from `CartItem[]`.

| Field | Type | Derived From | Purpose |
|---|---|---|---|
| `items` | `CartItem[]` | CartStore | Line items |
| `itemCount` | `number` | `sum(item.quantity)` | Badge display |
| `subtotal` | `number` | `sum(item.price * item.quantity)` | Pricing |
| `shippingCost` | `number` | `subtotal >= 800 ? 0 : 50` | Pricing |
| `total` | `number` | `subtotal + shippingCost` | Final price |
| `qualifiesForFreeShipping` | `boolean` | `subtotal >= 800` | Progress bar |
| `amountToFreeShipping` | `number` | `max(800 - subtotal, 0)` | Progress bar message |
| `freeShippingProgress` | `number` | `min(subtotal / 800, 1)` | Progress bar 0–1 |
| `isEmpty` | `boolean` | `items.length === 0` | Empty state |

**Free shipping threshold** is stored in application configuration (`lib/constants/config.ts`), not hardcoded in derived logic.

---

### 3.3 WishlistItem

The wishlist stores only product slugs. Product data is fetched on demand when the Wishlist page is viewed.

| Field | Type | Source | Purpose |
|---|---|---|---|
| `slug` | `string` | Saved when user taps WishlistToggle | Identifies the product |
| `addedAt` | `number` | Unix timestamp | For ordering wishlisted items |

**Why slugs only, not full ProductItem objects:**
- Prices and stock change over time — storing full product data would produce stale cart-like objects that misrepresent current availability
- Fetching fresh product data on Wishlist page load ensures the user sees current pricing
- Storage footprint is minimal — 20 slugs vs 20 full product objects

---

### 3.4 Wishlist

| Field | Type | Derived From |
|---|---|---|
| `slugs` | `string[]` | WishlistStore |
| `count` | `number` | `slugs.length` |
| `isEmpty` | `boolean` | `slugs.length === 0` |
| `has(slug)` | `boolean` | `slugs.includes(slug)` |

---

## 4. Customer Models

### 4.1 Customer (v2.0 — localStorage-based)

In v2.0, no authentication exists. The customer record is assembled from data saved during checkout.

| Field | Type | Required | Source | Purpose |
|---|---|---|---|---|
| `fullName` | `string` | Yes | Checkout form input | Display in account profile |
| `phone` | `string` | Yes | Checkout form input | Contact and order tracking |
| `lastAddress` | `CustomerAddress \| null` | No | Saved after checkout | Pre-fill on next checkout |
| `createdAt` | `string` | No | First order timestamp | |

**v2.1 migration:** The `Customer` model maps directly to the WooCommerce customer object. Field names are chosen to match WooCommerce's field names where possible to simplify the migration from localStorage to authenticated API.

---

### 4.2 CustomerAddress

| Field | Type | Required | Validation | WooCommerce Mapping |
|---|---|---|---|---|
| `fullName` | `string` | Yes | Non-empty | `billing.first_name + last_name` |
| `phone` | `string` | Yes | Egyptian mobile format | `billing.phone` |
| `governorate` | `string` | Yes | Must be in 27-governorate enum | `billing.state` |
| `city` | `string` | Yes | Non-empty | `billing.city` |
| `addressLine1` | `string` | Yes | Min 5 chars | `billing.address_1` |
| `addressLine2` | `string \| null` | No | | `billing.address_2` |
| `notes` | `string \| null` | No | Max 500 chars | Order `customer_note` |

**Governorate list:** All 27 Egyptian governorates are maintained in `lib/constants/governorates.ts` as a typed enum. The list is the authoritative source for dropdown options and validation. It includes both Arabic display names and the English administrative code used in the WooCommerce `billing.state` field.

```
Sample governorate record:
{
  code: 'Cairo',           // WooCommerce billing.state value
  nameAr: 'القاهرة',      // Arabic display name in dropdown
  nameEn: 'Cairo',         // English label
  deliveryDays: '1-3'      // Used in DeliveryEstimate component
}
```

---

### 4.3 CustomerProfile (v2.0)

A read-only view assembled from the most recent order's customer data. Not independently editable in v2.0.

| Field | Type | Source |
|---|---|---|
| `name` | `string` | `lastOrder.customer.fullName` |
| `phone` | `string` | `lastOrder.customer.phone` |
| `orderCount` | `number` | `localStorage orders array length` |
| `lastOrderDate` | `string \| null` | `lastOrder.date` |

---

### 4.4 CustomerPreferences (v2.0)

Not implemented in v2.0. Defined here for v2.1 planning.

| Field | Type | Purpose |
|---|---|---|
| `preferredLanguage` | `'ar' \| 'en'` | Multi-language (v3) |
| `marketingConsent` | `boolean` | WhatsApp/email marketing opt-in |
| `savedCardLast4` | `string \| null` | Payment method (v2.1) |

---

## 5. Checkout Models

### 5.1 CheckoutFormData

The data model for the checkout form as managed by React Hook Form. This is Layer 3 (UI model) — it exists only in client state during the checkout session.

| Field | Type | Required | Validation Rule |
|---|---|---|---|
| `fullName` | `string` | Yes | Min 2 chars, max 100 chars |
| `phone` | `string` | Yes | Egyptian mobile: 01[0125][0-9]{8} |
| `governorate` | `string` | Yes | Must match governorate enum |
| `city` | `string` | Yes | Min 2 chars, max 100 chars |
| `addressLine1` | `string` | Yes | Min 5 chars, max 200 chars |
| `addressLine2` | `string` | No | Max 100 chars |
| `notes` | `string` | No | Max 500 chars |

---

### 5.2 CheckoutSubmission

The payload sent from the checkout form to the `/api/orders` API route. This is the contract between the client form and the server API.

| Field | Type | Source |
|---|---|---|
| `customer` | `CheckoutFormData` | React Hook Form values |
| `items` | `CheckoutLineItem[]` | Derived from CartStore |

**CheckoutLineItem** (lean version of CartItem for API payload):

| Field | Type | Source |
|---|---|---|
| `productId` | `number` | `CartItem.productId` |
| `variationId` | `number` | `CartItem.variationId` |
| `quantity` | `number` | `CartItem.quantity` |
| `price` | `number` | `CartItem.price` (for server-side order total validation) |

**Why price is included in the payload:** The server-side API route can cross-check the submitted price against the current WooCommerce price. A discrepancy indicates a stale cart. This enables the server to either reject the order or create it with the correct current price and notify the customer.

---

### 5.3 CheckoutResult

The response from the `/api/orders` route on success.

| Field | Type | Purpose |
|---|---|---|
| `orderId` | `number` | WooCommerce internal order ID |
| `orderNumber` | `string` | Human-readable order number (may be "ORD-1042") |
| `status` | `'processing'` | Confirmation of order status |
| `estimatedDelivery` | `string \| null` | Optional: derived from governorate delivery days |

---

### 5.4 CheckoutError

The response from the `/api/orders` route on failure.

| Field | Type | Purpose |
|---|---|---|
| `type` | `'validation' \| 'server_error' \| 'rate_limited'` | Error classification |
| `message` | `string` | Arabic user-facing message |
| `fields` | `Record<string, string> \| null` | Field-level validation errors (type: 'validation' only) |
| `whatsappFallback` | `string` | Pre-built WhatsApp URL with order details for fallback |

The `whatsappFallback` URL is always included in error responses from the orders API. This ensures the client always has a recovery path regardless of error type.

---

## 6. Order Models

### 6.1 Order

The order model as stored in localStorage and displayed in the Account dashboard. It is a denormalized snapshot — it does not require any API call to render.

| Field | Type | Required | Source |
|---|---|---|---|
| `id` | `number` | Yes | `CheckoutResult.orderId` |
| `number` | `string` | Yes | `CheckoutResult.orderNumber` |
| `status` | `OrderStatus` | Yes | Initially `'processing'`; updated by WooCommerce webhook in v2.1 |
| `date` | `string` | Yes | ISO date string at time of order placement |
| `items` | `OrderItem[]` | Yes | Snapshot from CartStore at checkout |
| `customer` | `StoredCustomer` | Yes | Snapshot from CheckoutFormData |
| `subtotal` | `number` | Yes | Cart subtotal at checkout |
| `shippingCost` | `number` | Yes | Shipping at checkout |
| `total` | `number` | Yes | Final order total |
| `paymentMethod` | `'cod'` | Yes | Always 'cod' in v2.0 |
| `source` | `'martal-2.0-web'` | Yes | Application identifier |

---

### 6.2 OrderItem

A snapshot of a cart item at the moment of order placement.

| Field | Type | Source |
|---|---|---|
| `productId` | `number` | `CartItem.productId` |
| `variationId` | `number` | `CartItem.variationId` |
| `slug` | `string` | `CartItem.slug` |
| `name` | `string` | `CartItem.name` |
| `brand` | `string` | `CartItem.brand` |
| `colorName` | `string` | `CartItem.colorName` |
| `image` | `string` | `CartItem.image` |
| `price` | `number` | `CartItem.price` at checkout |
| `quantity` | `number` | `CartItem.quantity` |
| `lineTotal` | `number` | `price × quantity` |

---

### 6.3 StoredCustomer (within Order)

A lean snapshot of the customer data used for that order.

| Field | Type |
|---|---|
| `fullName` | `string` |
| `phone` | `string` |
| `governorate` | `string` |

Full address is stored in `CustomerAddress` separately. The order record stores only the display-relevant fields.

---

### 6.4 OrderStatus Lifecycle

```
Order placed by customer
        ↓
    PENDING
  (immediately after WooCommerce POST)
        ↓
  PROCESSING
  (WooCommerce default for COD orders — payment not yet received)
        ↓
    SHIPPED
  (WooCommerce status updated by fulfillment team)
        ↓
  DELIVERED
  (WooCommerce status updated after COD collection)

Alternative paths:
  Any status → CANCELLED (initiated by customer or merchant)
```

**v2.0 status behavior:** In v2.0, orders are stored in localStorage with status `'processing'` and that status never updates — there is no webhook mechanism to push status changes to the client. The customer tracks their order via WhatsApp.

**v2.1 status behavior:** A WooCommerce webhook (`ORDER_STATUS_CHANGED`) POSTs to `/api/webhooks/order-status`. The API route updates the order in the customer's account (requires authentication). Status transitions become visible in the Account dashboard.

| Status | Arabic Display | Description |
|---|---|---|
| `pending` | قيد الانتظار | Order received, awaiting confirmation |
| `processing` | قيد المعالجة | Confirmed, being prepared |
| `shipped` | تم الشحن | In transit with courier |
| `delivered` | تم التوصيل | Delivered, COD collected |
| `cancelled` | ملغي | Cancelled by customer or merchant |
| `on-hold` | معلق | Requires attention (address issue, etc.) |

---

## 7. Search Models

### 7.1 SearchQuery

The input to the search system. Created by the `useSearch` hook from the `SearchInput` value.

| Field | Type | Notes |
|---|---|---|
| `raw` | `string` | Original user input, unmodified |
| `normalized` | `string` | Trimmed, lowercased |
| `resolved` | `string` | After synonym resolution (e.g., "بني" → "brown") |
| `language` | `'ar' \| 'en' \| 'mixed'` | Detected from character set |
| `isEmpty` | `boolean` | `raw.trim().length === 0` |
| `isTooShort` | `boolean` | `raw.trim().length < 2` |

---

### 7.2 SearchResult (full results page)

Returned by `GET /api/search?q=...` when navigating to `/search?q=...`.

| Field | Type | Notes |
|---|---|---|
| `query` | `string` | The search query that produced this result |
| `products` | `Product[]` | Full product objects (paginated) |
| `totalCount` | `number` | Total matching products |
| `page` | `number` | Current page |
| `hasMore` | `boolean` | Whether more results exist |

---

### 7.3 SearchSuggestion (overlay — lightweight)

Used in the search overlay. Intentionally lighter than full product objects.

**SearchProductSuggestion:**

| Field | Type | Source |
|---|---|---|
| `productId` | `number` | WC product id |
| `slug` | `string` | For link construction |
| `name` | `string` | Display |
| `brand` | `string` | Display |
| `price` | `number` | Display |
| `thumbnail` | `string` | First image URL |
| `matchType` | `'name' \| 'brand' \| 'color'` | Why this appeared |

**SearchBrandSuggestion:**

| Field | Type |
|---|---|
| `slug` | `string` |
| `name` | `string` |
| `tagline` | `string` |
| `productCount` | `number` |

**SearchColorSuggestion:**

| Field | Type |
|---|---|
| `colorName` | `string` |
| `colorNameAr` | `string` |
| `colorHex` | `string` |
| `productCount` | `number` |
| `filterUrl` | `string` (e.g., `/shop?color=brown`) |

---

### 7.4 SearchSuggestionsResponse

The complete response from `GET /api/search?q=...` (overlay mode, `limit` param set).

| Field | Type |
|---|---|
| `products` | `SearchProductSuggestion[]` (max 3) |
| `brands` | `SearchBrandSuggestion[]` (max 2) |
| `colors` | `SearchColorSuggestion[]` (max 3) |
| `hasMore` | `boolean` |
| `query` | `string` |

---

### 7.5 TrendingSearch

Static configuration entry — never fetched from an API in v2.0.

| Field | Type |
|---|---|
| `term` | `string` |
| `termAr` | `string \| null` |
| `url` | `string` (pre-built filter or search URL) |
| `displayOrder` | `number` |

---

### 7.6 RecentSearch

Stored in localStorage. Minimal structure.

| Field | Type |
|---|---|
| `query` | `string` |
| `timestamp` | `number` |

---

## 8. Filter Models

### 8.1 ShopFilters

The complete filter state for the shop page. Lives in URL search parameters — not in any store or component state.

| Parameter | Type | URL Param | Example |
|---|---|---|---|
| `brands` | `string[]` | `brand` (repeatable) | `?brand=hypnose&brand=labella` |
| `colors` | `string[]` | `color` (repeatable) | `?color=brown&color=gray` |
| `minPrice` | `number \| null` | `price_min` | `?price_min=300` |
| `maxPrice` | `number \| null` | `price_max` | `?price_max=550` |
| `flags` | `ShopFlag[]` | `flag` (repeatable) | `?flag=bestseller&flag=new` |
| `sort` | `SortOption` | `sort` | `?sort=bestseller` |
| `page` | `number` | `page` | `?page=2` |

**ShopFlag type:** `'bestseller' \| 'new' \| 'sale' \| 'monthly'`

---

### 8.2 SortOption

| Value | Arabic Label | WooCommerce Equivalent |
|---|---|---|
| `bestseller` | الأكثر مبيعاً | `orderby=popularity` |
| `newest` | الأحدث | `orderby=date, order=desc` |
| `price_asc` | السعر: الأقل أولاً | `orderby=price, order=asc` |
| `price_desc` | السعر: الأعلى أولاً | `orderby=price, order=desc` |
| `rating` | الأعلى تقييماً | `orderby=rating, order=desc` |

**Default sort:** `bestseller`. Applied when no `sort` URL param exists.

---

### 8.3 ActiveFilter

Represents a single applied filter — used to render FilterChip components.

| Field | Type | Purpose |
|---|---|---|
| `type` | `'brand' \| 'color' \| 'price' \| 'flag'` | Chip icon/style |
| `label` | `string` | Arabic display text on chip |
| `removeUrl` | `string` | URL with this filter removed |

The `removeUrl` is pre-computed when building the active filters list — it constructs the current URL without this specific parameter.

---

### 8.4 WooCommerce Filter Mapping

This table shows how MARTAL filter parameters map to WooCommerce REST API query parameters:

| MARTAL Filter | WC API Parameter | Notes |
|---|---|---|
| `brand=hypnose` | `category=hypnose` (slug) | Brand is a WC category |
| `color=brown` | `attribute=pa_color&attribute_term=brown` | Color is a WC attribute term |
| `price_min=300` | `min_price=300` | Direct WC param |
| `price_max=550` | `max_price=550` | Direct WC param |
| `flag=bestseller` | `tag=bestseller` (slug) | Flag is a WC product tag |
| `flag=new` | `tag=new` | |
| `flag=sale` | `on_sale=true` | WC native param |
| `sort=bestseller` | `orderby=popularity` | |
| `sort=newest` | `orderby=date&order=desc` | |
| `page=2` | `page=2&per_page=12` | |

---

### 8.5 PaginationState

| Field | Type | Source |
|---|---|---|
| `currentPage` | `number` | URL `page` param (default: 1) |
| `perPage` | `number` | Config constant (12) |
| `totalProducts` | `number` | WC API `X-WP-Total` response header |
| `totalPages` | `number` | WC API `X-WP-TotalPages` response header |
| `hasNextPage` | `boolean` | `currentPage < totalPages` |

---

## 9. API DTO Layer

DTOs (Data Transfer Objects) are the exact shapes of what WooCommerce returns. They are never consumed by UI components directly.

### 9.1 WCProduct DTO

Full field inventory of a WooCommerce product response:

| WC Field | WC Type | Used? | MARTAL Mapping |
|---|---|---|---|
| `id` | `number` | Yes | `Product.id` |
| `name` | `string` | Yes | `Product.name` |
| `slug` | `string` | Yes | `Product.slug` |
| `permalink` | `string` | No | Ignored — MARTAL constructs its own URLs |
| `type` | `string` | Partial | Used to confirm `variable` type |
| `status` | `string` | Yes | Only `publish` products are used |
| `price` | `string` | Yes | Parsed → `Product.price` (number) |
| `regular_price` | `string` | Yes | Parsed → `Product.regularPrice` |
| `sale_price` | `string` | Yes | `'' → null`, else parsed → `Product.salePrice` |
| `on_sale` | `boolean` | Yes | `Product.onSale` |
| `purchasable` | `boolean` | Yes | Affects `Product.inStock` |
| `stock_status` | `string` | Yes | → `Product.stockStatus` |
| `stock_quantity` | `number \| null` | No | Not used in v2.0 |
| `description` | `string` | Yes | HTML preserved → `Product.description` |
| `short_description` | `string` | Yes | HTML stripped → `Product.subtitle` |
| `average_rating` | `string` | Yes | Parsed → `Product.rating` (number) |
| `rating_count` | `number` | Yes | `Product.reviewCount` |
| `images` | `WCImage[]` | Yes | Transformed → `Product.images` |
| `categories` | `WCTerm[]` | Yes | Brand extracted → `Product.brand` |
| `tags` | `WCTerm[]` | Yes | Badge extracted → `Product.badge` |
| `attributes` | `WCAttribute[]` | Yes | → `Product.attributes` |
| `variations` | `number[]` | Yes | Used to fetch variation details |
| `meta_data` | `WCMetaData[]` | Partial | `_sold_count` key → `Product.soldCount` |
| `date_created` | `string` | Partial | Used for "new" badge logic |
| `sku` | `string` | No | Not displayed in v2.0 |
| `weight` | `string` | No | Physical shipping — not needed |
| `dimensions` | `object` | No | Physical dimensions — not needed |

**WCTerm structure:**

| Field | Type |
|---|---|
| `id` | `number` |
| `name` | `string` |
| `slug` | `string` |

**WCMetaData structure:**

| Field | Type |
|---|---|
| `id` | `number` |
| `key` | `string` |
| `value` | `unknown` |

---

### 9.2 WCProductVariation DTO

| WC Field | WC Type | MARTAL Mapping |
|---|---|---|
| `id` | `number` | `ProductVariation.id` |
| `price` | `string` | Parsed → `ProductVariation.price` |
| `regular_price` | `string` | Parsed → `ProductVariation.regularPrice` |
| `sale_price` | `string` | Parsed → `ProductVariation.salePrice` |
| `on_sale` | `boolean` | `ProductVariation.onSale` |
| `stock_status` | `string` | `ProductVariation.inStock` |
| `image` | `WCImage` | → `ProductVariation.images[0]` |
| `attributes` | `WCVariationAttribute[]` | Color name extracted |
| `sku` | `string` | `ProductVariation.sku` |

**WCVariationAttribute structure:**

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | Attribute ID |
| `name` | `string` | "Color" or "pa_color" |
| `option` | `string` | The value: "Brown", "Gray", "Honey" |

---

### 9.3 WCOrder DTO (for order creation)

The payload MARTAL sends TO WooCommerce when creating an order:

| WC Field | Value | Source |
|---|---|---|
| `payment_method` | `'cod'` | Hardcoded |
| `payment_method_title` | `'الدفع عند الاستلام'` | Hardcoded |
| `set_paid` | `false` | Always false for COD |
| `status` | `'processing'` | WooCommerce default for COD |
| `billing.first_name` | From checkout form | `fullName.split(' ')[0]` |
| `billing.last_name` | From checkout form | `fullName.split(' ').slice(1).join(' ')` |
| `billing.phone` | From checkout form | Normalized to `+20XXXXXXXXX` |
| `billing.address_1` | From checkout form | `addressLine1` |
| `billing.address_2` | From checkout form | `addressLine2 ?? ''` |
| `billing.city` | From checkout form | `city` |
| `billing.state` | From checkout form | `governorate` (English code) |
| `billing.country` | `'EG'` | Hardcoded |
| `shipping` | Same as billing | COD — billing = shipping |
| `customer_note` | From checkout form | `notes ?? ''` |
| `line_items[n].product_id` | From cart | `CartItem.productId` |
| `line_items[n].variation_id` | From cart | `CartItem.variationId` |
| `line_items[n].quantity` | From cart | `CartItem.quantity` |
| `meta_data[0].key` | `'source'` | Application source tracking |
| `meta_data[0].value` | `'martal-2.0-web'` | |

---

### 9.4 WCCategory DTO (for brands)

| WC Field | MARTAL Mapping |
|---|---|
| `id` | `Brand.id` |
| `name` | `Brand.name` |
| `slug` | `Brand.slug` |
| `count` | `Brand.productCount` |
| `description` | `Brand.description` (if set in WC admin) |
| `image.src` | `Brand.image.url` |
| `image.alt` | `Brand.image.alt` |

---

## 10. Transformer Layer

Transformers are pure functions: given WC DTO input, they return Application Model output. They have no side effects, no API calls, no state mutations.

---

### 10.1 ProductTransformer

**Input:** `WCProduct` + `WCProductVariation[]`  
**Output:** `Product`

**Responsibilities:**
1. Parse string prices to numbers (`parseFloat` with fallback to 0)
2. Compute `onSale` (already boolean in WC but double-check: `sale_price !== ''`)
3. Compute `discountPercent` from `regularPrice` and `salePrice`
4. Resolve `brand` from `categories` array: find the category whose slug matches a known brand slug
5. Resolve `brandSlug` from the same category
6. Strip HTML from `short_description` → `subtitle`
7. Extract `soldCount` from `meta_data` by finding key `_sold_count` (default: 0)
8. Resolve `badge` from `tags`: map tag slugs to badge union type using priority: sale > bestseller > new
9. Determine `badge = 'sale'` if `onSale === true` (regardless of tags)
10. Transform `images` array: map to `ProductImage`, set `isPrimary` on first item, fill missing alt text
11. Map `attributes` to `ProductAttribute[]`
12. Transform `variations` to `ProductVariation[]` via `VariationTransformer`

**Validation:** Before transformation, the raw input is parsed through `WCProductSchema` (Zod). If validation fails, throw `WooCommerceTransformError` with the product id and the failed fields.

---

### 10.2 VariationTransformer

**Input:** `WCProductVariation`  
**Output:** `ProductVariation`

**Responsibilities:**
1. Parse string prices to numbers
2. Extract `colorName` from attributes: find attribute where `name === 'pa_color'`, take `option` value
3. Resolve `colorHex` from MARTAL color configuration by matching `colorName` (case-insensitive)
4. Resolve `colorNameAr` from synonym map
5. Transform `image` (single WC image) to `ProductImage[]` (array of one)
6. Determine `inStock` from `stock_status`

**Fallback for missing colorHex:** If `colorName` is not found in the color config, use `#C9B9A8` (accent-stone from the design system) as fallback and log a warning to the server console for the admin to add the color mapping.

---

### 10.3 BrandTransformer

**Input:** `WCCategory` + `BrandConfig` (from `lib/constants/brands.ts`)  
**Output:** `Brand`

**Responsibilities:**
1. Merge WC category data with static brand configuration
2. Apply brand-specific tagline, description override (if brand config has one), heroBackgroundVariant
3. Build `seoTitle` and `seoDescription` from content templates
4. Transform category image to `ProductImage`

---

### 10.4 OrderTransformer (API route only)

**Input:** `CheckoutSubmission` + current cart prices from WooCommerce  
**Output:** `WCOrderCreatePayload`

**Responsibilities:**
1. Split `fullName` into `first_name` and `last_name`
2. Normalize Egyptian phone number to international format (+20...)
3. Map `governorate` display value to WooCommerce state code
4. Map `CartItem[]` to WC `line_items[]`
5. Add `meta_data` with source identifier

---

### 10.5 SearchTransformer

**Input:** `WCProduct[]` (search results from WooCommerce)  
**Output:** `SearchProductSuggestion[]`

**Responsibilities:**
1. Extract only the fields needed for suggestions (no full product transformation)
2. Take only the first image URL as thumbnail
3. Set `matchType` based on which field matched the search query

---

## 11. Validation Layer

All validations use Zod. This section defines the rules; implementation maps these rules to Zod schemas.

### 11.1 CheckoutFormSchema

| Field | Rules | Failure Message (Arabic) |
|---|---|---|
| `fullName` | Required, 2–100 chars, not pure whitespace | "الاسم يجب أن يكون حرفين على الأقل" |
| `phone` | Required, matches `/^01[0125][0-9]{8}$/` | "رقم الموبايل غير صحيح — يبدأ بـ 010 أو 011 أو 012 أو 015" |
| `governorate` | Required, must be in enum of 27 governorates | "اختاري محافظتك من القائمة" |
| `city` | Required, 2–100 chars | "المدينة مطلوبة" |
| `addressLine1` | Required, 5–200 chars | "العنوان يجب أن يكون 5 أحرف على الأقل" |
| `addressLine2` | Optional, max 100 chars | — |
| `notes` | Optional, max 500 chars | — |

**Phone validation notes:**
- Accept with or without leading zero: `01012345678` or `1012345678` — normalize both
- Do not accept country code prefix (+20) from user input — strip it if present
- Accepted prefixes: 010 (Vodafone), 011 (Etisalat), 012 (Orange), 015 (WE)

---

### 11.2 OrderRequestSchema (API route)

Applied server-side in `/api/orders`. Stricter version of the form schema — validates the complete submission payload.

| Field | Rules |
|---|---|
| `customer` | Full `CheckoutFormSchema` rules |
| `items` | Non-empty array, max 50 items |
| `items[n].productId` | Positive integer |
| `items[n].variationId` | Positive integer |
| `items[n].quantity` | Integer 1–10 |
| `items[n].price` | Positive number, max 10000 (EGP sanity check) |

---

### 11.3 ContactFormSchema

| Field | Rules | Failure Message |
|---|---|---|
| `name` | Required, 2–100 chars | "الاسم مطلوب" |
| `phone` | Required, same as checkout phone rules | "رقم الموبايل غير صحيح" |
| `subject` | Required, must be in subject enum | "اختاري موضوع الاستفسار" |
| `message` | Required, 10–2000 chars | "الرسالة يجب أن تكون 10 أحرف على الأقل" |

**Subject enum:** `'order_inquiry' \| 'product_question' \| 'shipping' \| 'return' \| 'other'`

---

### 11.4 WCProductSchema (runtime validation)

Applied in the transformer layer before transforming WC product responses. Not strict — uses `z.unknown()` for fields not used. Validates only the fields MARTAL relies on.

| Field | Rule |
|---|---|
| `id` | Positive integer |
| `name` | Non-empty string |
| `slug` | Non-empty string matching URL-safe pattern |
| `price` | String (may be empty) |
| `regular_price` | String (may be empty) |
| `images` | Array (may be empty) |
| `categories` | Array |
| `status` | Must be `'publish'` |

---

### 11.5 AddressSchema

Used when saving/editing an address in the Account tab.

| Field | Rules |
|---|---|
| `fullName` | Required, 2–100 chars |
| `phone` | Required, Egyptian mobile format |
| `governorate` | Required, governorate enum |
| `city` | Required, 2–100 chars |
| `addressLine1` | Required, 5–200 chars |
| `addressLine2` | Optional, max 100 chars |

---

### 11.6 SearchQuerySchema

Applied in the `/api/search` route handler to validate the query parameter.

| Field | Rules | Failure |
|---|---|---|
| `q` | String, 2–100 chars, not pure whitespace | Return 400 |
| `limit` | Optional integer 1–20, default 8 | Default to 8 |

---

## 12. localStorage Models

### 12.1 Storage Key Registry

| Key | Content | Max Size | Versioned |
|---|---|---|---|
| `martal_cart_v2` | `CartItem[]` + metadata | ~50KB | Yes (v2) |
| `martal_wishlist_v2` | `WishlistItem[]` | ~5KB | Yes (v2) |
| `martal_orders_v2` | `Order[]` (last 20) | ~500KB | Yes (v2) |
| `martal_address_v2` | `CustomerAddress` | ~1KB | Yes (v2) |
| `martal_recent_searches_v2` | `RecentSearch[]` (max 8) | ~1KB | Yes (v2) |
| `martal_recently_viewed_v2` | `RecentlyViewedItem[]` (max 20) | ~10KB | Yes (v2) |

**Version suffixes** (`_v2`) prevent data conflicts with any MARTAL 1.0 localStorage entries that might exist in a returning user's browser.

---

### 12.2 Cart Storage Model (`martal_cart_v2`)

```
CartStorage {
  version: 2                    // Schema version for migration
  items: CartItem[]             // As defined in §3.1
  updatedAt: number             // Unix timestamp of last modification
}
```

**TTL:** No automatic expiry. Cart persists until cleared by user action or checkout completion.

**Migration strategy:** If `version` is missing or is 1, the stored data is treated as a v1 cart (from MARTAL 1.0 if it exists). Migration function attempts to preserve items by extracting `productId`, `quantity`, and `price`. Fields not in the v1 schema (brand, colorName, colorHex) are set to fallback values. If migration fails, the stale cart is discarded and the user starts with an empty cart.

---

### 12.3 Wishlist Storage Model (`martal_wishlist_v2`)

```
WishlistStorage {
  version: 2
  slugs: string[]               // Product slugs only
  updatedAt: number
}
```

**TTL:** No expiry.

---

### 12.4 Orders Storage Model (`martal_orders_v2`)

```
OrdersStorage {
  version: 2
  orders: Order[]               // As defined in §6.1 — most recent first
  updatedAt: number
}
```

**Maximum entries:** 20 orders. When the 21st order is added, the oldest is evicted.

**Migration strategy:** v1 had no order history (checkout was not backed by a real backend). No migration needed — start fresh.

---

### 12.5 RecentlyViewed Storage Model (`martal_recently_viewed_v2`)

```
RecentlyViewedStorage {
  version: 2
  items: RecentlyViewedItem[]   // Most recently viewed first
  updatedAt: number
}
```

**RecentlyViewedItem:**

| Field | Type |
|---|---|
| `slug` | `string` |
| `name` | `string` |
| `brand` | `string` |
| `thumbnail` | `string` |
| `price` | `number` |
| `viewedAt` | `number` (Unix timestamp) |

**Maximum entries:** 20. Duplicate views (same slug) update `viewedAt` and move to front. The current product's slug is excluded from the RecentlyViewed display on its own PDP.

---

## 13. State Store Contracts

### 13.1 CartStore

**State:**

| Field | Type | Initial Value |
|---|---|---|
| `items` | `CartItem[]` | `[]` |
| `_updatedAt` | `number` | `0` |

**Actions:**

| Action | Parameters | Behavior |
|---|---|---|
| `addItem` | `item: Omit<CartItem, 'quantity' \| 'addedAt'>`, `quantity?: number` | If variation already in cart: increment quantity (max 10). If new: append. Update `_updatedAt`. |
| `removeItem` | `productId: number, variationId: number` | Remove matching item. Update `_updatedAt`. |
| `updateQuantity` | `productId: number, variationId: number, quantity: number` | Clamp quantity to 1–10. Update. |
| `clearCart` | — | Set `items = []`. Called after successful checkout. |
| `syncPrices` | `updates: Array<{ variationId: number, price: number }>` | Update prices from fresh WC data. Called on checkout page mount. |

**Selectors (computed):**

| Selector | Returns | Formula |
|---|---|---|
| `itemCount()` | `number` | `sum(item.quantity)` |
| `subtotal()` | `number` | `sum(item.price * item.quantity)` |
| `hasItem(productId, variationId)` | `boolean` | Item existence check |
| `getItem(productId, variationId)` | `CartItem \| undefined` | Item lookup |

---

### 13.2 WishlistStore

**State:**

| Field | Type | Initial Value |
|---|---|---|
| `items` | `WishlistItem[]` | `[]` |

**Actions:**

| Action | Parameters | Behavior |
|---|---|---|
| `toggle` | `slug: string` | If slug exists: remove. If not: append with `addedAt`. |
| `clear` | — | Set `items = []`. |

**Selectors:**

| Selector | Returns |
|---|---|
| `has(slug)` | `boolean` |
| `count()` | `number` |
| `slugs()` | `string[]` |

---

### 13.3 UIStore

**State:**

| Field | Type | Initial Value |
|---|---|---|
| `searchOpen` | `boolean` | `false` |
| `cartDrawerOpen` | `boolean` | `false` |
| `filterDrawerOpen` | `boolean` | `false` |
| `quickViewProduct` | `Product \| null` | `null` |
| `recentlyViewed` | `RecentlyViewedItem[]` | From localStorage |

**Actions:**

| Action | Parameters | Behavior |
|---|---|---|
| `openSearch` | — | Set `searchOpen = true` |
| `closeSearch` | — | Set `searchOpen = false` |
| `openCartDrawer` | — | Set `cartDrawerOpen = true` |
| `closeCartDrawer` | — | Set `cartDrawerOpen = false` |
| `openFilterDrawer` | — | Set `filterDrawerOpen = true` |
| `closeFilterDrawer` | — | Set `filterDrawerOpen = false` |
| `openQuickView` | `product: Product` | Set `quickViewProduct = product` |
| `closeQuickView` | — | Set `quickViewProduct = null` |
| `addToRecentlyViewed` | `item: RecentlyViewedItem` | Prepend, deduplicate, max 20 |

**UIStore is never persisted** — all state resets on page load. `recentlyViewed` is an exception: it is initialized from localStorage on store creation.

---

## 14. TanStack Query Models

TanStack Query wraps all client-side data fetching. Each query has a stable `queryKey` and a typed `data` return.

### 14.1 Query Key Conventions

All query keys are arrays. Hierarchical structure enables targeted cache invalidation.

| Query | Query Key | Description |
|---|---|---|
| Products list | `['products', filters]` | Shop page product list |
| Single product | `['product', slug]` | PDP data |
| Product variations | `['variations', productId]` | Color variants for PDP |
| Brand | `['brand', slug]` | Brand page data |
| Brands list | `['brands']` | All brands |
| Search suggestions | `['search', 'suggestions', query]` | Overlay suggestions |
| Search results | `['search', 'results', query, page]` | Full search page |
| Wishlist products | `['wishlist-products', slugs]` | Product data for wishlisted slugs |
| Related products | `['related', productId]` | PDP related products |

---

### 14.2 ProductQueryResult

Returned by `useQuery(['product', slug])`:

| Field | Type |
|---|---|
| `data` | `Product \| undefined` |
| `isLoading` | `boolean` |
| `isError` | `boolean` |
| `error` | `APIError \| null` |

---

### 14.3 ProductsQueryResult

Returned by `useQuery(['products', filters])`:

| Field | Type |
|---|---|
| `data.products` | `Product[]` |
| `data.totalCount` | `number` |
| `data.totalPages` | `number` |
| `data.hasMore` | `boolean` |
| `isLoading` | `boolean` |
| `isFetching` | `boolean` (background refetch) |
| `isError` | `boolean` |

---

### 14.4 SearchSuggestionsQueryResult

Returned by `useQuery(['search', 'suggestions', query])`:

| Field | Type |
|---|---|
| `data` | `SearchSuggestionsResponse \| undefined` |
| `isLoading` | `boolean` |
| `isError` | `boolean` |

Query is **disabled** when `query.length < 2`. The hook checks this condition before enabling the query.

---

## 15. SEO Models

### 15.1 PageMetadata

The base SEO model for all pages. Maps to Next.js `Metadata` type.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | `string` | Yes | Arabic-first, includes brand name |
| `description` | `string` | Yes | 120–160 characters |
| `canonical` | `string` | Yes | Absolute URL |
| `robots` | `RobotsDirective` | Yes | `index, follow` for public pages; `noindex` for cart/checkout/account |
| `openGraph` | `OpenGraphData` | Yes | Required for social sharing |
| `alternates.canonical` | `string` | Yes | Duplicate of canonical for clarity |

---

### 15.2 OpenGraphData

| Field | Type | Required |
|---|---|---|
| `title` | `string` | Yes |
| `description` | `string` | Yes |
| `url` | `string` | Yes |
| `type` | `'website' \| 'product'` | Yes |
| `locale` | `'ar_EG'` | Yes |
| `siteName` | `'MARTAL'` | Yes |
| `images` | `OGImage[]` | Yes (at least one) |

**OGImage:**

| Field | Type | Recommended Value |
|---|---|---|
| `url` | `string` | Product image or page-specific image |
| `width` | `number` | 1200 |
| `height` | `number` | 630 |
| `alt` | `string` | Arabic description of the image |

---

### 15.3 ProductStructuredData (JSON-LD)

The schema.org `Product` type as used on PDPs:

| Property | Value Source |
|---|---|
| `@type` | `"Product"` |
| `name` | `Product.name` |
| `brand.name` | `Product.brand` |
| `description` | `Product.description` (HTML stripped) |
| `image` | `Product.images[0].url` |
| `sku` | `ProductVariation.sku` |
| `offers.@type` | `"Offer"` |
| `offers.price` | `Product.price.toString()` |
| `offers.priceCurrency` | `"EGP"` |
| `offers.availability` | `Product.inStock ? "InStock" : "OutOfStock"` |
| `aggregateRating.ratingValue` | `Product.rating.toString()` |
| `aggregateRating.reviewCount` | `Product.reviewCount.toString()` |

---

### 15.4 BreadcrumbStructuredData

The schema.org `BreadcrumbList` type:

| Property | Value |
|---|---|
| `@type` | `"BreadcrumbList"` |
| `itemListElement[0].name` | `"MARTAL"` |
| `itemListElement[0].item` | `"https://martal.store"` |
| `itemListElement[1].name` | Depends on page (e.g., brand name, "المتجر") |
| `itemListElement[1].item` | Depends on page |
| `itemListElement[2].name` | Product name (PDP only) |
| `itemListElement[2].item` | Product URL |

---

## 16. Error Models

### 16.1 Error Type Hierarchy

```
ApplicationError (base)
├── APIError
│   ├── WooCommerceError
│   ├── RateLimitError
│   └── NetworkError
├── ValidationError
│   └── FormValidationError
├── CheckoutError
│   ├── OrderCreationError
│   └── CartStalenessError
└── SearchError
```

---

### 16.2 APIError

| Field | Type | Required | Notes |
|---|---|---|---|
| `type` | `'api_error'` | Yes | Discriminant |
| `status` | `number` | Yes | HTTP status code |
| `message` | `string` | Yes | User-facing Arabic message |
| `code` | `string \| null` | No | Internal error code |
| `endpoint` | `string` | Yes | Which endpoint failed (for logging) |
| `retryable` | `boolean` | Yes | Whether the caller should retry |

---

### 16.3 ValidationError

| Field | Type | Notes |
|---|---|---|
| `type` | `'validation_error'` | Discriminant |
| `message` | `string` | General Arabic error message |
| `fields` | `Record<string, string>` | Field name → Arabic error message |

---

### 16.4 CheckoutError

| Field | Type | Notes |
|---|---|---|
| `type` | `'checkout_error'` | Discriminant |
| `subtype` | `'order_creation' \| 'cart_stale' \| 'network'` | Specific failure mode |
| `message` | `string` | Arabic user-facing message |
| `whatsappFallback` | `string` | Pre-built WhatsApp URL (always populated) |
| `retainCart` | `boolean` | Whether cart should be preserved (always `true` for checkout errors) |

---

### 16.5 CartStalenessError

Triggered when checkout page detects that a cart item's stored price differs from the current WooCommerce price by more than 5%.

| Field | Type | Notes |
|---|---|---|
| `type` | `'cart_staleness'` | Discriminant |
| `staleItems` | `Array<{ slug, storedPrice, currentPrice }>` | Items that changed |
| `message` | `string` | Arabic: "تغيرت أسعار بعض المنتجات في سلتك" |

---

## 17. Security & Privacy Models

### 17.1 PII Fields Inventory

Personally Identifiable Information in MARTAL 2.0:

| Field | Stored In | Classification | Retention |
|---|---|---|---|
| `fullName` | localStorage (order history) | PII | Until user clears browser storage |
| `phone` | localStorage (order history, address) | PII + contact | Until user clears browser storage |
| `address` | localStorage (address) | PII | Until user clears browser storage |
| `governorate` | localStorage (address) | PII | Until user clears browser storage |
| `orderHistory` | localStorage (orders) | PII | Until user clears browser storage |

**PII stored in WooCommerce:**

| Field | Location | Controlled By |
|---|---|---|
| `billing.first_name` | WooCommerce order | WooCommerce admin |
| `billing.last_name` | WooCommerce order | WooCommerce admin |
| `billing.phone` | WooCommerce order | WooCommerce admin |
| `billing.address` | WooCommerce order | WooCommerce admin |

---

### 17.2 Safe-to-Store Fields

These fields can be stored in localStorage without privacy concern:

- Product slugs (wishlist)
- Product names, prices, images (cart snapshots — public data)
- Search queries (recent searches)
- Order numbers (non-PII references)
- Recently viewed product slugs

---

### 17.3 Never-Store Fields

These fields must never be stored in localStorage or included in client-side logs:

- WooCommerce API credentials (consumer key, consumer secret)
- Full credit card data (not applicable in v2.0 — COD only)
- IP addresses
- Browser fingerprints
- Passwords (not applicable in v2.0)

---

### 17.4 Serialization Rules

When serializing models to localStorage:

1. **Strip internal fields** before storage: `_updatedAt` management fields, hydration metadata
2. **Never serialize functions** — Zustand selectors and computed values are never stored
3. **Always include a version field** in stored objects to enable future migration
4. **Never store raw WC DTOs** — only Application Models are serialized
5. **Sanitize before log output** — if any model is logged for debugging, strip all PII fields first

---

### 17.5 API Route Data Handling

In all API routes:

- Input: validated via Zod before any processing
- PII in request body: never logged in production
- WooCommerce credentials: accessed only from `process.env` inside `server-only` modules
- Response: never echoes back raw WC data — always returns transformed Application or UI models
- Error responses: never include WooCommerce error details — return a generic error message to the client and log the WC error server-side

---

## 18. Data Lifecycle Diagrams

### 18.1 Product Data Lifecycle

```
WooCommerce Database
        ↓ REST API (authenticated server-side call)
WCProduct DTO (raw JSON)
        ↓ WCProductSchema.safeParse()
Validated WC DTO
        ↓ ProductTransformer.transform()
Product (Application Model)
        ↓ Next.js ISR cache (revalidate: 300s for PDP)
Cached Product
        ↓ Passed as props to Server Components
ProductInfoPanel renders server-side HTML (name, specs, price, trust)
        ↓ Passed as props to Client Components on hydration
ProductGallery (image display)
ColorSwatches (interactive selection)
AddToCartButton (accesses CartStore)
```

**Cache invalidation path:**
```
Admin updates product in WooCommerce
        ↓ WooCommerce webhook fires POST /api/revalidate
API route validates REVALIDATION_SECRET
        ↓ Calls revalidatePath('/product/[slug]')
Next.js marks ISR cache as stale
        ↓ Next request triggers regeneration
Fresh product data served
```

---

### 18.2 Cart Lifecycle

```
User selects color swatch on PDP
        ↓
User taps "أضيفي للسلة" (AddToCartButton)
        ↓
CartStore.addItem({
  productId, variationId, slug, name, brand,
  colorName, colorHex, image, price
}, quantity)
        ↓
Zustand updates items array
        ↓
Persist middleware serializes to localStorage:martal_cart_v2
        ↓
UIStore.openCartDrawer() dispatched
        ↓
CartDrawer renders from CartStore.items
FreeShippingProgress renders from CartStore.subtotal()

--- Later, on /checkout ---

CheckoutPage mounts
        ↓
CartValidationEffect runs:
  - Fetches current prices for all productId/variationId pairs
  - Compares with stored CartItem.price
  - If delta > 5%: displays CartStalenessWarning
        ↓
User submits form
        ↓
POST /api/orders { customer, items }
        ↓ (on success)
CartStore.clearCart()
Order saved to localStorage:martal_orders_v2
Navigate to /order-success
```

---

### 18.3 Order Lifecycle

```
User taps "تأكيدي الطلب" on /checkout
        ↓
React Hook Form validates all fields (Zod)
        ↓ (if valid)
POST /api/orders (server-side API route)
        ↓
API route: Zod validates OrderRequestSchema
        ↓ (if valid)
OrderTransformer builds WCOrderCreatePayload
        ↓
lib/woocommerce/orders.createOrder(payload)
        ↓
WooCommerce REST API: POST /wp-json/wc/v3/orders
        ↓ (on success)
WooCommerce returns: { id: 1042, number: "ORD-1042", status: "processing" }
        ↓
API route returns: { orderId: 1042, orderNumber: "ORD-1042" }
        ↓ (client receives success)
Build Order object from CheckoutFormData + CartItems + CheckoutResult
Prepend to localStorage:martal_orders_v2
CartStore.clearCart()
Navigate to /order-success?id=1042&number=ORD-1042
        ↓
OrderSuccessPage renders from URL params
WhatsApp tracking link generated
```

---

## 19. Future Data Models (v2.1+)

These models are defined here to ensure today's architecture does not create obstacles for their implementation. No implementation is required in v2.0.

### 19.1 Review (v2.1)

| Field | Type | Notes |
|---|---|---|
| `id` | `number` | WC review ID |
| `productId` | `number` | Parent product |
| `productVariationId` | `number \| null` | Which color was reviewed |
| `authorId` | `number \| null` | WC customer ID (authenticated v2.1) |
| `authorName` | `string` | Display name |
| `authorGovernorate` | `string \| null` | For social proof |
| `rating` | `1 \| 2 \| 3 \| 4 \| 5` | |
| `body` | `string` | Review text |
| `images` | `string[]` | Customer photo URLs |
| `verified` | `boolean` | Confirmed purchase |
| `date` | `string` | ISO date |

**Review creation payload:**

| Field | Source |
|---|---|
| `product_id` | From PDP context |
| `reviewer` | From authenticated customer name |
| `reviewer_email` | From authenticated customer email |
| `review` | Form input |
| `rating` | Form input |

---

### 19.2 DiscountCode (v2.1)

| Field | Type | Notes |
|---|---|---|
| `code` | `string` | Coupon code string |
| `type` | `'percent' \| 'fixed_cart' \| 'fixed_product'` | WC coupon type |
| `amount` | `number` | Discount amount |
| `description` | `string` | Display text |
| `minimumAmount` | `number \| null` | Min cart value |
| `usageCount` | `number` | How many times applied |
| `usageLimit` | `number \| null` | Max uses |
| `expiry` | `string \| null` | Expiry date |

**CartWithCoupon (v2.1 extension of Cart §3.2):**

Adds: `coupon: AppliedCoupon | null`, `discountAmount: number`, `totalAfterDiscount: number`

---

### 19.3 LoyaltyPoints (v2.1)

Not part of WooCommerce core — requires a WooCommerce points plugin.

| Field | Type |
|---|---|
| `customerId` | `number` |
| `balance` | `number` |
| `earnRate` | `number` (points per EGP spent) |
| `redeemRate` | `number` (EGP per point) |
| `history` | `PointsTransaction[]` |

---

### 19.4 SavedPaymentMethod (v2.1)

| Field | Type |
|---|---|
| `id` | `string` |
| `gateway` | `'paymob' \| 'fawry'` |
| `last4` | `string` |
| `expiryMonth` | `number` |
| `expiryYear` | `number` |
| `isDefault` | `boolean` |

**Security note:** Actual card data is never stored by MARTAL — only the token reference returned by the payment gateway.

---

### 19.5 AIRecommendation (v3.0)

A speculative model for a future recommendation engine:

| Field | Type |
|---|---|
| `productSlug` | `string` |
| `score` | `number` (0–1) |
| `reason` | `'similar_color' \| 'same_brand' \| 'trending' \| 'collaborative'` |
| `sourceProductSlug` | `string \| null` (if reason = 'similar_color') |

---

## 20. Data Governance Rules

These 22 rules are the data contracts for all engineers on MARTAL 2.0. They are enforceable via code review.

**G-01: UI components never consume WC DTOs.** A component prop of type `WCProduct` or any `WC*` type is a defect. Every component receives Application Model types (`Product`, `Brand`, `Order`) or UI Model types (`CartItem`, `SearchProductSuggestion`).

**G-02: Transformers are pure functions.** A transformer that performs an API call, writes to a store, or has any side effect is a defect. Transformers take data in and return data out, deterministically.

**G-03: Every WooCommerce API response is validated at runtime before transformation.** Zod schema parse precedes transformer call. A failing parse throws a typed error and prevents malformed data from propagating.

**G-04: Price fields are always numbers in Application Models.** WooCommerce returns prices as strings. The transformer is the only place string prices exist. After transformation, no price field in any Application Model, UI Model, or store is a string.

**G-05: `null` is used for absent optional values, never `undefined`.** Application Models use `field: string | null`, not `field?: string`. This makes null-checking consistent and eliminates the `undefined` / `missing key` ambiguity.

**G-06: The color hex mapping lives in exactly one place.** `lib/constants/colors.ts` is the single source. The transformer, the UI, and the filter system all read from this file. A color hex defined in the component is a defect.

**G-07: localStorage keys are registered in one file.** All keys are exported from `lib/constants/storage.ts`. A hardcoded localStorage key string in a component or hook is a defect.

**G-08: Every localStorage model has a `version` field.** This enables future migration without data loss. A stored object without a version field cannot be safely migrated.

**G-09: CartItem carries price at time of addition, not a live price.** The cart is a snapshot. `CartStore.syncPrices()` is the only mechanism for updating CartItem prices, and it is called explicitly — never implicitly.

**G-10: Wishlist stores slugs only.** Full product objects are never stored in the wishlist. Product data for wishlisted items is always fetched fresh on demand.

**G-11: The governorate list is a typed enum.** An unvalidated governorate string reaching the WooCommerce order payload is a fulfillment risk. The Zod schema validates against the typed enum before any order is submitted.

**G-12: API routes never return WC DTOs.** `/api/orders` returns `{ orderId, orderNumber }`, not the full WooCommerce order object. `/api/search` returns `SearchSuggestionsResponse`, not raw WC product objects. The API layer transforms before responding.

**G-13: Phone numbers are normalized before storage.** The transformer normalizes Egyptian phone numbers to a consistent format before storing in any model. Inconsistent phone format in order records is an operations problem.

**G-14: The `badge` field resolves by priority: sale > bestseller > new.** A product on sale always shows the sale badge, regardless of whether it is also a bestseller. This priority is enforced in the transformer, not in the component.

**G-15: `CartStore.clearCart()` is called only after confirmed order success.** It is never called on navigation, timeout, or partial state. Premature cart clearing that prevents checkout error recovery is a critical failure.

**G-16: Search queries under 2 characters do not trigger API calls.** The TanStack Query `enabled` flag is `false` when `query.length < 2`. A search API call with a single character is a performance and rate-limit problem.

**G-17: Recently viewed does not include the currently viewed product.** When adding to recently viewed on PDP mount, check that the product's slug is not the current route's slug. The RecentlyViewed component also filters the current product from its display.

**G-18: `_updatedAt` timestamps use Unix milliseconds (not seconds).** All timestamps in stored models use `Date.now()` (milliseconds). No model mixes epoch second and epoch millisecond timestamps.

**G-19: The `source` meta field is always included in WooCommerce order creation.** Every order submitted by the MARTAL 2.0 frontend includes `meta_data: [{ key: 'source', value: 'martal-2.0-web' }]`. This enables distinguishing web orders from future mobile app orders in the WooCommerce admin.

**G-20: Error responses from API routes never expose WooCommerce internals.** A WooCommerce error message or stack trace that reaches the browser is a security and UX failure. API routes catch WooCommerce errors, log them server-side, and return a sanitized Arabic error message to the client.

**G-21: Structured data (JSON-LD) is rendered server-side.** Schema.org markup generated client-side after hydration is not indexed by Google. All JSON-LD is produced in server components or in `generateMetadata`.

**G-22: Every persisted model is writable in one place only.** `CartStore` writes to `martal_cart_v2`. Nothing else does. `CheckoutForm` writes to `martal_orders_v2` via a single hook call. The single-writer rule makes debugging storage state deterministic.

---

*This document is the complete data specification for MARTAL 2.0. Every field in every model is defined here. Every transformation is described here. Every validation rule is specified here. Code that introduces a data structure not defined in this document, or implements a transformation that differs from the specification here, requires a documented update to this document before merge.*

*Document Owner: Data Architecture*  
*Last Updated: June 2026*  
*Next: 09_IMPLEMENTATION_PLAN.md — Sprint breakdown, task sequencing, development milestones, and launch readiness checklist*
