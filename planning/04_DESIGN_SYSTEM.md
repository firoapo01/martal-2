# 04 — DESIGN SYSTEM
## MARTAL 2.0: Visual Language & Interaction System

**Document Type:** Design System Specification  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Pre-Implementation — Authoritative Design Reference  
**Prepared by:** Product Design  
**Reads after:** 01_PROJECT_BRIEF.md, 02_STRATEGY.md, 03_WIREFRAMES.md  
**Audience:** Design, Frontend Engineering

> **On the relationship to MARTAL 1.0.** This document does not extend v1's design system. It replaces it while honoring its DNA. MARTAL 1.0 made correct instincts — the red brand color, the Cairo typeface, the warm neutral palette, the editorial card layout — but executed them at prototype fidelity. MARTAL 2.0 takes those instincts and executes them at the level of a production beauty commerce brand. Every token in this document has been reconsidered from first principles with that goal.

> **On photography.** The design system is built for the brand MARTAL will become, not the assets it currently has. Sections referencing imagery assume professional product photography and lifestyle content. Design decisions that depend on image quality — card ratios, hero compositions, editorial grids — are specified at the standard a funded beauty brand would achieve. This is intentional: building the system to today's assets would constrain the brand's visual ceiling permanently.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Direction](#2-design-direction)
3. [Color System](#3-color-system)
4. [Typography System](#4-typography-system)
5. [Spacing System](#5-spacing-system)
6. [Layout System](#6-layout-system)
7. [Border Radius System](#7-border-radius-system)
8. [Shadow System](#8-shadow-system)
9. [Motion System](#9-motion-system)
10. [Component Design Standards](#10-component-design-standards)
11. [Product Card System](#11-product-card-system)
12. [Mobile Design Rules](#12-mobile-design-rules)
13. [Accessibility Standards](#13-accessibility-standards)
14. [Tailwind Token Mapping](#14-tailwind-token-mapping)
15. [Design Atmosphere](#15-design-atmosphere)

---

## 1. Design Philosophy

### Brand Personality

MARTAL 2.0 has a distinct personality that must be legible from every surface: it is a brand that knows its customer, respects her intelligence, and earns her trust through quality rather than noise.

**Confident, not loud.** MARTAL does not shout. It presents. Every page is a considered composition, not a promotional poster. The brand's authority comes from restraint and clarity, not from the size of the sale badge.

**Intimate, not cold.** The brand speaks directly to one person at a time. Copy, layout, and interaction design all carry the feeling of a knowledgeable friend giving a recommendation — not a department store screaming at a crowd.

**Curated, not exhaustive.** Five brand lines, each with a defined character. The browsing experience feels like a well-edited boutique, not a warehouse. White space is not emptiness — it is curation made visible.

**Trustworthy, not defensive.** Trust signals in MARTAL 2.0 are woven into the design language itself — in the material quality of the surfaces, the legibility of the information, the presence of the WhatsApp button — not bolted on as badge collections.

### Emotional Goals

When a user arrives on MARTAL 2.0, she should feel, in sequence:

1. **Oriented** — within two seconds, she knows she is in the right place for colored lenses
2. **Reassured** — within ten seconds, she feels this is a real, serious brand
3. **Attracted** — within thirty seconds, she has seen something she wants to explore
4. **Confident** — by the time she reaches the checkout, she has no unanswered trust questions

The design system must support this emotional sequence. Every visual decision either moves a user through these states or creates friction against them.

### Visual Principles

**Hierarchy over decoration.** Every visual element must do work. If removing an element would not meaningfully harm the user's ability to understand the page, the element should not exist.

**Whitespace is active.** Generous padding and margin are not waste — they are the premium experience. The sense of "room to breathe" is what separates a beauty brand from a marketplace.

**Surfaces have depth.** The page is not flat. Cards sit above backgrounds. Drawers sit above the page. Modals sit above drawers. The shadow and background system must create a consistent sense of depth without creating visual heaviness.

**Consistency earns trust.** A design system that is applied consistently across all 12 pages communicates organizational competence to the user — even if she cannot articulate why. Inconsistency creates subliminal unease.

### UX Principles

These mirror the strategy document (§9.1) and are restated here in design terms:

- Every primary CTA is visually dominant on its page — one action per context
- Interactive elements have visible, immediate feedback — no silent actions
- Error states are educational, not punitive — the visual language of errors is calm
- Loading states are designed — skeleton screens, not spinners, for content
- Empty states have personality — they are conversion opportunities, not dead ends

---

## 2. Design Direction

### What MARTAL 2.0 IS

- **Premium beauty brand.** The visual register is a funded Shopify Plus beauty store, not a startup template.
- **Editorially composed.** Pages feel like they were laid out with intention — the visual weight is balanced, the hierarchy is clear.
- **Warm and material.** The palette is warm neutrals and rich burgundy — tactile, feminine, inviting.
- **Refined and confident.** No blinking elements, no aggressive animations, no promotional clutter.
- **Mobile-native.** The interface feels designed for a phone first. It does not feel "responsive" — it feels intentional at every breakpoint.
- **Arabic-first.** RTL layouts are not adapted — they are primary. The Latin/English moments (brand names, product names) feel like intentional design decisions, not translations.

### What MARTAL 2.0 IS NOT

- **Not promotional.** This is not a sale website. Sale states are acknowledged but not the dominant visual mode.
- **Not marketplace-like.** No dense product grids with eight columns, no price-before-name card layouts, no comparison table aesthetics.
- **Not generic WooCommerce.** No Storefront-theme-style horizontal rule separators, no bold blue links, no Helvetica body text on a white background.
- **Not loud.** No gradients with too many colors, no multiple typefaces competing on the same screen, no emoji in UI copy.
- **Not overcrowded.** White space is never filled for the sake of filling it. A section with one product and generous margins is more premium than four products in a tight grid.
- **Not inconsistent.** The design system applies everywhere. Brand pages, FAQ pages, and checkout pages all feel like the same brand.

---

## 3. Color System

### Design Intent

MARTAL 1.0's red (`#D50000`) was correct in concept and too promotional in execution. It reads as "discount" and "urgency" — associations that undermine the premium positioning. MARTAL 2.0 evolves this to a deep, warm burgundy that carries the same red DNA — recognizable to existing customers — but communicates authority, quality, and sophistication rather than a flash sale.

The supporting palette shifts from generic warm neutrals to a more deliberate warm stone/cream system that supports professional photography beautifully and photographs of warm-toned products (like colored lenses on brown and olive skin) without color casting.

Light mode only. No dark mode in v2.0.

---

### 3.1 Primary Brand Colors

| Token Name | Hex | RGB | Usage |
|---|---|---|---|
| `brand-primary` | `#8B1A2B` | 139, 26, 43 | Primary CTA buttons, active states, price text, brand name accents, sale badge background |
| `brand-primary-hover` | `#731623` | 115, 22, 35 | Primary button hover state, link hover |
| `brand-primary-active` | `#5C1220` | 92, 18, 32 | Primary button active/pressed state |
| `brand-primary-subtle` | `#F9EDEF` | 249, 237, 239 | Ghost button hover background, input focus ring fill, active filter chip background |

**On `brand-primary`:** This is a deep burgundy — unmistakably red-family, but without the promotional brightness of the v1 red. Against the cream/stone background system, it creates a sophisticated contrast that reads as luxury rather than urgency. Aesop uses a similar value relationship between their dark forest green and warm ivory. We are applying the same structural logic with a warmer hue.

---

### 3.2 Secondary Colors (Brand Accent)

These support editorial compositions, section backgrounds, and brand storytelling moments. They are never used on interactive elements.

| Token Name | Hex | Usage |
|---|---|---|
| `accent-rose` | `#F5E6E9` | Subtle section backgrounds (homepage trust bar, FAQ section), card hover overlay tint |
| `accent-nude` | `#E8D5C0` | Editorial section dividers, brand card subtle background, decorative borders |
| `accent-stone` | `#C9B9A8` | Decorative elements, image placeholder backgrounds, secondary badges |
| `accent-cream` | `#FAF7F4` | Alternative page background for editorial sections, testimonial section |

---

### 3.3 Surface Colors

Surfaces form the layered depth system. Every surface sits at a defined elevation and uses the correct surface color.

| Token Name | Hex | Usage | Elevation |
|---|---|---|---|
| `surface-base` | `#FAFAF9` | Page background — the base layer everything sits on | 0 |
| `surface-card` | `#FFFFFF` | Cards, panels, input backgrounds — sits above the base | 1 |
| `surface-raised` | `#FFFFFF` | Cart drawer, modals, search overlay panel | 2 |
| `surface-overlay` | `rgba(0,0,0,0.48)` | Backdrop behind drawers, modals, Quick View | Overlay |

**On `surface-base`:** Pure white (`#FFFFFF`) backgrounds read as clinical and flatten product photography. The v1 used `#FCFCFC` for the same reason — but a warm-tinted near-white (`#FAFAF9`) with the faintest warm undertone supports the brand palette better and feels materially richer on screen.

---

### 3.4 Text Colors

| Token Name | Hex | Usage |
|---|---|---|
| `text-primary` | `#1C1917` | All primary body text, headings, product names, navigation |
| `text-secondary` | `#57534E` | Subheadings, metadata, product subtitles, tab labels |
| `text-muted` | `#A8A29E` | Placeholder text, helper text, disabled labels, captions |
| `text-inverse` | `#FAFAF9` | Text on dark/primary-colored surfaces (primary buttons, announcement bar) |
| `text-brand` | `#8B1A2B` | Price text, active navigation links, brand name text, sale callouts |

**Palette rationale:** The v1 used pure black (`#1A1A1A`) for primary text against a white background — functional but without warmth. The 2.0 text primaries use warm-tinted dark tones from the stone family (`#1C1917` is stone-950 in Tailwind's warm scale), which harmonize with the cream backgrounds and brand burgundy without the clinical quality of neutral grays.

---

### 3.5 Border Colors

| Token Name | Hex | Usage |
|---|---|---|
| `border-subtle` | `#F0EBE8` | Card borders, section dividers, input borders (default state) |
| `border-default` | `#E2D9D4` | Stronger dividers, filter sidebar, table rows |
| `border-strong` | `#C9B9A8` | Active input borders, selected state borders |
| `border-brand` | `#8B1A2B` | Focus ring on interactive elements, selected filter chips, active nav underline |

---

### 3.6 Status Colors

Status colors must be distinct from the brand palette and immediately legible to users.

| Token Name | Hex | Usage |
|---|---|---|
| `status-success` | `#16A34A` | Order confirmation, successful form submission, in-stock indicator |
| `status-success-subtle` | `#F0FDF4` | Success message background |
| `status-warning` | `#CA8A04` | Low stock indicator, approaching cart threshold warning |
| `status-warning-subtle` | `#FEFCE8` | Warning message background |
| `status-error` | `#DC2626` | Form validation errors, required field indicators |
| `status-error-subtle` | `#FEF2F2` | Error message background |
| `status-info` | `#2563EB` | Informational messages, help tooltips |
| `status-info-subtle` | `#EFF6FF` | Info message background |

**Note:** Status error (`#DC2626`) is a brighter red than the brand burgundy. This is intentional — error red must be distinguishable from brand burgundy in context. They should never appear on the same visual surface simultaneously.

### 3.7 WhatsApp Color

| Token Name | Hex | Usage |
|---|---|---|
| `whatsapp` | `#25D366` | WhatsApp FAB button, WhatsApp CTA elements only |
| `whatsapp-hover` | `#1DA851` | WhatsApp button hover state |

---

## 4. Typography System

### Design Intent

MARTAL 2.0 uses a dual-font system: Cairo for Arabic and all UI chrome, Inter for Latin brand names and English product identifiers. The combination allows Arabic content to feel native and legible while giving Latin brand names (Hypnose, ICONIC, ElAmore) a typographic quality that feels intentional rather than fallback.

### 4.1 Font Loading

Both fonts are loaded via `next/font/google` with `display: 'swap'` to prevent invisible text during load.

```
Cairo: weights 400, 500, 600, 700, 900
Subsets: arabic, latin
Variable: --font-cairo

Inter: weights 400, 500, 600, 700
Subsets: latin
Variable: --font-inter
```

### 4.2 Font Application Rules

| Context | Font | Reason |
|---|---|---|
| All Arabic text | Cairo | Native Arabic typeface — designed for on-screen legibility |
| UI navigation (Arabic) | Cairo 600 | Clear, authoritative at small sizes |
| Body copy (Arabic) | Cairo 400 | Comfortable reading weight |
| Brand names (Hypnose, ICONIC, etc.) | Inter | Purpose-designed Latin letterforms; brand names render sharper |
| Price figures | Inter | Numbers in Inter feel more precise and commercial |
| English product descriptors | Inter | Consistent Latin rendering |
| Buttons (Arabic) | Cairo 700 | Strong CTA reading weight |
| Form labels and inputs (Arabic) | Cairo 400/500 | Clear at form sizes |

---

### 4.3 Type Scale

All sizes are defined in `rem` based on a 16px root. Arabic type sizes are set one step larger than their Latin equivalents at equivalent visual scale — a necessary adjustment because Arabic letterforms have more vertical complexity and require slightly more space to be equally legible.

#### Heading Scale

| Token | Size | Line Height | Weight (Arabic) | Weight (English) | Usage |
|---|---|---|---|---|---|
| `text-h1` | 2.5rem / 40px | 1.3 | 900 (Cairo) | 700 (Inter) | Page heroes, brand page titles |
| `text-h2` | 2rem / 32px | 1.35 | 700 (Cairo) | 600 (Inter) | Section headers, product page titles |
| `text-h3` | 1.5rem / 24px | 1.4 | 700 (Cairo) | 600 (Inter) | Card group headers, modal titles |
| `text-h4` | 1.25rem / 20px | 1.45 | 600 (Cairo) | 500 (Inter) | Subsection headers, FAQ question text |
| `text-h5` | 1.125rem / 18px | 1.5 | 600 (Cairo) | 500 (Inter) | Sidebar section labels, tab labels |
| `text-h6` | 1rem / 16px | 1.5 | 600 (Cairo) | 500 (Inter) | Small section labels, metadata headers |

#### Body Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `text-lg` | 1.125rem / 18px | 1.75 | 400 | Long-form body text, product descriptions, FAQ answers |
| `text-base` | 1rem / 16px | 1.7 | 400 | Standard body text, form copy, navigation |
| `text-sm` | 0.875rem / 14px | 1.6 | 400 | Secondary metadata, captions, chip labels, badge text |
| `text-xs` | 0.75rem / 12px | 1.5 | 400 | Fine print, legal copy, timestamps, annotation |

**Arabic-specific readability decisions:**

- **Minimum body text: 16px.** Arabic letterforms lose legibility below this threshold on mobile screens, especially on mid-range Android displays. This is non-negotiable.
- **Minimum line height: 1.7 for Arabic body text.** Arabic has more vertical complexity than Latin. Tight line heights cause diacritics to collide with descenders.
- **No letter-spacing on Arabic text.** `letter-spacing` breaks Arabic ligatures. It is applied only to Latin elements (Inter) and only in controlled contexts (brand names, price displays).
- **No `font-weight: 300` (Light) in Arabic.** Cairo Light renders poorly at body sizes on non-Retina displays — the stroke width becomes inconsistent. Minimum weight for Arabic is 400.

---

## 5. Spacing System

4px base unit. All spacing values are multiples of 4px.

| Token | px | rem | Usage |
|---|---|---|---|
| `space-1` | 4px | 0.25rem | Micro gaps: icon padding, tight inline spacing |
| `space-2` | 8px | 0.5rem | Component internal tight spacing: badge padding, chip padding |
| `space-3` | 12px | 0.75rem | Button internal padding (vertical), form label gap |
| `space-4` | 16px | 1rem | Standard component padding, card content padding |
| `space-5` | 20px | 1.25rem | Card internal spacing (comfortable) |
| `space-6` | 24px | 1.5rem | Section internal padding, modal padding |
| `space-8` | 32px | 2rem | Between related section elements, between form fields |
| `space-10` | 40px | 2.5rem | Between content groups within a section |
| `space-12` | 48px | 3rem | Section padding (mobile top/bottom) |
| `space-16` | 64px | 4rem | Section padding (desktop top/bottom, standard) |
| `space-20` | 80px | 5rem | Section padding (desktop top/bottom, hero) |
| `space-24` | 96px | 6rem | Maximum section padding (homepage hero) |

### Spacing Application Rules

**Section padding (desktop):** `space-16` (64px) top and bottom as the standard. `space-20` (80px) for hero sections and homepage landmarks.

**Section padding (mobile):** `space-12` (48px) top and bottom. Reduced because mobile viewport is shorter and vertical rhythm behaves differently.

**Card internal padding:** `space-4` (16px) on all sides for standard cards. `space-6` (24px) for content-heavy cards (reviews, FAQs).

**Grid gaps:** `space-4` (16px) on mobile, `space-6` (24px) on desktop for product grids.

**Form field spacing:** `space-8` (32px) between fields. `space-3` (12px) between label and input.

**Touch target minimum:** All interactive elements have a minimum tap area of 44px × 44px regardless of their visible size. Achieved via padding, not by increasing visual size.

---

## 6. Layout System

### Container Widths

| Name | Max Width | Usage |
|---|---|---|
| `container-content` | 1280px | Standard page content, product grids, sections |
| `container-prose` | 720px | Long-form text: FAQ answers, product descriptions, policy pages |
| `container-narrow` | 480px | Checkout form, contact form, confirmation pages |
| `container-full` | 100% | Full-bleed elements: hero sections, announcement bar, brand hero |

All containers are horizontally centered with `auto` side margins. Horizontal padding: `space-4` (16px) on mobile, `space-8` (32px) on tablet, `space-12` (48px) on desktop.

### Breakpoints

| Name | Min Width | Target Device |
|---|---|---|
| `sm` | 375px | Small phones (iPhone SE, small Android) — design base |
| `md` | 768px | Tablets and large phones in landscape |
| `lg` | 1024px | Small laptops, tablet landscape |
| `xl` | 1280px | Standard desktop |
| `2xl` | 1536px | Large desktop (layout caps, does not expand further) |

### Product Grid Rules

| Breakpoint | Columns | Gap |
|---|---|---|
| `sm` (mobile) | 2 | 16px |
| `md` (tablet) | 3 | 20px |
| `lg` (desktop) | 3 | 24px |
| `xl` (wide desktop) | 4 | 24px |

**Two columns on mobile is non-negotiable.** One column at mobile feels slow and requires too much scrolling. Three columns on mobile makes cards too small for Arabic text legibility. Two columns at 375px width produces cards approximately 164px wide — workable for portrait (3:4) imagery with text below.

### Content Width Rules

- Product detail page: two-column layout above the fold (`grid-cols-[1fr_420px]` on desktop)
- Checkout page: two-column layout (`grid-cols-[1fr_360px]` on desktop)
- Shop page sidebar: fixed 260px width on desktop; hidden on mobile
- Blog / content pages: `container-prose` centered on page

---

## 7. Border Radius System

MARTAL 2.0 uses a consistent radius system that reads as modern and refined — not boxy (no radius), not playful (no excessive rounding).

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 6px | Input fields, select elements, small badges, filter chips |
| `radius-md` | 12px | Cards, modals, drawers (corner radius), image containers |
| `radius-lg` | 16px | Product card image top corners, brand hero cards |
| `radius-xl` | 24px | Search overlay panel, bottom sheet drawers on mobile |
| `radius-full` | 9999px | Pill buttons, avatar circles, round icon buttons, WhatsApp FAB |

**On card radius:** Product cards use `radius-lg` (16px) on the top (image) and `radius-md` (12px) on the full card container. This creates a natural visual hierarchy where the image feels "framed" slightly more than the card container.

**On button radius:** Primary and secondary buttons use `radius-full` (pill shape). This is the most legible and touch-friendly button shape on mobile, and the round pill shape is consistent with the rounded feminine aesthetic of the brand.

---

## 8. Shadow System

Shadows create elevation and guide the user's visual hierarchy. MARTAL 2.0 uses warm-tinted shadows (not pure gray) to maintain palette harmony. The warm tint source: `rgba(139, 26, 43, 0.06)` — the brand burgundy at extreme opacity.

| Token | Value | Usage |
|---|---|---|
| `shadow-xs` | `0 1px 3px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.04)` | Subtle card separation on white backgrounds; input default state; chips |
| `shadow-sm` | `0 2px 8px rgba(28,25,23,0.08), 0 1px 3px rgba(28,25,23,0.04)` | Standard product cards at rest; announcement bar separation |
| `shadow-md` | `0 4px 20px rgba(28,25,23,0.10), 0 2px 6px rgba(28,25,23,0.06)` | Card hover state; sticky header shadow on scroll; Quick View modal |
| `shadow-lg` | `0 8px 40px rgba(28,25,23,0.12), 0 4px 12px rgba(28,25,23,0.06)` | Cart drawer; search overlay; bottom sheet drawers; modals |
| `shadow-brand` | `0 4px 20px rgba(139,26,43,0.20), 0 2px 8px rgba(139,26,43,0.10)` | Primary button hover state only — a subtle brand-colored glow under the primary CTA |

**On warm shadows:** Pure gray shadows (`rgba(0,0,0,X)`) feel clinical against warm cream backgrounds. The warm-dark tint (`rgba(28,25,23,X)` — from the warm text primary color) produces shadows that feel grounded in the palette rather than floating outside it.

---

## 9. Motion System

### 9.1 Motion Philosophy

Motion in MARTAL 2.0 serves three purposes only: communicating state change, directing attention, and confirming feedback. It never performs for its own sake.

The tone of MARTAL's motion is unhurried confidence. It is fast enough to feel modern and responsive, slow enough to feel composed rather than frantic. A user who notices the animations is seeing them too much — they should register as "smooth" without demanding attention.

Framer Motion is the implementation library. All values below map directly to Framer Motion `transition` props.

**Motion is never applied to:**
- Page background color changes
- Text content changes
- Elements that are already visible (motion applies to entrances and state changes, not to idle elements)
- Any layout shift that would cause CLS (Cumulative Layout Shift) — motion must not cause reflow

**`prefers-reduced-motion`:** All animations check the `prefers-reduced-motion` media query. When reduced motion is preferred, all duration values collapse to a maximum of 100ms with simple opacity-only transitions. No position or scale changes.

---

### 9.2 Duration Scale

| Token | Duration | Usage |
|---|---|---|
| `duration-instant` | 100ms | Immediate feedback: checkbox toggle, radio selection, icon swap |
| `duration-fast` | 150ms | Micro-interactions: button hover, wishlist toggle, focus ring |
| `duration-base` | 200ms | Standard interactions: card hover, link underline, badge appearance |
| `duration-comfortable` | 250ms | Add-to-Cart feedback, color swatch selection, tab switch |
| `duration-moderate` | 300ms | Dropdown open, filter chip add/remove, toast notification |
| `duration-slow` | 400ms | Cart drawer slide, page section reveals, search overlay open |
| `duration-deliberate` | 450ms | Page transition fades, brand hero entrances |

---

### 9.3 Easing Scale

| Token | Value | Usage |
|---|---|---|
| `ease-standard` | `[0.4, 0, 0.2, 1]` | General-purpose: element enter/exit, state changes |
| `ease-decelerate` | `[0, 0, 0.2, 1]` | Elements entering the screen (drawers, modals sliding in) |
| `ease-accelerate` | `[0.4, 0, 1, 1]` | Elements leaving the screen (drawers, modals sliding out) |
| `ease-spring` | `{ type: "spring", stiffness: 300, damping: 30 }` | Wishlist heart pop, Add-to-Cart count bounce, success feedback |
| `ease-gentle` | `[0.25, 0.1, 0.25, 1]` | Editorial reveals, homepage section entrances |

---

### 9.4 Hover Behaviors

All hover behaviors are desktop-only (touch devices do not have hover states — mobile interactions are covered by tap feedback).

| Element | Hover Effect | Duration | Easing |
|---|---|---|---|
| Product card | Translate Y −4px + `shadow-md` | 200ms | `ease-standard` |
| Primary button | Background darkens to `brand-primary-hover` + `shadow-brand` | 150ms | `ease-standard` |
| Secondary button | Background fills with `brand-primary-subtle` | 150ms | `ease-standard` |
| Ghost button | Outline thickens; background fills `brand-primary-subtle` | 150ms | `ease-standard` |
| Text link / nav link | Underline slides in from start (RTL-aware) | 150ms | `ease-decelerate` |
| Brand card | Scale 1.02 + `shadow-md` | 250ms | `ease-standard` |
| Wishlist icon | Scale 1.15, color to `brand-primary` | 150ms | `ease-spring` |
| Quick View trigger | Opacity 0 → 1 (fades in over card on hover) | 200ms | `ease-standard` |

---

### 9.5 Page Transitions

MARTAL 2.0 uses route-level fade transitions. The exiting page fades to opacity 0 and the entering page fades from opacity 0 over `duration-deliberate` (450ms). The fade is an overlay, not a slide — slides create spatial confusion in RTL layouts where directional conventions are reversed.

```
Exit: opacity 1 → 0, duration: 200ms, ease: ease-accelerate
Enter: opacity 0 → 1, duration: 450ms, ease: ease-decelerate
Enter delay: 50ms (brief hold to prevent flash)
```

---

### 9.6 Drawer & Sheet Animations

**Cart Drawer (desktop — slides from left edge in RTL):**
```
Enter: x: -100% → 0, duration: 400ms, ease: ease-decelerate
Exit:  x: 0 → -100%, duration: 300ms, ease: ease-accelerate
Backdrop: opacity 0 → 0.48, duration: 300ms
```

**Filter Drawer / Bottom Sheet (mobile — slides from bottom):**
```
Enter: y: 100% → 0, duration: 400ms, ease: ease-decelerate
Exit:  y: 0 → 100%, duration: 300ms, ease: ease-accelerate
```

**Quick View Modal:**
```
Enter: scale 0.96 → 1, opacity 0 → 1, duration: 300ms, ease: ease-decelerate
Exit:  scale 1 → 0.96, opacity 1 → 0, duration: 200ms, ease: ease-accelerate
```

---

### 9.7 Search Overlay Animation

```
Enter: 
  Overlay backdrop: opacity 0 → 1, duration: 250ms
  Panel: y: -8px → 0, opacity 0 → 1, duration: 300ms, ease: ease-decelerate
  Input: autofocus after 50ms delay

Exit:
  Panel: y: 0 → -8px, opacity 1 → 0, duration: 200ms
  Backdrop: opacity 1 → 0, duration: 250ms
```

Search suggestions appear with a stagger:
```
Each suggestion: opacity 0 → 1, y: 4px → 0
Stagger: 30ms between items
Duration per item: 200ms
```

---

### 9.8 Product Card Animations

**Homepage / Shop grid section entrances (scroll-triggered):**
```
Each card: opacity 0 → 1, y: 20px → 0
Stagger: 60ms between cards
Duration: 450ms, ease: ease-gentle
Trigger: when card enters viewport at 80% threshold
```

**Limit stagger to the first 8 cards in any grid.** Beyond 8, cards appear without stagger — staggering many cards creates a slow, janky feeling on mobile.

---

### 9.9 Add to Cart Feedback

The Add to Cart interaction has three simultaneous feedback signals:

1. **Button state change:** Button text changes to "✓ أضيف" for 1200ms, then returns to "أضيفي للسلة". Background shifts to `status-success` (`#16A34A`) for that duration.
2. **Cart count bounce:** The cart icon count badge animates: scale 1 → 1.4 → 1, duration: 300ms, `ease-spring`.
3. **Cart drawer opens:** After a 200ms delay (so the button feedback is seen first), the cart drawer opens.

---

### 9.10 Wishlist Feedback

```
Tap (add):
  Heart icon: scale 1 → 1.3 → 1, duration: 300ms, ease: ease-spring
  Color: text-muted → brand-primary, duration: 150ms
  
Tap (remove):
  Heart icon: scale 1 → 0.8 → 1, duration: 250ms
  Color: brand-primary → text-muted, duration: 150ms
```

---

## 10. Component Design Standards

### 10.1 Buttons

#### Primary Button
- Background: `brand-primary`
- Text: `text-inverse` (cream-white)
- Border radius: `radius-full` (pill)
- Font: Cairo 700 (Arabic), Inter 600 (Latin)
- Size: height 48px (standard), 56px (hero/prominent), 40px (compact)
- Padding: `space-4` vertical, `space-8` horizontal
- Hover: background `brand-primary-hover` + `shadow-brand`
- Active: background `brand-primary-active`, scale 0.98
- Disabled: opacity 0.4, cursor not-allowed, no hover effect
- Loading: button text replaced by a subtle animated dot trail; width does not change (prevents layout shift)

#### Secondary Button (Outlined)
- Background: transparent
- Border: 1.5px solid `brand-primary`
- Text: `brand-primary`
- Same radius, size, and padding as primary
- Hover: background `brand-primary-subtle`, border `brand-primary`
- Active: background tints slightly darker

#### Ghost Button
- Background: transparent
- Border: 1.5px solid `border-default`
- Text: `text-secondary`
- Hover: background `surface-card`, border `border-strong`
- Used for: "Continue Shopping," "Clear Filters," low-priority actions

#### Text Button / Link Button
- No background, no border
- Text: `brand-primary`, font-weight 600
- Underline: none at rest, appears on hover (slides in from start, RTL-aware)
- Used for: "See all," "View details," in-context navigation links

---

### 10.2 Form Inputs

All inputs share base construction:
- Height: 52px (ensures comfortable tap target on mobile)
- Background: `surface-card`
- Border: 1.5px solid `border-subtle`
- Border radius: `radius-sm` (6px)
- Font: Cairo 400 (Arabic), 16px
- Padding: `space-4` (16px) horizontal

#### States:

| State | Border | Background | Shadow |
|---|---|---|---|
| Default | `border-subtle` | `surface-card` | `shadow-xs` |
| Focus | `border-brand` (2px) | `surface-card` | `shadow-xs` + subtle brand glow |
| Error | `status-error` (2px) | `status-error-subtle` | none |
| Success | `status-success` | `surface-card` | none |
| Disabled | `border-subtle` | `surface-base` | none, opacity 0.5 |

**Error messages:** Display below the input, `text-xs`, `status-error` color. Appear with a fade-in (`duration-fast`). Never above the input (breaks reading flow in RTL).

**Select / Dropdown:** Same visual treatment as text input. Custom styled to remove browser defaults. RTL-aware: chevron icon appears on the left side of the select in RTL.

---

### 10.3 Cards

**Product Card:** Defined in Section 11 (dedicated section).

**Brand Card:**
- Aspect ratio: 4:3 (landscape)
- Image: fills top portion of card
- Content below: brand name (Inter 600, English) + tagline (Cairo 400, Arabic) + CTA text link
- Border radius: `radius-lg`
- Shadow: `shadow-sm` at rest, `shadow-md` on hover
- Hover: entire card translates Y −4px

**Content Card (Reviews, FAQ):**
- Background: `surface-card`
- Border: 1px solid `border-subtle`
- Border radius: `radius-md`
- Padding: `space-6` (24px)
- No shadow at rest (border provides separation)

**Trust / Highlight Card:**
- Background: `accent-rose` or `accent-cream`
- No border
- Border radius: `radius-md`
- Used for: trust bar items, homepage callouts

---

### 10.4 Badges

Badges are small, non-interactive labels. They appear on product cards and PDPs.

| Badge | Background | Text Color | Text |
|---|---|---|---|
| Bestseller | `#FEF3C7` (warm amber) | `#92400E` (amber-800) | الأكثر مبيعاً |
| New | `#DCFCE7` (soft green) | `#166534` (green-800) | جديد |
| Sale | `brand-primary` | `text-inverse` | خصم |
| Out of Stock | `#F3F4F6` (neutral gray) | `#6B7280` (gray-500) | نفذ المخزون |

All badges: `radius-sm`, font Cairo 700, `text-xs` (12px), padding `space-1` vertical × `space-2` horizontal.

**Badge placement on cards:** Top-start corner (right corner in RTL). Only one badge per card. Priority: Sale > Bestseller > New. Out of Stock replaces any promotional badge.

---

### 10.5 Filter Chips

Active filter indicators in the shop and brand pages.

- Background: `brand-primary-subtle`
- Border: 1px solid `brand-primary`
- Text: `brand-primary`, Cairo 600, `text-sm`
- Border radius: `radius-full` (pill)
- Height: 32px
- Remove icon: "×" on the end side (left side in RTL)
- Hover: border darkens to `brand-primary-hover`

Inactive filter options in the sidebar use the standard form checkbox/radio style — no chip treatment.

---

## 11. Product Card System

The product card is the most repeated visual element in MARTAL 2.0. It appears on the homepage, shop, brand pages, wishlist, search results, and the PDP (related/recently viewed). Every pixel decision here is multiplied across hundreds of views per session.

### 11.1 Card Structure

```
┌───────────────────────────────┐
│                               │
│     IMAGE AREA (3:4 ratio)    │  ← radius-lg top corners
│                               │
│  [Badge — top-start corner]   │
│  [Wishlist — top-end corner]  │
│                               │
│  [Quick View — bottom center] │  ← appears on hover (desktop)
│                               │   always visible (mobile)
├───────────────────────────────┤
│  Brand name       Cairo 500   │  ← text-muted, text-xs
│  Product name     Cairo 700   │  ← text-primary, text-base
│  Color swatches   ● ● ● ●    │  ← 20px circles, gap-1
│  ~~Old price~~ New price      │  ← text-sm muted + text-base brand
└───────────────────────────────┘
```

### 11.2 Image Area

- **Aspect ratio:** 3:4 (portrait, vertical) — 75% width to height
- **Border radius:** `radius-lg` on top corners only; bottom corners are square (the card border handles the full card's radius)
- **Object-fit:** `cover` — images are cropped to fill the ratio. The art direction (which part of the image is visible) must be defined per product in WooCommerce.
- **Background:** `accent-stone` as the placeholder/loading background — warm enough to not flash stark white while images load
- **Hover (desktop):** Image scales to 1.05 within its container (overflow hidden on the image container, not the card). This creates a subtle zoom-in effect without the card growing.

### 11.3 Brand Name

- Font: Cairo 500 (Arabic brand names if they exist) or Inter 500 (Latin brand names — Hypnose, Labella, etc.)
- Size: `text-xs` (12px)
- Color: `text-muted`
- Uppercase letter-spacing: `tracking-wide` (only applied to Inter/Latin brand names — never to Arabic text)
- Position: first line below the image

### 11.4 Product Name

- Font: Cairo 700
- Size: `text-base` (16px) on desktop, `text-sm` (14px) on mobile
- Color: `text-primary`
- Max lines: 2, with ellipsis on overflow
- Hover (desktop): color transitions to `brand-primary`

### 11.5 Color Swatches

- Diameter: 18px per swatch
- Border: 2px solid `border-subtle` at rest; `border-brand` when hovered or selected
- Gap: 4px between swatches
- Maximum swatches visible on card: 5. If more exist, a "+N" count appears
- The color circle fills with the actual hex value of the lens color

### 11.6 Price Display

```
~~450 EGP~~   390 EGP
```

- Old price: `text-sm`, `text-muted`, `line-through`
- New price: `text-base`, `text-brand` (the brand burgundy), font-weight 600
- When no discount: just new price in `text-primary`, no muted secondary price
- Currency "EGP" follows the number (English convention for Egyptian market)
- Prices use Inter numerals for sharper number rendering

### 11.7 Wishlist Icon

- Position: top-end corner (top-left in RTL) of the image area
- Visible at all times on mobile
- Visible on card hover on desktop
- Icon: heart outline → heart filled on active
- Background: `surface-card` at 90% opacity, `radius-full`, 32px × 32px tap target
- Active state: filled heart, `brand-primary` color

### 11.8 Quick View

- Position: bottom center of image area
- Desktop: appears as a pill button on card hover ("عرض سريع"), overlapping the bottom of the image
- Mobile: always visible, full-width below the image as a text-link ("عرض سريع ←")
- On desktop Quick View pill: background `surface-card` at 96% opacity, `shadow-sm`, `radius-full`

### 11.9 Add to Cart from Card

On mobile, the card does not have a visible Add to Cart button — tapping the card navigates to the PDP. Add to Cart from card is a desktop-only convenience accessed via Quick View.

**Rationale:** On mobile, the card is too small to fit a legible Arabic Add to Cart button alongside price and swatches without compromising the image area or becoming cluttered. The Quick View on mobile serves the same pre-purchase evaluation role.

---

## 12. Mobile Design Rules

### 12.1 Thumb-Zone Strategy

The wireframes document (§3, Mobile Bottom Navigation) established the structural thumb-zone rules. Here is the visual implementation:

- **Mobile bottom nav height:** 60px. Safe area inset (`env(safe-area-inset-bottom)`) added on iOS for home indicator clearance.
- **Bottom nav icons:** 24px, with 4px text label below. Total tap target: 48px × 48px minimum.
- **Sticky PDP bar height:** 64px + safe area inset. Content: price on the start side, Add to Cart button on the end side.
- **WhatsApp FAB:** 56px × 56px circle, positioned 16px from the end edge, 80px above the bottom nav (to avoid overlap).

### 12.2 Sticky Elements

| Element | Behavior | Z-index |
|---|---|---|
| Announcement bar | Scrolls away with page | — |
| Header | Sticky to top; reduces to compact height after scroll | 50 |
| Mobile bottom nav | Fixed to bottom of viewport | 40 |
| Sticky PDP Add-to-Cart bar | Fixed to bottom, above bottom nav; hidden when primary CTA is visible | 45 |
| WhatsApp FAB | Fixed, above bottom nav | 35 |
| Cart drawer | Fixed overlay | 60 |
| Search overlay | Fixed overlay | 70 |
| Modal | Fixed overlay | 80 |

### 12.3 Touch Targets

All interactive elements maintain a **minimum 44px × 44px** touch target regardless of their visible size. Achieved via invisible padding on small elements (swatch chips, wishlist icon, remove buttons).

### 12.4 Swipe Interactions

| Interaction | Direction | Response |
|---|---|---|
| Product gallery (PDP) | Left/Right | Previous/Next image |
| Horizontally scrolling cards (mobile) | Left/Right | Scroll through brand cards, look cards, recently viewed |
| Cart drawer (mobile bottom sheet) | Down | Closes the drawer |
| Filter drawer (mobile bottom sheet) | Down | Closes the drawer |

All swipe interactions use Framer Motion's drag constraints. The drag sensitivity is set to require at least 30% of the drawer height before triggering close — prevents accidental dismissal.

### 12.5 Mobile Header Behavior

**At page top:** Full announcement bar (32px) + full header (60px) = 92px total top chrome.

**After scrolling 60px:** Announcement bar scrolls out. Header reduces height to 52px. Navigation links are hidden (accessible via hamburger). Logo + search + cart icon remain.

**Return to top:** Header restores to full size with a smooth `duration-slow` transition.

---

## 13. Accessibility Standards

### 13.1 Color Contrast

All text must meet WCAG 2.1 AA minimum contrast ratios.

| Combination | Contrast Ratio | WCAG Level |
|---|---|---|
| `text-primary` on `surface-base` | 16.8:1 | AAA |
| `text-secondary` on `surface-base` | 7.1:1 | AAA |
| `text-inverse` on `brand-primary` | 6.2:1 | AA |
| `text-brand` on `surface-base` | 5.8:1 | AA |
| `text-muted` on `surface-card` | 4.6:1 | AA |
| Badge text on badge background (all variants) | ≥ 4.5:1 | AA |

**`text-muted` on `surface-card`** is the tightest acceptable pairing in the system. It is used only for non-critical metadata (brand name on cards, timestamps). No essential content uses this pairing.

### 13.2 Focus States

All interactive elements have visible focus rings. Focus ring is never removed (`outline: none` is never used without an equivalent visible replacement).

```
Focus ring: 2px solid brand-primary, 2px offset
Applied via: Tailwind focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
```

Focus rings use `focus-visible` (not `focus`) to avoid showing focus rings on mouse click while preserving them for keyboard navigation.

### 13.3 Keyboard Navigation

- All interactive elements are reachable via Tab/Shift+Tab
- Cart drawer: focus is trapped inside when open; returns to trigger element on close
- Search overlay: focus moves to the search input when overlay opens; trapped inside
- Mobile bottom sheet: focus trapped inside when open
- RTL keyboard navigation: Tab order follows visual reading order (right-to-left in RTL)

### 13.4 Screen Reader Considerations

- Product cards: the full card link has an `aria-label` that includes product name, brand, color, and price
- Color swatches: each swatch has `aria-label="color name"` and `aria-pressed` for selected state
- Wishlist toggle: `aria-label="أضيفي للمفضلة"` / `"أزيلي من المفضلة"` toggles on state change
- Cart count badge: `aria-label="السلة: 3 منتجات"`
- Image carousel: `role="region"`, `aria-label="معرض الصور"`, previous/next buttons labeled
- Announcement bar: `aria-live="polite"` for the scrolling text

### 13.5 Motion Reduction

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

In Framer Motion components, use the `useReducedMotion` hook:
```
const shouldReduceMotion = useReducedMotion();
const transitionConfig = shouldReduceMotion 
  ? { duration: 0.1 } 
  : { duration: 0.4, ease: easing.decelerate };
```

---

## 14. Tailwind Token Mapping

### 14.1 Design Specification Tables

**Colors reference:**

| Tailwind Token | Hex | Role |
|---|---|---|
| `brand.primary` | `#8B1A2B` | Primary actions, prices, active states |
| `brand.primaryHover` | `#731623` | Button hover |
| `brand.primaryActive` | `#5C1220` | Button pressed |
| `brand.subtle` | `#F9EDEF` | Hover fills, chip backgrounds |
| `accent.rose` | `#F5E6E9` | Section backgrounds |
| `accent.nude` | `#E8D5C0` | Decorative borders |
| `accent.stone` | `#C9B9A8` | Placeholders, secondary badges |
| `accent.cream` | `#FAF7F4` | Editorial sections |
| `surface.base` | `#FAFAF9` | Page background |
| `surface.card` | `#FFFFFF` | Cards, inputs |
| `text.primary` | `#1C1917` | Main content |
| `text.secondary` | `#57534E` | Supporting content |
| `text.muted` | `#A8A29E` | Metadata |
| `text.inverse` | `#FAFAF9` | On dark surfaces |
| `text.brand` | `#8B1A2B` | Brand-colored text |
| `border.subtle` | `#F0EBE8` | Default borders |
| `border.default` | `#E2D9D4` | Standard dividers |
| `border.strong` | `#C9B9A8` | Active/focus borders |
| `border.brand` | `#8B1A2B` | Focus rings, selected states |

---

### 14.2 Production-Ready `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Colors ───────────────────────────────────────────
      colors: {
        brand: {
          primary:       "#8B1A2B",
          primaryHover:  "#731623",
          primaryActive: "#5C1220",
          subtle:        "#F9EDEF",
        },
        accent: {
          rose:  "#F5E6E9",
          nude:  "#E8D5C0",
          stone: "#C9B9A8",
          cream: "#FAF7F4",
        },
        surface: {
          base:   "#FAFAF9",
          card:   "#FFFFFF",
          raised: "#FFFFFF",
        },
        "text-primary":   "#1C1917",
        "text-secondary": "#57534E",
        "text-muted":     "#A8A29E",
        "text-inverse":   "#FAFAF9",
        "text-brand":     "#8B1A2B",
        border: {
          subtle:  "#F0EBE8",
          default: "#E2D9D4",
          strong:  "#C9B9A8",
          brand:   "#8B1A2B",
        },
        status: {
          success:        "#16A34A",
          successSubtle:  "#F0FDF4",
          warning:        "#CA8A04",
          warningSubtle:  "#FEFCE8",
          error:          "#DC2626",
          errorSubtle:    "#FEF2F2",
          info:           "#2563EB",
          infoSubtle:     "#EFF6FF",
        },
        whatsapp:      "#25D366",
        whatsappHover: "#1DA851",
      },

      // ─── Typography ───────────────────────────────────────
      fontFamily: {
        cairo: ["var(--font-cairo)", "Cairo", ...fontFamily.sans],
        inter: ["var(--font-inter)", "Inter", ...fontFamily.sans],
        sans:  ["var(--font-cairo)", "Cairo", ...fontFamily.sans],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1.4" }],
        xs:    ["0.75rem",  { lineHeight: "1.5" }],
        sm:    ["0.875rem", { lineHeight: "1.6" }],
        base:  ["1rem",     { lineHeight: "1.7" }],
        lg:    ["1.125rem", { lineHeight: "1.75" }],
        xl:    ["1.25rem",  { lineHeight: "1.45" }],
        "2xl": ["1.5rem",   { lineHeight: "1.4" }],
        "3xl": ["2rem",     { lineHeight: "1.35" }],
        "4xl": ["2.5rem",   { lineHeight: "1.3" }],
        "5xl": ["3rem",     { lineHeight: "1.2" }],
      },

      // ─── Spacing ──────────────────────────────────────────
      // Tailwind's default 4px scale is used directly:
      // 1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px,
      // 8=32px, 10=40px, 12=48px, 16=64px, 20=80px, 24=96px
      // No overrides needed — the default 4px scale matches our system.

      // ─── Border Radius ────────────────────────────────────
      borderRadius: {
        none: "0",
        sm:   "6px",
        md:   "12px",
        lg:   "16px",
        xl:   "24px",
        full: "9999px",
        DEFAULT: "12px",
      },

      // ─── Shadows ──────────────────────────────────────────
      boxShadow: {
        xs:    "0 1px 3px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.04)",
        sm:    "0 2px 8px rgba(28,25,23,0.08), 0 1px 3px rgba(28,25,23,0.04)",
        md:    "0 4px 20px rgba(28,25,23,0.10), 0 2px 6px rgba(28,25,23,0.06)",
        lg:    "0 8px 40px rgba(28,25,23,0.12), 0 4px 12px rgba(28,25,23,0.06)",
        brand: "0 4px 20px rgba(139,26,43,0.20), 0 2px 8px rgba(139,26,43,0.10)",
        none:  "none",
      },

      // ─── Screens / Breakpoints ────────────────────────────
      screens: {
        sm:  "375px",
        md:  "768px",
        lg:  "1024px",
        xl:  "1280px",
        "2xl": "1536px",
      },

      // ─── Container ────────────────────────────────────────
      maxWidth: {
        content: "1280px",
        prose:   "720px",
        narrow:  "480px",
      },

      // ─── Transitions (for non-Framer-Motion usage) ────────
      transitionDuration: {
        instant:     "100ms",
        fast:        "150ms",
        base:        "200ms",
        comfortable: "250ms",
        moderate:    "300ms",
        slow:        "400ms",
        deliberate:  "450ms",
      },
      transitionTimingFunction: {
        standard:    "cubic-bezier(0.4, 0, 0.2, 1)",
        decelerate:  "cubic-bezier(0, 0, 0.2, 1)",
        accelerate:  "cubic-bezier(0.4, 0, 1, 1)",
        gentle:      "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },

      // ─── Keyframes (for CSS animations) ──────────────────
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-start": {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-end": {
          "0%":   { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-up": {
          "0%":   { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "count-bounce": {
          "0%, 100%": { transform: "scale(1)" },
          "50%":      { transform: "scale(1.4)" },
        },
        "heart-pop": {
          "0%":   { transform: "scale(1)" },
          "40%":  { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in":       "fade-in 450ms cubic-bezier(0, 0, 0.2, 1) both",
        "fade-in-up":    "fade-in-up 450ms cubic-bezier(0, 0, 0.2, 1) both",
        "slide-in-start":"slide-in-start 400ms cubic-bezier(0, 0, 0.2, 1) both",
        "slide-in-end":  "slide-in-end 400ms cubic-bezier(0, 0, 0.2, 1) both",
        "slide-up":      "slide-up 400ms cubic-bezier(0, 0, 0.2, 1) both",
        marquee:         "marquee 28s linear infinite",
        "scale-in":      "scale-in 300ms cubic-bezier(0, 0, 0.2, 1) both",
        "count-bounce":  "count-bounce 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
        "heart-pop":     "heart-pop 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both",
      },

      // ─── Aspect Ratios ────────────────────────────────────
      aspectRatio: {
        "3/4":  "3 / 4",
        "4/3":  "4 / 3",
        "1/1":  "1 / 1",
        "16/9": "16 / 9",
        "2/3":  "2 / 3",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class", // Only apply form styles via class, not globally
    }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
```

---

### 14.3 CSS Custom Properties (globals.css additions)

```css
/* globals.css */
:root {
  /* Font variables — set by next/font */
  --font-cairo: 'Cairo', sans-serif;
  --font-inter: 'Inter', sans-serif;

  /* Scroll padding for sticky header */
  --header-height: 60px;
  --announcement-height: 32px;
  --bottom-nav-height: 60px;
  --scroll-padding-top: calc(var(--header-height) + var(--announcement-height));
}

html {
  scroll-padding-top: var(--scroll-padding-top);
}

/* Arabic body defaults */
body {
  font-family: var(--font-cairo), sans-serif;
  direction: rtl;
  text-align: start;
}

/* Inter on Latin-only elements */
.font-inter {
  font-family: var(--font-inter), sans-serif;
  direction: ltr;
  unicode-bidi: embed;
}

/* Prevent letter-spacing on Arabic text */
[lang="ar"], [dir="rtl"] {
  letter-spacing: 0 !important;
}

/* Safe area support for mobile */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
```

---

## 15. Design Atmosphere

This section describes the perceived quality of MARTAL 2.0 in experiential terms — the "feel" a designer should aim for when making decisions not explicitly covered elsewhere in this document.

### The Homepage Feel

A user arrives from a TikTok link on her phone. The first frame she sees: a warm near-white background, a full-width image of a woman with strikingly colored eyes, and a headline in bold Cairo that reads like a brand campaign line, not a product label. Below the image: three small trust signals — COD, Korean, Free shipping — presented as simple text with minimal icon treatment.

The feeling is editorial. It feels like a magazine was translated into a shopping experience. There is space. Nothing is competing for attention simultaneously. The page does not scream that it is an e-commerce website. It invites.

The scroll feels earned. Each section reveals itself with a gentle entrance — not a dramatic fly-in, but a subtle fade and settle that makes the page feel alive without feeling chaotic. The brand cards for Hypnose, Labella, FXEyes, ElAmore, and ICONIC look like a curated lineup in a premium boutique display, not a catalogue index.

### The Shop Feel

The shop grid is controlled and navigable. Filters are accessible but not insistent. The product cards fill exactly the right amount of space — generous enough to appreciate the product photography, compact enough to show choice.

A user scrolling through the grid experiences rhythm: card, card, card, small visual pause from the card shadow differences, card, card. There is no density fatigue because the spacing is generous and each card has one clear visual focus — the product image.

The sort and filter controls feel like tools, not distractions. The active filter chips confirm without cluttering. Removing a filter chip feels satisfying — it disappears cleanly with a gentle scale-out.

### The Product Page Feel

The product page is the moment the brand earns the sale. The gallery is the first thing the eye goes to — large, crisp, unhurried. The color swatches feel like a choice, not a specification. Selecting a color and watching the gallery update creates a sense of ownership before purchase.

The price is visible and honest: old price crossed out, new price in brand burgundy. The trust strip below the CTA (Korean origin, COD, shipping, returns) is present but not aggressive. It communicates confidence, not desperation.

The reviews tab, when open, feels like peer conversation. Names, dates, color variants purchased — the information is specific enough to feel authentic.

### The Checkout Feel

The checkout page is the most focused surface in the application. No footer. A minimal header. One purpose. The form fields are spacious and well-labeled. The order summary sidebar is always visible (on desktop) so the user is never in doubt about what she is confirming.

The "ستدفعين عند الاستلام" (you will pay on delivery) statement is the last thing before the Confirm button. It is not a footnote — it is presented as a reassurance. The button itself is full-width on mobile, generous in height, and responds to press with immediate, satisfying feedback.

When the order confirms, the transition to the success state feels ceremonial — a brief pause, then a clear, warm confirmation page. The user should feel: *that was easy, and I trust I made the right choice.*

---

*This design system is the authoritative visual specification for MARTAL 2.0. Every component built without consulting this document is a risk to brand consistency. Every exception to this document should be documented and justified. The system will grow — new components, new patterns — but they must be added to this document before being implemented, not after.*

*Document Owner: Product Design*  
*Last Updated: June 2026*  
*Next: 05_COMPONENT_ARCHITECTURE.md — Component hierarchy, naming conventions, TypeScript prop interfaces, Storybook structure*
