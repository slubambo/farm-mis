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
exports.Partner = exports.PartnerType = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
var PartnerType;
(function (PartnerType) {
    PartnerType["CUSTOMER"] = "Customer";
    PartnerType["SUPPLIER"] = "Supplier";
    PartnerType["BOTH"] = "Both";
})(PartnerType || (exports.PartnerType = PartnerType = {}));
let Partner = class Partner extends base_entity_1.BaseEntity {
    tenant_id;
    tenant;
    name;
    partner_type;
    phone;
    email;
    address;
    is_active;
    notes;
};
exports.Partner = Partner;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Partner.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Partner.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Partner.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PartnerType,
    }),
    __metadata("design:type", String)
], Partner.prototype, "partner_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Partner.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Partner.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Partner.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Partner.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Partner.prototype, "notes", void 0);
exports.Partner = Partner = __decorate([
    (0, typeorm_1.Entity)('partners')
], Partner);
//# sourceMappingURL=partner.entity.js.map