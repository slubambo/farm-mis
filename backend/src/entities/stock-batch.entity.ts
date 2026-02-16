import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { FeedItem } from './feed-item.entity';
import { Branch } from './branch.entity';

@Entity('stock_batches')
export class StockBatch extends BaseEntity {
  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  feed_item_id: string;

  @ManyToOne(() => FeedItem)
  @JoinColumn({ name: 'feed_item_id' })
  feed_item: FeedItem;

  @Column()
  branch_id: string;

  @ManyToOne(() => Branch)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column()
  batch_number: string;

  @Column({ type: 'date' })
  purchase_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_cost: number;

  @Column({ nullable: true })
  supplier?: string;

  @Column({ type: 'date', nullable: true })
  expiry_date?: Date;
}
