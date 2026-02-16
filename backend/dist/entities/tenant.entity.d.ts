import { BaseEntity } from './base.entity';
export declare class Tenant extends BaseEntity {
    name: string;
    slug: string;
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    is_active: boolean;
    settings?: Record<string, any>;
}
