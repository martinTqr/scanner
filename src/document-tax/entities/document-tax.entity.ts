import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Document } from '../../document/entities/document.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Use the same names for the fields in the process defined
@Entity('document_tax')
export class DocumentTax {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  name: string;

  @Column({ type: 'float', default: 0 })
  value: number;

  @ManyToOne(() => Document, (document) => document.taxes, { nullable: true })
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

export class EditTax {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  value: number;
}

export class EditTaxByDocument extends EditTax {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
