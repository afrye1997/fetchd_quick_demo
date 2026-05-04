# ARCHITECTURE.md — Locked technical decisions

This file records the **technical decisions** for the React Native build. Every decision here was deliberate and shouldn't get relitigated mid-session. If a decision needs to change, change it explicitly and update this file — don't drift.

For *who you are* and *how you work*, see `CLAUDE.md`. For the *visual and component spec*, see `nwa-design-system-v2.md`. For the *current scope and what done looks like*, see `PHASE-PLAN.md`.

---

## Stack choices

### Mobile framework: Expo (with Expo Router)

We use **Expo**, not bare React Native. Specifically the latest stable Expo SDK.

We use **Expo Router** for navigation, not bare React Navigation. Expo Router gives us file-based routing (similar to Next.js), typed routes, and tighter integration with the Expo dev tools. The DS V2's React Native section was originally agnostic between Router and Navigation; this file locks Router.

### Styling: `StyleSheet.create()` + theme.ts

We use **`StyleSheet.create()`** for component styles. **No NativeWind, no styled-components, no emotion, no Restyle.**

Style values come from **`mobile/src/theme.ts`** — a typed theme object exporting colors, fonts, font sizes, spacing, radius, and shadow tokens derived directly from the DS V2's color and typography sections.

```ts
// example usage
import { theme } from '@/theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.card,
    padding: theme.spacing.cardPadding,
    ...theme.shadows.sm,
  },
});
```

Why this stack and not NativeWind / styled-components:

- **Simplicity.** `StyleSheet.create` is built into RN. No build step, no library version drift, no class-name collisions, no runtime CSS-in-JS overhead.
- **Type safety.** With `theme.ts as const`, every token reference is type-checked. Typo `theme.colors.navvy` and TypeScript catches it.
- **Performance.** `StyleSheet.create` returns numeric IDs that RN optimizes. CSS-in-JS libraries re-create style objects on every render.
- **Allison's preference for vanilla over exotic.** Less to learn, less to debug, less to rip out later.

### Project folder name: `mobile/`

The Expo project lives at **`mobile/`** in the repo root. Not `app/` (Expo Router uses `app/` *inside* the project for route files, so a top-level `app/` folder would be confusing). Not `client/`. Not `frontend/`.

```
nwa-school-for-dogs/
├── CLAUDE.md
├── ARCHITECTURE.md
├── PHASE-PLAN.md
├── nwa-design-system-v2.md
├── prototypes/                ← HTML prototypes (frozen reference)
│   ├── home.html
│   ├── bookings-page.html
│   └── ...
└── mobile/                    ← React Native app (the real build)
    ├── app/                   ← Expo Router route files
    ├── src/
    └── ...
```

### State management: React local state + React Context for cross-screen state

For now: **`useState` / `useReducer` for local state, React Context for things that need to cross screens (current user, theme, current route info).**

**No Redux, no Zustand, no Jotai, no Recoil.** When the backend lands and we add server state, we'll add **TanStack Query (React Query)** as the server-state cache layer at that point — but not before. YAGNI applies.

If a piece of state genuinely needs more structure than Context provides during the prototype phase, that's a signal to lift it into a service module that exposes a hook (`useCurrentDog()`, `useBookings()`) — not a signal to install a state library.

### Server state (deferred): TanStack Query

When real backend integration begins, we use **TanStack Query** for fetching, caching, and invalidating server data. Not Apollo (no GraphQL), not SWR (TanStack is more featureful), not raw `fetch` in components (the whole point of the architecture is screens don't fetch).

Right now this is deferred — see PHASE-PLAN.md for what's in scope.

### Navigation: Expo Router (file-based)

Routes live in `mobile/app/`. Each route is a file or folder. Tab navigation lives in `(tabs)/` group. Stack navigation is implicit per route.

Example structure:

```
mobile/app/
├── _layout.tsx                    ← root layout (font loading, providers)
├── (auth)/                        ← pre-home flow group, no tabs
│   ├── _layout.tsx
│   ├── login-welcome.tsx
│   ├── login-signin.tsx
│   ├── profile-create-owner.tsx
│   ├── profile-create-dog.tsx
│   └── how-it-works.tsx
├── (tabs)/                        ← post-login, with bottom nav
│   ├── _layout.tsx                ← tab bar config
│   ├── index.tsx                  ← Home
│   ├── bookings.tsx
│   ├── messages.tsx
│   └── account.tsx
├── dog-profile/
│   └── [dogId].tsx                ← dynamic route per dog
├── booking-flow/
│   ├── private.tsx
│   ├── group.tsx
│   ├── boarding.tsx
│   └── day-school.tsx
├── request-detail/
│   ├── boarding.tsx
│   ├── private.tsx
│   └── boardtrain.tsx
└── report-card/
    └── [dogId].tsx                ← uses ?variant= query param
```

Navigation calls use the typed Router API:

```ts
import { router } from 'expo-router';
router.push(`/dog-profile/${dogId}`);
router.replace('/(tabs)');
```

### Fonts: Google Fonts via `@expo-google-fonts/*`

- **Cormorant Garamond** via `@expo-google-fonts/cormorant-garamond` (weights: 500, 500italic)
- **Instrument Sans** via `@expo-google-fonts/instrument-sans` (weights: 500, 600, 700)

Loaded in the root `_layout.tsx` via `useFonts()`. App render is blocked behind a `<SplashScreen>` until fonts resolve, so titles never flash in a fallback serif.

### Icons: `react-native-svg` + inline SVG components

Icons are **inline SVG components** built with `react-native-svg`, not an icon library. The HTML prototypes use inline SVG for everything (chevrons, bell, document, etc.); we mirror that approach in RN.

Build a small library of icon components in `mobile/src/components/icons/`:

```tsx
// mobile/src/components/icons/Chevron.tsx
import Svg, { Polyline } from 'react-native-svg';

export function Chevron({ size = 22, color = 'currentColor' }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Polyline
        points="15 18 9 12 15 6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}
```

No `react-native-vector-icons`, no Lucide, no Feather. The DS specifies exact stroke widths and shapes; inline SVG matches the spec exactly.

### Animations: `react-native-reanimated` v3+

For everything beyond simple `Animated.timing` — entrance staggers, success-checkmark spring, swipe-to-cancel gestures, sheet open/close.

- **Reanimated 3+** for shared values, `useAnimatedStyle`, `withSpring`, `withTiming`
- **`react-native-gesture-handler`** for the swipe-to-cancel and any other custom gestures
- **`expo-haptics`** for press feedback on important CTAs (subtle, used sparingly)

### Blur effects: `expo-blur`

The frosted-glass header and bottom nav use **`expo-blur`** (`<BlurView intensity={80}>`). This is heavier than CSS `backdrop-filter` and should be used sparingly — only where the DS specifies it (header, bottom nav, modal backdrops).

### Safe areas: `react-native-safe-area-context`

Always use `<SafeAreaView>` from `react-native-safe-area-context`, **never** the built-in `react-native` SafeAreaView (which is iOS-only and inconsistent). Wrap each screen in a `<Screen>` component that handles SafeArea + theming once.

### Date / time formatting: `date-fns`

Use **`date-fns`** for date/time formatting and manipulation. Not Moment (legacy, large), not Day.js (smaller but `date-fns` has better TypeScript support and tree-shakes cleanly).

Format strings come from the DS V2 "Copy and formatting" section. Wrap them in helper functions in `mobile/src/lib/format.ts` so the format strings live in one place:

```ts
// mobile/src/lib/format.ts
import { format } from 'date-fns';

export const formatLongDate = (d: Date) => format(d, 'EEEE d MMMM yyyy');  // "Tuesday 22 April 2026"
export const formatHeaderDate = (d: Date) => format(d, "EEE · MMM d").toUpperCase();  // "TUE · APR 22"
export const formatCardDate = (d: Date) => format(d, 'MMM d');  // "Apr 22"
export const formatTime = (d: Date) => format(d, 'h:mm a').toLowerCase();  // "7:30 am"
```

---

## Folder structure (canonical)

```
mobile/
├── app/                              ← Expo Router routes (see Navigation above)
├── src/
│   ├── components/                   ← Global UI components from the DS reuse map
│   │   ├── Screen.tsx                ← SafeArea wrapper + global header
│   │   ├── PageTitle.tsx
│   │   ├── BackLink.tsx
│   │   ├── Button.tsx                ← variants: primary | secondary | destructive | text
│   │   ├── Card.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── Modal.tsx                 ← variants: bottomSheet | centered
│   │   ├── StatusBanner.tsx
│   │   ├── Chip.tsx
│   │   ├── ChipGrid.tsx
│   │   ├── TextareaCard.tsx
│   │   ├── DateCard.tsx
│   │   ├── ViewSwitch.tsx
│   │   ├── PickerButton.tsx
│   │   ├── SuccessCheck.tsx
│   │   ├── ScrollHint.tsx
│   │   ├── NotifPopover.tsx          ← bell-tap notifications popover
│   │   └── icons/                    ← inline SVG icon components
│   │       ├── Chevron.tsx
│   │       ├── Bell.tsx
│   │       └── ...
│   ├── features/                     ← screen-specific composed components
│   │   ├── home/
│   │   │   ├── DogStory.tsx
│   │   │   ├── UpNextCard.tsx
│   │   │   ├── AnnouncementCard.tsx
│   │   │   └── NewBookingSheet.tsx
│   │   ├── bookings/
│   │   │   ├── SessionCard.tsx
│   │   │   ├── PendingCard.tsx
│   │   │   ├── ReportCard.tsx
│   │   │   ├── PastWeeklyStack.tsx
│   │   │   └── SwipeToCancel.tsx
│   │   ├── dog-profile/
│   │   │   ├── DogProfileHero.tsx
│   │   │   ├── SectionTile.tsx
│   │   │   ├── SectionDetailModal.tsx
│   │   │   └── ReportsTile.tsx
│   │   ├── booking-flow/
│   │   │   ├── Calendar.tsx
│   │   │   ├── ReviewByDog.tsx
│   │   │   ├── CreditsSheet.tsx
│   │   │   └── ConfirmedView.tsx
│   │   └── request-detail/
│   │       ├── RequestDetailHeader.tsx
│   │       └── CancelRequestModal.tsx
│   ├── hooks/                        ← orchestration hooks
│   │   ├── useDogs.ts
│   │   ├── useBookings.ts
│   │   ├── useReports.ts
│   │   ├── useMessages.ts
│   │   ├── useNotifications.ts
│   │   └── useFonts.ts
│   ├── services/                     ← business logic (pure-ish functions)
│   │   ├── bookingService.ts
│   │   ├── dogService.ts
│   │   ├── reportService.ts
│   │   ├── messageService.ts
│   │   └── notificationService.ts
│   ├── repositories/                 ← data access (mock now, Supabase later)
│   │   ├── dogRepository.ts
│   │   ├── bookingRepository.ts
│   │   ├── reportRepository.ts
│   │   ├── messageRepository.ts
│   │   └── notificationRepository.ts
│   ├── mock/                         ← mock data (see Mock Data Strategy below)
│   │   ├── dogs.ts
│   │   ├── bookings.ts
│   │   ├── reports.ts
│   │   ├── messages.ts
│   │   ├── announcements.ts
│   │   ├── notifications.ts
│   │   └── README.md
│   ├── types/                        ← TypeScript domain types
│   │   ├── dog.ts
│   │   ├── booking.ts
│   │   ├── report.ts
│   │   ├── message.ts
│   │   └── notification.ts
│   ├── lib/                          ← utility functions
│   │   ├── format.ts                 ← date/time/currency formatters
│   │   └── ...
│   ├── theme.ts                      ← design tokens
│   └── context/                      ← React Context providers
│       ├── AuthContext.tsx           ← mock signed-in user during prototype phase
│       └── ...
├── assets/                           ← fonts (if not via @expo-google-fonts), images, etc.
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
└── ...
```

**Key naming rules:**

- **Screens** live in `mobile/app/` (Expo Router routes). One file = one route.
- **Global UI components** (used on 2+ screens) live in `mobile/src/components/`.
- **Feature-scoped components** (used in one screen or one tab) live in `mobile/src/features/{feature}/`.
- **Hooks** orchestrate. They call services. They don't know about repositories.
- **Services** do business logic. Pure where possible. They call repositories.
- **Repositories** do data. Today they read from `mock/`. Tomorrow they call Supabase. Same interface.
- **Types** are domain types — what a `Dog` is, what a `Booking` is. No framework dependencies.

---

## Architectural rules

### Dependencies point inward

```
Screens (mobile/app)
  ↓ uses
Hooks (src/hooks)
  ↓ uses
Services (src/services)
  ↓ uses
Repositories (src/repositories)
  ↓ uses
Mock data (src/mock) — eventually Supabase
```

**No skipping.** A screen never imports from a repository. A hook never imports a mock data file directly. The chain is always Screen → Hook → Service → Repository → Data Source.

**Rationale:** when the backend lands, we swap *only the repository implementations*. Everything above stays untouched. If a screen has a direct mock-data import buried somewhere, the swap fails. The whole point of this layering is making the eventual backend swap a non-event.

### Components-as-we-go (with the rule of two)

We do **not** build the entire global component library upfront. We build components when a screen needs them.

The rule: **the second time a pattern appears, it gets extracted to `mobile/src/components/`.** First use can live inline in the screen. Second use means it's a pattern, not a coincidence — extract before duplicating.

**Exception:** patterns the DS V2 Component Reuse Map already labels "Global" get built when first needed and placed in `mobile/src/components/` immediately. We don't wait for two uses if the spec already declared it global. Examples: `<Button>`, `<Card>`, `<PageTitle>`, `<BackLink>`, `<Modal>`, `<Chip>`, `<StatusBanner>`.

This rule prevents two failure modes:
- Building components nobody uses
- Inlining the same pattern five times before noticing

### Errors are values, not exceptions

Service and repository functions return a typed Result, not throw:

```ts
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

async function getBooking(id: string): Promise<Result<Booking, BookingError>> { ... }
```

Callers must check `.ok` before using `.value`. TypeScript enforces this. No silent `null` returns, no unhandled exceptions.

For UI rendering errors (component crashes), we use **React Error Boundaries** at the screen level. Each route has an Error Boundary that catches render errors and shows a "Something went wrong, tap to retry" surface from the DS error-copy spec.

### TypeScript strict mode is on, `any` is forbidden without a comment

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

If `any` appears, it must have a comment immediately above explaining why. No exceptions.

### Path aliases

`tsconfig.json` configures `@/*` to point at `mobile/src/*`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Imports use `@/components/Button`, not `../../../components/Button`. Cleaner, refactor-safe.

### Accessibility is correctness

Every interactive element gets:
- `accessibilityRole` (`"button"`, `"link"`, `"checkbox"`, etc.)
- `accessibilityLabel` if icon-only or if the visual text is unclear
- `accessibilityHint` if the action isn't obvious from the label

Tap targets are minimum 44x44pt. Color contrast minimum 4.5:1 on body text.

---

## Mock data strategy

The prototype phase uses **mock data only**. No Supabase, no real backend, no auth. The frontend should **not even notice** when mock data gets swapped for real services later — that's the point of the repository layering.

### Where mock data lives

`mobile/src/mock/` — one file per data type. See `mobile/src/mock/README.md` for the conventions inside that folder.

### How repositories use it

Each repository in `mobile/src/repositories/` is structured to make the mock-to-real swap mechanical:

```ts
// mobile/src/repositories/dogRepository.ts
import { mockDogs } from '@/mock/dogs';
import type { Dog } from '@/types/dog';

// Today: returns mock data with simulated delay
export const dogRepository = {
  async list(): Promise<Dog[]> {
    await new Promise(r => setTimeout(r, 200));  // simulated network
    return mockDogs;
  },

  async findById(id: string): Promise<Dog | null> {
    await new Promise(r => setTimeout(r, 200));
    return mockDogs.find(d => d.id === id) ?? null;
  },
};
```

When Supabase lands, the *implementation* changes but the *interface* stays identical:

```ts
// future
import { supabase } from '@/lib/supabase';

export const dogRepository = {
  async list(): Promise<Dog[]> {
    const { data, error } = await supabase.from('dogs').select('*');
    if (error) throw error;
    return data;
  },
  // ...
};
```

Hooks and services don't change. Screens don't change. The whole frontend keeps working.

### Mock data realism

Per the DS V2 Sample Data section: realistic volumes, not sparse. 30+ reports per dog. 15-25 upcoming sessions. Mixed trainer assignments. Real announcement templates. A couple of example chat threads.

### Simulated latency

All repository calls include a 200-800ms simulated delay so loading states (`useState`-driven `isLoading` flags, spinner UIs, skeleton screens) actually appear during prototype demos. Without delay, content flashes in instantly and we can't see the loading UX.

For pull-to-refresh specifically (per the DS), use ~800ms. For routine list fetches, ~200-400ms.

### What's intentionally NOT mocked

- **Real authentication.** `AuthContext` exposes a hardcoded mock user (`{ id: 'allison-1', name: 'Allison Frye' }`). No login screen actually validates anything.
- **Real Stripe.** Payment buttons (Save, Buy, Charge) are visual stubs — they trigger the success checkmark animation but no money moves.
- **Real push notifications.** Notification copy templates are documented in the DS, but no native push fires. The bell popover shows mock notifications from `mock/notifications.ts`.

These are explicit gaps. They get filled in later phases — see PHASE-PLAN.md.

---

## Build, run, deploy (current phase)

- **Run dev:** `cd mobile && npx expo start`
- **iOS sim:** press `i` in the Expo CLI
- **Android emu:** press `a`
- **Physical device:** scan the QR code with Expo Go (iOS) or the Expo Dev Client app (Android)
- **No production builds yet.** EAS Build / TestFlight / Play Store internal testing all come later — see PHASE-PLAN.md.

---

## When to update this file

Update this file when:

- A core technical decision changes (state library, navigation library, styling approach, project structure)
- A new architectural rule emerges from real production experience on this codebase
- A deferred decision (Stripe integration, notifications, real backend) becomes current

Don't update this file for:

- Routine component additions (those go in `nwa-design-system-v2.md` if they're patterns)
- Phase scope changes (those go in `PHASE-PLAN.md`)
- Personality or process tweaks (those go in `CLAUDE.md`)
