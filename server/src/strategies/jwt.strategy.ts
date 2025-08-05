import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from 'src/types/jwt-payload.type';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => (req?.cookies?.access_token ?? null) as string | null]),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET')!,
		});
	}

	validate(payload: JwtPayload) {
		return this.userService.getUserById(payload.sub);
	}
}
