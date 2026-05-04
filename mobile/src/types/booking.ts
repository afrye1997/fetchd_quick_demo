import type { DogId, ServiceCategory } from './dog';

export type BookingId = string;

export type BookingStatus = 'upcoming' | 'past' | 'pending' | 'cancelled';

export type Trainer = 'Donovan' | 'Ashe' | 'Amber' | 'Rachel';

export type Booking = {
  id: BookingId;
  dogId: DogId;
  category: ServiceCategory;
  status: BookingStatus;
  date: Date;
  trainer?: Trainer;
  durationMinutes?: number;
  notes?: string;
};

export type PendingRequest = {
  id: BookingId;
  dogId: DogId;
  category: ServiceCategory;
  submittedAt: Date;
  preferredDates: Date[];
  notes?: string;
  focusAreas?: string[];
  lengthWeeks?: number; // board-and-train only
};
