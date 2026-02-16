import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            full_name: string;
            role: import("../../entities").UserRole;
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
            role: import("../../entities").UserRole;
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
    getProfile(req: any): Promise<any>;
}
