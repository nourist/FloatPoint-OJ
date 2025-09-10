import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { In, Repository } from 'typeorm';

import { AddProblemsDto, ContestStandingsDto, CreateContestDto, QueryContestDto, UpdateContestDto, UserStandingDto } from './contest.dto';
import { Contest, ContestStatus } from 'src/entities/contest.entity';
import { Problem } from 'src/entities/problem.entity';
import { Submission, SubmissionStatus } from 'src/entities/submission.entity';
import { User, UserRole } from 'src/entities/user.entity';

@Injectable()
export class ContestService {
	private readonly logger = new Logger(ContestService.name);

	constructor(
		@InjectRepository(Contest)
		private readonly contestRepository: Repository<Contest>,
		@InjectRepository(Problem)
		private readonly problemRepository: Repository<Problem>,
		@InjectRepository(Submission)
		private readonly submissionRepository: Repository<Submission>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	private async findContestById(id: string, relations: string[] = []): Promise<Contest> {
		const contest = await this.contestRepository.findOne({ where: { id }, relations });
		if (!contest) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}
		return contest;
	}

	private checkContestOwnership(contest: Contest, user: User): void {
		if (user.role !== UserRole.ADMIN && contest.creator.id !== user.id) {
			throw new ForbiddenException('You are not allowed to perform this action on this contest.');
		}
	}

	async isSlugExists(slug: string): Promise<boolean> {
		const contest = await this.contestRepository.findOneBy({ slug });
		return !!contest;
	}

	async create(createContestDto: CreateContestDto, creator: User): Promise<Contest> {
		const slug = slugify(createContestDto.title, { lower: true });

		if (await this.isSlugExists(slug)) {
			throw new BadRequestException('Slug already exists');
		}

		const contest = this.contestRepository.create({
			...createContestDto,
			slug,
			creator,
			// Removed status field - status will be derived from startTime and endTime
		});

		return this.contestRepository.save(contest);
	}

	async findAll(query: QueryContestDto) {
		const { page = 1, limit = 10, search, startTime, endTime, isRated, sortBy, sortOrder, status } = query;

		const queryBuilder = this.contestRepository
			.createQueryBuilder('contest')
			.leftJoinAndSelect('contest.creator', 'creator')
			.leftJoinAndSelect('contest.participants', 'participants')
			.skip((page - 1) * limit)
			.take(limit);

		if (search) {
			queryBuilder.andWhere('contest.title ILIKE :search', { search: `%${search}%` });
		}

		if (isRated !== undefined) {
			queryBuilder.andWhere('contest.isRated = :isRated', { isRated });
		}

		if (startTime) {
			queryBuilder.andWhere('contest.startTime >= :startTime', { startTime });
		}

		if (endTime) {
			queryBuilder.andWhere('contest.endTime <= :endTime', { endTime });
		}

		// Filter by status if provided
		if (status) {
			const now = new Date();
			switch (status) {
				case 'PENDING':
					queryBuilder.andWhere('contest.startTime > :now', { now });
					break;
				case 'RUNNING':
					queryBuilder.andWhere('contest.startTime <= :now AND contest.endTime >= :now', { now });
					break;
				case 'ENDED':
					queryBuilder.andWhere('contest.endTime < :now', { now });
					break;
			}
		}

		if (sortBy && sortOrder) {
			queryBuilder.orderBy(`contest.${sortBy}`, sortOrder);
		} else {
			queryBuilder.orderBy('contest.startTime', 'DESC');
		}

		const [contests, total] = await queryBuilder.getManyAndCount();

		return {
			data: contests,
			meta: {
				total,
				page,
				limit,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	async findOne(slug: string): Promise<Contest> {
		const contest = await this.contestRepository.findOne({
			where: { slug },
			relations: ['creator', 'problems', 'submissions', 'submissions.author', 'submissions.problem', 'participants'],
		});
		if (!contest) {
			throw new NotFoundException(`Contest with slug '${slug}' not found`);
		}
		return contest;
	}

	async update(id: string, updateContestDto: UpdateContestDto, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['creator']);
		this.checkContestOwnership(contest, user);

		// Use save instead of update to ensure proper entity handling
		Object.assign(contest, updateContestDto);
		return this.contestRepository.save(contest);
	}

	async remove(id: string): Promise<void> {
		const result = await this.contestRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}
	}

	async join(id: string, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['participants']);

		if (contest.getStatus() !== ContestStatus.RUNNING) {
			throw new BadRequestException('Contest is not in RUNNING state');
		}

		// Check if user is already a participant to avoid duplicates
		const isAlreadyParticipant = contest.participants.some((p) => p.id === user.id);
		if (!isAlreadyParticipant) {
			contest.participants.push(user);
			await this.contestRepository.save(contest);
		}

		user.joiningContest = contest;
		await this.userRepository.save(user);

		return contest;
	}

	async leave(id: string, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['participants']);

		// Remove user from participants but keep standings for history
		contest.participants = contest.participants.filter((p) => p.id !== user.id);
		await this.contestRepository.save(contest);

		user.joiningContest = null;
		await this.userRepository.save(user);

		return contest;
	}

	async addProblems(id: string, { problemIds }: AddProblemsDto, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['problems', 'creator']);
		this.checkContestOwnership(contest, user);

		const problems = await this.problemRepository.findBy({ id: In(problemIds) });
		if (problems.length !== problemIds.length) {
			throw new NotFoundException('One or more problems not found.');
		}

		// Avoid adding duplicate problems
		const existingProblemIds = new Set(contest.problems.map((p) => p.id));
		const newProblems = problems.filter((p) => !existingProblemIds.has(p.id));

		if (newProblems.length > 0) {
			contest.problems.push(...newProblems);
			await this.contestRepository.save(contest);
		}

		return contest;
	}

	async removeProblem(id: string, problemId: string, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['problems', 'creator']);
		this.checkContestOwnership(contest, user);

		const initialProblemCount = contest.problems.length;
		contest.problems = contest.problems.filter((p) => p.id !== problemId);

		if (contest.problems.length === initialProblemCount) {
			throw new NotFoundException(`Problem with ID '${problemId}' not found in this contest.`);
		}

		// If contest is running, we might want to reset standings related to this problem
		// This would typically involve recalculating standings, but for now we'll just save the change
		await this.contestRepository.save(contest);
		return contest;
	}

	async start(id: string, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['creator']);
		this.checkContestOwnership(contest, user);

		// Adjust start time if needed
		const now = new Date();
		if (now < contest.startTime) {
			contest.startTime = now;
		}

		return this.contestRepository.save(contest);
	}

	async stop(id: string, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['creator']);
		this.checkContestOwnership(contest, user);

		// Adjust end time if needed
		const now = new Date();
		if (now < contest.endTime) {
			contest.endTime = now;
		}

		const updatedContest = await this.contestRepository.save(contest);

		// Update ratings if this is a rated contest
		if (contest.isRated && !contest.isRatingUpdated) {
			try {
				await this.updateRatings(id);
				this.logger.log(`Successfully updated ratings for contest ${id}`);
			} catch (error) {
				this.logger.error(`Failed to update ratings for contest ${id}: ${error.message}`);
			}
		}

		return updatedContest;
	}

	async getStandings(id: string): Promise<ContestStandingsDto> {
		const contest = await this.findContestById(id, ['participants', 'problems']);

		// Get all submissions for this contest within the time range
		const submissions = await this.submissionRepository
			.createQueryBuilder('submission')
			.leftJoinAndSelect('submission.author', 'author')
			.leftJoinAndSelect('submission.problem', 'problem')
			.leftJoinAndSelect('submission.results', 'results')
			.where('submission.contest.id = :contestId', { contestId: id })
			.andWhere('submission.submittedAt >= :startTime', { startTime: contest.startTime })
			.andWhere('submission.submittedAt <= :endTime', { endTime: contest.endTime })
			.orderBy('submission.submittedAt', 'ASC')
			.getMany();

		const standingsMap = this.calculateStandings(submissions, contest);
		const sortedStandings = this.sortStandings(Array.from(standingsMap.values()));
		const rankedStandings = this.assignRanks(sortedStandings);

		// Add rating information if contest is rated
		if (contest.isRated) {
			// We would populate oldRating and newRating here if we had that data
			// For now, we'll leave them as undefined
		}

		// Prepare problems data
		const problems = contest.problems.map((problem) => ({
			id: problem.id,
			title: problem.title,
			maxScore: problem.point,
		}));

		return {
			contestId: contest.id,
			isRated: contest.isRated,
			isRatingUpdated: contest.isRatingUpdated,
			penalty: contest.penalty,
			problems: problems,
			standings: rankedStandings,
		};
	}

	private calculateStandings(submissions: Submission[], contest: Contest): Map<string, UserStandingDto> {
		const standingsMap = new Map<string, UserStandingDto>();

		// Group submissions by user and problem
		const userProblemSubmissions = new Map<string, Map<string, Submission[]>>();

		for (const sub of submissions) {
			if (!sub.author || !sub.problem) continue;

			const userId = sub.author.id;
			const problemId = sub.problem.id;

			if (!userProblemSubmissions.has(userId)) {
				userProblemSubmissions.set(userId, new Map<string, Submission[]>());
			}

			const userSubmissions = userProblemSubmissions.get(userId)!;
			if (!userSubmissions.has(problemId)) {
				userSubmissions.set(problemId, []);
			}

			userSubmissions.get(problemId)!.push(sub);
		}

		// For each user, calculate their best score for each problem
		for (const [userId, problemSubmissions] of userProblemSubmissions) {
			// Get the first submission to extract user info
			const firstProblemSubmissions = Array.from(problemSubmissions.values())[0];
			const firstSubmission = firstProblemSubmissions[0];

			if (!standingsMap.has(userId)) {
				standingsMap.set(userId, {
					rank: 0,
					userId: userId,
					username: firstSubmission.author.username,
					fullname: firstSubmission.author.fullname,
					totalScore: 0,
					totalTime: 0, // ms
					problems: {},
				});
			}

			const userStanding = standingsMap.get(userId)!;

			// For each problem, find the maximum score and related info
			for (const [problemId, submissions] of problemSubmissions) {
				let maxScore = 0;
				let timeToMaxScore = 0; // ms
				let wrongSubmissionsCount = 0;
				let maxScoreSubmission: Submission | null = null;
				let isAc = false;

				// Find the submission with maximum score
				for (const sub of submissions) {
					if (sub.status === SubmissionStatus.ACCEPTED) {
						isAc = true;
					}
					if (sub.totalScore > maxScore) {
						maxScore = sub.totalScore;
						maxScoreSubmission = sub;
					}
				}

				// Count wrong submissions before achieving max score
				if (maxScoreSubmission) {
					// Time to achieve max score (ms)
					timeToMaxScore = maxScoreSubmission.submittedAt.getTime() - contest.startTime.getTime();

					// Count wrong submissions before the max score submission
					for (const sub of submissions) {
						if (sub.submittedAt < maxScoreSubmission.submittedAt && sub.status !== SubmissionStatus.ACCEPTED) {
							wrongSubmissionsCount++;
						}
					}
				} else {
					// If no submission achieved any score, count all as wrong
					wrongSubmissionsCount = submissions.length;
				}

				// Store problem standing
				userStanding.problems[problemId] = {
					problemId: problemId,
					score: maxScore,
					time: timeToMaxScore, // ms
					wrongSubmissionsCount: wrongSubmissionsCount,
					isAc,
				};

				// Update user totals
				userStanding.totalScore += maxScore;

				// Calculate penalty time in ms (penalty is in seconds)
				const penaltyTime = wrongSubmissionsCount * (contest.penalty || 0) * 1000;
				userStanding.totalTime += timeToMaxScore + penaltyTime;
			}
		}

		return standingsMap;
	}

	private sortStandings(standings: UserStandingDto[]): UserStandingDto[] {
		return standings.sort((a, b) => {
			// Sort by total score descending
			if (a.totalScore !== b.totalScore) {
				return b.totalScore - a.totalScore;
			}
			// If scores are equal, sort by total time ascending
			return a.totalTime - b.totalTime;
		});
	}

	private assignRanks(standings: UserStandingDto[]): UserStandingDto[] {
		return standings.map((standing, index) => ({
			...standing,
			rank: index + 1,
		}));
	}

	// Method to update ratings after contest ends
	async updateRatings(id: string): Promise<void> {
		const contest = await this.findContestById(id, ['participants']);

		// Check if rating update is applicable
		if (!contest.isRated || contest.isRatingUpdated) {
			return;
		}

		// Get standings for rating calculation
		const standingsDto = await this.getStandings(id);
		const standings = standingsDto.standings;

		// Get users with their current ratings
		const userIds = standings.map((s) => s.userId);
		const users = await this.userRepository.find({
			where: { id: In(userIds) },
			relations: ['joinedContests'],
		});

		const userMap = new Map<string, User>();
		users.forEach((user) => userMap.set(user.id, user));

		// Calculate new ratings for each user
		const ratingUpdates: { userId: string; newRating: number }[] = [];

		for (const standing of standings) {
			const user = userMap.get(standing.userId);
			if (!user) continue;

			// Get user's current rating (last rating in history or default 1500)
			const currentRating = user.rating && user.rating.length > 0 ? user.rating[user.rating.length - 1] : 1500;

			// Calculate expected score against all other participants
			let totalExpectedScore = 0;

			for (const opponentStanding of standings) {
				if (opponentStanding.userId === standing.userId) continue;

				const opponent = userMap.get(opponentStanding.userId);
				if (!opponent) continue;

				const opponentRating = opponent.rating && opponent.rating.length > 0 ? opponent.rating[opponent.rating.length - 1] : 1500;

				// Expected score formula
				const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
				totalExpectedScore += expectedScore;
			}

			// Actual score based on rank (1st place = 1.0, last place = 0.0)
			const actualScore = standings.length > 1 ? (standings.length - standing.rank) / (standings.length - 1) : 1.0;

			// K factor decreases with more contests (user's contest participation count)
			const contestCount = user.joinedContests ? user.joinedContests.length : 0;
			const K = Math.max(10, 50 - contestCount); // Minimum K of 10, max of 50

			// Calculate new rating
			const newRating = currentRating + K * (actualScore - totalExpectedScore);

			ratingUpdates.push({
				userId: standing.userId,
				newRating: Math.round(newRating),
			});
		}

		// Update user ratings
		for (const update of ratingUpdates) {
			const user = userMap.get(update.userId);
			if (!user) continue;

			// Add new rating to rating history
			if (!user.rating) {
				user.rating = [];
			}
			user.rating.push(update.newRating);

			// Save updated user
			await this.userRepository.save(user);
		}

		// Mark contest as rating updated
		contest.isRatingUpdated = true;
		await this.contestRepository.save(contest);
	}

	// Cron job to automatically update ratings for ended contests that haven't been updated yet
	@Cron(CronExpression.EVERY_MINUTE)
	async updateRatingsForEndedContests(): Promise<void> {
		this.logger.log('Checking for contests that need rating updates...');

		try {
			// Find all contests that are ended, rated, but ratings haven't been updated yet
			// Using the getStatus() method to determine if a contest has ended
			const allContests = await this.contestRepository.find({
				where: {
					isRated: true,
					isRatingUpdated: false,
				},
			});

			// Filter contests that are actually ended based on time
			const endedContests = allContests.filter((contest) => contest.getStatus() === ContestStatus.ENDED);

			if (endedContests.length === 0) {
				this.logger.log('No contests found that need rating updates.');
				return;
			}

			this.logger.log(`Found ${endedContests.length} contests that need rating updates.`);

			// Update ratings for each contest
			for (const contest of endedContests) {
				try {
					await this.updateRatings(contest.id);
					this.logger.log(`Successfully updated ratings for contest ${contest.id}`);
				} catch (error) {
					this.logger.error(`Failed to update ratings for contest ${contest.id}: ${error.message}`);
				}
			}
		} catch (error) {
			this.logger.error(`Error checking for contests that need rating updates: ${error.message}`);
		}
	}
}
