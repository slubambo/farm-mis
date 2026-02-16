import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Animal } from './animal.entity';

@Entity('birth_events')
export class BirthEvent extends BaseEntity {
  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  mother_id: string;

  @ManyToOne(() => Animal)
  @JoinColumn({ name: 'mother_id' })
  mother: Animal;

  @Column({ nullable: true })
  father_id?: string;

  @ManyToOne(() => Animal, { nullable: true })
  @JoinColumn({ name: 'father_id' })
  father?: Animal;

  @Column()
  offspring_id: string;

  @ManyToOne(() => Animal)
  @JoinColumn({ name: 'offspring_id' })
  offspring: Animal;

  @Column({ type: 'date' })
  birth_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  birth_weight?: number; // in kg

  @Column({ nullable: true })
  birth_type?: string; // "Natural", "Assisted", "C-Section"

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
