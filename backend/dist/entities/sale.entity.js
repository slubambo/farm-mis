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
exports.Sale = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const branch_entity_1 = require("./branch.entity");
const user_entity_1 = require("./user.entity");
let Sale = class Sale extends base_entity_1.BaseEntity {
    tenant_id;
    tenant;
    branch_id;
    branch;
    sale_date;
    customer_name;
    customer_phone;
    sale_items;
    total_amount;
    amount_paid;
    balance;
    payment_method;
    recorded_by_id;
    recorded_by;
    notes;
};
exports.Sale = Sale;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sale.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Sale.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sale.prototype, "branch_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], Sale.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Sale.prototype, "sale_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sale.prototype, "customer_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Sale.prototype, "customer_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], Sale.prototype, "sale_items", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Sale.prototype, "total_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "amount_paid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Sale.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sale.prototype, "recorded_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'recorded_by_id' }),
    __metadata("design:type", user_entity_1.User)
], Sale.prototype, "recorded_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Sale.prototype, "notes", void 0);
exports.Sale = Sale = __decorate([
    (0, typeorm_1.Entity)('sales')
], Sale);
//# sourceMappingURL=sale.entity.js.map