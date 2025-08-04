import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ROLE_KEY } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import { AccessControlService } from 'src/modules/access-control/access-control.service';
import { JwtPayload } from 'src/types/jwt-payload.type';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly accessControlService: AccessControlService,
	) {}

	canActivate(context: ExecutionContext) {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLE_KEY, [context.getHandler(), context.getClass()]);

		if (!requiredRoles || requiredRoles.length === 0) {
			return true; // No roles required, allow access
		}

		const request: Request = context.switchToHttp().getRequest();
		const { role: currentRole } = request.user as JwtPayload;

		for (const role of requiredRoles) {
			const result = this.accessControlService.isAuthorized({
				requiredRole: role,
				currentRole,
			});

			if (result) {
				return true;
			}
		}

		return false;
	}
}
