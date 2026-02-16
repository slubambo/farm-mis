import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  logo_url?: string;

  @Column({ nullable: true })
  primary_color?: string;

  @Column({ nullable: true })
  secondary_color?: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings?: Record<string, any>;
}
