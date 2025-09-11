import { PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

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

	@IsNumber()
	@IsOptional()
	@Min(0)
	penalty?: number;
}

// Removed status field from UpdateContestDto since status is now derived from startTime and endTime
export class UpdateContestDto extends PartialType(CreateContestDto) {
	// Status field removed as it's now derived from time fields
}

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

	@IsOptional()
	@IsEnum(['PENDING', 'RUNNING', 'ENDED'])
	status?: 'PENDING' | 'RUNNING' | 'ENDED';
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
	isAc: boolean;
}

export class ContestProblemDto {
	id: string;
	title: string;
	maxScore: number; // Maximum possible score for this problem
}

export class UserStandingDto {
	userId: string;
	username: string;
	fullname: string | null;
	rank: number;
	totalScore: number;
	totalTime: number; // Total time in seconds, including penalties
	problems: Record<string, ProblemStandingDto>;
	oldRating?: number;
	newRating?: number;
}

export class ContestStandingsDto {
	contestId: string;
	isRated: boolean;
	isRatingUpdated: boolean;
	penalty: number;
	problems: ContestProblemDto[];
	standings: UserStandingDto[];
}
