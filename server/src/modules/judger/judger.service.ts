import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JudgerGateway } from './judger.gateway';
import { Submission, SubmissionStatus } from 'src/entities/submission.entity';

@Injectable()
export class JudgerService {
	constructor(
		@InjectRepository(Submission)
		private readonly submissionRepository: Repository<Submission>,
		private readonly judgerGateway: JudgerGateway,
	) {}
	async handleJudgerAck(data: { id: string }) {
		const submission = await this.submissionRepository.update(data.id, { status: SubmissionStatus.JUDGING });
		this.judgerGateway.server.emit('submission_update', submission);
	}

	handleJudgerResult(data: Record<string, any>): void {
		console.log('📥 Received judger_result:', data);
	}
}
