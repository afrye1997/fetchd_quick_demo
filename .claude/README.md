# mobile/src/mock/ — Mock data conventions

This folder holds **all mock data for the prototype phase.** No real backend, no Supabase. The repository layer (`mobile/src/repositories/`) reads from these files; everything above the repository layer doesn't know mock data exists.

When the backend lands, the repository implementations swap from `import { mockDogs } from '@/mock/dogs'` to real Supabase queries. Files in this folder become unused but stay around as reference / test fixtures.

For the strategy and rationale, see `ARCHITECTURE.md` → "Mock data strategy" at the repo root.

---

## File-per-data-type

One file per top-level entity:

```
mock/
├── dogs.ts                ← Waffles, Lola, Brodie with full profiles
├── bookings.ts            ← upcoming + past + pending bookings
├── reports.ts             ← 30+ report cards per dog
├── messages.ts            ← chat threads + messages
├── announcements.ts       ← home page announcement cards
├── notifications.ts       ← bell popover entries
└── README.md              ← (this file)
```

Don't combine entities into a single `mock/all.ts`. One file per entity keeps imports targeted and refactors clean.

---

## Conventions

### Realistic volumes

Per `nwa-design-system-v2.md` → Sample data:

- **dogs.ts** — exactly 3: Waffles (Golden, 3yr), Lola (Golden, 5yr), Brodie (Mixed, 7yr)
- **bookings.ts** — 15-25 upcoming per dog, 30+ past per dog, 1-3 active pending
- **reports.ts** — 30+ per dog, spanning multiple months, mixed session types
- **announcements.ts** — 4-8 cards using the real templates ("Yappy Hour Saturday", "Closed Memorial Day", "Rachel joins the team", "Puppy class signups open")
- **messages.ts** — 2-3 threads (Allison ↔ Shanthi as the primary, plus 1-2 staff), 5-10 messages per thread
- **notifications.ts** — 5-10 entries, mix of read/unread, mix of types (report / message / confirmation / announcement)

### Realistic content

- Trainer assignments are random across Donovan, Ashe, Amber, Rachel
- Excerpts on report cards are real-feeling trainer narratives — never generic ("good session", "did well")
- Chat messages use natural voice. Real clients use 🐾 🐶 ❤️ — these are fine in mock messages (and only in mock messages, never in app UI chrome)
- Dates should be realistic relative to "today" — recent past dates for past bookings, near-future for upcoming, current time for pending submissions

### Stable IDs

Every mock entity has a stable string ID. Use kebab-case prefixed by entity:

```ts
const mockDogs: Dog[] = [
  { id: 'dog-waffles', name: 'Waffles', breed: 'Golden Retriever', ageYears: 3, ... },
  { id: 'dog-lola', name: 'Lola', breed: 'Golden Retriever', ageYears: 5, ... },
  { id: 'dog-brodie', name: 'Brodie', breed: 'Mixed Breed', ageYears: 7, ... },
];

const mockBookings: Booking[] = [
  { id: 'booking-001', dogId: 'dog-waffles', type: 'day-school', ... },
  ...
];
```

Why kebab-case-with-prefix: searchable, readable, and clearly distinguishable from real UUIDs that the backend will produce later. When the backend lands, `dog-waffles` becomes a real UUID — the *shape* of references stays identical.

### Domain types come from `mobile/src/types/`

Mock data files import their types from `mobile/src/types/`. Don't redefine types in the mock files.

```ts
// mock/dogs.ts
import type { Dog } from '@/types/dog';

export const mockDogs: Dog[] = [ ... ];
```

This way, when the type definition changes, TypeScript surfaces every mock entry that needs updating.

### Cross-references via ID, not nested objects

A `Booking` references a `Dog` by `dogId: string`, not by embedding a full `Dog` object. This mirrors how a real database returns data and prevents stale duplicates of the same entity living in multiple files.

```ts
// good
const mockBookings: Booking[] = [
  { id: 'booking-001', dogId: 'dog-waffles', type: 'day-school', date: ... }
];

// bad — duplicates the Dog object across every booking
const mockBookings = [
  { id: 'booking-001', dog: { id: 'dog-waffles', name: 'Waffles', ... }, ... }
];
```

When a screen needs a booking with its dog data, the hook handles the join by calling `dogRepository.findById(booking.dogId)` — exactly how it'll work with real Supabase.

---

## Don't put behavior in mock files

Mock files contain **data only** — arrays of typed objects, exported as `const`. No functions, no side effects, no state.

Repositories add the behavior (simulated network delay, filtering, sorting, pagination). The split is intentional: keep the *data* simple and obvious, keep the *querying logic* in one place where it'll be replaced wholesale when the backend lands.

```ts
// mock/dogs.ts — DATA ONLY
export const mockDogs: Dog[] = [ ... ];

// repositories/dogRepository.ts — BEHAVIOR
export const dogRepository = {
  async list(): Promise<Dog[]> {
    await sleep(200);  // simulated network
    return mockDogs;
  },
  async findById(id: string): Promise<Dog | null> {
    await sleep(200);
    return mockDogs.find(d => d.id === id) ?? null;
  },
};
```

---

## When real data arrives

When the backend wiring phase begins:

1. The repositories in `mobile/src/repositories/` get rewritten to query Supabase
2. The mock files in this folder stay around as fixtures for tests (eventually)
3. The hook layer, service layer, and screens **don't change at all**

If you find yourself wanting to change anything above the repository layer to wire in real data, something in the architecture is wrong — surface it before continuing.
