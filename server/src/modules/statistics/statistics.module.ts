import { Module } from '@nestjs/common';

import { ContestModule } from '../contest/contest.module';
import { ProblemModule } from '../problem/problem.module';
import { SubmissionModule } from '../submission/submission.module';
import { UserModule } from '../user/user.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
	imports: [SubmissionModule, UserModule, ContestModule, ProblemModule],
	controllers: [StatisticsController],
	providers: [StatisticsService],
})
export class StatisticsModule {}
