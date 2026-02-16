import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Branch } from './branch.entity';
import { User } from './user.entity';

export enum PayrollStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
}

@Entity('payroll_entries')
export class PayrollEntry extends BaseEntity {
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
  worker_name: string;

  @Column({ nullable: true })
  worker_phone?: string;

  @Column({ type: 'date' })
  period_start: Date;

  @Column({ type: 'date' })
  period_end: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PayrollStatus,
    default: PayrollStatus.PENDING,
  })
  status: PayrollStatus;

  @Column({ type: 'date', nullable: true })
  paid_date?: Date;

  @Column({ nullable: true })
  payment_method?: string;

  @Column()
  recorded_by_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recorded_by_id' })
  recorded_by: User;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
