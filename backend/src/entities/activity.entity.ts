import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Animal } from './animal.entity';
import { ActivityType } from './activity-type.entity';
import { User } from './user.entity';

@Entity('activities')
export class Activity extends BaseEntity {
  @Column()
  tenant_id: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @Column()
  animal_id: string;

  @ManyToOne(() => Animal)
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;

  @Column()
  activity_type_id: string;

  @ManyToOne(() => ActivityType)
  @JoinColumn({ name: 'activity_type_id' })
  activity_type: ActivityType;

  @Column({ type: 'timestamp' })
  performed_at: Date;

  @Column()
  performed_by_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performed_by_id' })
  performed_by: User;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>; // For extensible fields like weight, temperature, etc.
}
