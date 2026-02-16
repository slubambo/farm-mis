import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
export declare class FeedItem extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    name: string;
    description?: string;
    unit: string;
    unit_cost?: number;
    is_active: boolean;
}
