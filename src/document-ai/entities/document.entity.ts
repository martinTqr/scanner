import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentTax } from '../../document-tax/entities/document-tax.entity';
import { DocumentItem } from '../../document-item/entities/document-item.entity';
import { DocumentType, ReceiptType } from '../intefaces/document-ai.interfaces';

// Use the same names for the fields in the process defined
@Entity('document')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    nullable: true,
    name: 'provider_name',
    type: 'varchar',
    length: 255,
  })
  providerName: string;

  @Column({
    name: 'provider_cuit',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  providerCuit: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  code: string;

  @Column({ nullable: true, type: 'datetime' })
  date: string;

  @Column({ nullable: true, name: 'expiration_date', type: 'datetime' })
  expirationDate: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  description: string;

  @OneToMany(() => DocumentItem, (document) => document.document, {
    nullable: true,
    eager: true,
  })
  items: DocumentItem[];

  @OneToMany(() => DocumentTax, (document) => document.document, {
    nullable: true,
    eager: true,
  })
  taxes?: DocumentTax[];

  @Column({ type: 'enum', enum: DocumentType, nullable: true })
  documentType: DocumentType;

  @Column({ type: 'enum', enum: ReceiptType, nullable: true })
  receiptType: ReceiptType;

  @Column({ type: 'uuid' })
  batch: string;

  @Column({ name: 'file_name', type: 'varchar', length: 255, default: '' })
  fileName?: string;

  @Column({ name: 'user_id', type: 'varchar', length: 255, default: '' })
  userId: string;

  @Column({ type: 'float', nullable: true })
  confidence?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
