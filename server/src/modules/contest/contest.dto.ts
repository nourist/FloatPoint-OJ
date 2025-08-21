import { PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

import { ToBoolean } from 'src/decorators/to-boolean.decorator';

export class CreateContestDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsDateString()
	startTime: string;

	@IsDateString()
	endTime: string;

	@IsBoolean()
	@IsOptional()
	isRated?: boolean;
}

export class UpdateContestDto extends PartialType(CreateContestDto) {}

export class QueryContestDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number = 1;

	@IsOptional()
	@IsInt()
	@Min(1)
	limit?: number = 10;

	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsDateString()
	startTime?: string;

	@IsOptional()
	@IsDateString()
	endTime?: string;

	@IsOptional()
	@ToBoolean()
	isRated?: boolean;

	@IsOptional()
	@IsEnum(['startTime', 'endTime', 'title'])
	sortBy?: string;

	@IsOptional()
	@IsEnum(['ASC', 'DESC'])
	sortOrder?: 'ASC' | 'DESC';
}

export class AddProblemsDto {
	@IsArray()
	@IsUUID('4', { each: true })
	problemIds: string[];
}

// --- Standings DTOs ---

export class ProblemStandingDto {
	problemId: string;
	score: number;
	time: number; // Time in seconds from contest start to solve
	wrongSubmissionsCount: number;
}

export class UserStandingDto {
	userId: string;
	username: string;
	fullname: string | null;
	rank: number;
	totalScore: number;
	totalTime: number; // Total time in seconds, including penalties
	problems: Record<string, ProblemStandingDto>;
}
