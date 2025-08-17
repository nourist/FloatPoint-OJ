import { Contest } from './contest.type';
import { ProblemEditorial } from './problem-editorial.type';
import { ProblemTag } from './problem-tag.type';
import { Submission } from './submission.type';
import { Subtask } from './subtask.type';
import { User } from './user.type';

export enum ProblemScoringMethod {
	STANDARD = 'standard',
	SUBTASK = 'subtask',
	ICPC = 'icpc',
}

export enum IOMode {
	STANDARD = 'standard',
	FILE = 'file',
}

export enum Difficulty {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard',
}

export interface Problem {
	id: string;
	title: string;
	slug: string;
	statement: string;
	timeLimit: number;
	memoryLimit: number;
	point: number;
	ioMode: IOMode;
	inputFile: string | null;
	outputFile: string | null;
	scoringMethod: ProblemScoringMethod;
	difficulty: Difficulty;
	creator: User;
	subtasks: Subtask[];
	submissions: Submission[];
	contests: Contest[];
	tags: ProblemTag[];
	editorial: ProblemEditorial;
	createdAt: Date;
	updatedAt: Date;
}
