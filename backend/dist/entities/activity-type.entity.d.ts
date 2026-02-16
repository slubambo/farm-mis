import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
export declare class ActivityType extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    name: string;
    description?: string;
    icon?: string;
    is_active: boolean;
}
