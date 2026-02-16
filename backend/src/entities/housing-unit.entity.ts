import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Branch } from './branch.entity';

@Entity('housing_units')
export class HousingUnit extends BaseEntity {
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

  @Column()
  name: string;

  @Column({ nullable: true })
  type?: string; // e.g., "Pen", "Cage", "Pasture"

  @Column({ type: 'int', nullable: true })
  capacity?: number;

  @Column({ default: true })
  is_active: boolean;
}
