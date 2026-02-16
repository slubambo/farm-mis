import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  entity_type: string; // e.g., "Animal", "Sale", "Expense"

  @Column()
  entity_id: string;

  @Column()
  action: string; // "CREATE", "UPDATE", "DELETE"

  @Column({ type: 'jsonb', nullable: true })
  old_values?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  new_values?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ nullable: true })
  ip_address?: string;

  @Column({ nullable: true })
  user_agent?: string;
}
