import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { Submission } from 'src/entities/submission.entity';
import { SubmissionResult } from 'src/entities/submission-result.entity';

@Module({
	controllers: [SubmissionController],
	providers: [SubmissionService],
	imports: [TypeOrmModule.forFeature([Submission, SubmissionResult])],
})
export class SubmissionModule {}
