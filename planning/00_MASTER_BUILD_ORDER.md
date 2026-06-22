# 00 — MASTER BUILD ORDER
## MARTAL 2.0: Complete Dependency-Aware Build Sequence

**Document Type:** Build Dependency Map — Claude Code Execution Reference  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Active — Source of Truth for Sprint Execution  
**Repository:** https://github.com/firoapo01/martal-2  
**Audience:** Claude Code, Solo Developer

> **Purpose.** This document maps every file and component in MARTAL 2.0 to the level at which it can be built. Nothing at Level N can be built until everything at Level N−1 is complete and verified. This is the dependency enforcement layer that prevents building a ProductCard before the design tokens exist, or a checkout before cart state exists.

> **How Claude Code uses this document.** Before creating or modifying any file, locate it in this map. Build all items at lower levels first. If an item is not in this map, find its dependencies and determine its correct level before proceeding. The map is ordered, not the code.

> **Specification references.** Every level references the documentation file that specifies its content. Claude Code reads the specification before implementing. The specification is the contract; this map is the build order.

---

## Level 0 — Project Infrastructure

*Nothing can be built until Level 0 is complete. This is the foundation every file above rests on.*

| # | Item | Spec Reference | Verification |
|---|---|---|---|
| 0.1 | `package.json` — Next.js 15, TypeScript, Tailwind, all dependencies installed | 09_IMPLEMENTATION_PLAN.md §4.1 | `npm run dev` starts without errors |
| 0.2 | `tsconfig.json` — strict mode, path aliases (`@/components`, `@/lib`, `@/hooks`, `@/store`, `@/types`, `@/config`) | 09_IMPLEMENTATION_PLAN.md §4.1 | `tsc --noEmit` exits 0 |
| 0.3 | `tailwind.config.ts` — complete MARTAL design tokens | 04_DESIGN_SYSTEM.md §14.2 | `bg-brand-primary` renders `#8B1A2B` in browser |
| 0.4 | `next.config.ts` — image remote patterns, security headers | 06_ARCHITECTURE.md §15.2, §14.2 | `npm run build` exits 0 |
| 0.5 | `.env.example` — all variables present, values redacted | 11_OPERATIONS_RUNBOOK.md §3.2 | File committed with all 9 variables listed |
| 0.6 | `.env.local` — local dev values (staging WC or placeholder) | 11_OPERATIONS_RUNBOOK.md §3.4 | File gitignored, variables load in `process.env` |
| 0.7 | `src/` directory structure — all subdirectories created | 06_ARCHITECTURE.md §4.1 | All folders exist, no files yet |
| 0.8 | `vitest.config.ts` — test runner configured | 09_IMPLEMENTATION_PLAN.md §4.1 | `npm run test` runs with 0 tests (passes) |
| 0.9 | `playwright.config.ts` — E2E runner configured | 09_IMPLEMENTATION_PLAN.md §4.1 | `npx playwright test` runs with 0 tests (passes) |
| 0.10 | `.lighthouserc.json` — CI performance thresholds | 09_IMPLEMENTATION_PLAN.md §4.5 | Lighthouse CI command runs without config error |
| 0.11 | Vercel project linked, preview deployment live | 11_OPERATIONS_RUNBOOK.md §5.1 | Preview URL accessible from browser |
| 0.12 | GitHub Actions CI — typecheck + lint + build on PR | 09_IMPLEMENTATION_PLAN.md §5.3 | CI passes on initial empty commit |

**Level 0 Exit Criteria:**  
`npm run build` → exits 0  
`npm run test` → exits 0 (0 tests, no failures)  
Preview deployment URL is accessible  
`bg-brand-primary` renders the correct burgundy

---

## Level 1 — TypeScript Type System

*Types must exist before any implementation file that uses them. No file at Level 2 or above may use `any`.*

| # | File | Spec Reference | Key Types Defined |
|---|---|---|---|
| 1.1 | `src/types/woocommerce.ts` | 08_DATA_MODEL.md §9.1–9.4 | `WCProduct`, `WCProductVariation`, `WCProductImage`, `WCTerm`, `WCMetaData`, `WCAttribute`, `WCCategory`, `WCOrder` |
| 1.2 | `src/types/product.ts` | 08_DATA_MODEL.md §2.1–2.6 | `Product`, `ProductImage`, `ProductVariation`, `ProductAttribute`, `ProductSpecification`, `ProductReview`, `ProductSEO` |
| 1.3 | `src/types/brand.ts` | 08_DATA_MODEL.md §2.7 | `Brand`, `BrandConfig` |
| 1.4 | `src/types/cart.ts` | 08_DATA_MODEL.md §3.1–3.4 | `CartItem`, `Cart`, `WishlistItem`, `Wishlist` |
| 1.5 | `src/types/order.ts` | 08_DATA_MODEL.md §6.1–6.4 | `Order`, `OrderItem`, `StoredCustomer`, `OrderStatus` |
| 1.6 | `src/types/customer.ts` | 08_DATA_MODEL.md §4.1–4.4 | `Customer`, `CustomerAddress`, `CustomerProfile` |
| 1.7 | `src/types/search.ts` | 08_DATA_MODEL.md §7.1–7.6 | `SearchQuery`, `SearchResult`, `SearchSuggestionsResponse`, `SearchProductSuggestion`, `SearchBrandSuggestion`, `SearchColorSuggestion`, `TrendingSearch`, `RecentSearch` |
| 1.8 | `src/types/api.ts` | 10_API_CONTRACTS.md §3, §18 | `APIError`, `ValidationError`, `CheckoutError`, `WooCommerceError`, `PaginationState` |

**Dependencies:** Level 0 only  
**Level 1 Exit Criteria:**  
`tsc --noEmit` exits 0 with all type files present  
No cross-file circular type imports  
Zero `any` types in any file

---

## Level 2 — Constants & Application Configuration

*Constants are read by utilities, validators, integration layer, and stores. They have no dependencies beyond types.*

| # | File | Spec Reference | Key Exports |
|---|---|---|---|
| 2.1 | `src/lib/constants/brands.ts` | 04_DESIGN_SYSTEM.md §2.7, 05_CONTENT.md §3 | `BRAND_SLUGS`, `BRAND_CONFIG` (5 brands with tagline, heroBackgroundVariant, seoIntro) |
| 2.2 | `src/lib/constants/colors.ts` | 08_DATA_MODEL.md §10.2 | `COLORS_CONFIG` (color name → hex map), `ARABIC_COLOR_NAMES` (English → Arabic synonym) |
| 2.3 | `src/lib/constants/governorates.ts` | 08_DATA_MODEL.md §4.2 | `EGYPT_GOVERNORATES` (27 entries: code, nameAr, nameEn, deliveryDays) |
| 2.4 | `src/lib/constants/config.ts` | 08_DATA_MODEL.md §3.2, 10_API_CONTRACTS.md §11.4 | `FREE_SHIPPING_THRESHOLD = 800`, `STANDARD_SHIPPING_COST = 50`, `MAX_CART_QUANTITY = 10`, `MAX_CART_ITEMS = 50`, `MAX_WISHLIST_ITEMS = 100`, `MAX_RECENTLY_VIEWED = 20`, `MAX_RECENT_SEARCHES = 8` |
| 2.5 | `src/lib/constants/storage.ts` | 08_DATA_MODEL.md §12.1 | `STORAGE_CART = 'martal_cart_v2'`, `STORAGE_WISHLIST = 'martal_wishlist_v2'`, `STORAGE_ORDERS = 'martal_orders_v2'`, `STORAGE_ADDRESS = 'martal_address_v2'`, `STORAGE_RECENT_SEARCHES = 'martal_recent_searches_v2'`, `STORAGE_RECENTLY_VIEWED = 'martal_recently_viewed_v2'` |
| 2.6 | `src/lib/constants/trending.ts` | 08_DATA_MODEL.md §7.5 | `TRENDING_SEARCHES` (static array of `TrendingSearch`) |
| 2.7 | `src/lib/constants/routes.ts` | 06_ARCHITECTURE.md §3.2 | All route path constants: `ROUTES.HOME`, `ROUTES.SHOP`, `ROUTES.PRODUCT(slug)`, `ROUTES.BRAND(slug)`, etc. |
| 2.8 | `src/lib/constants/search.ts` | 10_API_CONTRACTS.md §6.1, 06_ARCHITECTURE.md §10.2 | `SEARCH_SYNONYMS` (Arabic ↔ English map), `EGYPT_PHONE_REGEX`, `BRAND_FILTER_PARAM = 'brand'`, `COLOR_FILTER_PARAM = 'color'` |
| 2.9 | `src/config/index.ts` | 11_OPERATIONS_RUNBOOK.md §3.2 | Typed `config` object reading all `process.env` values with validation on startup |

**Dependencies:** Level 0 (project), Level 1 (types)  
**Level 2 Exit Criteria:**  
All constants importable via `@/lib/constants/[name]`  
`EGYPT_GOVERNORATES.length === 27`  
`BRAND_SLUGS` contains exactly: `['hypnose', 'labella', 'fxeyes', 'elamore', 'iconic']`  
`COLORS_CONFIG['Brown']` returns a hex string

---

## Level 3 — Utility Functions

*Pure functions. No React, no state, no side effects. Testable in isolation.*

| # | File | Spec Reference | Key Exports |
|---|---|---|---|
| 3.1 | `src/lib/utils/currency.ts` | 08_DATA_MODEL.md §3.2 | `formatEGP(amount: number): string` → "450 جنيه", `parseWCPrice(str: string): number` → "450.00" to 450 |
| 3.2 | `src/lib/utils/phone.ts` | 08_DATA_MODEL.md §4.2, 10_API_CONTRACTS.md §17.4 | `normalizeEgyptianPhone(raw: string): string` → "+201012345678", `isValidEgyptianPhone(phone: string): boolean` |
| 3.3 | `src/lib/utils/slugify.ts` | 06_ARCHITECTURE.md §4.2 | `slugify(text: string): string` — URL-safe slug generation, Arabic-safe |
| 3.4 | `src/lib/utils/seo.ts` | 08_DATA_MODEL.md §15, 10_API_CONTRACTS.md §12 | `generateProductMeta(product: Product): PageMetadata`, `generateBrandMeta(brand: Brand): PageMetadata` |
| 3.5 | `src/lib/utils/price.ts` | 08_DATA_MODEL.md §3.2 | `computeShipping(subtotal: number): number`, `computeTotal(subtotal: number): number`, `computeFreeShippingProgress(subtotal: number): number`, `computeAmountToFreeShipping(subtotal: number): number` |
| 3.6 | `src/lib/utils/cart.ts` | 08_DATA_MODEL.md §3.1 | `computeCartSubtotal(items: CartItem[]): number`, `computeCartItemCount(items: CartItem[]): number`, `findCartItem(items: CartItem[], productId: number, variationId: number): CartItem | undefined` |
| 3.7 | `src/lib/utils/whatsapp.ts` | 05_CONTENT.md §15, 10_API_CONTRACTS.md §7.1 | `buildWhatsAppOrderFallback(customer, items): string`, `buildWhatsAppContactUrl(message: string): string` |

**Dependencies:** Level 0, Level 1 (types), Level 2 (constants)  
**Level 3 Exit Criteria:**  
`parseWCPrice("450.00")` returns `450` (number, not string)  
`normalizeEgyptianPhone("01012345678")` returns `"+201012345678"`  
`normalizeEgyptianPhone("1012345678")` returns `"+201012345678"` (leading 0 optional)  
`isValidEgyptianPhone("02012345678")` returns `false`  
`computeShipping(800)` returns `0`  
`computeShipping(799)` returns `50`  
All functions have Vitest unit tests

---

## Level 4 — Zod Validation Schemas

*Zod schemas depend on constants (for enums and regexes) and types (for inference). Validators are used by API routes, forms, and the integration layer.*

| # | File | Spec Reference | Key Exports |
|---|---|---|---|
| 4.1 | `src/lib/validations/woocommerce.ts` | 08_DATA_MODEL.md §11.4 | `WCProductSchema`, `WCVariationSchema`, `WCCategorySchema` — runtime validation of WC API responses |
| 4.2 | `src/lib/validations/checkout.ts` | 08_DATA_MODEL.md §11.1, 10_API_CONTRACTS.md §7.1 | `checkoutSchema` (full form validation), `CheckoutFormData` (inferred type) |
| 4.3 | `src/lib/validations/order.ts` | 08_DATA_MODEL.md §11.2, 10_API_CONTRACTS.md §7.1 | `orderRequestSchema` (API route server-side validation), `OrderRequest` (inferred type) |
| 4.4 | `src/lib/validations/contact.ts` | 08_DATA_MODEL.md §11.3 | `contactSchema`, `ContactFormData` (inferred type) |
| 4.5 | `src/lib/validations/search.ts` | 08_DATA_MODEL.md §11.6 | `searchQuerySchema` — validates `/api/search` query params |
| 4.6 | `src/lib/validations/address.ts` | 08_DATA_MODEL.md §11.5 | `addressSchema` — for account address form |

**Dependencies:** Level 0, Level 1 (types), Level 2 (constants — governorate enum, phone regex)  
**Level 4 Exit Criteria:**  
`checkoutSchema.safeParse({ phone: '01012345678', ...validFields })` → success  
`checkoutSchema.safeParse({ phone: '02012345678', ...validFields })` → failure with Arabic error message on `phone` field  
`checkoutSchema.safeParse({ governorate: 'NotAGovernorate', ...validFields })` → failure on `governorate` field  
`WCProductSchema.safeParse(mockWCProduct)` → success  
All schemas have Vitest tests for valid + invalid cases

---

## Level 5 — WooCommerce Integration Layer

*Server-only. No React. The boundary between MARTAL and WooCommerce. Nothing above this level calls WooCommerce directly.*

| # | File | Spec Reference | Key Exports |
|---|---|---|---|
| 5.1 | `src/lib/woocommerce/client.ts` | 06_ARCHITECTURE.md §7.2, 10_API_CONTRACTS.md §16.1–16.6 | `wcGet<T>(endpoint, params, options)`, `wcPost<T>(endpoint, body)`, `WooCommerceError` class — **must include `import 'server-only'`** |
| 5.2 | `src/lib/woocommerce/transformers.ts` | 08_DATA_MODEL.md §10, 10_API_CONTRACTS.md §17 | `transformProduct(wcProduct, wcVariations?)`, `transformVariation(wcVariation)`, `transformBrand(wcCategory, brandConfig)`, `buildWCOrderPayload(checkoutData, cartItems)` |
| 5.3 | `src/lib/woocommerce/products.ts` | 06_ARCHITECTURE.md §7.3, 10_API_CONTRACTS.md §4 | `getProducts(params)`, `getProduct(slug)`, `getProductVariations(productId)`, `getBestsellers(limit?)`, `getRelatedProducts(productId, limit?)`, `getProductsBySlug(slugs)` |
| 5.4 | `src/lib/woocommerce/brands.ts` | 10_API_CONTRACTS.md §5 | `getBrands()`, `getBrand(slug)` |
| 5.5 | `src/lib/woocommerce/categories.ts` | 10_API_CONTRACTS.md §4 | `getCategories()` |
| 5.6 | `src/lib/woocommerce/orders.ts` | 06_ARCHITECTURE.md §7.5, 10_API_CONTRACTS.md §7.1 | `createOrder(payload: WCOrderCreatePayload): Promise<{ orderId: number, orderNumber: string }>` |
| 5.7 | `src/lib/woocommerce/search.ts` | 06_ARCHITECTURE.md §10, 10_API_CONTRACTS.md §6.1 | `searchProducts(query: string, limit?: number): Promise<SearchSuggestionsResponse>`, `resolveQuery(raw: string): string` (synonym resolution) |

**Dependencies:** Level 0–4 (especially: types, constants, validators)  
**Critical rule:** `client.ts` must have `import 'server-only'` as its first import. Build will fail if this file is imported in any client component.

**Level 5 Exit Criteria:**  
`transformProduct(mockWCProduct)` returns `Product` with price as `number`, rating as `number`  
`transformProduct` resolves `brand` from categories array  
`transformProduct` resolves `badge` with priority: sale > bestseller > new  
`transformVariation` resolves `colorHex` from `COLORS_CONFIG`  
`transformVariation` falls back to `#C9B9A8` for unknown colors  
`resolveQuery('بني')` returns `'brown'`  
`resolveQuery('هيبنوز')` returns `'hypnose'`  
All transformer functions have Vitest unit tests with mock WC responses  
`import 'server-only'` confirmed present in `client.ts`

---

## Level 5M — MSW Mock Layer

*Mock Service Worker handlers that intercept WooCommerce API calls during Phase 1 (before real WooCommerce is connected). Runs in parallel with Level 5 — both must exist before Level 6.*

| # | File | Spec Reference | What It Mocks |
|---|---|---|---|
| 5M.1 | `src/mocks/data/products.ts` | 08_DATA_MODEL.md §9.1 | 8 mock `WCProduct` objects: 2 Hypnose (1 on sale), 2 Labella, 2 FXEyes, 1 ElAmore, 1 ICONIC. 1 product out of stock. |
| 5M.2 | `src/mocks/data/variations.ts` | 08_DATA_MODEL.md §9.2 | 3–4 color variations per product. Mixed prices. One variation out of stock per product. |
| 5M.3 | `src/mocks/data/brands.ts` | 08_DATA_MODEL.md §9.4 | 5 mock `WCCategory` objects matching brand slugs |
| 5M.4 | `src/mocks/data/reviews.ts` | 08_DATA_MODEL.md §2.6 | 3 mock reviews per product |
| 5M.5 | `src/mocks/handlers/products.ts` | 10_API_CONTRACTS.md §4 | Intercepts `GET /wp-json/wc/v3/products*` → returns mock products |
| 5M.6 | `src/mocks/handlers/orders.ts` | 10_API_CONTRACTS.md §7.1 | Intercepts `POST /wp-json/wc/v3/orders` → returns `{ id: 9999, number: "ORD-9999" }` |
| 5M.7 | `src/mocks/handlers/search.ts` | 10_API_CONTRACTS.md §6.1 | Intercepts `GET /wp-json/wc/v3/products?search=*` → returns filtered mock products |
| 5M.8 | `src/mocks/handlers/categories.ts` | 10_API_CONTRACTS.md §5 | Intercepts `GET /wp-json/wc/v3/products/categories*` → returns mock brands |
| 5M.9 | `src/mocks/server.ts` | 09_IMPLEMENTATION_PLAN.md §9 Phase 1 | MSW node server for API routes and server components |
| 5M.10 | `src/mocks/browser.ts` | 09_IMPLEMENTATION_PLAN.md §9 Phase 1 | MSW browser service worker for client components |
| 5M.11 | `src/mocks/index.ts` | — | Re-exports; environment detection (node vs browser) |

**Dependencies:** Level 1 (types — mock data must be typed as `WCProduct`, not `any`)  
**Level 5M Exit Criteria:**  
Mock data passes `WCProductSchema.safeParse()` for every mock product  
Mock products include: 1 on sale, 1 out of stock, 2 with bestseller tag  
`transformProduct(MOCK_PRODUCTS[0])` returns a valid `Product` with no TypeScript errors

---

## Level 6 — Zustand State Stores

*Client-side state. Depends on types and constants. Nothing at Level 7+ touches localStorage or manages cart/wishlist state except through these stores.*

| # | File | Spec Reference | Actions & Selectors |
|---|---|---|---|
| 6.1 | `src/store/cart.store.ts` | 08_DATA_MODEL.md §13.1, 10_API_CONTRACTS.md §11 | Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `syncPrices`. Selectors: `itemCount()`, `subtotal()`, `hasItem()`, `getItem()`. Persisted to `STORAGE_CART`. |
| 6.2 | `src/store/wishlist.store.ts` | 08_DATA_MODEL.md §13.2, 10_API_CONTRACTS.md §12 | Actions: `toggle`, `clear`. Selectors: `has()`, `count()`, `slugs()`. Persisted to `STORAGE_WISHLIST`. |
| 6.3 | `src/store/ui.store.ts` | 08_DATA_MODEL.md §13.3, 10_API_CONTRACTS.md §13 | Actions: `openSearch`, `closeSearch`, `openCartDrawer`, `closeCartDrawer`, `openFilterDrawer`, `closeFilterDrawer`, `openQuickView`, `closeQuickView`, `addToRecentlyViewed`. Ephemeral except `recentlyViewed` (persisted to `STORAGE_RECENTLY_VIEWED`). |

**Dependencies:** Level 0–2 (types, constants — especially `STORAGE_*` keys and `MAX_*` limits)  
**Authorized writers rule** (from 10_API_CONTRACTS.md §11.1): CartStore mutations are only called by `AddToCartButton`, `CartItem` (quantity/remove), and `WishlistToolbar`. This constraint is enforced by code review, not the type system.

**Level 6 Exit Criteria:**  
`CartStore.addItem(mockItem)` → item appears in store, `STORAGE_CART` updated in localStorage  
`CartStore.addItem(mockItem)` called twice → quantity = 2 (not two items)  
`CartStore.addItem(mockItem)` with existing qty 10 → quantity stays at 10  
`CartStore.clearCart()` → items = [], localStorage cleared  
`CartStore.subtotal()` = sum of (price × quantity) across all items  
Store state survives `localStorage` deserialization (simulate page reload in test)  
Corrupted localStorage `martal_cart_v2` → store initializes empty without throwing  
`WishlistStore.toggle(slug)` → slug added; called again → slug removed  
All store actions have Vitest unit tests

---

## Level 7 — React Hooks

*Hooks wrap stores, localStorage, and TanStack Query. Components call hooks — never stores or `localStorage` directly.*

| # | File | Spec Reference | Returns |
|---|---|---|---|
| 7.1 | `src/hooks/useCart.ts` | 10_API_CONTRACTS.md §11 | Exposes CartStore actions and selectors. Thin wrapper for testability. |
| 7.2 | `src/hooks/useWishlist.ts` | 10_API_CONTRACTS.md §12 | Exposes WishlistStore actions and selectors. |
| 7.3 | `src/hooks/useSearch.ts` | 10_API_CONTRACTS.md §15.2 | `query`, `setQuery`, `suggestions`, `isLoading`, `recentSearches`, `addRecentSearch`, `clearRecentSearches`. Includes 200ms debounce. |
| 7.4 | `src/hooks/useLocalStorage.ts` | 08_DATA_MODEL.md §14 | `useLocalStorage<T>(key, initialValue)` → `[value, setValue]` with SSR safety and JSON parse error handling |
| 7.5 | `src/hooks/useDebounce.ts` | 09_IMPLEMENTATION_PLAN.md §6 step 34 | `useDebounce<T>(value, delay)` → debounced value |
| 7.6 | `src/hooks/useMediaQuery.ts` | 04_DESIGN_SYSTEM.md §6.2 | `useMediaQuery(query)` → boolean. Used for mobile/desktop responsive logic in Client Components. |
| 7.7 | `src/hooks/useRecentlyViewed.ts` | 08_DATA_MODEL.md §12.5 | Reads/writes UIStore `recentlyViewed`. Excludes current product slug. Returns `RecentlyViewedItem[]`. |
| 7.8 | `src/hooks/useFilters.ts` | 08_DATA_MODEL.md §8, 10_API_CONTRACTS.md §17 | Reads/writes URL search params for shop filters. Returns `{ filters, setFilter, removeFilter, clearFilters, activeFilterChips }`. |

**Dependencies:** Level 0–6 (especially: stores, localStorage constants, types)  
**Level 7 Exit Criteria:**  
`useDebounce` with 200ms delay: value does not update until 200ms after last change (Vitest + fake timers)  
`useLocalStorage` with corrupted JSON: returns `initialValue` without throwing  
`useSearch` debounces query before triggering TanStack Query  
All hooks that touch localStorage are SSR-safe (no `window` access during server render)

---

## Level 8 — TanStack Query Provider & React Query Setup

*Must exist before any component uses `useQuery` or `useMutation`. Single provider, root-level.*

| # | File | Spec Reference | Purpose |
|---|---|---|---|
| 8.1 | `src/providers/QueryProvider.tsx` | 06_ARCHITECTURE.md §9.2 | `QueryClient` with `refetchOnWindowFocus: false`, `staleTime: 5min`, `retry: 2`. Wraps children in `QueryClientProvider`. |
| 8.2 | `src/providers/AppProvider.tsx` | 06_ARCHITECTURE.md §4 | Composes all providers: `QueryProvider` + any future providers. Root-level composition point. |

**Dependencies:** Level 0 (TanStack Query installed)  
**Level 8 Exit Criteria:**  
`AppProvider` renders without errors  
`refetchOnWindowFocus: false` confirmed in QueryClient config

---

## Level 9 — Tailwind globals.css & Font Loading

*CSS custom properties and font variables must exist before any styled component.*

| # | File | Spec Reference | Purpose |
|---|---|---|---|
| 9.1 | `src/app/globals.css` | 04_DESIGN_SYSTEM.md §14.3 | CSS custom properties: `--font-cairo`, `--font-inter`, `--header-height: 60px`, `--announcement-height: 32px`, `--bottom-nav-height: 60px`. Base RTL resets. `.font-inter` class. `.pb-safe` utility. Arabic letter-spacing prevention rule. |

**Dependencies:** Level 0 (Tailwind configured)  
**Level 9 Exit Criteria:**  
`--font-cairo` variable accessible in browser dev tools  
`direction: rtl` set on body  
`letter-spacing: 0 !important` applied to `[dir="rtl"]` elements

---

## Level 10 — Root App Layout & Shell

*The layout wraps every page. Providers, fonts, RTL, language — all set here.*

| # | File | Spec Reference | Purpose |
|---|---|---|---|
| 10.1 | `src/app/layout.tsx` | 06_ARCHITECTURE.md §3.1, 04_DESIGN_SYSTEM.md §4.1 | Root layout: `<html lang="ar" dir="rtl">`, Cairo + Inter via `next/font/google`, `AppProvider` wrapper, global sticky layout structure |
| 10.2 | `src/app/not-found.tsx` | 05_CONTENT.md §14.1, 09_IMPLEMENTATION_PLAN.md §5 | 404 page in Arabic with CTAs to Home and Shop. Uses `ErrorState` (built later — placeholder initially) |
| 10.3 | `src/app/error.tsx` | 05_CONTENT.md §14.2 | Global error boundary in Arabic. WhatsApp CTA on 500 errors. |
| 10.4 | `src/app/loading.tsx` | 04_DESIGN_SYSTEM.md §8 | Global loading state — minimal, Arabic |
| 10.5 | `src/app/robots.ts` | 09_IMPLEMENTATION_PLAN.md §12, 06_ARCHITECTURE.md §13.4 | Disallow: `/api/`, `/checkout`, `/account`, `/order-success`. Sitemap link. |

**Dependencies:** Level 0–9 (fonts, globals.css, providers)  
**Level 10 Exit Criteria:**  
`<html lang="ar" dir="rtl">` visible in page source  
Cairo font loaded and rendering (visible in browser Network tab)  
`/robots.txt` returns correct disallow rules  
No TypeScript errors in layout files

---

## Level 11 — UI Primitive Components

*Shadcn/UI reskinned to MARTAL design tokens. No business logic. No domain knowledge.*

**Sub-level 11A — Base Primitives (no dependencies on each other)**

| # | Component | File | Spec Reference | Notes |
|---|---|---|---|---|
| 11A.1 | `Button` | `src/components/ui/Button.tsx` | 04_DESIGN_SYSTEM.md §10.1 | 4 variants: primary, secondary, ghost, text. 3 sizes. All states: default, hover, active, disabled, loading. Pill shape (`radius-full`). |
| 11A.2 | `IconButton` | `src/components/ui/IconButton.tsx` | 04_DESIGN_SYSTEM.md §10.1 | Round button for icon-only actions. 44px minimum touch target. |
| 11A.3 | `Badge` | `src/components/ui/Badge.tsx` | 04_DESIGN_SYSTEM.md §10.4 | 4 variants: bestseller, new, sale, outofstock. Arabic labels. |
| 11A.4 | `Input` | `src/components/ui/Input.tsx` | 04_DESIGN_SYSTEM.md §10.2 | All states. `type="tel"` support for phone fields. RTL-aware. |
| 11A.5 | `Textarea` | `src/components/ui/Textarea.tsx` | 04_DESIGN_SYSTEM.md §10.2 | Same states as Input. |
| 11A.6 | `Select` | `src/components/ui/Select.tsx` | 04_DESIGN_SYSTEM.md §10.2 | Native `<select>`. RTL: chevron on left side. |
| 11A.7 | `Skeleton` | `src/components/ui/Skeleton.tsx` | 04_DESIGN_SYSTEM.md §8 | Animated shimmer. Base primitive for all skeleton components. |
| 11A.8 | `ProgressBar` | `src/components/ui/ProgressBar.tsx` | 04_DESIGN_SYSTEM.md §8 | For FreeShippingProgress. Accepts `value: number` (0–1). |
| 11A.9 | `Separator` | `src/components/ui/Separator.tsx` | 04_DESIGN_SYSTEM.md §8 | Horizontal/vertical divider using `border-default` color. |

**Sub-level 11B — Overlay Primitives (depend on 11A)**

| # | Component | File | Spec Reference | Notes |
|---|---|---|---|---|
| 11B.1 | `Modal` | `src/components/ui/Modal.tsx` | 04_DESIGN_SYSTEM.md §9.7 | Backdrop, focus trap, Escape closes. Framer Motion scale-in. `radius-xl`. |
| 11B.2 | `Drawer` | `src/components/ui/Drawer.tsx` | 04_DESIGN_SYSTEM.md §9.6 | Side drawer. RTL: slides from left. Backdrop. Focus trap. |
| 11B.3 | `BottomSheet` | `src/components/ui/BottomSheet.tsx` | 04_DESIGN_SYSTEM.md §9.6, 03_WIREFRAMES.md §6 | Mobile bottom sheet. Framer Motion `y: 100% → 0`. Drag-to-dismiss with 30% threshold. `radius-xl` top corners. |
| 11B.4 | `Toast` | `src/components/ui/Toast.tsx` | 04_DESIGN_SYSTEM.md §10.1 | Success, error, info variants. Arabic messages. Auto-dismiss 3s. Position: top-center (mobile-safe). |

**Sub-level 11C — Navigation Primitives (depend on 11A)**

| # | Component | File | Spec Reference | Notes |
|---|---|---|---|---|
| 11C.1 | `Accordion` | `src/components/ui/Accordion.tsx` | 04_DESIGN_SYSTEM.md §8 | Single or multi-expand. Framer Motion height animation. RTL chevron direction. Used in Footer + FAQ. |
| 11C.2 | `Tabs` | `src/components/ui/Tabs.tsx` | 04_DESIGN_SYSTEM.md §8 | Underline-style tab indicator. Active tab `border-brand`. Used in ProductTabs + Account. |

**Dependencies:** Level 0 (Tailwind tokens), Level 9 (globals.css), Level 10 (root layout)  
**Level 11 Exit Criteria:**  
`Button` variant `primary` renders with `bg-brand-primary` (#8B1A2B)  
`Button` loading state does not change button width (no layout shift)  
All overlay components trap focus correctly  
`BottomSheet` closes when dragged down ≥ 30% of height  
`prefers-reduced-motion` collapses all animations to 100ms opacity-only  
All components render without console errors at 375px

---

## Level 12 — Common Components

*Shared across all domains. No domain-specific knowledge.*

| # | Component | File | Spec Reference | Notes |
|---|---|---|---|---|
| 12.1 | `Container` | `src/components/common/Container.tsx` | 06_ARCHITECTURE.md §6.1 | 4 sizes: content (1280px), prose (720px), narrow (480px), full (100%). Centered with horizontal padding. |
| 12.2 | `SectionHeader` | `src/components/common/SectionHeader.tsx` | 03_WIREFRAMES.md §5 | title (required), subtitle (optional), linkLabel + linkHref for "see all". H2 heading. |
| 12.3 | `Breadcrumb` | `src/components/common/Breadcrumb.tsx` | 03_WIREFRAMES.md §3 | Accepts `items: { label: string, href?: string }[]`. Last item not linked. RTL separator. |
| 12.4 | `EmptyState` | `src/components/common/EmptyState.tsx` | 05_CONTENT.md §13, 03_WIREFRAMES.md | headline, body, ctaLabel + ctaHref or ctaOnClick, optional secondary CTA. Used in 7 contexts. |
| 12.5 | `ErrorState` | `src/components/common/ErrorState.tsx` | 05_CONTENT.md §14 | headline, body, primaryAction, secondaryAction. Arabic copy. Used in error boundaries. |
| 12.6 | `SkeletonCard` | `src/components/common/SkeletonCard.tsx` | 07_COMPONENT_MAP.md §8.5 | **Must match `ProductCard` dimensions exactly** (3:4 image ratio + content area). Built after ProductCard dimensions are confirmed. |
| 12.7 | `CODBadge` | `src/components/common/CODBadge.tsx` | 05_CONTENT.md §12.2 | Renders "دفع عند الاستلام" trust signal. Used in cart drawer, cart page, checkout. |
| 12.8 | `OriginBadge` | `src/components/common/OriginBadge.tsx` | 05_CONTENT.md §12.1 | "مصنّع في كوريا" badge. Used in BrandHero and PDP TrustStrip. |
| 12.9 | `TrustBar` | `src/components/common/TrustBar.tsx` | 03_WIREFRAMES.md §5, 05_CONTENT.md §2.3 | 4 trust items: COD, Korean, Shipping, Returns. Horizontal on desktop, scrollable row on mobile. |
| 12.10 | `TrustStrip` | `src/components/common/TrustStrip.tsx` | 03_WIREFRAMES.md §7 | Inline 4-item horizontal strip for PDP. Compact version of TrustBar. |
| 12.11 | `WhatsAppFAB` | `src/components/common/WhatsAppFAB.tsx` | 03_WIREFRAMES.md §3 | Fixed bottom-right (RTL). 56×56px. `bg-whatsapp`. Opens WhatsApp via `NEXT_PUBLIC_WHATSAPP_NUMBER`. Positioned above MobileBottomNav. |
| 12.12 | `ReviewCard` | `src/components/common/ReviewCard.tsx` | 05_CONTENT.md §17.2 | Name + governorate + product variant + rating stars + body + date. Used in Homepage and PDP ReviewsTab. |
| 12.13 | `FAQAccordion` | `src/components/common/FAQAccordion.tsx` | 03_WIREFRAMES.md §15, 05_CONTENT.md §11 | Accepts `items`, `maxItems?`, `categoryFilter?`, `searchQuery?`. Teaser (3 items) and full variants via props. |
| 12.14 | `CTABanner` | `src/components/common/CTABanner.tsx` | 03_WIREFRAMES.md §5 | Full-width. headline, subheadline, ctaLabel, ctaHref. Used at bottom of Homepage. |
| 12.15 | `RatingStars` | `src/components/common/RatingStars.tsx` | 07_COMPONENT_MAP.md §5.2 | Accepts `rating: number` (0–5), `count?: number`. Server Component. Shared by ProductCard and PDP. |

**Dependencies:** Level 11 (UI primitives), Level 10 (layout/root)  
**SkeletonCard note:** Build SkeletonCard (12.6) only after ProductCard dimensions are confirmed in Level 15. Initially use a placeholder at Level 12; replace with correct dimensions at Level 15.

---

## Level 13 — Layout Shell Components

*Application frame. Appears on every page. Depends on common components and stores.*

| # | Component | File | Spec Reference | Notes |
|---|---|---|---|---|
| 13.1 | `AnnouncementBar` | `src/components/layout/AnnouncementBar.tsx` | 03_WIREFRAMES.md §3, 05_CONTENT.md §2.1 | CSS marquee (`animation-marquee` from Tailwind config). 4 rotating Arabic trust messages. Server Component. |
| 13.2 | `NavLinks` | `src/components/layout/NavLinks.tsx` | 03_WIREFRAMES.md §4 | Desktop nav links. Shop dropdown, Brands dropdown. Server Component. Active state via `usePathname`. |
| 13.3 | `NavActions` | `src/components/layout/NavActions.tsx` | 07_COMPONENT_MAP.md §4 | Cart icon + count badge, Wishlist icon + count, Search trigger. **Client Component.** Reads CartStore, WishlistStore, dispatches UIStore. |
| 13.4 | `Navbar` | `src/components/layout/Navbar.tsx` | 03_WIREFRAMES.md §4 | Desktop. RTL: logo right, nav center, actions left. Sticky. Shadow on scroll. Composes NavLinks + NavActions. |
| 13.5 | `MobileHeader` | `src/components/layout/MobileHeader.tsx` | 03_WIREFRAMES.md §4 | Hamburger (left) + centered logo + search + cart. **Client Component.** Reduces height after 60px scroll. |
| 13.6 | `MobileBottomNav` | `src/components/layout/MobileBottomNav.tsx` | 03_WIREFRAMES.md §3, 07_COMPONENT_MAP.md §3 | Fixed bottom, 60px height. 5 tabs: Home, Shop, Search, Wishlist, Account. RTL tab order. `usePathname` for active tab. |
| 13.7 | `Footer` | `src/components/layout/Footer.tsx` | 03_WIREFRAMES.md §3, 05_CONTENT.md §2.10 | Desktop: 4-column. Mobile: accordion link groups. Trust badges. Server Component. |
| 13.8 | `MinimalHeader` | `src/components/layout/MinimalHeader.tsx` | 03_WIREFRAMES.md §11 | Logo only. Used exclusively in checkout layout. Server Component. |
| 13.9 | `PageShell` | `src/components/layout/PageShell.tsx` | 07_COMPONENT_MAP.md §3.8 | Adds top padding to account for sticky header height. `padding-top: var(--scroll-padding-top)`. |

**Dependencies:** Level 11 (UI primitives), Level 12 (common — WhatsAppFAB), Level 6 (stores — NavActions, MobileBottomNav), Level 8 (providers)  
**Level 13 Exit Criteria:**  
Navbar renders with logo on the RIGHT (RTL verified)  
Navigation items read right-to-left  
Cart count badge updates when item is added to CartStore  
MobileBottomNav active tab highlights on route change  
`MobileBottomNav` is not visible on desktop (hidden via Tailwind breakpoint)  
`AnnouncementBar` marquee scrolls continuously

---

## Level 14 — Full App Shell (layout.tsx integrates all Level 13)

*The layout.tsx update that wires all layout components into the running application.*

| # | File | Change | Notes |
|---|---|---|---|
| 14.1 | `src/app/layout.tsx` (update) | Add: AnnouncementBar, Navbar, MobileHeader, MobileBottomNav, Footer, WhatsAppFAB inside AppProvider | Server Components inside, Client Components (NavActions, MobileHeader, MobileBottomNav) are leaf nodes |
| 14.2 | `src/app/(commerce)/checkout/layout.tsx` | MinimalHeader only. No footer. No bottom nav. | Checkout-specific layout overriding root |

**Level 14 Exit Criteria:**  
Homepage renders with Navbar, AnnouncementBar, Footer, WhatsAppFAB, MobileBottomNav  
Checkout route uses MinimalHeader only (no footer, no bottom nav)  
`<html lang="ar" dir="rtl">` still present  
No layout shift during font loading  
Lighthouse CLS < 0.1

---

## Level 15 — Product Domain Components

*Order is strict within this level — each component depends on the previous.*

| # | Component | File | Spec Reference | Depends On |
|---|---|---|---|---|
| 15.1 | `ProductBadge` | `src/components/product/ProductBadge.tsx` | 04_DESIGN_SYSTEM.md §10.4 | Level 11 (Badge). Server Component. Priority rule: sale > bestseller > new > null. |
| 15.2 | `PriceDisplay` | `src/components/product/PriceDisplay.tsx` | 04_DESIGN_SYSTEM.md §3.4 | Level 11. **Client Component.** Current price in `text-brand`, struck old price. Inter numerals. |
| 15.3 | `WishlistToggle` | `src/components/product/WishlistToggle.tsx` | 07_COMPONENT_MAP.md §21 Rule 5 | Level 11 (IconButton), Level 7 (useWishlist). **Client Component. Only authorized writer to WishlistStore.** Heart icon, 32px tap area. |
| 15.4 | `SoldCount` | `src/components/product/SoldCount.tsx` | 05_CONTENT.md §18.3 | Level 12 (none — pure display). Server Component. "+831 وصلت لبيوتهم ✓" |
| 15.5 | `ColorSwatch` | `src/components/product/ColorSwatch.tsx` (internal) | 04_DESIGN_SYSTEM.md §11.5 | Level 11. Single swatch circle. 18px (card) or 28px (PDP). `aria-label`, `aria-pressed`. |
| 15.6 | `ColorSwatches` | `src/components/product/ColorSwatches.tsx` | 07_COMPONENT_MAP.md §7, 10_API_CONTRACTS.md | Level 15.5. **Client Component.** Controlled: `selectedVariationId`, `onSelect`. maxVisible prop for "+N" overflow. |
| 15.7 | `QuantitySelector` | `src/components/product/QuantitySelector.tsx` | 03_WIREFRAMES.md §7 | Level 11 (IconButton). **Client Component.** Min 1, max 10. − and + buttons with aria-labels. |
| 15.8 | `ProductCard` | `src/components/product/ProductCard.tsx` | 07_COMPONENT_MAP.md §8, 04_DESIGN_SYSTEM.md §11 | **Level 15.1–15.6.** 3:4 aspect ratio image. 8 context configurations via props. **Client Component** (needs WishlistStore). **CRITICAL MILESTONE.** |
| 15.9 | `SkeletonCard` (update) | `src/components/common/SkeletonCard.tsx` | 07_COMPONENT_MAP.md §8.5 | **Update placeholder from Level 12 with exact ProductCard dimensions.** Must match 3:4 + content area pixel-perfectly. |
| 15.10 | `ProductGallery` | `src/components/product/ProductGallery.tsx` | 03_WIREFRAMES.md §7 | Level 11 (Skeleton). **Client Component.** Desktop: thumbnail strip + main image + hover zoom. Mobile: Framer Motion drag carousel + dot indicators. Updates on color selection. |
| 15.11 | `ProductTabs` | `src/components/product/ProductTabs.tsx` | 03_WIREFRAMES.md §7 | Level 11 (Tabs). **Client Component** (tab switching). Contains 4 Server Component tab content panels. |
| 15.12 | `SpecificationsTable` | `src/components/product/SpecificationsTable.tsx` | 05_CONTENT.md §4.5 | Level 12 (Separator). Server Component. Arabic labels, spec values from `ProductSpecification[]`. |
| 15.13 | `ProductBenefits` | `src/components/product/ProductBenefits.tsx` | 05_CONTENT.md §4.4 | Level 11. Server Component. 4–5 bullet points from product attributes. |
| 15.14 | `DeliveryEstimate` | `src/components/product/DeliveryEstimate.tsx` | 05_CONTENT.md §4.7 | Level 2 (governorates constant). Server Component. Static Arabic copy with delivery time ranges. |
| 15.15 | `StickyMobilePDPBar` | `src/components/product/StickyMobilePDPBar.tsx` | 03_WIREFRAMES.md §7, 07_COMPONENT_MAP.md §7 | Level 11 (Button), Level 7 (useCart). **Client Component.** Intersection Observer on primary CTA: hidden when visible, shown when scrolled past. Price + color on start, AddToCartButton on end. |
| 15.16 | `RelatedProducts` | `src/components/product/RelatedProducts.tsx` | 03_WIREFRAMES.md §7 | Level 15.8 (ProductCard), Level 12 (SectionHeader). Server Component shell. 4-card grid. |
| 15.17 | `RecentlyViewed` | `src/components/product/RecentlyViewed.tsx` | 03_WIREFRAMES.md §7 | Level 15.8 (ProductCard), Level 7 (useRecentlyViewed). **Client Component.** Hidden if empty. Excludes current product. |

**Level 15 Exit Criteria:**  
`ProductCard` renders at 375px with 3:4 image ratio and no overflow  
`ProductCard` wishlist toggle reflects WishlistStore state  
`ProductCard` shows correct badge by priority (sale over bestseller)  
`SkeletonCard` dimensions match `ProductCard` exactly (verified with dev tools)  
Color swatch selection on PDP updates gallery and price simultaneously  
`StickyMobilePDPBar` appears only when primary Add-to-Cart is scrolled out of viewport  
Framer Motion gallery swipe works on iOS Safari and Android Chrome (real device test)  
All `prefers-reduced-motion` checks in place on all animated components

---

## Level 16 — Shop Domain Components

| # | Component | File | Spec Reference | Notes |
|---|---|---|---|---|
| 16.1 | `ProductGrid` | `src/components/shop/ProductGrid.tsx` | 07_COMPONENT_MAP.md §6 | Layout shell only. Receives children (ProductCards). Server Component. 2 cols mobile, 3 tablet, 4 desktop. |
| 16.2 | `FilterChip` | `src/components/shop/FilterChip.tsx` | 04_DESIGN_SYSTEM.md §10.5 | Single active filter chip. Label + × remove. `brand-primary-subtle` background. Client Component. |
| 16.3 | `ActiveFilters` | `src/components/shop/ActiveFilters.tsx` | 03_WIREFRAMES.md §6 | Horizontal scrollable chip row. Reads + writes URL params via `useFilters`. "Clear all" chip. Client Component. |
| 16.4 | `SortDropdown` | `src/components/shop/SortDropdown.tsx` | 03_WIREFRAMES.md §6 | Native select. 5 sort options. Writes `sort` URL param. Client Component. |
| 16.5 | `ShopToolbar` | `src/components/shop/ShopToolbar.tsx` | 03_WIREFRAMES.md §6 | Result count + SortDropdown + FilterTrigger (mobile). Client Component. |
| 16.6 | `FilterSection` | `src/components/shop/FilterSection.tsx` (internal) | 03_WIREFRAMES.md §6 | Collapsible filter group (brand, color, price, flags). Accordion-based. |
| 16.7 | `FilterSidebar` | `src/components/shop/FilterSidebar.tsx` | 03_WIREFRAMES.md §6 | Desktop. 260px fixed width. Right side (RTL). All filter sections + Reset. Reads/writes URL params. Client Component. |
| 16.8 | `FilterDrawer` | `src/components/shop/FilterDrawer.tsx` | 03_WIREFRAMES.md §6 | Mobile BottomSheet. Same filter content as sidebar. Apply Filters + Reset buttons sticky at bottom. Client Component. |
| 16.9 | `LoadMoreButton` | `src/components/shop/LoadMoreButton.tsx` | 03_WIREFRAMES.md §6 | "عرض المزيد". Appends `?page=N` URL param. Client Component. |
| 16.10 | `EmptyShopState` | `src/components/shop/EmptyShopState.tsx` | 05_CONTENT.md §13.5 | EmptyState + 4 bestseller ProductCards as suggestions. Client Component. |
| 16.11 | `QuickViewModal` | `src/components/shop/QuickViewModal.tsx` | 03_WIREFRAMES.md §6 | Modal with product image, color swatches, price, Add to Cart. Reads UIStore.quickViewProduct. Client Component. |

**Dependencies:** Level 15 (ProductCard), Level 12 (EmptyState), Level 11 (Modal, BottomSheet), Level 7 (useFilters, useCart), Level 6 (UIStore)

---

## Level 17 — Cart Domain Components

| # | Component | File | Spec Reference | Notes |
|---|---|---|---|---|
| 17.1 | `CartItem` | `src/components/cart/CartItem.tsx` | 03_WIREFRAMES.md §10, 07_COMPONENT_MAP.md §10 | 2 variants: `drawer` (compact) and `page` (full). Quantity selector + remove. **Authorized writer to CartStore** (qty/remove). |
| 17.2 | `FreeShippingProgress` | `src/components/cart/FreeShippingProgress.tsx` | 03_WIREFRAMES.md §10, 05_CONTENT.md §6.2 | ProgressBar + Arabic message. Reads CartStore.subtotal(). 3 message variants by proximity to threshold. |
| 17.3 | `CartSummary` | `src/components/cart/CartSummary.tsx` | 03_WIREFRAMES.md §10 | Subtotal, shipping, total rows. CODBadge. Reads CartStore. |
| 17.4 | `EmptyCartState` | `src/components/cart/EmptyCartState.tsx` | 05_CONTENT.md §13.1 | EmptyState with shop CTAs. |
| 17.5 | `CartDrawer` | `src/components/cart/CartDrawer.tsx` | 03_WIREFRAMES.md §4 | Drawer (RTL: slides from left). CartItem list, FreeShippingProgress, CartSummary, CODBadge, Checkout button. Reads UIStore.cartDrawerOpen. |

**Dependencies:** Level 15 (ProductCard for thumbnails), Level 12 (EmptyState, CODBadge), Level 11 (Drawer), Level 6 (CartStore, UIStore), Level 7 (useCart)

---

## Level 18 — Brand Domain Components

| # | Component | File | Spec Reference | Notes |
|---|---|---|---|---|
| 18.1 | `BrandOriginBadge` | `src/components/brand/BrandOriginBadge.tsx` | 05_CONTENT.md §12.1 | "مصنّع في كوريا" badge. Variant of OriginBadge for brand hero context. Server Component. |
| 18.2 | `BrandCard` | `src/components/brand/BrandCard.tsx` | 03_WIREFRAMES.md §5, 04_DESIGN_SYSTEM.md §10.3 | 4:3 landscape. Brand name (Inter), Arabic tagline, product count, CTA. Server Component. `shadow-sm` → `shadow-md` + Y-4px hover. |
| 18.3 | `BrandHero` | `src/components/brand/BrandHero.tsx` | 03_WIREFRAMES.md §14, 05_CONTENT.md §3 | Brand name (H1, Inter), Arabic tagline, Arabic description, OriginBadge, CTA. Background variant from `Brand.heroBackgroundVariant`. Server Component. |
| 18.4 | `RelatedBrands` | `src/components/brand/RelatedBrands.tsx` | 03_WIREFRAMES.md §14 | Section header + BrandCard row (the other 4 brands). Server Component. |

**Dependencies:** Level 15 (ProductCard), Level 12 (OriginBadge, SectionHeader), Level 1 (Brand type)

---

## Level 19 — Commerce Pages

*Pages fetch server-side data and pass it to components. No direct WooCommerce calls in components.*

| # | Route | File | Rendering | Spec Reference | Notes |
|---|---|---|---|---|---|
| 19.1 | `/` | `src/app/(marketing)/page.tsx` | ISR 3600s | 03_WIREFRAMES.md §1 | HeroSection, TrustBar, ShopByLook, BrandShowcase, Bestsellers (via getBestsellers(8)), WhyMARTAL, Reviews, FAQPreview, CTABanner |
| 19.2 | `/shop` | `src/app/(shop)/shop/page.tsx` | SSR | 03_WIREFRAMES.md §2 | Reads URL params → getProducts(). FilterSidebar (desktop), ShopToolbar, ActiveFilters, ProductGrid, LoadMoreButton |
| 19.3 | `/brand/[slug]` | `src/app/(shop)/brand/[slug]/page.tsx` | ISR 3600s | 03_WIREFRAMES.md §14 | getBrand(slug) + getProducts({brand:slug}). BrandHero, BrandSEOContent, ProductGrid, RelatedBrands, FAQPreview. generateMetadata. JSON-LD BreadcrumbList. |
| 19.4 | `/product/[slug]` | `src/app/(shop)/product/[slug]/page.tsx` | ISR 300s | 03_WIREFRAMES.md §7 | getProduct(slug) + getProductVariations(). ProductGallery, ProductInfoPanel, ProductTabs, RelatedProducts, StickyMobilePDPBar. generateMetadata. JSON-LD Product schema. generateStaticParams (top 20). |
| 19.5 | `/product/[slug]/loading.tsx` | `src/app/(shop)/product/[slug]/loading.tsx` | — | 09_IMPLEMENTATION_PLAN.md | Skeleton layout matching PDP structure |
| 19.6 | `/cart` | `src/app/(commerce)/cart/page.tsx` | CSR | 03_WIREFRAMES.md §5 | Reads CartStore. CartTable (CartItem page variant), FreeShippingProgress, OrderSummaryPanel, EmptyCartState. Sticky checkout CTA on mobile. |
| 19.7 | `/wishlist` | `src/app/(commerce)/wishlist/page.tsx` | CSR | 03_WIREFRAMES.md §13 | Reads WishlistStore slugs → TanStack Query fetches Product[]. ProductGrid, WishlistToolbar, EmptyWishlistState. |
| 19.8 | `/account` | `src/app/(commerce)/account/page.tsx` | CSR | 03_WIREFRAMES.md §12 | Reads localStorage. AccountLayout, AccountTabBar/Sidebar, 4 tab content sections, LocalStorageBanner. |
| 19.9 | `/order-success` | `src/app/(commerce)/order-success/page.tsx` | CSR | 03_WIREFRAMES.md §11 | Reads URL params (orderId, orderNumber). Order confirmation copy, WhatsApp tracking link, Continue Shopping CTA. |
| 19.10 | `/search` | `src/app/(shop)/search/page.tsx` | SSR | 03_WIREFRAMES.md §9 | Reads `?q=` URL param → getProducts({search:q}). ProductGrid with results, filter/sort still available. |

**Dependencies:** Level 16–18 (all domain components), Level 5 (integration layer), Level 6 (stores)

---

## Level 20 — Checkout Domain + API Routes

| # | Item | File | Spec Reference | Notes |
|---|---|---|---|---|
| 20.1 | `GovernorateSelect` | `src/components/checkout/GovernorateSelect.tsx` | 08_DATA_MODEL.md §4.2 | Native `<select>` with 27 governorates from constant. RTL. RHF-compatible. |
| 20.2 | `CheckoutFormField` | `src/components/checkout/CheckoutFormField.tsx` | 05_CONTENT.md §5.2 | label + Input/Select/Textarea + inline Arabic error message. RHF register. |
| 20.3 | `CODConfirmation` | `src/components/checkout/CODConfirmation.tsx` | 05_CONTENT.md §5.4 | Static: "ستدفعي عند الاستلام — لا دفع الآن". Server Component. |
| 20.4 | `OrderSummaryPanel` | `src/components/checkout/OrderSummaryPanel.tsx` | 03_WIREFRAMES.md §11 | Reads CartStore. Desktop: sticky sidebar. Mobile: `OrderSummaryAccordion`. `isReadOnly` prop for checkout (hides qty/remove). |
| 20.5 | `OrderReviewList` | `src/components/checkout/OrderReviewList.tsx` | 03_WIREFRAMES.md §11 | Read-only cart item list within checkout form. Edit cart link → `/cart`. |
| 20.6 | `CheckoutForm` | `src/components/checkout/CheckoutForm.tsx` | 10_API_CONTRACTS.md §7, 09_IMPLEMENTATION_PLAN.md §11 | RHF + Zod. 4 sections. WhatsApp fallback on error. Calls `/api/orders`. **Authorized caller of CartStore.clearCart().** |
| 20.7 | `/api/orders` route | `src/app/api/orders/route.ts` | — | 10_API_CONTRACTS.md §7.1 | POST only. Rate limit. Zod validate. OrderTransformer. `createOrder()`. Returns CheckoutResult or CheckoutError with whatsappFallback. |
| 20.8 | `/api/search` route | `src/app/api/search/route.ts` | — | 10_API_CONTRACTS.md §6.1 | GET only. Rate limit. Zod validate q param. `searchProducts()`. Returns SearchSuggestionsResponse. |
| 20.9 | `/api/contact` route | `src/app/api/contact/route.ts` | — | 10_API_CONTRACTS.md §8.1 | POST only. Rate limit. Zod validate. Build WhatsApp URL. |
| 20.10 | `/api/revalidate` route | `src/app/api/revalidate/route.ts` | — | 10_API_CONTRACTS.md §9.1 | POST only. `crypto.timingSafeEqual` secret check. `revalidatePath()`. |
| 20.11 | `/api/health` route | `src/app/api/health/route.ts` | — | 10_API_CONTRACTS.md §10.1 | GET only. WC connectivity check. Returns status JSON. |
| 20.12 | Checkout page | `src/app/(commerce)/checkout/page.tsx` | CSR | 03_WIREFRAMES.md §11 | Redirects to /shop if cart empty. CheckoutForm + OrderSummaryPanel. |
| 20.13 | Checkout layout | `src/app/(commerce)/checkout/layout.tsx` | — | 03_WIREFRAMES.md §11 | MinimalHeader. No footer. No bottom nav. |

**Dependencies:** Level 17 (CartStore for OrderSummary), Level 19 (pages exist), Level 4 (validation schemas), Level 5 (integration layer)

---

## Level 21 — Search Domain

| # | Component | File | Spec Reference | Notes |
|---|---|---|---|---|
| 21.1 | `SearchInput` | `src/components/search/SearchInput.tsx` | 03_WIREFRAMES.md §9 | Controlled. Autofocus on overlay open. Clear button. RTL text direction. |
| 21.2 | `RecentSearchItem` | `src/components/search/RecentSearchItem.tsx` | 03_WIREFRAMES.md §9 | Query text + clock icon + × remove. Tap repopulates input. |
| 21.3 | `RecentSearches` | `src/components/search/RecentSearches.tsx` | 03_WIREFRAMES.md §9 | RecentSearchItem list + "Clear all". Reads localStorage via useSearch hook. |
| 21.4 | `TrendingSearches` | `src/components/search/TrendingSearches.tsx` | 03_WIREFRAMES.md §9 | Static TRENDING_SEARCHES config. Fire icon. Tap → fills input + submits. |
| 21.5 | `SearchProductSuggestion` | `src/components/search/SearchProductSuggestion.tsx` | 10_API_CONTRACTS.md §6.1 | Thumbnail + name + brand + price. matchType highlight. |
| 21.6 | `SearchBrandSuggestion` | `src/components/search/SearchBrandSuggestion.tsx` | 10_API_CONTRACTS.md §6.1 | Brand name + tagline. Links to brand page. |
| 21.7 | `SearchColorSuggestion` | `src/components/search/SearchColorSuggestion.tsx` | 10_API_CONTRACTS.md §6.1 | Color swatch circle + Arabic name + product count. Links to `/shop?color=`. |
| 21.8 | `SearchSuggestions` | `src/components/search/SearchSuggestions.tsx` | 03_WIREFRAMES.md §9 | 3 labeled groups: منتجات, براندات, ألوان. TanStack Query via useSearch. Staggered fade-in. |
| 21.9 | `NoSearchResults` | `src/components/search/NoSearchResults.tsx` | 05_CONTENT.md §7.6 | Arabic "لا نتايج" + suggested queries + WhatsApp CTA. |
| 21.10 | `SearchOverlay` | `src/components/search/SearchOverlay.tsx` | 03_WIREFRAMES.md §9, 07_COMPONENT_MAP.md §9 | Mounted once in root layout. Reads UIStore.searchOpen. Full-screen mobile / panel desktop. 3 states: empty, active, no-results. Escape key closes. |

**Dependencies:** Level 15 (ProductCard for product suggestions), Level 20 (`/api/search` route), Level 7 (useSearch hook), Level 6 (UIStore)

---

## Level 22 — Content Pages (SSG)

| # | Route | File | Spec Reference |
|---|---|---|---|
| 22.1 | `/faq` | `src/app/(content)/faq/page.tsx` | 05_CONTENT.md §11, 03_WIREFRAMES.md §15. FAQAccordion with all 30+ questions. Category tabs. FAQ search. JSON-LD FAQPage schema. |
| 22.2 | `/about` | `src/app/(content)/about/page.tsx` | 05_CONTENT.md §2. Brand story. Mission. |
| 22.3 | `/contact` | `src/app/(content)/contact/page.tsx` | 05_CONTENT.md §10. ContactForm. WhatsApp + email cards. FAQ preview. |
| 22.4 | `/shipping-policy` | `src/app/(content)/shipping-policy/page.tsx` | 05_CONTENT.md §2.7. Prose layout. |
| 22.5 | `/returns` | `src/app/(content)/returns/page.tsx` | 05_CONTENT.md §2.7. Prose layout. |
| 22.6 | `/privacy-policy` | `src/app/(content)/privacy-policy/page.tsx` | 05_CONTENT.md §2.7. Prose layout. |
| 22.7 | `/terms` | `src/app/(content)/terms/page.tsx` | 05_CONTENT.md §2.7. Prose layout. |
| 22.8 | ContactForm component | `src/components/contact/ContactForm.tsx` | 05_CONTENT.md §10.3. RHF + contactSchema. Submits to `/api/contact`. |

**Dependencies:** Level 12 (FAQAccordion, EmptyState), Level 4 (contactSchema), Level 20 (`/api/contact`)

---

## Level 23 — SEO Infrastructure

| # | Item | File | Spec Reference |
|---|---|---|---|
| 23.1 | `generateMetadata` — all routes | (updates to Level 19–22 page files) | 06_ARCHITECTURE.md §13.1. Arabic title + description + OG + canonical on every page. |
| 23.2 | JSON-LD — Product pages | (update to Level 19.4) | 06_ARCHITECTURE.md §13.2. `Product` + `BreadcrumbList` schemas. |
| 23.3 | JSON-LD — Brand pages | (update to Level 19.3) | 06_ARCHITECTURE.md §13.2. `BreadcrumbList` schema. |
| 23.4 | JSON-LD — Homepage | (update to Level 19.1) | 06_ARCHITECTURE.md §13.2. `Organization` + `WebSite` schemas. |
| 23.5 | JSON-LD — FAQ page | (update to Level 22.1) | 06_ARCHITECTURE.md §13.2. `FAQPage` schema. |
| 23.6 | Sitemap | `src/app/sitemap.ts` | 06_ARCHITECTURE.md §13.3. Fetches all product slugs + brand slugs. |
| 23.7 | Robots (update) | `src/app/robots.ts` | Already at Level 10.5. Verify correct. |

---

## Level 24 — Monitoring & Analytics Integration

| # | Item | Spec Reference | Notes |
|---|---|---|---|
| 24.1 | Sentry initialization | 06_ARCHITECTURE.md §18.3 | `Sentry.init()` in `instrumentation.ts`. PII stripping in `beforeSend`. |
| 24.2 | GA4 events | 06_ARCHITECTURE.md §18.2 | `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `wishlist_add`, `search`, `whatsapp_click` events wired to correct user actions. |
| 24.3 | Microsoft Clarity | 11_OPERATIONS_RUNBOOK.md §7.1 | Script in `layout.tsx` head. |
| 24.4 | Vercel Analytics | 11_OPERATIONS_RUNBOOK.md §7.1 | `@vercel/analytics` package + `<Analytics />` in layout. |

---

## Level 25 — QA & Launch Readiness

| # | Item | Spec Reference |
|---|---|---|
| 25.1 | Vitest unit tests passing | 09_IMPLEMENTATION_PLAN.md §14.2. All P1 tests: transformers, stores, validators, checkout flow. |
| 25.2 | Playwright E2E: full checkout | 09_IMPLEMENTATION_PLAN.md §14.4. Complete order flow on MSW mocks. |
| 25.3 | Playwright E2E: search | 09_IMPLEMENTATION_PLAN.md §14.3. Arabic + English queries, recent searches. |
| 25.4 | Lighthouse CI ≥ 90 | 09_IMPLEMENTATION_PLAN.md §13.2. Homepage + PDP on mobile profile. |
| 25.5 | Security checklist | 09_IMPLEMENTATION_PLAN.md §15. All 26 items verified. |
| 25.6 | Accessibility checklist | 09_IMPLEMENTATION_PLAN.md §16. All 27 items verified. |
| 25.7 | Launch readiness checklist | 09_IMPLEMENTATION_PLAN.md §17. All 47 items checked. |

---

## Critical Path Summary

The five items that block the most downstream work:

```
Level 0 (Infrastructure)
  → blocks everything

Level 1 (Types)
  → blocks Level 2–25

Level 5 (WooCommerce transformers)
  → blocks all product data display

Level 15.8 (ProductCard)
  → blocks Level 16, 17, 18, 19, 21

Level 20.7 (/api/orders)
  → blocks checkout completion and revenue
```

**The minimum path to a working checkout (revenue-capable MVP):**

```
Level 0 → 1 → 2 → 3 → 4 → 5 → 5M → 6 → 7 → 8 → 9 → 10
→ 11A → 11B → 12 (skip 12.6 temporarily) → 13 → 14
→ 15.1 → 15.2 → 15.3 → 15.7 → 15.8 → 15.9
→ 17 → 19.1 → 19.4 → 19.6 → 20
```

That path produces: homepage, product page, cart, and checkout. Everything else is enhancement.

---

*This document is the dependency contract for Claude Code. Before creating any file, locate it in this map. Build from the lowest level upward. Never skip a level. The map is the order.*

*Last Updated: June 2026*  
*Repository: https://github.com/firoapo01/martal-2*
