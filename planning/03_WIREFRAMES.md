# 03 — WIREFRAMES
## MARTAL 2.0: UX Architecture & Page Structure

**Document Type:** UX Architecture / Wireframe Specification  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Pre-Design — Implementation Blueprint  
**Prepared by:** UX Architecture  
**Reads after:** 01_PROJECT_BRIEF.md, 02_STRATEGY.md  
**Reads before:** 04_DESIGN_SYSTEM.md  
**Audience:** Design, Frontend Engineering

> **Scope of this document.** This document defines information architecture, content hierarchy, component placement, user flows, and structural decisions only. It contains no color, typographic, spacing, animation, iconographic, or visual style specifications. All visual decisions belong in 04_DESIGN_SYSTEM.md. When this document says "button," it means an interactive element that triggers an action — not a styled component.

---

## Global Architecture Decisions

These decisions apply to every page and must be resolved before any individual page wireframe is implemented.

### Global Header (Navbar)

Present on every page. Two variants: desktop and mobile.

**Desktop header — left-to-right notation:**
```
[Logo] [Nav: Home | Shop | Brands | Offers | Contact] [Search icon] [Wishlist icon] [Cart icon + count] [Account icon]
```
**RTL implementation:** Logo sits on the right. Navigation flows right-to-left. Action icons (search, wishlist, cart, account) sit on the left. Cart count badge appears on the cart icon.

**Mobile header — left-to-right notation:**
```
[Hamburger menu] [Logo — centered] [Search icon] [Cart icon + count]
```
**RTL implementation:** Hamburger on the left, cart on the right (matching natural thumb reach in RTL). Logo centered. Wishlist and account icons move to the mobile bottom nav.

The header is sticky on scroll. On mobile, the header reduces height after the user scrolls past the announcement bar.

### Announcement Bar

Appears above the header on every page. Single scrolling row of trust messages: free shipping threshold, COD available, authentic Korean lenses, nationwide delivery. Auto-scrolls horizontally. Not dismissible — it is a permanent trust layer, not a promotional banner.

### Mobile Bottom Navigation

Fixed to the viewport bottom on mobile only. Five tabs:

```
[Home] [Shop] [Search] [Wishlist] [Account]
```

Cart is accessible via the header icon (top right on mobile), not the bottom nav. The bottom nav covers the five most-used navigation destinations. Active tab is visually indicated.

**RTL implementation:** Tab order reads right-to-left: Account | Wishlist | Search | Shop | Home.

### WhatsApp Floating Action Button (FAB)

Fixed position, bottom-left corner of the viewport on all pages. Always visible. Single tap opens WhatsApp with the MARTAL business number. Does not obscure the mobile bottom navigation — positioned above it with sufficient clearance.

**RTL implementation:** FAB moves to the bottom-right corner (the natural visual resting point in RTL layouts). However, since it must not conflict with the mobile bottom navigation and is a universally expected WhatsApp button, bottom-left is acceptable and avoids conflict with primary CTAs that often anchor bottom-right on mobile.

### Footer

Present on all pages except the checkout page (where it is hidden to reduce distraction). Two-column layout on desktop, single column stacked on mobile.

**Desktop footer — left-to-right notation:**
```
[Brand mark + tagline]    [Shop links]    [Help links]    [Legal links]
[Social links]            [COD badge]     [Shipping badge] [Authentic badge]
[Copyright line]
```

**Footer link groups:**
- Shop: All Products, Bestsellers, New Arrivals, Sale, Brands
- Help: FAQ, Contact, Shipping Policy, Returns & Exchanges
- Legal: Privacy Policy, Terms & Conditions, About MARTAL

**Mobile footer:** All link groups collapsed behind accordion toggles. Trust badges visible without expanding. Copyright line at the bottom.

---

## Page 1: Home (`/`)

### Page Purpose
**Business goal:** Convert first-time visitors from social media into active product browsers. Establish brand legitimacy in under 10 seconds.  
**User goal:** Understand what MARTAL is, see whether the products match their needs, and find a starting point for browsing.

### Primary User Questions on Arrival
- Is this a real, trustworthy brand or another random Instagram seller?
- Do they have the color or look I saw on social media?
- Can I pay on delivery?
- Do they deliver to where I live?
- Where do I start?

### Page Hierarchy

The homepage sections are sequenced to answer user questions in the order they arise. Trust first, then discovery, then social proof, then re-engagement.

1. Announcement Bar *(trust: COD + shipping + authenticity)*
2. Header / Navbar
3. Hero Section *(orientation: what is this?)*
4. Trust Bar *(trust: three core guarantees)*
5. Shop by Look *(discovery: browse by aesthetic outcome)*
6. Brand Showcase *(discovery: five brand lines with entry points)*
7. Bestsellers Grid *(social proof + discovery: what others are buying)*
8. Social Proof / Reviews *(social proof: real customer validation)*
9. FAQ Teaser *(pre-purchase anxiety reduction)*
10. Final CTA Banner *(re-engagement: return to shopping)*
11. Footer

**Rationale for this order:** A new visitor from TikTok or Instagram arrives skeptical. The announcement bar and trust bar answer "is this safe?" immediately. The hero section provides orientation. The look-based editorial and brand showcase answer "do they have what I want?" The bestsellers grid answers "what do other people buy?" The reviews answer "do customers trust them?" The FAQ teaser answers final doubts. The CTA banner catches anyone who has been reading but has not yet clicked into the shop.

### Desktop Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ ANNOUNCEMENT BAR — scrolling trust messages             │
├─────────────────────────────────────────────────────────┤
│ HEADER — Logo | Nav links | Search | Wishlist | Cart    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HERO — Full-width                                      │
│  Left column: Headline + subheadline + primary CTA      │
│  Right column: Hero image / product visual              │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ TRUST BAR — 3 columns                                   │
│ [COD icon + text] [Korean authentic] [Free shipping]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  SHOP BY LOOK — Section header + 4–6 look cards         │
│  [Natural] [Bridal] [Dramatic] [Everyday] [Bold]        │
│  Each card: look name + representative image + CTA      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  BRAND SHOWCASE — Section header + 5 brand cards        │
│  [Hypnose] [Labella] [FXEyes] [ElAmore] [ICONIC]        │
│  Each card: brand name + short tagline + CTA            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  BESTSELLERS — Section header + "View all" link         │
│  Product grid: 4 cards per row                          │
│  Cards show: image, brand, name, price, rating          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  REVIEWS — Section header                               │
│  3-column review cards: quote + name + rating stars     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  FAQ TEASER — 3 most common questions expanded          │
│  "See all FAQs" link at bottom                          │
├─────────────────────────────────────────────────────────┤
│  FINAL CTA BANNER — Full width                          │
│  Headline + "Shop Now" button                           │
├─────────────────────────────────────────────────────────┤
│ FOOTER                                                  │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout Structure

Sections stack in the same order. Key mobile-specific adjustments:

- **Hero:** Single column. Headline and CTA above the fold. Product visual below.
- **Trust bar:** Horizontally scrollable row of 3 badges, not a grid.
- **Shop by Look:** Horizontally scrollable card row. 1.5 cards visible to hint at more.
- **Brand Showcase:** Horizontally scrollable. 1.5 brand cards visible.
- **Bestsellers:** 2-column product grid. "View all" button below the grid.
- **Reviews:** Single-column stacked cards. Show 2 reviews, "Show more" expands.
- **FAQ Teaser:** Accordion, 3 questions. Each expands on tap.
- **Final CTA banner:** Full-width, stacked headline + button.

**Sticky elements on mobile:** Header (sticky top). WhatsApp FAB. Mobile bottom nav.

### Key Components
- AnnouncementBar
- Navbar (desktop) / MobileHeader
- HeroSection
- TrustBar
- SectionHeader (reusable: title + "see all" link)
- LookCard
- BrandCard
- ProductCard
- ReviewCard
- FAQAccordion (teaser variant — 3 items)
- CTABanner
- Footer
- WhatsAppFAB
- MobileBottomNav

### User Actions
- Click "Shop Now" CTA in hero → `/shop`
- Click a Look card → `/shop?look=[look-slug]`
- Click a Brand card → `/brand/[brand-slug]`
- Click a Product card → `/product/[slug]`
- Click "Add to Cart" on a product card → cart drawer opens
- Click "Save to Wishlist" on a product card → wishlist updated
- Click "View all" on Bestsellers → `/shop?sort=bestseller`
- Click FAQ question → expands inline
- Click "See all FAQs" → `/faq`
- Click WhatsApp FAB → WhatsApp opens

### Conversion Opportunities
- Hero CTA captures early intent from high-motivation arrivals
- Look cards channel users directly to relevant filtered shop views
- Bestsellers grid places the most conversion-proven products immediately in front of browsers
- "Add to Cart" directly from homepage product cards shortens the conversion path
- FAQ teaser resolves final doubts without requiring navigation away

---

## Page 2: Shop (`/shop`)

### Page Purpose
**Business goal:** Maximize product discovery and add-to-cart rate across the full catalog.  
**User goal:** Find the right product through browsing, filtering, or sorting — or confirm a specific known product.

### Primary User Questions
- Do they have my color?
- Which brand has the most natural options?
- What's on sale?
- How do I narrow this down?
- Can I see a quick preview before clicking in?

### Page Hierarchy
1. Header
2. Page Header / Breadcrumb
3. Active Filter Chips row
4. Toolbar (result count + sort selector + mobile filter trigger)
5. Layout: Sidebar filters (desktop) | Product grid
6. Pagination / Load More control
7. Empty / No-results state (conditional)
8. Footer

### Desktop Layout Structure

```
┌───────────────────────────────────────────────────────────────┐
│ HEADER                                                        │
├───────────────────────────────────────────────────────────────┤
│ PAGE HEADER — "المتجر" breadcrumb + active filter chips row   │
├──────────────────┬────────────────────────────────────────────┤
│                  │  TOOLBAR                                   │
│  FILTER SIDEBAR  │  [X results] [Sort: dropdown]             │
│                  ├────────────────────────────────────────────┤
│  Brands          │                                            │
│  □ Hypnose (N)   │  PRODUCT GRID — 3 columns                 │
│  □ Labella (N)   │  [Card] [Card] [Card]                     │
│  □ FXEyes (N)    │  [Card] [Card] [Card]                     │
│  □ ElAmore (N)   │  [Card] [Card] [Card]                     │
│  □ ICONIC (N)    │  ...                                      │
│                  │                                            │
│  Colors          ├────────────────────────────────────────────┤
│  ○ Brown         │  LOAD MORE / PAGINATION                   │
│  ○ Gray          │                                            │
│  ○ Honey         │                                            │
│  ○ Blue          │                                            │
│  ○ Green         │                                            │
│  ○ Violet        │                                            │
│                  │                                            │
│  Price Range     │                                            │
│  [slider]        │                                            │
│  0 — 600 EGP     │                                            │
│                  │                                            │
│  Flags           │                                            │
│  □ Bestseller    │                                            │
│  □ New           │                                            │
│  □ Sale          │                                            │
│  □ Monthly       │                                            │
│                  │                                            │
│  [Reset filters] │                                            │
└──────────────────┴────────────────────────────────────────────┘
```

**RTL implementation:** Sidebar appears on the right. Grid occupies the left. Breadcrumb reads right-to-left. Sort dropdown aligns to the left edge of the toolbar.

### Mobile Layout Structure

Sidebar is hidden. Replaced by:

1. **Filter trigger button** in toolbar: "تصفية" with active filter count badge
2. **Sort selector** inline in toolbar
3. **Active filter chips** row (horizontally scrollable, below toolbar)
4. **Product grid** — 2 columns
5. **Load More button** at bottom

Tapping "Filter" opens the **Filter Drawer** — a bottom sheet that slides up from the viewport bottom (not from the side), containing the full filter panel identical to the desktop sidebar. The drawer has a sticky "Apply Filters" button at the bottom and an "X" close control at the top.

**Filter Drawer structure:**
```
┌─────────────────────────────┐
│ [X close]   تصفية المنتجات  │
├─────────────────────────────┤
│ Brands section (expandable) │
│ Colors section (expandable) │
│ Price Range section         │
│ Flags section               │
├─────────────────────────────┤
│ [Reset]    [Apply Filters]  │
└─────────────────────────────┘
```

### Active Filter Chips

When any filter is applied, a horizontally scrollable chips row appears between the toolbar and the grid. Each chip shows the active filter value and an "×" removal control. A "Clear all" chip appears at the start of the row if more than one filter is active.

```
[× Hypnose]  [× Brown]  [× Bestseller]  [Clear all]
```

**Empty state:** If filters produce zero results:
- Hide the grid
- Show an empty state block: "لا توجد منتجات تطابق اختياراتك" + "Reset filters" button + 4 bestseller product cards as alternative suggestions

**No-search-results state:** When arriving from search with zero matching products:
- Same empty state block
- Additionally: "جربي البحث عن: [synonym suggestions]"
- Trending / bestseller products shown as alternatives

### Pagination vs. Infinite Scroll Decision

**Recommendation: Load More button (not infinite scroll, not numbered pagination).**

Rationale:
- Infinite scroll makes it impossible for users to return to a specific position after navigating to a PDP and pressing back — a critical flaw on mobile
- Numbered pagination on mobile is difficult to tap accurately and adds cognitive load
- "Load More" preserves scroll position, is easy to understand in Arabic ("عرض المزيد"), and loads the next batch without navigation

Each press of "Load More" appends the next page of results to the existing grid. WooCommerce REST API supports `per_page` and `page` parameters for this pattern.

### Key Components
- Navbar
- Breadcrumb
- FilterSidebar (desktop)
- FilterDrawer (mobile bottom sheet)
- FilterChip
- SortDropdown
- Toolbar
- ProductCard (with wishlist toggle, quick view trigger, add-to-cart)
- QuickViewModal
- LoadMoreButton
- EmptyState
- Footer

### Quick View Modal

Triggered by a "Quick View" button on each product card (visible on hover on desktop, always visible on mobile). Opens a modal overlay containing:
- Product name + brand
- Primary image + color swatches (selectable)
- Selected color price
- Add to Cart button
- "View full details" link → PDP
- Close button

Quick View does not replace the PDP — it is a preview shortcut to reduce navigation for users who want to evaluate a product without committing to a page load.

### User Actions
- Apply filter → grid updates, chips appear
- Remove chip → filter removed, grid updates
- Change sort → grid reorders
- Open Quick View → modal appears
- Add to Cart (from card or Quick View) → cart drawer opens
- Wishlist toggle → wishlist updated
- Click product card → PDP
- Load More → additional cards appended
- Open Filter Drawer (mobile) → bottom sheet slides up

---

## Page 3: Product Detail Page (`/product/[slug]`)

### Page Purpose
**Business goal:** Convert product evaluators into buyers. This is the single highest-impact page in the funnel.  
**User goal:** Gather sufficient information and confidence to place an order.

### Primary User Questions
- Does this look natural or theatrical?
- Which color suits me best?
- Is this safe and genuine?
- What do other people say?
- How much does delivery cost? When will it arrive?
- Can I pay on delivery?
- What if it doesn't suit me?

### Desktop Layout Structure

Two-column layout above the fold. Full-width sections below.

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├──────────────────────────────────────────────────────────────┤
│ BREADCRUMB: Home > Shop > [Brand] > [Product Name]          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  LEFT: GALLERY              │  RIGHT: PRODUCT INFO          │
│                             │                               │
│  [Main image — large]       │  Brand name                   │
│                             │  Product name (H1)            │
│  [Thumbnail 1][2][3][4]     │  Short subtitle               │
│                             │                               │
│                             │  Rating stars + review count  │
│                             │  Sold count                   │
│                             │                               │
│                             │  ── COLOR SELECTION ──        │
│                             │  [Swatch][Swatch][Swatch]     │
│                             │  Selected: Brown              │
│                             │                               │
│                             │  ── PRICE ──                  │
│                             │  New price   ~~Old price~~    │
│                             │  Discount badge               │
│                             │                               │
│                             │  ── QUANTITY ──               │
│                             │  [−] [1] [+]                  │
│                             │                               │
│                             │  [Add to Cart — primary]      │
│                             │  [Buy Now — secondary]        │
│                             │  [♡ Save to Wishlist]         │
│                             │                               │
│                             │  ── TRUST STRIP ──            │
│                             │  ✓ عدسات كورية أصلية 100%    │
│                             │  ✓ دفع عند الاستلام           │
│                             │  ✓ توصيل لكل المحافظات        │
│                             │  ✓ إرجاع واستبدال سهل        │
│                             │                               │
│                             │  ── DELIVERY ESTIMATE ──      │
│                             │  توصيل خلال 3–5 أيام عمل     │
│                             │                               │
├──────────────────────────────────────────────────────────────┤
│ PRODUCT TABS (full width)                                    │
│ [الوصف] [المواصفات] [طريقة الاستخدام] [التقييمات (N)]       │
│                                                              │
│  Tab content area                                            │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ RELATED PRODUCTS — Section header + 4-card grid             │
├──────────────────────────────────────────────────────────────┤
│ RECENTLY VIEWED — Section header + horizontal scroll row    │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**RTL implementation:** Gallery on the left becomes gallery on the right in RTL. Product info panel shifts to the left. Thumbnails scroll right-to-left. Tabs read right-to-left. Trust strip icon + text read right-to-left.

### Mobile Layout Structure (Recommended Order)

On mobile, the two-column layout collapses to a single column. The section order is critical for conversion:

1. Breadcrumb (compact, collapsible)
2. Image Gallery — full-width swipe carousel with dot indicators
3. Brand name + Product name
4. Rating stars + review count + sold count
5. Color swatches + selected color label
6. Price (current + old + discount badge)
7. Trust strip (4 inline items, horizontally scrollable)
8. Delivery estimate
9. Quantity selector
10. Add to Cart button (full-width)
11. Buy Now button (full-width)
12. Wishlist toggle (text link below buttons)
13. Product tabs (Description / Specs / How to Use / Reviews)
14. Related Products (horizontally scrollable card row)
15. Recently Viewed (horizontally scrollable card row)
16. Footer (collapsed)

**Sticky mobile bar:** A sticky bar anchored to the viewport bottom contains: selected color name + current price on the left, and a compact Add to Cart button on the right. The sticky bar is hidden when the primary Add to Cart button is visible in the viewport and appears when the user scrolls past it.

```
Sticky bar (mobile):
[Brown — 450 EGP]              [أضيفي للسلة]
```

### Gallery Behavior

**Desktop:** Main image occupies 60% of the left column. Thumbnail strip below (4–5 thumbnails). Clicking a thumbnail updates the main image. Hovering the main image enters a zoom mode (cursor-tracking zoom overlay).

**Mobile:** Full-width swipe carousel. Dot indicators at bottom of carousel showing position. Swiping changes the active image.

When the user selects a different color swatch, the gallery images update to show that color variant's images.

### Color Swatches

Each swatch is a circular tap target showing the color hex. The selected swatch has an active indicator. Below the swatch row: text label showing the currently selected color name. If a color variant is out of stock, its swatch is shown with a strikethrough indicator and is not tappable.

### Product Tabs — Content Specification

**Tab 1 — الوصف (Description):** Long-form product description. On-eye effect description. Intended aesthetic. Who this product is for.

**Tab 2 — المواصفات (Specifications):** Structured table:
- Water content
- Base curve
- Diameter
- Wearing duration (monthly)
- Origin (Korea)
- Packaging (pair)

**Tab 3 — طريقة الاستخدام (How to Use):** Step-by-step care and wearing instructions. Numbered list. Safety notes. Replacement schedule reminder.

**Tab 4 — التقييمات (Reviews):** Aggregate rating display (stars + average score + total count). Individual review cards: reviewer name, date, rating, written comment, product variant purchased. "Load more reviews" for pagination. Empty state if no reviews yet: "كوني أول من يقيّم هذا المنتج."

### Key Components
- Navbar
- Breadcrumb
- ProductGallery (desktop zoom + mobile carousel)
- ColorSwatches
- QuantitySelector
- AddToCartButton
- BuyNowButton
- WishlistToggle
- TrustStrip
- DeliveryEstimate
- ProductTabs
- SpecificationsTable
- ReviewCard
- ReviewAggregate
- RelatedProducts (grid)
- RecentlyViewed (horizontal scroll)
- StickyMobilePDPBar
- Footer

### User Actions
- Select color swatch → gallery updates, price updates, swatch label updates
- Change quantity → quantity updates, price total updates
- Add to Cart → cart drawer opens
- Buy Now → navigates directly to `/checkout` with this item
- Save to Wishlist → wishlist updated
- Switch tabs → tab content area updates
- Swipe gallery (mobile) → next/previous image
- Click related product → new PDP
- Click recently viewed product → new PDP

### Conversion Opportunities
- Color selection drives engagement and increases time-on-page before the CTA
- Trust strip placed immediately above Add to Cart reduces the last moment of hesitation
- Delivery estimate placed near the CTA answers the most common delay question without navigation
- Sticky mobile bar ensures the Add to Cart is always one tap away regardless of scroll position
- Reviews tab provides social proof for users who need peer validation before committing

---

## Page 4: Cart Drawer (Global Overlay)

### Purpose
**Business goal:** Give users immediate feedback on cart additions and a low-friction path to checkout without forcing a page navigation.  
**User goal:** See what's in the cart, confirm the addition, and decide whether to continue shopping or proceed.

### Trigger
The cart drawer opens automatically when a user adds a product from any surface: product card, PDP, Quick View modal, or Wishlist page.

### Drawer Structure

The cart drawer slides in from the right edge of the viewport on desktop, and slides up as a bottom sheet on mobile.

**RTL implementation:** On desktop, the drawer slides in from the left edge (the visual "end" of the page in RTL). On mobile, the drawer slides up from the bottom regardless of RTL — bottom sheets are direction-agnostic.

```
┌────────────────────────────┐
│ [X]  سلتي (3 منتجات)       │
├────────────────────────────┤
│ CART ITEMS                 │
│                            │
│ [img] Brand — Product name │
│        Color: Brown        │
│        [−][1][+]  450 EGP  │
│        [Remove link]       │
├────────────────────────────┤
│ [img] Brand — Product name │
│        Color: Gray         │
│        [−][2][+]  900 EGP  │
│        [Remove link]       │
├────────────────────────────┤
│ FREE SHIPPING PROGRESS     │
│ [====----] أضيفي 150 EGP  │
│ للحصول على شحن مجاني       │
├────────────────────────────┤
│ Subtotal:        1,350 EGP │
│ Shipping:        50 EGP    │
│ ─────────────────────────  │
│ Total:           1,400 EGP │
├────────────────────────────┤
│ [Proceed to Checkout ▶]    │
│ [Continue Shopping]        │
├────────────────────────────┤
│ COD badge: ستدفعين عند     │
│ الاستلام — لا دفع الآن     │
└────────────────────────────┘
```

### Free Shipping Progress Bar

If the cart subtotal is below the 800 EGP free shipping threshold, a progress bar shows proximity to the threshold. The messaging updates dynamically: "أضيفي [X] جنيه للحصول على شحن مجاني." When the threshold is met, the bar fills and the message changes to: "🎉 حصلتِ على شحن مجاني!"

This element is a direct AOV (Average Order Value) driver as established in the strategy (§7.1).

### Empty State

If the cart drawer is opened when the cart is empty:
```
[Cart empty illustration area]
سلتك فارغة
[Browse Products button → /shop]
```

### Key Components
- DrawerOverlay (backdrop)
- CartDrawer panel
- CartItem (mini: thumbnail + name + color + quantity selector + price + remove)
- FreeShippingProgress
- CartSummary (subtotal + shipping + total)
- CODBadge
- CheckoutButton
- ContinueShoppingButton (closes drawer)

### User Actions
- Increase/decrease item quantity → totals update
- Remove item → item removed, totals update, free shipping bar recalculates
- Click "Proceed to Checkout" → drawer closes, navigates to `/checkout`
- Click "Continue Shopping" → drawer closes, user stays on current page
- Click backdrop → drawer closes

---

## Page 5: Cart Page (`/cart`)

### Page Purpose
**Business goal:** Final order review before checkout. Upsell/AOV opportunity. Shipping threshold reinforcement.  
**User goal:** Review exactly what they are ordering, adjust if needed, and confirm intent before the checkout form.

### Desktop Layout Structure

Two-column layout: cart items on the left (wider), order summary on the right (sticky).

```
┌──────────────────────────────────────────────────┐
│ HEADER                                           │
├──────────────────────────────────────────────────┤
│ BREADCRUMB: Home > Cart                          │
├───────────────────────────────┬──────────────────┤
│ CART ITEMS (wider column)     │ ORDER SUMMARY    │
│                               │ (sticky sidebar) │
│ [img] Product name            │                  │
│ Brand | Color: Brown          │ Subtotal: X EGP  │
│ [−][1][+]   450 EGP  [Remove] │ Shipping: X EGP  │
│                               │ Total:   X EGP   │
│ [img] Product name            │                  │
│ Brand | Color: Gray           │ COD badge        │
│ [−][2][+]   900 EGP  [Remove] │                  │
│                               │ [→ Checkout]     │
│ FREE SHIPPING PROGRESS BAR    │                  │
│                               │ Returns policy   │
│                               │ link             │
│                               │                  │
│ [Continue Shopping link]      │                  │
└───────────────────────────────┴──────────────────┘
```

**RTL implementation:** Cart items column on the left becomes right in RTL. Summary sidebar on the right becomes left. Sidebar is sticky — it stays visible as the user scrolls the items column.

### Mobile Layout Structure

Single column. Order:
1. Breadcrumb
2. Cart items (stacked)
3. Free shipping progress bar
4. Order summary (subtotal + shipping + total)
5. COD badge
6. Proceed to Checkout button (full-width, sticky at bottom)
7. Continue Shopping link

**Sticky mobile element:** The "Proceed to Checkout" button is sticky at the viewport bottom on mobile to ensure it is always reachable.

### Empty Cart State

```
[Illustration area]
سلتك فارغة حالياً
[Browse the Shop → /shop]
[View Bestsellers → /shop?sort=bestseller]
```

### Key Components
- Navbar
- Breadcrumb
- CartItem (full version: thumbnail + name + brand + color + quantity selector + unit price + line total + remove)
- FreeShippingProgress
- OrderSummary (subtotal + shipping calculation + total)
- CODBadge
- CheckoutButton
- ContinueShoppingLink
- EmptyCartState
- Footer

---

## Page 6: Checkout (`/checkout`)

### Page Purpose
**Business goal:** Collect fulfillment information and confirm the order through WooCommerce.  
**User goal:** Complete the order as quickly and confidently as possible.

### Architecture Decision
Single-page checkout. No steps, no progress indicators, no multi-page flow. The page is logically divided into four visible sections that the user scrolls through, but all sections are present simultaneously. There is one CTA at the bottom: "تأكيد الطلب."

The footer is hidden on this page. The header shows only the logo (no navigation links) — this is a focused, distraction-free checkout environment.

### Desktop Layout Structure

Two-column layout: form on the left, order summary on the right (sticky).

```
┌──────────────────────────────────────────────────────┐
│ HEADER (logo only — no nav links)                    │
├──────────────────────────────────────────────────────┤
│ CHECKOUT HEADING: "إتمام الطلب"                      │
├─────────────────────────────┬────────────────────────┤
│ FORM COLUMN                 │ ORDER SUMMARY (sticky) │
│                             │                        │
│ Section 1: Customer Info    │ [Product thumbnails]   │
│ ─────────────────────────── │ Product name × qty     │
│ Full name (required)        │ Color variant          │
│ Phone number (required)     │ Price per item         │
│ [Egyptian format hint]      │                        │
│                             │ ──────────────────     │
│ Section 2: Shipping Details │ Subtotal: X EGP        │
│ ─────────────────────────── │ Shipping: X EGP        │
│ Governorate [dropdown ▾]    │ Total: X EGP           │
│ City / Area (text)          │                        │
│ Street address (required)   │ COD badge:             │
│ Building / Floor (optional) │ ستدفعين عند الاستلام   │
│ Additional notes (optional) │                        │
│                             │ Shipping policy link   │
│ Section 3: Order Review     │                        │
│ ─────────────────────────── │                        │
│ Compact item list (read     │                        │
│ only — name, color, qty,    │                        │
│ price)                      │                        │
│ [Edit cart link → /cart]    │                        │
│                             │                        │
│ Section 4: Confirmation     │                        │
│ ─────────────────────────── │                        │
│ COD confirmation statement  │                        │
│ "ستدفعين عند الاستلام —     │                        │
│  لا يوجد دفع الآن"         │                        │
│                             │                        │
│ [تأكيد الطلب — primary CTA] │                        │
│                             │                        │
└─────────────────────────────┴────────────────────────┘
```

### Mobile Layout Structure

Single column. The order summary collapses to an accordion at the top ("عرض ملخص الطلب ▾") — expandable but collapsed by default to minimize scroll length.

Form sections stack in order:
1. Order summary accordion (collapsed by default)
2. Customer Information fields
3. Shipping Details fields
4. Order Review (compact read-only list + "Edit cart" link)
5. COD confirmation statement
6. "Confirm Order" button (full-width, sticky at bottom)

**Sticky mobile element:** "تأكيد الطلب" button is sticky at the viewport bottom throughout the form scroll. This ensures the CTA is always one tap away.

### Form Fields Specification

| Field | Type | Required | Validation |
|---|---|---|---|
| Full name | Text input | Yes | Non-empty |
| Phone number | Tel input | Yes | Egyptian mobile format: 01X-XXXX-XXXX (10 or 11 digits, leading 0 or not) |
| Governorate | Select (dropdown) | Yes | 27 Egyptian governorates as options |
| City / Area | Text input | Yes | Non-empty |
| Street address | Text input | Yes | Non-empty |
| Building / Floor | Text input | No | — |
| Order notes | Textarea | No | — |

**Validation behavior:** Real-time validation on field blur (when user leaves a field). Error messages appear inline below the field in Arabic. Submission blocked until all required fields pass validation.

**Phone field:** The input type is `tel`. The keyboard hint shows numeric layout on mobile. The field accepts: 010XXXXXXXX, 011XXXXXXXX, 012XXXXXXXX, 015XXXXXXXX (all valid Egyptian mobile prefixes). Accept with or without leading zero.

### Post-Submission: Order Confirmation

On successful WooCommerce order POST, the user is redirected to `/order-success?id=[orderId]`.

The order confirmation page (not wireframed separately as it is a simple state) contains:
- Order number (large, prominent)
- "تم استلام طلبك بنجاح" confirmation message
- Summary: items ordered, total, delivery estimate
- WhatsApp link pre-filled with order number for tracking
- "Continue Shopping" → `/shop`
- Cart cleared from Zustand store

### Key Components
- MinimalHeader (logo only)
- CheckoutForm
- FormField (reusable: label + input + error)
- GovernorateDropdown
- OrderSummaryAccordion (mobile) / OrderSummarySticky (desktop)
- CODBadge
- OrderReviewList
- ConfirmOrderButton
- FormValidation

---

## Page 7: Search Modal (Global Overlay)

### Purpose
**Business goal:** Capture high-intent users who arrive knowing what they want, and convert them to PDP with minimum friction.  
**User goal:** Find a specific product, brand, or color quickly.

### Trigger
Tapping the search icon in the header (desktop or mobile). On mobile, also accessible from the bottom nav center tab.

### Structure and States

The search modal is a full-screen overlay on mobile. On desktop, it is a wide centered panel that appears below the header with a darkened backdrop.

#### State 1: Empty (No Input)

```
┌───────────────────────────────────────────────┐
│ [← Back / X]    [Search input field...]  [X]  │
├───────────────────────────────────────────────┤
│ RECENT SEARCHES                               │
│ ─────────────────                             │
│ 🕐 brown                               [×]    │
│ 🕐 hypnose gray                        [×]    │
│ 🕐 عسلي                                [×]    │
│ [Clear recent searches]                       │
├───────────────────────────────────────────────┤
│ TRENDING NOW                                  │
│ ─────────────────                             │
│ 🔥 Brown                                      │
│ 🔥 Hypnose                                    │
│ 🔥 Gray                                       │
│ 🔥 عروسة                                      │
│ 🔥 Honey                                      │
└───────────────────────────────────────────────┘
```

#### State 2: Active Input (Typing)

Suggestions appear as the user types, organized in three labeled groups:

```
┌───────────────────────────────────────────────┐
│ [← Back]        [brow_               ] [X]    │
├───────────────────────────────────────────────┤
│ PRODUCTS                                      │
│ [img] Hypnose — Brown          450 EGP        │
│ [img] Labella — Soft Brown     430 EGP        │
│ [img] FXEyes — Honey Brown     420 EGP        │
├───────────────────────────────────────────────┤
│ BRANDS                                        │
│ 🏷 Hypnose — عدسات طبيعية وأنيقة             │
├───────────────────────────────────────────────┤
│ COLORS                                        │
│ ○ Brown — 6 products                         │
│ ○ Honey — 3 products                         │
├───────────────────────────────────────────────┤
│ [See all results for "brow" →]                │
└───────────────────────────────────────────────┘
```

Suggestions update on each keystroke with a short debounce (150–200ms to avoid excessive API calls). Maximum 3 product suggestions, 2 brand suggestions, 3 color suggestions displayed in the overlay.

#### State 3: No Results

```
┌───────────────────────────────────────────────┐
│ [← Back]   [xyzabc                  ] [X]    │
├───────────────────────────────────────────────┤
│ لا توجد نتائج لـ "xyzabc"                    │
│                                               │
│ جربي: brown · gray · hypnose                 │
│                                               │
│ ─────────────────────────                     │
│ TRENDING PRODUCTS                             │
│ [Product cards — 4 bestsellers]               │
│                                               │
│ [تواصلي معنا على واتساب]                      │
└───────────────────────────────────────────────┘
```

### Arabic / English Input Handling

The search input field must support mixed Arabic/English input without mode switching. The keyboard language toggle on mobile changes between scripts — the field must accept both.

Search matching priority (established in brief §12.2):
1. Brand name (Arabic or English)
2. Color name (Arabic or English)
3. Product name
4. Synonym resolution (رمادي → gray, عسلي → honey, عروسة → bridal)

### Key Components
- SearchOverlay (full-screen on mobile, panel on desktop)
- SearchInput (autofocus on open)
- RecentSearchItem (with remove button)
- TrendingSearchItem
- SearchSuggestionProduct (mini: thumbnail + name + price)
- SearchSuggestionBrand
- SearchSuggestionColor
- SeeAllResultsLink
- NoResultsState
- WhatsAppCTA (in no-results state)

### User Actions
- Type query → suggestions update
- Tap a product suggestion → PDP
- Tap a brand suggestion → `/brand/[slug]`
- Tap a color suggestion → `/shop?color=[color]`
- Tap a recent search → repopulates input + triggers search
- Tap "See all results" or press Enter → `/search?q=[query]`
- Tap "×" on recent search → removes that item
- Tap "Clear recent searches" → clears all
- Tap backdrop or "×" close → overlay closes

---

## Page 8: Account (`/account`)

### Page Purpose
**Business goal:** Retention. Provide returning customers with their order history and enable frictionless repeat purchasing.  
**User goal:** Review past orders, confirm delivery address for next order, manage wishlist.

### v2.0 Architecture Note
This page is powered entirely by localStorage in v2.0. No authentication, no login, no session management. Data is scoped to the device and browser. The structure is forward-compatible with WooCommerce customer authentication in v2.1 — all data slots map to WooCommerce customer object fields.

A persistent banner at the top of the page communicates this clearly: "بياناتك محفوظة على هذا الجهاز فقط — سجّلي حسابك في النسخة القادمة للوصول من أي مكان."

### Layout Structure

Sidebar navigation (desktop) + content area. On mobile, sidebar collapses into a horizontal tab row at the top.

**Desktop — left-to-right notation:**
```
┌──────────────────────────────────────────────────┐
│ HEADER                                           │
├──────────────────────────────────────────────────┤
│ PAGE HEADER: "حسابي"                             │
├──────────────────┬───────────────────────────────┤
│ SIDEBAR NAV      │ CONTENT AREA                  │
│                  │                               │
│ > Orders         │ [Selected tab content]        │
│   Addresses      │                               │
│   Profile        │                               │
│   Wishlist       │                               │
│                  │                               │
└──────────────────┴───────────────────────────────┘
```

**RTL implementation:** Sidebar on the right. Content area on the left.

**Mobile tab row:**
```
[Orders] [Addresses] [Profile] [Wishlist]
```
Active tab content appears below.

### Tab 1: Orders

Ordered by most recent first. Each order is a card:

```
┌──────────────────────────────────────────┐
│ طلب #1042          12 يونيو 2026         │
│ ─────────────────────────────────────    │
│ [img] Hypnose Brown × 1    450 EGP       │
│ [img] Labella Gray × 2     900 EGP       │
│                                          │
│ الإجمالي: 1,350 EGP     COD             │
│ الحالة: قيد التوصيل                      │
│ [Contact via WhatsApp about this order]  │
└──────────────────────────────────────────┘
```

If no orders exist: "لم تقومي بأي طلبات بعد — [تصفحي المتجر]"

**Note:** In v2.0, order status is static (set at checkout). Dynamic status updates from WooCommerce come in v2.1 when authentication is implemented.

### Tab 2: Addresses

Displays the last-used delivery address (auto-populated from the most recent checkout). Editable inline.

```
┌────────────────────────────────────┐
│ عنوان التوصيل                      │
│ ──────────────                     │
│ نورهان أحمد                        │
│ 01012345678                        │
│ القاهرة — مدينة نصر                │
│ شارع عباس العقاد، عمارة 5، شقة 12 │
│                                    │
│ [Edit address]                     │
└────────────────────────────────────┘
```

If no address saved: "لا يوجد عنوان محفوظ — سيتم حفظ عنوانك تلقائياً بعد أول طلب."

### Tab 3: Profile

Display-only in v2.0 (name and phone from last checkout). No editing beyond address.

```
الاسم: نورهان أحمد
الهاتف: 01012345678
```

In v2.1, this tab will include email, password change, and notification preferences.

### Tab 4: Wishlist

Does not duplicate the Wishlist page — instead shows a compact grid of wishlisted items (same product cards) with a link: "عرض القائمة الكاملة → /wishlist."

### Key Components
- Navbar
- AccountSidebar (desktop) / AccountTabBar (mobile)
- LocalStorageBanner
- OrderCard
- AddressCard
- ProfileDisplay
- WishlistMiniGrid
- EmptyState (per tab)
- Footer

---

## Page 9: Wishlist (`/wishlist`)

### Page Purpose
**Business goal:** Convert deferred purchase intent into completed orders.  
**User goal:** Return to saved products and move them to cart when ready.

### Page Hierarchy
1. Header
2. Page header: "قائمة المفضلة" + item count
3. Batch actions toolbar: "Add all to cart" + "Clear wishlist"
4. Product grid
5. Empty state (conditional)
6. Footer

### Desktop Layout Structure

```
┌───────────────────────────────────────────────────┐
│ HEADER                                            │
├───────────────────────────────────────────────────┤
│ PAGE HEADER                                       │
│ المفضلة (5 منتجات)                               │
│ [Add all to cart]  [Clear wishlist]               │
├───────────────────────────────────────────────────┤
│ PRODUCT GRID — 4 columns                          │
│ [Card][Card][Card][Card]                          │
│ [Card][Card]                                      │
│ Each card: same ProductCard as Shop, but with     │
│ "Remove from wishlist" action replacing the       │
│ wishlist toggle                                   │
├───────────────────────────────────────────────────┤
│ FOOTER                                            │
└───────────────────────────────────────────────────┘
```

### Mobile Layout Structure

- 2-column product grid
- Batch actions in a horizontally scrollable toolbar above the grid
- Each card has a prominent remove button

### Empty State

```
[Illustration area]
لا توجد منتجات في قائمتك المفضلة
ابدئي بإضافة المنتجات التي تعجبك
[تصفحي المتجر → /shop]
```

### Key Components
- Navbar
- PageHeader with count
- WishlistToolbar (batch actions)
- ProductCard (wishlist variant: remove button prominent, add-to-cart button present)
- EmptyWishlistState
- Footer

### User Actions
- Add single item to cart → cart drawer opens
- Remove single item from wishlist → item removed, grid updates
- "Add all to cart" → all wishlisted items added to cart, cart drawer opens
- "Clear wishlist" → confirmation prompt → all items removed

---

## Page 10: Brand Page (`/brand/[slug]`)

### Page Purpose
**Business goal:** SEO landing page for brand-specific searches. Brand storytelling that builds product line loyalty.  
**User goal:** Understand what a specific brand stands for and browse its products.

### Page Hierarchy
1. Header
2. Brand Hero (full-width)
3. Filter chips (brand is pre-applied, locked — user cannot deselect it on this page)
4. Toolbar (result count + sort)
5. Product grid (pre-filtered to this brand)
6. Load More
7. Related brands (horizontal scroll: the other 4 brands)
8. Footer

### Brand Hero Structure

```
┌────────────────────────────────────────────────────┐
│ BRAND HERO — full-width                            │
│                                                    │
│ Brand name (large heading)                         │
│ Brand tagline                                      │
│ Origin badge: "صُنع في كوريا"                      │
│ Short brand description (2–3 lines)                │
│ [Shop [Brand] →]                                   │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Mobile:** Brand hero is condensed. Name, badge, short description, CTA. No image — text-forward to reduce load time.

### Product Grid

Identical to the Shop page grid but pre-filtered to this brand. The brand filter chip is shown but cannot be removed (it is the context of this page). Other filters (color, price, flags) remain fully functional.

### Related Brands

Horizontal scroll row showing the other 4 brand cards at the bottom, above the footer. Converts single-brand visitors into multi-brand browsers.

### Key Components
- Navbar
- BrandHero
- OriginBadge
- FilterChips (brand chip locked)
- Toolbar (sort)
- ProductGrid
- ProductCard
- LoadMoreButton
- RelatedBrandsRow
- BrandCard (mini)
- Footer

---

## Page 11: Contact (`/contact`)

### Page Purpose
**Business goal:** Trust signal. Reduce purchase anxiety for skeptical visitors. Convert WhatsApp inquiries into confirmed orders.  
**User goal:** Ask a question, get reassurance, or resolve a post-purchase issue.

### Page Hierarchy
1. Header
2. Page header: "تواصلي معنا"
3. Contact channels (WhatsApp + email)
4. Contact form
5. FAQ preview (3 common questions)
6. Footer

### Desktop Layout Structure

```
┌────────────────────────────────────────────────────────┐
│ HEADER                                                 │
├────────────────────────────────────────────────────────┤
│ PAGE HEADER: "تواصلي معنا"                             │
│ Subheadline: "نحن هنا للمساعدة"                        │
├────────────────────────────────────────────────────────┤
│                                                        │
│  CONTACT CHANNELS — 2 cards side by side               │
│                                                        │
│  [WhatsApp card]           [Email card]                │
│  تواصلي معنا مباشرة        راسلينا عبر البريد          │
│  خلال ساعات العمل          الإلكتروني                  │
│  [Open WhatsApp →]         [Copy email]                │
│                                                        │
├────────────────────────────────────────────────────────┤
│ CONTACT FORM                                           │
│ ───────────────                                        │
│ Name (required)                                        │
│ Phone (required)                                       │
│ Subject [dropdown: order inquiry / product / other]    │
│ Message (textarea, required)                           │
│ [إرسال الرسالة]                                        │
├────────────────────────────────────────────────────────┤
│ FAQ PREVIEW — 3 most relevant questions                │
│ Accordion, expandable                                  │
│ [See all FAQs →]                                       │
├────────────────────────────────────────────────────────┤
│ FOOTER                                                 │
└────────────────────────────────────────────────────────┘
```

**Form submission behavior:** In v2.0, the form generates a pre-formatted WhatsApp message (opening WhatsApp Web or the app). No backend form processing is required. The message includes the name, phone, subject, and message content.

### Mobile Layout Structure

All sections stack. Contact channel cards become full-width stacked cards. WhatsApp card appears first (higher-priority channel).

### Key Components
- Navbar
- PageHeader
- ContactChannelCard
- ContactForm
- FormField
- SubjectDropdown
- FAQAccordion (3-item preview)
- Footer

---

## Page 12: FAQ (`/faq`)

### Page Purpose
**Business goal:** Reduce WhatsApp inquiry volume by answering pre-purchase questions in-browser. Remove conversion blockers at scale.  
**User goal:** Get an answer to a specific question about products, ordering, delivery, or safety.

### Page Hierarchy
1. Header
2. Page header + search within FAQ
3. Category navigation (tabs or anchor links)
4. FAQ content (accordion per category)
5. "Still have questions?" CTA → Contact / WhatsApp
6. Footer

### Desktop Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│ HEADER                                                   │
├──────────────────────────────────────────────────────────┤
│ PAGE HEADER: "الأسئلة الشائعة"                           │
│ [Search FAQ field: "ابحثي عن سؤال..."]                   │
├──────────────────────────────────────────────────────────┤
│ CATEGORY TABS                                            │
│ [الطلب والشحن] [المنتجات] [الأمان والاستخدام] [الإرجاع] │
├──────────────────────────────────────────────────────────┤
│ ACTIVE CATEGORY CONTENT                                  │
│                                                          │
│ Q: كم يستغرق التوصيل إلى محافظتي؟        [▾]           │
│ A: التوصيل يستغرق 3–5 أيام عمل...                       │
│ ─────────────────────────────────────────               │
│ Q: هل الدفع عند الاستلام متاح؟             [▾]          │
│ A: نعم، الدفع عند الاستلام متاح...                       │
│ ─────────────────────────────────────────               │
│ Q: كيف أعرف أن العدسات أصلية كورية؟       [▾]          │
│ ...                                                      │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ STILL HAVE QUESTIONS?                                    │
│ "لم تجدي إجابة سؤالك؟"                                  │
│ [تواصلي عبر واتساب]  [راسلينا]                          │
├──────────────────────────────────────────────────────────┤
│ FOOTER                                                   │
└──────────────────────────────────────────────────────────┘
```

### FAQ Category Structure

| Category | Priority Questions |
|---|---|
| الطلب والشحن | Delivery times by governorate; free shipping threshold; order tracking; COD availability |
| المنتجات | How to choose color; difference between brands; what monthly means; packaging contents |
| الأمان والاستخدام | Are these safe; wearing duration; care instructions; prescription requirement |
| الإرجاع والاستبدال | Return eligibility; exchange process; timeline; contact method |

### FAQ Search

Typing in the search field filters the visible accordions across all categories to those whose question text matches the query. Empty search state shows all categories. No-results state: "لا توجد نتائج — [تواصلي معنا]."

### Mobile Layout Structure

- Search field full-width at top
- Category tabs horizontally scrollable
- Accordion items full-width stacked
- "Still have questions?" section with WhatsApp button — full-width

### Key Components
- Navbar
- PageHeader
- FAQSearchInput
- CategoryTabs (or CategoryAnchorLinks)
- FAQAccordion (full version: all categories)
- StillHaveQuestionsBlock
- WhatsAppCTA
- Footer

---

## Cross-Page Flow Summary

This table documents the primary navigation flows that connect the wireframed pages. Every user journey starts on one of these paths.

| Entry Point | First Page | Likely Second | Likely Third | Goal |
|---|---|---|---|---|
| TikTok / IG link | Home or PDP | Shop | PDP | Discover → buy |
| Google search (brand) | Brand page | PDP | Cart/Checkout | Brand → buy |
| Google search (product) | PDP | Cart | Checkout | Intent → buy |
| Return visitor | Home or Account | Shop or PDP | Checkout | Repeat purchase |
| WhatsApp link from order | Contact or FAQ | — | — | Support |
| Search intent | Search overlay | PDP | Cart | Intent → buy |
| Sale / promo link | Shop (filtered) | PDP | Cart | Campaign → buy |

---

## Component Reuse Map

The following components appear across multiple pages. They must be built as shared, reusable components in the Next.js component library:

| Component | Pages Used |
|---|---|
| `AnnouncementBar` | All pages |
| `Navbar` | All pages except Checkout (which uses MinimalHeader) |
| `MobileBottomNav` | All pages (mobile) |
| `WhatsAppFAB` | All pages |
| `Footer` | All pages except Checkout |
| `ProductCard` | Home, Shop, Brand, Wishlist, Search, PDP (related/recently viewed) |
| `SectionHeader` | Home, Shop, Brand, PDP |
| `FAQAccordion` | Home (teaser), FAQ, Contact |
| `EmptyState` | Shop (no results), Cart, Wishlist, Account (all tabs) |
| `CODBadge` | Cart Drawer, Cart, Checkout |
| `FreeShippingProgress` | Cart Drawer, Cart |
| `BrandCard` | Home, Brand page (related brands) |
| `LoadMoreButton` | Shop, Brand, Search results |
| `FilterChips` | Shop, Brand |
| `ReviewCard` | Home (teaser), PDP (Reviews tab) |

---

*This document defines the complete UX architecture for MARTAL 2.0. No design decisions have been made. All visual language, spacing, typographic hierarchy, motion, and aesthetic direction belong in 04_DESIGN_SYSTEM.md.*

*Document Owner: UX Architecture*  
*Last Updated: June 2026*  
*Next: 04_DESIGN_SYSTEM.md — Visual language, Tailwind token system, component aesthetics, animation principles*
