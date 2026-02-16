import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { FeedItem } from './feed-item.entity';
import { Branch } from './branch.entity';
import { User } from './user.entity';
import { StockBatch } from './stock-batch.entity';

export enum TransactionType {
  PURCHASE = 'Purchase',
  USAGE = 'Usage',
  ADJUSTMENT = 'Adjustment',
  TRANSFER = 'Transfer',
}

@Entity('stock_transactions')
export class StockTransaction extends BaseEntity {
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

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transaction_type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number; // positive for purchase/adjustment, negative for usage

  @Column({ type: 'date' })
  transaction_date: Date;

  @Column()
  recorded_by_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recorded_by_id' })
  recorded_by: User;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  batch_id?: string;

  @ManyToOne(() => StockBatch, { nullable: true })
  @JoinColumn({ name: 'batch_id' })
  batch?: StockBatch;
}
