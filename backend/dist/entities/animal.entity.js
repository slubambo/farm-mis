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
exports.Animal = exports.AnimalStatus = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const branch_entity_1 = require("./branch.entity");
const housing_unit_entity_1 = require("./housing-unit.entity");
var AnimalStatus;
(function (AnimalStatus) {
    AnimalStatus["ACTIVE"] = "Active";
    AnimalStatus["SOLD"] = "Sold";
    AnimalStatus["DEAD"] = "Dead";
    AnimalStatus["TRANSFERRED"] = "Transferred";
})(AnimalStatus || (exports.AnimalStatus = AnimalStatus = {}));
let Animal = class Animal extends base_entity_1.BaseEntity {
    tenant_id;
    tenant;
    branch_id;
    branch;
    housing_unit_id;
    housing_unit;
    species;
    breed;
    tag_number;
    name;
    sex;
    date_of_birth;
    intake_date;
    intake_weight;
    current_weight;
    status;
    sire_tag;
    dam_tag;
    notes;
};
exports.Animal = Animal;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Animal.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Animal.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Animal.prototype, "branch_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => branch_entity_1.Branch),
    (0, typeorm_1.JoinColumn)({ name: 'branch_id' }),
    __metadata("design:type", branch_entity_1.Branch)
], Animal.prototype, "branch", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Animal.prototype, "housing_unit_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => housing_unit_entity_1.HousingUnit, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'housing_unit_id' }),
    __metadata("design:type", housing_unit_entity_1.HousingUnit)
], Animal.prototype, "housing_unit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Animal.prototype, "species", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Animal.prototype, "breed", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Animal.prototype, "tag_number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Animal.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Animal.prototype, "sex", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Animal.prototype, "date_of_birth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Animal.prototype, "intake_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Animal.prototype, "intake_weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Animal.prototype, "current_weight", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AnimalStatus,
        default: AnimalStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Animal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Animal.prototype, "sire_tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Animal.prototype, "dam_tag", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Animal.prototype, "notes", void 0);
exports.Animal = Animal = __decorate([
    (0, typeorm_1.Entity)('animals')
], Animal);
//# sourceMappingURL=animal.entity.js.map