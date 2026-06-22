# 10 — API CONTRACTS
## MARTAL 2.0: Communication Boundaries & API Reference

**Document Type:** API Contract Specification  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Pre-Development — Authoritative API Reference  
**Prepared by:** API Engineering  
**Reads after:** 06_ARCHITECTURE.md, 08_DATA_MODEL.md  
**Audience:** Frontend Engineers, Integration Engineers

> **Relationship to other documents.** The Data Model (08) defines *what data looks like*. The Architecture (06) defines *how systems are structured*. This document defines *how systems communicate* — the exact shapes of requests, responses, and errors that cross every boundary in MARTAL 2.0. Data models are referenced by name here, not redefined. When this document says `CartItem`, it means the model specified in 08_DATA_MODEL.md §3.1.

> **Scope.** Four communication boundaries are documented: (1) Browser → Next.js API Routes, (2) Next.js API Routes → WooCommerce REST API, (3) React Query hooks → API routes, and (4) Internal store/persistence contracts (Zustand + localStorage). WooCommerce's full API is not reproduced here — only the MARTAL-specific consumption contract.

---

## Table of Contents

1. [Communication Architecture Overview](#1-communication-architecture-overview)
2. [API Layer Standards](#2-api-layer-standards)
3. [Request & Response Envelope Standards](#3-request--response-envelope-standards)
4. [Product Endpoints](#4-product-endpoints)
5. [Brand Endpoints](#5-brand-endpoints)
6. [Search Endpoints](#6-search-endpoints)
7. [Checkout Endpoints](#7-checkout-endpoints)
8. [Contact Endpoints](#8-contact-endpoints)
9. [Revalidation Endpoints](#9-revalidation-endpoints)
10. [Health Endpoints](#10-health-endpoints)
11. [Cart Store Contracts](#11-cart-store-contracts)
12. [Wishlist Store Contracts](#12-wishlist-store-contracts)
13. [UI Store Contracts](#13-ui-store-contracts)
14. [localStorage Persistence Contracts](#14-localstorage-persistence-contracts)
15. [React Query Contracts](#15-react-query-contracts)
16. [WooCommerce Integration Contracts](#16-woocommerce-integration-contracts)
17. [Transformer Contracts](#17-transformer-contracts)
18. [Error Contracts](#18-error-contracts)
19. [Contract Testing Strategy](#19-contract-testing-strategy)
20. [Governance Rules](#20-governance-rules)

---

## 1. Communication Architecture Overview

### 1.1 Boundary Map

Every data flow in MARTAL 2.0 crosses one or more of these boundaries. Each boundary has an owner, a contract shape, and an error strategy.

```
┌──────────────────────────────────────────────────────────────────────┐
│  BROWSER (React Client)                                              │
│                                                                      │
│  Zustand Stores ←→ Components ←→ React Query ←→ localStorage        │
└──────────────┬───────────────────────────────────────────────────────┘
               │
               │  BOUNDARY A: Browser → Next.js API Routes
               │  Protocol: HTTPS, JSON
               │  Auth: None (public) | REVALIDATION_SECRET (webhook)
               │  Owns: Input validation, rate limiting, error masking
               ↓
┌──────────────────────────────────────────────────────────────────────┐
│  NEXT.JS API ROUTES (Server)                                         │
│                                                                      │
│  /api/search  /api/orders  /api/contact  /api/revalidate  /api/health│
└──────────────┬───────────────────────────────────────────────────────┘
               │
               │  BOUNDARY B: Next.js → WooCommerce REST API
               │  Protocol: HTTPS, JSON
               │  Auth: Basic Auth (consumer key:secret, Base64)
               │  Owns: Credential management, transformation, retry
               ↓
┌──────────────────────────────────────────────────────────────────────┐
│  WOOCOMMERCE REST API                                                │
│  https://admin.martal.store/wp-json/wc/v3/                           │
│                                                                      │
│  /products  /products/{id}/variations  /orders  /products/categories │
└──────────────────────────────────────────────────────────────────────┘

INTERNAL BOUNDARIES (client-side only):

Boundary C: Components → Zustand Stores
  Store action calls (addItem, toggle, openSearch, etc.)

Boundary D: Zustand persist middleware → localStorage
  Serialization / deserialization of store state

Boundary E: Components → React Query
  useQuery / useMutation hook calls → /api/* routes
```

### 1.2 Boundary Ownership

| Boundary | Owner | Contract Type |
|---|---|---|
| A (Browser → API) | API Route handlers | HTTP request/response JSON |
| B (API → WooCommerce) | `lib/woocommerce/` integration layer | HTTP + transformer functions |
| C (Components → Stores) | Zustand store definitions | TypeScript function signatures |
| D (Stores → localStorage) | Zustand persist middleware | Serialized JSON with version field |
| E (Components → React Query) | `src/hooks/` + TanStack Query | Hook return type contracts |

### 1.3 Versioning Policy

MARTAL 2.0 API routes are **not versioned** (`/api/search`, not `/api/v1/search`). Rationale: all consumers are the Next.js frontend, deployed atomically with the API on Vercel. Breaking changes to API contracts require coordinated frontend + API changes in the same deployment — versioning adds no value for this topology.

**Exception trigger (Governance Rule G-01):** If MARTAL introduces a mobile app, a third-party integration, or any consumer that cannot be deployed atomically with the API, versioning becomes mandatory and `/api/v1/` routes are introduced before any breaking changes are made.

---

## 2. API Layer Standards

### 2.1 Route Handler Structure

Every API route handler follows this structure in order, without exception:

```
1. Method check (reject wrong HTTP methods with 405)
2. Rate limit check (reject over-limit with 429)
3. Input parsing (read body/params)
4. Zod validation (reject invalid with 400 + field errors)
5. Business logic execution (call integration layer)
6. Success response (200/201 with typed body)

Error path (any step can throw):
  → Catch typed error
  → Log server-side (Sentry + console.error)
  → Return sanitized Arabic error response
  → Never expose WooCommerce internals or stack traces
```

### 2.2 HTTP Method Conventions

| Method | Usage | Idempotent |
|---|---|---|
| `GET` | Read data (products, search, health) | Yes |
| `POST` | Create resources or trigger actions (orders, contact, revalidate) | No |

No `PUT`, `PATCH`, or `DELETE` routes exist in v2.0. Mutations happen through dedicated POST endpoints.

### 2.3 Content-Type Requirements

- All requests with a body: `Content-Type: application/json`
- All responses: `Content-Type: application/json`
- No form-encoded or multipart bodies in v2.0

### 2.4 Response Status Codes

| Status | Meaning | Used For |
|---|---|---|
| `200` | Success | GET responses, successful POSTs that return data |
| `201` | Created | Order creation (POST /api/orders) |
| `400` | Bad Request | Zod validation failure, malformed JSON |
| `401` | Unauthorized | Invalid revalidation secret |
| `405` | Method Not Allowed | Wrong HTTP method on a route |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | WooCommerce unavailable, unhandled exception |
| `503` | Service Unavailable | WooCommerce connection timeout |

---

## 3. Request & Response Envelope Standards

### 3.1 Success Envelope

All successful responses return the data directly — no wrapper envelope:

```json
// ✅ Correct: data returned directly
{
  "orderId": 1042,
  "orderNumber": "ORD-1042",
  "status": "processing"
}

// ❌ Incorrect: unnecessary wrapper
{
  "success": true,
  "data": {
    "orderId": 1042
  }
}
```

**Rationale:** Wrapper envelopes add parsing boilerplate for no benefit when the HTTP status code already communicates success or failure.

### 3.2 Error Envelope

All error responses use a consistent structure:

```json
{
  "error": {
    "type": "validation_error",
    "message": "تحقق من البيانات المدخلة وحاولي مرة أخرى",
    "fields": {
      "phone": "رقم الموبايل غير صحيح — يبدأ بـ 010 أو 011 أو 012 أو 015",
      "governorate": "اختاري محافظتك من القائمة"
    }
  }
}
```

The `fields` property is present only for `validation_error` type. See §18 for complete error type definitions.

### 3.3 Pagination Envelope

Paginated list responses (products, search results) include pagination metadata:

```json
{
  "products": [...],
  "pagination": {
    "page": 1,
    "perPage": 12,
    "totalCount": 47,
    "totalPages": 4,
    "hasNextPage": true
  }
}
```

Pagination metadata is sourced from WooCommerce response headers:
- `totalCount` ← `X-WP-Total` header
- `totalPages` ← `X-WP-TotalPages` header

---

## 4. Product Endpoints

Product data is fetched directly by Next.js Server Components using the integration layer — there are **no `/api/products/*` routes**. Products are fetched server-side, cached via ISR, and passed as props to components.

### 4.1 Integration Layer: `getProducts(params)`

**Called by:** Server Components (shop page, homepage bestsellers, brand pages)  
**Layer:** B (Next.js → WooCommerce)  
**File:** `src/lib/woocommerce/products.ts`

**WooCommerce endpoint consumed:**
```
GET https://admin.martal.store/wp-json/wc/v3/products
```

**Parameters MARTAL sends:**

| Param | Type | Default | Maps From |
|---|---|---|---|
| `per_page` | `number` | `12` | `PaginationState.perPage` |
| `page` | `number` | `1` | `PaginationState.currentPage` |
| `orderby` | `string` | `'popularity'` | `SortOption` mapping (see §17) |
| `order` | `'asc' \| 'desc'` | `'desc'` | Derived from `SortOption` |
| `category` | `string` | `undefined` | Brand slug (e.g., `'hypnose'`) |
| `attribute` | `string` | `undefined` | `'pa_color'` (when color filter active) |
| `attribute_term` | `string` | `undefined` | Color slug (e.g., `'brown'`) |
| `min_price` | `string` | `undefined` | `ShopFilters.minPrice` |
| `max_price` | `string` | `undefined` | `ShopFilters.maxPrice` |
| `tag` | `string` | `undefined` | Flag slug (`'bestseller'`, `'new'`) |
| `on_sale` | `boolean` | `undefined` | When `flag === 'sale'` |
| `status` | `'publish'` | `'publish'` | Always — only published products |

**Parameters MARTAL ignores from WooCommerce response:**
`permalink`, `date_modified`, `weight`, `dimensions`, `shipping_class`, `purchase_note`, `menu_order`, `related_ids`, `upsell_ids`, `cross_sell_ids`, `parent_id`

**Cache behavior:** `{ next: { revalidate: 0 } }` for SSR shop pages (URL params make each request unique). `{ next: { revalidate: 1800 } }` for bestsellers (homepage, brand hero).

**Response headers consumed:**
- `X-WP-Total` → `pagination.totalCount`
- `X-WP-TotalPages` → `pagination.totalPages`

**Example response shape (post-transformation):**

```json
{
  "products": [
    {
      "id": 124,
      "slug": "hypnose-brown",
      "name": "Hypnose Brown",
      "brand": "Hypnose",
      "brandSlug": "hypnose",
      "subtitle": "عدسة شهرية طبيعية للاستخدام اليومي",
      "price": 450,
      "regularPrice": 500,
      "salePrice": 450,
      "onSale": true,
      "discountPercent": 10,
      "inStock": true,
      "stockStatus": "instock",
      "rating": 4.8,
      "reviewCount": 124,
      "soldCount": 831,
      "badge": "sale",
      "images": [
        {
          "id": 201,
          "url": "https://admin.martal.store/wp-content/uploads/hypnose-brown-1.jpg",
          "alt": "Hypnose Brown عدسة ملونة كورية — MARTAL",
          "isPrimary": true
        }
      ],
      "variations": []
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 12,
    "totalCount": 23,
    "totalPages": 2,
    "hasNextPage": true
  }
}
```

**Note:** `variations` is an empty array in list responses — variation data requires a separate call and is fetched only on the PDP.

---

### 4.2 Integration Layer: `getProduct(slug)`

**Called by:** PDP Server Component (`app/(shop)/product/[slug]/page.tsx`)  
**Cache behavior:** `{ next: { revalidate: 300 } }` — 5-minute ISR

**WooCommerce endpoint consumed:**
```
GET https://admin.martal.store/wp-json/wc/v3/products?slug={slug}&status=publish
```

Takes the first result from the array response (WooCommerce returns an array even for slug queries).

**On not found:** WooCommerce returns `[]`. The function throws `ProductNotFoundError(slug)`, which Next.js catches and renders the `not-found.tsx` page.

---

### 4.3 Integration Layer: `getProductVariations(productId)`

**Called by:** PDP Server Component, fetched in parallel with `getProduct()`  
**Cache behavior:** `{ next: { revalidate: 300 } }` — same as product

**WooCommerce endpoint consumed:**
```
GET https://admin.martal.store/wp-json/wc/v3/products/{id}/variations?per_page=100
```

`per_page: 100` is intentional — MARTAL products will never have more than 20 color variants, but fetching all in one call avoids pagination on this secondary request.

**Required WooCommerce variation fields:**

| WC Field | Required | Notes |
|---|---|---|
| `id` | Yes | Variation ID for cart/order |
| `price` | Yes | String — transformer parses to number |
| `regular_price` | Yes | String |
| `sale_price` | Yes | String (empty string when not on sale → null) |
| `on_sale` | Yes | Boolean |
| `stock_status` | Yes | `'instock' \| 'outofstock' \| 'onbackorder'` |
| `image` | Yes | Single image object (not array) |
| `attributes` | Yes | Must include `pa_color` attribute with option value |
| `sku` | No | Stored but not displayed in v2.0 |

---

### 4.4 Integration Layer: `getBestsellers(limit)`

**Called by:** Homepage Server Component  
**Cache behavior:** `{ next: { revalidate: 1800 } }` — 30-minute cache

**WooCommerce endpoint consumed:**
```
GET https://admin.martal.store/wp-json/wc/v3/products
  ?orderby=popularity&order=desc&per_page={limit}&status=publish
```

Returns transformed `Product[]`. Does not fetch variations (list context).

---

### 4.5 Integration Layer: `getRelatedProducts(productId, limit?)`

**Called by:** PDP RelatedProducts Server Component  
**Cache behavior:** `{ next: { revalidate: 3600 } }` — 1-hour cache  
**Default limit:** 4

**WooCommerce endpoint consumed:**
```
GET https://admin.martal.store/wp-json/wc/v3/products
  ?category={brandSlug}&exclude={productId}&per_page={limit}&status=publish
```

Fetches products in the same brand category, excluding the current product.

---

## 5. Brand Endpoints

Like products, brand data is fetched by Server Components through the integration layer. No `/api/brands/*` routes exist.

### 5.1 Integration Layer: `getBrands()`

**Called by:** Homepage BrandShowcase, Brand page RelatedBrands  
**Cache behavior:** `{ next: { revalidate: 86400 } }` — 24-hour cache

**WooCommerce endpoint consumed:**
```
GET https://admin.martal.store/wp-json/wc/v3/products/categories
  ?slug=hypnose,labella,fxeyes,elamore,iconic&per_page=10
```

The slug list is from `BRAND_SLUGS` constant in `src/lib/constants/brands.ts`.

**Merge with static brand config:**
WooCommerce categories provide: `id`, `slug`, `name`, `count`, `description`, `image`.  
The static brand config (`lib/constants/brands.ts`) provides: `tagline`, `heroBackgroundVariant`, `seoIntro`, `seoTitle`, `seoDescription`.

The `BrandTransformer` merges both sources into a `Brand` model (08_DATA_MODEL.md §2.7).

**Required WooCommerce category fields:**

| WC Field | Required | Purpose |
|---|---|---|
| `id` | Yes | Brand identification |
| `slug` | Yes | URL routing, config lookup key |
| `name` | Yes | Display name (English) |
| `count` | Yes | Product count for brand card |
| `image.src` | No | Brand hero image (may be absent — fallback to static) |
| `image.alt` | No | Image alt text |

**Ignored WC fields:** `description` (overridden by brand config), `parent`, `menu_order`, `links`

---

### 5.2 Integration Layer: `getBrand(slug)`

**Called by:** Brand page Server Component  
**Cache behavior:** `{ next: { revalidate: 3600 } }` — 1-hour ISR

**WooCommerce endpoint consumed:**
```
GET https://admin.martal.store/wp-json/wc/v3/products/categories?slug={slug}
```

Returns the single matching category. If not found or not in `BRAND_SLUGS`, throws `BrandNotFoundError(slug)`.

---

## 6. Search Endpoints

Search is the one product-related operation that goes through a Next.js API route, because it requires server-side synonym resolution and must not expose WooCommerce credentials to the client.

### 6.1 `GET /api/search`

**Purpose:** Return instant search suggestions for the SearchOverlay. Lightweight — returns miniature product, brand, and color suggestion objects, not full Product models.

**Authentication:** None  
**Rate limit:** 60 requests per IP per minute  
**Called by:** `useSearch` hook via TanStack Query

---

#### Request

```
GET /api/search?q=brown&limit=8
GET /api/search?q=%D8%A8%D9%86%D9%8A       (URL-encoded Arabic: "بني")
GET /api/search?q=hypnoz                    (typo tolerance via WC)
```

**Query parameters:**

| Param | Type | Required | Validation |
|---|---|---|---|
| `q` | `string` | Yes | Min 2 chars, max 100 chars, not pure whitespace |
| `limit` | `number` | No | Integer 1–20, default 8 |

---

#### Response `200 OK`

```json
{
  "query": "brown",
  "resolvedQuery": "brown",
  "products": [
    {
      "productId": 124,
      "slug": "hypnose-brown",
      "name": "Hypnose Brown",
      "brand": "Hypnose",
      "price": 450,
      "thumbnail": "https://admin.martal.store/wp-content/uploads/hypnose-brown-1.jpg",
      "matchType": "color"
    },
    {
      "productId": 156,
      "slug": "labella-soft-brown",
      "name": "Labella Soft Brown",
      "brand": "Labella",
      "price": 430,
      "thumbnail": "https://admin.martal.store/wp-content/uploads/labella-brown-1.jpg",
      "matchType": "color"
    }
  ],
  "brands": [],
  "colors": [
    {
      "colorName": "Brown",
      "colorNameAr": "بني",
      "colorHex": "#8B4513",
      "productCount": 6,
      "filterUrl": "/shop?color=brown"
    }
  ],
  "hasMore": true
}
```

**Response field definitions:**

| Field | Type | Notes |
|---|---|---|
| `query` | `string` | The raw query received |
| `resolvedQuery` | `string` | Query after synonym resolution (may differ from `query`) |
| `products` | `SearchProductSuggestion[]` | Max 3 (regardless of `limit`) |
| `brands` | `SearchBrandSuggestion[]` | Max 2 |
| `colors` | `SearchColorSuggestion[]` | Max 3 |
| `hasMore` | `boolean` | Whether full results page would have more |

**`SearchProductSuggestion` shape** (full definition: 08_DATA_MODEL.md §7.3):

| Field | Type |
|---|---|
| `productId` | `number` |
| `slug` | `string` |
| `name` | `string` |
| `brand` | `string` |
| `price` | `number` |
| `thumbnail` | `string` |
| `matchType` | `'name' \| 'brand' \| 'color'` |

---

#### Error Responses

```json
// 400 — Query too short
{
  "error": {
    "type": "validation_error",
    "message": "كلمة البحث يجب أن تكون حرفين على الأقل"
  }
}

// 429 — Rate limited
{
  "error": {
    "type": "rate_limited",
    "message": "طلبات كثيرة — انتظري لحظة وحاولي مرة أخرى",
    "retryAfter": 60
  }
}

// 500 — WooCommerce unavailable
{
  "error": {
    "type": "server_error",
    "message": "البحث غير متاح مؤقتاً — يمكنك تصفح المتجر بدلاً من ذلك"
  }
}
```

---

#### Internal Flow

```
GET /api/search?q=بني
  ↓
Zod: SearchQuerySchema.safeParse({ q: 'بني', limit: 8 })
  ↓
searchProducts('بني')
  ↓ (in lib/woocommerce/search.ts)
resolveQuery('بني') → 'brown'   [synonym map lookup]
  ↓
WooCommerce: GET /products?search=brown&per_page=8&status=publish
WooCommerce: GET /products?search=بني&per_page=8&status=publish  [parallel]
  ↓
Deduplicate results by product ID
  ↓
SearchTransformer: WCProduct[] → SearchProductSuggestion[]
  ↓
Resolve brand matches from BRAND_SLUGS config
Resolve color matches from colors constant
  ↓
Return SearchSuggestionsResponse
```

---

#### WooCommerce Endpoint Consumed

```
GET https://admin.martal.store/wp-json/wc/v3/products
  ?search={resolvedQuery}&per_page=8&status=publish
```

**Fields used from WC response:** `id`, `slug`, `name`, `categories` (for brand), `price`, `images[0].src`  
**Fields ignored:** everything else  
**Cache:** No cache on search results — each query is unique. TanStack Query caches results client-side for 5 minutes per query key.

---

## 7. Checkout Endpoints

### 7.1 `POST /api/orders`

**Purpose:** Create a WooCommerce order from the checkout form submission. The only mutation endpoint in v2.0.

**Authentication:** None (guest checkout)  
**Rate limit:** 10 requests per IP per hour  
**Called by:** `CheckoutForm` component on form submission

---

#### Request

```
POST /api/orders
Content-Type: application/json
```

**Request body — full example:**

```json
{
  "customer": {
    "fullName": "نورهان أحمد",
    "phone": "01012345678",
    "governorate": "Cairo",
    "city": "مدينة نصر",
    "addressLine1": "شارع عباس العقاد، عمارة 5",
    "addressLine2": "الدور الثالث، شقة 12",
    "notes": "الرجاء الاتصال قبل الحضور"
  },
  "items": [
    {
      "productId": 124,
      "variationId": 207,
      "quantity": 2,
      "price": 450
    },
    {
      "productId": 156,
      "variationId": 312,
      "quantity": 1,
      "price": 430
    }
  ]
}
```

**Request field validation:**

| Field | Validation Rule | Error Message (Arabic) |
|---|---|---|
| `customer.fullName` | Required, 2–100 chars | "الاسم يجب أن يكون حرفين على الأقل" |
| `customer.phone` | Required, matches `/^01[0125][0-9]{8}$/` | "رقم الموبايل غير صحيح — يبدأ بـ 010 أو 011 أو 012 أو 015" |
| `customer.governorate` | Required, must be in 27-governorate enum | "اختاري محافظتك من القائمة" |
| `customer.city` | Required, 2–100 chars | "المدينة مطلوبة" |
| `customer.addressLine1` | Required, 5–200 chars | "العنوان يجب أن يكون 5 أحرف على الأقل" |
| `customer.addressLine2` | Optional, max 100 chars | — |
| `customer.notes` | Optional, max 500 chars | — |
| `items` | Non-empty array, max 50 items | "السلة فارغة" |
| `items[n].productId` | Positive integer | — |
| `items[n].variationId` | Positive integer | — |
| `items[n].quantity` | Integer 1–10 | — |
| `items[n].price` | Positive number, max 10000 | — |

---

#### Internal Flow

```
POST /api/orders body received
  ↓
Rate limit check: 10/hr per IP
  ↓ (if under limit)
Zod: OrderRequestSchema.safeParse(body)
  ↓ (if valid)
Phone normalization: '01012345678' → '+201012345678'
Name split: 'نورهان أحمد' → first_name: 'نورهان', last_name: 'أحمد'
Governorate mapping: 'Cairo' → billing.state: 'Cairo' (WC state code)
  ↓
OrderTransformer.toWCPayload(validatedData) → WCOrderCreatePayload
  ↓
lib/woocommerce/orders.createOrder(payload)
  ↓
WooCommerce: POST /orders (Basic Auth)
  ↓ (on success)
Return { orderId, orderNumber, status, estimatedDelivery }
```

---

#### WooCommerce Payload Sent

```json
{
  "payment_method": "cod",
  "payment_method_title": "الدفع عند الاستلام",
  "set_paid": false,
  "status": "processing",
  "customer_note": "الرجاء الاتصال قبل الحضور",
  "billing": {
    "first_name": "نورهان",
    "last_name": "أحمد",
    "address_1": "شارع عباس العقاد، عمارة 5",
    "address_2": "الدور الثالث، شقة 12",
    "city": "مدينة نصر",
    "state": "Cairo",
    "postcode": "",
    "country": "EG",
    "phone": "+201012345678"
  },
  "shipping": {
    "first_name": "نورهان",
    "last_name": "أحمد",
    "address_1": "شارع عباس العقاد، عمارة 5",
    "address_2": "الدور الثالث، شقة 12",
    "city": "مدينة نصر",
    "state": "Cairo",
    "postcode": "",
    "country": "EG"
  },
  "line_items": [
    {
      "product_id": 124,
      "variation_id": 207,
      "quantity": 2
    },
    {
      "product_id": 156,
      "variation_id": 312,
      "quantity": 1
    }
  ],
  "meta_data": [
    { "key": "source", "value": "martal-2.0-web" }
  ]
}
```

**Note on `price` in request vs. WooCommerce payload:** The submitted `price` per item is used server-side for price validation only — it is **not** passed to WooCommerce. WooCommerce calculates the order total using its own current product prices. This prevents a client from submitting an order at a manipulated price.

---

#### Response `201 Created`

```json
{
  "orderId": 1042,
  "orderNumber": "ORD-1042",
  "status": "processing",
  "estimatedDelivery": "3-5 أيام عمل"
}
```

**`estimatedDelivery`** is derived from the `governorate` code via `lib/constants/governorates.ts`. Cairo governorate returns `"1-3 أيام عمل"`, others return `"3-5 أيام عمل"`.

---

#### Error Responses

```json
// 400 — Validation failure
{
  "error": {
    "type": "validation_error",
    "message": "تحقق من البيانات المدخلة",
    "fields": {
      "phone": "رقم الموبايل غير صحيح — يبدأ بـ 010 أو 011 أو 012 أو 015",
      "governorate": "اختاري محافظتك من القائمة"
    }
  }
}

// 429 — Rate limited
{
  "error": {
    "type": "rate_limited",
    "message": "طلبات كثيرة — انتظري لحظة وحاولي مرة أخرى",
    "retryAfter": 3600,
    "whatsappFallback": "https://wa.me/+201XXXXXXXXX?text=..."
  }
}

// 503 — WooCommerce unavailable
{
  "error": {
    "type": "server_error",
    "message": "حدث خطأ أثناء تأكيد طلبك — يمكنك التواصل معنا مباشرة",
    "whatsappFallback": "https://wa.me/+201XXXXXXXXX?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85..."
  }
}
```

**Critical:** `whatsappFallback` is included in **all** non-validation error responses. It contains a pre-built WhatsApp URL with the order details encoded in the message. The client always has a recovery path.

**WhatsApp fallback URL construction:**

```
Base: https://wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}
Message (URL-encoded):
  "السلام عليكم MARTAL 🛍
  عايزة أطلب:
  - Hypnose Brown × 2 = 900 جنيه
  - Labella Soft Brown × 1 = 430 جنيه
  الإجمالي: 1,330 جنيه
  اسمي: نورهان أحمد
  موبايلي: 01012345678
  المحافظة: القاهرة — مدينة نصر
  العنوان: شارع عباس العقاد، عمارة 5"
```

The API route builds this message from the validated request body before returning the error, so the client has the complete fallback even if WooCommerce is down.

---

## 8. Contact Endpoints

### 8.1 `POST /api/contact`

**Purpose:** Process contact form submission. In v2.0, generates a WhatsApp deep-link and optionally logs the inquiry. No email sending.

**Authentication:** None  
**Rate limit:** 5 requests per IP per hour

---

#### Request

```
POST /api/contact
Content-Type: application/json
```

```json
{
  "name": "سارة محمود",
  "phone": "01112345678",
  "subject": "order_inquiry",
  "message": "طلبت منذ 4 أيام ولم يصلني الطلب رقم ORD-1038 — أين هو؟"
}
```

**Request field validation:**

| Field | Validation | Error |
|---|---|---|
| `name` | Required, 2–100 chars | "الاسم مطلوب" |
| `phone` | Required, Egyptian mobile format | "رقم الموبايل غير صحيح" |
| `subject` | Required, enum: `order_inquiry \| product_question \| shipping \| return \| other` | "اختاري موضوع الاستفسار" |
| `message` | Required, 10–2000 chars | "الرسالة يجب أن تكون 10 أحرف على الأقل" |

---

#### Response `200 OK`

```json
{
  "whatsappUrl": "https://wa.me/+201XXXXXXXXX?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85..."
}
```

The `whatsappUrl` encodes the contact message in the format defined in 05_CONTENT.md §10.4. The client opens this URL directly — it navigates the user to WhatsApp with the message pre-filled.

---

#### Error Responses

```json
// 400 — Validation failure
{
  "error": {
    "type": "validation_error",
    "message": "تحقق من البيانات المدخلة",
    "fields": {
      "message": "الرسالة يجب أن تكون 10 أحرف على الأقل"
    }
  }
}
```

---

## 9. Revalidation Endpoints

### 9.1 `POST /api/revalidate`

**Purpose:** On-demand ISR cache invalidation. Called by WooCommerce webhooks when products or categories are updated.

**Authentication:** `REVALIDATION_SECRET` in request body (compared server-side with `crypto.timingSafeEqual`)  
**Rate limit:** 20 requests per hour (webhook abuse prevention)  
**Caller:** WooCommerce webhook system — not the browser

---

#### Request

```
POST /api/revalidate
Content-Type: application/json
```

```json
{
  "secret": "sk_revalidate_...",
  "type": "product",
  "slug": "hypnose-brown"
}
```

**Alternative — revalidate a brand page:**
```json
{
  "secret": "sk_revalidate_...",
  "type": "brand",
  "slug": "hypnose"
}
```

**Alternative — revalidate everything:**
```json
{
  "secret": "sk_revalidate_...",
  "type": "all"
}
```

**Request field definitions:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `secret` | `string` | Yes | Must match `REVALIDATION_SECRET` env var |
| `type` | `'product' \| 'brand' \| 'category' \| 'all'` | Yes | What to revalidate |
| `slug` | `string` | Conditional | Required when type is `product` or `brand` |

---

#### Internal Revalidation Logic

```
type === 'product' + slug provided:
  revalidatePath(`/product/${slug}`)    → clears PDP cache
  revalidatePath('/shop')               → clears shop ISR (if applicable)
  revalidatePath('/')                   → clears homepage (bestsellers may include this product)

type === 'brand' + slug provided:
  revalidatePath(`/brand/${slug}`)      → clears brand page cache

type === 'category':
  revalidatePath('/shop')               → clears shop category pages

type === 'all':
  revalidatePath('/')                   → all ISR pages
  revalidatePath('/shop')
```

---

#### Response `200 OK`

```json
{
  "revalidated": true,
  "paths": ["/product/hypnose-brown", "/shop", "/"],
  "timestamp": "2026-06-23T14:30:00.000Z"
}
```

---

#### Error Responses

```json
// 401 — Wrong secret
{
  "error": {
    "type": "unauthorized",
    "message": "Unauthorized"
  }
}

// 400 — Missing slug for product/brand type
{
  "error": {
    "type": "validation_error",
    "message": "slug is required for type 'product'"
  }
}
```

---

## 10. Health Endpoints

### 10.1 `GET /api/health`

**Purpose:** Verify that the Next.js application and WooCommerce connection are operational. Used by uptime monitoring (Vercel, Sentry, or external monitoring service).

**Authentication:** None  
**Rate limit:** 60 requests per minute (monitoring systems poll frequently)

---

#### Response `200 OK`

```json
{
  "status": "ok",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "services": {
    "nextjs": "ok",
    "woocommerce": "ok"
  },
  "version": "2.0.0"
}
```

WooCommerce status check: makes a lightweight request to `GET /products?per_page=1` with a 5-second timeout. Does not transform the response — only checks that the HTTP status is 200.

---

#### Response `503 Service Unavailable`

```json
{
  "status": "degraded",
  "timestamp": "2026-06-23T14:30:00.000Z",
  "services": {
    "nextjs": "ok",
    "woocommerce": "error"
  },
  "version": "2.0.0"
}
```

Returns `503` when WooCommerce is unreachable. The Next.js application itself may still be serving cached pages — the health check reflects the integration status, not just the application status.

---

## 11. Cart Store Contracts

The cart is an internal API. These are the contracts that code calls when it needs to interact with cart state. No HTTP involved. Reference: 07_COMPONENT_MAP.md §21 (ownership rules).

### 11.1 Authorized Writers

**Only these three surfaces may call cart mutation actions.** Any other component calling `CartStore.addItem()`, `CartStore.removeItem()`, or `CartStore.updateQuantity()` is a contract violation:

| Action | Authorized Caller | Context |
|---|---|---|
| `addItem()` | `AddToCartButton` | PDP, QuickView, Wishlist "add all" |
| `removeItem()` | `CartItem` | Cart drawer, Cart page |
| `updateQuantity()` | `CartItem` → `QuantitySelector` | Cart drawer, Cart page |
| `clearCart()` | `CheckoutForm` | After confirmed order success ONLY |
| `syncPrices()` | `CheckoutPage` mount effect | Price staleness validation |

### 11.2 Action Contracts

---

**`addItem(item, quantity?)`**

```
Input:
  item: {
    productId: number           // WooCommerce product ID
    variationId: number         // WooCommerce variation ID
    slug: string                // For PDP link
    name: string                // "Hypnose Brown"
    brand: string               // "Hypnose"
    colorName: string           // "Brown"
    colorHex: string            // "#8B4513"
    image: string               // First variation image URL
    imageAlt: string            // Image alt text
    price: number               // Price at time of addition (EGP)
  }
  quantity?: number             // Default: 1

Behavior:
  IF (productId + variationId already in items):
    newQty = min(existingItem.quantity + quantity, 10)
    Update item quantity to newQty
  ELSE:
    Append new CartItem with addedAt = Date.now()
  Update _updatedAt = Date.now()
  Zustand persist serializes to localStorage

Side effects (callers must invoke separately):
  UIStore.openCartDrawer()    // Caller's responsibility
```

**`removeItem(productId, variationId)`**

```
Input:
  productId: number
  variationId: number

Behavior:
  Filter items removing where item.productId === productId
  AND item.variationId === variationId
  Update _updatedAt
  Log warning if no item found (remove on non-existent item = no-op, not error)
```

**`updateQuantity(productId, variationId, quantity)`**

```
Input:
  productId: number
  variationId: number
  quantity: number

Behavior:
  clampedQty = Math.max(1, Math.min(quantity, 10))
  Find matching item; update its quantity to clampedQty
  Update _updatedAt
  IF quantity <= 0: call removeItem() instead (QuantitySelector prevents this, but guard exists)
```

**`clearCart()`**

```
Input: none

Behavior:
  Set items = []
  Update _updatedAt = Date.now()
  Persist middleware clears localStorage:martal_cart_v2 items array

CRITICAL CONSTRAINT:
  This action is called ONLY after a confirmed successful order response from /api/orders.
  It must never be called on:
    - Navigation away from checkout
    - Page reload
    - Timeout
    - Partial submission state
    - Error response
```

**`syncPrices(updates)`**

```
Input:
  updates: Array<{
    variationId: number
    currentPrice: number
  }>

Behavior:
  For each update:
    Find CartItem with matching variationId
    IF abs(item.price - currentPrice) / item.price > 0.05:
      Update item.price to currentPrice
      Mark item as priceUpdated: true (for CartStalenessWarning display)
  Update _updatedAt

Called by: CheckoutPage mount effect
  Fetches current prices from WooCommerce for all cart variationIds
  Calls syncPrices() if any price has changed
```

### 11.3 Selector Contracts

```
itemCount() → number
  Returns: sum of item.quantity across all items
  Example: [{qty:2}, {qty:1}] → 3

subtotal() → number
  Returns: sum of (item.price * item.quantity)
  Example: [{price:450, qty:2}, {price:430, qty:1}] → 1330

hasItem(productId, variationId) → boolean
  Returns: true if item exists in cart with matching IDs

getItem(productId, variationId) → CartItem | undefined
  Returns: the matching CartItem or undefined
```

### 11.4 Computed Values (derived, not stored)

These are computed by consumers of CartStore, not stored in the store:

```
shippingCost = subtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
total = subtotal() + shippingCost
qualifiesForFreeShipping = subtotal() >= FREE_SHIPPING_THRESHOLD
amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal(), 0)
freeShippingProgress = Math.min(subtotal() / FREE_SHIPPING_THRESHOLD, 1)
isEmpty = items.length === 0
```

Constants from `lib/constants/config.ts`:
- `FREE_SHIPPING_THRESHOLD = 800` (EGP)
- `STANDARD_SHIPPING_COST = 50` (EGP)

---

## 12. Wishlist Store Contracts

### 12.1 Authorized Writers

| Action | Authorized Caller |
|---|---|
| `toggle()` | `WishlistToggle` component only |
| `clear()` | `WishlistToolbar` ("Clear wishlist" button) |

### 12.2 Action Contracts

**`toggle(slug)`**

```
Input:
  slug: string    // Product slug (e.g., "hypnose-brown")

Behavior:
  IF slug in slugs array:
    Remove slug from array
    Update updatedAt
  ELSE:
    Append { slug, addedAt: Date.now() }
    Update updatedAt
  Persist to localStorage:martal_wishlist_v2
```

**`clear()`**

```
Input: none
Behavior: Set items = []
Called by: WishlistToolbar after user confirmation dialog
```

### 12.3 Selector Contracts

```
has(slug) → boolean
count() → number
slugs() → string[]    // Returns just the slug strings (not WishlistItem objects)
```

### 12.4 Wishlist Data Fetch Contract

The wishlist store contains only slugs. When the Wishlist page renders, it fetches product data for all stored slugs:

```
WishlistPage mounts
  ↓
WishlistStore.slugs() → ['hypnose-brown', 'iconic-steel-blue']
  ↓
TanStack Query: useQuery(['wishlist-products', slugs])
  ↓
lib/woocommerce/products.ts: getProductsBySlug(slugs)
  ↓
WooCommerce: GET /products?slug=hypnose-brown,iconic-steel-blue
  ↓
Transform → Product[]
  ↓
Render WishlistGrid with fresh Product data
```

This ensures wishlisted products always show current pricing and stock status, never stale data from the time of wishlisting.

---

## 13. UI Store Contracts

UIStore manages ephemeral overlay and drawer state. It has no persistence layer and no async operations.

### 13.1 Action Contracts

| Action | Input | Behavior | Caller |
|---|---|---|---|
| `openSearch()` | — | `searchOpen = true` | `SearchTriggerButton`, MobileBottomNav search tab |
| `closeSearch()` | — | `searchOpen = false` | SearchOverlay backdrop, Escape key handler |
| `openCartDrawer()` | — | `cartDrawerOpen = true` | `CartButton`, `AddToCartButton` (after 200ms delay) |
| `closeCartDrawer()` | — | `cartDrawerOpen = false` | CartDrawer backdrop, ContinueShoppingButton, CheckoutButton |
| `openFilterDrawer()` | — | `filterDrawerOpen = true` | `FilterTriggerButton` (mobile shop toolbar) |
| `closeFilterDrawer()` | — | `filterDrawerOpen = false` | FilterDrawer backdrop, Apply Filters button |
| `openQuickView(product)` | `product: Product` | `quickViewProduct = product` | `QuickViewTrigger` on ProductCard |
| `closeQuickView()` | — | `quickViewProduct = null` | QuickViewModal backdrop, close button |
| `addToRecentlyViewed(item)` | `RecentlyViewedItem` | Prepend, deduplicate slug, max 20, persist | PDP page component on mount |

### 13.2 State Constraints

- Only one overlay is open at a time. The UIStore does not enforce this — callers must close one before opening another. Opening search while the cart drawer is open is technically possible; the design does not allow it visually (search overlay is a higher z-index).
- `quickViewProduct` being non-null is the signal to render the QuickViewModal. The modal reads product data directly from this field — no additional fetch required.
- `recentlyViewed` deduplication: if the incoming slug already exists in the array, move it to the front (update `viewedAt`) rather than creating a duplicate.

---

## 14. localStorage Persistence Contracts

All localStorage interactions go through Zustand's persist middleware or the `useLocalStorage` hook. **Direct `localStorage.getItem()` / `localStorage.setItem()` calls in components are forbidden** — use the hook or the store.

### 14.1 Key Registry

All keys exported from `src/lib/constants/storage.ts`:

| Exported Constant | Key String | Owner |
|---|---|---|
| `STORAGE_CART` | `martal_cart_v2` | CartStore (Zustand persist) |
| `STORAGE_WISHLIST` | `martal_wishlist_v2` | WishlistStore (Zustand persist) |
| `STORAGE_ORDERS` | `martal_orders_v2` | `CheckoutForm` (via `useLocalStorage`) |
| `STORAGE_ADDRESS` | `martal_address_v2` | `AddressForm` (via `useLocalStorage`) |
| `STORAGE_RECENT_SEARCHES` | `martal_recent_searches_v2` | `useSearch` hook |
| `STORAGE_RECENTLY_VIEWED` | `martal_recently_viewed_v2` | UIStore (Zustand persist) |

### 14.2 Serialized Shape Contracts

---

**`martal_cart_v2`**

```json
{
  "state": {
    "items": [
      {
        "productId": 124,
        "variationId": 207,
        "slug": "hypnose-brown",
        "name": "Hypnose Brown",
        "brand": "Hypnose",
        "colorName": "Brown",
        "colorHex": "#8B4513",
        "image": "https://admin.martal.store/wp-content/uploads/hypnose-brown-1.jpg",
        "imageAlt": "Hypnose Brown عدسة ملونة كورية",
        "price": 450,
        "quantity": 2,
        "addedAt": 1719148200000
      }
    ],
    "_updatedAt": 1719148200000
  },
  "version": 2
}
```

**Zustand persist serializes a `{ state, version }` wrapper automatically.** The `version` field is what enables migration (see 08_DATA_MODEL.md §12.2).

---

**`martal_wishlist_v2`**

```json
{
  "state": {
    "items": [
      { "slug": "iconic-steel-blue", "addedAt": 1719100000000 },
      { "slug": "hypnose-brown", "addedAt": 1719050000000 }
    ]
  },
  "version": 2
}
```

---

**`martal_orders_v2`**

```json
{
  "version": 2,
  "orders": [
    {
      "id": 1042,
      "number": "ORD-1042",
      "status": "processing",
      "date": "2026-06-23T14:30:00.000Z",
      "items": [
        {
          "productId": 124,
          "variationId": 207,
          "slug": "hypnose-brown",
          "name": "Hypnose Brown",
          "brand": "Hypnose",
          "colorName": "Brown",
          "image": "https://admin.martal.store/wp-content/uploads/hypnose-brown-1.jpg",
          "price": 450,
          "quantity": 2,
          "lineTotal": 900
        }
      ],
      "customer": {
        "fullName": "نورهان أحمد",
        "phone": "01012345678",
        "governorate": "Cairo"
      },
      "subtotal": 900,
      "shippingCost": 0,
      "total": 900,
      "paymentMethod": "cod",
      "source": "martal-2.0-web"
    }
  ],
  "updatedAt": 1719148200000
}
```

**Maximum 20 orders.** When a 21st order is added, the oldest (`orders[orders.length - 1]`) is removed before prepending the new one.

---

**`martal_address_v2`**

```json
{
  "version": 2,
  "address": {
    "fullName": "نورهان أحمد",
    "phone": "01012345678",
    "governorate": "Cairo",
    "city": "مدينة نصر",
    "addressLine1": "شارع عباس العقاد، عمارة 5",
    "addressLine2": "الدور الثالث، شقة 12"
  },
  "updatedAt": 1719148200000
}
```

Written by `CheckoutForm` on successful order. Read by `CheckoutPage` to pre-fill the form on subsequent visits.

---

**`martal_recent_searches_v2`**

```json
{
  "version": 2,
  "searches": [
    { "query": "brown", "timestamp": 1719148200000 },
    { "query": "هيبنوز", "timestamp": 1719100000000 }
  ]
}
```

**Maximum 8 entries.** FIFO eviction. Managed by `useSearch` hook.

---

**`martal_recently_viewed_v2`**

```json
{
  "state": {
    "recentlyViewed": [
      {
        "slug": "iconic-steel-blue",
        "name": "ICONIC Steel Blue",
        "brand": "ICONIC",
        "thumbnail": "https://admin.martal.store/wp-content/uploads/iconic-blue-1.jpg",
        "price": 520,
        "viewedAt": 1719148200000
      }
    ]
  },
  "version": 2
}
```

**Maximum 20 entries.** Current page product excluded from display. Zustand persist handles serialization.

### 14.3 Rehydration Error Contract

If localStorage parsing fails (corrupted JSON, schema mismatch on version upgrade):

```
Zustand onRehydrateStorage callback:
  catch(error):
    console.error('Cart storage corrupted — starting fresh', error)
    Clear the corrupted key: localStorage.removeItem(STORAGE_CART)
    Return initial state (empty cart)
    DO NOT throw — hydration failure must be silent to the user
```

---

## 15. React Query Contracts

React Query (TanStack Query) manages all client-side server state. This section defines the query key taxonomy and hook return types. Full model shapes are in 08_DATA_MODEL.md §14.

### 15.1 Query Key Taxonomy

All query keys are arrays. Structure: `[domain, operation, ...identifiers]`

| Hook | Query Key | Stale Time | GC Time |
|---|---|---|---|
| `useProduct(slug)` | `['product', slug]` | 5 min | 10 min |
| `useProducts(filters)` | `['products', filters]` | 0 (always fresh) | 5 min |
| `useProductVariations(productId)` | `['variations', productId]` | 5 min | 10 min |
| `useBrand(slug)` | `['brand', slug]` | 30 min | 60 min |
| `useBrands()` | `['brands']` | 60 min | 120 min |
| `useSearchSuggestions(query)` | `['search', 'suggestions', query]` | 5 min | 10 min |
| `useSearchResults(query, page)` | `['search', 'results', query, page]` | 0 | 5 min |
| `useWishlistProducts(slugs)` | `['wishlist-products', slugs]` | 5 min | 10 min |
| `useRelatedProducts(productId)` | `['related', productId]` | 60 min | 120 min |

**Stale time = 0 (always fresh)** for `useProducts` because shop filters are URL-based and every unique URL combination requires fresh data.

**`useSearchSuggestions` is disabled** when `query.trim().length < 2` via `enabled: query.trim().length >= 2`.

### 15.2 Hook Return Type Contracts

**`useSearchSuggestions(query)`**

```
Returns:
  data: SearchSuggestionsResponse | undefined
  isLoading: boolean    (true during first fetch)
  isFetching: boolean   (true during background refetch)
  isError: boolean
  error: Error | null
```

**`useProducts(filters)`**

```
Returns:
  data: {
    products: Product[]
    pagination: PaginationState
  } | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
```

**`useWishlistProducts(slugs)`**

```
Input: string[]    (from WishlistStore.slugs())
Returns:
  data: Product[] | undefined
  isLoading: boolean
  isError: boolean

Behavior:
  Query disabled when slugs.length === 0
  Fetches all products matching the slug list in a single WC request
```

### 15.3 Mutation Contracts

**`useCreateOrder()`**

```
Returns:
  mutate: (data: CheckoutSubmission) => void
  mutateAsync: (data: CheckoutSubmission) => Promise<CheckoutResult>
  isLoading: boolean
  isError: boolean
  error: CheckoutError | null
  data: CheckoutResult | undefined

On success:
  Caller (CheckoutForm) is responsible for:
    - CartStore.clearCart()
    - Writing to localStorage:martal_orders_v2
    - router.push('/order-success?id=...')

On error:
  Caller displays error toast
  Caller surfaces whatsappFallback URL from error.whatsappFallback
  Cart is NOT cleared
```

### 15.4 Client-Side Query Configuration

```
QueryClient defaults:
  staleTime: 5 * 60 * 1000        // 5 minutes
  gcTime: 10 * 60 * 1000          // 10 minutes GC
  retry: 2                         // Retry failed requests twice
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000)
  refetchOnWindowFocus: false      // Critical for Egyptian mobile (WhatsApp tab-switching)
  refetchOnReconnect: true         // Refetch when network reconnects
```

`refetchOnWindowFocus: false` is mandatory. Egyptian users frequently switch between the browser and WhatsApp. Without this setting, every return to the browser triggers a refetch — unnecessary API load and flash of loading states.

---

## 16. WooCommerce Integration Contracts

### 16.1 Authentication Contract

**Method:** HTTP Basic Authentication  
**Credentials:** WooCommerce consumer key + consumer secret  
**Encoding:** `Base64(consumerKey:consumerSecret)`  
**Header:** `Authorization: Basic {base64string}`

```
WOOCOMMERCE_KEY=ck_abc123...
WOOCOMMERCE_SECRET=cs_xyz789...
Base64 of "ck_abc123...:cs_xyz789..." → AUTH_TOKEN
Header: Authorization: Basic AUTH_TOKEN
```

**This header is constructed once in `lib/woocommerce/client.ts` at module initialization.** It is never computed in a component, never passed as a prop, never returned from an API route.

### 16.2 Base URL Contract

```
https://admin.martal.store/wp-json/wc/v3/{endpoint}
```

**Environment variable:** `WOOCOMMERCE_URL = https://admin.martal.store`  
**Path prefix** `/wp-json/wc/v3/` is appended by `wcGet()` — callers pass only the endpoint path: `'products'`, `'orders'`, `'products/categories'`.

### 16.3 WooCommerce Endpoints Consumed

| MARTAL Function | WC Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `getProducts()` | `/products` | GET | Main product list |
| `getProduct(slug)` | `/products?slug={slug}` | GET | Returns array; take `[0]` |
| `getProductVariations(id)` | `/products/{id}/variations` | GET | per_page=100 |
| `getBestsellers(n)` | `/products?orderby=popularity` | GET | ISR 30min |
| `getRelatedProducts(id, n)` | `/products?category={brand}` | GET | ISR 1hr |
| `getBrands()` | `/products/categories?slug=...` | GET | ISR 24hr |
| `getBrand(slug)` | `/products/categories?slug={slug}` | GET | ISR 1hr |
| `createOrder(payload)` | `/orders` | POST | No cache |
| `getWishlistProducts(slugs)` | `/products?slug={slug1},{slug2},...` | GET | TanStack Query 5min |
| `searchProducts(q)` | `/products?search={q}` | GET | No cache |

### 16.4 Error Handling Contract

When WooCommerce returns a non-2xx response:

```
WooCommerceError thrown:
  status: number     (HTTP status from WC)
  endpoint: string   (which endpoint failed)
  body: string       (raw WC error body — for logging only)

Handling per status:
  404: throw ProductNotFoundError or BrandNotFoundError (specific types)
  429: WooCommerce rate limited — wait and retry (see §16.5)
  500/503: throw WooCommerceUnavailableError
  Any other: throw WooCommerceError with generic message

Logging:
  All WooCommerceErrors are logged to Sentry with:
    endpoint, status, timestamp
  The WC error body is NEVER forwarded to the browser response
```

### 16.5 Retry Contract

```
GET requests: retry 2 times with exponential backoff
  Attempt 1: immediate
  Attempt 2: 500ms delay
  Attempt 3: 1000ms delay
  If all fail: throw WooCommerceUnavailableError

POST /orders: NO automatic retry
  Reason: order creation is not idempotent
  A retry after timeout may create duplicate orders
  Instead: return error immediately, surface WhatsApp fallback to user
```

### 16.6 Timeout Contract

```
All WooCommerce requests: 10-second fetch timeout
  Implementation: AbortController with 10000ms timeout
  On timeout: throw WooCommerceTimeoutError (subtype of WooCommerceUnavailableError)
```

### 16.7 Rate Limit Monitoring

WooCommerce's default REST API rate limit is approximately 50 requests per minute. MARTAL's ISR strategy means most requests are served from cache — WooCommerce only receives requests on cache misses and order POSTs.

**Monitoring:** Log `X-RateLimit-Remaining` header (if WC exposes it) in development. If remaining drops below 10, investigate caching configuration.

---

## 17. Transformer Contracts

Transformers are pure functions in `lib/woocommerce/transformers.ts`. They have no side effects, no API calls, no state access. Given the same input, they always return the same output.

### 17.1 `transformProduct(wcProduct, wcVariations?)`

```
Input:
  wcProduct: WCProduct           (validated by WCProductSchema first)
  wcVariations?: WCVariation[]   (optional — absent in list contexts)

Output:
  Product                        (08_DATA_MODEL.md §2.1)

Responsibilities:
  1. Parse prices: "450.00" → 450
  2. Parse rating: "4.8" → 4.8
  3. Resolve brand from categories array using BRAND_SLUGS lookup
  4. Strip HTML from short_description → subtitle
  5. Extract soldCount from meta_data[key='_sold_count']
  6. Resolve badge by priority: onSale→'sale' | tag='bestseller'→'bestseller' | tag='new'→'new' | null
  7. Transform images to ProductImage[] (set isPrimary on first, fill alt text if empty)
  8. Transform attributes to ProductAttribute[]
  9. Transform wcVariations to ProductVariation[] via transformVariation()
  10. Set inStock from stock_status === 'instock' AND purchasable === true

Precondition:
  WCProductSchema.safeParse(wcProduct).success === true
  If false, do not call — throw before transforming

Failure modes:
  IF brand cannot be resolved from categories:
    throw TransformError('brand_resolution', productId)
    Do not return a Product with brand: undefined
```

### 17.2 `transformVariation(wcVariation)`

```
Input:
  wcVariation: WCProductVariation

Output:
  ProductVariation               (08_DATA_MODEL.md §2.3)

Responsibilities:
  1. Parse prices to numbers
  2. Extract colorName from attributes where name === 'pa_color', take .option
  3. Resolve colorHex from COLORS_CONFIG[colorName.toLowerCase()]
     - Fallback: '#C9B9A8' (accent-stone) if not found
     - Log warning: console.warn(`Unknown color: ${colorName}`) for admin awareness
  4. Resolve colorNameAr from SYNONYMS map (inverse lookup: English → Arabic)
  5. Wrap single WC image in array: [transformImage(wcVariation.image)]
  6. Set inStock from stock_status === 'instock'
```

### 17.3 `transformBrand(wcCategory, brandConfig)`

```
Input:
  wcCategory: WCCategory
  brandConfig: BrandConfig       (from lib/constants/brands.ts)

Output:
  Brand                          (08_DATA_MODEL.md §2.7)

Responsibilities:
  1. Merge WC category data with static brand config
  2. Brand config fields override WC category description
  3. Build seoTitle: "عدسات {name} الملونة الكورية | MARTAL"
  4. Build seoDescription from Content §16.2 template
  5. Transform category image if present
```

### 17.4 `buildWCOrderPayload(checkoutData, cartItems)`

```
Input:
  checkoutData: CheckoutFormData  (validated form values)
  cartItems: CartItem[]           (from CartStore)

Output:
  WCOrderCreatePayload            (08_DATA_MODEL.md §9.3)

Responsibilities:
  1. Split fullName into first_name + last_name
     Rule: first word = first_name, rest = last_name
     Edge case: single-word name → first_name = name, last_name = ''
  2. Normalize phone: strip leading 0, prepend +20
     '01012345678' → '+201012345678'
  3. Set billing and shipping to same values (COD — billing equals shipping)
  4. Set payment_method: 'cod'
  5. Set payment_method_title: 'الدفع عند الاستلام'
  6. Set set_paid: false
  7. Build line_items from cartItems (productId, variationId, quantity only — no price)
  8. Add meta_data: [{ key: 'source', value: 'martal-2.0-web' }]
  9. Set customer_note from checkoutData.notes (empty string if absent)
```

---

## 18. Error Contracts

### 18.1 Error Type Registry

All errors in MARTAL 2.0 are classified by type. The `type` field is the discriminant.

| Type | HTTP Status | Used In | User Sees |
|---|---|---|---|
| `validation_error` | 400 | All API routes | Field-level Arabic error messages |
| `unauthorized` | 401 | `/api/revalidate` | "Unauthorized" (English — internal) |
| `not_found` | 404 | Integration layer | Arabic "not found" page |
| `rate_limited` | 429 | All API routes | Arabic retry message + optional WhatsApp |
| `server_error` | 500 | All API routes | Arabic generic error + WhatsApp fallback |
| `woocommerce_error` | 503 | Integration layer | Arabic unavailable message + WhatsApp |
| `woocommerce_timeout` | 503 | Integration layer | Arabic timeout message + WhatsApp |
| `cart_staleness` | — (client) | CheckoutPage | Arabic price-change warning |
| `transform_error` | — (server) | Transformer layer | Logged to Sentry; renders 500 page |

### 18.2 API Error Response Shapes

**Validation Error (`400`)**
```json
{
  "error": {
    "type": "validation_error",
    "message": "تحقق من البيانات المدخلة وحاولي مرة أخرى",
    "fields": {
      "phone": "رقم الموبايل غير صحيح — يبدأ بـ 010 أو 011 أو 012 أو 015",
      "governorate": "اختاري محافظتك من القائمة"
    }
  }
}
```

**Rate Limited (`429`)**
```json
{
  "error": {
    "type": "rate_limited",
    "message": "طلبات كثيرة — انتظري لحظة وحاولي مرة أخرى",
    "retryAfter": 3600,
    "whatsappFallback": "https://wa.me/+201XXXXXXXXX?text=..."
  }
}
```
`retryAfter` is in seconds. The client can use this to display a countdown timer.

**Server Error (`500`)**
```json
{
  "error": {
    "type": "server_error",
    "message": "حدث خطأ غير متوقع — يمكنك التواصل معنا مباشرة",
    "whatsappFallback": "https://wa.me/+201XXXXXXXXX?text=..."
  }
}
```

**WooCommerce Unavailable (`503`)**
```json
{
  "error": {
    "type": "woocommerce_error",
    "message": "المتجر غير متاح مؤقتاً — يمكنك التواصل معنا مباشرة",
    "whatsappFallback": "https://wa.me/+201XXXXXXXXX?text=..."
  }
}
```

### 18.3 Error Logging Contract

```
All errors logged via Sentry.captureException() with context:
  {
    endpoint: string,
    method: string,
    timestamp: string
  }

PII stripping before Sentry (Sentry beforeSend hook):
  Remove from request.data: phone, fullName, addressLine1, addressLine2, notes
  Remove from request.data.customer: all fields
  Replace with: "[REDACTED]"

Console logging in production:
  console.error([WooCommerce error], { status, endpoint })
  Never log full request body in production
  Never log WooCommerce error response body in production
```

---

## 19. Contract Testing Strategy

Testing strategy for each boundary, focused on contracts that break revenue when violated.

### 19.1 Boundary A Tests (Browser → API Routes)

**Tool:** Vitest + MSW (`msw/node` for API route testing)

**Test per route:**

```
POST /api/orders:

  ✓ Valid request body → 201 + { orderId, orderNumber, status }
  ✓ Phone '01012345678' → valid
  ✓ Phone '02012345678' → 400 + Arabic field error on 'phone'
  ✓ Phone '1012345678' (no leading 0) → valid (normalized)
  ✓ Governorate not in enum → 400 + Arabic field error on 'governorate'
  ✓ Empty items array → 400
  ✓ Missing required fields → 400 with correct field names
  ✓ WooCommerce returns 503 → 503 + Arabic error + whatsappFallback in response
  ✓ WooCommerce times out → 503 + whatsappFallback
  ✓ Rate limit exceeded → 429 + retryAfter

GET /api/search:

  ✓ q=brown → 200 + products + colors
  ✓ q=بني → 200 + same products as q=brown (synonym resolution)
  ✓ q=a (too short) → 400 + Arabic error
  ✓ WooCommerce unavailable → 500 + Arabic error (no products key)

POST /api/revalidate:

  ✓ Correct secret → 200 + { revalidated: true }
  ✓ Wrong secret → 401
  ✓ type=product without slug → 400
```

### 19.2 Boundary B Tests (API → WooCommerce)

**Tool:** Vitest with MSW intercepting WooCommerce endpoints

```
ProductTransformer:

  ✓ price "450.00" → 450 (number, not string)
  ✓ sale_price "" → null
  ✓ sale_price "400.00" → 400
  ✓ average_rating "4.8" → 4.8 (number)
  ✓ onSale + no bestseller tag → badge === 'sale'
  ✓ bestseller tag + not on sale → badge === 'bestseller'
  ✓ onSale + bestseller tag → badge === 'sale' (sale takes priority)
  ✓ categories: [{ slug: 'hypnose' }] → brand === 'Hypnose'
  ✓ meta_data: [{ key: '_sold_count', value: '831' }] → soldCount === 831
  ✓ images[0].alt === '' → alt === 'Hypnose Brown عدسة ملونة كورية — MARTAL'
  ✓ Unknown category slug → TransformError thrown

VariationTransformer:

  ✓ attributes: [{ name: 'pa_color', option: 'Brown' }] → colorName === 'Brown'
  ✓ colorName 'Brown' → colorHex === '#8B4513' (from COLORS_CONFIG)
  ✓ colorName 'UnknownColor' → colorHex === '#C9B9A8' (fallback)
  ✓ stock_status 'outofstock' → inStock === false

OrderTransformer:

  ✓ fullName 'نورهان أحمد' → first_name 'نورهان', last_name 'أحمد'
  ✓ fullName 'نورهان' → first_name 'نورهان', last_name ''
  ✓ phone '01012345678' → billing.phone '+201012345678'
  ✓ meta_data always includes { key: 'source', value: 'martal-2.0-web' }
  ✓ price field from request NOT included in WC payload
```

### 19.3 Boundary C Tests (Components → Stores)

**Tool:** Vitest (store actions are pure functions — no React needed)

```
CartStore:

  ✓ addItem() → item in store
  ✓ addItem() same variation twice → quantity incremented
  ✓ addItem() at quantity 10 → quantity stays 10
  ✓ removeItem() → item removed, others unchanged
  ✓ updateQuantity(0) → item removed
  ✓ updateQuantity(11) → clamped to 10
  ✓ clearCart() → items === []
  ✓ subtotal() calculates correctly
  ✓ itemCount() sums quantities
  ✓ syncPrices() updates prices > 5% delta, marks priceUpdated
  ✓ syncPrices() ignores prices within 5% delta

WishlistStore:

  ✓ toggle() → slug added
  ✓ toggle() existing slug → slug removed
  ✓ has() → correct boolean
  ✓ clear() → slugs === []
```

### 19.4 Boundary D Tests (Persistence)

**Tool:** Vitest with localStorage mock

```
  ✓ CartStore.addItem() → localStorage:martal_cart_v2 updated
  ✓ Rehydrating from localStorage restores cart state
  ✓ Corrupted localStorage JSON → store initializes with empty state (no throw)
  ✓ Version mismatch → migration or fresh state (not crash)
```

### 19.5 E2E Contract Test (Playwright)

**Full checkout contract test** (most important test in the system):

```
Playwright: Full Order Flow

Given: Mock WooCommerce responds with { orderId: 9999, orderNumber: "ORD-9999" }
When:
  1. Navigate to /product/hypnose-brown
  2. Select Brown swatch
  3. Click Add to Cart
  4. Navigate to /checkout
  5. Fill: fullName="نورهان أحمد", phone="01012345678",
           governorate="القاهرة", city="مدينة نصر",
           addressLine1="شارع عباس العقاد عمارة 5"
  6. Click تأكيدي الطلب
Then:
  - URL is /order-success?id=9999&number=ORD-9999
  - Page contains "ORD-9999"
  - Cart icon shows 0
  - localStorage:martal_orders_v2 contains order with id=9999
  - localStorage:martal_cart_v2 items array is empty
```

---

## 20. Governance Rules

These 22 rules define the contract discipline for MARTAL 2.0. A PR that violates any rule must be revised before merge.

**G-01: API versioning becomes mandatory before any external consumer is introduced.** If MARTAL adds a mobile app, a public API, or any third-party integration that is not deployed atomically with the Next.js frontend, `/api/v1/` routes must be introduced before that consumer launches. Unversioned routes may not be the external interface.

**G-02: WooCommerce credentials never leave server-side code.** No API route response, error message, component prop, Zustand store, or localStorage key may contain a WooCommerce consumer key, consumer secret, or Basic Auth token. Verified by: `npm run build && grep -r "ck_\|cs_" .next/` returning no results.

**G-03: `lib/woocommerce/client.ts` imports `'server-only'` at the top of the file.** This is the build-time enforcement of the credential isolation boundary. Removing this import requires explicit team approval and a documented security review.

**G-04: No component makes a direct `fetch()` call to WooCommerce.** All WooCommerce communication is routed through `lib/woocommerce/`. A component that calls `fetch('https://admin.martal.store/...')` directly is a contract violation that exposes credentials and bypasses the transformation layer.

**G-05: No API route forwards the raw WooCommerce error body to the client.** WooCommerce error responses may contain internal paths, plugin names, database hints, or stack traces. These are logged server-side and never included in the API response returned to the browser.

**G-06: Every API route validates input with Zod before executing business logic.** The Zod `safeParse()` call precedes any WooCommerce call, any database write, and any transformation. Business logic that executes on unvalidated input is a contract violation.

**G-07: `CartStore.clearCart()` is called only after confirmed success from `/api/orders`.** A 200-level response with `{ orderId }` is the only authorized trigger. A timeout, a network error, an error response, or a navigation event do not authorize cart clearing.

**G-08: The `whatsappFallback` URL is included in all `500` and `503` responses from `/api/orders`.** A checkout error response without a fallback is a dead end for the customer. The fallback is constructed in the API route from the validated request body before the error is returned.

**G-09: Phone numbers are normalized to `+20XXXXXXXXXX` format before submission to WooCommerce.** The customer inputs their phone in any common Egyptian format. The `OrderTransformer` normalizes to international format. WooCommerce stores the normalized form. No normalization happens in components.

**G-10: The `source` meta field `martal-2.0-web` is always included in every WooCommerce order payload.** Orders submitted without the source tag cannot be traced to the web application in the WooCommerce admin. This rule applies even in development and testing environments.

**G-11: Search API responses never expose WooCommerce product IDs to public clients.** `SearchProductSuggestion` contains `slug` (for linking) but not internal WooCommerce `id`. The `id` is exposed only in `Product` models consumed by authenticated server-side code.

Wait — `SearchProductSuggestion` does include `productId` (08_DATA_MODEL.md §7.3) for potential future use. **Revised:** `productId` is included in search suggestions but is not used for any client-side API call. It is informational only. The slug is the canonical identifier for navigation.

**G-12: All localStorage keys are exported from `src/lib/constants/storage.ts`.** A hardcoded string `'martal_cart_v2'` in any file other than the constants module is a contract violation. Key strings must be referenced via the exported constant.

**G-13: localStorage writes use the versioned wrapper `{ state: {...}, version: N }`.** A Zustand persist store that does not include a version number cannot be migrated in future releases without data loss.

**G-14: The `_updatedAt` timestamp in CartStorage and WishlistStorage uses `Date.now()` (milliseconds, not seconds).** Mixing epoch milliseconds and epoch seconds produces comparison bugs. All MARTAL timestamps are epoch milliseconds.

**G-15: Rate limits on API routes are enforced before Zod validation.** An attacker sending malformed requests still consumes rate limit budget. Zod validation runs only for requests that pass the rate limit gate.

**G-16: React Query's `refetchOnWindowFocus` is `false` application-wide.** Egyptian mobile users frequently switch to WhatsApp and back. Window focus refetches create unnecessary WooCommerce API load and visible loading flashes. This setting may only be overridden for a specific query if there is a documented reason.

**G-17: Search results are not cached at the API route level.** `GET /api/search` responses carry no `Cache-Control` header that would cause Vercel's CDN to cache them. Each search query is unique; edge caching provides no benefit and would serve stale suggestions.

**G-18: The revalidation secret is compared using `crypto.timingSafeEqual`, not `===`.** String comparison with `===` is vulnerable to timing attacks. The revalidation endpoint accepts an attacker's secret guess — timing-safe comparison prevents secret enumeration.

**G-19: WooCommerce order POST has no automatic retry.** Order creation is not idempotent. A network timeout followed by an automatic retry may create two identical orders in WooCommerce. On POST failure, return an error immediately and surface the WhatsApp fallback. The customer re-initiates if needed.

**G-20: The `per_page` parameter for variation fetches is `100`.** MARTAL products will not have more than 20 color variants, but a conservative `100` ensures all variations are returned in a single call without pagination logic for this endpoint.

**G-21: `WishlistToggle` is the only component authorized to call `WishlistStore.toggle()`.** Any other component calling `toggle()` directly is a contract violation. If a new surface needs to toggle wishlist state, it must render `WishlistToggle` as a child, not duplicate the store call.

**G-22: The `CheckoutSubmission.items[n].price` field is used for server-side validation only — it is never forwarded to WooCommerce.** The WooCommerce order total is calculated by WooCommerce using its current product prices, not the prices submitted by the client. This prevents a price manipulation attack where a client submits `price: 1` for a 450 EGP product.

---

*This document is the complete communication contract for MARTAL 2.0. Every request shape, response shape, error type, store action, and persistence key is defined here. Engineers implement these contracts — they do not invent them. When a contract must change, this document is updated first, the change is reviewed, and then implementation follows. Contract-first, not code-first.*

*Document Owner: API Engineering*  
*Last Updated: June 2026*  
*Documentation Stack: 01_PROJECT_BRIEF → 10_API_CONTRACTS — Complete*
