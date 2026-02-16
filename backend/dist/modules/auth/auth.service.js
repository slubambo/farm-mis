"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const entities_1 = require("../../entities");
let AuthService = class AuthService {
    userRepository;
    tenantRepository;
    jwtService;
    constructor(userRepository, tenantRepository, jwtService) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const existingTenant = await this.tenantRepository.findOne({
            where: { slug: registerDto.tenant_slug },
        });
        if (existingTenant) {
            throw new common_1.ConflictException('Tenant slug already taken');
        }
        const tenant = this.tenantRepository.create({
            name: registerDto.tenant_name,
            slug: registerDto.tenant_slug,
            is_active: true,
        });
        await this.tenantRepository.save(tenant);
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.userRepository.create({
            tenant_id: tenant.id,
            full_name: registerDto.full_name,
            email: registerDto.email,
            password_hash: hashedPassword,
            role: entities_1.UserRole.OWNER,
            is_active: true,
        });
        await this.userRepository.save(user);
        const payload = {
            sub: user.id,
            email: user.email,
            tenant_id: user.tenant_id,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                tenant_id: user.tenant_id,
            },
            tenant: {
                id: tenant.id,
                name: tenant.name,
                slug: tenant.slug,
            },
        };
    }
    async login(loginDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
            relations: ['tenant'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.is_active) {
            throw new common_1.UnauthorizedException('Account is inactive');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        user.last_login_at = new Date();
        await this.userRepository.save(user);
        const payload = {
            sub: user.id,
            email: user.email,
            tenant_id: user.tenant_id,
            role: user.role,
        };
        const access_token = this.jwtService.sign(payload);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                tenant_id: user.tenant_id,
            },
            tenant: {
                id: user.tenant.id,
                name: user.tenant.name,
                slug: user.tenant.slug,
                logo_url: user.tenant.logo_url,
                primary_color: user.tenant.primary_color,
                secondary_color: user.tenant.secondary_color,
            },
        };
    }
    async validateUser(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['tenant'],
        });
        if (!user || !user.is_active) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Tenant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map