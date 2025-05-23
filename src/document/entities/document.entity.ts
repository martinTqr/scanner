import { DocumentDetails } from '../../document-details/entities/document-details.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentItem } from '../../document-item/entities/document-item.entity';
import { DocumentTax } from '../../document-tax/entities/document-tax.entity';
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

  @Column({ nullable: true, type: 'varchar', length: 1000 })
  observations: string;

  @OneToMany(() => DocumentItem, (document) => document.document, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  items: DocumentItem[];

  @OneToMany(() => DocumentTax, (document) => document.document, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  taxes?: DocumentTax[];

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: DocumentType,
    nullable: true,
  })
  documentType: DocumentType;

  @OneToOne(
    () => DocumentDetails,
    (documentDetails) => documentDetails.document,
    { eager: true },
  )
  @JoinColumn({ name: 'document_id' })
  details: DocumentDetails;

  @Column({
    name: 'receipt_type',
    type: 'enum',
    enum: ReceiptType,
    nullable: true,
  })
  receiptType: ReceiptType;

  @Column({
    name: 'sell_condition',
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  sellCondition: string;

  @Column({
    name: 'cae_number',
    type: 'bigint',
  })
  caeNumber: number;

  @Column({
    name: 'cae_expiration_date',
    nullable: true,
    type: 'datetime',
  })
  caeExpirationDate: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  currency: string;

  @Column({
    type: 'decimal',
    default: 0,
    scale: 2,
    precision: 10,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  total: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
