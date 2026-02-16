import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Branch } from './branch.entity';
import { User } from './user.entity';
export declare enum ExpenseStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    REJECTED = "Rejected"
}
export declare class Expense extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    branch_id: string;
    branch: Branch;
    expense_date: Date;
    category: string;
    description: string;
    amount: number;
    payment_method?: string;
    receipt_url?: string;
    status: ExpenseStatus;
    recorded_by_id: string;
    recorded_by: User;
    approved_by_id?: string;
    approved_by?: User;
    approved_at?: Date;
    notes?: string;
}
