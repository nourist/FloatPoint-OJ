import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

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
	@Trim()
	@IsString()
	title?: string;

	@Trim()
	@IsString()
	statement?: string;

	@IsInt()
	timeLimit?: number;

	@IsInt()
	memoryLimit?: number;

	@IsInt()
	point?: number;

	@IsEnum(IOMode)
	ioMode?: IOMode;

	@IsString()
	inputFile?: string;

	@IsString()
	outputFile?: string;

	@IsEnum(ProblemScoringMethod)
	scoringMethod?: ProblemScoringMethod;

	@IsEnum(Difficulty)
	difficulty?: Difficulty;

	@Default([])
	@IsArray()
	@IsString({ each: true })
	tags?: string[];
}

export class GetAllProblemsDto {
	@IsInt()
	minPoint?: number;

	@IsInt()
	maxPoint?: number;

	@IsEnum(Difficulty)
	difficulty?: Difficulty;

	@Default([])
	@IsArray()
	@IsString({ each: true })
	tags?: string[];

	@IsString()
	q?: string;

	@IsInt()
	@Default(1)
	page: number;

	@IsInt()
	@Default(20)
	limit: number;

	@IsString()
	sortBy?: 'title' | 'point' | 'difficulty' | 'acCount' | 'acRate';

	@IsString()
	order?: 'ASC' | 'DESC';

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
	@Trim()
	@IsString()
	name?: string;

	@IsString()
	input?: string;

	@IsString()
	output?: string;
}
