import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from '../../document/entities/document.entity';

@Entity('document_details')
export class DocumentDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: true })
  confidence: number;

  @Column({ name: 'file_name', type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'uuid' })
  batch: string;

  @Column({ name: 'user_id', type: 'varchar', length: 255, default: '' })
  userId: string;

  @OneToOne(() => Document, (document) => document.details)
  @JoinColumn({ name: 'document_id' })
  document: Document;
}
