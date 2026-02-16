import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, Tenant, UserRole } from '../../entities';
import { RegisterDto, LoginDto } from './dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if tenant slug already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { slug: registerDto.tenant_slug },
    });

    if (existingTenant) {
      throw new ConflictException('Tenant slug already taken');
    }

    // Create tenant
    const tenant = this.tenantRepository.create({
      name: registerDto.tenant_name,
      slug: registerDto.tenant_slug,
      is_active: true,
    });
    await this.tenantRepository.save(tenant);

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create owner user
    const user = this.userRepository.create({
      tenant_id: tenant.id,
      full_name: registerDto.full_name,
      email: registerDto.email,
      password_hash: hashedPassword,
      role: UserRole.OWNER,
      is_active: true,
    });
    await this.userRepository.save(user);

    // Generate JWT token
    const payload: JwtPayload = {
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

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      relations: ['tenant'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.last_login_at = new Date();
    await this.userRepository.save(user);

    // Generate JWT token
    const payload: JwtPayload = {
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

  async validateUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['tenant'],
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}
