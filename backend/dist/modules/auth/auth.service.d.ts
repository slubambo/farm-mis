import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, Tenant, UserRole } from '../../entities';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthService {
    private userRepository;
    private tenantRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, tenantRepository: Repository<Tenant>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            full_name: string;
            role: UserRole;
            tenant_id: string;
        };
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            full_name: string;
            role: UserRole;
            tenant_id: string;
        };
        tenant: {
            id: string;
            name: string;
            slug: string;
            logo_url: string | undefined;
            primary_color: string | undefined;
            secondary_color: string | undefined;
        };
    }>;
    validateUser(userId: string): Promise<User>;
}
