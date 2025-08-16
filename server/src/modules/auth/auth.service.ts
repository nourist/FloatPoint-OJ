import { BadRequestException, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';

import { User } from 'src/entities/user.entity';
import { MailService } from 'src/modules/mail/mail.service';
import { UserService } from 'src/modules/user/user.service';
import { JwtPayload } from 'src/types/jwt-payload.type';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly mailService: MailService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.getUserByEmail(email);

		if (!user.isVerified) {
			this.logger.error(`User ${user.id} is not verified`);
			throw new UnauthorizedException('User is not verified');
		}

		if (!user.password) {
			this.logger.error(`User ${user.id} doesn't have a password`);
			throw new UnauthorizedException("User doesn't have a password");
		}

		const isPasswordValid = bcrypt.compareSync(password, user.password);
		if (!isPasswordValid) {
			this.logger.error(`Invalid password for user ${user.id}`);
			throw new UnauthorizedException('Invalid password');
		}

		return user;
	}

	@Transactional()
	async signup(userData: { email: string; password: string; username: string }) {
		const isUserExists = await this.userService.checkEmailExists(userData.email);
		if (isUserExists) {
			this.logger.log(`User ${userData.email} already exists`);
			throw new BadRequestException('User already exists');
		}

		const isUsernameExists = await this.userService.checkUsernameExists(userData.username);
		if (isUsernameExists) {
			this.logger.log(`Username ${userData.username} already exists`);
			throw new BadRequestException('Username already exists');
		}

		const hashedPassword = bcrypt.hashSync(userData.password, this.configService.get<number>('SALT_ROUNDS')!);
		const verificationToken = uuidv4();

		const user = await this.userRepository.save(this.userRepository.create({ ...userData, password: hashedPassword, verificationToken }));

		await this.mailService.sendVerifyEmail(user.email, verificationToken);

		this.logger.log(`User created with email ${user.email}`);
		return user;
	}

	async verifyEmail(verificationToken: string) {
		const user = await this.userRepository.findOne({ where: { verificationToken } });

		if (!user) {
			this.logger.log(`User with verification token ${verificationToken} not found`);
			throw new NotFoundException('User not found');
		}

		if (user.isVerified) {
			this.logger.log(`User ${user.id} is already verified`);
			throw new BadRequestException('User is already verified');
		}

		user.isVerified = true;
		user.verificationToken = null;
		const savedUser = await this.userRepository.save(user);

		this.logger.log(`User ${user.id} verified with email ${user.email}`);
		return savedUser;
	}

	@Transactional()
	async resendVerificationEmail(email: string) {
		const user = await this.userService.getUserByEmail(email);

		if (user.isVerified) {
			this.logger.log(`User ${user.id} is already verified`);
			throw new BadRequestException('User is already verified');
		}

		const verificationToken = uuidv4();
		user.verificationToken = verificationToken;

		const savedUser = await this.userRepository.save(user);

		await this.mailService.sendVerifyEmail(user.email, verificationToken);

		this.logger.log(`Verification email sent to ${user.email}`);
		return savedUser;
	}

	@Transactional()
	async forgotPassword(email: string) {
		const user = await this.userService.getUserByEmail(email);

		const token = uuidv4();

		user.resetPasswordToken = token;
		user.resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 60);
		const savedUser = await this.userRepository.save(user);

		await this.mailService.sendResetPasswordEmail(user.email, token);

		this.logger.log(`Reset password email sent to ${user.email}`);
		return savedUser;
	}

	async resetPassword(token: string, newPassword: string) {
		const user = await this.userRepository.findOne({ where: { resetPasswordToken: token } });

		if (!user) {
			this.logger.log(`User with reset password token ${token} not found`);
			throw new NotFoundException('User not found');
		}

		if (user.resetPasswordExpiresAt && user.resetPasswordExpiresAt < new Date()) {
			this.logger.log(`Reset password token ${token} has expired`);
			throw new BadRequestException('Reset password token has expired');
		}

		const hashedPassword = bcrypt.hashSync(newPassword, this.configService.get<number>('SALT_ROUNDS')!);
		user.password = hashedPassword;
		user.resetPasswordToken = null;
		user.resetPasswordExpiresAt = null;
		const savedUser = await this.userRepository.save(user);

		this.logger.log(`Password reset for user ${user.id}`);
		return savedUser;
	}

	async signin(userData: { email: string }) {
		const user = await this.userService.getUserByEmail(userData.email);

		if (!user.isVerified) {
			this.logger.log(`User ${user.id} is not verified`);
			throw new UnauthorizedException('User is not verified');
		}

		const payload: JwtPayload = { email: user.email, sub: user.id, role: user.role };
		this.logger.log(`User ${user.id} signed in with email ${user.email}`);
		return {
			access_token: this.jwtService.sign(payload),
			user,
		};
	}
}
