import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
export declare class Branch extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    name: string;
    location?: string;
    contact_person?: string;
    phone?: string;
    is_active: boolean;
}
