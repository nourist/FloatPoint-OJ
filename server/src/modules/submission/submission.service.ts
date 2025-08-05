import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetAllSubmissionsDto } from './submission.dto';
import { Problem } from 'src/entities/problem.entity';
import { Submission } from 'src/entities/submission.entity';
import { User, UserRole } from 'src/entities/user.entity';

@Injectable()
export class SubmissionService {
	constructor(
		@InjectRepository(Submission)
		private readonly submissionRepository: Repository<Submission>,
		@InjectRepository(Problem)
		private readonly problemRepository: Repository<Problem>,
	) {}

	async findOne(id: string) {
		const submission = await this.submissionRepository.findOne({ where: { id }, relations: ['problem', 'author'] });
		if (!submission) {
			throw new NotFoundException(`Submission with ID ${id} not found`);
		}
		return submission;
	}

	async findAll(query: GetAllSubmissionsDto, user: User) {
		const { authorId, problemId, language, status, page, limit, sortBy, order } = query;

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

		if (sortBy) {
			qb.orderBy(`submission.${sortBy}`, order || 'DESC');
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
}
