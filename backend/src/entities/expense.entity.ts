import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Branch } from './branch.entity';
import { User } from './user.entity';

export enum ExpenseStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Entity('expenses')
export class Expense extends BaseEntity {
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
  expense_date: Date;

  @Column()
  category: string; // e.g., "Feed", "Veterinary", "Labor", "Utilities", "Transport"

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  payment_method?: string;

  @Column({ nullable: true })
  receipt_url?: string;

  @Column({
    type: 'enum',
    enum: ExpenseStatus,
    default: ExpenseStatus.PENDING,
  })
  status: ExpenseStatus;

  @Column()
  recorded_by_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recorded_by_id' })
  recorded_by: User;

  @Column({ nullable: true })
  approved_by_id?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by_id' })
  approved_by?: User;

  @Column({ type: 'timestamp', nullable: true })
  approved_at?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
