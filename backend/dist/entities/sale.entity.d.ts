import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Branch } from './branch.entity';
import { User } from './user.entity';
export declare class Sale extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    branch_id: string;
    branch: Branch;
    sale_date: Date;
    customer_name: string;
    customer_phone?: string;
    sale_items: Array<{
        animal_id?: string;
        item_description: string;
        quantity: number;
        unit_price: number;
        total: number;
    }>;
    total_amount: number;
    amount_paid: number;
    balance: number;
    payment_method?: string;
    recorded_by_id: string;
    recorded_by: User;
    notes?: string;
}
