import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';

@Entity('feed_items')
export class FeedItem extends BaseEntity {
  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  name: string; // e.g., "Hay", "Corn", "Pellets"

  @Column({ nullable: true })
  description?: string;

  @Column()
  unit: string; // e.g., "kg", "bag", "liters"

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unit_cost?: number;

  @Column({ default: true })
  is_active: boolean;
}
