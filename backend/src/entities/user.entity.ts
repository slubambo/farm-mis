import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';

export enum UserRole {
  OWNER = 'Owner',
  MANAGER = 'Manager',
  ACCOUNTANT = 'Accountant',
  CARETAKER = 'Caretaker',
  VIEWER = 'Viewer',
}

@Entity('users')
export class User extends BaseEntity {
  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role: UserRole;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at?: Date;
}
