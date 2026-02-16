import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Animal } from './animal.entity';
export declare class BirthEvent extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    mother_id: string;
    mother: Animal;
    father_id?: string;
    father?: Animal;
    offspring_id: string;
    offspring: Animal;
    birth_date: Date;
    birth_weight?: number;
    birth_type?: string;
    notes?: string;
}
