# 02 — STRATEGY
## MARTAL 2.0: Business, Conversion, UX & Growth Strategy

**Document Type:** Commerce Strategy & UX Blueprint  
**Version:** 1.0  
**Date:** June 2026  
**Status:** Pre-Development — Strategic Foundation  
**Prepared by:** Product Strategy  
**Reads after:** 01_PROJECT_BRIEF.md  
**Audience:** Product, Design, Engineering, Stakeholders

> **How to read this document.** The Project Brief (01) defined *what* MARTAL 2.0 is and *how* it will be built. This document defines *why* every major decision is being made — the business logic, the user psychology, the conversion mechanics, and the growth model that sit behind the architecture. Do not re-read the brief before reading this. Build on it.

---

## Table of Contents

1. [Executive Strategy Summary](#1-executive-strategy-summary)
2. [Market Positioning](#2-market-positioning)
3. [Competitive Advantage](#3-competitive-advantage)
4. [Customer Psychology](#4-customer-psychology)
5. [Customer Personas](#5-customer-personas)
6. [Conversion Funnel Strategy](#6-conversion-funnel-strategy)
7. [Revenue Strategy](#7-revenue-strategy)
8. [Mobile-First Strategy](#8-mobile-first-strategy)
9. [UX Strategy](#9-ux-strategy)
10. [Information Architecture Strategy](#10-information-architecture-strategy)
11. [Content Strategy](#11-content-strategy)
12. [Search Strategy](#12-search-strategy)
13. [Trust & Credibility Strategy](#13-trust--credibility-strategy)
14. [Performance Strategy](#14-performance-strategy)
15. [MARTAL 2.0 Success Definition](#15-martal-20-success-definition)

---

## 1. Executive Strategy Summary

### What MARTAL Is

MARTAL is a premium colored contact lens brand built for the Egyptian beauty market. It is not a reseller, a marketplace listing, or an Instagram shop. It is a brand — with a visual identity, a curated product range, and a point of view about how Egyptian women should discover and purchase colored lenses. The brand brief (§2.1) establishes this identity in detail. The strategic implication is this: every decision in MARTAL 2.0, from button placement to checkout form field order, must reinforce that brand identity or be challenged.

### What MARTAL Sells

MARTAL sells five brand lines of Korean-manufactured monthly colored contact lenses: Hypnose, Labella, FXEyes, ElAmore, and ICONIC. Each exists in multiple color variants at price points between 390 and 550 EGP. The catalog is curated, not exhaustive. MARTAL does not compete on volume — it competes on curation, trust, and experience.

### Who MARTAL Serves

Egyptian women, 18–35, mobile-first, socially connected, beauty-conscious, and operating in a market where the default purchase experience for contact lenses is either a pharmacy counter or a DM to an Instagram reseller with no return policy, no authenticity guarantee, and no customer service. The full audience profile is in the brief (§5). The strategic implication is that MARTAL's competition is not another premium lens brand — it is the absence of a premium lens brand. MARTAL 2.0 is not fighting for market share. It is creating the category standard.

### What MARTAL 2.0 Is Trying to Achieve

The Project Brief defines six technical goals (G1 through G6). Behind those goals sits a single strategic intent:

**Make MARTAL the first and obvious choice for any Egyptian woman who wants colored lenses she can trust.**

That intent translates into four strategic pillars:

| Pillar | Definition | Why It Matters |
|---|---|---|
| **Trust at every touchpoint** | Every page, every micro-interaction, every copy line should reduce purchase anxiety and build confidence | The primary barrier to conversion in this market is not price or product — it is distrust |
| **Friction elimination** | Reduce the number of decisions, taps, and mental steps required to go from discovery to confirmed order | Egyptian mobile users abandon fast; every unnecessary step is a lost conversion |
| **Premium experience that justifies premium price** | The UX must feel materially better than the alternative (DM-based purchasing) to support prices of 400–550 EGP | Experience is the price justification |
| **Retention from first purchase** | A customer who orders once and receives quality product + quality experience becomes a recurring revenue source | Contact lenses are a consumable — the second purchase should require no persuasion |

### Business, User, Conversion, and Growth Goals

**Primary business goals:**
- Convert MARTAL from a prototype into a functioning revenue-generating commerce operation
- Process real orders through WooCommerce with COD fulfillment
- Build a customer base with contact information for retention marketing

**Primary user goals:**
- Find the right lens color for their look with confidence
- Trust that what they order is genuinely Korean-manufactured
- Complete a purchase in under five minutes from product page to order confirmation
- Know exactly when their order will arrive and have a direct line to the brand if something goes wrong

**Primary conversion goals:**
- Move users from product page to checkout without abandonment
- Eliminate form-friction as a checkout failure point
- Use COD as a trust multiplier, not just a payment method
- Make the first order feel safe enough that the second order feels automatic

**Primary growth goals:**
- Organic search visibility for product and brand-specific terms in Arabic
- WhatsApp-assisted conversion pipeline for undecided buyers
- Repeat purchase loop driven by post-order communication and wishlist retention
- Catalog and brand expansion supported by the WooCommerce backend without frontend refactoring

---

## 2. Market Positioning

### The Positioning Problem MARTAL Solves

A woman in Cairo who wants to buy colored lenses today faces a poor set of options:

- **Pharmacy:** Clinical, no variety, expensive, no color guidance, impersonal
- **Instagram reseller:** No trust signals, no return policy, DM-based ordering, payment upfront (Instapay or transfer), slow responses, inconsistent product quality
- **Facebook shop:** Similar to Instagram — manual process, no cart, no guarantee
- **Marketplace (Jumia etc.):** Low prices but no brand identity, unclear product origins, race-to-the-bottom commoditization, poor product presentation, no color try-on guidance
- **Generic WooCommerce store:** Functional but aesthetically poor, often English-first, no brand story, no trust infrastructure

None of these options deliver what MARTAL delivers: a branded, Arabic-first, mobile-native shopping experience for premium Korean lenses with COD payment, full product transparency, and a WhatsApp support line.

### Core Value Proposition

> **MARTAL is the only place in Egypt where you can browse, compare, and order genuine Korean colored lenses in a premium digital experience — fully in Arabic, paid on delivery, delivered anywhere.**

Every word in that proposition is doing work:

- *Only place* — category ownership, not comparison
- *Browse, compare, and order* — full commerce experience, not a DM
- *Genuine Korean* — the primary trust objection addressed directly
- *Premium digital experience* — the UX is the differentiator
- *Fully in Arabic* — native market understanding, not a translated template
- *Paid on delivery* — zero financial risk for the buyer
- *Delivered anywhere* — geographic inclusivity (Cairo + all governorates)

### Brand Promise

**"عدسات كورية أصلية — تطمني وتطلبي."**  
*(Genuine Korean lenses — shop with confidence.)*

This promise has two parts: authenticity (the product) and confidence (the experience). Both must be delivered. A beautiful website that sells unreliable lenses destroys the brand. Genuine product sold through a poor website fails to reach its potential. MARTAL 2.0 must deliver both halves.

### Positioning Statement

*For Egyptian women aged 18–35 who want to elevate their look with colored contact lenses, MARTAL is the premium Arabic-first e-commerce destination that delivers genuine Korean-manufactured lenses with a curated brand experience, Cash on Delivery payment, and direct WhatsApp support — unlike Instagram resellers or marketplace listings, which offer no brand guarantee, no return policy, and no customer relationship.*

### Customer Trust Factors and Perception Goals

The brief (§6.2) lists the six trust factors specific to the Egyptian market. The strategic goal behind each:

| Trust Factor | Perception Goal |
|---|---|
| COD payment | "I will not lose my money if something goes wrong" |
| Arabic-first UI | "This brand knows me and speaks to me" |
| Visible review counts | "Other Egyptian women already buy here and are happy" |
| Authenticity signals | "These are the real thing, not Chinese counterfeits" |
| WhatsApp accessibility | "There is a real person I can talk to" |
| Governorate shipping | "I am included — this is not Cairo-only" |

Each perception goal must be achievable from the product page alone, because that is where the purchase decision is made.

---

## 3. Competitive Advantage

### 3.1 Product Advantages

MARTAL's product curation is a strategic asset that generic competitors cannot easily replicate. Five distinct brand lines — each with a defined positioning, aesthetic, and price tier — allow MARTAL to serve multiple customer segments without appearing unfocused. Hypnose anchors the premium natural segment. ElAmore owns the bridal and occasion market. ICONIC serves the bold and expressive buyer. Labella and FXEyes cover the everyday-wear middle.

The strategic advantage is not carrying every lens ever made. It is carrying the *right* ones, presenting them brilliantly, and building brand recognition around each line. When a customer becomes a "Hypnose customer," they come back for Hypnose. That brand-to-customer loyalty loop is impossible to build on a marketplace or through a generic reseller.

**What this means for the product:** Each brand must have its own dedicated page (`/brand/[slug]`), its own visual presentation within product cards, and its own narrative in the brand hero. The WooCommerce product categories structure should reflect brand identity, not just product taxonomy.

### 3.2 Brand Advantages

MARTAL has a name, a visual identity, a color system, and a brand voice. Most competitors in this market do not. This is an enormous structural advantage that compounds over time: every customer who has a positive experience deposits brand memory that makes the next purchase easier and makes word-of-mouth referrals specific ("order from MARTAL" rather than "I got mine from some Instagram page").

The brief (§11) defines the design principles behind this identity. The strategic implication is that design quality is a competitive moat. A low-trust competitor cannot close the experience gap by copying a single feature. They would need to rebuild the entire system.

### 3.3 Customer Experience Advantages

**Before purchase:** MARTAL offers product photography, color swatches, specifications, reviews, and a search experience that helps a customer find the right lens. An Instagram reseller offers photos in a grid.

**During purchase:** MARTAL offers a structured cart, a validated checkout form with governorate selection, and real-time order confirmation through WooCommerce. An Instagram reseller requires a DM, a screenshot, and a manual payment transfer.

**After purchase:** MARTAL offers an order confirmation page, a WhatsApp follow-up, and (in v2.1) a full account with order history. An Instagram reseller offers silence until the package arrives — or doesn't.

The experience gap is so large that MARTAL's premium pricing is actually *easier* to justify than a reseller's lower prices. Because the experience value is visible and immediate, while the product quality risk of a cheaper alternative is uncertain.

### 3.4 Digital Experience Advantages

MARTAL 2.0 is built on a stack (Next.js, TypeScript, Tailwind, Framer Motion, WooCommerce) that produces a genuinely fast, animated, and polished experience. This is not achievable for an Instagram seller, a Facebook shop, a basic marketplace listing, or a first-generation WooCommerce store running a generic theme.

Speed alone is a differentiator. In a market where users are on mid-range Android devices on mobile data, a sub-2.5-second LCP load time is a competitive advantage. A competitor's four-second load time on a generic theme is a conversion killer. MARTAL 2.0's performance targets (defined in the brief, §14) are not engineering vanity — they are commercial strategy.

### 3.5 Mobile Experience Advantages

The brief (§4.1, G3) establishes mobile-first as a technical requirement. The strategic reasoning: MARTAL's entire target audience is mobile-native. They discover products on TikTok (mobile). They browse on Instagram (mobile). They communicate on WhatsApp (mobile). When they arrive at MARTAL, everything — the bottom navigation, the sticky PDP bar, the swipe gallery, the full-screen filter drawer, the one-thumb checkout form — must feel like it was designed *for them on their phone*, not adapted from a desktop design.

A competitor who built their experience on desktop first and adapted it to mobile will never close this gap without rebuilding from scratch. MARTAL 2.0 has the architectural advantage of starting mobile-first.

### 3.6 Service Advantages

WhatsApp is not just a support channel for MARTAL. It is a trust channel, a pre-sale consultation channel, and a post-purchase communication channel. The floating WhatsApp button (present on every page) signals that MARTAL is accessible and responsive. A customer who uses it before purchase and receives a helpful response has dramatically higher conversion probability and dramatically lower return rate.

COD is not a service limitation — in this market, it is a service feature. It eliminates the financial trust barrier that makes online purchasing anxiety-inducing for a significant portion of the target audience.

---

## 4. Customer Psychology

Understanding why Egyptian women buy colored lenses — and why they hesitate — is the foundation of MARTAL 2.0's UX decisions. Every design choice that reduces friction, adds social proof, or communicates authenticity is a direct response to one of the psychological forces described here.

### 4.1 Fear: Fake or Low-Quality Products

**The fear:** Colored contact lenses that are counterfeit, improperly manufactured, or not FDA/CE-equivalent certified can damage eyesight. Egyptian buyers are aware that the market has low-quality imports. The fear is not irrational — it is well-founded.

**The objection it produces:** "How do I know these are really Korean and not Chinese copies?"

**How MARTAL 2.0 addresses it:**
- "عدسات كورية أصلية 100%" appears in the announcement bar on every page
- The About page (§9.2 of the brief) tells the brand origin story and sourcing transparency narrative
- Each product page displays the manufacturing origin in the specifications table
- Brand pages reinforce each brand's Korean heritage
- The visual quality of the site itself is a proxy signal — a scammer does not build this

### 4.2 Fear: Wrong Color Choice

**The fear:** Colored lenses look dramatically different on-eye than in photographs. A color that looks beautiful in a product image may look unnatural, too intense, or mismatched to a customer's skin tone or eye color. Buying the wrong color means wasted money and the embarrassment of a look that doesn't work.

**The objection it produces:** "What if it doesn't suit me?"

**How MARTAL 2.0 addresses it:**
- Color swatch selectors on every product card and product detail page
- Per-variant product imagery where possible (different lens on a model's eye for each color)
- "Shop by Look" editorial grid on the homepage — category browsing by aesthetic outcome, not product specification
- Customer review section that includes authentic photos (UGC strategy, v2.1)
- Product descriptions that describe the on-eye effect, not just the pigment
- FAQ entry: "How do I choose the right lens color for my skin tone?"
- Future: AR try-on (v3) — but even without it, the content strategy must do maximum work

### 4.3 Fear: Physical Discomfort or Eye Damage

**The fear:** Contact lenses worn incorrectly, worn too long, or manufactured without proper oxygen permeability can cause eye irritation, infection, or lasting damage. First-time buyers especially carry this fear.

**The objection it produces:** "Are these safe? Will they hurt my eyes?"

**How MARTAL 2.0 addresses it:**
- "How to Use" tab on every product detail page — clear wearing and care instructions
- FAQ section addressing safety, wearing duration, and hygiene protocols
- Specifications table includes: water content, oxygen permeability (DK/t), base curve, diameter, and wearing duration
- Reassurance copy: monthly disposables with defined replacement schedule
- Trust signal: the legitimacy of the brand itself (professional website, COD, WhatsApp contact) implies serious operation, not a fly-by-night seller

### 4.4 Fear: Wasting Money with No Recourse

**The fear:** Online purchases in Egypt frequently produce no-recourse situations — the seller disappears, the product is not as described, or returns are impossible. Spending 400–550 EGP with no guarantee is a real financial risk for many buyers.

**The objection it produces:** "What if I receive the wrong thing or nothing at all?"

**How MARTAL 2.0 addresses it:**
- COD is the first and most powerful answer — financial risk is eliminated
- Returns & Exchanges policy page linked prominently in footer and FAQ
- Order confirmation with order number — documented proof of purchase
- WhatsApp as post-order contact — direct human line, not a ticket system
- Seller legitimacy signals throughout the site (professional design, brand story, About page)

### 4.5 Motivation: Aesthetic Aspiration

**The desire:** To look beautiful, elevated, and distinctive. Colored lenses are not corrective — they are transformative. The buyer is not purchasing a product, she is purchasing a look.

**How MARTAL 2.0 activates it:**
- Hero section that sells the transformation, not the product specification
- "Shop by Look" editorial format — aesthetic outcome as the primary browse entry point
- Product imagery and names (Hypnose, ICONIC, ElAmore) that are evocative, not clinical
- Brand language that is aspirational and feminine throughout
- Framer Motion entrance animations that give the shopping experience a premium, editorial feel

### 4.6 Motivation: Social Influence

**The desire:** To look like the influencers and beauty creators they follow on TikTok and Instagram. Discovery for most MARTAL customers happens through content — a Reel, a TikTok, a story — where someone they admire wears colored lenses they want.

**How MARTAL 2.0 activates it:**
- Bestseller and "trending" signals reinforce social consensus
- Review counts and sold counts show peer validation
- Future UGC section (v2.1) creates the content loop: customers buy, post, new customers discover
- WhatsApp pre-purchase consultation can resolve "which color does [influencer name] wear?" questions

### 4.7 Buying Triggers

| Trigger | Mechanism | Where It Appears |
|---|---|---|
| Social proof | Bestseller badge, sold count, rating stars, review count | Product card, PDP |
| Scarcity | Low stock indicator, "limited availability" signal | PDP, cart |
| Urgency | Sale countdown, "sale ends soon" | Shop grid, PDP |
| Authority | Korean origin badge, brand story | PDP specs, brand page, about page |
| Risk reduction | COD badge, returns policy link | PDP, cart, checkout |
| Similarity | "Customers also bought" | PDP related products section |

---

## 5. Customer Personas

These four personas represent the primary buyer archetypes in MARTAL's market. They are strategic archetypes — not invented individuals — built on real behavioral patterns in the Egyptian beauty and mobile commerce context.

---

### Persona A — Sara, The University Student

| Attribute | Detail |
|---|---|
| **Age** | 19 |
| **Location** | Mansoura, Dakahlia Governorate |
| **Occupation** | Second-year university student, Fine Arts |
| **Monthly budget for beauty** | 300–500 EGP |
| **Device** | Android (mid-range, 6–8 inch screen), mobile data primary |
| **Preferred channels** | TikTok first, Instagram second, WhatsApp for everything else |

**Goals:** Look distinctive among peers without spending too much. Try a natural-but-elevated color that photographs well. Buy something she can talk about and share.

**Frustrations:** Pharmacy lenses are boring and clinical. Instagram resellers ask for money transfers she is not comfortable with. She wants to be able to pay when the package arrives. She is worried about buying the wrong color and regretting it.

**Buying behavior:** Discovers MARTAL via a TikTok that shows before/after with a specific lens. Visits the site on her phone. Browses by color — she knows she wants something honey or hazel. Reads reviews carefully. Checks the price against her budget. Adds to wishlist, waits a week, comes back and orders. Uses WhatsApp once to ask "how long does delivery to Mansoura take?"

**Conversion triggers:** Bestseller badge, visible sold count, authentic customer photos in reviews, COD confirmed prominently, delivery to her governorate confirmed.

**Design implications:** Product images must be large and immediately legible on a mid-range Android. Color names must be written in both Arabic and English (she searches in both). Wishlist must persist between sessions because her purchase cycle is 5–10 days. The WhatsApp button must be visible without scrolling.

---

### Persona B — Nour, The Young Professional

| Attribute | Detail |
|---|---|
| **Age** | 27 |
| **Location** | New Cairo, Cairo Governorate |
| **Occupation** | Marketing Coordinator, private sector |
| **Monthly budget for beauty** | 1,000–2,000 EGP |
| **Device** | iPhone (recent model), WiFi primary, occasionally desktop |
| **Preferred channels** | Instagram, LinkedIn (professionally), WhatsApp |

**Goals:** Find a signature lens look she wears daily to work. Values quality and consistency — she wants a lens that looks natural and professional, not costume-like. Willing to pay more for a brand she trusts. Likely to become a repeat customer if the first experience is excellent.

**Frustrations:** Generic online stores feel unreliable. She has been burned before by a product that looked different from the photo. She wants to see real specifications (water content, oxygen permeability) before buying.

**Buying behavior:** Discovers MARTAL through an Instagram post. Arrives at the site, navigates directly to Hypnose (the brand seems most aligned with her "natural premium" aesthetic). Reads the specifications tab thoroughly. Checks the About page to understand who MARTAL is. Places an order within a single session. Expects a smooth checkout — she will abandon if the form is clunky. Likely to order again in 30 days when the monthly lens needs replacing.

**Conversion triggers:** Product specifications, brand legitimacy signals, clean checkout with minimal fields, COD as risk elimination, professional visual quality of the site.

**Design implications:** Specifications tab on the PDP is not optional — it must be comprehensive. The About page must feel like a real brand, not a template. Repeat purchase should be streamlined: saved address (v2.1), quick reorder from account history.

---

### Persona C — Hana, The Bride

| Attribute | Detail |
|---|---|
| **Age** | 24 |
| **Location** | Alexandria |
| **Occupation** | Teacher, engaged |
| **Monthly budget for beauty** | Variable — currently elevated for wedding preparation |
| **Device** | iPhone, mobile-first, some desktop research |
| **Preferred channels** | Instagram, Pinterest, WhatsApp with vendors |
| **Time pressure** | High — wedding in 6 weeks |

**Goals:** Find the perfect lens for her wedding day look. Needs gray or blue — something dramatic but not theatrical. Needs absolute certainty about product quality and delivery reliability. Will likely also purchase for the engagement, the bridal shower, and daily post-wedding wear.

**Frustrations:** She cannot risk receiving the wrong product or a late delivery. Her wedding date is fixed. She needs to know exactly when she will receive the order and has zero tolerance for ambiguity. She may want to purchase multiple colors to test before the event.

**Buying behavior:** Arrives with high intent — she knows what category she wants (bridal). Navigates to ElAmore or ICONIC for statement gray/blue options. Reads reviews specifically looking for wedding-context mentions. Likely to use WhatsApp before purchasing to confirm delivery timeline to Alexandria. Places a higher-value order (possibly 2–3 variants). Will share on Instagram after the wedding.

**Conversion triggers:** Delivery timeline clarity (shipping to Alexandria, estimated days), stock availability confirmed, wedding-specific product positioning (ElAmore Bridal is exactly right), WhatsApp pre-purchase consultation, review photos showing wedding looks.

**Design implications:** Shipping policy must be easily accessible from the product page — a FAQ accordion entry "How long does delivery take to Alexandria?" is a conversion-critical piece of content. Stock availability must be visible. The WhatsApp button must be prominently present on the PDP. ElAmore Bridal must be prominently featured in the homepage "Look" editorial.

---

### Persona D — Yasmine, The Returning Customer

| Attribute | Detail |
|---|---|
| **Age** | 23 |
| **Location** | Giza |
| **Occupation** | Graphic Designer, freelance |
| **Order history** | 2 previous orders — Hypnose Brown, Labella Gray |
| **Device** | Android, mobile-only |
| **Preferred channels** | WhatsApp, Instagram |

**Goals:** Reorder quickly. She knows what she wants — Hypnose Brown, same color, same size. She does not need to browse, read reviews, or evaluate. She wants to tap three times and order. She also wants to discover if there are any new colors or promotions since her last visit.

**Frustrations:** She should not have to re-enter her address every time. She should not have to search for the product she already knows she wants. Any friction between intent and order is a failure.

**Buying behavior:** Comes back to MARTAL because the previous experience was good and the product delivered quality. Will check for new arrivals or sale items as a secondary action. Expects checkout to be even faster than the first time.

**Conversion triggers:** Familiarity (saved address, order history in v2.1), new arrivals signal ("جديد" badge), promotional offers, speed.

**Design implications:** The wishlist serves a holding function between purchases — Yasmine should have her regular lenses wishlisted so reordering is a two-tap action. Account page (with saved address and order history) in v2.1 must be prioritized for this persona. The returning customer journey is currently unaddressed in MARTAL 1.0 — this is a major conversion opportunity.

---

## 6. Conversion Funnel Strategy

### The MARTAL Conversion Funnel

```
Social Media Discovery
         ↓
Site Arrival (Homepage or Product Page)
         ↓
Product Discovery (Browse / Search / Filter)
         ↓
Product Evaluation (PDP — the decision page)
         ↓
Add to Cart
         ↓
Cart Review
         ↓
Checkout
         ↓
Order Confirmation
         ↓
Repeat Purchase
```

Each stage has a distinct user mindset, a specific set of questions being asked, and a set of things MARTAL must do to move the user to the next stage without losing them.

---

### Stage 1: Social Media Discovery

**User mindset:** Passive reception. The user is scrolling, not shopping. She sees a Reel, a TikTok, or an Instagram post featuring lenses. Something catches her attention — a color, a look, an influencer she trusts.

**Questions being asked:** *"Is that real? Where did she get those? How do I find them?"*

**What MARTAL needs:** A link-in-bio or ad landing page that is fast, beautiful, and immediately confirms "yes, this is the right place." The homepage or a brand-specific landing page must mirror the aesthetic promise of the social content that brought the user there.

**Drop-off risk:** Slow load time. If the site takes more than 3 seconds to show meaningful content on mobile, the user returns to scrolling. This is the performance requirement in the brief (§14) expressed as a conversion imperative.

**Solution:** Hero section loads server-rendered HTML instantly. Images are WebP, optimized via Next.js `<Image>`. The first frame of content communicates brand identity in under one second.

---

### Stage 2: Product Discovery

**User mindset:** Active exploration. She wants to see what MARTAL has. She may browse by brand, by look, by color, or by bestseller. She is building a consideration set.

**Questions being asked:** *"Do they have my color? Which brand is the best? What does this look like on someone with my complexion?"*

**What MARTAL needs:**
- A fast, filterable shop grid that shows large, clear product images
- Color variant chips visible on the product card (not hidden behind a click)
- "Shop by Look" editorial on the homepage that speaks to aesthetic outcome
- Brand cards that make the five product lines feel distinct and curated

**Drop-off risk:** Overwhelm (too many options with no guidance) or under-supply (filtered to zero results). The filter system must be intuitive, the empty state must suggest alternatives, and the default sort (bestseller) must show the most conversion-proven products first.

**Solution:** Default shop view = bestsellers. Filter drawer is accessible but not forced. Quick View allows evaluation without navigating away from the grid. Color swatches on cards give a sense of range without clicking through to every PDP.

---

### Stage 3: Product Evaluation (The Decision Page)

**User mindset:** Critical assessment. She has found a candidate. Now she is interrogating it. This is the most important stage in the funnel. Every doubt she has must be addressed on this page or she will leave.

**Questions being asked:**
- *"Does this color look natural or fake?"*
- *"Are these really Korean?"*
- *"What do other people say?"*
- *"How do I care for these?"*
- *"What if they don't suit me?"*
- *"How much does delivery cost? How long does it take?"*
- *"Can I pay on delivery?"*

**What MARTAL needs:** The product detail page must answer all of these questions without requiring navigation elsewhere. The brief (§9.1) documents the PDP components. The strategic sequencing is:

1. Product imagery (first impression — does it look right?)
2. Color swatches with per-variant pricing (which variant should I choose?)
3. Rating + sold count + review count (do others trust this?)
4. Price + COD badge + Add to Cart (am I ready to commit?)
5. Tabs — Description / Specs / How to Use / Reviews (deeper evaluation for doubters)
6. Related products (in case this one is not quite right)

The sticky mobile Add-to-Cart bar ensures the CTA is always accessible, no matter how deep into the tabs she goes.

**Drop-off risk:** Unanswered questions. If she cannot find delivery time information, she will WhatsApp to ask — a friction point that may or may not result in conversion. If she cannot see the lens on a real person's eye, she will lose confidence.

**Solution:** FAQ entry surfaced on PDP: "توصيل لكل المحافظات — استلام خلال 3–5 أيام عمل." Shipping clarity must exist on the PDP, not only on the shipping policy page. WhatsApp button is always visible for questions that the page cannot answer.

---

### Stage 4: Add to Cart

**User mindset:** Tentative commitment. She has decided to try. She has not fully committed — she may still abandon in cart or checkout. But the decision to add is a major psychological threshold.

**Questions being asked:** *"Did that work? What's in my cart? How much will this cost me total?"*

**What MARTAL needs:**
- Immediate visual confirmation: cart toast notification (✓ أضيف للسلة)
- Cart badge updates instantly across navbar and mobile bottom nav
- No page redirect on add — she stays on the PDP or grid to continue browsing

**Drop-off risk:** Adding to cart and then losing the session before checkout (especially on mobile with app-switching). The Zustand cart with localStorage persistence (brief §16) eliminates this risk. The cart survives navigation, browser close, and return visits.

---

### Stage 5: Cart Review

**User mindset:** Verification. She is reviewing her choices before committing financial intent through checkout.

**Questions being asked:** *"Is this what I actually want? How much is the total? What are the delivery costs?"*

**What MARTAL needs:**
- Clear line items with product image, name, color, quantity, and price
- Editable quantity and the ability to remove items without losing everything
- Total displayed prominently with shipping calculated or clearly stated
- COD badge visible in the cart summary — reassurance that she is not being asked for money now
- Proceed to Checkout CTA that is visually dominant

**Drop-off risk:** Unexpected shipping cost. The free shipping threshold (800 EGP) must be surfaced in the cart — "أضيفي منتج بـ150 جنيه للحصول على شحن مجاني" (add 150 EGP to qualify for free shipping). This also serves as an upsell mechanism.

---

### Stage 6: Checkout

**User mindset:** Committed but cautious. She has decided to buy. Any friction at this stage — a confusing form, an unexpected field, a validation error she cannot understand — is a conversion loss.

**Questions being asked:** *"How do I fill this out? Will my address work? When will I receive this? What happens after I click order?"*

**What MARTAL needs:**
- The shortest possible form: name, phone (Egyptian mobile format with validation), governorate (dropdown, all 27), street address, optional notes
- Real-time field validation with Arabic error messages
- Governorate dropdown that confirms delivery to her location
- Order summary visible alongside the form (she should not have to scroll back to remember what she ordered)
- "ستدفع عند الاستلام" (you will pay on delivery) repeated prominently — this is not just policy, it is anxiety reduction
- Single CTA: "تأكيد الطلب" (Confirm Order)

**Drop-off risk:** Phone number format confusion (should she include the country code? The leading zero?). The form must accept and normalize Egyptian mobile numbers in any common format. An error like "invalid phone number" on a correctly-typed Egyptian number is a critical failure.

---

### Stage 7: Order Confirmation

**User mindset:** Relief and anticipation. The order is placed. She wants confirmation, clarity about next steps, and a point of contact.

**What MARTAL needs:**
- Order number prominently displayed (her reference for any future communication)
- Summary of what she ordered
- Expected delivery timeline (approximate, by governorate if possible)
- WhatsApp link pre-filled with her order number for tracking inquiries
- "Continue Shopping" CTA (secondary — do not make her feel the journey is over)
- Cart cleared, order number stored in localStorage for account history

---

### Stage 8: Repeat Purchase

**User mindset:** Returning with intent. She had a positive experience. The product delivered quality. She is back for the same lens or to try a new color.

**What MARTAL needs:**
- Wishlist as a reorder shortcut (her regular lens is saved)
- Account order history (v2.1) for one-tap reorder
- Post-purchase WhatsApp follow-up (7–14 days after delivery): "How are you enjoying your Hypnose Brown? We have a new color you might love — [link]"
- New arrivals badge ("جديد") visible on the homepage and shop grid so returning customers see what's changed

---

## 7. Revenue Strategy

### 7.1 Average Order Value (AOV)

The single most actionable lever for AOV in MARTAL's current model is the **free shipping threshold**. At 800 EGP with products priced 390–550 EGP, most customers are 1–2 products below the threshold. The gap is a natural upsell opportunity at two touchpoints:

- **Cart page:** "أضيفي منتجاً واحداً بـ[X] جنيه لتحصلي على شحن مجاني" — progressive bar showing proximity to threshold
- **Product page:** "Buy with [related product] and get free shipping" — bundle suggestion

**Cross-sell strategy:** The most natural cross-sell in colored lenses is lens solution and lens cases. These are low-cost, high-frequency consumables that pair naturally with a lens purchase. Catalog expansion to include lens care accessories (v2.1 WooCommerce products) would increase AOV on virtually every transaction.

**Upsell strategy:** Within the lens catalog, upsell is best achieved through color comparison — showing that the premium color variant (+30–50 EGP) has higher visual impact or better specifications. The per-variant pricing display on the PDP enables this: when a customer selects a gray variant, show that the "Storm Gray" variant is 30 EGP more with a more dramatic effect.

**Bundle strategy:** "The Complete Look" bundle — lens + solution + case — at a slight discount vs. individual prices. Implemented as a WooCommerce grouped product. Displayed on the PDP as a "frequently bought together" section.

### 7.2 Conversion Rate

Conversion rate in this market is primarily driven by three factors:

1. **Trust** (addressed throughout this document)
2. **Friction** (see §9, UX Strategy)
3. **Timing** (capturing the user at peak intent)

Peak intent timing is a function of the funnel entry point. A user who arrives directly on a product page (from a social media link) is at higher intent than one who arrives on the homepage. MARTAL's social content and influencer strategy should link directly to specific product pages, not to the homepage — every extra navigation step is a conversion loss.

### 7.3 Repeat Purchases

Contact lenses are monthly disposables. A customer who purchases once, has a positive experience, and receives her product in good condition is a natural 12x-per-year revenue source if retained. MARTAL's repeat purchase strategy has three components:

**1. WhatsApp Retention Sequence**

| Timing | Message |
|---|---|
| Order confirmed | "Your order #[X] is confirmed. We'll ship within 1–2 working days." |
| Order shipped | "Your order is on its way! Expected delivery in [2–3] days." |
| Day 7 post-delivery | "How are you enjoying your [product]? We'd love to hear from you 🌟" |
| Day 25 post-delivery | "Your monthly lenses are almost up — ready to reorder? [link]" |
| Day 30 post-delivery | "It's time to replace your lenses! Same order? [Quick reorder link]" |

This sequence converts a single purchase into a subscription-like behavior without requiring a formal subscription feature.

**2. Wishlist as Retention Anchor**

A customer who has wishlisted a product she hasn't yet purchased is an engaged, high-intent user. WhatsApp outreach (or, in v2.1, email) on wishlisted products with a "back in stock" or "on sale now" message has disproportionate conversion value because the consideration work is already done.

**3. Account History (v2.1)**

Once authentication is implemented, the account page becomes a one-tap reorder surface. "Order Again" from the order history eliminates every friction point in the repeat purchase journey. This is the highest-ROI feature in the v2.1 roadmap.

### 7.4 Customer Lifetime Value (CLV)

At a conservative 4 purchases per year at an average of 440 EGP, a retained MARTAL customer is worth approximately 1,760 EGP per year in revenue. The customer acquisition cost through social media content and WhatsApp is low. The CLV-to-CAC ratio is highly favorable if repeat purchase is properly engineered.

The strategic implication: retention investment (WhatsApp sequences, wishlist, account features) has a higher ROI than acquisition investment beyond a certain scale. MARTAL 2.0 must lay the technical foundation for retention (persistent cart, persistent wishlist, order history in localStorage, WhatsApp integration) even if the retention automation itself comes in v2.1.

### 7.5 Seasonal Campaign Strategy

| Season / Event | Lens Category | Campaign Angle |
|---|---|---|
| Ramadan | Natural, elegant | إطلالة رمضانية — لفتة جمال هادية |
| Eid al-Fitr | Statement, festive | العيد إطلالة — احتفلي بنظرة مختلفة |
| Eid al-Adha | Natural + bridal | إطلالة العيد الكبير |
| Wedding season (spring/fall) | ElAmore Bridal | عيون العروسة — اليوم الأجمل |
| Back to University (Sept) | Budget-friendly everyday | إطلالة الجامعة — ثقة وأناقة |
| Valentine's Day | Bold colors | نظرة تخطف القلوب |
| New Year | Statement / ICONIC | ابدئي السنة بإطلالة جديدة |

Each campaign requires a WooCommerce coupon, a tagged product collection, a homepage hero swap, and a WhatsApp broadcast. MARTAL 2.0's architecture (ISR revalidation, WooCommerce coupon API, dynamic hero sections) must support rapid campaign deployment without code changes.

---

## 8. Mobile-First Strategy

### 8.1 Why Mobile Is Not Optional

The brief established mobile-first as a technical requirement. This section explains the commercial logic behind it.

MARTAL's primary audience — Egyptian women aged 18–35 — lives on their phones. TikTok, Instagram, WhatsApp, and now e-commerce are phone-first experiences. According to the behavioral pattern described in persona research, discovery, consideration, and purchase all happen on the same device in the same session. There is no "I'll check this out later on my laptop" behavior for this audience. If the mobile experience fails, the sale is lost entirely — there is no desktop fallback session.

Furthermore, mid-range Android devices (4–6GB RAM, mid-tier Snapdragon or MediaTek processors, typically on mobile data rather than WiFi) dominate the Egyptian market outside of high-income segments. This means MARTAL 2.0 must perform well not on a Pixel 8 on fiber WiFi — but on a Samsung A-series or Xiaomi Redmi on 4G LTE with variable signal.

### 8.2 Expected Device Split (Qualitative Projection)

| Device Category | Estimated Share |
|---|---|
| Mid-range Android (primary) | ~65% |
| iPhone (growing segment) | ~25% |
| Desktop / laptop | ~10% |

This projection is based on Egyptian smartphone market dynamics. Design and QA priorities should follow this split — mobile Android is the primary test surface.

### 8.3 Thumb-Zone Design

The vast majority of mobile usage is one-handed — the phone held in the right hand, operated by the thumb. The thumb's natural reach on a standard smartphone creates three zones:

- **Comfortable zone:** Lower center of the screen — easy to reach without repositioning
- **Stretch zone:** Upper corners — reachable but requires repositioning
- **Difficult zone:** Upper edge — requires hand repositioning or second hand

Every primary action in MARTAL must live in the comfortable or stretch zone:

| Element | Target Zone |
|---|---|
| Mobile bottom navigation (Home, Shop, Cart, Wishlist, Account) | Comfortable — always visible at bottom |
| Add to Cart (sticky PDP bar) | Comfortable — anchored to bottom of screen |
| Search icon | Stretch — top of navbar, acceptable because it is not a primary action |
| Filter button on shop grid | Comfortable — positioned in the lower toolbar |
| Quantity +/− selectors | Comfortable — mid-screen on PDP |
| Checkout CTA | Comfortable — bottom of cart and checkout pages |

### 8.4 One-Handed Navigation Principles

- Bottom navigation is the primary navigation on mobile — not the header nav
- No critical actions placed in the top-right corner that require repositioning
- Product cards are tall enough to tap easily (minimum 44px touch targets on all interactive elements)
- Color swatches have a minimum 36px touch target with adequate spacing between chips
- The filter drawer opens from the bottom (not the side) on mobile — bottom sheets are easier to reach one-handed than side drawers

### 8.5 Mobile Performance Requirements

From the brief (§14), the targets are:
- LCP < 2.5 seconds
- CLS < 0.1
- INP < 200ms

The strategic translation: on a mid-range Android on 4G, MARTAL must show meaningful content within 2.5 seconds. This requires:

- Hero image served as WebP, sized for mobile first (375px wide)
- Fonts loaded with `display: swap` — text is readable before the font loads
- Product grid images lazy-loaded below the fold
- No layout shift as fonts, images, or components load (skeleton placeholders for all async content)
- Framer Motion animations gated on `prefers-reduced-motion` and only triggered after LCP — never at the expense of load performance

### 8.6 Mobile Checkout Requirements

The checkout form is where mobile experiences most commonly fail. MARTAL's checkout form must be engineered specifically for a woman filling out a form with her thumb on a moving Metro car in Cairo:

- **Single column layout** — no side-by-side fields on mobile
- **Correct keyboard types per field:** `type="tel"` for phone (triggers numeric keyboard), `autocomplete` attributes for name and address fields
- **Governorate as native `<select>`** — the native OS picker is faster and more accessible than a custom dropdown on mobile
- **No unnecessary fields** — every field removed is a friction reduction. MARTAL does not need email at checkout (v2.0). WhatsApp number (phone) is sufficient.
- **Sticky "Confirm Order" button** — always visible at the bottom of the viewport, never buried below the form
- **Arabic error messages** — field validation errors in Arabic, in-context (below the field, not in a banner)

### 8.7 Mobile Search Behavior

Mobile search in this market is character-limited and typo-prone. Users search for:
- Brand names: "hypnose", "hypnoz", "هيبنوز"
- Color names: "brown", "braun", "بني"
- Aesthetic descriptors: "طبيعي", "natural", "عسلي"
- Occasion: "عروسة", "يومي"

Search must tolerate Arabic-English code-switching, typos, transliteration, and incomplete words. The v1 search engine's synonym map must be expanded and integrated at the WooCommerce product taxonomy level to enable server-side search filtering.

### 8.8 Mobile Product Browsing Behavior

Mobile users scan, not read. In the shop grid:
- Images dominate — text is secondary to visual impact
- Price and badge are the only text elements that register in a scan
- The decision to tap into a product is made in under one second based on image and price
- Color swatches on the card reduce the need to enter the PDP for initial color consideration

The implication: product card images must be high quality, correctly cropped for mobile (portrait format preferred over landscape), and load fast. An image that loads slowly or appears blurry on a mid-range Android screen is a direct conversion loss.

---

## 9. UX Strategy

### 9.1 Core UX Principles

These seven principles govern every UX decision in MARTAL 2.0. When in doubt about a design choice, return to these:

**Principle 1: Show products fast.**  
The fastest path from any entry point to a product image is the right path. Navigation, filters, and editorial content exist to serve product discovery — not to demonstrate brand sophistication at the expense of speed.

**Principle 2: Never make her think.**  
Every time a user must figure out what to do next, there is a risk of abandonment. Labels must be clear. CTAs must be unambiguous. Forms must validate in real-time with helpful messages. The default state of every page must be the correct state for most users.

**Principle 3: Earn every click.**  
Each additional tap required to complete a journey is a conversion risk. The cart icon should add items, not navigate away. Quick View should preview, not replace. Checkout should be one page, not a multi-step wizard.

**Principle 4: Trust before action.**  
Place trust signals above calls to action. A user who sees "100% Korean" and reviews before she sees "Add to Cart" is more likely to tap Add to Cart than one who sees the CTA first. Trust earns the conversion; urgency closes it.

**Principle 5: Motion has meaning.**  
Framer Motion animations are not decoration. Every animation must communicate something: state change, hierarchy, progress, or delight. Animations that serve no communicative purpose will be removed. Animations that make the experience feel sluggish will be removed.

**Principle 6: Errors are education, not punishment.**  
Form validation errors, empty search states, out-of-stock conditions — all must be presented as helpful guidance, not dead ends. An empty search result should suggest alternatives. An out-of-stock badge should offer a wishlist save. A form error should explain what format is needed, not just that something is wrong.

**Principle 7: Every page has one job.**  
The homepage converts browsers into discoverers. The shop page converts discoverers into evaluators. The PDP converts evaluators into buyers. The checkout converts buyers into confirmed orders. Never ask a page to do more than its one job.

### 9.2 Navigation Philosophy

MARTAL 2.0 has two navigation systems: the desktop header nav and the mobile bottom nav. They serve different users and different contexts. The mobile bottom nav (Home, Shop, Cart, Wishlist, Account) is the primary system and is designed for one-handed, thumb-zone operation. The header nav is desktop-first and provides category-level navigation.

The search overlay is a global system, accessible from any page, that provides a faster path to product discovery than hierarchical navigation. Heavy search users (Persona B and D) will navigate primarily through search, not through the nav structure.

### 9.3 Filtering Philosophy

Filters exist to narrow, not to complicate. MARTAL's filter system should expose five dimensions: brand, color, price range, and product flags (bestseller / new / sale / monthly). This is the minimum necessary set. Adding more filter dimensions without catalog scale to justify them creates false complexity.

The filter state must be URL-persistent (`/shop?brand=hypnose&color=brown`) so that filtered URLs can be shared, linked from social media, or bookmarked. This doubles as an SEO mechanism — filtered URLs with meaningful query parameters can rank for specific search intent.

### 9.4 Checkout Philosophy

The checkout must be the simplest possible path from cart to confirmed order. MARTAL 2.0's checkout is a single page. There are no steps, no progress indicators, no "continue to shipping" → "continue to payment" flows. One page, one form, one button. The form collects only what is necessary for fulfillment: name, phone, governorate, address. Notes are optional. Everything else is collected by WooCommerce server-side.

### 9.5 Wishlist Philosophy

The wishlist is a consideration list, a retention mechanism, and a reorder shortcut simultaneously. In MARTAL 2.0, the wishlist is powered by Zustand with localStorage persistence (brief §16). A user can build a wishlist without any account — critical because MARTAL 2.0 has no authentication. The wishlist should be visually accessible from every product card and from the PDP without navigating away.

---

## 10. Information Architecture Strategy

The following ranking is ordered by commercial importance — the degree to which each page directly drives revenue or enables the journey toward revenue.

| Rank | Page | Commercial Role | Why |
|---|---|---|---|
| 1 | **Product Detail Page** | Direct conversion | This is where the purchase decision is made. Every other page is a path to here. |
| 2 | **Shop / Collection** | Discovery → PDP | The highest-traffic internal page. Filters and sorting here directly affect which products get evaluated. |
| 3 | **Checkout** | Revenue realization | Revenue exists only after checkout completes. Every UX failure here is direct revenue loss. |
| 4 | **Homepage** | Acquisition → discovery | First impression for most new visitors. Converts curious arrivals into active browsers. |
| 5 | **Search** | High-intent discovery | Search users have the highest conversion intent of any browsing pattern. Serving them well is disproportionately valuable. |
| 6 | **Cart** | Conversion stage | The last evaluation point before checkout. Upsell and retention mechanisms live here. |
| 7 | **Brand Pages** | SEO + brand loyalty | Drives organic traffic for brand-specific searches and deepens brand relationships with repeat customers. |
| 8 | **Wishlist** | Retention | High-intent products saved for later. Converts into purchases on return visits. |
| 9 | **Account** | Retention + CLV | Repeat purchase acceleration. Low value on first visit; high value as a retention surface. |
| 10 | **FAQ / Shipping / Returns** | Trust + conversion support | Reduces pre-purchase anxiety that would otherwise block conversion or generate WhatsApp inquiries. |
| 11 | **Contact** | Trust signal | Presence of a contact page increases conversion even for users who never use it. |
| 12 | **About** | Brand credibility | Builds long-term brand trust; particularly valuable for skeptical first-time visitors. |

---

## 11. Content Strategy

### 11.1 Homepage Content Goals

The homepage has a single conversion goal: move a first-time visitor from "curious" to "browsing products" within 30 seconds. Every content element must serve this goal.

- **Hero:** Sells the transformation, not the product. Lead with the aesthetic outcome ("إطلالة تخطف العيون"), not the specification ("عدسات شهرية ذات نفاذية أكسجين عالية").
- **Trust bar:** Establishes the three non-negotiables immediately: COD, Korean authenticity, nationwide shipping.
- **Shop by Look:** Organizes discovery by aesthetic intent — a user who doesn't know which brand she wants can enter through "Natural Look" or "Bridal Look" and be guided to the right products.
- **Bestsellers grid:** Social proof at catalog scale — "these are what Egyptian women are buying." Default sort by bestseller is the most commercially defensible default.
- **Brand showcase:** Five brand cards that give each line a visual identity and a click-through to the brand page.
- **Reviews carousel:** The most credible content on the page — real customers, real words, real photos (v2.1).

### 11.2 Product Page Content Goals

The PDP must answer every question that could prevent a purchase without requiring the user to navigate elsewhere. Content priority order:

1. **Images first** — large, clear, on-model imagery for each color variant
2. **Color and price second** — variant selection with per-variant pricing visible immediately
3. **Social proof third** — rating, review count, sold count before the fold
4. **Primary CTA fourth** — Add to Cart at the right moment (after trust is established)
5. **Deep content fifth** — tabs for description, specs, how-to-use, and full reviews

Every word in product descriptions should answer a specific question a customer might have. "Oxygen-permeable material for all-day comfort" answers "will these hurt after a few hours?" Product copy that describes how something looks without describing how it feels and how it performs is incomplete for this category.

### 11.3 FAQ Content Goals

The FAQ is a conversion tool, not a support document. It should be written by working backward from the questions that most frequently delay purchase or generate WhatsApp inquiries. Every FAQ entry that successfully answers a customer's question in-browser is a conversion it would not have had if the customer had to WhatsApp and wait.

Priority FAQ topics, in conversion impact order:
1. Delivery timeline by governorate
2. How to choose the right lens color
3. Are these genuinely Korean? How do I know?
4. Can I pay when the delivery arrives?
5. What if the color doesn't suit me — can I return them?
6. How do I care for monthly contact lenses?
7. Do I need a prescription to buy colored lenses?

### 11.4 Trust Content

Trust content is not a section of the website — it is a layer that must exist on every page. The implementation:

- Announcement bar: authenticity + COD + free shipping threshold (every page)
- Product card: badge (bestseller/new/sale), rating, brand name (every card)
- PDP: Korean origin in specs, sold count, review count, COD badge in sticky bar
- Cart: COD badge in order summary
- Checkout: "ستدفعين عند الاستلام" in the order confirmation block
- Footer: quick links to shipping policy, returns, FAQ (every page)

Trust content that requires navigation to find is trust content that most users will never see.

---

## 12. Search Strategy

### 12.1 Search as a Revenue Channel

Search is not a utility feature — it is a revenue channel. A user who uses search has already decided she wants something specific. She is at a higher point of purchase intent than a browser who is still exploring. Serving her search results fast and accurately converts at a higher rate than any other product discovery path.

MARTAL 2.0's search must be built with this commercial weight in mind.

### 12.2 The Search Experience

**Trigger:** The search icon in the navbar opens a full-screen search overlay (carried forward from v1, rebuilt in React). This overlay is the search surface — not a dedicated search page that requires navigation.

**Autocomplete:** As the user types, autocomplete suggestions appear in three categories:
- Products ("Hypnose Brown", "ElAmore Gray")
- Brands ("Hypnose", "FXEyes")
- Colors ("Brown", "Honey", "Gray")

This three-category structure mirrors the three primary search intents of MARTAL's customers.

**Recent searches:** Stored in localStorage, displayed when the overlay opens before any typing. Reduces friction for returning customers who search repeatedly for the same product.

**Popular searches:** A curated list of trending terms displayed before typing begins. Doubles as product discovery for users who open search without a specific query.

### 12.3 Arabic ↔ English Search

MARTAL's customers search in both Arabic and English, often in the same session. The search system must resolve:

| User types | Should return |
|---|---|
| "brown" | Brown lens variants |
| "بني" | Brown lens variants |
| "braun" (typo) | Brown lens variants |
| "hypnoz" (typo) | Hypnose brand |
| "هيبنوز" | Hypnose brand |
| "عسلي" | Honey color variants |
| "honey" | Honey color variants |
| "عروسة" | ElAmore Bridal + wedding-context products |
| "رمادي" | Gray variants |
| "gray" | Gray variants |
| "طبيعي" | Natural-finish products |

This requires a synonym table that maps Arabic terms to English product attributes and vice versa, implemented at the WooCommerce product tag / attribute level and resolved in the Next.js search layer. The v1 `ARABIC_SYNONYMS` map in `search-engine.js` is the starting point and must be expanded.

### 12.4 The Zero-Results State

A zero-results search is a conversion failure that must be designed as a conversion recovery. The zero-results page should:
- Confirm what was searched: "لا توجد نتائج لـ [query]"
- Suggest a correction if a likely match exists
- Show trending products or bestsellers as alternative discovery
- Offer a WhatsApp CTA: "لم تجدي ما تبحثين عنه؟ تواصلي معنا"

---

## 13. Trust & Credibility Strategy

### 13.1 The Trust Hierarchy

MARTAL's target customer has been burned before — by a reseller who sent the wrong product, a Facebook shop that never replied, or a marketplace listing that was nothing like the photo. Trust is not built with one signal. It is built with a cumulative system of signals that appear at every point in the journey and collectively overwhelm the customer's doubt.

The trust hierarchy, from most to least powerful:

1. **COD payment** — financial risk elimination. Nothing builds trust like "you pay when you receive it."
2. **Real customer reviews with photos** — peer validation. Nothing is more credible than another Egyptian woman showing the lens on her eye.
3. **WhatsApp availability** — human accessibility. "There is a real person I can talk to."
4. **Brand origin story** — contextual credibility. "This is a real company with a real story."
5. **Professional design quality** — proxy signal. "A scammer does not build this."
6. **Specifications and certifications** — rational validation. "The product data confirms the claims."
7. **Policy visibility** — legal clarity. "I know what my rights are."

### 13.2 Trust Placement Map

| Page | Trust Elements Present |
|---|---|
| Every page | Announcement bar (COD, authentic, free shipping), WhatsApp FAB, footer policy links |
| Homepage | Trust bar section, review carousel, brand origin signals in hero |
| Shop grid | Product card badges, rating, brand name |
| Product page | Korean origin in specs, sold count, review count, COD badge, How to Use tab |
| Cart | COD badge in summary, returns policy link |
| Checkout | COD confirmation statement, secure form indicators |
| About page | Full brand story, sourcing transparency, team (if applicable) |
| FAQ | Safety information, authenticity guidance, policy summary |

### 13.3 WhatsApp as a Trust Channel

The WhatsApp floating button is not primarily a support feature — it is a trust signal. Its presence on every page communicates: "There is a human being available to answer your question." Most users who see it will never use it. But knowing it is there reduces purchase anxiety for the segment that would otherwise abandon rather than ask.

For users who do use it, WhatsApp pre-purchase consultation should follow a consistent pattern:
- Respond within 2 hours during business hours
- Answer color recommendation questions with specific product links
- Confirm delivery timelines to the customer's governorate
- Every WhatsApp interaction that results in a purchase should be tracked (manually, at minimum) to understand the WhatsApp conversion rate

---

## 14. Performance Strategy

### 14.1 Why Performance Is a Commercial Metric

Every additional second of load time in mobile e-commerce represents measurable conversion loss. This is not a UX preference — it is documented behavior across markets similar to Egypt's mobile commerce environment. MARTAL 2.0's performance targets (brief §14) are set with commercial outcomes in mind, not engineering aesthetics.

### 14.2 Target KPIs

The following KPIs represent the commercially meaningful targets for MARTAL 2.0. Where baseline data from v1 is unavailable, targets are set against Egyptian mobile commerce benchmarks and the specific friction points identified in this strategy.

**Acquisition & Discovery Metrics**

| KPI | Target | Rationale |
|---|---|---|
| Organic search impressions (6 months post-launch) | Measurable growth vs. v1 | v1 has zero organic search visibility — any SSR improvement is measurable |
| Homepage → Shop navigation rate | ≥ 60% of homepage sessions | Homepage must convert curiosity into browsing |
| Search usage rate | ≥ 20% of sessions | Search users convert at higher rates; usage indicates product discovery confidence |
| Filter usage rate (shop page) | ≥ 35% of shop sessions | Indicates engagement and active product consideration |

**Consideration & Evaluation Metrics**

| KPI | Target | Rationale |
|---|---|---|
| PDP average session duration | ≥ 90 seconds | Users reading specs, reviews, and evaluating color = higher intent |
| Product image engagement (swipes/clicks per PDP session) | ≥ 3 | Gallery engagement indicates active evaluation |
| Wishlist addition rate | ≥ 12% of PDP sessions | Wishlist = deferred intent; high value for return conversion |
| Quick View usage rate | ≥ 15% of shop sessions | QV usage indicates engaged browsing without PDP navigation |

**Conversion Metrics**

| KPI | Target | Rationale |
|---|---|---|
| Add-to-Cart rate (PDP sessions) | ≥ 25% | Industry benchmark context: strong for mobile-first markets |
| Cart → Checkout rate | ≥ 55% | Cart abandonment mitigation (COD badge, free shipping nudge) |
| Checkout completion rate | ≥ 70% of initiated checkouts | Single-page, minimal-field checkout should achieve this |
| Overall session conversion rate | ≥ 2.5% | Mobile e-commerce target for beauty category |
| WhatsApp-assisted conversion rate | Tracked manually | Pre-purchase WhatsApp inquiries that convert to orders |

**Retention Metrics**

| KPI | Target | Rationale |
|---|---|---|
| 30-day return rate | ≥ 25% of first-time buyers | Contact lenses are monthly — a returning customer within 30 days is on-cycle |
| 90-day repeat purchase rate | ≥ 40% of first-time buyers | Three months of quality product + experience should produce loyalty |
| Average order frequency (retained customers) | ≥ 3 orders / 6 months | Monthly disposables consumed in pairs/multiples |

**Technical Performance Metrics**

| KPI | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 90 |
| LCP | < 2.5 seconds |
| CLS | < 0.1 |
| INP | < 200ms |
| Checkout form completion time | < 90 seconds |
| Time from landing to first Add-to-Cart | < 3 minutes |

---

## 15. MARTAL 2.0 Success Definition

### 15.1 What Success Looks Like at Launch

MARTAL 2.0 is successful at launch if:

1. The WooCommerce backend is live with the full product catalog, all five brands, all color variants, and accurate pricing and inventory
2. A customer in any Egyptian governorate can complete a purchase — from landing on the homepage to receiving an order confirmation — entirely in Arabic, on a mobile device, in under five minutes
3. COD orders are being received, processed, and fulfilled through WooCommerce
4. All product pages, brand pages, and category pages are server-rendered and indexable by Google
5. Core Web Vitals pass on mobile (LCP < 2.5s, CLS < 0.1, INP < 200ms)
6. The WhatsApp integration is live on all pages and responds within business-hours SLA
7. Zero critical errors in production (no broken checkout, no cart loss, no 500-state pages visible to users)

### 15.2 What Success Looks Like at 90 Days

At 90 days post-launch, MARTAL 2.0 is succeeding if:

- Organic search traffic is measurably growing (brand-name queries returning MARTAL at position 1; product-category queries returning MARTAL in top 10)
- Conversion rate from session to completed order is ≥ 2.5%
- At least 25% of first-time buyers have placed a second order
- WhatsApp inquiry volume is a fraction of order volume (meaning the website is answering questions that used to require manual response)
- Cart persistence is working — no reported cart loss issues
- Wishlist usage is active among returning visitors

### 15.3 What Indicates Failure

The following patterns indicate strategic or execution failure requiring immediate diagnosis:

| Signal | Likely Cause |
|---|---|
| Checkout abandonment > 50% | Form friction, COD trust signal not visible, unexpected fields |
| PDP bounce rate > 70% | Images not loading fast enough, product page does not build trust |
| Search zero-results rate > 30% | Synonym map and product tags insufficient for user search patterns |
| WhatsApp inquiry rate higher than order rate | Website is not answering key pre-purchase questions — FAQ and PDP content gaps |
| Zero organic search impressions at 60 days | SSR not correctly implemented, metadata missing, or indexing blocked |
| Mobile cart loss rate > 10% | Zustand persistence failure, localStorage clearing behavior |

### 15.4 What MARTAL 2.1 Should Prioritize

Based on this strategy, the v2.1 roadmap should address, in priority order:

1. **Customer authentication and accounts** — The repeat purchase loop identified in this strategy is blocked without saved addresses and order history. This is the highest-value v2.1 feature.
2. **Payment gateway** — Paymob, Fawry, or Stripe integration. COD works but caps AOV and introduces fulfillment fraud risk. Online payment unlocks prepaid orders and reduces returns.
3. **Review submission** — Customer reviews are the most credible trust signal available. Currently displayed (read-only); v2.1 enables submission through WooCommerce reviews API.
4. **Email / WhatsApp retention automation** — The WhatsApp retention sequence described in §7.3 should be automated through a WhatsApp Business API integration rather than manual sends.
5. **UGC photo reviews** — Review photos from real customers. Most conversion-efficient content MARTAL can have. Requires review submission (above) as a prerequisite.
6. **Wishlist sharing** — Generate a shareable wishlist URL. Enables organic social referral ("here's my wish list, which one should I get?") with no influencer spend required.

---

*This document is the strategic layer that sits between the Project Brief (01) and all design and development work. Every design decision should be traceable to a principle, a persona, or a funnel stage defined here. Every engineering decision in the brief should have a commercial rationale in this document. Together, they constitute the complete pre-development foundation for MARTAL 2.0.*

*Document Owner: Product Strategy*  
*Last Updated: June 2026*  
*Next: 03_DESIGN_SYSTEM.md — Visual language, component hierarchy, animation principles*
