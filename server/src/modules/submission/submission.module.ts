import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { SubmissionResult } from 'src/entities/submission-result.entity';
import { Submission } from 'src/entities/submission.entity';

@Module({
	controllers: [SubmissionController],
	providers: [SubmissionService],
	imports: [TypeOrmModule.forFeature([Submission, SubmissionResult])],
})
export class SubmissionModule {}
