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
		
		const submission = await this.submissionRepository.findOneByOrFail({ id: data.id });
		submission.status = SubmissionStatus.JUDGING;
		
		const updatedSubmission = await this.submissionRepository.save(submission);
		this.judgerGateway.server.emit('submission_update', updatedSubmission);
	}

	async handleJudgerResult(data: JudgerResult) {
		this.logger.log(`Received judger_result: ${JSON.stringify(data)}`);
		const submission = await this.submissionService.findOne(data.id);
		const problem = await this.problemService.getProblemById(submission.problem.id);

		if (data.status == JudgerResultStatus.CE) {
			submission.status = SubmissionStatus.COMPILATION_ERROR;
			submission.log = data.log;
			const updatedSubmission = await this.submissionRepository.save(submission);
			this.judgerGateway.server.emit('submission_update', updatedSubmission);
			return;
		}

		if (data.status == JudgerResultStatus.IE) {
			submission.status = SubmissionStatus.INTERNAL_ERROR;
			submission.log = data.log;
			const updatedSubmission = await this.submissionRepository.save(submission);
			this.judgerGateway.server.emit('submission_update', updatedSubmission);
			return;
		}

		const statusPriority = [TestCaseStatus.RTE, TestCaseStatus.TLE, TestCaseStatus.MLE, TestCaseStatus.WA, TestCaseStatus.AC];

		
		const statusResultMap = {
			[TestCaseStatus.RTE]: SubmissionResultStatus.RUNTIME_ERROR,
			[TestCaseStatus.TLE]: SubmissionResultStatus.TIME_LIMIT_EXCEEDED,
			[TestCaseStatus.MLE]: SubmissionResultStatus.MEMORY_LIMIT_EXCEEDED,
			[TestCaseStatus.WA]: SubmissionResultStatus.WRONG_ANSWER,
			[TestCaseStatus.AC]: SubmissionResultStatus.ACCEPTED,
		};

		const results = data.test_results.map((r) =>
			this.submissionResultRepository.create({
			  slug: r.slug,
			  status: statusResultMap[r.status],
			  executionTime: r.time,
			  memoryUsed: r.memory,
			  submission, 
			}),
		  );
		  
		  submission.results = results;

		const statusMap = {
			[TestCaseStatus.RTE]: SubmissionStatus.RUNTIME_ERROR,
			[TestCaseStatus.TLE]: SubmissionStatus.TIME_LIMIT_EXCEEDED,
			[TestCaseStatus.MLE]: SubmissionStatus.MEMORY_LIMIT_EXCEEDED,
			[TestCaseStatus.WA]: SubmissionStatus.WRONG_ANSWER,
			[TestCaseStatus.AC]: SubmissionStatus.ACCEPTED,
		};

		if (problem.scoringMethod == ProblemScoringMethod.STANDARD) {
			const status = data.test_results.reduce((acc, cur) => {
				const accIndex = statusPriority.indexOf(acc);
				const curIndex = statusPriority.indexOf(cur.status);
				// Return the worse status (lower index in priority array)
				return curIndex < accIndex ? cur.status : acc;
			}, TestCaseStatus.AC);

			const AcCount: number = data.test_results.reduce((acc, cur) => acc + (cur.status == TestCaseStatus.AC ? 1 : 0), 0);

			submission.status = statusMap[status];
			submission.totalScore = (AcCount / data.test_results.length) * problem.point;

			const updatedSubmission = await this.submissionRepository.save(submission);
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
					const accIndex = statusPriority.indexOf(acc);
					const curIndex = statusPriority.indexOf(cur.status);
					// Return the worse status (lower index in priority array)
					return curIndex < accIndex ? cur.status : acc;
				}, TestCaseStatus.AC);
				const accIndex = statusPriority.indexOf(acc);
				const subtaskIndex = statusPriority.indexOf(subtaskStatus);
				// Return the worse status (lower index in priority array)
				return subtaskIndex < accIndex ? subtaskStatus : acc;
			}, TestCaseStatus.AC);

			const totalScore = Object.values(subtaskMap).reduce((acc, cur) => {
				const isSubtaskAc = cur.every((tc) => tc.status == TestCaseStatus.AC);
				return isSubtaskAc ? acc + (cur.length / data.test_results.length) * problem.point : acc;
			}, 0);

			submission.status = statusMap[status];
			submission.totalScore = totalScore;

			const updatedSubmission = await this.submissionRepository.save(submission);
			this.judgerGateway.server.emit('submission_update', updatedSubmission);
		} else {
			const status = data.test_results.reduce((acc, cur) => {
				const accIndex = statusPriority.indexOf(acc);
				const curIndex = statusPriority.indexOf(cur.status);
				// Return the worse status (lower index in priority array)
				return curIndex < accIndex ? cur.status : acc;
			}, TestCaseStatus.AC);

			submission.status = statusMap[status];
			submission.totalScore = status == TestCaseStatus.AC ? problem.point : 0;

			const updatedSubmission = await this.submissionRepository.save(submission);
			this.judgerGateway.server.emit('submission_update', updatedSubmission);
		}
	}
}
