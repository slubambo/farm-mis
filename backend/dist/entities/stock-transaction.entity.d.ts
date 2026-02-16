import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { FeedItem } from './feed-item.entity';
import { Branch } from './branch.entity';
import { User } from './user.entity';
import { StockBatch } from './stock-batch.entity';
export declare enum TransactionType {
    PURCHASE = "Purchase",
    USAGE = "Usage",
    ADJUSTMENT = "Adjustment",
    TRANSFER = "Transfer"
}
export declare class StockTransaction extends BaseEntity {
    tenant_id: string;
    tenant: Tenant;
    feed_item_id: string;
    feed_item: FeedItem;
    branch_id: string;
    branch: Branch;
    transaction_type: TransactionType;
    quantity: number;
    transaction_date: Date;
    recorded_by_id: string;
    recorded_by: User;
    notes?: string;
    batch_id?: string;
    batch?: StockBatch;
}
