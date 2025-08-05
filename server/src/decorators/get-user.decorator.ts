import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { User } from 'src/entities/user.entity';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
	const request: Request = ctx.switchToHttp().getRequest();

	if (!request.user) {
		throw new UnauthorizedException('User not found in request');
	}

	return request.user as User;
});
