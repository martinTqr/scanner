import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Entities {
  DOCUMENT = 'Document',
  DOCUMNET_ITEM = 'DocumentItem',
  DOCUMENT_TAX = 'DocumentTax',
}

@Entity('scann_confidence')
export class ScannConfidence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Entities, nullable: true })
  entity: Entities;

  @Column({ type: 'varchar', length: 255 })
  field: string;

  @Column({ type: 'int' })
  score: number;
}
