import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Animal } from './animal.entity';
import { Branch } from './branch.entity';
import { User } from './user.entity';

@Entity('sales')
export class Sale extends BaseEntity {
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

  @Column({ type: 'date' })
  sale_date: Date;

  @Column()
  customer_name: string;

  @Column({ nullable: true })
  customer_phone?: string;

  @Column({ type: 'jsonb' })
  sale_items: Array<{
    animal_id?: string;
    item_description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount_paid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @Column({ nullable: true })
  payment_method?: string; // "Cash", "Mobile Money", "Bank Transfer"

  @Column()
  recorded_by_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recorded_by_id' })
  recorded_by: User;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
