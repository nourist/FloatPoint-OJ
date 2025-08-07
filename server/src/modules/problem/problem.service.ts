import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as path from 'path';
import slug from 'slugify';
import { Repository } from 'typeorm';
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
import { Submission } from 'src/entities/submission.entity';
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
		const problem = await this.problemRepository.findOne({ where: { id }, relations: ['tags', 'editorial'] });
		if (!problem) {
			this.logger.log(`Problem with ID ${id} not found`);
			throw new NotFoundException(`Problem with ID ${id} not found`);
		}
		return problem;
	}

	async getProblemBySlug(slug: string) {
		const problem = await this.problemRepository.findOne({ where: { slug }, relations: ['tags', 'editorial'] });
		if (!problem) {
			this.logger.log(`Problem with slug ${slug} not found`);
			throw new NotFoundException(`Problem with slug ${slug} not found`);
		}
		return problem;
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

	async findAll(query: GetAllProblemsDto) {
		const { minPoint, maxPoint, difficulty, tags, q, page, limit, sortBy, order, hasEditorial } = query;

		const qb = this.problemRepository.createQueryBuilder('problem').leftJoinAndSelect('problem.tags', 'tags').leftJoinAndSelect('problem.editorial', 'editorial');

		if (minPoint) {
			qb.andWhere('problem.point >= :minPoint', { minPoint });
		}

		if (maxPoint) {
			qb.andWhere('problem.point <= :maxPoint', { maxPoint });
		}

		if (difficulty) {
			qb.andWhere('problem.difficulty = :difficulty', { difficulty });
		}

		if (tags && tags.length > 0) {
			qb.andWhere('tags.name IN (:...tags)', { tags });
		}

		if (q) {
			qb.andWhere('problem.title ILIKE :q', { q: `%${q}%` });
		}

		if (hasEditorial) {
			qb.andWhere('editorial.id IS NOT NULL');
		}

		if (sortBy) {
			if (sortBy === 'acCount') {
				qb.addSelect((subQuery) => {
					return subQuery
						.select('COUNT(submission.id)')
						.from(Submission, 'submission')
						.where('submission.problemId = problem.id')
						.andWhere('submission.status = :status', { status: 'AC' });
				}, 'acCount');
				qb.orderBy('acCount', order || 'DESC');
			} else if (sortBy === 'acRate') {
				qb.addSelect((subQuery) => {
					return subQuery
						.select(
							'CASE WHEN COUNT(submission.id) > 0 THEN CAST(SUM(CASE WHEN submission.status = :status THEN 1 ELSE 0 END) AS FLOAT) / COUNT(submission.id) ELSE 0 END',
						)
						.from(Submission, 'submission')
						.where('submission.problemId = problem.id')
						.setParameter('status', 'AC');
				}, 'acRate');
				qb.orderBy('acRate', order || 'DESC');
			} else {
				qb.orderBy(`problem.${sortBy}`, order || 'ASC');
			}
		}

		const [problems, total] = await qb
			.skip((page - 1) * limit)
			.take(limit)
			.getManyAndCount();

		return {
			problems,
			total,
			page,
			limit,
		};
	}

	@Transactional()
	async create(data: CreateProblemDto, creator: User) {
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

		if (data.tags) {
			const tagEntities = await this.getOrCreateTags(data.tags);
			problem.tags = tagEntities;
		}
		Object.assign(problem, data);

		if (data.title) {
			const newProblemSlug = slug(data.title, { lower: true });
			if (await this.isSlugExists(newProblemSlug)) {
				this.logger.log(`Problem with slug ${newProblemSlug} already exists`);
				throw new BadRequestException(`Problem with slug ${newProblemSlug} already exists`);
			}
			problem.slug = newProblemSlug;
		}

		return this.problemRepository.save(problem);
	}

	@Transactional()
	async remove(id: string) {
		const problem = await this.getProblemById(id);
		await this.problemRepository.remove(problem);
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
			await this.minioService.renameDir('test-cases', path.join(problemId, oldSubtaskSlug), path.join(problemId, subtask.slug));
		}

		return savedSubtask;
	}

	@Transactional()
	async removeSubtask(problemId: string, subtaskSlug: string) {
		const subtask = await this.getSubtaskBySlug(problemId, subtaskSlug);
		await this.subtaskRepository.remove(subtask);
		// Remove files after successful database deletion
		await this.minioService.removeDir('test-cases', path.join(problemId, subtaskSlug));
	}
	async isTestCaseSlugExists(problemId: string, subtaskSlug: string, testCaseSlug: string) {
		const subtask = await this.getSubtaskBySlug(problemId, subtaskSlug);
		const testCase = await this.testCaseRepository.findOne({ where: { slug: testCaseSlug, subtask } });
		return !!testCase;
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

		const input = await this.minioService.getFileContent('test-cases', path.join(problemId, subtaskSlug, testCaseSlug, 'input'));
		const output = await this.minioService.getFileContent('test-cases', path.join(problemId, subtaskSlug, testCaseSlug, 'output'));

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
		await this.minioService.saveFile('test-cases', path.join(problemId, subtaskSlug, testCaseSlug, 'input'), data.input);
		await this.minioService.saveFile('test-cases', path.join(problemId, subtaskSlug, testCaseSlug, 'output'), data.output);
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
			await this.minioService.saveFile('test-cases', path.join(problemId, subtaskSlug, testCaseSlug, 'input'), data.input);
		}

		if (data.output) {
			await this.minioService.saveFile('test-cases', path.join(problemId, subtaskSlug, testCaseSlug, 'output'), data.output);
		}

		const savedTestCase = await this.testCaseRepository.save(testCase);

		if (data.name) {
			await this.minioService.renameFile(
				'test-cases',
				path.join(problemId, subtaskSlug, oldTestCaseSlug, 'input'),
				path.join(problemId, subtaskSlug, testCase.slug, 'input'),
			);
			await this.minioService.renameFile(
				'test-cases',
				path.join(problemId, subtaskSlug, oldTestCaseSlug, 'output'),
				path.join(problemId, subtaskSlug, testCase.slug, 'output'),
			);
		}

		return savedTestCase;
	}

	@Transactional()
	async removeTestCase(problemId: string, subtaskSlug: string, testCaseSlug: string) {
		const testCase = await this.getTestCaseBySlug(problemId, subtaskSlug, testCaseSlug);
		await this.testCaseRepository.remove(testCase);
		// Remove files after successful database deletion
		await this.minioService.removeFile('test-cases', path.join(problemId, subtaskSlug, testCaseSlug, 'input'));
		await this.minioService.removeFile('test-cases', path.join(problemId, subtaskSlug, testCaseSlug, 'output'));
	}
}
