import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProblemModule } from '../problem/problem.module';
import { UserModule } from '../user/user.module';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { SubmissionResult } from 'src/entities/submission-result.entity';
import { Submission } from 'src/entities/submission.entity';

@Module({
	controllers: [SubmissionController],
	providers: [SubmissionService],
	imports: [
		TypeOrmModule.forFeature([Submission, SubmissionResult]),
		forwardRef(() => UserModule),
		ProblemModule,
		ClientsModule.registerAsync([
			{
				name: 'JUDGER_JOB_QUEUE',
				imports: [ConfigModule],
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [
							`amqp://${configService.get<string>('RABBITMQ_USER')}:${configService.get<string>('RABBITMQ_PASS')}@${configService.get<string>('RABBITMQ_HOST')}:${configService.get<number>('RABBITMQ_PORT')}`,
						],
						queue: 'judger.job',
						queueOptions: {
							durable: true,
						},
					},
				}),
			},
		]),
	],
	exports: [TypeOrmModule, SubmissionService],
})
export class SubmissionModule {}
