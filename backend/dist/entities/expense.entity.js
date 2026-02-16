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
exports.Expense = exports.ExpenseStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const branch_entity_1 = require("./branch.entity");
const user_entity_1 = require("./user.entity");
var ExpenseStatus;
(function (ExpenseStatus) {
    ExpenseStatus["PENDING"] = "Pending";
    ExpenseStatus["APPROVED"] = "Approved";
    ExpenseStatus["REJECTED"] = "Rejected";
})(ExpenseStatus || (exports.ExpenseStatus = ExpenseStatus = {}));
let Expense = class Expense extends base_entity_1.BaseEntity {
    tenant_id;
    tenant;
    branch_id;
    branch;
    expense_date;
    category;
    description;
    amount;
    payment_method;
    receipt_url;
    status;
    recorded_by_id;
    recorded_by;
    approved_by_id;
    approved_by;
    approved_at;
    notes;
};
exports.Expense = Expense;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Expense.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Expense.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Expense.prototype, "branch_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], Expense.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Expense.prototype, "expense_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Expense.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Expense.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "receipt_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ExpenseStatus,
        default: ExpenseStatus.PENDING,
    }),
    __metadata("design:type", String)
], Expense.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Expense.prototype, "recorded_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'recorded_by_id' }),
    __metadata("design:type", user_entity_1.User)
], Expense.prototype, "recorded_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "approved_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'approved_by_id' }),
    __metadata("design:type", user_entity_1.User)
], Expense.prototype, "approved_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Expense.prototype, "approved_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Expense.prototype, "notes", void 0);
exports.Expense = Expense = __decorate([
    (0, typeorm_1.Entity)('expenses')
], Expense);
//# sourceMappingURL=expense.entity.js.map