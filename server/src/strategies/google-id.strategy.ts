import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-strategy';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as passport from 'passport';

import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/entities/user.entity';
import { GoogleService } from 'src/modules/google/google.service';

@Injectable()
export class GoogleIdStrategy extends Strategy {
	name = 'google-id';

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly googleService: GoogleService,
		private readonly userService: UserService,
	) {
		super();
		passport.use(this.name, this);
	}

	authenticate(req: Request<any, any, { idToken: string }>) {
		const idToken = req.body?.idToken;
		if (!idToken) {
			return this.fail('No ID token provided', 400);
		}

		void this.googleService.getUser(idToken).then(async (res) => {
			const payload = res.data as {
				email: string;
				name?: string;
				given_name?: string;
				picture?: string;
			};

			if (!payload || !payload.email || (!payload.name && !payload.given_name)) {
				return this.fail('Google not provided enough information', 400);
			}

			let user = await this.userService.getUserByEmail(payload.email).catch(() => null);

			if (!user) {
				const baseUsername = payload.email.split('@')[0];
				user = this.userRepository.create({
					email: payload.email,
					fullname: payload.name || payload.given_name,
					username: `${baseUsername}_${Math.floor(100000 + Math.random() * 900000).toString()}`,
					avatarUrl: payload.picture,
					isVerified: true,
				});
			} else {
				if (!user.isVerified) {
					user.isVerified = true;
					user.verificationToken = null;
					await this.userRepository.save(user);
				}

				if (!user.avatarUrl) {
					user.avatarUrl = payload.picture ?? null;
					await this.userRepository.save(user);
				}
			}

			this.success(user);
		});
	}
}
