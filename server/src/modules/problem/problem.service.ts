import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slug from 'slugify';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import {
	CreateProblemDto,
	CreateProblemEditorialDto,
	CreateSubtaskDto,
	CreateTestCaseDto,
	GetAllProblemsDto,
	UpdateProblemDto,
	UpdateProblemEditorialDto,
	UpdateSubtaskDto,
	UpdateTestCaseDto,
} from './problem.dto';
import { ProblemEditorial } from 'src/entities/problem-editorial.entity';
import { ProblemTag } from 'src/entities/problem-tag.entity';
import { Problem } from 'src/entities/problem.entity';
import { Submission, SubmissionStatus } from 'src/entities/submission.entity';
import { Subtask } from 'src/entities/subtask.entity';
import { TestCase } from 'src/entities/test-case.entity';
import { User } from 'src/entities/user.entity';
import { MinioService } from 'src/modules/minio/minio.service';
import { NotificationService } from 'src/modules/notification/notification.service';

@Injectable()
export class ProblemService {
	private readonly logger = new Logger(ProblemService.name);

	constructor(
		@InjectRepository(Problem)
		private readonly problemRepository: Repository<Problem>,
		@InjectRepository(ProblemTag)
		private readonly problemTagRepository: Repository<ProblemTag>,
		@InjectRepository(TestCase)
		private readonly testCaseRepository: Repository<TestCase>,
		@InjectRepository(Subtask)
		private readonly subtaskRepository: Repository<Subtask>,
		@InjectRepository(ProblemEditorial)
		private readonly problemEditorialRepository: Repository<ProblemEditorial>,
		private readonly minioService: MinioService,
		private readonly notificationService: NotificationService,
	) {}

	async getProblemById(id: string) {
		const problem = await this.problemRepository.findOne({ where: { id }, relations: ['tags', 'editorial', 'editorial.creator'] });
		if (!problem) {
			this.logger.log(`Problem with ID ${id} not found`);
			throw new NotFoundException(`Problem with ID ${id} not found`);
		}
		return problem;
	}

	async getProblemBySlug(slug: string) {
		const problem = await this.problemRepository.findOne({ where: { slug }, relations: ['tags', 'editorial', 'editorial.creator'] });
		if (!problem) {
			this.logger.log(`Problem with slug ${slug} not found`);
			throw new NotFoundException(`Problem with slug ${slug} not found`);
		}
		return problem;
	}

	// Calculates submission statistics for a problem
	async getProblemStatistics(problem: Problem) {
		const result = await this.problemRepository.manager
			.createQueryBuilder(Submission, 'submission')
			.select('COUNT(submission.id)', 'submissionCount')
			.addSelect('SUM(CASE WHEN submission.status = :status THEN 1 ELSE 0 END)', 'acCount')
			.addSelect(
				`CASE WHEN COUNT(submission.id) > 0 THEN CAST(SUM(CASE WHEN submission.status = :status THEN 1 ELSE 0 END) AS FLOAT) / COUNT(submission.id) ELSE 0 END`,
				'acRate',
			)
			.where('submission.problemId = :problemId', { problemId: problem.id })
			.setParameter('status', SubmissionStatus.ACCEPTED)
			.getRawOne<{ submissionCount: string; acCount: string; acRate: string }>();

		return {
			submissionCount: Number(result?.submissionCount) || 0,
			acCount: Number(result?.acCount) || 0,
			acRate: Number(result?.acRate) || 0,
		};
	}

	async isSlugExists(slug: string) {
		const problem = await this.problemRepository.findOne({ where: { slug } });
		return !!problem;
	}

	async getOrCreateTags(tags: string[]) {
		return Promise.all(
			tags.map(async (tag) => {
				const existTag = await this.problemTagRepository.findOne({ where: { name: tag } });

				if (!existTag) {
					return await this.problemTagRepository.save({ name: tag });
				} else {
					return existTag;
				}
			}),
		);
	}

	/**
	 * Retrieves all problems with filtering, sorting, and pagination
	 */
	async findAll(query: GetAllProblemsDto, user?: User) {
		const { minPoint, maxPoint, difficulty, tags, q, page, limit, sortBy, order, hasEditorial, status } = query;

		const qb = this.problemRepository.createQueryBuilder('problem').leftJoinAndSelect('problem.tags', 'tags').leftJoinAndSelect('problem.editorial', 'editorial');

		// Add submission statistics subquery for PostgreSQL
		qb.leftJoin(
			(sq) =>
				sq
					.select('s."problemId"', 'problemId')
					.addSelect('COUNT(*)', 'total')
					.addSelect(`COUNT(*) FILTER (WHERE s.status = :ac)`, 'ac')
					.from(Submission, 's')
					.groupBy('s."problemId"'),
			'stats',
			`stats."problemId" = problem.id`,
			{ ac: SubmissionStatus.ACCEPTED },
		);

		// Add statistical fields for sorting
		qb.addSelect('COALESCE(stats.ac, 0)', 'ac_count');
		qb.addSelect('COALESCE(stats.total, 0)', 'total_submissions');
		qb.addSelect(
			`CASE WHEN COALESCE(stats.total, 0) > 0
				THEN (stats.ac::float / stats.total)
				ELSE 0 END`,
			'ac_rate',
		);

		if (minPoint !== undefined) qb.andWhere('problem.point >= :minPoint', { minPoint });
		if (maxPoint !== undefined) qb.andWhere('problem.point <= :maxPoint', { maxPoint });
		if (difficulty) qb.andWhere('problem.difficulty = :difficulty', { difficulty });

		// Apply tags filter (all specified tags must match)
		if (tags?.length) {
			qb.andWhere((qb1) => {
				const sub = qb1
					.subQuery()
					.select('p.id')
					.from(Problem, 'p')
					.leftJoin('p.tags', 'ft')
					.where('ft.name IN (:...tags)', { tags })
					.groupBy('p.id')
					.having('COUNT(DISTINCT ft.id) = :tagCount', { tagCount: tags.length })
					.getQuery();
				return `problem.id IN ${sub}`;
			});
		}

		if (q) qb.andWhere('problem.title ILIKE :q', { q: `%${q}%` });
		if (hasEditorial) qb.andWhere('editorial.id IS NOT NULL');

		if (sortBy === 'acCount') {
			qb.orderBy('ac_count', (order as 'ASC' | 'DESC') || 'DESC');
		} else if (sortBy === 'acRate') {
			qb.orderBy('ac_rate', (order as 'ASC' | 'DESC') || 'DESC');
		} else if (sortBy) {
			qb.orderBy(`problem.${sortBy}`, (order as 'ASC' | 'DESC') || 'ASC');
		} else {
			qb.orderBy('problem.createdAt', 'DESC');
		}

		// Apply user-specific status filters
		if (user && status) {
			if (status === 'unattempted') {
				// Problems user has never submitted to
				qb.andWhere((sq) => {
					const sub = sq.subQuery().select('1').from(Submission, 's').where('s.problemId = problem.id').andWhere('s.authorId = :userId', { userId: user.id });
					return `NOT EXISTS ${sub.getQuery()}`;
				});
			} else if (status === 'attempted') {
				// Problems user has submitted to but not solved
				qb.andWhere((sq) => {
					const sub = sq
						.subQuery()
						.select('1')
						.from(Submission, 's')
						.where('s.problemId = problem.id')
						.andWhere('s.authorId = :userId', { userId: user.id })
						.andWhere('s.status = :acc', { acc: SubmissionStatus.ACCEPTED });
					return `NOT EXISTS ${sub.getQuery()}`;
				}).andWhere((sq) => {
					const sub = sq.subQuery().select('1').from(Submission, 's').where('s.problemId = problem.id').andWhere('s.authorId = :userId', { userId: user.id });
					return `EXISTS ${sub.getQuery()}`;
				});
			} else if (status === 'solved') {
				// Problems user has solved
				qb.andWhere((sq) => {
					const sub = sq
						.subQuery()
						.select('1')
						.from(Submission, 's')
						.where('s.problemId = problem.id')
						.andWhere('s.authorId = :userId', { userId: user.id })
						.andWhere('s.status = :acc', { acc: SubmissionStatus.ACCEPTED });
					return `EXISTS ${sub.getQuery()}`;
				});
			}
		}

		const { entities, raw } = await qb
			.skip((page - 1) * limit)
			.take(limit)
			.getRawAndEntities();

		// Map statistics by problem ID to avoid duplication from joins
		const statById = new Map<string, { ac: number; total: number; rate: number }>();
		for (const r of raw) {
			const pid = String(r.problem_id);
			if (!statById.has(pid)) {
				statById.set(pid, {
					ac: Number(r.ac_count) || 0,
					total: Number(r.total_submissions) || 0,
					rate: Number(r.ac_rate) || 0,
				});
			}
		}

		const problems: Problem[] = entities.map((problem) => {
			const stat = statById.get(problem.id) ?? { ac: 0, total: 0, rate: 0 };
			return { ...problem, acCount: stat.ac, acRate: stat.rate };
		});

		// Add user-specific status information
		if (user) {
			const problemIds = problems.map((p) => p.id);
			const submissions = await this.problemRepository.manager.find(Submission, {
				where: { author: { id: user.id }, problem: { id: In(problemIds) } },
				relations: ['problem'],
			});

			// Determine status for each problem based on user's submissions
			for (const problem of problems) {
				const subs = submissions.filter((s) => s.problem.id === problem.id);
				if (subs.some((s) => s.status === SubmissionStatus.ACCEPTED)) {
					problem.status = 'solved';
				} else if (subs.length > 0) {
					problem.status = 'attempted';
				} else {
					problem.status = null;
				}
			}
		}

		const total = await qb.clone().select('problem.id').distinct(true).getCount();

		return { problems, total, page, limit };
	}

	@Transactional()
	async create(data: CreateProblemDto, creator: User) {
		// Generate URL-friendly slug from title
		const problemSlug = slug(data.title, { lower: true });

		if (await this.isSlugExists(problemSlug)) {
			this.logger.log(`Problem with slug ${problemSlug} already exists`);
			throw new BadRequestException(`Problem with slug ${problemSlug} already exists`);
		}

		const problem = this.problemRepository.create({ ...data, tags: undefined, slug: problemSlug });
		problem.creator = creator;

		const tagEntities = await this.getOrCreateTags(data.tags);
		problem.tags = tagEntities;

		const savedProblem = await this.problemRepository.save(problem);

		await this.notificationService.createNewProblemNotification(savedProblem);

		return savedProblem;
	}

	async update(id: string, data: UpdateProblemDto) {
		const problem = await this.getProblemById(id);
		const { tags, statement, ...rest } = data;

		if (tags) {
			const tagEntities = await this.getOrCreateTags(tags);
			problem.tags = tagEntities;
		}

		// Handle statement update specifically
		if (statement !== undefined) {
			problem.statement = statement;
		}

		Object.assign(problem, rest);

		return this.problemRepository.save(problem);
	}

	@Transactional()
	async remove(id: string) {
		const problem = await this.getProblemById(id);

		await this.problemRepository.remove(problem);
		// Remove associated test case files from MinIO
		await this.minioService.removeDir('test-cases', id);
	}

	async isEditorialExists(problemId: string) {
		const editorial = await this.problemEditorialRepository.findOne({ where: { problem: { id: problemId } } });
		return !!editorial;
	}

	async getProblemEditorialByProblemId(problemId: string) {
		const editorial = await this.problemEditorialRepository.findOne({ where: { problem: { id: problemId } }, relations: ['problem', 'creator'] });
		if (!editorial) {
			this.logger.log(`Editorial for problem ${problemId} not found`);
			throw new NotFoundException(`Editorial for problem ${problemId} not found`);
		}
		return editorial;
	}

	async getProblemEditorialByProblemSlug(problemSlug: string) {
		const editorial = await this.problemEditorialRepository.findOne({ where: { problem: { slug: problemSlug } }, relations: ['problem', 'creator'] });
		if (!editorial) {
			this.logger.log(`Editorial for problem ${problemSlug} not found`);
			throw new NotFoundException(`Editorial for problem ${problemSlug} not found`);
		}
		return editorial;
	}

	async createEditorial(problemId: string, data: CreateProblemEditorialDto, creator: User) {
		const problem = await this.getProblemById(problemId);

		if (await this.isEditorialExists(problemId)) {
			this.logger.log(`Editorial for problem ${problemId} already exists`);
			throw new BadRequestException(`Editorial for problem ${problemId} already exists`);
		}

		const problemEditorial = this.problemEditorialRepository.create({ content: data.content, creator, problem });
		return this.problemEditorialRepository.save(problemEditorial);
	}

	async updateEditorial(problemId: string, data: UpdateProblemEditorialDto) {
		const editorial = await this.getProblemEditorialByProblemId(problemId);
		Object.assign(editorial, data);
		return this.problemEditorialRepository.save(editorial);
	}

	async removeEditorial(problemId: string) {
		const editorial = await this.getProblemEditorialByProblemId(problemId);
		await this.problemEditorialRepository.remove(editorial);
	}

	async isSubtaskSlugExists(problemId: string, subtaskSlug: string) {
		const subtask = await this.subtaskRepository.findOne({ where: { slug: subtaskSlug, problem: { id: problemId } } });
		return !!subtask;
	}

	async getAllSubtasks(problemId: string) {
		return this.subtaskRepository.find({ where: { problem: { id: problemId } }, relations: ['problem', 'testCases'] });
	}

	async getSubtaskBySlug(problemId: string, subtaskSlug: string) {
		const subtask = await this.subtaskRepository.findOne({ where: { slug: subtaskSlug, problem: { id: problemId } }, relations: ['problem', 'testCases'] });
		if (!subtask) {
			this.logger.log(`Subtask ${subtaskSlug} for problem ${problemId} not found`);
			throw new NotFoundException(`Subtask ${subtaskSlug} for problem ${problemId} not found`);
		}
		return subtask;
	}

	async createSubtask(problemId: string, data: CreateSubtaskDto) {
		const problem = await this.getProblemById(problemId);

		const subtaskSlug = slug(data.name, { lower: true });

		if (await this.isSubtaskSlugExists(problemId, subtaskSlug)) {
			this.logger.log(`Subtask ${data.name} for problem ${problemId} already exists`);
			throw new BadRequestException(`Subtask ${data.name} for problem ${problemId} already exists`);
		}

		const subtask = this.subtaskRepository.create({ ...data, problem, slug: subtaskSlug });
		return this.subtaskRepository.save(subtask);
	}

	@Transactional()
	async updateSubtask(problemId: string, subtaskSlug: string, data: UpdateSubtaskDto) {
		const subtask = await this.getSubtaskBySlug(problemId, subtaskSlug);

		const oldSubtaskSlug = subtask.slug;

		if (data.name) {
			const newSubtaskSlug = slug(data.name, { lower: true });
			if (await this.isSubtaskSlugExists(problemId, newSubtaskSlug)) {
				this.logger.log(`Subtask ${data.name} for problem ${problemId} already exists`);
				throw new BadRequestException(`Subtask ${data.name} for problem ${problemId} already exists`);
			}
			subtask.slug = newSubtaskSlug;
		}

		Object.assign(subtask, data);
		const savedSubtask = await this.subtaskRepository.save(subtask);

		if (data.name) {
			await this.minioService.renameDir('test-cases', this.minioService.joinPath(problemId, oldSubtaskSlug), this.minioService.joinPath(problemId, subtask.slug));
		}

		return savedSubtask;
	}

	@Transactional()
	async removeSubtask(problemId: string, subtaskSlug: string) {
		const subtask = await this.getSubtaskBySlug(problemId, subtaskSlug);
		await this.subtaskRepository.remove(subtask);
		// Remove files after successful database deletion
		await this.minioService.removeDir('test-cases', this.minioService.joinPath(problemId, subtaskSlug));
	}

	async isTestCaseSlugExists(problemId: string, subtaskSlug: string, testCaseSlug: string) {
		return await this.testCaseRepository.exists({
			where: { slug: testCaseSlug, subtask: { slug: subtaskSlug, problem: { id: problemId } } },
		});
	}

	async getTestCaseBySlug(problemId: string, subtaskSlug: string, testCaseSlug: string) {
		const testcase = await this.testCaseRepository.findOne({ where: { slug: testCaseSlug, subtask: { slug: subtaskSlug, problem: { id: problemId } } } });
		if (!testcase) {
			this.logger.log(`Test case ${testCaseSlug} for subtask ${subtaskSlug} for problem ${problemId} not found`);
			throw new NotFoundException(`Test case ${testCaseSlug} for subtask ${subtaskSlug} for problem ${problemId} not found`);
		}
		return testcase;
	}

	async getTestCaseContentBySlug(problemId: string, subtaskSlug: string, testCaseSlug: string) {
		await this.getTestCaseBySlug(problemId, subtaskSlug, testCaseSlug);

		const input = await this.minioService.getFileContent('test-cases', this.minioService.joinPath(problemId, subtaskSlug, testCaseSlug, 'input'));
		const output = await this.minioService.getFileContent('test-cases', this.minioService.joinPath(problemId, subtaskSlug, testCaseSlug, 'output'));

		return {
			input,
			output,
		};
	}

	@Transactional()
	async createTestCase(problemId: string, subtaskSlug: string, data: CreateTestCaseDto) {
		const subtask = await this.getSubtaskBySlug(problemId, subtaskSlug);
		const testCaseSlug = slug(data.name, { lower: true });
		if (await this.isTestCaseSlugExists(problemId, subtaskSlug, testCaseSlug)) {
			this.logger.log(`Test case ${data.name} for subtask ${subtaskSlug} for problem ${problemId} already exists`);
			throw new BadRequestException(`Test case ${data.name} for subtask ${subtaskSlug} for problem ${problemId} already exists`);
		}
		const testCase = this.testCaseRepository.create({ ...data, subtask, slug: testCaseSlug });
		await this.minioService.saveFile('test-cases', this.minioService.joinPath(problemId, subtaskSlug, testCaseSlug, 'input'), data.input);
		await this.minioService.saveFile('test-cases', this.minioService.joinPath(problemId, subtaskSlug, testCaseSlug, 'output'), data.output);
		return this.testCaseRepository.save(testCase);
	}

	@Transactional()
	async updateTestCase(problemId: string, subtaskSlug: string, testCaseSlug: string, data: UpdateTestCaseDto) {
		const testCase = await this.getTestCaseBySlug(problemId, subtaskSlug, testCaseSlug);

		const oldTestCaseSlug = testCase.slug;

		if (data.name) {
			const newTestCaseSlug = slug(data.name, { lower: true });
			if (await this.isTestCaseSlugExists(problemId, subtaskSlug, newTestCaseSlug)) {
				this.logger.log(`Test case ${data.name} for subtask ${subtaskSlug} for problem ${problemId} already exists`);
				throw new BadRequestException(`Test case ${data.name} for subtask ${subtaskSlug} for problem ${problemId} already exists`);
			}
			testCase.slug = newTestCaseSlug;
		}

		Object.assign(testCase, data);

		if (data.input) {
			await this.minioService.saveFile('test-cases', this.minioService.joinPath(problemId, subtaskSlug, testCaseSlug, 'input'), data.input);
		}

		if (data.output) {
			await this.minioService.saveFile('test-cases', this.minioService.joinPath(problemId, subtaskSlug, testCaseSlug, 'output'), data.output);
		}

		const savedTestCase = await this.testCaseRepository.save(testCase);

		if (data.name) {
			await this.minioService.renameFile(
				'test-cases',
				this.minioService.joinPath(problemId, subtaskSlug, oldTestCaseSlug, 'input'),
				this.minioService.joinPath(problemId, subtaskSlug, testCase.slug, 'input'),
			);
			await this.minioService.renameFile(
				'test-cases',
				this.minioService.joinPath(problemId, subtaskSlug, oldTestCaseSlug, 'output'),
				this.minioService.joinPath(problemId, subtaskSlug, testCase.slug, 'output'),
			);
		}

		return savedTestCase;
	}

	@Transactional()
	async removeTestCase(problemId: string, subtaskSlug: string, testCaseSlug: string) {
		const testCase = await this.getTestCaseBySlug(problemId, subtaskSlug, testCaseSlug);
		await this.testCaseRepository.remove(testCase);
		// Remove files after successful database deletion
		await this.minioService.removeFile('test-cases', this.minioService.joinPath(problemId, subtaskSlug, testCaseSlug, 'input'));
		await this.minioService.removeFile('test-cases', this.minioService.joinPath(problemId, subtaskSlug, testCaseSlug, 'output'));
	}

	async getMinPoint(): Promise<number> {
		const result = await this.problemRepository.createQueryBuilder('problem').select('MIN(problem.point)', 'min').getRawOne<{ min: number }>();
		return result?.min || 0;
	}

	async getMaxPoint(): Promise<number> {
		const result = await this.problemRepository.createQueryBuilder('problem').select('MAX(problem.point)', 'max').getRawOne<{ max: number }>();
		return result?.max || 0;
	}

	async getAllTags(): Promise<ProblemTag[]> {
		return this.problemTagRepository.find();
	}
}
