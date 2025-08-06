import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProblemService } from '../problem/problem.service';
import { GetAllSubmissionsDto, SubmitCodeDto } from './submission.dto';
import { Submission } from 'src/entities/submission.entity';
import { User, UserRole } from 'src/entities/user.entity';

@Injectable()
export class SubmissionService {
	constructor(
		@InjectRepository(Submission)
		private readonly submissionRepository: Repository<Submission>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@Inject('JUDGER_JOB_QUEUE')
		private readonly judgerJobQueue: ClientProxy,
		private readonly problemService: ProblemService,
	) {}

	async findOne(id: string) {
		const submission = await this.submissionRepository.findOne({ where: { id }, relations: ['problem', 'author'] });
		if (!submission) {
			throw new NotFoundException(`Submission with ID ${id} not found`);
		}
		return submission;
	}

	async findAll(query: GetAllSubmissionsDto, user: User) {
		const { authorId, problemId, language, status, page, limit } = query;

		const qb = this.submissionRepository.createQueryBuilder('submission').leftJoinAndSelect('submission.problem', 'problem').leftJoinAndSelect('submission.author', 'author');

		if (user.role !== UserRole.ADMIN) {
			qb.andWhere('author.id = :userId', { userId: user.id });
		}

		if (authorId) {
			qb.andWhere('author.id = :authorId', { authorId });
		}

		if (problemId) {
			qb.andWhere('problem.id = :problemId', { problemId });
		}

		if (language) {
			qb.andWhere('submission.language = :language', { language });
		}

		if (status) {
			qb.andWhere('submission.status = :status', { status });
		}

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
		const userWithContest = await this.userRepository.findOne({ where: { id: user.id }, relations: ['joiningContest'] });
		const submission = this.submissionRepository.create({
			sourceCode: body.code,
			language: body.language,
			problem,
			author: user,
			contest: userWithContest?.joiningContest,
		});
		const savedSubmission = await this.submissionRepository.save(submission);

		this.judgerJobQueue.emit('judge_problem', { id: submission.id, problemId: problem.id, sourceCode: body.code, language: body.language });

		return savedSubmission;
	}
}
