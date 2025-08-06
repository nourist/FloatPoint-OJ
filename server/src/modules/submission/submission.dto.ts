import { IsEnum, IsInt, IsString } from 'class-validator';

import { Default } from 'src/decorators/default.decorator';
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
	@Default(1)
	page: number;

	@IsInt()
	@Default(20)
	limit: number;
}

export class SubmitCodeDto {
	@IsString()
	code: string;

	@IsEnum(ProgramLanguage)
	language: ProgramLanguage;

	@IsString()
	problemId: string;
}
