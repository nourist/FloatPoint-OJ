import { Controller, Get } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { JudgerService } from './judger.service';

export type JudgerAck = {
	id: string;
	judger_id: string;
};

export enum JudgerResultStatus {
	CE = 'CE',
	IE = 'IE',
	OK = 'OK',
}

export enum TestCaseStatus {
	AC = 'AC',
	WA = 'WA',
	RTE = 'RTE',
	TLE = 'TLE',
	MLE = 'MLE',
}

export type TestCaseResult = {
	slug: string;
	status: TestCaseStatus;
	time: number;
	memory: number;
};

export type JudgerResult = {
	id: string;
	judger_id: string;
	log: string;
	status: JudgerResultStatus;
	test_results: TestCaseResult[];
};

export type JudgerHeartbeat = {
	judger_id: string;
	timestamp: number;
};

@Controller('judger')
export class JudgerController {
	constructor(private readonly judgerService: JudgerService) {}

	@Get('')
	async getAllJudger() {
		const judgers = await this.judgerService.getAllJudger();
		return { message: 'Judger list', judgers };
	}

	@EventPattern('judger.ack')
	async handleJudgerAck(@Payload() data: JudgerAck) {
		await this.judgerService.handleJudgerAck(data);
	}

	@EventPattern('judger.result')
	async handleJudgerResult(@Payload() data: JudgerResult) {
		await this.judgerService.handleJudgerResult(data);
	}

	@EventPattern('judger.heartbeat')
	async handleJudgerHeartbeat(@Payload() data: JudgerHeartbeat) {
		await this.judgerService.handleJudgerHeartbeat(data);
	}
}
