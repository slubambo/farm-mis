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
exports.Activity = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const tenant_entity_1 = require("./tenant.entity");
const animal_entity_1 = require("./animal.entity");
const activity_type_entity_1 = require("./activity-type.entity");
const user_entity_1 = require("./user.entity");
let Activity = class Activity extends base_entity_1.BaseEntity {
    tenant_id;
    tenant;
    animal_id;
    animal;
    activity_type_id;
    activity_type;
    performed_at;
    performed_by_id;
    performed_by;
    notes;
    metadata;
};
exports.Activity = Activity;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Activity.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tenant_entity_1.Tenant),
    (0, typeorm_1.JoinColumn)({ name: 'tenant_id' }),
    __metadata("design:type", tenant_entity_1.Tenant)
], Activity.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Activity.prototype, "animal_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => animal_entity_1.Animal),
    (0, typeorm_1.JoinColumn)({ name: 'animal_id' }),
    __metadata("design:type", animal_entity_1.Animal)
], Activity.prototype, "animal", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Activity.prototype, "activity_type_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => activity_type_entity_1.ActivityType),
    (0, typeorm_1.JoinColumn)({ name: 'activity_type_id' }),
    __metadata("design:type", activity_type_entity_1.ActivityType)
], Activity.prototype, "activity_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Activity.prototype, "performed_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Activity.prototype, "performed_by_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'performed_by_id' }),
    __metadata("design:type", user_entity_1.User)
], Activity.prototype, "performed_by", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Activity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Activity.prototype, "metadata", void 0);
exports.Activity = Activity = __decorate([
    (0, typeorm_1.Entity)('activities')
], Activity);
//# sourceMappingURL=activity.entity.js.map