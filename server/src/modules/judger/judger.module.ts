import { Module } from '@nestjs/common';

import { ProblemModule } from '../problem/problem.module';
import { SubmissionModule } from '../submission/submission.module';
import { JudgerController } from './judger.controller';
import { JudgerGateway } from './judger.gateway';
import { JudgerService } from './judger.service';

@Module({
	controllers: [JudgerController],
	providers: [JudgerService, JudgerGateway],
	imports: [SubmissionModule, ProblemModule],
})
export class JudgerModule {}
