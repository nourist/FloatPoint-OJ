import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { User } from 'src/entities/user.entity';

export const GetOptionalUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User | null => {
	const request: Request = ctx.switchToHttp().getRequest();

	return request.user as User | null;
});
