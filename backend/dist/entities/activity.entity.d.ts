import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Animal } from './animal.entity';
import { ActivityType } from './activity-type.entity';
import { User } from './user.entity';
export declare class Activity extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    animal_id: string;
    animal: Animal;
    activity_type_id: string;
    activity_type: ActivityType;
    performed_at: Date;
    performed_by_id: string;
    performed_by: User;
    notes?: string;
    metadata?: Record<string, any>;
}
