import { IsNotEmpty, IsString, IsInt, IsArray, IsEnum, ValidateIf } from 'class-validator';

import { DefaultEmptyArray } from 'src/decorators/default-empty-array.decorator';
import { UndefinedToNull } from 'src/decorators/undefine-to-null.decorator';
import { ProblemScoringMethod, IOMode, Difficulty } from 'src/entities/problem.entity';
import { Trim } from 'src/decorators/trim.decorator';

export class CreateProblemDto {
	@Trim()
	@IsNotEmpty()
	@IsString()
	title: string;

	@Trim()
	@IsNotEmpty()
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

	@IsNotEmpty()
	@IsArray()
	@IsString({ each: true })
	@DefaultEmptyArray()
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

	@IsArray()
	@IsString({ each: true })
	@DefaultEmptyArray()
	tags?: string[];
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

	@IsNotEmpty()
	@IsString()
	input: string;

	@IsNotEmpty()
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
