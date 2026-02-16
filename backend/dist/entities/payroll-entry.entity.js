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
exports.PayrollEntry = exports.PayrollStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const branch_entity_1 = require("./branch.entity");
const user_entity_1 = require("./user.entity");
var PayrollStatus;
(function (PayrollStatus) {
    PayrollStatus["PENDING"] = "Pending";
    PayrollStatus["PAID"] = "Paid";
})(PayrollStatus || (exports.PayrollStatus = PayrollStatus = {}));
let PayrollEntry = class PayrollEntry extends base_entity_1.BaseEntity {
    tenant_id;
    tenant;
    branch_id;
    branch;
    worker_name;
    worker_phone;
    period_start;
    period_end;
    amount;
    status;
    paid_date;
    payment_method;
    recorded_by_id;
    recorded_by;
    notes;
};
exports.PayrollEntry = PayrollEntry;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PayrollEntry.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], PayrollEntry.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PayrollEntry.prototype, "branch_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], PayrollEntry.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PayrollEntry.prototype, "worker_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PayrollEntry.prototype, "worker_phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], PayrollEntry.prototype, "period_start", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], PayrollEntry.prototype, "period_end", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PayrollEntry.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PayrollStatus,
        default: PayrollStatus.PENDING,
    }),
    __metadata("design:type", String)
], PayrollEntry.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], PayrollEntry.prototype, "paid_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], PayrollEntry.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PayrollEntry.prototype, "recorded_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'recorded_by_id' }),
    __metadata("design:type", user_entity_1.User)
], PayrollEntry.prototype, "recorded_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PayrollEntry.prototype, "notes", void 0);
exports.PayrollEntry = PayrollEntry = __decorate([
    (0, typeorm_1.Entity)('payroll_entries')
], PayrollEntry);
//# sourceMappingURL=payroll-entry.entity.js.map