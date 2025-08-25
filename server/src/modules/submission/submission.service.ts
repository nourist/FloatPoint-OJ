import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ProblemService } from '../problem/problem.service';
import { UserService } from '../user/user.service';
import { GetAllSubmissionsDto, SubmitCodeDto, StatusStatistic, LanguageStatistic } from './submission.dto';
import { Submission } from 'src/entities/submission.entity';
import { Subtask } from 'src/entities/subtask.entity';
import { TestCase } from 'src/entities/test-case.entity';
import { User, UserRole } from 'src/entities/user.entity';
import { SubmissionResultStatus } from 'src/entities/submission-result.entity';

@Injectable()
export class SubmissionService {
	constructor(
		@InjectRepository(Submission)
		private readonly submissionRepository: Repository<Submission>,
		@InjectRepository(Subtask)
		private readonly subtaskRepository: Repository<Subtask>,
		@InjectRepository(TestCase)
		private readonly testCaseRepository: Repository<TestCase>,
		private readonly userService: UserService,
		@Inject('JUDGER_JOB_QUEUE')
		private readonly judgerJobQueue: ClientProxy,
		private readonly problemService: ProblemService,
	) {}

	async findOne(id: string) {
		const submission = await this.submissionRepository.findOne({
			where: { id },
			relations: ['problem', 'author', 'results'],
		});
		
		if (!submission) {
			throw new NotFoundException(`Submission with ID ${id} not found`);
		}

		// Map submission result slugs to subtask and test case names
		if (submission.results && submission.results.length > 0) {
			const subtaskSlugs = [...new Set(submission.results.map((result) => result.slug.split('/')[0]))];

			// Fetch all required subtasks with their test cases in one query for efficiency
			const subtasks = await this.subtaskRepository.find({
				where: {
					problem: { id: submission.problem.id },
					slug: In(subtaskSlugs),
				},
				relations: ['testCases'],
			});

			const subtaskMap = new Map(subtasks.map((st) => [st.slug, st]));

			// Map each result to its corresponding subtask and test case names
			for (const result of submission.results) {
				const [subtaskSlug, testCaseSlug] = result.slug.split('/');

				const subtask = subtaskMap.get(subtaskSlug);
				if (subtask) {
					const testCase = subtask.testCases.find((tc) => tc.slug === testCaseSlug);
					(result as any).subtaskName = subtask.name;
					(result as any).testCaseName = testCase?.name || testCaseSlug;
				} else {
					// Fallback to slug names if subtask not found
					(result as any).subtaskName = subtaskSlug;
					(result as any).testCaseName = testCaseSlug;
				}
			}
		}

		return submission;
	}
	
	async findAll(query: GetAllSubmissionsDto, user: User|null) {
		const { authorId, problemId, language, status, page, limit } = query;

		const qb = this.submissionRepository
			.createQueryBuilder('submission')
			.leftJoinAndSelect('submission.problem', 'problem')
			.leftJoinAndSelect('submission.author', 'author')
			.leftJoinAndSelect('submission.results', 'results');

		if (authorId) qb.andWhere('author.id = :authorId', { authorId });
		if (problemId) qb.andWhere('problem.id = :problemId', { problemId });
		if (language) qb.andWhere('submission.language = :language', { language });
		if (status) qb.andWhere('submission.status = :status', { status });

		const [submissions, total] = await qb
			.skip((page - 1) * limit)
			.take(limit)
			.getManyAndCount();

		// Calculate statistics based on the same filters (without pagination)
		const statsQb = this.submissionRepository
			.createQueryBuilder('submission')
			.leftJoin('submission.author', 'author')
			.leftJoin('submission.problem', 'problem');

		if (authorId) statsQb.andWhere('author.id = :authorId', { authorId });
		if (problemId) statsQb.andWhere('problem.id = :problemId', { problemId });
		if (language) statsQb.andWhere('submission.language = :language', { language });
		if (status) statsQb.andWhere('submission.status = :status', { status });

		// Get status statistics
		const statusStats = await statsQb
			.clone()
			.select('submission.status', 'status')
			.addSelect('COUNT(*)', 'count')
			.groupBy('submission.status')
			.getRawMany();

		// Get language statistics
		const languageStats = await statsQb
			.clone()
			.select('submission.language', 'language')
			.addSelect('COUNT(*)', 'count')
			.groupBy('submission.language')
			.getRawMany();

		// Transform raw results to proper DTOs
		const statusStatistics: StatusStatistic[] = statusStats.map(stat => ({
			status: stat.status,
			count: parseInt(stat.count, 10)
		}));

		const languageStatistics: LanguageStatistic[] = languageStats.map(stat => ({
			language: stat.language,
			count: parseInt(stat.count, 10)
		}));

		// Add canView field and calculate time/memory/accepted test cases for each submission
		const submissionsWithCanView = submissions.map(submission => {
			let totalTime = 0;
			let maxMemory = 0;
			let acceptedTestCases = 0;
			let totalTestCases = 0;

			if (submission.results && submission.results.length > 0) {
				totalTime = submission.results.reduce((sum, result) => sum + (result.executionTime || 0), 0);
				maxMemory = Math.max(...submission.results.map(result => result.memoryUsed || 0));
				
				// Count accepted test cases
				acceptedTestCases = submission.results.filter(result => result.status === SubmissionResultStatus.ACCEPTED).length;
				totalTestCases = submission.results.length;
			}

			return {
				...submission,
				canView: user ? (user.role === UserRole.ADMIN || submission.author.id === user.id) : false,
				time: totalTime,
				memory: maxMemory,
				acceptedTestCases,
				totalTestCases
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
}
