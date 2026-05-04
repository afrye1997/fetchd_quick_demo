export type DogId = string;

export type ServiceCategory =
  | 'day-school'
  | 'day-care'
  | 'group-class'
  | 'private-lesson'
  | 'board-and-train'
  | 'boarding';

export type Vaccine = {
  name: string;
  expiresAt: Date;
};

export type Medication = {
  id: string;
  name: string;
  dose: string;
  frequency: string;
};

export type FeedingInstructions = {
  brand: string;
  amount: string;
  frequency: string;
  notes?: string;
};

export type Dog = {
  id: DogId;
  name: string;
  breed: string;
  ageYears: number;
  profileImagePath: string;
  vaccines: Vaccine[];
  medications: Medication[];
  feeding: FeedingInstructions;
  specialNotes: string;
};
