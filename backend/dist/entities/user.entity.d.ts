import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
export declare enum UserRole {
    OWNER = "Owner",
    MANAGER = "Manager",
    ACCOUNTANT = "Accountant",
    CARETAKER = "Caretaker",
    VIEWER = "Viewer"
}
export declare class User extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    full_name: string;
    email: string;
    password_hash: string;
    role: UserRole;
    phone?: string;
    is_active: boolean;
    last_login_at?: Date;
}
