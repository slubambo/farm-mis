"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockTransaction = exports.TransactionType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const feed_item_entity_1 = require("./feed-item.entity");
const branch_entity_1 = require("./branch.entity");
const user_entity_1 = require("./user.entity");
const stock_batch_entity_1 = require("./stock-batch.entity");
var TransactionType;
(function (TransactionType) {
    TransactionType["PURCHASE"] = "Purchase";
    TransactionType["USAGE"] = "Usage";
    TransactionType["ADJUSTMENT"] = "Adjustment";
    TransactionType["TRANSFER"] = "Transfer";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let StockTransaction = class StockTransaction extends base_entity_1.BaseEntity {
    tenant_id;
    tenant;
    feed_item_id;
    feed_item;
    branch_id;
    branch;
    transaction_type;
    quantity;
    transaction_date;
    recorded_by_id;
    recorded_by;
    notes;
    batch_id;
    batch;
};
exports.StockTransaction = StockTransaction;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockTransaction.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], StockTransaction.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockTransaction.prototype, "feed_item_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => feed_item_entity_1.FeedItem),
    (0, typeorm_1.JoinColumn)({ name: 'feed_item_id' }),
    __metadata("design:type", feed_item_entity_1.FeedItem)
], StockTransaction.prototype, "feed_item", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockTransaction.prototype, "branch_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], StockTransaction.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransactionType,
    }),
    __metadata("design:type", String)
], StockTransaction.prototype, "transaction_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], StockTransaction.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], StockTransaction.prototype, "transaction_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockTransaction.prototype, "recorded_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'recorded_by_id' }),
    __metadata("design:type", user_entity_1.User)
], StockTransaction.prototype, "recorded_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockTransaction.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StockTransaction.prototype, "batch_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_batch_entity_1.StockBatch, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'batch_id' }),
    __metadata("design:type", stock_batch_entity_1.StockBatch)
], StockTransaction.prototype, "batch", void 0);
exports.StockTransaction = StockTransaction = __decorate([
    (0, typeorm_1.Entity)('stock_transactions')
], StockTransaction);
//# sourceMappingURL=stock-transaction.entity.js.map