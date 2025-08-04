import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from 'src/types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => (req?.cookies?.access_token ?? null) as string | null]),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET')!,
		});
	}

	validate(payload: JwtPayload) {
		return payload;
	}
}
