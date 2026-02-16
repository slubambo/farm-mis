import { Tenant } from './tenant.entity';
import { User } from './user.entity';
export declare class AuditLog {
    id: string;
    tenant_id: string;
    tenant: Tenant;
    user_id: string;
    user: User;
    entity_type: string;
    entity_id: string;
    action: string;
    old_values?: Record<string, any>;
    new_values?: Record<string, any>;
    created_at: Date;
    ip_address?: string;
    user_agent?: string;
}
