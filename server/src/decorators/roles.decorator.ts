import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/entities/user.entity';

export const ROLE_KEY = 'role';

export const Roles = (...role: UserRole[]) => SetMetadata(ROLE_KEY, role);
