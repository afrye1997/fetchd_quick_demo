# NWA School for Dogs — Design System v2

_Last updated: April 30, 2026_

This is the authoritative design reference for the NWA client app. Every page or component should be built from this spec. If a rule here conflicts with what an older screen does, the rule here wins.

This document is **the product playbook**. It tells you what to build, which components to reuse, which patterns are canonical, and which flows already exist. Read the relevant section before building or modifying any UI.

For working principles and engineering style, see `CLAUDE.md` (the personality + process doc). This file is *what to build*; that file is *how to operate*.

---

## Product context

**The product:** A scheduling and booking app for NWA School for Dogs — a real dog training school in Fayetteville, AR run by Shanthi Steddum. ~100 clients, ~10 staff. The app replaces **Gingr**, which handles the school's three Day School payment modes (pay-as-you-go, prepaid packages, monthly memberships) poorly.

**The user:** A pet owner. Often non-technical. Often 40+. Sometimes 65+. They want to book sessions for their dog, see what's coming up, read trainer reports, and message Shanthi when needed. They don't care about "categories" or "filters" — they care about their dog.

**Six service categories** drive the visual system:

| Service | Color | What it is |
|---|---|---|
| Day School | navy `#21356A` | Drop-off training. Owner leaves dog for the day. Trainer works with them. |
| Day Care | gold `#d4a64a` | Social play, no training. Drop-off and pick-up same day. |
| Group Class | teal `#5a9a9a` | Structured group training (puppy class, manners, etc.). Owner participates. |
| Private Lesson | purple `#7a5bc4` | One-on-one training session with owner present. |
| Board & Train | terracotta `#c47a5a` | Multi-day stay where dog gets training daily. |
| Boarding | pink `#f4b6c8` | Overnight stays only — no training. |

Day School is the core problem: the unified two-tap booking flow with persistent status cards and server-side payment complexity hidden from the client is what makes this product better than Gingr.

**Stack:**
- Mobile: React Native (Expo)
- Admin dashboard: React (web)
- Backend: Node + Express
- DB: PostgreSQL (Supabase)
- Auth: Supabase Auth
- Payments: Stripe (3 modes: pay-as-you-go, packages, memberships)
- Email/SMS: Resend (transactional email), Twilio (SMS)
- Hosting: Railway or Render
- Prototypes: HTML/CSS/JS, hosted via GitHub Pages, viewed in iPhone 17 Pro frame (402×874 CSS pixels)

**Current phase: prototype-driven design.** The full UI is being built as static HTML mockups first to lock the patterns, then converting to React Native screen by screen. The HTML prototypes live at the repo root.

**The 3 example dogs** — used in every mockup, every example, every piece of sample data:
- **Waffles** — Golden Retriever, 3 years old
- **Lola** — Golden Retriever, 5 years old
- **Brodie** — Mixed breed, 7 years old

Real photos for all three live at the repo root. **Never invent fictional dogs.**

**Real people only:**
- Shanthi Steddum (owner)
- Team: Donovan, Ashe, Amber, Rachel
- Allison Frye (developer + client of the school)

**Voice and copy locks** (paraphrasing these is a bug):
- Hero tagline: "GREAT DOGS START HERE AT THE SCHOOL FOR DOGS"
- Real Shanthi quote, verbatim: "I truly believe that positive reinforcement is the best way to train dogs because I've seen it transform relationships and help countless owners enjoy a stronger, happier bond with their pets."
- Training philosophy: force-free, positive reinforcement, trust and respect not fear
- Locations: Fayetteville (3826 N Front St), Bentonville (1003 SE 28th St)
- Phone: (479) 332-4237
- Email: nwaschoolfordogs@gmail.com

**Filename rule (LOCKED): never rename user-facing HTML.** External links — Allison's notes, GitHub Pages URLs, future React Native imports — may point at these filenames. Edit files in place; don't rename.

---

## Platform & Target Device

This is a mobile-first design system. All screens are designed for a single mobile viewport — no tablet, desktop, or web responsive behavior at this stage.

### Target device: iPhone 17 Pro

| Spec | Value |
|---|---|
| CSS viewport width | **402px** |
| CSS viewport height | **874px** |
| Device pixel ratio | 3x |
| Physical resolution | 1206 × 2622 pixels |
| Screen size | 6.27" diagonal |
| Corner radius (display) | 46px |

iPhone 17 Pro is a reasonable middle ground for the current generation — narrower screens (older iPhones, iPhone SE) display with slightly cramped horizontal rhythm but nothing breaks. Larger screens (iPhone 17 Pro Max at 440px, Android phablets) display with extra breathing room. This is acceptable for a boutique app with a finite user base rather than chasing universal responsiveness.

### Prototype rendering

HTML prototypes render inside a Figma-style device frame — a dark canvas background with a titanium iPhone bezel, Dynamic Island, and 46px rounded screen corners. App content lives in a 402 × 874px scrolling container. Production builds (React Native) will use the full device viewport; the device frame is a prototyping affordance only.

### Safe areas

- **Top:** 46px (accommodates Dynamic Island + status bar)
- **Bottom:** 18px (home indicator)
- Header padding accounts for top safe area automatically

---

## Design principles

These principles govern every decision. When in doubt, fall back to them.

1. **One primary action per screen.** A 65-year-old user should know within two seconds what the main thing on this screen is.
2. **Show, don't categorize.** Surface what the user is already looking for. Don't ask them to pick categories or answer questions before showing content.
3. **Labels describe outcomes, not features.** Button text says what happens when you tap it, not the name of an internal concept.
4. **Remove before adding.** Every new element must earn its vertical space.
5. **Dogs are the protagonists.** The app is about the relationship between owner and dog; booking and logistics are supporting features.

---

## Color tokens

```css
/* Page background — very soft lavender-grey */
--bg:           #eef1f8;

/* Navy palette — primary brand, text, icons */
--navy:         #21356A;   /* primary brand, body text, CTAs */
--navy-mid:     #2d4a8a;
--navy-light:   #4a6aaa;   /* secondary links, muted navy accents */
--navy-pale:    #b8c8e8;   /* hover borders, subtle accents */

/* Cards + borders */
--card:         #f8faff;   /* footer zones, subtle backgrounds */
--card-hover:   #ffffff;   /* hover states */
--border:       #d4dcec;   /* standard card/input borders */
--border-soft:  #e4eaf4;   /* internal dividers, row separators */

/* Text */
--muted:        #6a85b0;   /* secondary text, labels */
--muted-soft:   #8ea3c7;   /* tertiary text, disabled, placeholder */

/* Service category accents */
--accent-gold:        #d4a64a;   /* Day Care */
--accent-gold-dark:   #8a6a28;
--accent-teal:        #5a9a9a;   /* Group Class */
--accent-purple:      #7a5bc4;   /* Private Lesson */
--accent-purple-pale: #ebe1ff;   /* Private Lesson tile background */
--accent-terracotta:  #c47a5a;   /* Board & Train */
--accent-pink:        #f4b6c8;   /* Boarding service AND Reports tile (dual use) */
--accent-pink-dark:   #b85a7a;   /* deeper rose for icon glyph + label */

/* Other accents */
--accent-green:        #4a8a6a;   /* billing, success, "all available" */
--accent-green-bright: #22a858;   /* success animations */
--accent-red:          #e04545;   /* urgent, destructive, errors, badges */

/* Shadows */
--shadow-sm: 0 1px 2px rgba(33, 53, 106, 0.04);
--shadow-md: 0 4px 16px rgba(33, 53, 106, 0.08);
--shadow-lg: 0 12px 32px rgba(33, 53, 106, 0.12);
```

### Color usage rules

- **Navy** = brand, primary UI text, primary CTAs, Day School category
- **Gold** = Day Care category, "attention" signals. Context disambiguates.
- **Teal** = Group Class category
- **Purple** = Private Lesson category, community events
- **Terracotta** = Board & Train category
- **Pink** has a deliberate **dual use**: the Boarding service AND the Reports tile on dog profiles. Reports use pink because reports are a meta-summary tile, not a service category — they read as "this is a different kind of thing." Boarding uses pink because it sits outside the training pipeline (no training happens during boarding). The two contexts never appear adjacent, so the dual use is unambiguous in practice.
- **Green** = billing + success + positive state
- **Red** = urgent-only. Never decorative. Reserved for closures, errors, destructive actions, notification count badges.

### Service category-to-color mapping

When a piece of content has a category, it gets a colored left edge on its card.

| Category | Color | Use case |
|---|---|---|
| Day School | navy `#21356A` | Day School sessions |
| Day Care | gold `#d4a64a` | Day Care sessions (social play) |
| Group Class | teal `#5a9a9a` | structured group training |
| Private Lesson | purple `#7a5bc4` | one-on-one training |
| Board & Train | terracotta `#c47a5a` | overnight/extended training stays |
| Boarding | pink `#f4b6c8` | overnight stays, no training |
| Billing | green `#4a8a6a` | payments, packages |
| Team / School | navy | announcements about staff or the school itself |
| Urgent | red `#e04545` | closures, cancellations, safety |
| Reports (meta) | pink `#f4b6c8` | dog profile Reports tile only — not a session type, signals "summary across all sessions" |

The 6 service categories (Day School, Day Care, Group Class, Private Lesson, Board & Train, Boarding) are the authoritative service categorization and appear together in the Bookings filter chips and in the new-booking sheet.

### CSS variable fallbacks must match `:root`

When CSS uses `var(--name, fallback)` and `:root` doesn't declare `--name`, the fallback renders. Audit BOTH the `:root` declaration AND every fallback value across files when changing tokens — they must agree, or different pages will render different colors for the "same" token.

---

## Typography

**Display font:** Cormorant Garamond — used for names, titles, and serif moments
**Body font:** Instrument Sans — used for labels, meta, controls, nav

**Font stack:**
```css
'Cormorant Garamond', serif;        /* display */
'Instrument Sans', sans-serif;      /* body */
```

### Type scale

| Token | Size | Weight | Font | Use |
|---|---|---|---|---|
| **Page Title** | **26px** | **700** | **sans** | **Top-of-page title on every inner page (Bookings, Messages, Account, Book a private session, How NWA School For Dogs Works, etc.) — letter-spacing −0.01em, line-height 1.1, color `var(--navy)`** |
| Display XL | 30px | 500 | serif | Hero moments, big announcements |
| Display L | 26px | 500 | serif | Section heros (Up Next card title) |
| Display M | 20px | 500 | serif | Card titles (dog names on stories, session row names) |
| Display S | 18px | 500 | serif | Secondary titles (help card, sheet titles) |
| Display XS | 16px | 500 | serif | Small serif moments (dog story names, labels) |
| Body L | 14px | 600 | sans | Primary buttons, action text |
| Body M | 13px | 500–600 | sans | Standard text |
| Body S | 12px | 500 | sans | Meta text, captions |
| Label | 10–11px | 600 | sans | Uppercase section labels (letter-spacing 0.12–0.18em) |

### Page Title (canonical)

Every inner page in the app starts with the same page title treatment.

```css
.page-title {
  font-family: 'Instrument Sans', sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: var(--navy);   /* #21356A */
  letter-spacing: -0.01em;
  line-height: 1.1;
}
```

**Rules:**
- No serif for page titles. The serif font is reserved for hero moments and card titles, not navigational headers. Page titles are sans for clarity and consistency with iOS-native conventions.
- No italic emphasis on page titles. The page-title moment is functional, not decorative — save italic Cormorant for hero copy like "Request *sent*" or section heros like "3 *sessions* tomorrow".
- Letter-spacing −0.01em is intentional (slight tightening for the bold weight at this size). −0.02em is acceptable for longer titles like "How NWA School For Dogs Works".
- Color is always `var(--navy)`. Never tinted, never gradient.
- Class names vary by page (`.bookings-title`, `.acc-page-title`, `.page-title`, `.hiw-page-title`) but the styles must match this spec exactly.

**Exception:** the booking-flow main view title ("Book a *session*") uses serif Cormorant 28px italic for the in-flow modal feel. This is the only page-title exception.

### Italic usage

Cormorant Garamond italics are used **sparingly and intentionally** to emphasize one key word in a title. Examples:
- "3 *sessions* tomorrow"
- "Rachel joins the *team*"
- "*Yappy Hour* social"
- "Request *sent*"

Never italicize whole sentences or body copy.

---

## Spacing

- **Page frame:** 402px (iPhone 17 Pro viewport width)
- **Page horizontal padding:** 20px (some sections use 18px or 24px for specific reasons)
- **Gap between cards in a scroll:** 12–14px
- **Card internal padding:** 14–18px
- **Section vertical gap:** 20–24px
- **Border radius:** 16–20px for cards, 10–14px for buttons, 50% for circles/pills

---

## Global Chrome — Header and Nav

There are **two chrome patterns** in this app:

1. **Standard chrome** — sticky header + sticky bottom nav. Used on all post-login authenticated pages.
2. **Locked-chrome (pre-home variant)** — persistent top header, internal scroll region, optional pinned bottom CTA, no bottom nav. Used on login, profile creation, onboarding, and how-it-works pages.

Both share the same global header. They differ in what sits below it.

### Required scroll architecture

Because the app lives inside a fixed-size device frame in prototypes (and inside a mobile viewport in production), the scroll container structure matters. Every page uses one of these two structures:

**Standard (post-login):**
```
.device-frame (iPhone bezel, prototypes only)
  .device-screen (fixed 402×874, overflow: hidden, position: relative)
    .device-screen-inner (100% × 100%, overflow-y: auto, flex column)
      .header (sticky, z: 30)
      [page content]
      .nav (sticky, bottom: 0, margin-top: auto, z: 20)
    /.device-screen-inner
    [overlay modals/sheets as direct children of .device-screen]
  /.device-screen
/.device-frame
```

**Locked-chrome (pre-home):**
```
.device-frame
  .device-screen (overflow: hidden)
    .device-screen-inner (100% × 100%, flex column)
      .app-header (persistent, NOT sticky — top of column)
      .auth-page (flex: 1, flex column, overflow: hidden)
        .auth-scroll (flex: 1, overflow-y: auto — internal scroll region)
        .auth-bottom (flex-shrink: 0 — pinned bottom CTA, optional)
      /.auth-page
    /.device-screen-inner
  /.device-screen
/.device-frame
```

Key principles (both patterns):
- `.device-screen` clips overflow (prevents modals/sheets from extending the scroll area)
- The scroll-eligible element is the actual scrolling element — content never scrolls the device frame itself
- Overlay elements (bottom sheets, modals, toasts) are siblings of `.device-screen-inner`, not inside it, so they're positioned relative to `.device-screen` and not affected by scroll

### Global Header (sticky top, all pages)

Sits at the top of every page. On standard pages it's `position: sticky` and pins during scroll; on locked-chrome pages it's the first child of the column flex and stays put because content scrolls inside `.auth-scroll` below it.

**Positioning (standard):**
- `position: sticky; top: 0; z-index: 30`
- Frosted glass: `rgba(238, 241, 248, 0.88)` + `backdrop-filter: blur(16px)`
- Hairline below: `border-bottom: 1.5px solid rgba(33, 53, 106, 0.12)`
- Padding: 46px top (iOS status bar safe area), 18px sides, 14px bottom

**Content (left to right, single row):**
- **Logo (left):** horizontal NWA logo PNG. Navy ink on transparent background. Displayed at 36px tall, width auto-scales.
- **Date (flex 1, right-aligned):** today's date in abbreviated format ("Tue · Apr 22"). Styling: 10px, 600 weight, `var(--muted)` color, uppercase, 0.12em letter-spacing, right-text-align.
- **Bell button (right):** 38px circle, white bg, 1px `var(--border)` border. Contains a 17px bell icon with navy stroke. Includes a numeric badge in the top-right corner showing unread count.

**Bell badge:**
- `background: var(--accent-red); color: white;`
- `min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px`
- 2px border in page background color (`var(--bg)`) to create a halo
- 10px font, 700 weight, white
- Hidden entirely when count is 0
- Subtle red shadow for lift

**Pre-home variant:** The bell button can be omitted (no notifications relevant before sign-in), and the date is replaced by a quiet "Sign in" or "Step X of Y" text where useful.

### Bottom Nav (post-login standard pages)

Sits at the bottom of every authenticated page. Pre-home pages do NOT show this.

**Positioning:**
- `position: sticky; bottom: 0; margin-top: auto; z-index: 20`
- Frosted glass: `rgba(255, 255, 255, 0.92)` + `backdrop-filter: blur(20px)`
- Top hairline: `1.5px solid rgba(33, 53, 106, 0.12)` — matches header's bottom border
- Padding: 8px top, 0 sides, 18px bottom (safe area for iPhone home indicator)

**Structure:**
- **4 items, always: Home / Bookings / Messages / Account**
- `.nav-inner` uses `display: flex; align-items: stretch`
- Each `.nav-item` is `flex: 1` so items divide the width equally
- `min-height: 58px` per item
- Vertical dividers between items: `.nav-item:not(:last-child)::after` — 1px navy at 10% opacity, inset 10px top/bottom

**Why 4 tabs, not 5:** Earlier designs included a Reports tab. We removed it because reports are not a distinct user activity; they're *content produced by sessions*. Past sessions and reports are the same content viewed differently, so both live inside Bookings (under the Past toggle). Keeping the nav at 4 tabs improves cell breathing room and reduces user decision fatigue. The bell button in the header handles notifications for new reports.

**Item content:**
- 22px icon (centered in flex wrapper) + 5px gap + 10px label
- Active state: filled navy icon, 700 weight label, navy color
- Inactive state: stroked muted icon, 500 weight label, muted color
- Active is determined per-page — only one item is active at any time

**Bottom padding rule:** No page content should be hidden behind the nav. Ensure the last content element has `margin-bottom` or `padding-bottom` of at least 20–24px above the nav.

### Locked-chrome layout (pre-home pages)

For login, profile creation, onboarding, and how-it-works pages — anywhere the user isn't yet signed in or hasn't yet reached the main app. These pages do NOT show the bottom nav.

**Layout:**
- `.app-header` is the persistent top element (same global header spec, possibly without bell)
- `.auth-page` is `flex: 1` and `display: flex; flex-direction: column; overflow: hidden`
- `.auth-scroll` is `flex: 1; overflow-y: auto` — the internal scroll region for page content
- `.auth-bottom` is `flex-shrink: 0` — the pinned bottom row (typically a primary CTA like "Continue")

**`.auth-bottom` standard variant** — used for "Continue" buttons in flows:
- Frosted glass: `rgba(238, 241, 248, 0.92)` + `backdrop-filter: blur(16px)`
- Border-top: `1px solid rgba(33, 53, 106, 0.08)`
- Padding: 14px top, 20px sides, `max(env(safe-area-inset-bottom, 18px), 28px)` bottom

**`.auth-bottom` transparent variant** — used when the bottom needs only a subtle hint (e.g., "Scroll →" affordance) without nav-bar chrome:
- `background: transparent`, no border-top, no blur
- Padding: 8px top, 20px sides, `max(env(safe-area-inset-bottom, 12px), 16px)` bottom
- Reference: `how-it-works.html` uses this so the swipe carousel reads as the focal element, not the bottom row.

### Inner-page headers (below Global Header)

**Use only when needed.** Pages reached from a top-level nav tab (Home, Bookings, Messages, Account) do NOT get an inner page header with back button + title. The global nav already tells the user where they are; a title and back button here are semantic pollution.

Pages that earn an inner-page header:
- Deep destinations reached from another page (a dog profile reached from the home screen)
- Modal-like detail views where "back" is meaningful
- Settings subpages, help articles, etc.

When used, the inner header:
- Sits immediately below the Global Header
- Not sticky (scrolls with content)
- Contains an **inline back chevron** flush-left of the page title on the same row
- Page title uses canonical Page Title spec — Instrument Sans 26px 700 navy
- Optional italic Cormorant Garamond subtitle on its own line below the title row
- Padding: ~22px top, 20px sides, 12px bottom

This stacking (Global Header on top, Page Header below) is acceptable and matches iOS conventions like Mail's thread view. Resist the temptation to merge them — they serve different purposes.

### Failure modes to watch for

- **Scroll container confusion:** if you see modals or sheets anchored to the wrong parent, check that they're outside the scroll container (siblings of `.device-screen-inner`).
- **Sticky nav not sticking:** ensure the parent `.device-screen-inner` is a flex column with `height: 100%`, not `min-height: 100%`. The nav needs a bounded flex container to stick within.
- **Sticky header bleed:** if content shows through the header on scroll, check that `backdrop-filter: blur` is applied and the `background` is semi-transparent (not fully opaque — breaks the frosted effect).
- **Horizontal scroll rows auto-scrolling on load:** if any row has `scroll-snap-type` set, Safari may auto-snap to a non-zero position. Either remove the snap or explicitly reset `scrollLeft = 0` on page load.
- **`position: absolute` on full-screen overlays:** the device frame can distort parent heights, so `position: absolute` on a sheet/modal/backdrop will not anchor to the viewport reliably. Use `position: fixed` for full-screen overlays — and add `max-height: 88vh` + `overflow-y: auto` as a safety net.

---

## Key Components

### Component reuse map (read this first)

This table is the **single source of truth** for which classes are canonical and which are scoped. When building a new page, scan this table before writing any new component CSS. If a pattern you need has a "Global" entry, use the canonical class; if it has a "Scoped" entry, the pattern lives inside one feature and you should not extract it without flagging the question first.

Some classes are currently namespaced (e.g., `.rd-status-banner` for request-detail pages) but the underlying pattern is general-purpose. Those are marked **"Global (rename pending)"** — when you reuse them, use the canonical name in the new code, and either (a) flag a refactor of the original to match, or (b) leave both names in place temporarily and note the duplication.

| Pattern | Canonical class | Status | Reference file (template to copy from) |
|---|---|---|---|
| Page title (inner pages) | `.page-title` | **Global** | any inner page; e.g. `dog-add.html` |
| Inline back link | `.back-link` inside `.title-row` | **Global** | `dog-add.html` |
| Card (base) | `.card` | **Global** | most pages |
| CategoryCard (colored left edge) | base `.card` + per-category modifier class | **Global** | `bookings-page.html` (session cards) |
| Section label (uppercase mini-heading) | `.section-label` | **Global** | `home.html` |
| Bottom sheet modal | `.modal-card` (no `.modal-card-centered`) | **Global** | dog profile pages (Add Medication) |
| Centered card modal | `.modal-card.modal-card-centered` | **Global** | dog profile section detail modals |
| Confirmation dialog (binary destructive) | `.modal-card-centered` variant | **Global (rename pending)** — currently `.rd-modal-*` on request-detail pages | `request-detail-boarding.html` (Cancel modal) |
| Notifications popover (bell tap) | `.notif-popover` + `.notif-backdrop` + `.notif-row` + `.notif-icon` (per type) | **Global (rename pending)** — currently scoped to `account.html` lines ~1309–1380, should fire from the bell on every authenticated page | `account.html` |
| Status banner with pulsing dot | `.status-banner` + `.status-dot` + `.status-text` | **Global (rename pending)** — currently `.rd-status-banner` etc. | `request-detail-boarding.html` |
| Multi-select chip grid | `.chip-grid` + `.chip` + `.chip.selected` | **Global (rename pending)** — currently `.rd-chip-grid` / `.rd-chip` | `request-detail-private.html` (focus areas) |
| Radio-style chip select (one-of-N) | same `.chip-grid` + `.chip` markup, `selectChip()` JS | **Global (rename pending)** — currently `selectLength()` on boardtrain | `request-detail-boardtrain.html` (length picker) |
| Textarea card with counter + label + help | `.textarea-card` + `.textarea-label` + `.textarea-help` + `.textarea-counter` | **Global (rename pending)** — currently `.rd-textarea-*` | `request-detail-private.html` |
| Date input card with large numeral | `.date-card` + `.date-num` + `.date-info` | **Global (rename pending)** — currently `.rd-date-*` | `request-detail-private.html` (preferred dates) |
| viewSent confirmation pattern | `.view-sent` container with success checkmark + title + body + actions | **Global (rename pending)** — currently in book-* and request-detail-* | `book-boarding.html`; `request-detail-boarding.html` |
| Success checkmark hero | `.success-check` (green circle + animated checkmark) | **Global** | `booking-flow.html` confirmed view |
| Pending card (status awaiting Shanthi) | `.pending-card` | **Scoped** to Bookings → Pending tab | `bookings-page.html` Pending feed |
| Session card (Bookings Upcoming) | `.session-card` inside `.swipe-container` | **Scoped** to Bookings → Upcoming | `bookings-page.html` |
| Report card | `.report-card` | **Scoped** to Bookings → Past + dog profile Reports tile | `bookings-page.html`; `dog-profile-*.html` |
| Past view weekly stack | `.rs-week` + `.rs-stack` + `.rs-strip` | **Scoped** to Bookings → Past | `bookings-page.html` |
| Reports tile (dog profile Overview) | `.section.reports` + `.rep-*` namespace | **Scoped** to dog profile Overview tab | `dog-profile-waffles.html` |
| Dog profile section tile (collapsible) | `.section` + `.section-toggle` + `.section-icon` + `.section-head-label` | **Scoped** to dog profile tabs | `dog-profile-waffles.html` |
| Section detail modal (popup from tile) | `.modal-backdrop.modal-centered` + `.modal-card-centered` | **Global** (built on centered-modal pattern) | `dog-profile-waffles.html` |
| Calendar (booking flow) | `.cal-*` namespace | **Scoped** to booking flow main view | `booking-flow.html` |
| Review-by-dog card row | `.review-card` horizontal scroll row | **Scoped** to booking flow | `booking-flow.html` |
| Credits sheet | `.credits-sheet` (bottom sheet variant) | **Scoped** to booking flow | `booking-flow.html` |
| Dog Story (circular portrait row) | `.dogs-row` + `.dogs-section` | **Scoped** to home page | `home.html` |
| Up Next card | `.up-next` | **Scoped** to home page | `home.html` |
| Announcement card | `.announcement` | **Scoped** to home page | `home.html` |
| Scroll hint (horizontal scroll affordance) | `.scroll-hint` + `data-target` | **Global** | `home.html` (dogs row + announcements row) |
| View toggle (segmented control) | `.view-switch` | **Global** | `bookings-page.html` |
| Picker button (icon + value + chevron) | `.picker-btn` | **Global (rename pending)** — currently inline `.timeframe-chip` etc. | `bookings-page.html` time frame chip |
| Buttons — primary CTA | `.btn-primary` | **Global** | every page |
| Buttons — secondary outlined | `.btn-secondary` | **Global** | every page |
| Buttons — destructive | `.btn-destructive` (red) | **Global** | request-detail-* Cancel button |
| Buttons — text/inline | `.btn-text` | **Global** | sheet "Cancel" actions |
| Locked-chrome layout (pre-home) | `.auth-page` + `.auth-scroll` + `.auth-bottom` | **Global** | `login-welcome.html` |
| `.auth-bottom` transparent variant | `.auth-bottom` (override styles) | **Scoped** to how-it-works | `how-it-works.html` |
| 4-pane swipe carousel | `.hiw-carousel` + `.hiw-pane` + `.hiw-pane-card` | **Scoped** to how-it-works | `how-it-works.html` |

**Rule of thumb:** Anything marked **Global** is fair game everywhere — copy from the reference file. Anything marked **Scoped** is intentional — those patterns work because of the surrounding context they were designed for, and lifting them into a new feature usually means redesigning. Anything marked **Global (rename pending)** is a real pattern that just hasn't been promoted out of its first home yet — when you reuse it, the right move is to use the canonical name in your new code and flag the rename for cleanup.

### Decision tree: chrome for a new page

```
Is the user signed in yet?
├─ No → Locked-chrome layout (pre-home variant)
│       - Persistent .app-header at top
│       - .auth-scroll for content
│       - .auth-bottom with primary CTA (or transparent variant for hint-only)
│       - NO bottom nav
│       Reference: login-welcome.html
│
└─ Yes → Standard chrome (sticky header + sticky bottom nav)
         │
         Is this a top-level tab destination (Home / Bookings / Messages / Account)?
         ├─ Yes → No inner-page header. Page title sits in content.
         │       Reference: bookings-page.html
         │
         └─ No (deep destination, settings, detail page)
               → Sticky global header + inner page header (with inline back link + page title)
                 + sticky bottom nav at bottom
                 Reference: dog-profile-waffles.html
```

### Decision tree: overlay type for new content

```
What kind of overlay does this content need?

├─ Tall form input (Add Medication, Edit Hospital, calendar picker, package selector)
│   → Bottom sheet (.modal-card)
│   - Slides up from bottom
│   - Drag handle at top
│   - Internal scroll for tall content (max-height: 88vh)
│   Reference: dog-profile-waffles.html (Add Medication)
│
├─ Focused detail view (section content, summary, info display — content varies in length, no required action)
│   → Centered card modal (.modal-card.modal-card-centered)
│   - Scales in from 0.94 → 1.0
│   - Three dismissals: ×, backdrop, Escape
│   Reference: dog-profile-waffles.html (Reports tile detail)
│
├─ Binary destructive decision (Cancel this request? Delete this dog? Sign out?)
│   → Confirmation dialog (centered modal variant)
│   - Title (serif italic), body (sans), two buttons
│   - Buttons are VERBS: "Keep it" / "Cancel session" — never "No / Yes"
│   Reference: request-detail-boarding.html (Cancel modal)
│
└─ Success milestone (request submitted, booking confirmed, payment processed)
    → viewSent confirmation pattern
    - Animated green checkmark hero
    - Serif italic title ("Confirmed!" / "Changes saved" / "Request sent")
    - Subtitle with one-line summary
    - Action buttons (Back / View / Done)
    Reference: book-boarding.html (after submit); booking-flow.html (Confirmed view)
```

### Decision tree: what class do I use for this UI element?

```
Building a status indicator with a colored badge?
├─ Pulsing colored dot + uppercase text + tinted background pill
│   → .status-banner pattern (currently .rd-status-banner — use canonical name)

Building a chip-style selector?
├─ User picks 1+ from a list (multi-select)
│   → .chip-grid + .chip (with toggleChip handler)
├─ User picks exactly 1 from a list (radio behavior)
│   → .chip-grid + .chip (with selectChip handler that clears siblings)

Building a date input?
├─ Single date with large visual numeral and label
│   → .date-card + .date-num + .date-info + .date-input
├─ Calendar grid for booking flow
│   → .cal-* namespace, scoped to booking flow only

Building a textarea?
├─ Standalone form field with label + help + character counter
│   → .textarea-card + .textarea-label + .textarea-help + .textarea-counter

Building a horizontal scroll row?
├─ Always: hidden scrollbars, fixed-width cards, scrollLeft = 0 on load
├─ Add .scroll-hint pattern (with data-target) for the affordance
├─ Do NOT use scroll-snap-type unless it's a full-width pane carousel

Building a button?
├─ Primary action on the page → .btn-primary (navy gradient, full-width usually)
├─ Secondary action → .btn-secondary (outlined)
├─ Destructive action (Cancel, Delete, Remove) → .btn-destructive (red)
├─ Inline / text-only action → .btn-text (no bg, no border)

Building a picker control?
├─ Icon + value + chevron (opens a sheet/modal)
│   → .picker-btn pattern (currently inline as .timeframe-chip — use canonical name)
```

### Page Header (inner pages only)

Sits **below** the Global Header on non-home pages. Provides navigational context.

- **Inline back chevron** flush-left of the page title on the same horizontal row (see Inline back link)
- Page title uses the canonical **Page Title** spec (Instrument Sans 26px 700 navy)
- Optional italic Cormorant Garamond subtitle on its own line below the title row
- Padding: ~22px top, 20px sides, 12px bottom
- **Not sticky** — scrolls with content (global header stays pinned; page header is part of the content)

### Inline back link

The canonical back-navigation affordance for any inner page. Sits flush-left of the page title on the same row, icon-only, no circle, no border, transparent background — pure chevron.

**Visual spec:**
- 32×32 transparent button (tap target), 22px chevron icon inside
- Stroke color: `var(--muted)` at rest, transitions to `var(--navy)` on `:active`
- On press: `transform: translateX(-2px)` + color shift (subtle nudge-left feedback)
- No background fill, no border, no hover state
- Chevron icon: simple polyline `15 18 9 12 15 6` with stroke-width 2.2, round caps and joins

**Layout:** lives inside a `.title-row` flex container with the page title `<h1>`, `align-items: center`, `gap: 6px`, with `margin-left: -8px` so the chevron's tap target overhangs the page edge slightly (standard iOS pattern — keeps the title visually flush with content below).

**Accessibility:** always include `aria-label="Back to [parent page]"` since it's icon-only. Always uses `<button type="button">`, never an `<a>` — preserves expected button semantics for screen readers.

**HTML reference:**

```html
<div class="title-row">
  <button class="back-link"
          onclick="location.href='PARENT_PAGE.html'"
          type="button"
          aria-label="Back to PARENT">
    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
  </button>
  <h1 class="page-title">PAGE TITLE</h1>
</div>
```

**CSS reference:**

```css
.title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: -8px;
}
.back-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px; height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--muted);
  transition: color 0.15s, transform 0.1s;
  flex-shrink: 0;
}
.back-link:active {
  transform: translateX(-2px);
  color: var(--navy);
}
.back-link svg {
  width: 22px; height: 22px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
```

**When to use it:** any sub-page that exits back to a parent page (dog profile, dog manage, dog add, booking flow steps, settings subpages, request detail pages, etc.).

**When NOT to use it:** top-level tab destinations (Home, Bookings, Messages, Account) — those don't get a back affordance. Use the global nav instead.

### Card

Every content card follows this base:
- White background
- 1px `var(--border)` border
- 12–20px border radius
- `shadow-sm` by default, lifts to `shadow-md` on hover
- Slight upward hover transform (`translateY(-2px)`)
- Slight scale-down on active press (`scale(0.98–0.99)`)

#### CategoryCard (colored left edge variant)

Extends base card with:
- Colored left edge bar, 3–4px wide, matching category color
- Optional category tag (uppercase 9–11px pill with tinted background)
- Used for: report cards, announcement cards, session cards, message threads, pending cards

### Dog Story (landing page)

A horizontally scrollable row of circular dog portraits. Three dogs are visible by default, centered in the viewport; additional dogs reveal on horizontal scroll.

**Section structure:**
- `.dogs-section` wraps the label + scrollable row + scroll hint
- `.dogs-label` — "YOUR DOGS · TAP TO VIEW PROFILE" (with hint styled smaller, 8px, 80% opacity)
- `.dogs-row` — the horizontal scroll container
- `.dogs-scroll-hint` — "SCROLL →" below the row, right-aligned

**Circle sizing (iPhone 17 Pro, 402px viewport):**
- Circle width: **110px**
- Gap between circles: **16px**
- Left padding on row: **24px**

Formula for centering 3 dogs with a hidden 4th: `left_padding + 3 × circle + 3 × gap = viewport_width`. Math: `24 + (3 × 110) + (3 × 16) = 402`. The 4th dog starts exactly at pixel 402, so it's invisible until the user scrolls.

**Circle visual:**
- Navy gradient ring, 3px padding between ring edge and inner photo
- 3px white inner border between ring and photo
- Aspect ratio 1:1 (`aspect-ratio: 1`)
- `.quiet` variant uses grey ring (for dogs with no upcoming sessions)

**Dog name:**
- Cormorant Garamond serif, 16–18px, 500 weight
- Sits below the circle with 10px gap, centered

**Scroll behavior (critical — don't skip):**
- `overflow-x: auto`, `overflow-y: hidden` on `.dogs-row`
- `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` to hide scrollbars
- **Do NOT use `scroll-snap-type: proximity` here.** It causes Safari/WebKit to auto-snap to a non-zero scroll position on load.
- **Always reset scroll position on page load** with JavaScript:
  ```js
  document.addEventListener('DOMContentLoaded', () => {
    const row = document.querySelector('.dogs-row');
    if (row) row.scrollLeft = 0;
  });
  ```

**Entrance animation (page load):**
- Each circle pops in with subtle scale-overshoot: `scale(0.88)` → `scale(1.04)` → `scale(1)`
- Cubic-bezier timing: `0.34, 1.4, 0.64, 1` (gentle spring)
- Duration: 0.6s per circle
- Staggered delays: `:nth-child(1) = 0.6s`, `:nth-child(2) = 0.74s`, `:nth-child(3) = 0.88s`, then +0.14s per subsequent dog
- **Static after entrance** — no continuous breathing or pulse. Each dog arrives once, then stays still.
- Hover: scale to 1.03, adds soft shadow
- Active (press): scale to 0.96

**Scroll hint below the row:**
- Bottom-right aligned via `padding: 4px 24px 0; display: flex; justify-content: flex-end`
- Copy: "SCROLL →" (uppercase, 9px, 500 weight, 0.08em letter-spacing, 70% opacity)
- The arrow (`→`) is a separate span with a 2-second horizontal pulse animation

In production, the row is data-driven — each client sees only their own dogs. If a client has only 1–3 dogs, the row doesn't overflow and the scroll hint hides via JavaScript (`if scrollWidth <= clientWidth, hide hint`).

### Up Next card

The functional hero of the home page. Rich composition:
- Top strip: small colored "when" label + radial background gradient + serif headline
- Dog rows (multi-dog days): avatar + name + session type + time, stacked with dividers
- Bottom action row: 2 outlined buttons (See full schedule / Reschedule) on muted card background

### Announcement card

Used in "This week at NWA School for Dogs" row.
- Min width 220px, max 240px, 14px radius
- Colored left edge (3px) by category
- Contents:
  - Tag row: category tag + date (right-aligned)
  - Title (serif, 18px, 2-line clamp)
  - Footer: action link + chevron
- **No sub-text.** Title must carry the meaning.
- Variants: `team`, `class`, `event`, `promo`, `urgent`
- Urgent variant adds: tinted red bg gradient, red-tinted border, red tag, warning triangle icon inline with title

### Session card (on Bookings page)

A session card represents a scheduled visit. It lives inside a `.swipe-container` wrapper (see Swipe-to-cancel below) which enables horizontal gestures.

**Visual:**
- Background white, 1px `var(--border)`, 16px radius
- Left edge color bar (4px wide) indicates session type
- `.session-row` uses flex with 14px gap: 48px avatar + dog info (flex 1) + right-aligned time stack
- Shadow: `var(--shadow-sm)` at rest, `var(--shadow-md)` on hover
- Hover: `translateY(-2px)`

**Content:**
- Dog name (serif, 18px, 500 weight, navy)
- Session type tag in its category color
- Meta text: "· with [trainer first name]" (no titles like "Mr." or "Ms.")
- Time val + label on right (e.g., "7:30 AM" / "Drop off")

### Swipe-to-cancel (`.swipe-container`)

Any session card that can be canceled is wrapped in a swipe-container to reveal a Cancel action on left-swipe.

**Structure:**
```
.swipe-container (overflow: hidden, red bg, 16px radius)
  .swipe-cancel (absolute right, 88px wide, red bg, white text + trash icon + "Cancel")
  .session-card (transform translateX to reveal action)
```

**Behavior:**
- Pointer-drag left → card follows finger with `transform: translateX(-Xpx)`
- Clamp delta between 0 and `-88px` (the action width)
- Release past 44px threshold → snap open to `-88px`; release before → snap closed to 0
- Tapping the visible Cancel button triggers a confirmation dialog before any destructive action happens
- Only one container can be open at a time
- Use `touch-action: pan-y` on the card so vertical scroll still works while horizontal gestures are captured

**Language:**
- The button says **"Cancel"** (not "Delete") — sessions aren't deleted, they're canceled. The server handles credit restoration.
- Confirmation dialog title: "Cancel this *session*?" (serif italic on "session")
- Confirmation buttons: **"Keep it"** / **"Cancel session"** — never ambiguous "No/Yes" or "Cancel/Confirm"

**Post-confirm animation:**
The `.swipe-container` gets a `removing` class that runs a `card-collapse` keyframe: opacity 1→0, translateX 0 → -100%, then height/margin collapse to 0 over 0.4s. Element is removed from DOM at animation end.

### Report card

Used in Past view (inside Bookings) and on dog profile pages.

**Visual:**
- White bg, 1px `var(--border)`, 16px radius, 16/18/14 padding
- Same category left-edge bar as session card
- Shadow: `var(--shadow-sm)` at rest, `var(--shadow-md)` on hover

**Structure:**
```
.report-card
  .report-top
    .report-avatar (42px round, dog photo)
    .report-headline
      .report-headline-top (serif, 18px, dog name)
      .report-meta (session type tag + "· with [trainer]")
    .report-date (right-aligned, 10px uppercase)
  .report-metrics (3 metrics, dot bars)
  .report-excerpt (serif italic, 15px)
  .report-footer (photos count + "Read full ›")
```

**Context-aware metrics:** Each session type shows different metric labels — the metrics match what a trainer would actually evaluate.

| Session type | Metric 1 | Metric 2 | Metric 3 |
|---|---|---|---|
| Day School | Behavior | Social | Obedience |
| Day Care | Social | Energy | Rest |
| Private Lesson | Focus | Obedience | Confidence |
| Board & Train | Behavior | Progress | Rest |
| Group Class | Focus | Progress | Confidence |

Each metric has 5 dots. Filled dots use `--accent-green`; empty dots use `--border`.

**Excerpt:**
- Short trainer narrative (roughly 1–3 sentences)
- Serif italic (Cormorant Garamond, 15px)
- Use `<em>` for one key word to emphasize (breakthrough, proud, role model, etc.)
- Never generic filler ("good session", "did well"). If the trainer can't write meaningfully, the session doesn't get a report that day.

**Footer:**
- Left: photo/video count with a small image icon
- Right: "Read full ›" with hover-animated chevron

### View toggle + Time frame picker row (Bookings)

Used on the Bookings page to switch between Upcoming, Past, and Pending, and to adjust the time range.

**Layout:**
```
.view-row (flex, gap 10px)
  .view-switch (flex 1, 3-cell pill toggle: Upcoming | Past | Pending)
  .timeframe-chip (fixed width, picker button)
```

**View switch:**
- White bg, 1px border, 12px radius, 4px inner padding
- 3 equal cells with `grid-template-columns: 1fr 1fr 1fr`, `font-size: 12.5px`
- Active cell has navy bg + white text + small inset shadow
- Inactive cells are transparent with muted text
- Labels: "Upcoming" / "Past" / "Pending"

**Time frame chip (picker button):**
- Single row: calendar icon + value text + down chevron (`⌄`)
- Value text uses 13px, 600 weight, navy
- Calendar icon and chevron at reduced opacity (0.65 and 0.45) so the value text reads as primary
- Hover: chevron shifts down 1px + opacity lifts
- Default label: "Next 30 days" — updates on apply to "Apr 2026" or "Apr 1 – May 31"

### Time frame picker sheet

Opens from bottom when the time frame chip is tapped. Lives as a direct child of `.device-screen` (not inside `.device-screen-inner`).

**Structure:**
- Backdrop: full-screen at 40% navy overlay + 4px blur
- Sheet: pinned to bottom, `var(--bg)` background, 24px top radius
- Entrance: slide-up via `translateY(100%) → 0` over 0.32s
- 40×4px grey handle at top

**Content flow:**
1. Section label: "SELECT TIME FRAME" (10px uppercase navy)
2. **By Month / Date Range** pill toggle
3. Mode panels (only one visible at a time):
   - **By Month:** Month dropdown + Year dropdown side-by-side, each in its own labeled white card
   - **Date Range:** FROM input + arrow + TO input in a single row
4. Action buttons: **"Cancel"** (grey) + **"Apply"** (navy CTA)

### Pending card (Bookings → Pending tab)

The Pending tab shows requests awaiting Shanthi's confirmation. Each pending card is a CategoryCard with the same color-coded left border as a session card, but with a pending badge instead of a time stack.

**Visual:**
- White bg, 1px `var(--border)`, 16px radius
- Color-coded 4px left border per service category
- Service type label (uppercase, category color) at top
- Cormorant italic title "[Service] request" (e.g., "Boarding request")
- Dog avatar (32px) + dog name row
- "Requested 2 hours ago" meta on left
- "Message Shanthi →" link on right

**Pending badge** (top-right corner of the card):
- Small pill with pulsing gold dot + "PENDING" text
- `background: rgba(212, 166, 74, 0.12)` (gold tint)
- `color: var(--accent-gold-dark)` (`#8a6a28`)
- Dot pulses on a 2.4s loop: opacity 0.6 → 1 → 0.6, scale 1 → 1.15 → 1

**Tap behavior:**
- Tapping the card body navigates to the matching `request-detail-{service}.html` page
- The "Message Shanthi →" link uses `event.stopPropagation()` so it can navigate to the chat thread independently

### Request detail page

When a user taps a pending card, they reach a request-detail page. This is a clone of the booking-form page for that service, pre-filled with their submitted values, in a "view + edit + cancel" mode rather than "new booking" mode.

**Reference implementations:**
- `request-detail-boarding.html` — pink accent, simplest (date range only)
- `request-detail-private.html` — purple accent, includes textarea + 3 preferred dates + behavior chips
- `request-detail-boardtrain.html` — terracotta accent, includes radio-style length picker + multi-select focus chips

**Page-level structure:**
1. **Inline back link + page title** "Boarding request" / "Private lesson request" / "Board & Train request" — title uses canonical Page Title spec (Instrument Sans 26px 700 navy)
2. **Subtitle** (italic Cormorant): "Awaiting Shanthi's confirmation. You can edit or cancel below."
3. **Status banner** — `.rd-status-banner` with pulsing gold dot + "PENDING · Requested 2 hours ago"
4. **Form fields** — same fields as the original booking form, pre-filled. Read-only fields use `.rd-readonly` styling (subtle grey). Editable fields use the same form chrome as the booking page.
5. **Primary CTA** — "Resubmit changes" (navy gradient button, full width)
6. **Secondary CTA** — "Cancel request" (red-outlined button below primary)

**Status banner CSS:**
```css
.rd-status-banner {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  background: rgba(212, 166, 74, 0.10);
  border: 1px solid rgba(212, 166, 74, 0.25);
  border-radius: 12px;
  margin: 12px 20px 18px;
}
.rd-status-dot {
  width: 8px; height: 8px;
  background: var(--accent-gold);
  border-radius: 50%;
  animation: rd-pulse 2.4s ease-in-out infinite;
}
.rd-status-text {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--accent-gold-dark);
}
@keyframes rd-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%      { opacity: 1; transform: scale(1.15); }
}
```

**Cancel modal (centered):**
- Trash icon at top (red tint background, 48px circle)
- Title: "Cancel this request?"
- Body: "Shanthi won't see this request anymore. You can submit a new {service} request anytime."
- Two buttons: "Keep it" (grey) + "Cancel request" (red filled)
- Three dismissals: × button, backdrop click, Escape key
- Uses `.rd-modal-*` classes (`.rd-modal-backdrop`, `.rd-modal-card`, `.rd-modal-icon`, `.rd-modal-title`, `.rd-modal-body`, `.rd-modal-actions`, `.rd-modal-btn`, `.rd-modal-btn-secondary`, `.rd-modal-btn-danger`)

**Resubmit confirmation (`viewSent` pattern):**
After tapping "Resubmit changes," the page swaps to a success view showing:
- Animated green checkmark (see Success states pattern)
- Title: "Changes saved" (serif, 30px)
- Body: "Your {service} request has been updated. Shanthi will see the new details when she reviews it."
- Two buttons: "Back to Bookings" (navy, primary) + "View request" (outlined)

**Form patterns specific to Private/Board & Train detail pages:**

`.rd-chip-grid` + `.rd-chip` — multi-select chips (e.g., behavior focus areas):
```css
.rd-chip-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.rd-chip {
  padding: 8px 14px;
  background: white;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  font-size: 13px; font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
}
.rd-chip.selected {
  background: var(--accent-purple);
  border-color: var(--accent-purple);
  color: white;
}
```

For radio-style selection (e.g., Board & Train length: 1 week / 2 weeks / 3 weeks), use a `selectLength()` JS handler that deselects all sibling `.rd-chip` elements before selecting the tapped one. For multi-select chips (e.g., focus areas), use a `toggleChip()` handler that toggles only the tapped chip.

`.rd-textarea-card` — textarea container with character counter:
- White bg, 1px border, 14px radius, 14px padding
- `.rd-textarea-label` uppercase 10px navy
- `.rd-textarea-help` italic Cormorant 12px muted
- `<textarea>` borderless, 14px, 80px min-height
- `.rd-textarea-counter` aligned right, "180 / 500" muted

`.rd-dates` + `.rd-date-card` — date input cards (Private Lesson uses 3 of these for preferred dates):
- White bg, 1px border, 12px radius, 14px padding
- `.rd-date-num` — large numeral (Cormorant 30px) on left
- `.rd-date-info` flex column on right with date label + native date input
- `.has-value` modifier styles the card when a date is picked

### Booking Flow (Day School / Day Care)

The core product experience. Reached from the FAB (+) on the Bookings page or "Book a new session" on Home. Replaces the Day School booking UX that Gingr handles poorly.

**Architecture: three-view state machine.** The flow lives as three views within a single scope, swapped by state rather than navigated to:

1. **Booking main** — dog selection + calendar + review + Book CTA
2. **Credits sheet** (overlay) — triggered when a selected dog would exceed their credit balance
3. **Confirmed** — success page with all booked sessions grouped by dog

The credits sheet is a bottom sheet overlay on the booking main view, not a separate page. If multiple dogs need credits, the sheet queues them one at a time.

**State shape:**
- `mode: 'school' | 'daycare'`
- `selectedDogs: Set`
- `dates: { dogId: Map<day, mode> }` — per-dog per-date mode picks
- `creditsQueue: []`
- `currentCreditsDog`

### Booking main view

**Top row:** Page title "Book a *session*" (serif italic on "session") on the left, small round close button (38px) with X icon on the right. No back button — this is a modal-style flow; the close button is the exit.

**Mode toggle** — 2-cell segmented control:
- Each tab has a small colored dot + label: "Day School" (navy dot) / "Day Care" (gold dot)
- Active tab fills with its category color: navy bg + white text (school), gold bg + dark brown `#4a3816` text (daycare)
- Switching mode does NOT wipe previously selected dates — each date remembers its own mode

**Select dogs** — horizontal pill row:
- Each pill: 28px photo avatar + dog name, 1.5px border, 999px radius
- Active state: navy fill, white text, white avatar border
- Multi-select — tapping toggles each dog independently

**Calendar** — central control. Lives in a white card with 16px radius.
- Month header: title "April 2026" (serif, 18px) + prev/next nav arrows
- Weekday row (Sun–Sat), 9px uppercase labels
- 7-column grid with 2px gaps
- Each cell is 1:1 aspect ratio

**Calendar day states:**
- **Past:** 45% opacity, pointer-events disabled, muted text
- **Available with all selected dogs:** green dot
- **Available with some selected dogs:** yellow dot
- **Available with no selected dogs:** red dot
- **Selected for school only:** navy bg, white number
- **Selected for daycare only:** gold bg, dark brown number
- **Selected for BOTH:** diagonal split `linear-gradient(135deg, navy 0% 50%, gold 50% 100%)`, white number

**Legend under the calendar:** three small dot+label pairs (green = all dogs, yellow = some dogs, red = no dogs).

### Review by dog (horizontal scroll cards)

After the calendar, a "Review dates by dog" section shows one card per selected dog in a horizontally scrolling row.

**Card structure (270px wide, fixed):**
- Top: dog avatar (36px) + name (serif, 18px) + credits line
- Middle: 2-column grid of date chips for this dog, or empty-state copy
- Bottom: row of two action buttons — "Occurrences" (with refresh icon) + "Clear all" (destructive red outline)

**Credits line language rule:** Always shows **credits remaining after this booking**, not starting balance. Format: "6 School · 4 Day Care credits left". If booking would take either value negative, the entire line turns red with weight 600 as a warning. Math: `remaining = current_balance - sessions_booked_in_this_mode`.

**Empty state:** If a selected dog has no dates, the 2-column grid is replaced with: "No dates yet. Tap the calendar above." (serif italic, 14px, in a card-bg tile spanning both columns).

### Book CTA

Full-width gradient button at the bottom of the main view.
- Copy: "Let's *book!*" — "book!" is serif italic
- School mode: navy gradient (`--navy` → `--navy-mid`), white text, navy shadow
- Daycare mode: gold gradient, dark brown text, gold shadow
- Hover: 2px lift + stronger shadow
- Disabled when no dates picked: 45% opacity, cursor not-allowed

On click:
1. Check if any selected dog's dates would exceed their credits
2. If yes, push to `creditsQueue` and show credits sheet for first dog
3. If no credit issues, go directly to Confirmed view

### Credits sheet (bottom sheet overlay)

Triggered when at least one dog's bookings exceed their credit balance.

**Content flow, top to bottom:**
- Drag handle (40×4px grey pill)
- Step indicator (shown only when 2+ dogs queued): "Step 1 of 2 · dogs needing credits"
- Centered dog avatar (60px with white border + soft shadow)
- Title: "*[Dog name]* needs more credits!" (serif, 24px, italic on dog name)
- Subtitle: "Select a package below, or [remove classes] from upcoming bookings." The "remove classes" link clears that dog's dates and closes the sheet.

**Package options** (4 radio cards):
- 8 classes · $180 · "Best for occasional visits"
- 12 classes · $252 · "Most popular choice" (POPULAR badge in gold)
- 20 classes · $380 · "Best value per class"
- Pay individually · $28 · "Single session charge"

**Actions:**
- Primary: "Confirm purchase & continue" (navy filled, white text)
- Secondary: "Cancel" (transparent with grey border)

**Multi-dog queueing:** After confirming, if more dogs are in the queue, the sheet closes and re-opens 350ms later with the next dog's avatar and name.

### Confirmed view

Lands here after all credit checks pass. Full-page celebratory success state.

**Hero section (centered):**
- Green filled circle (64px) with animated white checkmark — spring entry: scale 0.5 → 1.1 → 1.0 over 0.5s, 0.1s delay
- Title "*Confirmed!*" (serif italic, 34px)
- Subtitle dynamic: "15 sessions booked for School & Day Care" — count and label update based on what was booked
- Legend row: two dots + labels

**"Confirmed sessions" section label** followed by one card per dog with date grid and per-mode counts.

**Actions at bottom:**
- Outlined "Add to Calendar" (secondary)
- Filled navy "Done" — returns to booking view with dates cleared

### Date chip

Reusable chip component for booking flow review, confirmed view, and anywhere else dates need mode indication.

**Base:**
- White bg (or `--card` in subdued contexts), 1px `--border-soft`, 8px radius
- 2-column grid by default
- 12px text, 600 weight, navy

**Variants:**
- `with-delete`: round X button on right (review cards — user removes pending dates)
- `with-dot`: colored dot indicator on right (confirmed cards — visual only)
- 2.5px colored bottom bar spanning full width — navy for school, gold for daycare
- `failed` (red): partial-failure race condition state (future work)

### Buttons

**Primary CTA**
- Full width, navy gradient (`--navy` → `--navy-mid`), white text
- 16–20px padding, 16px radius
- Elevated shadow, hover lift
- Optional icon in rounded well on left

**Secondary CTA** (outlined)
- White bg, navy border, navy text
- Same sizing as primary

**Destructive**
- Red `var(--accent-red)`, reserved for permanent/irreversible actions only

**Text button**
- No bg, no border
- Used for "Clear", "Cancel", inline actions

### Section label

Uppercase mini-heading used throughout the app to introduce content rows:
- 10–11px, 600 weight, `var(--muted)` color
- Letter-spacing 0.14–0.18em
- Examples: "YOUR DOGS", "UP NEXT", "THIS WEEK AT NWA SCHOOL FOR DOGS"
- The header's bottom border is the only divider line on the home page; section labels themselves do not have trailing hairlines.

### Dog profile section tile (collapsible, 2-column grid)

The Overview and Care Notes tabs on dog profile pages render as a 2-column tile grid. Each tile is a closed `.section` rectangle. Tapping a tile opens a centered modal (see Section detail modal below).

```html
<div class="section [school|daycare|private|group|boardtrain|reports] is-collapsed">
  <div class="section-label-row">
    <button class="section-toggle" type="button" onclick="toggleProfileSection(this)" aria-expanded="false">
      <div class="section-head">
        <div class="section-icon"><svg>...</svg></div>
        <div class="section-head-label">Section Title</div>
      </div>
    </button>
  </div>
  <div class="card">
    <!-- section content (moved into modal on open) -->
  </div>
</div>
```

**Layout:**
- `.tab-panel.active` is `display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px`
- Each `.section` is white, 14px radius, soft shadow `0 1px 2px rgba(33,53,106,0.04), 0 4px 16px rgba(33,53,106,0.04)`
- `.section::before` is the colored left-edge accent stripe (3px wide), per-category:
  - `school` = navy
  - `daycare` = `var(--accent-gold)`
  - `group` = `var(--accent-teal)`
  - `private` = `var(--accent-purple)` (`#7a5bc4`)
  - `boardtrain` = `var(--accent-terracotta)`
  - `reports` = `var(--accent-pink)` (`#f4b6c8`)

**Closed (tile) state — `.section.is-collapsed`:**
- `.section-toggle` is `flex-direction: column; padding: 18px 12px 16px; gap: 10px; min-height: 96px`
- Icon bubble is 36×36 with 10px radius, glyph 18×18
- Label is 11px uppercase 700wt, centered, 0.05em tracking

### Section detail modal (centered card popup)

Tapping a section tile on a dog profile page opens a centered card modal containing that section's `.card` content.

**Markup (single reusable modal at the bottom of the page):**

```html
<div class="modal-backdrop modal-centered" data-modal="sectionModal" id="sectionModal">
  <div class="modal-card modal-card-centered" onclick="event.stopPropagation()">
    <div class="modal-header">
      <div class="modal-title" id="sectionModalTitle"></div>
      <button class="modal-close" data-close-modal aria-label="Close">
        <svg viewBox="0 0 12 12"><line x1="3" y1="3" x2="9" y2="9"/><line x1="9" y1="3" x2="3" y2="9"/></svg>
      </button>
    </div>
    <div class="modal-section-body" id="sectionModalBody"></div>
  </div>
</div>
```

**CSS:**

```css
.modal-backdrop.modal-centered {
  align-items: center;
  padding: 24px;
}
.modal-card.modal-card-centered {
  max-width: 360px;
  border-radius: 18px;
  padding: 18px 18px 20px;
  box-shadow: 0 24px 60px rgba(33, 53, 106, 0.28),
              0 4px 12px rgba(33, 53, 106, 0.10);
  animation: modal-scale-in 0.26s cubic-bezier(0.32, 1.15, 0.6, 1);
  max-height: calc(100vh - 48px);
}
@keyframes modal-scale-in {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
.modal-section-body .card {
  max-height: none !important;
  opacity: 1 !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent;
  display: flex !important;
}
```

**Move-not-clone JS pattern.** The section's `.card` is **moved** into the modal body when opened, then **moved back to its original DOM position** when closed. This preserves IDs and pre-attached event listeners on inner buttons. Track `originalAnchor = { parent, next }` so the card returns to the exact same place.

**Three ways to dismiss:**
1. Tap × in the top-right corner
2. Tap dimmed backdrop outside the card
3. Press Escape

This is distinct from the slide-up bottom sheet modal (`.modal-card` without `.modal-card-centered`) which is used for forms (Add Medication, Add Vaccine, etc.).

**When to use centered card modal vs. bottom sheet:**
- **Centered card** — focused detail view, content varies in length, no required action. Examples: section detail modals on dog profile.
- **Bottom sheet** — form input, action sheets, content with required user input. Examples: Add Medication, Add Vaccine, Edit Hospital, Curriculum info, Time frame picker.

### Reports tile (dog profile — Overview)

The 6th tile in the Overview tab grid, positioned as the **2nd tile** so it pairs with School Progress in row 1 of the 2-col layout. Pastel pink accent identity.

**Tile (closed) styling:**
- Pink left-edge stripe via `.section.reports::before { background: var(--accent-pink); }`
- Icon: document/clipboard glyph in `rgba(244, 182, 200, 0.35)` bubble with `var(--accent-pink-dark)` foreground
- Label "REPORTS" colored with `var(--accent-pink-dark)`

**Modal contents (top to bottom):**

1. **Primary "View Latest Report" CTA** — full-width navy gradient button with document icon. Wires to existing JS that picks a random variant from `['foundation', 'advanced', 'looseleash', 'housemanners', 'cgc']` and navigates to `report-card-all-{dog}.html#{variant}`.
2. **Secondary "View all" button** — outlined white-bg button beneath primary, with chevron. Navigates to `reports-list-{dog}.html`.
3. **"Recent reports · last 7 days"** label — uppercase navy with " · last 7 days" subtitle in italic Cormorant at lower contrast.
4. **Horizontal scroller of 7 report cards** — same visual language as Bookings → Past strip cards but scoped to `.rep-*` namespace. 130px wide cards, scroll-snap, hidden scrollbars, colored 3px left stripe per session type.
5. **"scroll →" hint** flush-right below the scroller — uses standard scroll-end-aware pattern.

**Per-card type colors (left stripe + type label):**

| Type | Stripe | Label color |
|------|--------|-------------|
| school | `var(--navy)` | `var(--navy)` |
| daycare | `var(--accent-gold)` | `var(--accent-gold-dark)` |
| private | `var(--accent-purple)` | `#6f4eb8` |
| boardtrain | `var(--accent-terracotta)` | `#8a4e34` |
| groupclass | `var(--accent-teal)` | `#2e6e6e` |

### Past view weekly stack (Bookings page)

The Past view groups completed sessions by week. Each week is a collapsible block; only the latest week is expanded by default, the previous 4 weeks are collapsed.

**Markup:**

```html
<div class="rs-week" data-week="0"> <!-- expanded -->
  <button class="rs-week-header" type="button" onclick="toggleWeekCollapse(this)" aria-expanded="true">
    <div class="rs-week-range">Apr 20 – 26</div>
    <div class="rs-week-count">10 reports</div>
    <svg class="rs-week-chevron" viewBox="0 0 12 8"><polyline points="1 1.5 6 6.5 11 1.5"/></svg>
  </button>
  <div class="rs-week-stacks">
    <!-- one .rs-stack per dog with sessions that week -->
  </div>
  <!-- one .rs-strip per dog (hidden until that dog's stack is tapped) -->
</div>
```

**Header is a real button** — full-width tap target, italic Cormorant week range on left, "N reports" count + chevron on right. Chevron rotates -90° when collapsed.

**Stack of fanned cards per dog** (`.rs-stack`, 96×130) — front card shows the dog's photo + name + report count; 1–2 back cards fan behind via rotation transforms. **Photo appears only on the front card** — back cards are bare white rectangles with their colored borders. Tapping a stack expands a `.rs-strip` of session cards horizontally beneath.

**Stack-front lift on expand:**
```css
.rs-stack[aria-expanded="true"] .rs-stack-front {
  transform: translate(2px, 14px) rotate(2deg);
  box-shadow: 0 8px 16px rgba(33, 53, 106, 0.18);
}
.rs-stack[aria-expanded="true"] .rs-stack-back-2 {
  transform: rotate(-10deg) translate(-10px, 6px);
}
.rs-stack[aria-expanded="true"] .rs-stack-back-1 {
  transform: rotate(8deg) translate(8px, 4px);
}
```

The front card translates down 14px and tilts 2° as if pulled from the deck. Back cards fan out a bit more so the stack silhouette stays visible. Transition: spring `cubic-bezier(0.32, 0.72, 0, 1)` over 0.22s.

**Strip cards inside expanded stack** — info-only, **no photo**. Each card has a colored 3px left stripe, italic Cormorant dog name + uppercase date, small uppercase session-type label, and 3 metric rows with 5-dot indicators.

### How-it-works carousel (pre-home)

The 4-pane horizontal swipe carousel on `how-it-works.html` that introduces new users to the four main service categories: Day School, Day Care, Group Class, Private Lesson.

**Layout (locked-chrome variant):**
- Persistent app header at top
- `.auth-scroll` contains the page title + subtitle + carousel + dots indicator
- `.auth-bottom` (transparent variant) holds either a subtle "Scroll →" hint (panes 0–2) or a navy gradient "Meet the staff! →" CTA (last pane)

**Carousel structure:**

```css
.hiw-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  margin: 0 -20px;
  padding: 0 7%;  /* allows first and last panes to center */
  flex: 1 1 auto;
  min-height: 0;
}
.hiw-pane {
  flex: 0 0 86%;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  min-width: 86%;
  display: flex;
  flex-direction: column;
}
.hiw-pane-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 18px 22px;
  height: calc(100vh - 320px);
  min-height: 480px;
  max-height: 620px;
  display: flex;
  flex-direction: column;
}
```

The card height fills the viewport minus the chrome above (header + title + subtitle ≈ 320px). Min/max bounds prevent it from collapsing on shorter viewports or growing unbounded on taller ones.

**Pane content (each):**
- Cormorant italic service name (28px, navy)
- Tagline (Cormorant italic, 16px, muted)
- 3–4 step icons + titles + descriptions, scrollable inside the card

**Dot indicator** below the carousel, 4 dots, active dot fills navy, inactive dots are `var(--border)`.

**Scroll hint variant for `.auth-bottom`:**
- Tiny inline text "Scroll →"
- 11px font, `var(--muted-soft)` color, 0.04em letter-spacing, 0.75 opacity
- Hidden when on the last pane (replaced by Meet-the-staff CTA)

This is a deliberate exception to the standard `.auth-bottom` chrome — for this page, the carousel itself is the focal element, and a heavy bottom bar would compete with it.

### Pre-home flow pages

These pages all use the locked-chrome layout (persistent top header, internal scroll, optional pinned bottom CTA, no bottom nav).

**New-user flow:**
```
login-welcome → profile-create-owner → profile-create-dog → profile-create-review-dog
              → profile-created → how-it-works → login-onboarding-2 → login-onboarding → home
```

**Returning-user flow:**
```
login-welcome → login-signin → home
```

**Common patterns across pre-home pages:**
- Persistent top header (logo + optional date, no bell)
- `.auth-scroll` for the main content
- `.auth-bottom` with primary CTA when applicable (Continue, Sign in, etc.)
- Form fields use the same patterns as the main app (white cards, 14px radius, navy text)
- Page titles use canonical Page Title spec

---

## Flows and connections

This section captures the navigation glue between screens — the answers to "where does this go after?" that aren't visible from the screen specs alone. Each entry is a worked path.

### New-booking flow

The user reaches a new booking from one of two entry points:
- The "Book a new session" CTA on the Home page (`home.html`)
- The FAB (+) on the Bookings page (`bookings-page.html`)

Both entries open the **same** new-booking sheet — a bottom sheet asking "Which kind of session?" with **5 service tiles**:
- Day School
- Day Care
- Group Class
- Private Lesson
- Board & Train

**Boarding is intentionally excluded from the new-booking sheet.** Boarding sits outside the "training services" framing — it's a different mental model (overnight stay, no training) and lives as its own affordance. Boarding is bookable from Home as a separate entry point (e.g., a dedicated tile or section), not from the unified new-booking sheet.

Tapping a tile routes to the matching booking flow:
- Day School / Day Care → `booking-flow.html` with the matching mode preselected
- Group Class → `book-group.html`
- Private Lesson → `book-private.html`
- Board & Train → `book-boardtrain.html` _(future — currently only the request-detail page exists; build form is open work)_

Boarding bookings start at `book-boarding.html`, reached separately from the new-booking sheet.

### Pending → Approved transition (request lifecycle)

When a user submits a request (Boarding, Private Lesson, or Board & Train), it lands in **Bookings → Pending** with a "Pending" badge and gold pulsing dot, awaiting Shanthi's review.

**On approval** (Shanthi confirms in her admin tool):
- The card disappears from **Pending**
- It appears in **Upcoming** as a normal session card, exactly as if the user had self-booked it
- The user receives **both** an in-app notification (bell badge increments, entry appears in `notifications.html`) and a **push notification** (OS-level push when the app is closed)
- Push copy template: `"Shanthi confirmed your {service} request — {date}"`
- In-app notification copy template: `"Your {service} request for {dog} on {date} is confirmed."`

**On rejection or modification by Shanthi** (future): TBD — flag for later.

### Resubmit changes flow (request detail page)

From a Pending request detail page (`request-detail-{boarding,private,boardtrain}.html`), tapping **"Resubmit changes"**:
1. Validates required fields are still present
2. Shows the `viewSent` confirmation pattern (animated checkmark + "Changes saved" + body copy)
3. After the user taps the primary button on the success view, **bounces back to Bookings → Pending** so they see their request still in queue, now reflecting the updated details
4. Does NOT bounce to the detail page in its updated state — the user should see the request in context (the queue) so they understand it's still awaiting Shanthi's confirmation

### Cancel request flow (request detail page)

From a Pending request detail page, tapping **"Cancel request"**:
1. Opens the centered confirmation modal ("Cancel this request?")
2. On confirm, the request is removed from Pending
3. User bounces to Bookings → Pending, where the card is no longer present
4. No notification fires (the user initiated this; no need to tell them what they just did)

### Latest report (Reports tile, dog profile)

From a dog profile, opening the Reports tile modal and tapping **"View Latest Report"**:
- Closes the section detail modal
- Navigates to `report-card-all-{dog}.html#{variant}` with the variant being the most recent report card

**Prototype behavior:** since there's no data layer, the prototype picks a *random* variant from `['foundation', 'advanced', 'looseleash', 'housemanners', 'cgc']` to simulate "the latest report." This is a prototype shortcut.

**Real-app intent:** in the React Native build, this fetches the most recent report card by `created_at` for that dog and routes to it. Document this clearly in the RN port — don't carry the random shortcut into production.

### Notifications

The bell button in the global header is present on every authenticated page. Tapping it opens the **`.notif-popover`** — a centered popover modal listing past in-app notifications.

This is **not** a full page (`notifications.html` does not exist) and **not** a bottom sheet. It's a centered popover that appears in front of the current page, dismissible via × button, backdrop click, or Escape. The user stays in context.

The pattern is **already built in `account.html`** (lines ~1309–1380) under the `.notif-*` namespace and should be promoted to a global pattern reused on every page. See the Component reuse map — listed as "Global (rename pending)."

**Markup pattern:**

```html
<div class="notif-backdrop" id="notifBackdrop" onclick="closeNotifs()"></div>
<div class="notif-popover" id="notifPopover" role="dialog" aria-label="Notifications">
  <div class="notif-header">
    <div class="notif-title"><em>Notifications</em></div>
    <button class="notif-close" onclick="closeNotifs()" aria-label="Close">×</button>
  </div>
  <div class="notif-list">
    <button class="notif-row unread" data-route="report-card-all-waffles.html">
      <span class="notif-unread-dot"></span>
      <span class="notif-icon report"><svg>...</svg></span>
      <span class="notif-body">
        <span class="notif-row-title"><em>Waffles</em> has a new report card!</span>
        <span class="notif-row-sub">Donovan · Foundations · 12 min ago</span>
      </span>
      <span class="notif-chevron">›</span>
    </button>
    <!-- more .notif-row entries -->
  </div>
</div>
```

**Per-row content:**
- Unread dot (small navy circle, left side, hidden on read rows)
- Type icon in tinted circle (report / photos / message / announcement / etc., color-coded)
- Title (with optional `<em>` for dog name in italic Cormorant)
- Subtitle (trainer · context · relative timestamp)
- Right chevron, present only when the row routes somewhere (`.not-routable` modifier hides it)

**Behavior:**
- The bell badge shows unread count, capped at "9+"
- Opening the popover marks all visible items as read after a small delay (~600ms — long enough that the user notices the unread dots before they fade)
- Tapping a routable row navigates to the destination and closes the popover
- "Mark all as read" affordance lives in the popover header

### Messages tab

Tapping the Messages tab (bottom nav) goes to `messages.html`, which is a **list of chat threads** — typically the user's threads with Shanthi and other staff members.

The prototype includes a couple of example messages already drafted (so Shanthi can see realistic chat content during the stakeholder demo). Tapping a thread opens the corresponding `chat-*.html` page. Tapping the "+ New" affordance opens `new-message.html` to start a new thread.

### First-time user assumption

The app **assumes every user reaches Home with at least one dog already in their account.** The pre-home onboarding flow (login-welcome → profile-create-owner → profile-create-dog → profile-create-review-dog → profile-created → how-it-works → onboarding → home) requires creating a dog before the user can land on Home.

There is no "Home with zero dogs" state. The Dog Story row on Home always has at least one circle. The "Add another dog" affordance lives in Account → My Dogs → Add a dog (`dog-add.html`), reached after the user is already in the app.

If a user somehow gets to Home with zero dogs (data corruption, future "remove last dog" edge case), the app should treat it as an error state and route them back through profile-create-dog. This is a defensive case, not a normal flow.

### Account tab

The Account tab (`account.html`) contains everything user-account-related and is comprehensive enough to serve as the spec itself. Sections currently built:

- **Profile header card** — user name, photo, contact info
- **My Dogs** — card list of dogs (each routes to `dog-profile-{name}.html`); "Add a dog" affordance routes to `dog-add.html`
- **Account section** — Payment Methods (routes to `payment-methods.html`), Location (picker modal), Emergency Contact (accordion), Notifications toggle
- **Support section** — help / contact links
- **Log Out** with confirmation modal

When building new account-related features, **read `account.html` first** rather than designing from scratch. Patterns live there.

### Pull-to-refresh

Implemented on **Bookings** (`bookings-page.html`) and **Messages** (`messages.html`) only. Not on Home, Account, dog profiles, or any other page.

**Prototype behavior:**
- User pulls down at the top of the scroll container
- Standard iOS-style spinner appears
- Spinner runs for ~800ms (since there's no real backend to fetch from)
- Same content re-renders (with optional small change like updating relative timestamps "2 min ago" → "Just now")
- Spinner hides

**Real-app intent:** in the React Native build, this triggers an actual data refetch via the relevant service. The 800ms simulated delay is a prototype shortcut.

---

## Patterns and Behaviors

### Day-centric vs Dog-centric framing

When the app needs to show multiple sessions, it frames by **day** primarily. Example: "3 sessions tomorrow" is the headline; the dog breakdown lives inside the card. Not "Waffles goes tomorrow, Lola goes tomorrow, Brodie goes tomorrow."

### Announcement priority

On the home page announcement row, cards appear in this order:
1. Urgent (closures, alerts) — red edge, first
2. Routine (team, classes, events, promos) — in order of recency

### Navigation affordances

Every card that navigates somewhere has one of:
- A visible chevron `›` on the right
- A "View [thing] ›" label in a footer zone
- A clear action button row at the bottom

Cards never rely on "tapping the photo" to navigate without a visible cue.

### Scroll hint (horizontal scroll affordance)

Horizontal-scroll rows (dogs row, announcements row, Reports tile carousel, etc.) get a small uppercase **"scroll →"** label flush-right below the row. The hint is **scroll-position-aware**: it fades to invisible when the user has scrolled to the rightmost end of the row, and fades back in when there's more content to the right.

**Behavior rules.** The hint is hidden when **either** of these is true:
- The row's content fits its viewport (`scrollWidth <= clientWidth`)
- The user has scrolled to the right edge (`scrollLeft + clientWidth >= scrollWidth - 2`)

Otherwise the hint is visible. The 2px tolerance handles sub-pixel rounding on different display densities.

**Markup:**

```html
<div class="some-scroll-row">... cards ...</div>
<div class="scroll-hint" data-target=".some-scroll-row">scroll <span class="scroll-hint-arrow">→</span></div>
```

**CSS:**

```css
.scroll-hint {
  display: flex;
  justify-content: flex-end;
  padding: 4px 24px 0;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  opacity: 0.7;
  gap: 4px;
  align-items: center;
  transition: opacity 0.25s ease, visibility 0.25s ease;
}
.scroll-hint.is-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.scroll-hint-arrow {
  display: inline-block;
  font-size: 11px;
  animation: scroll-hint 2s ease-in-out infinite;
}
@keyframes scroll-hint {
  0%, 100% { transform: translateX(0); opacity: 0.6; }
  50%      { transform: translateX(3px); opacity: 1; }
}
```

**JS (shared `wireHint` helper):**

```js
function wireHint(hint, row) {
  if (!hint || !row) return;
  function update() {
    const fits = row.scrollWidth <= row.clientWidth + 1;
    const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;
    if (fits || atEnd) hint.classList.add('is-hidden');
    else hint.classList.remove('is-hidden');
  }
  row.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  requestAnimationFrame(update);
}
document.querySelectorAll('.scroll-hint[data-target]').forEach(hint => {
  const row = document.querySelector(hint.dataset.target);
  wireHint(hint, row);
});
```

The `passive: true` on the scroll listener is required — without it, touch scrolling on iOS gets noticeably laggy.

**When to use it:**
- Horizontal-scroll rows where content overflows the viewport
- Especially worthwhile when the right edge of the row sits flush against the page edge with no visual cue that more content exists

**When NOT to use it:**
- Vertical-scroll containers (the page itself, modal bodies)
- Rows where the rightmost content is always partially visible (peek IS the affordance)
- Rows that always fit in the viewport
- Snap-scroll rows where each card is full-width and a dot indicator handles the affordance

### Empty states

Every list/row must have a defined empty state. The copy below is locked — use it verbatim.

| Surface | Empty copy | Behavior |
|---|---|---|
| Bookings → Upcoming | "No current bookings" | FAB (+) stays in its normal position, acting as the CTA. No additional centered button. |
| Bookings → Past | "No previous bookings" | Quiet message; no CTA. |
| Bookings → Pending | "No pending events" | Quiet message; no CTA. |
| Messages | "No messages" | Quiet message; the "+ New" affordance in the page chrome remains the CTA. |
| Home → Dog Story row | Hide the row entirely | Onboarding guarantees ≥1 dog, so this is defensive only. |
| Home → "This week at NWA" announcements | Hide the entire section | If there are no announcements this week, the section disappears completely. |
| Dog profile section tile (e.g., Day School) with no data | Tile **still shows**; modal content area is **empty** when opened | Don't hide the tile — it represents a section the dog has access to but no history in yet. The empty modal can show a small italic caption like "No [section] yet" inside, but the tile in the grid stays. |
| Reports tile with no reports | Tile still shows; modal shows the "View Latest Report" / "View all" buttons disabled, plus empty scroller | Same principle — section exists, just no data yet. |

**Empty-state typography:** quiet messages use Cormorant Garamond italic at 16px, `var(--muted)` color, centered in the empty area with ~40–60px vertical padding above and below. No icon unless explicitly specified (we keep empty states understated rather than illustrated).

### Session type labels

Across the app, session types are referred to consistently:
- "Day School" (not "school", not "day school class")
- "Day Care" (not "daycare" in user-facing copy, not "doggy daycare")
- "Group Class" (not "group", not "class")
- "Private Lesson" (not "private", not "1:1")
- "Board & Train" (not "board-and-train")
- "Boarding" (not "overnight stay" in service labels — but the description "Overnight stays · drop-off & pick-up" is correct)

### Picker button pattern

When a control opens a picker/sheet for selection, it follows the icon + value + chevron pattern:

```
[icon] Current value ⌄
```

- The value is the primary readable text (13–15px, 600 weight, navy)
- The leading icon is contextual at 0.65 opacity
- The trailing chevron (`⌄` or `›`) is at 0.45 opacity at rest, lifts on hover
- The whole thing is a rounded button with subtle shadow and hover feedback

This is distinct from a **chip** (pill-shaped, toggleable) and a **tag** (status indicator, not interactive). The chevron is the cue that this control opens something, not that it's selected.

### Sheets and modals

Any element that overlays the entire device viewport lives as a **direct child of `.device-screen`**, outside `.device-screen-inner`. This matters:

- `.device-screen-inner` is the scroll container
- Content inside it participates in scroll layout
- Sheets must anchor to the visible viewport, not the scroll content

**Bottom sheet pattern (`.modal-card` default):**
- Backdrop: `position: fixed; inset: 0` + backdrop-filter blur + navy tint at ~40% opacity
- Sheet: `position: fixed; bottom: 0` + `transform: translateY(100%)` default, `translateY(0)` when open
- Transition: 0.32s `cubic-bezier(0.2, 0.8, 0.2, 1)` (slight overshoot for "settle" feel)
- Z-index: backdrop 100, sheet 101
- Sheet top radius 24px, `var(--bg)` fill
- Drag handle at top (40×4px, `var(--border)` fill, rounded)
- Max-height: ~84% of viewport (use `max-height: 88vh` as a safety net) with internal `overflow-y: auto` for tall content
- **Use for:** form input, action sheets, content with required user input

> Use `position: fixed`, not `absolute`. The device frame can distort parent heights and `absolute` will not anchor reliably to the viewport.

**Centered card modal pattern (`.modal-card.modal-card-centered`):**
- Same backdrop as bottom sheet, but `align-items: center` instead of `flex-end`
- Card scales in from 0.94→1.0 over 0.26s with `cubic-bezier(0.32, 1.15, 0.6, 1)`
- Card max-width 360px, all four corners rounded 18px, max-height `calc(100vh - 48px)`
- Stronger shadow `0 24px 60px / 0 4px 12px` (sits in space rather than anchored to bottom)
- Three dismissals: × button, backdrop click, Escape key
- **Use for:** focused detail views, content that varies in length, no required action

**Confirmation dialog pattern:**
- Same backdrop as sheet
- Center-aligned card (uses `.modal-card-centered` variant) — for short binary decisions
- 18px radius, max-width ~300px
- Title serif 22px, message sans 13px, button row
- Two buttons: cancel-like (grey bg, navy text) + primary action (filled navy or red)
- Button labels are always **verbs that describe outcomes**, not "Cancel / OK"

### Accordion mode (one section open at a time)

When a screen has multiple stacked collapsible sections, the default is **accordion mode**: opening a new section auto-collapses any sibling that's currently open. This keeps the user's focus on one thing at a time.

```js
function toggleProfileSection(btn) {
  const section = btn.closest('.section');
  const willOpen = section.classList.contains('is-collapsed');
  if (willOpen) {
    const scope = section.closest('.tab-panel') || document;
    scope.querySelectorAll('.section:not(.is-collapsed)').forEach(other => {
      if (other !== section) {
        other.classList.add('is-collapsed');
        other.querySelector('.section-toggle')?.setAttribute('aria-expanded', 'false');
      }
    });
  }
  section.classList.toggle('is-collapsed');
  btn.setAttribute('aria-expanded', !willOpen ? 'true' : 'false');
}
```

Accordion scope is the immediate container — sections in different containers don't interact. Tabs are independent.

On the dog profile page, this toggle is replaced by the section detail modal popup (so accordion mode is moot there). Accordion mode still applies elsewhere (Bookings → Past weekly groups, etc.).

### Success states (animated checkmark)

When an action completes successfully (booking confirmed, request resubmitted, payment received), use a consistent "hero success" pattern for emotional closure.

**Visual:**
- Filled green circle (`--accent-green`, 64px) with soft green shadow
- White checkmark SVG inside (polyline `20 6 9 17 4 12` at 32px, 3px stroke, round line caps)
- Followed by serif italic title (e.g., "*Confirmed!*", 34px)
- Subtitle in muted sans (13px) with one-line summary

**Entry animation:**
```css
@keyframes check-pop {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
```

Spring easing: `cubic-bezier(0.34, 1.4, 0.64, 1)`, 0.5s duration, 0.1s delay. Reserve this for actual completion milestones — not routine UI transitions.

### Multi-step sheets (sheet queueing)

When a single action triggers multiple sequential decisions (e.g., one dog needs a credit package, then the next), queue the sheets one at a time rather than combining into a mega-sheet.

**Pattern:**
- First sheet opens with "Step 1 of N · [context]" label at top (only shown when N > 1)
- User completes the action
- Close current sheet (0.32s)
- Wait 350ms
- Open next sheet in the queue with content updated

Hide the step indicator when only one item is in the queue.

### Pull-to-refresh

Implemented on **Bookings** (`bookings-page.html`) and **Messages** (`messages.html`) only — not on Home, Account, dog profile pages, or any other page. The Bookings and Messages tabs are the two surfaces where a user might genuinely want to refresh ("did Shanthi confirm yet? did a new message come in?"); other pages don't have time-sensitive content that warrants the gesture.

**Visual:**
- Standard iOS-style pull-down spinner (system gray rotating arc)
- Spinner appears once the user pulls past a threshold (~60px)
- Spinner sits at the top of the scroll container, above the content

**Prototype behavior:**
- User pulls down at the top of the scroll container
- Spinner appears
- Spinner runs for ~800ms (since there's no real backend to fetch from)
- Same content re-renders — optionally with a small "as if real" change like updated relative timestamps ("2 min ago" → "Just now")
- Spinner hides

**Real-app intent:** the React Native build replaces the simulated 800ms with a real data refetch via the relevant service (`bookingService.list()` for Bookings, `messageService.listThreads()` for Messages). The spinner runs as long as the actual request takes; on success or error it hides. On error, surface the standard error toast ("Something went wrong, tap to retry").

**Don't add it to other pages without a reason.** Pull-to-refresh on Home, Account, or dog profiles is gestural noise — those pages don't have content the user expects to update on demand.

### Horizontal scroll card rows

Used for Dog Story (home), Review-by-dog (booking flow), Reports tile carousel (dog profile), image galleries.

**Structure:**
- Parent container with `overflow-x: auto` and hidden scrollbars
- Children are fixed-width cards (not flexible) so cards don't squish when the row has few items
- `-webkit-overflow-scrolling: touch` for iOS momentum scroll
- `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`

**Card width guidelines:**
- Dog Story circles: 110px
- Review-by-dog: 270px (fits 1.5 cards in 402px — signals overflow without hiding the right edge)
- Reports tile cards: 130px
- Image gallery: variable but usually 180–220px

**Do NOT use `scroll-snap-type` on home/profile rows:** Safari's implementation causes inconsistent initial scroll positions. Instead, explicitly set `scrollLeft = 0` on `DOMContentLoaded`. (Snap IS appropriate for full-width pane carousels like how-it-works — different use case.)

### PWA web-app-shell pattern (pre-home pages)

Pre-home pages use a basic web-app-shell setup so the prototype feels native when viewed on a phone:
- Manifest `<link rel="manifest" href="manifest.json">` in `<head>` (TODO: add manifest)
- Apple touch icon `<link rel="apple-touch-icon" href="apple-touch-icon.png">` (TODO: 180×180 PNG)
- Status bar color matches `var(--bg)` via `<meta name="theme-color" content="#eef1f8">`
- Viewport meta with `viewport-fit=cover` so safe-area-inset values are respected

This is currently applied to all 9 pre-home pages. Rolling it out to the rest of the app is open work.

### Process patterns (build-time discipline)

These are workflow rules learned from production mistakes — not user-facing patterns, but they protect every component spec above from going wrong on the way to the screen.

**DOM balance is necessary but not sufficient.** A balanced `<div>` count vs `</div>` count does NOT prove correct nesting. Pair the balance check with visual section-order verification — count expected sections per container and check that the first line of each matches expected content.

**Strip `<script>` blocks before counting `<div>` opens.** JavaScript string content can contain `<div` substrings that throw the count off. Run the count on `re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.DOTALL)`.

**Use comment-marker anchors, not generic structural patterns.** When using regex to extract or move HTML blocks across nested structures, prefer pairs of explicit HTML comments (`<!-- /.section-name -->`) as boundaries rather than generic patterns like `</div></div></div>`. Generic patterns can match the wrong nesting level.

**Cross-file propagation needs distinguishing-marker checks.** When applying the same change to multiple per-dog files, verify each file received the change by checking distinguishing markers — not just generic presence checks like "did the file size grow."

**Smoke test routes after layout changes.** Run an HTTP 200 smoke test on each file before declaring done. For layout changes, also use Playwright headless at 402×874 (deviceScaleFactor 2) to measure header/scroll/bottom positions.

**Use `position: fixed`, not `absolute`, for full-screen overlays.** The device frame can distort parent heights, so `absolute` won't anchor reliably to the viewport. Add `max-height: 88vh` + `overflow-y: auto` as a safety net.

---

## Vocabulary

Lock one word per concept:

| Concept | Word |
|---|---|
| Pre-paid bundle of credits | Package |
| Ongoing monthly plan | Membership |
| One visit | Session |
| Act of reserving | Booking |
| Staff-approval-required submission | Request |
| Training progress tracker | Training progress |
| Stored payment cards | Payment methods |
| Back-navigation chevron on inner pages | Inline back link |
| Awaiting Shanthi's review | Pending |
| Day School / Day Care / Group Class / Private Lesson / Board & Train / Boarding | Service categories (canonical names) |

---

## Copy and formatting

The strings below are **canonical** — use them verbatim, don't paraphrase.

### Date formats

| Context | Format | Example |
|---|---|---|
| Long-form / formal (page titles, document headers, full dates in body copy) | `Day DD Month YYYY` | `Tues 22 April 2026` |
| Header date strip (top-right of global header, uppercase) | `DAY · MON DD` | `TUES · APR 22` |
| Card titles, chips, compressed contexts | `Mon DD` or `DD Mon` | `Apr 24` |
| Date range (week stack header, time frame chip) | `Mon DD – DD` | `Apr 20 – 26` |

**Day abbreviation rules:**
- Long form: `Mon, Tues, Wed, Thurs, Fri, Sat, Sun` (4-letter where natural; 3-letter for Mon, Wed, Fri, Sat, Sun)
- Short form (header): `MON, TUES, WED, THUR, FRI, SAT, SUN` uppercase

**Capitalization:** Days and months are Title Case (`Tues`, `April`, `Apr`). Meridiem is lowercase (see Time below).

### Time formats

| Context | Format | Example |
|---|---|---|
| All UI surfaces | `H:MM am` / `H:MM pm` | `7:30 am` / `2:15 pm` |
| 12-hour clock, lowercase meridiem with a leading space | always | `7:30 am` (not `7:30am`, not `07:30`, not `7:30 AM`) |

The capitalization rule (Title Case for words like Mon/Apr; lowercase for am/pm) is intentional — words capitalize, abbreviations of "ante meridiem" / "post meridiem" don't.

### Currency formats

| Context | Format | Example |
|---|---|---|
| Per-night services (Boarding) | `$NN/night` | `$45/night` |
| Per-booking services (Private Lesson, Group Class as one-off) | `$NN/booking` | `$80/booking` |
| Package totals / lump-sum charges | `$NN` (whole-dollar; trailing `.00` only if cents are non-zero) | `$180`, `$252.50` |
| Subscriptions / memberships | `$NN/month` | `$199/month` |

No currency symbol other than `$` is supported (USD only). No thousands separator below $10,000 (we don't expect amounts that high in this product).

### Error and loading copy

- **Generic error:** "Something went wrong, tap to retry" — used when a load or submit fails for an unknown reason
- **Loading:** spinner only (no text) for the prototype phase. Custom branded spinners + microcopy come later.

### Notification badge cap

- Bell badge displays raw count up to 9
- 10 or more displays as `9+` (no `99+`, no uncapped numerics)

### Notification copy templates

When Shanthi confirms a request:
- **Push:** `"Shanthi confirmed your {service} request — {date}"`
- **In-app row:** title `"Your {service} request for {dog} on {date} is confirmed."`, sub `"{relative time}"`

When a new report card is published:
- **Push:** `"{Dog} has a new report card from {trainer}"`
- **In-app row:** title `"{Dog} has a new report card!"`, sub `"{trainer} · {program} · {relative time}"`

When a session is canceled by Shanthi (rare):
- **Push:** `"Your {service} session on {date} was canceled. Tap for details."`
- **In-app row:** title `"{Service} session canceled"`, sub `"{date} · tap to reschedule"`

When a new announcement is posted:
- **Push:** `"{Announcement title}"` (uses the announcement's own headline)
- **In-app row:** title `"{Announcement title}"`, sub `"{relative time}"`

---

## Sample data

The prototypes need realistic-feeling sample data so stakeholder demos and UI testing surface real edge cases. The rules below govern how to populate mockups.

### Quantities

Sample data should be **realistic in volume**, not sparse. A dog who's been a client for a while accumulates real history.

- **Past reports per dog:** 30+ entries spanning multiple months. Mix of session types weighted toward the dog's primary categories.
- **Upcoming sessions per dog:** 15–25 entries spanning the next 4–6 weeks, including a mix of session types and varying recurrence patterns.
- **Pending requests:** typically 1–3 active per user (these come and go quickly as Shanthi reviews them).
- **Vaccines per dog:** full set — Rabies, DHPP, Bordetella, with realistic expiration dates (some current, ideally one expiring soon to demo the warning state).
- **Medications per dog:** 0–2 entries depending on the dog (Brodie as the older mixed breed makes sense to have one).
- **Feeding instructions:** detailed enough to feel real (specific brand, amount, frequency).
- **Special notes:** 1–2 lines of trainer-relevant detail.
- **Announcements on Home:** 4–8 cards covering urgent (rare), team updates, classes, events, promos. Some examples are real (see below) and can be used as templates.

The user-side prototype shouldn't worry about *how many announcements are too many* or similar volume limits — that's BE logic Shanthi's admin tool will handle when the time comes.

### Trainer assignment

Trainers (Donovan, Ashe, Amber, Rachel) are **randomly assigned** to sessions and report cards in mockups. A dog doesn't have a "primary trainer" in the data model — different sessions might pair them with different staff. Variety is good for showing the team.

Shanthi herself doesn't typically appear as the assigned trainer on individual sessions; she's the owner and shows up in announcements, the Meet Shanthi card, and as the Messages thread default contact.

### Real announcements (use as templates)

These are real NWA announcements. Use them verbatim, or generate similar ones with the same voice.

- **"Yappy Hour Saturday"** — social event for clients and dogs. Category: event (purple).
- **"Closed Memorial Day"** — holiday closure. Category: urgent (red), shown first in the row when active.
- **"Rachel joins the team"** — staff introduction. Category: team (navy).
- **"Puppy class signups open"** — class enrollment promo. Category: class (gold).

Build new mock announcements in the same shapes — short titles, no sub-text, single tap leads to a detail page or modal with more info.

### Example messages

The Messages tab includes a couple of pre-drafted example threads (Allison ↔ Shanthi as the primary thread, plus 1–2 with other staff) so the stakeholder demo shows realistic chat content rather than an empty state. Threads have:
- A handful of recent messages (5–10 visible)
- Mixed sender (some from Allison, some from Shanthi)
- Real-feeling content — questions about Waffles' Day School schedule, photos shared after a session, scheduling chatter
- Realistic timestamps relative to "today"

Keep the language warm and natural. Real clients use 🐾 🐶 ❤️ in chats — these are fine to include in mock messages (and only mock messages — never in app UI chrome).

### Search / global

There is **no global search** in the prototype. No search bar in the header, no search anywhere else. Filtering on the Bookings page (dog chips + class type chips + time frame) is the only "find content" affordance.

---

## Motion

- **Page entrance:** stagger sections with `fade-up` animation, 0.05s delays per section
- **Hover:** `translateY(-2px)` + shadow upgrade
- **Press:** `scale(0.98)` for cards, `scale(0.94)` for small buttons
- **Bell unread pulse:** 2.6s gentle box-shadow glow
- **"Up Next" indicator dot:** 2.4s pulse animation
- **Pending status dot:** 2.4s pulse (gold)
- **Sheet open:** 0.32s `cubic-bezier(0.2, 0.8, 0.2, 1)` slide up
- **Centered modal open:** 0.26s `cubic-bezier(0.32, 1.15, 0.6, 1)` scale in
- **Success checkmark:** 0.5s spring `cubic-bezier(0.34, 1.4, 0.64, 1)` with overshoot
- Respect `prefers-reduced-motion`: disable all animations

---

## Accessibility floors

- Tap targets minimum 44px, preferred 56px
- Text contrast minimum 4.5:1 for body, 3:1 for large text
- Respect system text size (don't hard-cap font sizes in production)
- Every interactive element has hover, active, and focus states
- Icon-only buttons have `title` attribute or `aria-label`
- Form inputs always paired with visible labels (no placeholder-only labels)

---

## File outputs (current reference prototypes)

All user-facing prototype HTML files live at the repo root and deploy via GitHub Pages.

**Authenticated app (post-login, all show bottom nav):**
- `home.html` — Home tab (welcome, dogs row, Up Next, announcements, new-booking sheet)
- `bookings-page.html` — Bookings tab with Upcoming / Past / Pending views (3-cell view toggle, color-coded session cards, swipe-to-cancel on Upcoming, weekly accordion stack on Past, pending cards with status dot on Pending)
- `messages.html` — Messages tab
- `account.html` — Account tab with My Dogs card list

**Per-dog pages:**
- `dog-profile-{waffles,brodie,lola}.html` — vertical hero + 2-column tile grid for Overview (School Progress, Reports, Day Care, Private Lessons, Group Lessons, Board & Train) and Care Notes (Medications, Vaccines, Feeding Instructions, Special Notes). Tile tap opens centered modal.
- `dog-add.html` — standalone dog onboarding form
- `dog-manage-{waffles,brodie,lola}.html` — per-dog account management
- `report-card-all-{waffles,brodie,lola}.html` — full report cards with hash-routing per program variant (#foundation, #advanced, #looseleash, #housemanners, #cgc)
- `reports-list-{waffles,brodie,lola}.html` — chronological list of past reports

**Booking flows:**
- `book-private.html` — Private Lesson intake + booking (model for intake pattern)
- `book-group.html` — Group Class booking
- `book-boarding.html` — Boarding (overnight stays) booking
- `booking-flow.html`, `booking-flow-reschedule.html` — Day School / multi-step flows

**Pending request detail pages:**
- `request-detail-boarding.html` — pink accent
- `request-detail-private.html` — purple accent (`#7a5bc4`)
- `request-detail-boardtrain.html` — terracotta accent

**Pre-home flow (no bottom nav, locked-chrome layout):**
- `index.html` — welcome / splash entry
- `login-welcome.html` — sign-in / sign-up choice
- `login-signin.html` — returning user sign-in
- `profile-create-owner.html` — new user owner profile
- `profile-create-dog.html` — new user dog profile
- `profile-create-review-dog.html` — confirm dog details
- `profile-created.html` — success / continue
- `how-it-works.html` — 4-pane swipe carousel explainer
- `login-onboarding-2.html`, `login-onboarding.html` — final onboarding before home

**Communication pages:**
- `chat-*.html` — individual chat threads
- `new-message.html` — new message composer
- `payment-methods.html` — payment management

**Educational / standalone:**
- `meet-rachel.html`, `puppy-class.html`, `yappy-hour.html` — staff/program info pages

**Assets:**
- `nwa-logo-horizontal.png` — horizontal brand mark (navy on transparent)
- `lola.png`, `waffles.png`, `brodie.png` — example dog photos used throughout

**Filename rule (LOCKED): never rename user-facing HTML.** External links (Allison's notes, GitHub Pages URLs, future React Native imports) may point at these filenames. Edit files in place rather than renaming.

---

## React Native translation reference

> **For locked technical decisions** (Expo Router vs. React Navigation, StyleSheet vs. NativeWind, project folder structure, state management, mock data strategy), see **`ARCHITECTURE.md`** at the repo root. This section is the **translation table** for HTML-prototype constructs that need RN equivalents — the *what changes when we leave the browser*. Architectural decisions live in ARCHITECTURE.md so they don't get relitigated mid-session.

The HTML prototypes use a number of constructs that are specific to web rendering inside the iPhone-frame mockup. When the React Native build starts, several of these constructs *don't carry over directly* — they need to be translated to RN equivalents. This table is the translation reference so the conversion goes faster and you don't end up reproducing prototype-specific scaffolding inside the real app.

### Things that go away entirely

These are HTML/CSS prototype tricks that exist only because the prototypes render the iPhone frame inside a desktop browser. In React Native, they're gone — RN renders into the actual device viewport.

| HTML prototype construct | What to do in React Native |
|---|---|
| `.device-frame`, `.device-screen`, `.device-screen-inner` (the iPhone bezel and dark canvas backdrop) | Gone. The app renders into the real device viewport. Use `SafeAreaView` from `react-native-safe-area-context` for the outer container. |
| `position: sticky` on header / nav | Doesn't exist in RN. Sticky headers come from `<ScrollView stickyHeaderIndices={[0]}>` or by rendering the header *outside* the scroll view (so it stays put naturally). |
| `position: fixed` for full-screen overlays + the `max-height: 88vh` safety net | Gone. Use `<Modal>` or `react-native-modal` — these handle viewport anchoring correctly by default. |
| `overflow: hidden` on `.device-screen` to clip overlays | Gone. RN doesn't propagate child positioning the same way. |
| `backdrop-filter: blur(16px)` for frosted glass header | Replaced by `<BlurView>` from `expo-blur`. Different API, different perf profile — use sparingly. |
| `scrollbar-width: none` / `-webkit-overflow-scrolling: touch` | Gone. RN scroll views don't show scrollbars by default; momentum scroll is built in. |
| Hover states (`:hover { translateY(-2px) }`) | Gone — no hover on touch devices. Re-evaluate as press states using `Pressable`'s `pressed` prop, or remove. |
| `scroll-snap-type` for the how-it-works carousel | Replaced by `<FlatList horizontal pagingEnabled />` or `react-native-pager-view`. |
| `touch-action: pan-y` on swipe-to-cancel cards | Replaced by `react-native-gesture-handler` + `react-native-reanimated` for swipe gestures. |
| `aspect-ratio: 1` on calendar cells | Native to RN as a style prop in recent versions; supported by `aspectRatio: 1`. |
| CSS variable system (`--accent-purple` with fallback) | Replaced by a typed `theme.ts` exporting `theme.colors.accentPurple`. TypeScript catches missing keys at compile time — the var-fallback gymnastics go away. |
| Inline `<style>` blocks in HTML | Replaced by StyleSheet objects, NativeWind, or styled-components — pick one early and stay consistent. |
| `<button>` element | Replaced by `<Pressable>` with `accessibilityRole="button"` and `accessibilityLabel`. |
| `<input type="text">` / `<input type="date">` | Replaced by `<TextInput>` and a date picker library (`@react-native-community/datetimepicker` or similar). Native date inputs do not exist as a primitive. |
| Scroll position reset on load (`row.scrollLeft = 0`) | Handled by `<ScrollView ref={scrollRef}>` + `scrollRef.current?.scrollTo({ x: 0, animated: false })` in `useEffect`. |
| Filename-based routing (`location.href = 'dog-profile-waffles.html'`) | Replaced by React Navigation: `navigation.navigate('DogProfile', { dogId: 'waffles' })`. Or Expo Router if Allison opts into file-based routing. |
| `data-*` attributes for swipe state, modal state, etc. | Replaced by React state. State lives in components/hooks, not the DOM. |
| Hash-routing for report card variants (`#foundation`) | Replaced by route params: `navigation.navigate('ReportCard', { dogId, variant: 'foundation' })`. |
| `event.stopPropagation()` on nested click handlers | Replaced by careful component composition — RN press events don't bubble the same way, and nested `Pressable` requires explicit handling via `hitSlop` or restructuring. |
| Backdrop click to dismiss modals | Replaced by the `<Modal>` component's `onRequestClose` (Android back button) and a `<Pressable>` over the backdrop. |
| `Escape` keyboard handler for modal dismiss | Mostly N/A on mobile — but accessibility on iPad and external keyboards still expects equivalent behavior, so wire it up. |

### Things that translate cleanly

These work in both worlds; the design tokens and patterns carry over with minimal change.

| HTML prototype construct | React Native equivalent |
|---|---|
| Color tokens (`--navy`, `--accent-purple`, etc.) | `theme.colors.navy`, `theme.colors.accentPurple` in `theme.ts`. Same hex values. |
| Typography (Cormorant Garamond + Instrument Sans) | Same fonts via `expo-font` or RN font loading. Same sizes, weights, letter-spacing. |
| Spacing scale (20px page padding, 12-14px gaps, etc.) | `theme.spacing.page = 20` etc. Same numerics. |
| Border radius (16-20px cards, 10-14px buttons) | Same `borderRadius` values. |
| Shadow tokens (`--shadow-sm`, `--shadow-md`, `--shadow-lg`) | Translated to `shadowColor / shadowOffset / shadowOpacity / shadowRadius` (iOS) and `elevation` (Android). Each shadow token becomes an object with both. |
| Component layout (flex columns, gap, padding) | RN flexbox is virtually identical to web flexbox. `display: flex` is the default, `flex-direction: column` is the default. |
| Inline back link visual spec (32x32 button, 22px chevron, color transitions) | Same — `<Pressable>` with `accessibilityRole="button"`, SVG icon via `react-native-svg`. |
| Card patterns (white bg, 1px border, radius, shadow) | Direct translation — `View` with `backgroundColor`, `borderWidth`, `borderColor`, `borderRadius`, shadow props. |
| Color-coded left edge per service category | `View` with `borderLeftWidth: 4` and `borderLeftColor: theme.colors.accentPurple`. |
| Animations (entrance, hover, success checkmark) | Replaced by `react-native-reanimated` shared values + `withSpring` / `withTiming`. Spring configs map directly: cubic-bezier becomes `Easing.bezier(...)`. |
| Accordion mode (one-section-open-at-a-time) | Direct — same JS logic, just operating on React state instead of DOM classes. |
| The 6 service categories and their color mappings | Carry over verbatim. |
| Voice and copy locks | Carry over verbatim. |
| Three example dogs (Waffles, Lola, Brodie) | Carry over verbatim, with the same photos. |
| Component reuse map (which patterns are global vs scoped) | Carries over conceptually — translate each global pattern into a single RN component (`<StatusBanner>`, `<Chip>`, `<TextareaCard>`) and reuse it everywhere. |

### Architectural setup for the conversion

Before any screens get built, set up the foundation in this order:

1. **`theme.ts`** — port every CSS variable to a typed theme object. Strict types, no `any`. The DS color tokens and typography scale go here verbatim.
2. **Font loading** — wire up Cormorant Garamond + Instrument Sans via `expo-font`. Block app render until fonts are loaded so titles don't flash in a fallback serif.
3. **Safe area + layout primitives** — `<Screen>` component that wraps `SafeAreaView` + the header chrome (so individual screens just render their content).
4. **Navigation skeleton** — React Navigation (or Expo Router) with the bottom tab navigator (Home / Bookings / Messages / Account) and a stack navigator for inner pages.
5. **Global components from the reuse map** — `<PageTitle>`, `<BackLink>`, `<Card>`, `<CategoryCard>`, `<StatusBanner>`, `<Chip>`, `<ChipGrid>`, `<TextareaCard>`, `<DateCard>`, `<ViewSwitch>`, `<PickerButton>`, `<Modal>` (centered + bottom-sheet variants), `<Button>` (primary / secondary / destructive / text), `<SuccessCheck>`. Build these once, reuse everywhere.
6. **Service layer + repository layer** — `bookingService`, `dogService`, `reportService`, etc., with corresponding repositories that call into Supabase. Screens never touch Supabase directly.
7. **Then start porting screens.** Home first (most patterns appear there), then Bookings, then dog profile, then booking flows, then pre-home flow.

Each ported screen should hit the reuse-map components — if a screen needs something that doesn't exist as a component yet, that's a sign the global component layer is missing something. Add the component first, then use it.

### Things to watch for during the port

- **Sticky header on a `FlatList` requires `stickyHeaderIndices` AND the header has to be the first item in `data`.** This is non-obvious and easy to get wrong.
- **`<Modal>` on Android has different default behavior** than iOS. Always test on both. The Android back button needs `onRequestClose`.
- **Keyboard avoidance** — when a `<TextInput>` is focused, the keyboard pushes the layout. Wrap forms in `<KeyboardAvoidingView>` with `behavior="padding"` on iOS, `"height"` on Android. The HTML prototypes don't have to deal with this; the RN app does.
- **Image loading** — RN's `<Image>` doesn't lazy-load by default and doesn't share the browser's image cache. Use `expo-image` or `react-native-fast-image` for performance on lists of dog photos.
- **Text rendering** — RN text doesn't inherit styles from parent `<View>`. Every `<Text>` needs its own style. Build a `<Body>` / `<Title>` / `<Label>` set of typed text components that wrap `<Text>` with the correct DS styles.
- **`accessibilityRole`, `accessibilityLabel`, `accessibilityHint`** — these replace ARIA attributes. Set them deliberately. Icon-only `<Pressable>` always gets `accessibilityLabel`.
- **`testID`** — RN's equivalent of test selectors. Add to anything a test will need to query.

