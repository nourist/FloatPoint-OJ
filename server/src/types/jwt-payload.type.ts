import { UserRole } from '../entities/user.entity';

export interface JwtPayload {
	email: string;
	sub: string;
	role: UserRole;
}
