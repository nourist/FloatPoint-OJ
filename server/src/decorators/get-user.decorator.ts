import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from 'src/types/jwt-payload.type';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtPayload => {
	const request: Request = ctx.switchToHttp().getRequest();

	if (!request.user) {
		throw new UnauthorizedException('User not found in request');
	}

	return request.user as JwtPayload;
});
