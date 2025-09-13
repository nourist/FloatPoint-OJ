import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProblemService } from '../problem/problem.service';
import { UserService } from '../user/user.service';
import { GetAllSubmissionsDto, LanguageStatistic, StatusStatistic, SubmitCodeDto } from './submission.dto';
import { SubmissionResultStatus } from 'src/entities/submission-result.entity';
import { Submission } from 'src/entities/submission.entity';
import { User, UserRole } from 'src/entities/user.entity';

@Injectable()
export class SubmissionService {
	constructor(
		@InjectRepository(Submission)
		private readonly submissionRepository: Repository<Submission>,
		private readonly userService: UserService,
		private readonly problemService: ProblemService,
		@Inject('JUDGER_JOB_QUEUE')
		private readonly judgerJobQueue: ClientProxy,
	) {}

	async findOne(id: string) {
		const submission = await this.submissionRepository.findOne({
			where: { id },
			relations: ['problem', 'author', 'results'],
		});

		if (!submission) {
			throw new NotFoundException(`Submission with ID ${id} not found`);
		}

		return submission;
	}

	async findAll(query: GetAllSubmissionsDto, user: User | null) {
		const { authorId, problemId, language, status, contestId, page, limit } = query;

		const qb = this.submissionRepository
			.createQueryBuilder('submission')
			.leftJoinAndSelect('submission.problem', 'problem')
			.leftJoinAndSelect('submission.author', 'author')
			.leftJoinAndSelect('submission.results', 'results')
			.leftJoinAndSelect('submission.contest', 'contest');

		if (authorId) qb.andWhere('author.id = :authorId', { authorId });
		if (problemId) qb.andWhere('problem.id = :problemId', { problemId });
		if (language) qb.andWhere('submission.language = :language', { language });
		if (status) qb.andWhere('submission.status = :status', { status });
		if (contestId) qb.andWhere('contest.id = :contestId', { contestId });

		const [submissions, total] = await qb
			.orderBy('submission.submittedAt', 'DESC')
			.skip((page - 1) * limit)
			.take(limit)
			.getManyAndCount();

		// Calculate statistics based on the same filters (without pagination)
		const statsQb = this.submissionRepository.createQueryBuilder('submission').leftJoin('submission.author', 'author').leftJoin('submission.problem', 'problem').leftJoin('submission.contest', 'contest');

		if (authorId) statsQb.andWhere('author.id = :authorId', { authorId });
		if (problemId) statsQb.andWhere('problem.id = :problemId', { problemId });
		if (language) statsQb.andWhere('submission.language = :language', { language });
		if (status) statsQb.andWhere('submission.status = :status', { status });
		if (contestId) statsQb.andWhere('contest.id = :contestId', { contestId });

		// Get status statistics
		const statusStats = await statsQb.clone().select('submission.status', 'status').addSelect('COUNT(*)', 'count').groupBy('submission.status').getRawMany();

		// Get language statistics
		const languageStats = await statsQb.clone().select('submission.language', 'language').addSelect('COUNT(*)', 'count').groupBy('submission.language').getRawMany();

		// Transform raw results to proper DTOs
		const statusStatistics: StatusStatistic[] = statusStats.map((stat) => ({
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			status: stat.status,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
			count: parseInt(stat.count, 10),
		}));

		const languageStatistics: LanguageStatistic[] = languageStats.map((stat) => ({
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			language: stat.language,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
			count: parseInt(stat.count, 10),
		}));

		// Add canView field and calculate time/memory/accepted test cases for each submission
		const submissionsWithCanView = submissions.map((submission) => {
			let totalTime = 0;
			let maxMemory = 0;
			let acceptedTestCases = 0;
			let totalTestCases = 0;

			if (submission.results && submission.results.length > 0) {
				totalTime = submission.results.reduce((sum, result) => sum + (result.executionTime || 0), 0);
				maxMemory = Math.max(...submission.results.map((result) => result.memoryUsed || 0));

				// Count accepted test cases
				acceptedTestCases = submission.results.filter((result) => result.status === SubmissionResultStatus.ACCEPTED).length;
				totalTestCases = submission.results.length;
			}

			return {
				...submission,
				canView: user ? user.role === UserRole.ADMIN || submission.author.id === user.id : false,
				time: totalTime,
				memory: maxMemory,
				acceptedTestCases,
				totalTestCases,
			};
		});

		return {
			submissions: submissionsWithCanView,
			total,
			page,
			limit,
			statusStatistics,
			languageStatistics,
		};
	}

	async submitCode(body: SubmitCodeDto, user: User) {
		const problem = await this.problemService.getProblemById(body.problemId);
		const userWithContest = await this.userService.getUserById(user.id);

		console.log(JSON.stringify(userWithContest));

		const submission = this.submissionRepository.create({
			sourceCode: body.code,
			language: body.language,
			problem,
			author: user,
			contest: userWithContest?.joiningContest,
		});

		const savedSubmission = await this.submissionRepository.save(submission);

		// Queue submission for judging
		this.judgerJobQueue.emit('judger.job', {
			id: savedSubmission.id,
			problemId: problem.id,
			sourceCode: body.code,
			language: body.language,
		});

		return savedSubmission;
	}

	async getSubmissionActivity(userId: string) {
		// Get submissions for the past year grouped by date
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

		const submissions = await this.submissionRepository
			.createQueryBuilder('submission')
			.select('DATE(submission.submittedAt)', 'date')
			.addSelect('COUNT(*)', 'count')
			.addSelect('COUNT(CASE WHEN submission.status = :acceptedStatus THEN 1 END)', 'acceptedCount')
			.where('submission.authorId = :userId', { userId })
			.andWhere('submission.submittedAt >= :oneYearAgo', { oneYearAgo })
			.setParameter('acceptedStatus', 'ACCEPTED')
			.groupBy('DATE(submission.submittedAt)')
			.orderBy('date', 'ASC')
			.getRawMany();

		// Create a complete year calendar with zero values for days without submissions
		const calendar: Record<string, { count: number; acceptedCount: number }> = {};
		const startDate = new Date(oneYearAgo);
		const endDate = new Date();

		// Initialize all dates with zero
		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
			const dateStr = d.toISOString().split('T')[0];
			calendar[dateStr] = { count: 0, acceptedCount: 0 };
		}

		// Fill in actual submission data
		submissions.forEach((submission: { date: string; count: string; acceptedCount: string }) => {
			const dateStr = submission.date;
			calendar[dateStr] = {
				count: parseInt(submission.count, 10),
				acceptedCount: parseInt(submission.acceptedCount, 10),
			};
		});

		// Convert to array format for frontend
		const activityData = Object.entries(calendar).map(([date, data]) => ({
			date,
			count: data.count,
			acceptedCount: data.acceptedCount,
			level: this.getActivityLevel(data.count),
		}));

		return {
			activityData,
			totalSubmissions: activityData.reduce((sum, day) => sum + day.count, 0),
			totalAccepted: activityData.reduce((sum, day) => sum + day.acceptedCount, 0),
		};
	}

	private getActivityLevel(count: number): number {
		// Define activity levels for GitHub-style coloring
		if (count === 0) return 0;
		if (count <= 2) return 1;
		if (count <= 5) return 2;
		if (count <= 10) return 3;
		return 4;
	}
}
