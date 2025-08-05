import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetUsersDto } from './user.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async getUserById(id: string) {
		const user = await this.userRepository.findOneBy({ id });
		if (!user) {
			this.logger.log(`User ${id} not found`);
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async getUserByEmail(email: string) {
		const user = await this.userRepository.findOneBy({ email });
		if (!user) {
			this.logger.log(`User ${email} not found`);
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async checkEmailExists(email: string) {
		const user = await this.userRepository.findOneBy({ email });
		return !!user;
	}

	async checkUsernameExists(username: string) {
		const user = await this.userRepository.findOneBy({ username });
		return !!user;
	}

	async getUserByUsername(username: string) {
		const user = await this.userRepository.findOneBy({ username });
		if (!user) {
			this.logger.log(`User ${username} not found`);
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async getUsers(query: GetUsersDto) {
		const { q, sortBy, sortOrder, page, limit } = query;
		const offset = (page - 1) * limit;

		const baseQuery = this.userRepository
			.createQueryBuilder('user')
			.leftJoin(
				(qb) => {
					return qb
						.select('s.authorId', 'userId')
						.addSelect('SUM(s.max_score)', 'totalScore')
						.from((subQb) => {
							return subQb
								.select('author.id', 'authorId')
								.addSelect('problem.id', 'problemId')
								.addSelect('MAX(submission.totalScore)', 'max_score')
								.from('submission', 'submission')
								.leftJoin('submission.problem', 'problem')
								.leftJoin('submission.author', 'author')
								.groupBy('author.id, problem.id');
						}, 's')
						.groupBy('s.authorId');
				},
				'user_scores',
				'user_scores.userId = user.id',
			)
			.addSelect('COALESCE(user_scores.totalScore, 0)', 'score');

		if (q) {
			baseQuery.where('user.username ILIKE :q OR user.fullName ILIKE :q', {
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

		const total = await baseQuery.getCount(); // optional: accurate when using filters

		return { users: usersWithScore, total };
	}
}
