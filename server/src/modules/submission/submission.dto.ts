import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

import { SubmissionStatus } from 'src/entities/submission.entity';
import { ProgramLanguage } from 'src/entities/submission.entity';

export class GetAllSubmissionsDto {
	@IsOptional()
	@IsString()
	authorId?: string;

	@IsOptional()
	@IsString()
	problemId?: string;

	@IsOptional()
	@IsEnum(ProgramLanguage)
	language?: ProgramLanguage;

	@IsOptional()
	@IsEnum(SubmissionStatus)
	status?: SubmissionStatus;

	@IsOptional()
	@IsString()
	contestId?: string;

	@IsInt()
	page: number = 1;

	@IsInt()
	limit: number = 20;
}

export class SubmitCodeDto {
	@IsString()
	code: string;

	@IsEnum(ProgramLanguage)
	language: ProgramLanguage;

	@IsString()
	problemId: string;
}

export interface StatusStatistic {
	status: SubmissionStatus;
	count: number;
}

export interface LanguageStatistic {
	language: ProgramLanguage;
	count: number;
}

export interface SubmissionStatisticsDto {
	statusStatistics: StatusStatistic[];
	languageStatistics: LanguageStatistic[];
}
