import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProblemService } from '../problem/problem.service';
import { SubmissionService } from '../submission/submission.service';
import { JudgerAck, JudgerResult, JudgerResultStatus, TestCaseResult, TestCaseStatus } from './judger.controller';
import { JudgerGateway } from './judger.gateway';
import { ProblemScoringMethod } from 'src/entities/problem.entity';
import { SubmissionResult, SubmissionResultStatus } from 'src/entities/submission-result.entity';
import { Submission, SubmissionStatus } from 'src/entities/submission.entity';

@Injectable()
export class JudgerService {
	private readonly logger = new Logger(JudgerService.name);

	constructor(
		@InjectRepository(Submission)
		private readonly submissionRepository: Repository<Submission>,
		@InjectRepository(SubmissionResult)
		private readonly submissionResultRepository: Repository<SubmissionResult>,
		private readonly judgerGateway: JudgerGateway,
		private readonly submissionService: SubmissionService,
		private readonly problemService: ProblemService,
	) {}

	async handleJudgerAck(data: JudgerAck) {
		this.logger.log(`Received judger_ack: ${JSON.stringify(data)}`);
		const submission = await this.submissionRepository.update(data.id, { status: SubmissionStatus.JUDGING });
		this.judgerGateway.server.emit('submission_update', submission);
	}

	async createTestCaseResult(submissionId: string, data: TestCaseResult) {
		const submission = await this.submissionService.findOne(submissionId);

		const statusMap = {
			[TestCaseStatus.RTE]: SubmissionResultStatus.RUNTIME_ERROR,
			[TestCaseStatus.TLE]: SubmissionResultStatus.TIME_LIMIT_EXCEEDED,
			[TestCaseStatus.MLE]: SubmissionResultStatus.MEMORY_LIMIT_EXCEEDED,
			[TestCaseStatus.WA]: SubmissionResultStatus.WRONG_ANSWER,
			[TestCaseStatus.AC]: SubmissionResultStatus.ACCEPTED,
		};

		const submissionResult = this.submissionResultRepository.create({
			submission: submission,
			status: statusMap[data.status],
			executionTime: data.time,
			memoryUsed: data.memory,
			slug: data.slug,
		});
		await this.submissionResultRepository.save(submissionResult);
	}

	async handleJudgerResult(data: JudgerResult) {
		const submission = await this.submissionService.findOne(data.id);
		const problem = await this.problemService.getProblemById(submission.problem.id);

		if (data.status == JudgerResultStatus.CE) {
			const updatedSubmission = await this.submissionRepository.update(data.id, { status: SubmissionStatus.COMPILATION_ERROR, log: data.log });
			this.judgerGateway.server.emit('submission_update', updatedSubmission);
			return;
		}

		if (data.status == JudgerResultStatus.IE) {
			const updatedSubmission = await this.submissionRepository.update(data.id, { status: SubmissionStatus.INTERNAL_ERROR, log: data.log });
			this.judgerGateway.server.emit('submission_update', updatedSubmission);
			return;
		}

		const statusPriority = [TestCaseStatus.RTE, TestCaseStatus.TLE, TestCaseStatus.MLE, TestCaseStatus.WA, TestCaseStatus.AC];

		await Promise.all(data.test_results.map((result) => this.createTestCaseResult(data.id, result)));

		const statusMap = {
			[TestCaseStatus.RTE]: SubmissionStatus.RUNTIME_ERROR,
			[TestCaseStatus.TLE]: SubmissionStatus.TIME_LIMIT_EXCEEDED,
			[TestCaseStatus.MLE]: SubmissionStatus.MEMORY_LIMIT_EXCEEDED,
			[TestCaseStatus.WA]: SubmissionStatus.WRONG_ANSWER,
			[TestCaseStatus.AC]: SubmissionStatus.ACCEPTED,
		};

		if (problem.scoringMethod == ProblemScoringMethod.STANDARD) {
			const status = data.test_results.reduce((acc, cur) => {
				const index = statusPriority.indexOf(cur.status);
				if (index > statusPriority.indexOf(acc)) {
					return cur.status;
				}
				return acc;
			}, TestCaseStatus.AC);

			const AcCount: number = data.test_results.reduce((acc, cur) => acc + (cur.status == TestCaseStatus.AC ? 1 : 0), 0);

			const updatedSubmission = await this.submissionRepository.update(data.id, {
				status: statusMap[status],
				totalScore: (AcCount / data.test_results.length) * problem.point,
			});
			this.judgerGateway.server.emit('submission_update', updatedSubmission);
		} else if (problem.scoringMethod == ProblemScoringMethod.SUBTASK) {
			const subtaskMap: Record<string, TestCaseResult[]> = {};

			data.test_results.forEach((tc) => {
				const [subtask] = tc.slug.split('/');
				if (!subtaskMap[subtask]) subtaskMap[subtask] = [];
				subtaskMap[subtask].push(tc);
			});

			const status = Object.values(subtaskMap).reduce((acc, cur) => {
				const subtaskStatus = cur.reduce((acc, cur) => {
					const index = statusPriority.indexOf(cur.status);
					if (index > statusPriority.indexOf(acc)) {
						return cur.status;
					}
					return acc;
				}, TestCaseStatus.AC);
				const index = statusPriority.indexOf(subtaskStatus);
				if (index > statusPriority.indexOf(acc)) {
					return subtaskStatus;
				}
				return acc;
			}, TestCaseStatus.AC);

			const totalScore = Object.values(subtaskMap).reduce((acc, cur) => {
				const isSubtaskAc = cur.every((tc) => tc.status == TestCaseStatus.AC);
				if (isSubtaskAc) {
					return acc + (cur.length / data.test_results.length) * problem.point;
				}
				return acc;
			}, 0);

			const updatedSubmission = await this.submissionRepository.update(data.id, {
				status: statusMap[status],
				totalScore: totalScore,
			});
			this.judgerGateway.server.emit('submission_update', updatedSubmission);
		} /* 1/0 */ else {
			const status = data.test_results.reduce((acc, cur) => {
				const index = statusPriority.indexOf(cur.status);
				if (index > statusPriority.indexOf(acc)) {
					return cur.status;
				}
				return acc;
			}, TestCaseStatus.AC);

			const updatedSubmission = await this.submissionRepository.update(data.id, {
				status: statusMap[status],
				totalScore: status == TestCaseStatus.AC ? problem.point : 0,
			});
			this.judgerGateway.server.emit('submission_update', updatedSubmission);
		}
	}
}
