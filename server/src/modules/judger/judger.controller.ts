import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { JudgerService } from './judger.service';

export type JudgerAck = {
	id: string;
};

export enum JudgerResultStatus {
	CE,
	IE,
	OK,
}

export enum TestCaseStatus {
	AC,
	WA,
	RTE,
	TLE,
	MLE,
}

export type TestCaseResult = {
	slug: string;
	status: TestCaseStatus;
	time: number;
	memory: number;
};

export type JudgerResult = {
	id: string;
	log: string;
	status: JudgerResultStatus;
	test_results: TestCaseResult[];
};

@Controller()
export class JudgerController {
	constructor(private readonly judgerService: JudgerService) {}

	@EventPattern('judger.ack')
	async handleJudgerAck(@Payload() data: JudgerAck) {
		await this.judgerService.handleJudgerAck(data);
	}

	@EventPattern('judger.result')
	async handleJudgerResult(@Payload() data: JudgerResult) {
		await this.judgerService.handleJudgerResult(data);
	}
}
