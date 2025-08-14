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

	async isSlugExists(slug: string) {
		const contest = await this.contestRepository.findOneBy({ slug });
		return !!contest;
	}

	async create(createContestDto: CreateContestDto, creator: User) {
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

	async findOne(slug: string) {
		const contest = await this.contestRepository.findOneBy({ slug });
		if (!contest) {
			throw new NotFoundException(`Contest with slug '${slug}' not found`);
		}
		return contest;
	}

	async update(id: string, updateContestDto: UpdateContestDto, user: User) {
		const contest = await this.contestRepository.findOne({ where: { id }, relations: ['creator'] });
		if (!contest) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}

		if (user.role !== UserRole.ADMIN && contest.creator.id !== user.id) {
			throw new ForbiddenException('You are not allowed to update this contest.');
		}

		await this.contestRepository.update(id, updateContestDto);
		return this.contestRepository.findOneBy({ id });
	}

	async remove(id: string) {
		const result = await this.contestRepository.delete(id);
		if (result.affected === 0) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}
	}

	async join(id: string, user: User) {
		const contest = await this.contestRepository.findOne({ where: { id }, relations: ['participants'] });
		if (!contest) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}

		const isAlreadyParticipant = contest.participants.some((p) => p.id === user.id);
		if (!isAlreadyParticipant) {
			contest.participants.push(user);
			await this.contestRepository.save(contest);
		}

		return contest;
	}

	async leave(id: string, user: User) {
		const contest = await this.contestRepository.findOne({ where: { id }, relations: ['participants'] });
		if (!contest) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}

		contest.participants = contest.participants.filter((p) => p.id !== user.id);
		await this.contestRepository.save(contest);

		return contest;
	}

	async addProblems(id: string, { problemIds }: AddProblemsDto, user: User) {
		const contest = await this.contestRepository.findOne({ where: { id }, relations: ['problems', 'creator'] });
		if (!contest) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}

		if (user.role !== UserRole.ADMIN && contest.creator.id !== user.id) {
			throw new ForbiddenException('You are not allowed to add problems to this contest.');
		}

		const problems = await this.problemRepository.findBy({ id: In(problemIds) });
		if (problems.length !== problemIds.length) {
			throw new NotFoundException('One or more problems not found.');
		}

		contest.problems.push(...problems);
		await this.contestRepository.save(contest);
		return contest;
	}

	async removeProblem(id: string, problemId: string, user: User) {
		const contest = await this.contestRepository.findOne({ where: { id }, relations: ['problems', 'creator'] });
		if (!contest) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}

		if (user.role !== UserRole.ADMIN && contest.creator.id !== user.id) {
			throw new ForbiddenException('You are not allowed to remove problems from this contest.');
		}

		const initialProblemCount = contest.problems.length;
		contest.problems = contest.problems.filter((p) => p.id !== problemId);

		if (contest.problems.length === initialProblemCount) {
			throw new NotFoundException(`Problem with ID '${problemId}' not found in this contest.`);
		}

		await this.contestRepository.save(contest);
		return contest;
	}

	async start(id: string, user: User): Promise<Contest> {
		const contest = await this.contestRepository.findOne({ where: { id }, relations: ['creator'] });
		if (!contest) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}

		if (user.role !== UserRole.ADMIN && contest.creator.id !== user.id) {
			throw new ForbiddenException('You are not allowed to start this contest.');
		}

		if (new Date() < contest.startTime) {
			contest.startTime = new Date();
		}

		return this.contestRepository.save(contest);
	}

	async stop(id: string, user: User): Promise<Contest> {
		const contest = await this.contestRepository.findOne({ where: { id }, relations: ['creator'] });
		if (!contest) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}

		if (user.role !== UserRole.ADMIN && contest.creator.id !== user.id) {
			throw new ForbiddenException('You are not allowed to stop this contest.');
		}

		if (new Date() < contest.endTime) {
			contest.endTime = new Date();
		}

		return this.contestRepository.save(contest);
	}

	async getStandings(id: string): Promise<UserStandingDto[]> {
		// 1. Fetch contest and all its submissions in two efficient queries
		const contest = await this.contestRepository.findOne({ where: { id: id } });

		if (!contest) {
			throw new NotFoundException(`Contest with ID '${id}' not found`);
		}

		const submissions = await this.submissionRepository.find({
			where: { contest: { id: id } },
			relations: ['author', 'problem', 'result'],
			order: { submittedAt: 'ASC' }, // Process submissions chronologically
		});

		// 2. Process submissions in memory to build the standings table
		const standingsMap = new Map<string, UserStandingDto>();

		for (const sub of submissions) {
			// Ensure submission has an author and problem
			if (!sub.author || !sub.problem) continue;

			const userId = sub.author.id;

			// Initialize user in the standings if not present
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

			// If problem is already solved (AC), ignore subsequent submissions
			if (userStanding.problems[problemId]?.score > 0) {
				continue;
			}

			// Initialize problem for the user if not present
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
				const timeToSolve = (sub.submittedAt.getTime() - contest.startTime.getTime()) / 1000; // in seconds
				const penaltyTime = problemStanding.wrongSubmissionsCount * (contest.penalty || 0);

				problemStanding.score = sub.totalScore;
				problemStanding.time = timeToSolve;

				userStanding.totalScore += problemStanding.score;
				userStanding.totalTime += timeToSolve + penaltyTime;
			} else {
				problemStanding.wrongSubmissionsCount++;
			}
		}

		// 3. Convert map to array and sort it
		const sortedStandings = Array.from(standingsMap.values()).sort((a, b) => {
			if (a.totalScore !== b.totalScore) {
				return b.totalScore - a.totalScore; // Sort by score descending
			}
			return a.totalTime - b.totalTime; // Then by time ascending
		});

		// 4. Assign ranks
		return sortedStandings.map((standing, index) => ({
			...standing,
			rank: index + 1,
		}));
	}
}
