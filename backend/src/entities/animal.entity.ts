import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Branch } from './branch.entity';
import { HousingUnit } from './housing-unit.entity';

export enum AnimalStatus {
  ACTIVE = 'Active',
  SOLD = 'Sold',
  DEAD = 'Dead',
  TRANSFERRED = 'Transferred',
}

@Entity('animals')
export class Animal extends BaseEntity {
  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  branch_id: string;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ nullable: true })
  housing_unit_id?: string;

  @ManyToOne(() => HousingUnit, { nullable: true })
  @JoinColumn({ name: 'housing_unit_id' })
  housing_unit?: HousingUnit;

  @Column()
  species: string; // e.g., "Cattle", "Goat", "Sheep", "Pig", "Chicken"

  @Column({ nullable: true })
  breed?: string;

  @Column({ unique: true })
  tag_number: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  sex?: string; // "Male", "Female"

  @Column({ type: 'date', nullable: true })
  date_of_birth?: Date;

  @Column({ type: 'date' })
  intake_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  intake_weight?: number; // in kg

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  current_weight?: number; // in kg

  @Column({
    type: 'enum',
    enum: AnimalStatus,
    default: AnimalStatus.ACTIVE,
  })
  status: AnimalStatus;

  @Column({ nullable: true })
  sire_tag?: string; // Father's tag number

  @Column({ nullable: true })
  dam_tag?: string; // Mother's tag number

  @Column({ type: 'jsonb', nullable: true })
  notes?: Record<string, any>;
}
