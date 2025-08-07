import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Message } from 'amqplib';

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

	@EventPattern()
	async handle(@Payload() data: JudgerAck | JudgerResult, @Ctx() context: RmqContext) {
		const routingKey: string = (context.getMessage() as Message).fields.routingKey;
		if (routingKey === 'judger.ack') {
			await this.judgerService.handleJudgerAck(data as JudgerAck);
		} else {
			this.judgerService.handleJudgerResult(data as JudgerResult);
		}
	}
}
