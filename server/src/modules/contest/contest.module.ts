import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationModule } from '../notification/notification.module';
import { ProblemModule } from '../problem/problem.module';
import { SubmissionModule } from '../submission/submission.module';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { Contest } from 'src/entities/contest.entity';
import { UserModule } from '../user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([Contest]), NotificationModule, ProblemModule, SubmissionModule, UserModule],
	controllers: [ContestController],
	providers: [ContestService],
	exports: [ContestService],
})
export class ContestModule {}
