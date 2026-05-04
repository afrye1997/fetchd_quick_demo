# PHASE-PLAN.md — Current phase: Prototype-to-RN port

This file locks the scope of the current build phase: what's in, what's out, what "done" looks like. When in doubt about whether something belongs in the work-in-progress, check this file before adding it.

For *who you are* and *how you work*, see `CLAUDE.md`. For *visual and component spec*, see `nwa-design-system-v2.md`. For *technical decisions*, see `ARCHITECTURE.md`.

---

## Current phase: React Native prototype port

We have a complete set of HTML prototypes in `prototypes/` that demonstrate the entire app. The current phase ports those prototypes to a real React Native app using Expo, with mock data — no backend.

### Why this phase exists

The HTML prototypes were necessary to lock the design and the patterns. They're done. But they're not a real app — they don't run on a phone, they can't be installed, and they have no actual app behavior beyond what's hand-coded into each HTML file.

This phase converts the prototype into a navigable, runnable React Native app that **looks identical to the prototypes, behaves like a real app, and runs on real phones via Expo Go.** No real backend yet. That's the next phase.

The deliverable at the end of this phase is something Allison can hand to Shanthi (or anyone else) and say: "Here. Open Expo Go, scan this QR code, you're using the app." The fact that the data is mocked is invisible to the user.

---

## Foundation status (completed before screens)

The following infrastructure is built and committed. Don't rebuild it.

- [x] Expo SDK 54 initialized in `mobile/` with TypeScript strict mode
- [x] All architecture-locked dependencies installed (Expo Router, Reanimated, Gesture Handler, etc.)
- [x] Full folder structure per ARCHITECTURE.md
- [x] `mobile/src/theme.ts` — all DS color, typography, spacing, shadow tokens
- [x] `mobile/app/_layout.tsx` — font loading (Cormorant Garamond + Instrument Sans), SafeAreaProvider, splash screen
- [x] `mobile/app/index.tsx` — redirects to `/(tabs)` (auth bypass for prototype phase)
- [x] `mobile/tsconfig.json` — strict mode + `@/*` path alias
- [x] `mobile/src/types/` — all domain types (Dog, Booking, PendingRequest, Report, Message, Thread, Notification, Announcement)
- [x] `mobile/src/mock/` — all mock data as JSON (dogs, bookings, pending-requests, reports, announcements, threads, messages, notifications)
- [x] `mobile/assets/images/` — dog photos (waffles, lola, brodie) and logo

**Next:** repository layer (`mobile/src/repositories/`) — transforms raw JSON → domain types with simulated network delay.

---

## What's IN scope for this phase

### Screens, in port order

Build screens in this order. Don't skip ahead. Each screen gets committed before starting the next.

1. **Home** (`mobile/app/(tabs)/index.tsx`) ← from `prototypes/home.html`
   - Global header, dog story row, up-next card, announcements row, "Book a new session" CTA, new-booking sheet (5 tiles)
   - Exercises the most patterns of any single screen
2. **Bookings → Upcoming** (`mobile/app/(tabs)/bookings.tsx`, default view) ← from `prototypes/bookings-page.html`
   - View switch (Upcoming / Past / Pending), dog filter chips, type filter chips, time frame picker
   - Session cards with swipe-to-cancel
   - FAB (+) to start a new booking
3. **Bookings → Past** (same screen, view switched)
   - Weekly accordion stack of fanned card stacks per dog
   - Tap a stack expands to a horizontal strip of report cards
4. **Bookings → Pending** (same screen, view switched)
   - Pending cards with status banner pattern
   - Tap routes to request-detail page for the matching service
5. **Dog Profile** (`mobile/app/dog-profile/[dogId].tsx`) ← from `prototypes/dog-profile-waffles.html`
   - Vertical hero (140x140 photo, italic Cormorant name + breed/age)
   - Tabs: Overview / Care Notes
   - 2-column tile grid per tab
   - Tile tap opens centered modal with the section's content
   - Reports tile with Latest Report / View All / 7-day report scroller
6. **Account** (`mobile/app/(tabs)/account.tsx`) ← from `prototypes/account.html`
   - Profile header card
   - My Dogs section (with Add a Dog → routes to dog-add)
   - Account section: Payment Methods, Location, Emergency Contact, Notifications toggle
   - Support section
   - Log Out with confirmation modal
   - Notif popover triggered from header bell (promote `.notif-popover` from this screen to global)
7. **Messages → list** (`mobile/app/(tabs)/messages.tsx`) ← from `prototypes/messages.html`
   - List of chat threads with Shanthi and other staff
   - Pull-to-refresh
   - "+ New" affordance to start a new thread
8. **Chat detail** (`mobile/app/chat/[threadId].tsx`) ← from `prototypes/chat-*.html`
   - Message bubbles, sender alignment, timestamps
   - Composer at bottom
9. **New message** (`mobile/app/chat/new.tsx`) ← from `prototypes/new-message.html`
10. **Booking flow — Day School / Day Care** (`mobile/app/booking-flow/day-school.tsx`) ← from `prototypes/booking-flow.html`
    - Mode toggle (school/daycare)
    - Dog selection
    - Calendar with availability dots and per-dog mode states
    - Review-by-dog horizontal scroll cards
    - Credits sheet (bottom sheet overlay)
    - Confirmed view (success state)
11. **Booking flow — Private Lesson** (`mobile/app/booking-flow/private.tsx`) ← from `prototypes/book-private.html`
    - Intake form with chips, textarea, 3 preferred date cards
12. **Booking flow — Group Class** (`mobile/app/booking-flow/group.tsx`) ← from `prototypes/book-group.html`
13. **Booking flow — Boarding** (`mobile/app/booking-flow/boarding.tsx`) ← from `prototypes/book-boarding.html`
14. **Booking flow — Board & Train** (`mobile/app/booking-flow/boardtrain.tsx`)
    - **Note:** this screen doesn't exist as an HTML prototype yet (only the request-detail page does). Build it modeled on the Private Lesson booking flow with terracotta accents and a length-picker (1/2/3 weeks).
15. **Request detail — Boarding** (`mobile/app/request-detail/boarding.tsx`) ← from `prototypes/request-detail-boarding.html`
    - Pre-filled with submitted values
    - Status banner (PENDING)
    - Resubmit changes button → viewSent confirmation → bounces to Bookings → Pending
    - Cancel request button → confirmation modal → removes from Pending
16. **Request detail — Private Lesson** (`mobile/app/request-detail/private.tsx`) ← from `prototypes/request-detail-private.html`
17. **Request detail — Board & Train** (`mobile/app/request-detail/boardtrain.tsx`) ← from `prototypes/request-detail-boardtrain.html`
18. **Dog management — Add** (`mobile/app/dog-add.tsx`) ← from `prototypes/dog-add.html`
19. **Dog management — Manage** (`mobile/app/dog-manage/[dogId].tsx`) ← from `prototypes/dog-manage-waffles.html`
20. **Reports — Full report card** (`mobile/app/report-card/[dogId].tsx?variant=foundation`) ← from `prototypes/report-card-all-waffles.html`
    - Hash-routed variants in HTML become query params in RN
    - Variants: foundation, advanced, looseleash, housemanners, cgc
21. **Reports — List** (`mobile/app/reports/[dogId].tsx`) ← from `prototypes/reports-list-waffles.html`
22. **Pre-home flow** (the entire `(auth)/` group):
    - `login-welcome.tsx` ← from `prototypes/login-welcome.html`
    - `login-signin.tsx` ← from `prototypes/login-signin.html`
    - `profile-create-owner.tsx`
    - `profile-create-dog.tsx`
    - `profile-create-review-dog.tsx`
    - `profile-created.tsx`
    - `how-it-works.tsx` ← 4-pane swipe carousel
    - `login-onboarding-2.tsx`, `login-onboarding.tsx`
23. **Educational pages** (`mobile/app/info/`):
    - `meet-rachel.tsx`, `puppy-class.tsx`, `yappy-hour.tsx`
    - These are deep-linked from announcements; build them last since they're peripheral to core flows
24. **Payment methods** (`mobile/app/payment-methods.tsx`) ← from `prototypes/payment-methods.html`
    - Visual only — no real Stripe in this phase

### Mock data

All data comes from `mobile/src/mock/` per the strategy in `ARCHITECTURE.md`. Volume should match the DS V2 "Sample data" section:

- 3 dogs (Waffles, Lola, Brodie) with full profiles
- 30+ past reports per dog spanning multiple months
- 15-25 upcoming sessions per dog over the next 4-6 weeks
- 1-3 active pending requests
- Full vaccine sets, realistic medications/feeding/notes
- 4-8 announcements (use real templates from the DS)
- 2-3 chat threads with mock conversations
- 5-10 mock notifications (mix read/unread, mix types)

### Component library

Built **as we go** per the rule of two in `ARCHITECTURE.md`. By the time the port order is complete, the global components in `mobile/src/components/` should match the DS V2 Component Reuse Map.

### Navigation

Full navigation between all screens. Every link, button, and tap target that goes somewhere in the prototypes goes somewhere in the RN app.

### Animations

All animations specified in the DS:
- Page entrance (fade-up stagger)
- Card hover/press
- Bell pulse, pending pulse
- Sheet open/close
- Modal scale-in
- Success checkmark spring
- Swipe-to-cancel gesture

### Accessibility

Every screen meets the DS accessibility floors:
- 44x44pt minimum tap targets
- 4.5:1 contrast on body text
- `accessibilityRole`, `accessibilityLabel`, `accessibilityHint` on all interactive elements
- Screen reader testing on at least the critical flows (book a session, view a report, send a message)

### Demo readiness

At the end of this phase, the deliverable runs cleanly via Expo Go. Allison can install Expo Go on Shanthi's phone, scan a QR code, and Shanthi uses the app for real (with mock data invisible behind the scenes).

---

## What's OUT of scope for this phase

These are deferred to later phases. Don't build them. If a screen needs them, **stub the visual and explicitly note "stubbed for prototype phase — wired in [Phase Name]"**.

### Real backend

- No Supabase integration
- No real database
- No real API calls
- No `class_sessions` table, no `day_school_plans` table, etc.

### Real authentication

- No login validation
- No password reset
- No OAuth / SSO
- No session tokens
- The `AuthContext` exposes a hardcoded mock user (`{ id: 'allison-1', name: 'Allison Frye' }`)
- The login screens *visually exist* and route correctly, but submitting them just navigates to home — no validation, no API call

### Real payments

- No Stripe integration
- No payment intents, no setup intents, no real charges
- "Save card" / "Buy package" / "Charge" buttons trigger success animations but no money moves
- The Stripe-shaped UI in `payment-methods.html` and the credits sheet exists; the actual Stripe SDK is not installed

### Real notifications

- No push notification setup (no APNs, no FCM, no Expo Notifications)
- No native permission prompt
- The bell popover shows mock notifications from `mock/notifications.ts`
- Notification copy templates are documented in the DS but no real send happens

### Real-time features

- No Supabase Realtime
- No WebSockets
- No live message updates
- Pull-to-refresh simulates a refetch but doesn't actually fetch anything new

### Production builds and distribution

- No EAS Build configuration beyond defaults
- No TestFlight setup
- No Play Store internal testing
- No app icons / splash screens beyond the Expo defaults (custom branding comes later)

### Analytics and error tracking

- No Sentry
- No PostHog or Mixpanel
- No analytics events
- Error Boundaries exist (per ARCHITECTURE.md) but errors aren't reported anywhere — they show the user-facing fallback only

### Tests

- No unit tests, no component tests, no E2E tests in this phase
- "Tests" means smoke-testing the app runs and screens render correctly during build
- Real test infrastructure (Jest, React Native Testing Library, Detox) comes in a later phase

### Offline support

- App assumes always-online (even though mock data works offline trivially)
- No AsyncStorage, no offline queue, no optimistic updates
- This is a deliberate choice — adding offline UX before we have a real network layer is YAGNI

### Admin dashboard

- The admin/Shanthi-side React web app is a separate project entirely
- Out of scope for this phase, possibly out of scope for the next phase too
- Build the client app first; admin dashboard once we have a backend to wire it to

---

## What "done" looks like for this phase

The phase is complete when **all** of these are true:

- All 24 screens in the port order are built and navigable
- Mock data is wired through repositories → services → hooks → screens (no screen reads mock data directly)
- Every flow that works in the HTML prototypes works in the RN app:
  - Book a Day School session end-to-end (with credits, without credits)
  - Submit a Boarding request, see it in Pending, edit and resubmit, then cancel
  - Open a dog profile, view all 6 Overview tiles, view a Reports modal, tap "View Latest Report"
  - Receive a (mock) notification via the bell popover and tap-through to the destination
  - Pull-to-refresh on Bookings and Messages
- `npx expo start` runs cleanly on iOS Simulator and Android Emulator
- Allison can install via Expo Go on a real phone and demo it to Shanthi
- All accessibility floors met
- TypeScript strict mode passes with no errors
- No `any` types without explanatory comments
- No `console.log` left in production code paths

---

## What's NEXT (the phase after this one)

For context, not for building yet. After this phase wraps:

**Phase: Backend wiring**

- Set up Supabase project (auth, database, storage, realtime)
- Define schemas for the 11 tables (`dogs`, `bookings`, `class_sessions`, `day_school_plans`, etc.)
- Implement real repositories that talk to Supabase, replacing mock implementations
- Real auth flow (Supabase Auth)
- Add TanStack Query for server state caching and invalidation
- Wire push notifications (Expo Notifications + Supabase Edge Functions for triggers)
- Wire Stripe (Payment Intents, Setup Intents, packages, memberships)
- Add Sentry for error tracking
- Set up EAS Build for TestFlight distribution to Shanthi for real testing

These are not parallel tracks. The backend wiring phase comes after the prototype port is complete and verified, not concurrent with it.

---

## When to update this file

Update this file when:

- The phase changes (we move from "prototype port" to "backend wiring")
- A screen gets added or removed from the port order
- The "in scope" / "out of scope" boundaries shift

Don't update this file for:

- Routine bug fixes or improvements within the current phase
- Component refactoring or DS additions (those go in `nwa-design-system-v2.md`)
- Architectural decisions (those go in `ARCHITECTURE.md`)
