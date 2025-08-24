import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { MinioService } from '../minio/minio.service';
import { GetUsersDto, UpdateNotificationSettingsDto, UpdateUserDto } from './user.dto';
import { Problem } from 'src/entities/problem.entity';
import { Submission } from 'src/entities/submission.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly minioService: MinioService,
		private readonly configService: ConfigService,
	) {}

	async getUserById(id: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });
		if (!user) {
			this.logger.log(`User ${id} not found`);
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async getUserByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ email });
		if (!user) {
			this.logger.log(`User ${email} not found`);
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async checkEmailExists(email: string): Promise<boolean> {
		const user = await this.userRepository.findOneBy({ email });
		return !!user;
	}

	async checkUsernameExists(username: string): Promise<boolean> {
		const user = await this.userRepository.findOneBy({ username });
		return !!user;
	}

	async getUserByUsername(username: string): Promise<User> {
		const user = await this.userRepository.findOneBy({ username });
		if (!user) {
			this.logger.log(`User ${username} not found`);
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async getUsers(query: GetUsersDto) {
		const { q, sortBy, sortOrder, page = 1, limit = 10 } = query;
		const offset = (page - 1) * limit;

		const baseQuery = this.userRepository
			.createQueryBuilder('user')
			.leftJoin(
				(qb) =>
					qb
						.select('s."authorId"', 'userId')
						.addSelect('SUM(s.max_score)', 'totalScore')
						.from(
							(subQb) =>
								subQb
									.select('s."authorId"', 'authorId')
									.addSelect('s."problemId"', 'problemId')
									.addSelect('MAX(s."totalScore")', 'max_score')
									.from('submissions', 's')
									.groupBy('s."authorId", s."problemId"'),
							's',
						)
						.groupBy('s."authorId"'),
				'user_scores',
				'user_scores."userId" = user.id',
			)
			.addSelect('COALESCE(user_scores."totalScore", 0)', 'score');

		if (q) {
			baseQuery.where('user.username ILIKE :q OR user.fullname ILIKE :q', {
				q: `%${q}%`,
			});
		}

		if (sortBy) {
			if (sortBy === 'score') {
				baseQuery.orderBy('score', sortOrder);
			} else {
				baseQuery.orderBy(`user.${sortBy}`, sortOrder);
			}
		}

		baseQuery.skip(offset).take(limit);

		const { entities: users, raw } = await baseQuery.getRawAndEntities();

		const usersWithScore = users.map((user, index) => ({
			...user,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
			score: parseFloat(raw[index]?.score ?? 0),
		}));

		const total = await baseQuery.getCount();

		return { users: usersWithScore, total };
	}

	async createUser(userData: { email: string; password: string; username: string }): Promise<User> {
		const isUserExists = await this.checkEmailExists(userData.email);
		if (isUserExists) {
			this.logger.log(`User ${userData.email} already exists`);
			throw new BadRequestException('User already exists');
		}

		const isUsernameExists = await this.checkUsernameExists(userData.username);
		if (isUsernameExists) {
			this.logger.log(`Username ${userData.username} already exists`);
			throw new BadRequestException('Username already exists');
		}

		const hashedPassword = bcrypt.hashSync(userData.password, this.configService.get<number>('SALT_ROUNDS')!);
		const verificationToken = uuidv4();

		const user = this.userRepository.create({
			...userData,
			password: hashedPassword,
			verificationToken,
		});

		return this.userRepository.save(user);
	}

	async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.getUserById(id);

		if (updateUserDto.username && updateUserDto.username !== user.username) {
			const usernameExists = await this.checkUsernameExists(updateUserDto.username);
			if (usernameExists) {
				throw new BadRequestException('Username already taken.');
			}
		}

		Object.assign(user, updateUserDto);
		return this.userRepository.save(user);
	}

	async updateAvatar(id: string, file: Express.Multer.File): Promise<User> {
		const user = await this.getUserById(id);

		if (user.avatarUrl) {
			try {
				const oldAvatarName = user.avatarUrl.split('/').pop();
				if (oldAvatarName) {
					await this.minioService.removeFile('avatars', oldAvatarName);
				}
			} catch (error) {
				this.logger.error(`Failed to delete old avatar: ${error}`);
			}
		}

		const filename = `${id}.${file.originalname.split('.').pop()}`;
		await this.minioService.saveFile('avatars', filename, file.buffer);

		const avatarUrl = `/avatars/${filename}`;

		user.avatarUrl = avatarUrl;
		return await this.userRepository.save(user);
	}

	async updateNotificationSettings(id: string, settings: UpdateNotificationSettingsDto): Promise<User> {
		const user = await this.getUserById(id);
		user.notificationSettings = { ...user.notificationSettings, ...settings };
		return this.userRepository.save(user);
	}
}
