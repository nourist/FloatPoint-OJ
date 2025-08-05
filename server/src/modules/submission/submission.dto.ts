import { IsEnum, IsInt, IsString } from 'class-validator';

import { Default } from 'src/decorators/default.decorator';
import { SubmissionStatus } from 'src/entities/submission.entity';

export class GetAllSubmissionsDto {
	@IsString()
	authorId?: string;

	@IsString()
	problemId?: string;

	@IsString()
	language?: string;

	@IsEnum(SubmissionStatus)
	status?: SubmissionStatus;

	@IsInt()
	@Default(1)
	page: number;

	@IsInt()
	@Default(20)
	limit: number;

	@IsString()
	sortBy?: 'submittedAt';

	@IsString()
	order?: 'ASC' | 'DESC';
}
