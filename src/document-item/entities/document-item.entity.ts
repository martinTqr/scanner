import { IsNumber, IsOptional, IsString } from 'class-validator';
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
import { Document } from '../../document/entities/document.entity';

// Use the same names for the fields in the process defined
@Entity('document_item')
export class DocumentItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  code: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  remito: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  order: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  name: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  dimensions: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  unit: string;

  @Column({ type: 'float', default: 0 })
  quantity: number;

  @Column({ type: 'float', default: 0 })
  unitPrice: number;

  @Column({ name: 'bonus_1', type: 'varchar', length: 255, default: '' })
  bonus1: string;

  @Column({ name: 'bonus_2', type: 'varchar', length: 255, default: '' })
  bonus2: string;

  @Column({ name: 'bonus_3', type: 'varchar', length: 255, default: '' })
  bonus3: string;

  @Column({ name: 'bonus_4', type: 'varchar', length: 255, default: '' })
  bonus4: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  weight: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  length: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  thickness: string;

  @Column({ type: 'float', default: 0 })
  amount: number;

  @ManyToOne(() => Document, (document) => document.items)
  @JoinColumn({ name: 'document_id' })
  document: Document;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}

export class EditItemDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  remito: string;

  @IsOptional()
  @IsString()
  order: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  dimensions: string;

  @IsOptional()
  @IsString()
  unit: string;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsString()
  bonus1: string;

  @IsOptional()
  @IsString()
  bonus2: string;

  @IsOptional()
  @IsString()
  bonus3: string;

  @IsOptional()
  @IsString()
  bonus4: string;

  @IsOptional()
  @IsString()
  weight: string;

  @IsOptional()
  @IsString()
  length: string;

  @IsOptional()
  @IsString()
  thickness: string;

  @IsOptional()
  @IsString()
  long: string;

  @IsOptional()
  @IsNumber()
  amount: number;
}

export class EditItemByDocumentDto extends EditItemDto {
  @IsNumber()
  id: number;
}
