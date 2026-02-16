import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Branch } from './branch.entity';
import { HousingUnit } from './housing-unit.entity';
export declare enum AnimalStatus {
    ACTIVE = "Active",
    SOLD = "Sold",
    DEAD = "Dead",
    TRANSFERRED = "Transferred"
}
export declare class Animal extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    branch_id: string;
    branch: Branch;
    housing_unit_id?: string;
    housing_unit?: HousingUnit;
    species: string;
    breed?: string;
    tag_number: string;
    name?: string;
    sex?: string;
    date_of_birth?: Date;
    intake_date: Date;
    intake_weight?: number;
    current_weight?: number;
    status: AnimalStatus;
    sire_tag?: string;
    dam_tag?: string;
    notes?: Record<string, any>;
}
