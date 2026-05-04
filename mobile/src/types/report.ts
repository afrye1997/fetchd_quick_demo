import type { DogId, ServiceCategory } from './dog';
import type { Trainer } from './booking';

export type ReportId = string;

export type ReportProgram =
  | 'foundation'
  | 'advanced'
  | 'loose-leash'
  | 'house-manners'
  | 'cgc';

export type Report = {
  id: ReportId;
  dogId: DogId;
  date: Date;
  trainer: Trainer;
  category: ServiceCategory;
  program: ReportProgram;
  excerpt: string;
  fullText: string;
};
