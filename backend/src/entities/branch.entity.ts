import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';

@Entity('branches')
export class Branch extends BaseEntity {
  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  name: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  contact_person?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: true })
  is_active: boolean;
}
