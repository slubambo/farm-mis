import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
export declare enum PartnerType {
    CUSTOMER = "Customer",
    SUPPLIER = "Supplier",
    BOTH = "Both"
}
export declare class Partner extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    name: string;
    partner_type: PartnerType;
    phone?: string;
    email?: string;
    address?: string;
    is_active: boolean;
    notes?: string;
}
