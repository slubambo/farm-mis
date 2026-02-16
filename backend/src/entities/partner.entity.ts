import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';

export enum PartnerType {
  CUSTOMER = 'Customer',
  SUPPLIER = 'Supplier',
  BOTH = 'Both',
}

@Entity('partners')
export class Partner extends BaseEntity {
  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: PartnerType,
  })
  partner_type: PartnerType;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
