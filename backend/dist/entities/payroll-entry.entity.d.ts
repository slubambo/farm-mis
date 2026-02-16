import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Branch } from './branch.entity';
import { User } from './user.entity';
export declare enum PayrollStatus {
    PENDING = "Pending",
    PAID = "Paid"
}
export declare class PayrollEntry extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    branch_id: string;
    branch: Branch;
    worker_name: string;
    worker_phone?: string;
    period_start: Date;
    period_end: Date;
    amount: number;
    status: PayrollStatus;
    paid_date?: Date;
    payment_method?: string;
    recorded_by_id: string;
    recorded_by: User;
    notes?: string;
}
