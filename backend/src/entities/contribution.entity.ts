import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

export enum ContributionType {
  CAPITAL = 'Capital',
  LOAN = 'Loan',
}

@Entity('contributions')
export class Contribution extends BaseEntity {
  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  contributor_name: string;

  @Column({
    type: 'enum',
    enum: ContributionType,
  })
  contribution_type: ContributionType;

  @Column({ type: 'date' })
  contribution_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  interest_rate?: number; // For loans

  @Column({ type: 'date', nullable: true })
  due_date?: Date; // For loans

  @Column({ default: false })
  is_repaid: boolean;

  @Column()
  recorded_by_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recorded_by_id' })
  recorded_by: User;

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
