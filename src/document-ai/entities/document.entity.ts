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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
