import { IsEnum, IsInt, IsString } from 'class-validator';

import { SubmissionStatus } from 'src/entities/submission.entity';
import { ProgramLanguage } from 'src/entities/submission.entity';

export class GetAllSubmissionsDto {
	@IsString()
	authorId?: string;

	@IsString()
	problemId?: string;

	@IsEnum(ProgramLanguage)
	language?: ProgramLanguage;

	@IsEnum(SubmissionStatus)
	status?: SubmissionStatus;

	@IsInt()
	page = 1;

	@IsInt()
	limit = 20;
}

export class SubmitCodeDto {
	@IsString()
	code: string;

	@IsEnum(ProgramLanguage)
	language: ProgramLanguage;

	@IsString()
	problemId: string;
}
