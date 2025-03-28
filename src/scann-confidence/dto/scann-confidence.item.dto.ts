import { Entities } from '../entities/scann-confidence.entity';

export interface NewScannConfidence {
  entity: Entities;
  field: string;
  score: number;
}
