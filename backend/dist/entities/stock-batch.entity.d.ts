import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { FeedItem } from './feed-item.entity';
import { Branch } from './branch.entity';
export declare class StockBatch extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    feed_item_id: string;
    feed_item: FeedItem;
    branch_id: string;
    branch: Branch;
    batch_number: string;
    purchase_date: Date;
    quantity: number;
    unit_cost: number;
    total_cost: number;
    supplier?: string;
    expiry_date?: Date;
}
