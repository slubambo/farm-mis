import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';

@Entity('activity_types')
export class ActivityType extends BaseEntity {
  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  name: string; // e.g., "Feeding", "Vaccination", "Weight Check", "Treatment"

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ default: true })
  is_active: boolean;
}
