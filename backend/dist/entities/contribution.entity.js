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
exports.Contribution = exports.ContributionType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const user_entity_1 = require("./user.entity");
var ContributionType;
(function (ContributionType) {
    ContributionType["CAPITAL"] = "Capital";
    ContributionType["LOAN"] = "Loan";
})(ContributionType || (exports.ContributionType = ContributionType = {}));
let Contribution = class Contribution extends base_entity_1.BaseEntity {
    tenant_id;
    tenant;
    contributor_name;
    contribution_type;
    contribution_date;
    amount;
    interest_rate;
    due_date;
    is_repaid;
    recorded_by_id;
    recorded_by;
    notes;
};
exports.Contribution = Contribution;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contribution.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Contribution.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contribution.prototype, "contributor_name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ContributionType,
    }),
    __metadata("design:type", String)
], Contribution.prototype, "contribution_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Contribution.prototype, "contribution_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Contribution.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Contribution.prototype, "interest_rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Contribution.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Contribution.prototype, "is_repaid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contribution.prototype, "recorded_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'recorded_by_id' }),
    __metadata("design:type", user_entity_1.User)
], Contribution.prototype, "recorded_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Contribution.prototype, "notes", void 0);
exports.Contribution = Contribution = __decorate([
    (0, typeorm_1.Entity)('contributions')
], Contribution);
//# sourceMappingURL=contribution.entity.js.map