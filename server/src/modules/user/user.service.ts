import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { MinioService } from '../minio/minio.service';
import { GetUsersDto, UpdateNotificationSettingsDto, UpdateUserDto } from './user.dto';
import { Submission } from 'src/entities/submission.entity';
import { User } from 'src/entities/user.entity';

// Type definitions for standardized API responses
interface SubmissionStatsRaw {
	totalSubmissions: string;
	acSubmissions: string;
	totalProblems: string;
	acProblems: string;
}

interface LanguageStatsRaw {
	language: string;
	count: string;
}

interface ContestStatsRaw {
	joinedContestCount: string;
}

interface BlogStatsRaw {
	blogCount: string;
}

interface CommentStatsRaw {
	commentCount: string;
}

interface SubmissionTrendRaw {
	date: string;
	submissions: string;
	accepted: string;
}

export interface UserLanguageStats {
	language: string;
	count: number;
}

export interface UserStatistics {
	submissionCount: number;
	acSubmissionCount: number;
	problemCount: number;
	acProblemCount: number;
	joinedContestCount: number;
	blogCount: number;
	commentCount: number;
	languageStats: UserLanguageStats[];
	score: number;
	rating: number;
}

export interface UserDifficultyStats {
	difficulty: string;
	count: number;
}

export interface UserRatingHistoryPoint {
	date: string;
	rating: number;
}

export interface UserSubmissionTrend {
	date: string;
	submissions: number;
	accepted: number;
	successRate: number;
}

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Submission)
		private readonly submissionRepository: Repository<Submission>,
		private readonly minioService: MinioService,
		private readonly configService: ConfigService,
	) {}

	async getUserById(id: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id }, relations: ['joiningContest'] });
		if (!user) {
			this.logger.log(`User ${id} not found`);
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async getUserByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { email }, relations: ['joiningContest'] });
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

	// Complex query to calculate user scores from their best submissions per problem
	async getUsers(query: GetUsersDto) {
		const { q, sortBy, sortOrder, page = 1, limit = 10 } = query;
		const offset = (page - 1) * limit;

		const baseQuery = this.userRepository
			.createQueryBuilder('user')
			.leftJoin(
				// Subquery to calculate total scores per user
				(qb) =>
					qb
						.select('s."authorId"', 'userId')
						.addSelect('SUM(s.max_score)', 'totalScore')
						.from(
							// Inner subquery to get max score per problem per user
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

		// Attach calculated scores to user entities
		const usersWithScore = users.map((user, index) => ({
			...user,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
			score: parseFloat(raw[index]?.score ?? 0),
		}));

		const total = await baseQuery.getCount();

		return { users: usersWithScore, total };
	}

	async getUserScore(userId: string): Promise<number> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const scoreQuery = await this.userRepository
			.createQueryBuilder('user')
			.leftJoin(
				// Subquery to calculate total scores per user
				(qb) =>
					qb
						.select('s."authorId"', 'userId')
						.addSelect('SUM(s.max_score)', 'totalScore')
						.from(
							// Inner subquery to get max score per problem per user
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
			.addSelect('COALESCE(user_scores."totalScore", 0)', 'score')
			.where('user.id = :userId', { userId })
			.getRawOne();

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
		return scoreQuery ? parseFloat(scoreQuery.score) : 0;
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

		// Hash password and generate verification token
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

		// Remove old avatar if exists
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

	/**
	 * Get user ranking based on rating
	 */
	async getUserRanking(userId: string): Promise<number> {
		const user = await this.getUserById(userId);
		const currentRating = user.rating.length > 0 ? user.rating[user.rating.length - 1] : 0;

		// Get all users and their latest ratings
		const users = await this.userRepository.find({
			select: ['id', 'rating'],
		});

		// Calculate how many users have higher rating
		let higherRatedCount = 0;
		for (const u of users) {
			const userRating = u.rating.length > 0 ? u.rating[u.rating.length - 1] : 0;
			if (userRating > currentRating) {
				higherRatedCount++;
			}
		}

		return higherRatedCount + 1;
	}

	/**
	 * Get comprehensive statistics for a user
	 */
	async getUserStatistics(userId: string): Promise<UserStatistics> {
		try {
			// Get user's submission statistics
			const submissionStats = (await this.submissionRepository
				.createQueryBuilder('submission')
				.select('COUNT(*)', 'totalSubmissions')
				.addSelect(`COUNT(CASE WHEN submission.status = 'ACCEPTED' THEN 1 END)`, 'acSubmissions')
				.addSelect('COUNT(DISTINCT submission."problemId")', 'totalProblems')
				.addSelect(`COUNT(DISTINCT CASE WHEN submission.status = 'ACCEPTED' THEN submission."problemId" END)`, 'acProblems')
				.where('submission."authorId" = :userId', { userId })
				.getRawOne()) as SubmissionStatsRaw;

			// Get language statistics
			const languageStats = await this.submissionRepository
				.createQueryBuilder('submission')
				.select('submission.language', 'language')
				.addSelect('COUNT(*)', 'count')
				.where('submission."authorId" = :userId', { userId })
				.groupBy('submission.language')
				.getRawMany();

			// Get contest participation count
			const contestStats = (await this.userRepository
				.createQueryBuilder('user')
				.leftJoin('user.joinedContests', 'contest')
				.select('COUNT(contest.id)', 'joinedContestCount')
				.where('user.id = :userId', { userId })
				.getRawOne()) as ContestStatsRaw;

			// Get blog count
			const blogStats = (await this.userRepository.manager
				.createQueryBuilder()
				.select('COUNT(*)', 'blogCount')
				.from('blogs', 'blog')
				.where('blog."authorId" = :userId', { userId })
				.getRawOne()) as BlogStatsRaw;

			// Get comment count
			const commentStats = (await this.userRepository.manager
				.createQueryBuilder()
				.select('COUNT(*)', 'commentCount')
				.from('blog_comments', 'comment')
				.where('comment."userId" = :userId', { userId })
				.getRawOne()) as CommentStatsRaw;

			// Get user score
			const score = await this.getUserScore(userId);

			// Get user rating (most recent rating)
			const user = await this.getUserById(userId);
			const rating = user.rating.length > 0 ? user.rating[user.rating.length - 1] : 0;

			return {
				submissionCount: parseInt(submissionStats?.totalSubmissions ?? '0', 10),
				acSubmissionCount: parseInt(submissionStats?.acSubmissions ?? '0', 10),
				problemCount: parseInt(submissionStats?.totalProblems ?? '0', 10),
				acProblemCount: parseInt(submissionStats?.acProblems ?? '0', 10),
				joinedContestCount: parseInt(contestStats?.joinedContestCount ?? '0', 10),
				blogCount: parseInt(blogStats?.blogCount ?? '0', 10),
				commentCount: parseInt(commentStats?.commentCount ?? '0', 10),
				languageStats: languageStats.map((stat: LanguageStatsRaw) => ({
					language: stat.language,
					count: parseInt(stat.count, 10),
				})),
				score,
				rating,
			};
		} catch (error) {
			this.logger.error(`Failed to get user statistics for user ${userId}:`, error);
			// Return default statistics on error
			return {
				submissionCount: 0,
				acSubmissionCount: 0,
				problemCount: 0,
				acProblemCount: 0,
				joinedContestCount: 0,
				blogCount: 0,
				commentCount: 0,
				languageStats: [],
				score: 0,
				rating: 0,
			};
		}
	}

	/**
	 * Get user's AC problems by difficulty
	 */
	async getUserAcProblemsByDifficulty(userId: string): Promise<UserDifficultyStats[]> {
		try {
			// Get AC problems grouped by difficulty
			const difficultyStats = await this.submissionRepository
				.createQueryBuilder('submission')
				.leftJoin('submission.problem', 'problem')
				.select('problem.difficulty', 'difficulty')
				.addSelect('COUNT(DISTINCT problem.id)', 'count')
				.where('submission."authorId" = :userId', { userId })
				.andWhere('submission.status = :status', { status: 'ACCEPTED' })
				.groupBy('problem.difficulty')
				.getRawMany();

			// Transform the results to ensure all difficulties are included
			const difficulties = ['easy', 'medium', 'hard'];
			const result = difficulties.map((difficulty) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const stat = difficultyStats.find((s: any) => s.difficulty === difficulty);
				return {
					difficulty,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
					count: stat ? parseInt(stat.count, 10) : 0,
				};
			});

			return result;
		} catch (error) {
			this.logger.error(`Failed to get AC problems by difficulty for user ${userId}:`, error);
			return [
				{ difficulty: 'easy', count: 0 },
				{ difficulty: 'medium', count: 0 },
				{ difficulty: 'hard', count: 0 },
			];
		}
	}

	/**
	 * Get user's rating history
	 */
	async getUserRatingHistory(userId: string): Promise<UserRatingHistoryPoint[]> {
		try {
			const user = await this.getUserById(userId);

			if (!user.rating || user.rating.length === 0) {
				return [];
			}

			// Create rating history points
			return user.rating.map((rating, index) => ({
				date: new Date(Date.now() - (user.rating.length - index - 1) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
				rating,
			}));
		} catch (error) {
			this.logger.error(`Failed to get rating history for user ${userId}:`, error);
			return [];
		}
	}

	/**
	 * Get user's submission trends over time
	 */
	async getUserSubmissionTrends(userId: string): Promise<UserSubmissionTrend[]> {
		try {
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

			const trends = await this.submissionRepository
				.createQueryBuilder('submission')
				.select('DATE(submission.submittedAt)', 'date')
				.addSelect('COUNT(*)', 'submissions')
				.addSelect('COUNT(CASE WHEN submission.status = :acceptedStatus THEN 1 END)', 'accepted')
				.where('submission.authorId = :userId', { userId })
				.andWhere('submission.submittedAt >= :thirtyDaysAgo', { thirtyDaysAgo })
				.setParameter('acceptedStatus', 'ACCEPTED')
				.groupBy('DATE(submission.submittedAt)')
				.orderBy('date', 'ASC')
				.getRawMany();

			return trends.map((trend: SubmissionTrendRaw) => ({
				date: trend.date,
				submissions: parseInt(trend.submissions, 10),
				accepted: parseInt(trend.accepted, 10),
				successRate: parseInt(trend.submissions, 10) > 0 ? (parseInt(trend.accepted, 10) / parseInt(trend.submissions, 10)) * 100 : 0,
			}));
		} catch (error) {
			this.logger.error(`Failed to get submission trends for user ${userId}:`, error);
			return [];
		}
	}

	/**
	 * Get user's AC submissions by programming language
	 */
	async getUserAcSubmissionsByLanguage(userId: string): Promise<UserLanguageStats[]> {
		try {
			// Get AC submissions grouped by language
			const languageStats = await this.submissionRepository
				.createQueryBuilder('submission')
				.select('submission.language', 'language')
				.addSelect('COUNT(*)', 'count')
				.where('submission."authorId" = :userId', { userId })
				.andWhere('submission.status = :status', { status: 'ACCEPTED' })
				.groupBy('submission.language')
				.orderBy('COUNT(*)', 'DESC')
				.getRawMany();

			// Transform the results with proper typing
			return languageStats.map((stat: LanguageStatsRaw) => ({
				language: stat.language,
				count: parseInt(stat.count, 10),
			}));
		} catch (error) {
			this.logger.error(`Failed to get AC submissions by language for user ${userId}:`, error);
			return [];
		}
	}
}
