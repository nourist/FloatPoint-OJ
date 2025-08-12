import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { JudgerService } from './judger.service';

type JudgerAck = {
	id: string;
};

type JudgerResult = {
	id: string;
};

@Controller()
export class JudgerController {
	constructor(private readonly judgerService: JudgerService) {}

	@EventPattern('judger.ack')
	async handleJudgerAck(@Payload() data: JudgerAck) {
		await this.judgerService.handleJudgerAck(data);
	}

	@EventPattern('judger.result')
	handleJudgerResult(@Payload() data: JudgerResult) {
		this.judgerService.handleJudgerResult(data);
	}
}
