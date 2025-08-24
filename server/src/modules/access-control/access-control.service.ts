import { Injectable, Logger } from '@nestjs/common';

import { UserRole } from 'src/entities/user.entity';

interface IsAuthorizedParams {
	currentRole: UserRole;
	requiredRole: UserRole;
}

@Injectable()
export class AccessControlService {
	private readonly logger = new Logger(AccessControlService.name);
	private hierarchies: Array<Map<string, number>> = [];
	private priority: number = 1;

	constructor() {
		this.buildRoles([UserRole.USER, UserRole.ADMIN]);
	}

	private buildRoles(roles: UserRole[]) {
		const hierarchy: Map<string, number> = new Map();

		roles.forEach((role) => {
			hierarchy.set(role, this.priority);
			this.priority++;
		});

		this.hierarchies.push(hierarchy);
	}

	isAuthorized({ currentRole, requiredRole }: IsAuthorizedParams) {
		this.logger.log(`Checking if role ${currentRole} is authorized for ${requiredRole}`);
		
		for (const hierarchy of this.hierarchies) {
			const priority = hierarchy.get(currentRole);
			const requiredPriority = hierarchy.get(requiredRole);

			if (priority && requiredPriority && priority >= requiredPriority) {
				this.logger.log(`Role ${currentRole} is authorized for ${requiredRole}`);
				return true;
			}
		}
		
		this.logger.warn(`Role ${currentRole} is NOT authorized for ${requiredRole}`);
		return false;
	}
}
