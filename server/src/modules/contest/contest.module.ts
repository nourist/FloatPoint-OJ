import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProblemModule } from '../problem/problem.module';
import { SubmissionModule } from '../submission/submission.module';
import { ContestController } from './contest.controller';
import { ContestService } from './contest.service';
import { Contest } from 'src/entities/contest.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Contest]), ProblemModule, SubmissionModule],
	controllers: [ContestController],
	providers: [ContestService],
})
export class ContestModule {}
