import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentItem } from './document-item.entity';

// Use the same names for the fields in the process defined
@Entity('document')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  provider: string;

  @Column({ name: 'provider_cuit', type: 'varchar', length: 255 })
  providerCuit: string;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  date: string;

  @Column({ name: 'expiration_date', type: 'varchar', length: 255 })
  expirationDate: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @OneToMany(() => DocumentItem, (document) => document.document)
  items: DocumentItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
