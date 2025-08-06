import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

import { JudgerService } from './judger.service';

@Controller()
export class JudgerController {
	constructor(private readonly judgerService: JudgerService) {}

	@EventPattern('judger_ack')
	async handleJudgerAck(@Payload() data: { id: string }, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef() as Channel;
		const message = context.getMessage() as Message;

		try {
			await this.judgerService.handleJudgerAck(data);
			channel.ack(message);
		} catch (error) {
			channel.nack(message, false, true); // Reject and requeue
			throw error;
		}
	}

	@EventPattern('judger_result')
	handleJudgerResult(@Payload() data: Record<string, any>, @Ctx() context: RmqContext) {
		this.judgerService.handleJudgerResult(data);
		const channel = context.getChannelRef() as Channel;
		const message = context.getMessage() as Message;
		channel.ack(message);
	}
}
