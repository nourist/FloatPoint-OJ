import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

import { Default } from 'src/decorators/default.decorator';
import { Trim } from 'src/decorators/trim.decorator';
import { UndefinedToNull } from 'src/decorators/undefine-to-null.decorator';
import { Difficulty, IOMode, ProblemScoringMethod } from 'src/entities/problem.entity';

export class CreateProblemDto {
	@Trim()
	@IsNotEmpty()
	@IsString()
	title: string;

	@Trim()
	@IsString()
	statement: string;

	@IsNotEmpty()
	@IsInt()
	timeLimit: number;

	@IsNotEmpty()
	@IsInt()
	memoryLimit: number;

	@IsNotEmpty()
	@IsInt()
	point: number;

	@IsNotEmpty()
	@IsEnum(IOMode)
	ioMode: IOMode;

	@UndefinedToNull()
	@ValidateIf((obj: CreateProblemDto) => obj.ioMode === IOMode.FILE)
	@IsNotEmpty()
	@IsString()
	inputFile: string | null;

	@UndefinedToNull()
	@ValidateIf((obj: CreateProblemDto) => obj.ioMode === IOMode.FILE)
	@IsNotEmpty()
	@IsString()
	outputFile: string | null;

	@IsNotEmpty()
	@IsEnum(ProblemScoringMethod)
	scoringMethod: ProblemScoringMethod;

	@IsNotEmpty()
	@IsEnum(Difficulty)
	difficulty: Difficulty;

	@Default([])
	@IsArray()
	@IsString({ each: true })
	tags: string[];
}

export class UpdateProblemDto {
	@IsOptional()
	@Trim()
	@IsString()
	title?: string;

	@IsOptional()
	@Trim()
	@IsString()
	statement?: string;

	@IsOptional()
	@IsInt()
	timeLimit?: number;

	@IsOptional()
	@IsInt()
	memoryLimit?: number;

	@IsOptional()
	@IsInt()
	point?: number;

	@IsOptional()
	@IsEnum(IOMode)
	ioMode?: IOMode;

	@IsOptional()
	@UndefinedToNull()
	@ValidateIf((obj: UpdateProblemDto) => obj.ioMode === IOMode.FILE)
	@IsString()
	inputFile?: string;

	@IsOptional()
	@UndefinedToNull()
	@ValidateIf((obj: UpdateProblemDto) => obj.ioMode === IOMode.FILE)
	@IsString()
	outputFile?: string;

	@IsOptional()
	@IsEnum(ProblemScoringMethod)
	scoringMethod?: ProblemScoringMethod;

	@IsOptional()
	@IsEnum(Difficulty)
	difficulty?: Difficulty;

	@IsOptional()
	@Default([])
	@IsArray()
	@IsString({ each: true })
	tags?: string[];
}

export class GetAllProblemsDto {
	@IsOptional()
	@IsInt()
	minPoint?: number;

	@IsOptional()
	@IsInt()
	maxPoint?: number;

	@IsOptional()
	@IsEnum(Difficulty)
	difficulty?: Difficulty;

	@IsOptional()
	@Default([])
	@IsArray()
	@IsString({ each: true })
	tags?: string[];

	@IsOptional()
	@IsString()
	q?: string;

	@IsOptional()
	@IsInt()
	@Default(1)
	page: number;

	@IsOptional()
	@IsInt()
	@Default(20)
	limit: number;

	@IsOptional()
	@IsString()
	sortBy?: 'title' | 'point' | 'difficulty' | 'acCount' | 'acRate';

	@IsOptional()
	@IsString()
	order?: 'ASC' | 'DESC';

	@IsOptional()
	@IsBoolean()
	hasEditorial?: boolean;
}

export class CreateProblemEditorialDto {
	@Trim()
	@IsNotEmpty()
	@IsString()
	content: string;
}

export class UpdateProblemEditorialDto {
	@IsOptional()
	@Trim()
	@IsString()
	content?: string;
}

export class CreateSubtaskDto {
	@Trim()
	@IsNotEmpty()
	@IsString()
	name: string;
}

export class UpdateSubtaskDto {
	@IsOptional()
	@Trim()
	@IsString()
	name?: string;
}

export class CreateTestCaseDto {
	@Trim()
	@IsNotEmpty()
	@IsString()
	name: string;

	@Default('')
	@IsString()
	input: string;

	@Default('')
	@IsString()
	output: string;
}

export class UpdateTestCaseDto {
	@IsOptional()
	@Trim()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	input?: string;

	@IsOptional()
	@IsString()
	output?: string;
}
