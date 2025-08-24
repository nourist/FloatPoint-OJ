import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ProblemService } from '../problem/problem.service';
import { UserService } from '../user/user.service';
import { GetAllSubmissionsDto, SubmitCodeDto } from './submission.dto';
import { Submission } from 'src/entities/submission.entity';
import { Subtask } from 'src/entities/subtask.entity';
import { TestCase } from 'src/entities/test-case.entity';
import { User, UserRole } from 'src/entities/user.entity';

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
			// Get all unique subtask slugs from submission results
			const subtaskSlugs = [...new Set(submission.results.map((result) => result.slug.split('/')[0]))];

			// Fetch all required subtasks with their test cases in one query
			const subtasks = await this.subtaskRepository.find({
				where: {
					problem: { id: submission.problem.id },
					slug: In(subtaskSlugs),
				},
				relations: ['testCases'],
			});

			// Create lookup maps for faster access
			const subtaskMap = new Map(subtasks.map((st) => [st.slug, st]));

			for (const result of submission.results) {
				const [subtaskSlug, testCaseSlug] = result.slug.split('/');

				const subtask = subtaskMap.get(subtaskSlug);
				if (subtask) {
					const testCase = subtask.testCases.find((tc) => tc.slug === testCaseSlug);
					(result as any).subtaskName = subtask.name;
					(result as any).testCaseName = testCase?.name || testCaseSlug;
				} else {
					(result as any).subtaskName = subtaskSlug;
					(result as any).testCaseName = testCaseSlug;
				}
			}
		}

		return submission;
	}

	async findAll(query: GetAllSubmissionsDto, user: User) {
		const { authorId, problemId, language, status, page, limit } = query;

		const qb = this.submissionRepository.createQueryBuilder('submission').leftJoinAndSelect('submission.problem', 'problem').leftJoinAndSelect('submission.author', 'author');

		if (user.role !== UserRole.ADMIN) {
			qb.andWhere('author.id = :userId', { userId: user.id });
		}

		if (authorId) qb.andWhere('author.id = :authorId', { authorId });
		if (problemId) qb.andWhere('problem.id = :problemId', { problemId });
		if (language) qb.andWhere('submission.language = :language', { language });
		if (status) qb.andWhere('submission.status = :status', { status });

		const [submissions, total] = await qb
			.skip((page - 1) * limit)
			.take(limit)
			.getManyAndCount();

		return {
			submissions,
			total,
			page,
			limit,
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

		this.judgerJobQueue.emit('judger.job', { id: savedSubmission.id, problemId: problem.id, sourceCode: body.code, language: body.language });

		return savedSubmission;
	}
}
