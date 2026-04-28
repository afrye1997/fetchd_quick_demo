# NWA School for Dogs — Design System v2

_Last updated: April 28, 2026_
_Replaces: nwa-design-system.md (v1)_

This is the authoritative design reference for the NWA client app. Any new page or component should be built from this spec. If a rule here conflicts with older screens, the new rule wins.

---

## Changelog — April 28, 2026

### Bookings → Past: photo only on the stack front
In the Past view's weekly fanned-card stacks, the dog's photo now appears **only** on the front card of each closed stack. The 1–2 back cards behind it are bare white rectangles with their colored borders, just enough to signal "there are more reports here." When the user taps a stack to expand it, the strip of session cards that opens below has **no photo** on each card either — just the colored type-strip on the left edge plus name, date, type label, and metric dots.

Why: the photo on the front card is enough identification when the stack is closed; once expanded the photo on every card is redundant since the user has already committed to one dog. Removing the duplicated images saves ~86 KB per page load.

### Bookings → Past: stack-front lift on expand
When a stack expands, the front card now translates `(2px, 14px)` and rotates 2deg with a deeper shadow (`0 8px 16px rgba(33, 53, 106, 0.18)`), as if pulled out of the deck and laid down in front of the spread strip below. Replaces the previous whole-stack `translateY(-3px)` lift, which fought against the new "front card drops down" motion language. A `margin-bottom: 14px` on the expanded state makes room below so the lifted card doesn't crowd the strip cards. Transition uses Apple's spring curve `cubic-bezier(0.32, 0.72, 0, 1)` over 0.22s, with box-shadow added to the transition list so the elevation eases in alongside the motion.

### Bookings → Past: collapsible weeks (5-week accordion)
Past view now goes back 5 weeks (was 3). Only the latest week is expanded by default; weeks 1–4 start collapsed. Each week header is now a real `<button>` with a small chevron at the right edge that rotates -90° when collapsed. Tapping the header toggles the week's stacks visible/hidden. When a week collapses, any stacks inside it that were expanded are auto-collapsed too so reopening is predictable.

### Dog profile: 2-column tile grid + Apple-style section cards
The Overview and Care Notes tabs no longer stack sections vertically as full-width cards. They are now **2-column tile grids** (`grid-template-columns: 1fr 1fr; gap: 12px`). Each section is a square-ish tile (96px min-height) with the colored category icon centered up top and the uppercase label centered below — a chevron is hidden in tile state since the entire tile is the affordance.

Sections themselves received an Apple Settings-flavored upgrade: section IS the card now (white bg, soft shadow `0 1px 2px / 0 4px 16px`, 14px corners), accent stripe moved from inner `.card::before` onto the outer `.section::before` so it persists when the body collapses, and the open/close animation uses `max-height` + `opacity` transitions on the spring curve `cubic-bezier(0.32, 0.72, 0, 1)` over 0.42s. Iconography slightly larger (28×28 bubbles, 14×14 glyphs), labels bumped from 10px / 0.12em tracking to 12px / 0.06em for a more legible Settings-cell feel.

### Dog profile: section detail opens as a centered modal popup
Tapping a section tile no longer expands the section inline. It opens a **centered card modal** (new `.modal-card-centered` CSS variant) sized to its content, scaled-in via a 0.26s overshoot easing. Modal has its own header showing the section title in italic Cormorant Garamond + a small × close button. Three ways to dismiss: tap ×, tap the dimmed backdrop, or press Escape.

The content `.card` element from the section is **moved** (not cloned) into the modal body when opened, then moved back to its original DOM position when closed. This preserves IDs and pre-attached event listeners on inner buttons (e.g., `latest-report-btn`, `data-open-modal` triggers, etc.) so they keep working without re-wiring. A small CSS override (`.modal-section-body .card { max-height: none !important; opacity: 1 !important; ... }`) ensures the relocated card displays fully even if `is-collapsed` remains on the source section.

### Dog profile: hero restructured (vertical stack, large photo)
Profile hero now stacks vertically with everything centered: 140×140 circular photo on top with a 3px white inner ring and a softer drop shadow (`0 6px 24px rgba(33, 53, 106, 0.18)`), then dog name in italic Cormorant Garamond at 32px, then the breed/age line at 13px muted grey. Replaces the previous side-by-side row layout with the small 56px photo. The bigger photo gives the dog real visual presence on their own profile page.

### Dog profile: "Full history" links removed from section headers
The "Full history" link button that sat at the right edge of every section header has been removed across all five service sections. Section headers are now pure tap-to-toggle rows. Cleaner, more uniform with the simpler Care Notes sections that never had a link.

### Dog profile: Reports tile (new, 2nd Overview tile, pastel pink)
A new sixth tile has been added to the Overview tab grid called **Reports**, positioned as the 2nd tile so it pairs with School Progress in row 1 of the 2-col grid (the two "how is my dog doing" tiles sit side-by-side). Pastel pink accent: new tokens `--accent-pink: #f4b6c8` and `--accent-pink-dark: #b85a7a`. Pink left-edge stripe, pink-tinted icon bubble (`rgba(244, 182, 200, 0.35)` with `--accent-pink-dark` glyph color).

Modal contents (top to bottom): primary "View Latest Report" navy gradient button → secondary outlined "View all" button → "Recent reports · last 7 days" label (italic Cormorant Garamond italic on the "· last 7 days" portion at lower contrast) → horizontal scroller with **7 most recent report cards** in the canonical Bookings → Past visual language, scoped to `.rep-*` classes (`.rep-strip-card`, `.rep-strip-name`, `.rep-metric`, `.rep-dot`, etc.) so it doesn't collide with the bookings page's `.rs-strip-card` namespace → a `scroll →` hint flush-right that fades when the user reaches the last card.

The previous awkward placement of report-card buttons inside the School Progress section's body has been removed; School Progress is now purely about the curriculum tracker, and Reports owns reports.

Full spec lives in **Key Components → Reports tile**.

### Index page: scroll hint extended to announcements row
The scroll-end-aware "scroll →" hint pattern (introduced April 27 for the dogs row) is now also applied to the "This week at NWA School for Dogs" announcements row on `index.html`. CSS was generalized to a shared `.scroll-hint` class that both rows use via grouped selectors, and the JS was refactored to a shared `wireHint(hint, row)` helper that any horizontal-scroll row can opt into via a one-line `<div class="scroll-hint" data-target="...">`.

### Process learning: regex moves on nested HTML need comment-marker anchors
When using regex-based block moves on nested HTML, prefer comment-marker anchors (`<!-- X -->` ... `<!-- Y -->`) over generic structural patterns like `</div></div></div>`. Generic structural patterns can match the wrong nesting level (e.g., closing the inner metric div instead of the outer section div), leaving orphan content that DOM-balance checks won't catch. After regex-based block moves, always visually verify section ordering by checking section count + first-line-of-each query — DOM balance counting is necessary but **not sufficient** for structural correctness.

---

## Changelog — April 27, 2026

### Inline back link (replaces circular back button)
Back navigation on inner pages no longer uses a 40px circular button sitting in its own row above the title. The new pattern is an **inline back chevron** that sits flush to the left of the page title on the same horizontal row — no circle, no border, transparent background, just the chevron. This is the canonical way to go back from a sub-page across the entire app going forward.

Why: cleaner visual hierarchy, less chrome competing with content, gives the title more presence, matches the iOS-style left-flush back affordance most users already pattern-match. The standalone circular back button was over-designed for what is fundamentally a one-icon utility.

Applied first to `dog-add.html`. To be retrofitted onto other inner pages (dog profile, dog manage, booking flow steps, etc.) as those pages are next touched. New full spec lives in **Key Components → Inline back link**.

### Scroll hint hides at end-of-scroll
Horizontal-scroll rows use a small uppercase **"scroll →"** affordance positioned flush-right below the row. The hint is now scroll-position-aware: it fades out when the user reaches the rightmost end of the scrollable content (or when content fits the viewport so there's nothing to scroll to), and fades back in when there's more to reveal.

Why: a static "scroll →" prompt that stays visible after the user has already scrolled is at best clutter and at worst a small lie. Tying the hint to actual scroll state makes it a real-time affordance rather than a decoration. It also implicitly answers "is there more?" — the presence of the prompt now means yes, the absence means no.

Applied to **both horizontal-scroll rows on `index.html`**: the dogs row and the "This week at NWA School for Dogs" announcements row. Implemented as a generic `.scroll-hint[data-target="…"]` pattern so any future horizontal-scroll row can drop in a one-line markup addition and inherit the behavior. Full spec lives in **Patterns and Behaviors → Scroll hint (horizontal scroll affordance)**.

---

## Changelog — April 26, 2026

### Page Title canonicalized
Locked the page-title treatment to a single spec: **Instrument Sans, 26px, 700, navy `#21356A`, letter-spacing −0.01em, line-height 1.1**. This matches the existing Bookings, Messages, and Account titles. Earlier DS language said page titles were "serif, 26–28px" — that was outdated and inconsistent with what shipped. New "Page Title (canonical)" section in Typography gives the exact CSS. Inner-page header references updated to point at this single source of truth instead of restating the spec.

Applied to `book-private.html` (Step 1 + Step 2 titles): "Book a private session" and "Private training intake" — dropped serif italic, now match the rest of the app.

---

## Changelog — April 24 late evening session (final)

Major interaction model added: jiggle/delete mode with multi-select. Booking flow routing wired to plus buttons. Section structure cleanups across all 4 program sections.

### Jiggle/delete mode (new pattern, applies to all chip containers)
A reusable interaction for removing items from any chip row, modeled on iOS home-screen app deletion.

**Activation:** any `.btn-row` or `.daycare-btn-row` with a `data-target="<selector>"` attribute is wired by a single JS module. The `−` button toggles `.deleting` on the target container.

**Visual states:**
- **Default (not deleting):** chips render normally
- **Deleting + unmarked:** chip wiggles (`@keyframes chip-jiggle`, ±1.2deg, 0.22s infinite, with `nth-child(2n)`/`(3n)` stagger to avoid sync), hollow red-outlined circle badge top-right (18px, 1.5px solid red border, white fill, no content)
- **Deleting + marked-for-delete:** chip dims to 50% opacity, gets red `text-decoration: line-through`, badge becomes solid red with white minus and a soft red glow (`box-shadow: 0 2px 4px rgba(224, 69, 69, 0.4)`)

**Button row state:**
- Idle: `+` and `−` icon buttons visible, navy theme (32×32, circular)
- Deleting: `+` and `−` hidden, navy **"DONE"** pill button visible

**Confirmation modal (`confirmDeleteModal`):**
- Title: `<em>Delete</em> sessions?` (italic on "Delete")
- Message: "The following N sessions will be removed:" (singular variant for N=1)
- Body: a `.confirm-delete-list` boxed area (`var(--bg)` background, 1px border, 10px radius, max-height 220px scrollable) with `.confirm-delete-list-item` rows — each has a small filled-red circular minus badge before the date text
- Footer: gray **CANCEL** + red **DELETE** buttons. Cancel keeps user in jiggle mode with marks intact (so they can adjust). Delete animates out all marked chips together (scale 0.5 + opacity 0, 0.25s) then exits jiggle.

**Wired sections:** all 4 program containers — `.section.school .prev-chips`, `.section.daycare .daycare-dates`, `.section.private .prev-chips`, `.section.group .prev-chips`.

### Plus button routing (school + daycare only)
School and Day Care `+` buttons navigate to `booking-flow.html`. Private and Group `+` buttons stay no-op for now (those programs have separate scheduling not yet built). Detection is by `.section.school` / `.section.daycare` class on the button's nearest section ancestor.

### Add/remove buttons unified to navy theme
Earlier pattern had green `+` and red `−`. Now both are the same navy theme:
- `border: 1px solid rgba(33, 53, 106, 0.25)`, `color: var(--navy)`, `background: var(--bg)`
- Active: `transform: scale(0.92)` + `background: rgba(33, 53, 106, 0.08)`
- This avoids confusing add/remove with success/danger semantics — they're both edit operations.

The earlier proposed combo button (`+ | −` in a single pill) was tried briefly and **reverted**. Two separate buttons are clearer and the user explicitly preferred them.

### School Progress section restructure
- Removed "Current: <Program>" title row entirely (program name now lives only in the 5-step tracker)
- Removed leading 8px navy dot (`.current-dot`) — was visual clutter
- Removed "See more" button — routed nowhere meaningful
- New "REPORTS" mini-label (gold-dark uppercase 10px letter-spaced, but navy in school card via `.section.school .mini-label` override) + ⓘ info icon button (still opens curriculum modal)
- "Latest report card" + "View all" buttons sized to their content (not `flex: 1` stretched), wrap to next line if needed
- Old generic "Report Cards" ghost button removed (View all replaced its function)

### Day Care section
- "This month / 8 visits" → **"Credits / 8 visits left"** (matches credit-system framing in booking flow)
- Section header link "See all" → **"Full history"** (consistent with other sections)
- `+/−` button row repositioned to **directly underneath the Upcoming dates** (above the photo carousel)

### Private Lessons section
- Section header gets **"Full history"** link
- **Focus row moved above Upcoming row** (was below)
- New `.info-value.lavender` modifier — applied to Focus value, renders in `var(--accent-purple)` bold
- Replaced "Manage Private Lessons" button with separate +/− icon buttons + Done

### Group Lessons section
- Section header gets **"Full history"** link
- Replaced "Manage Group Lessons" button with separate +/− icon buttons + Done

### Curriculum modal
- Removed the bottom "GOT IT" button — modal now ends after the skills list. User closes via × top-right. Cleaner; one fewer tap target on a read-only surface.

### Hash-based view routing on bookings page
Added to `bookings-page.html`: if `window.location.hash === '#past'` on load, programmatically click the Past view tab. Used by the new "View all" button in the dog profile reports row to deep-link into the report card feed.

### Sized-to-content buttons (CSS pattern)
For the reports button row: switched from `flex: 1` (stretches buttons full width) to a flex-wrap container with no flex grow on buttons. Buttons hug their content; gracefully wrap to a second line if the row gets crowded. This is the right default for chip-like action buttons.

### Earlier in this session (preserved here for chronology)

**School program rename — locked.** The 5-step school progression is the actual NWA program catalog: **Foundations → Advanced → Leash Skills → House Manners → Canine Good Citizen**. Each has a curriculum entry in `gen_dog_profiles.py` (tagline, duration, 5 skills with name + description). Source of truth: `SCHOOL_STEPS` in the generator and `PROGRAM_TITLES` in `report-card-all.html`. The URL hash variants `foundation | advanced | looseleash | housemanners | cgc` are implementation-facing, kept as-is.

**Curriculum info modal** — read-only modal pattern (no form fields, no save). Header italic-serif title `<em>{Program}</em> curriculum`. Tagline (Cormorant italic muted 15px). Duration chip (small navy-tinted pill with clock icon). Section label "WHAT'S BEING LEARNED" (uppercase letter-spaced 10px). Skills list with bold name + muted description per row.

**Photo carousel — Day Care section.** Horizontal-scroll row of 110×110 dog photos with `scroll-snap-type: x mandatory`. Each card has the photo + a small caption ("Today · 2:14 PM" etc.). Hidden scrollbars on iOS. Followed by side-by-side actions: **"SEE MORE PICS →"** (gold outline pill) + **"↓ DOWNLOAD ALL"** (navy filled pill with download icon). Both `flex: 1` for equal width.

**Booking page filter chips — clarity fix.** Old behavior: active type-chips took on their category's color (e.g. gold daycare chip). Confused users — mixed "is selected" with "what category". New: **all active filter chips use uniform navy fill**. Colored dots inside each chip stay in category color as the legend. Generalized rule: filter active state = navy fill with white text; colored content (dots/icons) inside conveys category.

**"Latest report card" chip** — restyled from plain underlined text to a navy-tinted pill with document icon + arrow. `padding: 5px 10px 5px 8px`, `border-radius: 999px`, `background: rgba(33, 53, 106, 0.08)`.

---



Program taxonomy formalized, dog profile polish, booking filter clarity fix.

### School program names (LOCKED — source of truth)
The 5-step school progression is the **actual NWA program catalog**, not made-up names:
1. **Foundations** — first-time students, cue basics
2. **Advanced** — reliability on known cues (Stay, Place, Recall foundation)
3. **Leash Skills** — loose-leash walking in the real world
4. **House Manners** — polite dog at home and in public
5. **Canine Good Citizen** — AKC CGC certification prep

Each has a full curriculum entry in `gen_dog_profiles.py`:
- `tagline` (serif italic subtitle, e.g. "Loose-leash walking in the real world")
- `duration` (e.g. "6 weeks · 45 min/session" — note CGC is 8 weeks × 60 min)
- `skills` array of `(name, description)` tuples, 5 per level

The URL hash variants in `report-card-all.html` remain `foundation | advanced | looseleash | housemanners | cgc` — implementation-facing, not user-visible.

### Filter chip active state (critical clarity fix)
Old behavior — confused users: when active, type filter chip backgrounds became the type's color (e.g. gold for daycare). This mixed "is selected" signal with "is this category" signal.

New behavior: **all active filter chips use uniform navy fill**. The small colored dot inside each chip stays in its category color as the LEGEND showing what each filter maps to.

Concretely for `.type-chip`:
- Inactive: white background, 1.5px navy-pale border, muted text, colored dot visible
- Active: `background: var(--navy)`, white text, no border change, colored dot retains category color + subtle white ring (`box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4)`)

This rule generalizes: **any filter chip active state = navy fill with white text**. Colored content (dots, icons) inside the chip conveys category; fill state conveys on/off.

### Add/remove icon buttons (dog profile program sections)
New small circular icon buttons for adding or removing sessions directly from a program card:
- 32×32px, `border-radius: 50%`, 1px border
- Icon text: `+` or `−`, Instrument Sans 700, 16px
- Green variant: `color: var(--accent-green)`, border `rgba(74, 138, 106, 0.3)` — for "add"
- Red variant: `color: var(--accent-red)`, border `rgba(224, 69, 69, 0.25)` — for "remove"
- Active state: `transform: scale(0.92)` + subtle tinted background

Used in School Progress row (`REPORT CARDS  +  −`) and Day Care row (`PHOTOS  +  −`). Replaces the earlier generic "Manage" button in these two sections.

### "Latest report card" chip (dog profile — School Progress)
Was: plain underlined text link below "Current: Leash Skills".
Now: proper navy-tinted pill chip with document icon on the left and arrow on the right.
- `padding: 5px 10px 5px 8px`, `border-radius: 999px`
- Background `rgba(33, 53, 106, 0.08)`, border `rgba(33, 53, 106, 0.15)`
- Navy text, Instrument Sans 600, 11px
- 12×12 document icon (file-text SVG stroke), 13px arrow `→` at 60% opacity

### Current program row — structure change
- Removed the leading 8px navy dot (`.current-dot`) — visual clutter in a row that already had strong typography
- Removed the "See more" button — routed nowhere meaningful
- Added a small `ⓘ` info icon button (22×22, circular, navy-tinted 8% bg) next to the program title
- Info icon opens the **curriculum modal** (see next entry)

### Curriculum modal (read-only info modal)
New modal pattern for purely informational content (no form fields, no save action):
- Same slide-up-from-bottom backdrop and card as edit modals
- Header: italic serif title in the format `<em>{Program Name}</em> curriculum`
- Tagline: Cormorant Garamond italic, 15px, muted — one-line subtitle
- Duration chip: small navy-tinted pill with clock icon, e.g. "⏱ 6 weeks · 45 min/session"
- Section label: "WHAT'S BEING LEARNED" (uppercase, letter-spaced, 10px, navy-dark)
- Skills list: each a card with bold name + muted description, 12px gap, slight `var(--bg)` fill with 1px border
- Footer: single full-width "GOT IT" navy button (no Cancel — nothing to discard)

Pattern applies to any future "explain this" / "about this" popovers in the app.

### Opened via data-open-modal
All modals (edit and info) share the same open mechanism: `data-open-modal="modalId"` attribute on any button, handled by one shared event listener. No custom JS per modal. `data-close-modal` on Cancel/Save/Close/Got it buttons.

---

## Changelog — April 24 evening session

Dog profile pages built, new color token, logo handling documented, index.html consolidation.

### New color token: `--accent-purple`
For Private Lessons accents (section header bubble + stripe).

| Token | Hex | Use |
|---|---|---|
| `--accent-purple` | `#7a5bc4` | Private Lessons |

### Expanded color mappings
- `--accent-green` (`#4a8a6a`) now also indicates **Group Lessons** accent + **Vaccine: Up to date** status
- `--accent-amber` (`#d68a3a`) now also indicates **Vaccine: Due soon** status
- `--accent-red` (`#e04545`) now also indicates **Vaccine: Expired** status

### Section header with accent stripe + icon bubble (dog profile overview)
Used at the top of each program section in the dog profile Overview tab:
- 3-4px colored accent stripe along the top of the section card (program color)
- 28×28px circular "bubble" with tinted background of the program color (e.g. `rgba(33, 53, 106, 0.1)` for navy)
- Small icon/emoji inside the bubble
- Section label next to it in the program color, uppercase, 11px, `0.14em` letter-spacing, 700 weight

### 5-step progress tracker (dog profile — School Progress)
Horizontal row of 5 dots with connecting lines.
- Completed dots: filled navy
- Current dot: filled navy with subtle pulse/glow
- Upcoming dots: outlined navy at 30% opacity
- Connecting lines: navy at 30% (completed) or 15% (upcoming)
- Labels below each dot: 8px, muted, uppercase

### Circular stat (dog profile — Day Care count)
Round chip, ~56px diameter, tinted gold background, with:
- Large gold-dark number centered
- Tiny label below ("visits")

### Info row pattern
Label left (muted uppercase letter-spaced, ~10px), value right (Instrument Sans bold, 12px). For single facts like `Upcoming · Apr 30` or `Focus · Recall training`.

### Chip row pattern
Horizontal scrollable row of small colored chips for dates or tags:
- Label above the row ("Upcoming" / "Previous"), muted uppercase
- Chips: type-colored dot + short text, inline-flex, background tinted, no border

### Compact pill button variant
For secondary actions inside cards (Report Cards, Manage, Photos, etc.):
- Same typography as regular CTAs (Instrument Sans 700, 12px, `0.14em`, uppercase)
- Smaller padding (`8px 14px`)
- Solid navy background, white text
- Displayed centered or in a tight row, not edge-to-edge

### Vaccine status pill
Small inline pill next to each vaccine name:
- Background: rgba version of status color (green/amber/red) at ~15% opacity
- Text: full-opacity status color
- Typography: Instrument Sans 700, 9-10px, uppercase, `0.12em` letter-spacing
- Labels: `UP TO DATE` / `DUE SOON` / `EXPIRED`

### Hospital block (dog profile — vaccines section)
Below the vaccine list:
- Hospital name (Instrument Sans 700, 13px)
- Address as clickable link → Google Maps (`https://www.google.com/maps/search/?api=1&query=...`)
- Phone as clickable link → `tel:`
- Links rendered in navy, underlined on hover, with `📍` / `📞` prefixes

### Modal popup pattern (slide-up bottom sheet)
Used for all care-note edits (Add Medication, Add Vaccine, Edit Hospital, Edit Feeding, Add Note). Specs:
- Backdrop: `rgba(33, 53, 106, 0.32)` with 5px blur, z-index 200, full-screen overlay
- Card: slides up from bottom, `max-height: 85vh`, rounded top corners (20px)
- Background: white, border: none, shadow above only
- Header: italic Cormorant serif title (e.g. `<em>Add</em> Medication` — one key word in italic), close X button top-right
- Body: scrollable form fields (text input, select, textarea all matched style)
- Footer: sticky, two buttons side-by-side — Cancel (secondary, muted) + Save (primary, navy filled)
- Open via `[data-open-modal="X"]`, close via backdrop click OR `[data-close-modal]`
- Body scroll is locked (`overflow: hidden` on `<body>`) while modal is open
- Save in prototypes is no-op (closes modal; no backend wired)

### Form field styles (inside modals)
- Label: Instrument Sans 600, 11px, uppercase, `0.08em` letter-spacing, muted color, 6px below value
- Input/select/textarea: 1.5px border `var(--border)`, 8px radius, 10px 12px padding, Instrument Sans 400, 14px
- Focus: border turns navy, no default blue glow
- Select uses native dropdown (no custom picker yet)

### Header logo height change
**`.header-logo` bumped from 36px to 44px.** More prominent brand mark; still fits within the sticky header's 48px safe-area-inset minimum. Img fills height with `width: auto`.

### Logo handling workflow (NEW — formalized)
Problem encountered: source PNG from project files is typically RGB mode (no alpha channel), with pure-black corners rendering as visible dark rectangles in browsers. The Anthropic image viewer misleadingly renders pure black as transparent, creating a false sense that the file has transparency.

**Canonical fix workflow:**
1. Load PNG with Pillow: `Image.open(path).convert('RGB')`
2. For each pixel: if brightness (avg of RGB) < 15 → set alpha to 0 (transparent background). Else → keep pixel color, alpha = 255 (opaque artwork).
3. Save as RGBA PNG, base64-encode, write to `/home/claude/logo3_datauri.txt`.
4. Run `/home/claude/fix_logo.py` to replace the img `src` in all 10 HTML files.
5. **Do not trust Chromium headless preview** for PNG transparency — verify on iPhone.

### Chromium headless warning
Added to collaboration patterns: Playwright's Chromium headless does not reliably preview iOS Safari rendering of PNG base64 data URIs. If a headless screenshot shows a dark rectangle but the iPhone renders the logo cleanly, trust the iPhone and stop iterating on the headless output.

### index.html consolidation
`index.html` is now an exact copy of `landing-page.html` (GitHub Pages serves it by default at the root URL). All 9 other HTML files have their Home-tab and back-button links updated from `landing-page.html` → `index.html`. `landing-page.html` is kept as a backup with its own internal links unchanged (self-consistent).

---

## Changelog — April 23 session

New patterns built on top of v2. Source of truth for these is the HTML, not yet back-merged into the full spec below. When implementing, refer to the prototypes for exact values.

### Calendar day availability dots
Small colored dot under each calendar number, capacity-based:
- **Green** (`--accent-green`, `#4a8a6a`) — all selected dogs can attend
- **Amber** (`--accent-amber`, `#d68a3a`) — some can, some can't (tap → dog picker modal)
- **Red** (`--accent-red`, `#e04545`) — no dogs can attend, day is un-tappable

Future: once enrollment/program data is wired, red also covers "dog not enrolled in this program."

### Pay-as-you-go credit state
Three-state credit display for each dog+type:
- **Positive** — muted grey text, type-colored dot (navy/gold)
- **Negative, unaddressed** — red text + red dot, blocks "Let's Book!" CTA
- **Pay-as-you-go** — amber text with underlined inline "add credits" link, dot stays type-colored. Does NOT block the CTA.

Critical rule: in payg state, the dot preserves its type color (navy for school, gold for daycare). Only the text goes amber. This keeps the type signal readable even when warning about credit status.

### Credits modal — three-way action
Replaces the previous Purchase/Cancel two-button modal. Stack order top-to-bottom:
1. **Purchase & Add Credits** (primary, navy filled) — buy a package, exits payg state
2. **Pay as you go** (amber outlined) — accept negative credits, booking stays, dog enters payg state
3. **Cancel** (secondary, muted) — revert the pending booking that triggered the modal

Modal header includes a school/daycare type toggle so user can buy either type from the same modal regardless of which shortage triggered it.

### Recurring booking inline picker
Chip above calendar: `↻ Book recurring days`. Expands inline (not modal) into a panel with:
- Weekday pills (S M T W T F S) — multi-select
- Date range inputs (from / to)
- Apply button (disabled until at least one weekday picked)

Batch-books matching days; skips red-capacity days silently; uses eligible-subset logic on amber days.

### Yellow-day dog picker modal
Triggered by tapping an amber calendar day. Centered modal listing the selected dogs, each with:
- Checkbox (eligible dogs pre-checked up to capacity)
- Status line ("6 school credits left" or "No spot left for this day" for ineligible)
- Can't check more dogs than the day's remaining capacity allows

### Date chips — color coded by type
Chips in review cards and confirmed view:
- **Day School** — navy filled (`--navy`), white text
- **Daycare** — gold filled (`--accent-gold`), dark-gold text (`--accent-gold-dark`)

Supersedes any earlier spec describing neutral/outlined chips.

### Split credit counters
Review cards show school and daycare credits on **separate lines**, each with its own type-colored dot. Never combined into one "X credits left" line.

### Verdict card (report card) fixes
- Removed 4px top accent stripe (`.verdict-card::before`) — was visually redundant with the in-card progress bar
- Removed `overflow: hidden` on `.verdict-card` — was clipping cursive Caveat headline ascenders
- Headline `line-height: 1 → 1.1` — Caveat needs more vertical breathing room than sans-serifs
- Pending state ("Working on it") now uses Caveat at full size in muted color, NOT Cormorant italic. The verdict headline is one component with color variants, not two different typographic treatments.

### CTA typography — consistent across all buttons
All uppercase button CTAs use the same typographic spec:
- Font: Instrument Sans, `700` weight
- Font size: `12-14px`
- Letter-spacing: `0.14em`
- Text-transform: `uppercase`

Applies to: "LET'S BOOK", "ADD TO CALENDAR", "DONE", "PURCHASE & ADD CREDITS", "PAY AS YOU GO", "CANCEL", "ADD TO BOOKING". No mixing of Caveat italic or Cormorant serif inside button labels.

---

## Platform & Target Device

**This is a mobile-first design system.** All screens are designed for a single mobile viewport — no tablet, desktop, or web responsive behavior at this stage.

### Target device: iPhone 17 Pro

| Spec | Value |
|---|---|
| CSS viewport width | **402px** |
| CSS viewport height | **874px** |
| Device pixel ratio | 3x |
| Physical resolution | 1206 × 2622 pixels |
| Screen size | 6.27" diagonal |
| Corner radius (display) | 46px |

### Why iPhone 17 Pro specifically

It represents a reasonable middle ground for the current generation — narrower screens (older iPhones, iPhone SE) will display with slightly cramped horizontal rhythm but nothing will break. Larger screens (iPhone 17 Pro Max at 440px, Android phablets) will display with a touch of extra breathing room. This is acceptable for a boutique app with a finite user base rather than chasing universal responsiveness.

### Prototype rendering

HTML prototypes render inside a Figma-style device frame — a dark canvas background with a titanium iPhone bezel, Dynamic Island, and 46px rounded screen corners. The app content lives in a 402 × 874px scrolling container. This lets designers and stakeholders see the app proportions without needing to open device simulators or resize browser windows.

Production builds (React Native) will use the full device viewport; the device frame is a prototyping affordance only.

### Safe areas

- **Top:** 46px (accommodates Dynamic Island + status bar area)
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

```
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

/* Category/accent colors */
--accent-gold:       #d4a64a;   /* daycare, classes, attention/new, warning */
--accent-green:      #4a8a6a;   /* billing, success, "all available" */
--accent-purple:     #9b7ed4;   /* private lessons, events */
--accent-red:        #e04545;   /* urgent, destructive, errors, notification badges */
--accent-terracotta: #c47a5a;   /* Board & Train sessions */
--accent-teal:       #5a9a9a;   /* Group Class sessions */
--accent-pink:       #f4b6c8;   /* Reports tile (dog profile) — pastel rose stripe */
--accent-pink-dark:  #b85a7a;   /* Reports tile — deeper rose for icon + label glyph */

/* Shadows */
--shadow-sm: 0 1px 2px rgba(33, 53, 106, 0.04);
--shadow-md: 0 4px 16px rgba(33, 53, 106, 0.08);
--shadow-lg: 0 12px 32px rgba(33, 53, 106, 0.12);
```

### Color usage rules

- **Navy** = brand, primary UI text, primary CTAs
- **Gold** = daycare category + classes + "attention" signals. Context disambiguates.
- **Green** = billing + success + positive state
- **Purple** = private lessons + community events
- **Red** = urgent-only. Never decorative. Reserved for closures, errors, destructive actions, and notification count badges.
- **Pink** = Reports tile only. Reserved for the Reports section accent on dog profile pages — distinct from any session type, so it reads as "this is a different kind of thing" (a meta-summary tile, not a service category).

### Category-to-color mapping

When a piece of content has a category, it gets a colored left edge on its card:

| Category | Color | Use case |
|---|---|---|
| Day School | navy `#21356A` | Day School sessions |
| Daycare | gold `#d4a64a` | Daycare sessions |
| Private Lesson | purple `#9b7ed4` | one-on-one training |
| Board & Train | terracotta `#c47a5a` | overnight/extended training stays |
| Group Class | teal `#5a9a9a` | structured group training |
| Billing | green `#4a8a6a` | payments, packages |
| Team / School | navy | announcements about staff or the school itself |
| Urgent | red `#e04545` | closures, cancellations, safety |
| Reports (meta) | pastel pink `#f4b6c8` | dog profile Reports tile only — not a session type, signals "summary across all sessions" |

The 5 session types (Day School, Daycare, Private Lesson, Board & Train, Group Class) are the authoritative session categorization and appear together in the Bookings filter chips.

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
| **Page Title** | **26px** | **700** | **sans** | **Top-of-page title on every page (Bookings, Messages, Account, Book a private session, etc.) — letter-spacing −0.01em, line-height 1.1, color `var(--navy)`** |
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

Every page in the app starts with the same page title treatment. Pages reached from a top-level nav tab (Home, Bookings, Messages, Account) AND any deeper page that needs a heading (Book a private session, Add card, etc.) all use this exact spec.

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
- Letter-spacing −0.01em is intentional (slight tightening for the bold weight at this size). −0.02em is acceptable for longer titles like "My Account".
- Color is always `var(--navy)`. Never tinted, never gradient.
- Class names vary by page (`.bookings-title`, `.mp-inbox-title`, `.acc-page-title`, `.page-title`) but the styles must match this spec exactly.

### Italic usage

Cormorant Garamond italics are used **sparingly and intentionally** to emphasize one key word in a title. Examples:
- "3 *sessions* tomorrow"
- "Rachel joins the *team*"
- "*Yappy Hour* social"

Never italicize whole sentences or body copy.

---

## Spacing

**Page frame:** 402px (iPhone 17 Pro viewport width — see Platform & Target Device section)
**Page horizontal padding:** 20px (some sections use 18px or 24px for specific reasons)
**Gap between cards in a scroll:** 12–14px
**Card internal padding:** 14–18px
**Section vertical gap:** 20–24px
**Border radius:** 16–20px for cards, 10–14px for buttons, 50% for circles/pills

---

## Global Chrome — Header and Nav

**These two elements appear on every page in the app. Full stop.** No page is exempt. No variant is allowed. Consistency here is the foundation of the product feeling like one coherent app rather than a collection of screens.

Any new page design must begin by including these two components. Any designer, contractor, or AI tool (Claude Design, Claude Code, etc.) building pages for this product must be told this rule explicitly.

### Required scroll architecture

Because the app lives inside a fixed-size device frame in prototypes (and inside a mobile viewport in production), the scroll container structure matters. Every page uses this structure:

```
.device-frame (iPhone bezel, in prototypes only)
  .device-screen (fixed 402×874, overflow: hidden, position: relative)
    .device-screen-inner (100% × 100%, overflow-y: auto, flex column)
      .header (sticky, z: 30)
      [page content]
      .nav (sticky, bottom: 0, margin-top: auto, z: 20)
    /.device-screen-inner
    [any overlay modals/sheets as direct children of .device-screen]
  /.device-screen
/.device-frame
```

Key principles:
- `.device-screen` clips overflow (prevents modals/sheets from extending the scroll area)
- `.device-screen-inner` is the actual scrolling element
- Header is `position: sticky` inside the scrolling container — pins to top of viewport on scroll
- Nav is also `position: sticky` with `bottom: 0; margin-top: auto` — pushes to bottom of flex column and pins there on scroll
- Overlay elements (bottom sheets, modals, toasts) are siblings of `.device-screen-inner`, not inside it, so they're positioned relative to `.device-screen` and not affected by scroll

### Global Header (sticky top)

Sits at the top of every page, pinned during scroll.

**Positioning:**
- `position: sticky; top: 0; z-index: 30`
- Frosted glass: `rgba(238, 241, 248, 0.88)` + `backdrop-filter: blur(16px)`
- Hairline below: `border-bottom: 1.5px solid rgba(33, 53, 106, 0.12)`
- Padding: 46px top (iOS status bar safe area), 18px sides, 14px bottom

**Content (left to right, single row):**
- **Logo (left):** horizontal NWA logo PNG at `/nwa-logo-horizontal.png`. Navy ink on transparent background. Displayed at 36px tall, width auto-scales. Reconstructed from logo1.jpg by splitting the dog-head circle and wordmark and composing horizontally.
- **Date (flex 1, right-aligned):** today's date in abbreviated format ("Tue · Apr 22"). Styling: 10px, 600 weight, `var(--muted)` color, uppercase, 0.12em letter-spacing, right-text-align.
- **Bell button (right):** 38px circle, white bg, 1px `var(--border)` border. Contains a 17px bell icon with navy stroke. Includes a numeric badge in the top-right corner showing unread count.

**Bell badge:**
- `background: #e04545` (red), white text
- `min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px`
- 2px border in page background color (`var(--bg)`) to create a halo
- 10px font, 700 weight, white
- Hidden entirely when count is 0
- Subtle red shadow for lift

### Bottom Nav (sticky bottom)

Sits at the bottom of every page, pinned during scroll.

**Positioning:**
- `position: sticky; bottom: 0; margin-top: auto; z-index: 20`
- (`margin-top: auto` is what pushes it to the bottom of the flex column parent when content is short)
- Frosted glass: `rgba(255, 255, 255, 0.92)` + `backdrop-filter: blur(20px)`
- Top hairline: `1.5px solid rgba(33, 53, 106, 0.12)` — matches header's bottom border exactly
- Padding: 8px top, 0 sides, 18px bottom (safe area for iPhone home indicator)

**Structure:**
- 4 items, always: **Home / Bookings / Messages / Account**
- `.nav-inner` uses `display: flex; align-items: stretch`
- Each `.nav-item` is `flex: 1` so items divide the width equally into cells (auto-centering)
- `min-height: 58px` per item
- Vertical dividers between items: `.nav-item:not(:last-child)::after` — 1px navy at 10% opacity, inset 10px top/bottom so dividers don't touch the nav's edges

**Why 4 tabs, not 5:** Earlier designs included a Reports tab as the fifth item. We removed it because reports are not a distinct user activity; they're *content produced by sessions*. Past sessions and reports are the same content viewed differently, so both live inside Bookings (under the Past toggle). Keeping the nav at 4 tabs improves cell breathing room and reduces user decision fatigue. The bell button in the header handles notifications for new reports.

**Item content:**
- 22px icon (centered in a flex wrapper) + 5px gap + 10px label
- Active state: filled navy icon, 700 weight label, navy color
- Inactive state: stroked muted icon, 500 weight label, muted color
- Active is determined per-page — only one item is active at any time

**Pages must leave padding:**
Because the nav is sticky and takes up visual space, no page content should be hidden behind it. Ensure the last content element (whether it's a CTA, a card list, or anything else) has its own `margin-bottom` or `padding-bottom` of at least 20–24px to provide breathing room above the nav.

### Inner-page headers (below Global Header)

**Use only when needed.** Pages reached from a top-level nav tab (Home, Bookings, Messages, Account) do NOT get an inner page header with back button + title. The global nav already tells the user where they are; a title and back button here are semantic pollution.

Pages that earn an inner-page header:
- Deep destinations reached from another page (e.g., a dog profile reached from the home screen)
- Modal-like detail views where "back" is meaningful
- Settings subpages, help articles, etc.

When used, the inner header:
- Sits immediately below the Global Header
- Not sticky (scrolls with content)
- Contains an **inline back chevron** flush-left to the page title on the same row (see **Inline back link** spec below). Page title uses canonical Page Title spec — Instrument Sans 26px 700 navy.
- Padding: ~22px top, 20px sides, 12px bottom

> **Note:** The previous circular 40px back button has been retired. Do not use it on new pages. See changelog April 27, 2026.

This stacking (Global Header on top, Page Header below) is acceptable and matches iOS conventions like Mail's thread view. Resist the temptation to merge them — they serve different purposes.

### Failure modes to watch for

- **Scroll container confusion:** if you see modals or sheets anchored to the wrong parent, check that they're outside `.device-screen-inner` (the scroll container).
- **Sticky nav not sticking:** ensure the parent `.device-screen-inner` is the flex column with `height: 100%`, not `min-height: 100%`. The nav needs a bounded flex container to stick within.
- **Sticky header bleed:** if content shows through the header on scroll, check the `backdrop-filter: blur` is applied and the `background` is semi-transparent (not fully opaque — breaks the frosted effect).
- **Horizontal scroll rows auto-scrolling on load:** if any row has `scroll-snap-type` set, Safari may auto-snap to a non-zero position. Either remove the snap or explicitly reset `scrollLeft = 0` on page load.

---

## Key Components

### Page Header (inner pages only)

Sits **below** the Global Header on non-home pages. Provides navigational context.

- **Inline back chevron** flush-left of the page title on the same horizontal row (see **Inline back link** below)
- Page title uses the canonical **Page Title** spec (Instrument Sans 26px 700 navy, see Typography section)
- Optional italic Cormorant Garamond subtitle on its own line below the title row
- Padding: ~22px top, 20px sides, 12px bottom
- **Not sticky** — scrolls with content (global header stays pinned; page header is part of the content)

### Inline back link

The canonical back-navigation affordance for any inner page. Replaces the previous circular 40px back button. Sits flush-left of the page title on the same row, icon-only, no circle, no border, transparent background — pure chevron.

**Visual spec:**
- 32×32 transparent button (tap target), 22px chevron icon inside
- Stroke color: `var(--muted)` at rest, transitions to `var(--navy)` on `:active`
- On press: `transform: translateX(-2px)` + color shift (subtle nudge-left feedback)
- No background fill, no border, no hover state
- Chevron icon: simple polyline `15 18 9 12 15 6` with stroke-width 2.2, round caps and joins

**Layout:** lives inside a `.title-row` flex container with the page title `<h1>`, `align-items: center`, `gap: 6px`, with a `margin-left: -8px` so the chevron's tap target overhangs the page edge slightly (standard iOS pattern — keeps the title visually flush with content below).

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

**When to use it:** any sub-page that exits back to a parent page (dog profile, dog manage, dog add, booking flow steps, settings subpages, etc.). Reference implementation: `dog-add.html`.

**When NOT to use it:** top-level tab destinations (Home, Bookings, Messages, Account) — those don't get a back affordance because they don't have a parent. Use the global nav instead.

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
- Used for: report cards, announcement cards, session cards, message threads

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
- Right padding: not critical (scroll container)

Formula for centering 3 dogs with a hidden 4th: `left_padding + 3 × circle + 3 × gap = viewport_width`.
Math: `24 + (3 × 110) + (3 × 16) = 402`. The 4th dog starts exactly at pixel 402, so it's invisible until the user scrolls.

**Circle visual:**
- Navy gradient ring, 3px padding between ring edge and inner photo
- 3px white inner border between ring and photo
- Aspect ratio 1:1 (enforced via `aspect-ratio: 1`)
- `.quiet` variant uses grey ring (for dogs with no upcoming sessions)

**Dog name:**
- Cormorant Garamond serif, 16–18px, 500 weight
- Sits below the circle with 10px gap
- Centered under its circle

**Scroll behavior (critical — don't skip):**
- `overflow-x: auto`, `overflow-y: hidden` on `.dogs-row`
- `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` to hide scrollbars
- **Do NOT use `scroll-snap-type: proximity` here.** It causes Safari/WebKit to auto-snap to a non-zero scroll position on load, which makes the 4th dog peek and the first 3 scroll partially off-screen. We learned this the hard way.
- **Always reset scroll position on page load** with JavaScript:
  ```js
  document.addEventListener('DOMContentLoaded', () => {
    const row = document.querySelector('.dogs-row');
    if (row) row.scrollLeft = 0;
  });
  ```
  This is belt-and-suspenders insurance. Without it, some browsers can still shift the initial scroll position.

**Entrance animation (page load):**
- Each circle pops in with a subtle scale-overshoot: `scale(0.88)` → `scale(1.04)` → `scale(1)`
- Cubic-bezier timing: `0.34, 1.4, 0.64, 1` (gentle spring)
- Duration: 0.6s per circle
- Staggered delays across circles: `:nth-child(1) = 0.6s`, `:nth-child(2) = 0.74s`, `:nth-child(3) = 0.88s`, then +0.14s per subsequent dog
- **Static after entrance** — no continuous breathing or pulse. Each dog arrives once, then stays still.
- Hover: scale to 1.03, adds soft shadow
- Active (press): scale to 0.96

**Scroll hint below the row:**
- Bottom-right aligned via `padding: 4px 24px 0; display: flex; justify-content: flex-end`
- Copy: "SCROLL →" (uppercase, 9px, 500 weight, 0.08em letter-spacing, 70% opacity)
- The arrow (`→`) is a separate span with a 2-second horizontal pulse animation: translateX 0 → 3px → 0, opacity 0.6 → 1 → 0.6

**Duplicates in prototype:** The prototype currently shows 6 dogs (Waffles/Lola/Brodie × 2) to demonstrate scroll behavior. In production, the row is data-driven — each client sees only their own dogs. If a client has only 1–3 dogs, the row doesn't overflow and the scroll hint should be hidden via JavaScript (`if row.scrollWidth <= row.clientWidth, hide hint`).

### Up Next card

The functional hero of the home page. Rich composition:
- Top strip: small colored "when" label + radial background gradient + serif headline
- Dog rows (for multi-dog days): avatar + name + session type + time, stacked with dividers
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
- Left edge color bar (4px wide) indicates session type: navy (Day School), gold (Daycare), purple (Private Lesson), terracotta `#c47a5a` (Board & Train), muted teal `#5a9a9a` (Group Class)
- `.session-row` uses flex with 14px gap: 48px avatar + dog info (flex 1) + right-aligned time stack
- Shadow: `var(--shadow-sm)` at rest, `var(--shadow-md)` on hover
- Hover: `translateY(-2px)`

**Content:**
- Dog name (serif, 18px, 500 weight, navy)
- Session type tag in its category color (e.g., `<span class="session-type school">Day School</span>`)
- Meta text: "· with [trainer first name]" (no titles like "Mr." or "Ms.")
- Time val + label on right (e.g., "7:30 AM" / "Drop off")

**Filtering data attributes:** Not required on the element itself — type and dog are derived from the CSS class and text content in JS to keep markup clean. But `data-dog` and `data-type` are fine if you prefer explicit.

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
- Only one container can be open at a time — tapping another card or outside any swipe auto-closes
- Use `touch-action: pan-y` on the card so vertical scroll still works while horizontal gestures are captured

**Language:**
- The button says **"Cancel"** (not "Delete") — sessions aren't deleted, they're canceled. The server handles credit restoration.
- Confirmation dialog title: "Cancel this *session*?" (serif italic on "session")
- Confirmation buttons: **"Keep it"** / **"Cancel session"** — never ambiguous "No/Yes" or "Cancel/Confirm" (would conflict with the word "Cancel" already in play)

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

**Context-aware metrics:** Each session type shows different metric labels — the metrics have to match what a trainer would actually evaluate in that format.

| Session type | Metric 1 | Metric 2 | Metric 3 |
|---|---|---|---|
| Day School | Behavior | Social | Obedience |
| Daycare | Social | Energy | Rest |
| Private Lesson | Focus | Obedience | Confidence |
| Board & Train | Behavior | Progress | Rest |
| Group Class | Focus | Progress | Confidence |

Each metric has 5 dots. Filled dots use `--accent-green`; empty dots use `--border`.

**Excerpt:**
- Short trainer narrative (roughly 1–3 sentences)
- Serif italic (`Cormorant Garamond`, 15px, `font-style: italic`)
- Use `<em>` for one key word to emphasize (breakthrough, proud, role model, etc.)
- Never generic filler ("good session", "did well"). If the trainer can't write meaningfully, the session doesn't get a report that day.

**Footer:**
- Left: photo/video count with a small image icon
- Right: "Read full ›" with hover-animated chevron

### View toggle + Time frame picker row

Used on the Bookings page to switch between Upcoming and Past, and to adjust the time range for both views.

**Layout:**
```
.view-row (flex, gap 10px)
  .view-switch (flex 1, pill-toggle card with Upcoming | Past)
  .timeframe-chip (fixed width, picker button)
```

**View switch:**
- White bg, 1px border, 12px radius, 4px inner padding
- 2 equal cells, active cell has navy bg + white text + small inset shadow
- Inactive cells are transparent with muted text
- Labels: "Upcoming" / "Past"

**Time frame chip (picker button):**
- Single row: calendar icon + value text + down chevron (`⌄`)
- Value text uses 13px, 600 weight, navy
- Calendar icon and chevron at reduced opacity (0.65 and 0.45) so the value text reads as primary
- Hover: chevron shifts down 1px + opacity lifts — confirms "tap opens downward"
- Default label: "Next 30 days" — updates on apply to "Apr 2026" (month mode) or "Apr 1 – May 31" (range mode)

**Why this pattern over a persistent filter row:** The filter area already has dog chips + class-type chips + the view toggle. A full time-frame selector inline would be a fourth row of chrome, pushing actual schedule content too far down. The picker button hides the complexity behind a single tap while still making the current state visible at a glance.

### Time frame picker sheet

Opens from bottom when the time frame chip is tapped. Lives as a direct child of `.device-screen` (not inside `.device-screen-inner`) — see "Sheets and modals" below.

**Structure:**
- Backdrop: full-screen at 40% navy overlay + 4px blur
- Sheet: pinned to bottom, `var(--bg)` background, 24px top radius
- Entrance: slide-up via `translateY(100%) → 0` over 0.32s
- 40×4px grey handle at top

**Content flow:**
1. Section label: "SELECT TIME FRAME" (10px uppercase navy)
2. **By Month / Date Range** pill toggle (same visual as view switch)
3. Mode panels (only one visible at a time):
   - **By Month:** Month dropdown + Year dropdown side-by-side, each in its own labeled white card
   - **Date Range:** FROM input + arrow + TO input in a single row, also in labeled white cards
4. Action buttons: **"Cancel"** (grey) + **"Apply"** (navy CTA), flex row

**Date input styling:**
- Native `<input type="date">` styled with transparent bg, inherited font, navy calendar-picker indicator via filter
- Labels "FROM" and "TO" are the same uppercase 9px 700wt style as filter labels

### Context-inline swap vs. navigation

When a top-level nav page has two related modes that share surrounding chrome (filters, header), **swap the body content in place** rather than navigating to a different page. This preserves the user's sense of place.

**Applied to Bookings:**
- "Upcoming" shows the schedule list
- "Past" hides the schedule and reveals a reports feed in its place
- The header, filters, time frame chip, and nav all stay identical
- The FAB ("Book new session") is hidden in Past mode, since you can't book something in the past

**Implementation:**
- Both content elements exist in the DOM
- `.schedule` has a `.hidden` class toggled; `.reports-feed` has an `.active` class toggled
- The active view tab sets the corresponding state
- Filter application (dogs, types, time frame) applies to whichever view is active

Use this pattern any time two content types genuinely share filters and chrome. Don't use it when the content types are structurally different or demand different filter UX.

### Booking Flow

The core product experience. Reached from two entry points: the "Book a new session" CTA on the landing page, and the FAB (+) on the Bookings page. Replaces the Day School booking UX that Gingr handles poorly.

**Architecture: three-view state machine**

The flow lives as three views within a single scope, swapped by state rather than navigated to. All three share the global header and bottom nav; only the view content changes:

1. **Booking main** — dog selection + calendar + review + Book CTA
2. **Credits sheet** (overlay) — triggered only when one or more selected dogs would exceed their credit balance after booking
3. **Confirmed** — success page with all booked sessions grouped by dog

The credits sheet is a bottom sheet overlay on the booking main view, not a separate page. If multiple dogs need credits, the sheet queues them one at a time ("Step 1 of 2 · dogs needing credits") rather than combining into a single multi-dog UI.

**State shape:**
- `mode: 'school' | 'daycare'` — which session type is being booked
- `selectedDogs: Set` — which dogs are getting sessions
- `dates: { dogId: Map<day, mode> }` — per-dog per-date mode picks (each dog has independent date picks, and the mode is recorded per-date so a user can mix school and daycare days for one dog)
- `creditsQueue: []` — dogs that exceed their credits, processed sequentially on Book
- `currentCreditsDog` — the dog whose credits sheet is currently showing

### Booking main view

**Top row:** Page title "Book a *session*" (serif italic on "session") on the left, small round close button (38px) with X icon on the right. No back button — this is a modal-style flow; the close button is the exit.

**Mode toggle** — 2-cell segmented control matching the Upcoming/Past view switch pattern:
- Each tab has a small colored dot + label: "Day School" (navy dot) / "Daycare" (gold dot)
- Active tab fills with its category color: navy background with white text + white dot (school), gold background with dark brown `#4a3816` text + matching dot (daycare)
- Switching mode does NOT wipe previously selected dates — each date remembers its own mode. A user can mix school and daycare dates in a single booking.

**Select dogs** — section label + horizontal pill row:
- Each pill: 28px photo avatar + dog name, 1.5px border, 999px radius
- Active state: navy fill, white text, white avatar border
- Multi-select — tapping toggles each dog independently
- No "all dogs" meta-pill (different from the Bookings page filter) — selection is explicit here because it drives calendar availability and the review section

**Calendar** — the central control. Lives in a white card with 16px radius.
- Month header with title "April 2026" (serif, 18px) and prev/next nav arrows
- Weekday row (Sun–Sat), 9px uppercase labels
- 7-column grid with 2px gaps
- Each cell is 1:1 aspect ratio (avoids layout jank across screen sizes)

**Calendar day states:**
- **Past:** 45% opacity, pointer-events disabled, muted text
- **Available with all selected dogs:** green dot (`--accent-green`)
- **Available with some selected dogs:** yellow dot (`--accent-gold`)
- **Available with no selected dogs:** red dot (`--accent-red`)
- **Selected for school only:** navy background, white number, no dot
- **Selected for daycare only:** gold background, dark brown number, no dot
- **Selected for BOTH** (some dogs school, some daycare on same day): diagonal split `linear-gradient(135deg, navy 0% 50%, gold 50% 100%)`, white number

Tapping a day adds the current mode for every selected dog that's available that day. Tapping again toggles it off for that mode across all selected dogs.

**Legend under the calendar:** three small dot+label pairs explaining the availability colors (green = all dogs, yellow = some dogs, red = no dogs).

### Review by dog (horizontal scroll cards)

After the calendar, a "Review dates by dog" section shows one card per selected dog in a horizontally scrolling row. This is the workhorse UI — it's where users verify their choices and see credit implications.

**Card structure (270px wide, fixed):**
- Top: dog avatar (36px) + name (serif, 18px) + credits line
- Middle: 2-column grid of date chips for this dog, or empty-state copy
- Bottom: row of two action buttons — "Occurrences" (with refresh icon) + "Clear all" (destructive red outline)

**Credits line language rule:**
The credit counter always shows **credits remaining after this booking**, not starting balance. Format: "6 School · 4 Daycare credits left". If booking would take either value negative, the entire line turns red with weight 600 as a warning signal. The math is:
```
remaining = current_credit_balance - (sessions_booked_in_this_mode)
```
This is more useful than showing starting balance because the decision the user is making is about *this booking* — will I have credits after I tap Book? Showing "6 credits" alone leaves that question unanswered.

**Review date chip:**
- Compact flex row with "Apr 25" label + small round remove button (X icon)
- Background `--card`, 8px radius, `--border-soft` border
- 2.5px colored bar at the bottom indicating mode: navy for school, gold for daycare
- The remove button's hover state turns red, clearly signaling destructive action

**Empty state:**
If a selected dog has no dates, the 2-column grid is replaced with: "No dates yet. Tap the calendar above." (serif italic, 14px, in a card-background tile spanning both columns).

**Scroll hint:**
When the card row overflows (more cards than fit on-screen), a small "scroll →" appears at the right of the section label. Hidden when cards fit.

### Book CTA

Full-width gradient button at the bottom of the main view.
- Copy: "Let's *book!*" — the "book!" is serif italic (matches "Book a *session*" at the top for vocabulary consistency)
- School mode: navy gradient (`--navy` → `--navy-mid`), white text, navy shadow
- Daycare mode: gold gradient (`--accent-gold` → `#b88833`), dark brown text `#2a1f08`, gold shadow
- Hover: 2px lift + stronger shadow
- Disabled state when no dates picked across any dog: 45% opacity, cursor not-allowed

On click:
1. Check if any selected dog's dates would exceed their credits in either mode
2. If yes, push those dogs to `creditsQueue` and show the credits sheet for the first dog
3. If no credit issues, go directly to the Confirmed view

### Credits sheet (bottom sheet overlay)

Triggered when at least one dog's bookings exceed their credit balance. Slides up from bottom with the same animation and structure as the time-frame picker sheet.

**Content flow, top to bottom:**
- Drag handle (40×4px grey pill)
- Step indicator (shown only when 2+ dogs queued): "Step 1 of 2 · dogs needing credits" — 9px uppercase muted
- Centered dog avatar (60px with white border and soft shadow)
- Title: "*[Dog name]* needs more credits!" (serif, 24px, italic on dog name)
- Subtitle with inline text link: "Select a package below, or [remove classes] from upcoming bookings." The "remove classes" link is underlined navy — tapping it clears that dog's dates and closes the sheet without purchasing anything.

**Package options** (4 radio buttons as cards):
- 8 classes · $180 · "Best for occasional visits"
- 12 classes · $252 · "Most popular choice" — has a "POPULAR" tag badge in gold at the top-right corner
- 20 classes · $380 · "Best value per class"
- Pay individually · $28 · "Single session charge"

Each option: radio circle on left (empty circle, fills navy when selected with inner dot), package name in serif (18px), description below in small muted text, price on right in sans-serif (16px, 700 weight). Selected option gets navy border and `--card` background.

**Actions:**
- Primary: "Confirm purchase & continue" (navy filled, white text, shadow)
- Secondary: "Cancel" (transparent with grey border)

**Multi-dog queueing:**
After confirming a purchase, if more dogs are in the queue, the sheet closes and re-opens 350ms later with the next dog's avatar and name. Continues until the queue is empty, then the user lands on the Confirmed view.

**"Remove classes" option:**
Tapping this link calls a function that clears that specific dog's pending dates entirely. This is an intentional affordance — sometimes users pick more dates than they realized they'd need credits for, and "just delete the extras" is a cleaner exit than "buy a package I don't need."

### Confirmed view

Lands here after all credit checks pass. Full-page celebratory success state.

**Hero section (centered):**
- Green filled circle (64px) with animated white checkmark — spring entry animation: scale 0.5 → 1.1 → 1.0 with cubic-bezier(0.34, 1.4, 0.64, 1) over 0.5s, 0.1s delay
- Title "*Confirmed!*" (serif italic, 34px)
- Subtitle dynamic: "15 sessions booked for School & Daycare" — count and label (School / Daycare / School & Daycare) update based on what was actually booked
- Legend row: two dots + labels ("Day School" navy, "Daycare" gold)

**"Confirmed sessions" section label** followed by one card per dog.

**Confirmed card:**
- Top row: dog name in serif (20px) on left + counts on right
- Counts show one or two columns: each with a tiny uppercase label ("SCHOOL" or "DAYCARE") + a large serif number below it. School count is navy; daycare count is gold. Only shows columns for modes the dog was actually booked in.
- Horizontal divider (`--border-soft`)
- 2-column date grid below: each date chip shows "Apr 24" + colored dot indicator, with the mode-colored bottom bar matching the review chip pattern

**Actions at bottom:**
- Outlined "Add to Calendar" (secondary) — with calendar icon, offers system calendar integration
- Filled navy "Done" — returns to the booking view with dates cleared (so the user can start a new booking)

### Occurrences (deferred)

The "Occurrences" button in each review card is intended to open a lightweight sheet for recurring bookings — e.g., "Book Waffles every Tuesday and Thursday between Apr 24 and May 15." This pattern is acknowledged in the UI but not yet built out. When implemented, it should:
- Open a bottom sheet with weekday checkboxes + FROM/TO date pickers
- Generate the selected dates for that dog automatically
- Respect dog availability (skip unavailable dates or warn the user)
- NOT require the user to select each date manually on the calendar

### Date chip

Reusable chip component used in booking flow review section, confirmed view, and anywhere else dates need to be shown with mode indication.

**Base:**
- White bg (or `--card` in subdued contexts), 1px `--border-soft`, 8px radius
- 2-column grid by default (`grid-template-columns: 1fr 1fr` in the parent)
- 12px text, 600 weight, navy

**Variants:**
- `with-delete`: includes a round X button on the right (used in review cards — user can remove a pending date)
- `with-dot`: colored dot indicator on the right (used in confirmed cards — visual signal only, no interaction)
- 2.5px colored bottom bar spanning full width — navy for school, gold for daycare
- `failed` (red): used for partial-failure race condition state (e.g., date became unavailable during booking) — coming in future work

### Buttons

**Primary CTA** (e.g., "Book a new session")
- Full width, navy bg, white text
- 16–20px padding
- 16px radius
- Elevated shadow
- Icon in rounded well on left

**Secondary CTA** (outlined)
- White bg, navy border, navy text
- Same sizing as primary

**Destructive**
- Red `#e04545`, reserved for permanent/irreversible actions only

**Text button**
- No bg, no border
- Used for "Clear", "Cancel", inline actions

### Section label

Uppercase mini-heading used throughout the app to introduce content rows:
- 10–11px, 600 weight, `var(--muted)` color
- Letter-spacing 0.14–0.18em
- Used for "YOUR DOGS", "UP NEXT", "THIS WEEK AT NWA SCHOOL FOR DOGS", etc.
- The header's bottom border is the only divider line on the home page; section labels themselves do not have trailing hairlines. The overall rhythm of the page is set by white space, not by repeated dividers.

### Dog profile section tile (collapsible, 2-column grid)

The Overview and Care Notes tabs on dog profile pages render as a 2-column tile grid. Each tile is a closed `.section` rectangle:

```html
<div class="section [school|daycare|private|group|boardtrain|reports] is-collapsed">
  <div class="section-label-row">
    <button class="section-toggle" type="button" onclick="toggleProfileSection(this)" aria-expanded="false">
      <div class="section-head">
        <div class="section-icon"><svg>...</svg></div>
        <div class="section-head-label">Section Title</div>
      </div>
      <svg class="section-chevron" viewBox="0 0 9 14" aria-hidden="true"><polyline points="1.5 1.5 7.5 7 1.5 12.5"/></svg>
    </button>
  </div>
  <div class="card">
    <!-- section content -->
  </div>
</div>
```

**Layout**
- `.tab-panel.active` is `display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 16px`
- Each `.section` is white, 14px radius, soft shadow `0 1px 2px rgba(33,53,106,0.04), 0 4px 16px rgba(33,53,106,0.04)`
- `.section::before` is the colored left-edge accent stripe (3px wide), per-category — `school=navy`, `private=#9b7ed4`, `group=accent-green`, `daycare=accent-gold`, `boardtrain=accent-terracotta`, `reports=accent-pink`. Sections without a type modifier get a quiet `var(--border)` neutral stripe.

**Closed (tile) state — `.section.is-collapsed`**
- `.section-toggle` is `flex-direction: column; padding: 18px 12px 16px; gap: 10px; min-height: 96px` — icon stacked above label, both centered
- Icon bubble is 36×36 with 10px radius, glyph 18×18
- Label is 11px uppercase 700wt, centered, 0.05em tracking
- Chevron is `display: none` — the entire tile is the affordance
- `.card` body is hidden via `max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0`

**Open state**
- The section breaks out of the 2-col grid via `grid-column: 1 / -1` so it spans full width
- Header layout reverts to horizontal (icon left, label center, chevron right pointing down at 90deg)
- `.card` body slides in via `max-height` + opacity transitions on `cubic-bezier(0.32, 0.72, 0, 1)` over 0.42s, with opacity fading on a 0.05s delay so content seems to "develop" as it grows
- Section gets a stronger shadow `0 1px 2px / 0 8px 28px` to feel "lit up" relative to closed siblings

**Accordion mode — only one section open at a time**
The toggle JS function auto-collapses any open sibling section in the same `.tab-panel` when a new one is opened. Tabs are independent; switching tabs doesn't collapse anything in either tab.

**NOTE (April 28):** Tapping a tile now opens a centered modal popup instead of expanding inline. The collapsible inline-expand markup and CSS above are preserved as the underlying structure (the `.card` element is moved into the modal body and back), but the inline-expand visual state is no longer reachable on these screens. See **Section detail modal** below.

### Section detail modal (centered card popup)

Tapping a section tile on a dog profile page opens a centered card modal containing that section's `.card` content. Used for sections whose content varies wildly in length and benefits from focused detail view rather than inline expand.

**Markup (single reusable modal at the bottom of the page)**

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

**CSS (extends the existing `.modal-backdrop` chrome)**

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
/* Override inline-collapse hiding when the .card lives inside the modal */
.modal-section-body .card {
  max-height: none !important;
  opacity: 1 !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent;
  display: flex !important;
}
```

**JS — move (not clone) pattern**

The section's `.card` is **moved** into the modal body when opened, then **moved back to its original DOM position** when closed. This preserves IDs and pre-attached event listeners on inner buttons.

```js
function toggleProfileSection(btn) {
  const section = btn.closest('.section');
  if (section) openSectionModal(section);
}

(function() {
  const modal = document.getElementById('sectionModal');
  const titleEl = document.getElementById('sectionModalTitle');
  const bodyEl = document.getElementById('sectionModalBody');
  let activeSection = null, originalAnchor = null;

  window.openSectionModal = function(section) {
    if (activeSection) closeSectionModal();
    const labelEl = section.querySelector('.section-head-label, .section-label');
    titleEl.textContent = labelEl ? labelEl.textContent : '';
    const card = section.querySelector('.card');
    if (card) {
      originalAnchor = { parent: card.parentNode, next: card.nextSibling };
      bodyEl.appendChild(card);
    }
    activeSection = section;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeSectionModal() {
    if (!activeSection) return;
    const card = bodyEl.querySelector('.card');
    if (card && originalAnchor) {
      originalAnchor.parent.insertBefore(card, originalAnchor.next || null);
    }
    activeSection = null; originalAnchor = null;
    titleEl.textContent = '';
    modal.classList.remove('open');
    if (!document.querySelector('.modal-backdrop.open')) document.body.style.overflow = '';
  }
  window.closeSectionModal = closeSectionModal;

  modal.addEventListener('click', (e) => { if (e.target === modal) closeSectionModal(); });
  modal.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', closeSectionModal, true));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeSectionModal();
  });
})();
```

**Three ways to dismiss**
1. Tap the × in the top-right corner
2. Tap anywhere on the dimmed backdrop outside the card
3. Press Escape

This is distinct from the existing **slide-up bottom sheet** modal (`.modal-card` without `.modal-card-centered`) which is used for forms (Add Medication, Add Vaccine, etc.) — that pattern slides up from the bottom and is appropriate for tall form-like content.

**When to use centered card modal vs. bottom sheet**
- **Centered card** — focused detail view, content varies in length, no required action (just informational with optional CTAs). Examples: section detail modals on dog profile.
- **Bottom sheet** — form input, action sheet, content with required user input. Examples: Add Medication, Add Vaccine, Edit Hospital, Curriculum info.

### Reports tile (dog profile — Overview)

The 6th tile in the Overview tab grid, positioned as the **2nd tile** so it pairs with School Progress in row 1 of the 2-col layout. Pastel pink accent identity:

**New color tokens**
```css
--accent-pink: #f4b6c8;       /* pastel rose for left-edge stripe */
--accent-pink-dark: #b85a7a;  /* deeper rose for icon glyph + label */
```

**Tile (closed) styling**
- Pink left-edge stripe via `.section.reports::before { background: var(--accent-pink); }`
- Icon: document/clipboard glyph in a `rgba(244, 182, 200, 0.35)` bubble with `var(--accent-pink-dark)` foreground
- Label "REPORTS" colored with `var(--accent-pink-dark)`

**Modal contents (top to bottom)**

```html
<div class="card">
  <button class="rep-latest-btn" id="latest-report-btn">
    <svg>...</svg> View Latest Report
  </button>
  <button class="rep-viewall-btn" id="all-reports-btn">
    View all <svg>...</svg>
  </button>
  <div class="rep-recent-label">Recent reports <span class="rep-recent-sub">· last 7 days</span></div>
  <div class="rep-strip-wrap">
    <div class="rep-strip-scroller" id="repStripScroller-{dog}">
      <!-- 7 .rep-strip-card buttons -->
    </div>
    <div class="rep-scroll-hint" data-target="#repStripScroller-{dog}">scroll <span class="rep-scroll-hint-arrow">→</span></div>
  </div>
</div>
```

1. **Primary "View Latest Report" CTA** (`.rep-latest-btn`) — full-width navy gradient button with document icon. Existing `id="latest-report-btn"` wires to existing JS that picks a random variant from `['foundation', 'advanced', 'looseleash', 'housemanners', 'cgc']` and navigates to `report-card-all-{dog}.html#{variant}`.
2. **Secondary "View all" button** (`.rep-viewall-btn`) — outlined white-bg button beneath the primary, with chevron. Existing `id="all-reports-btn"` wires to `reports-list-{dog}.html`.
3. **"Recent reports · last 7 days"** label — uppercase navy with the "· last 7 days" subtitle in italic Cormorant Garamond at lower contrast (`var(--muted-soft)`).
4. **Horizontal scroller of 7 report cards** — same visual language as Bookings → Past strip cards but scoped to `.rep-*` namespace (`.rep-strip-card`, `.rep-strip-name`, `.rep-strip-date`, `.rep-strip-type`, `.rep-strip-metrics`, `.rep-metric`, `.rep-dot`) so they don't collide with the bookings page's `.rs-strip-card` classes. 130px wide cards, scroll-snap, hidden scrollbars, colored 3px left stripe per session type. Each card's onclick navigates directly to `report-card-all-{dog}.html#{variant}`.
5. **`scroll →` hint** flush-right below the scroller — uses the standard scroll-end-aware pattern (see Patterns → Scroll hint), scoped to `.rep-scroll-hint` to avoid colliding with the page-level `.scroll-hint` on the home page. Hooks into the modal opener via `window.openSectionModal` wrapping so the hint visibility refreshes after modal layout settles (otherwise `scrollWidth` reads as 0 inside a hidden modal and the hint would always think "fits, hide me").

**Per-card type colors (left stripe + type label)**

| Type | Stripe | Label color |
|------|--------|-------------|
| `school` | `var(--navy)` | `var(--navy)` |
| `daycare` | `var(--accent-gold)` | `var(--accent-gold-dark)` |
| `private` | `var(--accent-purple)` | `#6f4eb8` |
| `boardtrain` | `var(--accent-terracotta)` | `var(--accent-terracotta-dark)` |
| `groupclass` | `#5a9a9a` | `#2e6e6e` |

**Why Reports is its own section now**
Previously the "Latest report card" / "View all" buttons were embedded inside the School Progress section's body, which mixed two unrelated concerns (curriculum tracking and report card listing). The new dedicated Reports tile has its own color identity and its own home; School Progress is now purely about the 5-step curriculum progress tracker.

### Past view weekly stack (Bookings page)

The Past view groups completed sessions by week. Each week is a collapsible block; only the latest week is expanded by default, the previous 4 weeks are collapsed.

**Markup**

```html
<div class="rs-week" data-week="0"> <!-- expanded -->
  <button class="rs-week-header" type="button" onclick="toggleWeekCollapse(this)" aria-expanded="true">
    <div class="rs-week-range">Apr 20 – 26</div>
    <div class="rs-week-count">10 reports</div>
    <svg class="rs-week-chevron" viewBox="0 0 12 8" aria-hidden="true"><polyline points="1 1.5 6 6.5 11 1.5"/></svg>
  </button>
  <div class="rs-week-stacks">
    <!-- one .rs-stack per dog with sessions that week -->
  </div>
  <!-- one .rs-strip per dog (hidden until that dog's stack is tapped) -->
</div>
```

**Header is a real button** — full-width tap target, italic Cormorant week range on the left, "N reports" count + chevron on the right. Chevron rotates -90° when collapsed via `.rs-week.is-collapsed .rs-week-chevron { transform: rotate(-90deg); }`. Collapsed state hides `.rs-week-stacks` and any expanded `.rs-strip` children.

**Stack of fanned cards per dog** (`.rs-stack`, 96×130) — front card shows the dog's photo + name + report count; 1–2 back cards fan behind via rotation transforms (rotate-6/translate, rotate+5/translate). **Photo appears only on the front card** — back cards are bare white rectangles with their colored borders. Tapping a stack expands a `.rs-strip` of session cards horizontally beneath.

**Stack-front lift on expand**
```css
.rs-stack[aria-expanded="true"] {
  margin-bottom: 14px; /* room for the lifted front card */
}
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

The front card translates down 14px and tilts 2° as if pulled out of the deck and laid down in front of the spread-out detail strip. Back cards fan out a bit more so the stack silhouette stays visible behind the lifted front. Transition uses the standard spring `cubic-bezier(0.32, 0.72, 0, 1)` over 0.22s.

**Strip cards inside expanded stack** — info-only, **no photo**. Each card has a colored 3px left stripe (matching session type), italic Cormorant dog name + uppercase date, small uppercase session-type label, and 3 metric rows with 5-dot indicators. The `.rs-square-top` photo header that previously sat at the top of each strip card has been removed.

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

Cards never rely on "tapping the photo" to navigate without a visible cue. If the tap target is the whole card, the card's visual treatment must signal it.

### Scroll hint (horizontal scroll affordance)

Horizontal-scroll rows (dogs row, announcements row, anything else where content overflows the viewport horizontally) get a small uppercase **"scroll →"** label flush-right below the row. The hint is **scroll-position-aware**: it fades to invisible when the user has scrolled to the rightmost end of the row, and fades back in when there's more content to the right.

**Behavior rules**

The hint is hidden when **either** of these is true:
- The row's content fits its viewport with nothing to scroll to (`scrollWidth <= clientWidth`)
- The user has scrolled to (or essentially to) the right edge (`scrollLeft + clientWidth >= scrollWidth - 2`)

Otherwise the hint is visible. The 2px tolerance handles sub-pixel rounding on different display densities (Retina, etc.) — without it, the hint can occasionally fail to hide on devices where the math doesn't land exactly. State updates run on `scroll`, on `resize`, and once after layout settles via `requestAnimationFrame` so initial paint is correct.

**Markup**

```html
<div class="some-scroll-row">
  ... cards ...
</div>
<div class="scroll-hint" data-target=".some-scroll-row">scroll <span class="scroll-hint-arrow">→</span></div>
```

The `data-target` attribute is a CSS selector pointing to the scroll container the hint pairs with. The hint is a sibling of the row — typically inside the same outer section wrapper — and sits visually directly underneath.

**CSS**

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
  50% { transform: translateX(3px); opacity: 1; }
}
```

The arrow itself wiggles right by 3px on a 2-second loop to draw the eye. Both `.scroll-hint` and the legacy `.dogs-scroll-hint` share the same styling via grouped selectors so the dogs row continues to work without changes.

**JS (shared `wireHint` helper)**

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

// Wire all scroll hints on page load
document.querySelectorAll('.scroll-hint[data-target]').forEach(hint => {
  const row = document.querySelector(hint.dataset.target);
  wireHint(hint, row);
});
```

The `passive: true` on the scroll listener is required — without it, touch scrolling on iOS gets noticeably laggy because the browser has to wait to see if the handler will call `preventDefault()`.

**When to use it**

- Any horizontal-scroll row where content overflows the viewport: dog stories, weekly announcements, related-content carousels, photo galleries
- Especially worthwhile when the right edge of the row sits flush against the page edge with no visual cue that more content exists (no fade, no peek of a clipped card, etc.)

**When NOT to use it**

- Vertical-scroll containers — the page itself, modal bodies, etc. The user already knows pages scroll vertically
- Rows where the rightmost content is always partially visible (a "peek" of the next card) — the peek itself is the affordance
- Rows that always fit in the viewport — the auto-hide will just keep it hidden, no need to add the markup at all
- Snap-scroll rows where each card is full-width and the dot indicator handles the affordance (use a dot indicator pattern instead)

**Reference implementation:** `index.html` — both the dogs row and the announcements row use this pattern.

### Empty states

Every list/row must have a defined empty state:
- Dog stories: hide the whole row if no dogs (shouldn't happen — onboarding requires at least 1)
- Announcements: hide entire "This week" section when empty
- Schedule: show "No upcoming sessions · Book one" CTA
- Messages: show "No messages yet · Send one" CTA

### Session type labels

Across the app, session types are referred to consistently:
- "Day School" (not "school", not "day school class")
- "Daycare" (not "day care", not "doggy daycare")
- "Private Lesson" (not "private", not "1:1")
- "Group Class" (not "group", not "class")
- "Board & Train" (not "board-and-train")

### Picker button pattern

When a control opens a picker/sheet for selection, it follows the icon + value + chevron pattern:

```
[icon] Current value ⌄
```

- The value is the primary readable text (13–15px, 600 weight, navy)
- The leading icon is contextual (calendar for date pickers, dog icon for dog selection, etc.) at 0.65 opacity
- The trailing chevron (`⌄` or `›`) is at 0.45 opacity at rest, lifts on hover
- The whole thing is a rounded button with subtle shadow and hover feedback

This is distinct from a **chip** (pill-shaped, toggleable) and a **tag** (status indicator, not interactive). The chevron is the cue that this control opens something, not that it's selected/unselected.

**Wrong:** two-line chip with "Next 30 days" + tiny "TIME FRAME" caption. Looks like a stat, not a control.

**Right:** single-line button with calendar icon + "Next 30 days" + down chevron. Reads as a picker.

### Sheets and modals

Any element that overlays the entire device viewport (bottom sheets, confirmation dialogs, full-screen modals) lives as a **direct child of `.device-screen`**, outside `.device-screen-inner`. This matters:

- `.device-screen-inner` is the scroll container
- Content inside it participates in scroll layout; transforms can affect scroll bounds
- Sheets must anchor to the visible viewport, not the scroll content

**Bottom sheet pattern (`.modal-card` default):**
- Backdrop: `position: absolute; inset: 0` + backdrop-filter blur + navy tint at ~40% opacity
- Sheet: `position: absolute; bottom: 0` + `transform: translateY(100%)` default, `translateY(0)` when open
- Transition: 0.32s `cubic-bezier(0.2, 0.8, 0.2, 1)` (slight overshoot for "settle" feel)
- Z-index: backdrop 100, sheet 101
- Sheet top radius 24px, `var(--bg)` fill
- Drag handle at top (40×4px, `var(--border)` fill, rounded)
- Max-height: ~84% of viewport with internal overflow-y scroll for tall content
- **Use for:** form input, action sheets, content with required user input (Add Medication, Add Vaccine, Edit Hospital, Curriculum info, etc.)

**Centered card modal pattern (`.modal-card.modal-card-centered`):**
- Same backdrop as bottom sheet, but `align-items: center` instead of `flex-end`
- Card scales in from 0.94→1.0 over 0.26s with `cubic-bezier(0.32, 1.15, 0.6, 1)` (subtle overshoot)
- Card max-width 360px, all four corners rounded 18px, max-height `calc(100vh - 48px)`
- Stronger shadow `0 24px 60px / 0 4px 12px` (sits in space rather than anchored to bottom)
- Three dismissals: × button in modal-header, backdrop click, Escape key
- **Use for:** focused detail views, content that varies in length, no required action (informational with optional CTAs). Examples: section detail modals on dog profile.
- Full spec lives in **Key Components → Section detail modal**

**Confirmation dialog pattern:**
- Same backdrop as sheet
- Center-aligned card (uses `.modal-card-centered` variant) — use for short binary decisions
- 18px radius, max-width ~300px
- Title serif 22px, message sans 13px, button row
- Two buttons: **cancel-like** (grey bg, navy text) + **primary action** (filled navy or red)
- Button labels are always **verbs that describe outcomes**, not "Cancel / OK"

### Accordion mode (one section open at a time)

When a screen has multiple stacked collapsible sections (dog profile sections, Bookings → Past weekly groups, etc.), the default behavior is **accordion mode**: opening a new section auto-collapses any sibling that's currently open. This prevents the screen from becoming a wall of fully-expanded sections and keeps the user's focus on one thing at a time.

Implementation pattern (in the toggle handler):
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

Accordion scope is the immediate container (`.tab-panel`, week stack container, etc.) — sections in different containers don't interact. Tabs are independent; switching tabs doesn't collapse anything.

**Note (April 28):** On the dog profile page, this accordion-mode toggle has been replaced with a section detail modal popup instead of inline expand. The accordion-mode pattern as described still applies elsewhere in the app (Bookings → Past weeks, etc.).

### Success states (animated checkmark)

When an action completes successfully (booking confirmed, payment received, etc.), use a consistent "hero success" pattern for emotional closure:

**Visual:**
- Filled green circle (`--accent-green`, 64px) with soft green shadow
- White checkmark SVG inside (polyline `20 6 9 17 4 12` at 32px, 3px stroke, round line caps)
- Followed by a serif italic title (e.g., "*Confirmed!*", 34px)
- Subtitle in muted sans (13px) with a one-line summary of what just happened

**Entry animation:**
```css
@keyframes check-pop {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
```
Spring easing: `cubic-bezier(0.34, 1.4, 0.64, 1)`, 0.5s duration, 0.1s delay. The slight overshoot at 70% creates a satisfying "pop" that signals completion without being cartoonish.

**Don't use for:** routine UI transitions, non-success states, or anywhere the moment doesn't justify emotional weight. Reserve this for actual completion milestones.

### Multi-step sheets (sheet queueing)

When a single action triggers multiple sequential decisions (e.g., one dog needs a credit package, then the next one does), queue the sheets one at a time rather than combining into a single mega-sheet.

**Pattern:**
- First sheet opens with "Step 1 of N · [context]" label at the top (9px uppercase muted, only shown when N > 1)
- User completes the action (e.g., picks a package and confirms)
- Close current sheet (0.32s)
- Wait 350ms
- Open next sheet in the queue with its content updated

Why sequential beats combined:
- Users can focus on one decision at a time
- Each sheet only shows context relevant to that step
- Easier to back out of a specific step without unwinding the whole flow
- Scales cleanly from 1 dog to 5 dogs without UI changes

Hide the step indicator entirely when only one item is in the queue — no user benefit to "Step 1 of 1."

### Horizontal scroll card rows

Used for the Dog Story row (home), the Review-by-dog row (booking flow), and the image gallery on dog profiles.

**Structure:**
- Parent container with horizontal overflow and hidden scrollbars
- Children are fixed-width cards (not flexible) so cards don't squish when the row has few items
- `-webkit-overflow-scrolling: touch` for iOS momentum scroll
- `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` to hide scrollbars

**Scroll hint:**
Show a small "scroll →" or "SCROLL →" indicator at the top-right of the section when `scrollWidth > clientWidth`. Hide when everything fits. The arrow can pulse with a 2s horizontal translate animation to suggest motion.

**Card width guidelines:**
- Dog Story circles: 110px (see Dog Story component for full math)
- Review-by-dog: 270px (fits 1.5 cards in a 402px viewport — enough to signal overflow without hiding the right edge)
- Image gallery: variable but usually 180–220px

**Do NOT use `scroll-snap-type`:**
Safari's implementation causes inconsistent initial scroll positions. Instead, explicitly set `scrollLeft = 0` on DOMContentLoaded for any row that should start at the beginning.

### Process patterns (build-time discipline)

These are workflow rules learned from production mistakes — not user-facing patterns, but they protect every component spec above from going wrong on the way to the screen.

**DOM balance is necessary but not sufficient.** A balanced `<div>` count vs `</div>` count does NOT prove the DOM is correctly nested. A regex move that grabs the wrong closing-tag boundary can still produce a balanced file with siblings nested incorrectly inside each other. Always pair the balance check with a visual section-order verification — count expected sections per container and check that the first line of each matches expected content.

**Use comment-marker anchors, not generic structural patterns.** When using regex to extract or move HTML blocks across nested structures, prefer pairs of explicit HTML comments (`<!-- REPORTS -->` ... `<!-- DAY CARE -->`) as boundaries rather than generic patterns like `</div></div></div>`. Generic structural patterns can match the wrong nesting level — for example, a `</div></div></div>` pattern can match three close-tags inside the FIRST strip card (closing rep-strip-metrics + rep-strip-body + a nested wrapper) instead of the outer section's three closing divs, leaving 6 strip cards orphaned mid-document.

**Cross-file propagation needs distinguishing-marker checks, not just presence checks.** When applying the same change to multiple per-dog files, verify each file received the change by checking distinguishing markers (e.g., `grid-template-columns: 1fr 1fr` for the tile-grid CSS) — not just generic presence checks like "did the file size grow." A change can be silently absent from sibling files even when surrounding context appears identical.

**Smoke test routes after layout changes.** When restructuring page layouts (especially adding/moving sections), always run an HTTP 200 smoke test on each file before declaring done. A layout that loads visually correct in one dog profile may fail to render entirely in another due to a partially-applied CSS selector.

---

## Vocabulary

Lock one word per concept:

| Concept | Word |
|---|---|
| Pre-paid bundle of credits | Package |
| Ongoing monthly plan | Membership |
| One visit | Session |
| Act of reserving | Booking |
| Staff-approval-required | Request |
| Training progress tracker | Training progress |
| Stored payment cards | Payment methods |
| Back-navigation chevron on inner pages | Inline back link |

---

## Motion

- **Page entrance:** stagger sections with `fade-up` animation, 0.05s delays per section
- **Hover:** `translateY(-2px)` + shadow upgrade
- **Press:** `scale(0.98)` for cards, `scale(0.94)` for small buttons
- **Bell unread pulse:** 2.6s gentle box-shadow glow
- **"Up Next" indicator dot:** 2.4s pulse animation
- **Sheet open:** 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) slide up
- Respect `prefers-reduced-motion`: disable all animations

---

## Accessibility floors

- Tap targets minimum 44px, preferred 56px
- Text contrast minimum 4.5:1 for body, 3:1 for large text
- Respect system text size (don't hard-cap font sizes in production)
- Every interactive element has hover, active, and focus states
- Icon-only buttons have a `title` attribute or aria-label

---

## File outputs (current reference prototypes)

**Top-level nav destinations**
- `index.html` — home screen with all current patterns (sticky chrome, dog stories with end-of-scroll hint, announcements row with end-of-scroll hint, Up Next, book sheet)
- `bookings-page.html` — Bookings tab with Upcoming and Past views:
  - Shared sticky chrome (header + nav)
  - Dog filter chips + class-type chip multi-select + view toggle + time frame picker
  - Past view: 5-week accordion of weekly fanned card stacks (one per dog with sessions that week), each stack expands to a horizontal strip of session cards. Photo only on stack-front; strip cards are info-only.
  - Swipe-to-cancel on Upcoming session cards
- `account.html` — Account tab with My Dogs card list (each row → dog profile)

**Inner pages reached from top-level**
- `dog-profile-{waffles,brodie,lola}.html` — per-dog profile pages with:
  - Vertical hero (140×140 photo on top, italic Cormorant name + breed/age below)
  - 2-column tile grid for Overview tab: School Progress, Reports, Day Care, Private Lessons, Group Lessons, Board & Train (Reports paired with School Progress in row 1)
  - 2-column tile grid for Care Notes tab: Medications, Vaccines, Feeding Instructions, Special Notes
  - Tile tap → centered modal popup with that section's content (× / backdrop / Escape to dismiss)
- `dog-add.html` — standalone (no iPhone simulator) dog onboarding form with inline back link, structured feeding/meds rows
- `dog-manage-{waffles,brodie,lola}.html` — per-dog account management pages
- `report-card-all-{waffles,brodie,lola}.html` — full report cards with hash-routing per program variant (#foundation, #advanced, #looseleash, #housemanners, #cgc)
- `reports-list-{waffles,brodie,lola}.html` — chronological list of past reports for a dog

**Booking flow**
- `book-private.html` — Private Lesson booking with 3-card date picker
- `booking-flow-reschedule.html` — reschedule wizard

**Assets**
- `nwa-logo-horizontal.png` — horizontal brand mark (navy on transparent)
- `lola.png`, `waffles.png`, `brodie.png` — example dog photos used throughout

---

## Changes from v1

- **Locked target device to iPhone 17 Pro** (402 × 874 CSS pixels) — v1 used a generic 390px mobile frame
- **Added Figma-style device frame** to prototypes so stakeholders see the app in device context
- **Mandated persistent header + nav chrome on every page** with detailed scroll architecture (see Global Chrome section)
- **Specified full Dog Story scroll behavior** including the math for centering 3 dogs (`24 + 3×110 + 3×16 = 402`), the entrance animation, and the scroll-snap gotcha that required a JS scroll reset
- **Dropped the Reports tab, reduced nav to 4 items.** Reports content lives inside Bookings (under the Past toggle) and on dog profile pages. The bell handles notifications for new reports.
- **Added context-inline swap pattern** — Bookings > Past replaces the schedule body with a reports feed instead of navigating to a different page
- **Added full Booking Flow architecture** — three-view state machine (booking main / credits sheet / confirmed), with specs for the calendar, mode toggle, review-by-dog cards, credits sheet with multi-dog queueing, and confirmed success page
- **Added swipe-to-cancel spec** for session cards (swipe-container + cancel button + confirmation dialog + collapse animation)
- **Added report card component** with context-aware metric dots (5 session types × 3 metrics each)
- **Added time frame picker** (button + bottom sheet with By Month and Date Range modes)
- **Added picker button pattern** (icon + value + chevron) as the canonical pattern for controls that open selection sheets
- **Added sheets/modals layout rules** — overlay elements live outside the scroll container
- **Added success state pattern** — animated checkmark with spring easing for completion moments
- **Added multi-step sheet pattern** — sequential sheet queueing for actions requiring multiple decisions
- **Added horizontal scroll card row pattern** — consolidated rules across Dog Stories, Review-by-dog, and image galleries
- **Added "credits remaining after this booking" rule** — credit counters show post-booking balance, not starting balance
- Color palette shifted slightly bluer (navy is `#21356A` now, was `#18376F` in v1)
- Added purple `#9b7ed4` as the private lessons accent (v1 had only navy + gold)
- Added terracotta `#c47a5a` (Board & Train) and muted teal `#5a9a9a` (Group Class) for the full 5-type color system
- Added explicit red and green accent tokens
- Formalized global header + bottom nav as persistent chrome
- Moved to Cormorant Garamond serif + Instrument Sans from SF Pro Display
- Lighter card treatments (thinner borders, more subtle shadows)
- Documented day-centric framing as the default for schedule views
- Established the announcement row pattern and urgent card variant
- Removed the dog card density of v1 in favor of story circles on home
