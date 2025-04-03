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
  name: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  description: string;

  @Column({ type: 'float', default: 0 })
  quantity: number;

  @Column({ type: 'float', default: 0 })
  unitPrice: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  bonus: string;

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
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsString()
  bonus: string;

  @IsOptional()
  @IsNumber()
  amount: number;
}

export class EditItemByDocumentDto extends EditItemDto {
  @IsNumber()
  id: number;
}
