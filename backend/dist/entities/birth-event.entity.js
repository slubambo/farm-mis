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
exports.BirthEvent = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const animal_entity_1 = require("./animal.entity");
let BirthEvent = class BirthEvent extends base_entity_1.BaseEntity {
    tenant_id;
    tenant;
    mother_id;
    mother;
    father_id;
    father;
    offspring_id;
    offspring;
    birth_date;
    birth_weight;
    birth_type;
    notes;
};
exports.BirthEvent = BirthEvent;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BirthEvent.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], BirthEvent.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BirthEvent.prototype, "mother_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => animal_entity_1.Animal),
    (0, typeorm_1.JoinColumn)({ name: 'mother_id' }),
    __metadata("design:type", animal_entity_1.Animal)
], BirthEvent.prototype, "mother", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BirthEvent.prototype, "father_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => animal_entity_1.Animal, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'father_id' }),
    __metadata("design:type", animal_entity_1.Animal)
], BirthEvent.prototype, "father", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BirthEvent.prototype, "offspring_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => animal_entity_1.Animal),
    (0, typeorm_1.JoinColumn)({ name: 'offspring_id' }),
    __metadata("design:type", animal_entity_1.Animal)
], BirthEvent.prototype, "offspring", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], BirthEvent.prototype, "birth_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], BirthEvent.prototype, "birth_weight", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BirthEvent.prototype, "birth_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], BirthEvent.prototype, "notes", void 0);
exports.BirthEvent = BirthEvent = __decorate([
    (0, typeorm_1.Entity)('birth_events')
], BirthEvent);
//# sourceMappingURL=birth-event.entity.js.map