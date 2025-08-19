import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { In, Repository } from 'typeorm';

import { AddProblemsDto, CreateContestDto, QueryContestDto, UpdateContestDto, UserStandingDto } from './contest.dto';
import { Contest } from 'src/entities/contest.entity';
import { Problem } from 'src/entities/problem.entity';
import { Submission, SubmissionStatus } from 'src/entities/submission.entity';
import { User, UserRole } from 'src/entities/user.entity';

@Injectable()
export class ContestService {
	constructor(
		@InjectRepository(Contest)
		private readonly contestRepository: Repository<Contest>,
		@InjectRepository(Problem)
		private readonly problemRepository: Repository<Problem>,
		@InjectRepository(Submission)
		private readonly submissionRepository: Repository<Submission>,
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
		});
		return this.contestRepository.save(contest);
	}

	async findAll(query: QueryContestDto) {
		const { page = 1, limit = 10, search, startTime, endTime, isRated, sortBy, sortOrder } = query;

		const queryBuilder = this.contestRepository
			.createQueryBuilder('contest')
			.leftJoinAndSelect('contest.creator', 'creator')
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
		const contest = await this.contestRepository.findOneBy({ slug });
		if (!contest) {
			throw new NotFoundException(`Contest with slug '${slug}' not found`);
		}
		return contest;
	}

	async update(id: string, updateContestDto: UpdateContestDto, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['creator']);
		this.checkContestOwnership(contest, user);

		await this.contestRepository.update(id, updateContestDto);
		return this.findContestById(id);
	}

	async remove(id: string): Promise<void> {
		const result = await this.contestRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}
	}

	async join(id: string, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['participants']);

		const isAlreadyParticipant = contest.participants.some((p) => p.id === user.id);
		if (!isAlreadyParticipant) {
			contest.participants.push(user);
			await this.contestRepository.save(contest);
		}

		return contest;
	}

	async leave(id: string, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['participants']);

		contest.participants = contest.participants.filter((p) => p.id !== user.id);
		await this.contestRepository.save(contest);

		return contest;
	}

	async addProblems(id: string, { problemIds }: AddProblemsDto, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['problems', 'creator']);
		this.checkContestOwnership(contest, user);

		const problems = await this.problemRepository.findBy({ id: In(problemIds) });
		if (problems.length !== problemIds.length) {
			throw new NotFoundException('One or more problems not found.');
		}

		contest.problems.push(...problems);
		await this.contestRepository.save(contest);
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

		await this.contestRepository.save(contest);
		return contest;
	}

	async start(id: string, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['creator']);
		this.checkContestOwnership(contest, user);

		if (new Date() < contest.startTime) {
			contest.startTime = new Date();
		}

		return this.contestRepository.save(contest);
	}

	async stop(id: string, user: User): Promise<Contest> {
		const contest = await this.findContestById(id, ['creator']);
		this.checkContestOwnership(contest, user);

		if (new Date() < contest.endTime) {
			contest.endTime = new Date();
		}

		return this.contestRepository.save(contest);
	}

	async getStandings(id: string): Promise<UserStandingDto[]> {
		const contest = await this.findContestById(id);

		const submissions = await this.submissionRepository.find({
			where: { contest: { id: id } },
			relations: ['author', 'problem', 'result'],
			order: { submittedAt: 'ASC' },
		});

		const standingsMap = this.calculateStandings(submissions, contest);
		const sortedStandings = this.sortStandings(Array.from(standingsMap.values()));
		return this.assignRanks(sortedStandings);
	}

	private calculateStandings(submissions: Submission[], contest: Contest): Map<string, UserStandingDto> {
		const standingsMap = new Map<string, UserStandingDto>();

		for (const sub of submissions) {
			if (!sub.author || !sub.problem) continue;

			const userId = sub.author.id;

			if (!standingsMap.has(userId)) {
				standingsMap.set(userId, {
					rank: 0,
					userId: userId,
					username: sub.author.username,
					fullname: sub.author.fullname,
					totalScore: 0,
					totalTime: 0,
					problems: {},
				});
			}

			const userStanding = standingsMap.get(userId)!;
			const problemId = sub.problem.id;

			if (userStanding.problems[problemId]?.score > 0) {
				continue;
			}

			if (!userStanding.problems[problemId]) {
				userStanding.problems[problemId] = {
					problemId: problemId,
					score: 0,
					time: 0,
					wrongSubmissionsCount: 0,
				};
			}

			const problemStanding = userStanding.problems[problemId];

			if (sub.status === SubmissionStatus.ACCEPTED) {
				const timeToSolve = (sub.submittedAt.getTime() - contest.startTime.getTime()) / 1000;
				const penaltyTime = problemStanding.wrongSubmissionsCount * (contest.penalty || 0);

				problemStanding.score = sub.totalScore;
				problemStanding.time = timeToSolve;

				userStanding.totalScore += problemStanding.score;
				userStanding.totalTime += timeToSolve + penaltyTime;
			} else {
				problemStanding.wrongSubmissionsCount++;
			}
		}

		return standingsMap;
	}

	private sortStandings(standings: UserStandingDto[]): UserStandingDto[] {
		return standings.sort((a, b) => {
			if (a.totalScore !== b.totalScore) {
				return b.totalScore - a.totalScore;
			}
			return a.totalTime - b.totalTime;
		});
	}

	private assignRanks(standings: UserStandingDto[]): UserStandingDto[] {
		return standings.map((standing, index) => ({
			...standing,
			rank: index + 1,
		}));
	}
}
