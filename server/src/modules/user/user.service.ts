import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MinioService } from '../minio/minio.service';
import { GetUsersDto, UpdateNotificationSettingsDto, UpdateUserDto } from './user.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly minioService: MinioService,
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
						.select('s.authorId', 'userId')
						.addSelect('SUM(s.max_score)', 'totalScore')
						.from(
							(subQb) =>
								subQb
									.select('author.id', 'authorId')
									.addSelect('problem.id', 'problemId')
									.addSelect('MAX(submission.totalScore)', 'max_score')
									.from('submission', 'submission')
									.leftJoin('submission.problem', 'problem')
									.leftJoin('submission.author', 'author')
									.groupBy('author.id, problem.id'),
							's',
						)
						.groupBy('s.authorId'),
				'user_scores',
				'user_scores.userId = user.id',
			)
			.addSelect('COALESCE(user_scores.totalScore, 0)', 'score');

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

		const filename = `${id}.${file.filename.split('.').pop()}`;
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
