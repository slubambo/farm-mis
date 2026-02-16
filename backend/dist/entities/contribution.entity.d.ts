import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';
export declare enum ContributionType {
    CAPITAL = "Capital",
    LOAN = "Loan"
}
export declare class Contribution extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    contributor_name: string;
    contribution_type: ContributionType;
    contribution_date: Date;
    amount: number;
    interest_rate?: number;
    due_date?: Date;
    is_repaid: boolean;
    recorded_by_id: string;
    recorded_by: User;
    notes?: string;
}
