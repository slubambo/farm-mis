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
exports.StockBatch = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const feed_item_entity_1 = require("./feed-item.entity");
const branch_entity_1 = require("./branch.entity");
let StockBatch = class StockBatch extends base_entity_1.BaseEntity {
    tenant_id;
    tenant;
    feed_item_id;
    feed_item;
    branch_id;
    branch;
    batch_number;
    purchase_date;
    quantity;
    unit_cost;
    total_cost;
    supplier;
    expiry_date;
};
exports.StockBatch = StockBatch;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockBatch.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], StockBatch.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockBatch.prototype, "feed_item_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => feed_item_entity_1.FeedItem),
    (0, typeorm_1.JoinColumn)({ name: 'feed_item_id' }),
    __metadata("design:type", feed_item_entity_1.FeedItem)
], StockBatch.prototype, "feed_item", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockBatch.prototype, "branch_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], StockBatch.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockBatch.prototype, "batch_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], StockBatch.prototype, "purchase_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], StockBatch.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], StockBatch.prototype, "unit_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], StockBatch.prototype, "total_cost", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StockBatch.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], StockBatch.prototype, "expiry_date", void 0);
exports.StockBatch = StockBatch = __decorate([
    (0, typeorm_1.Entity)('stock_batches')
], StockBatch);
//# sourceMappingURL=stock-batch.entity.js.map