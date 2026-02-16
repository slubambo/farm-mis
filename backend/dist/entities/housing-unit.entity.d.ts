import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Branch } from './branch.entity';
export declare class HousingUnit extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    branch_id: string;
    branch: Branch;
    name: string;
    type?: string;
    capacity?: number;
    is_active: boolean;
}
