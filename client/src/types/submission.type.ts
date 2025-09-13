import { Contest } from './contest.type';
import { Problem } from './problem.type';
import { SubmissionResult } from './submission-result.type';
import { User } from './user.type';

export enum SubmissionStatus {
	PENDING = 'PENDING',
	JUDGING = 'JUDGING',
	ACCEPTED = 'ACCEPTED',
	WRONG_ANSWER = 'WRONG_ANSWER',
	RUNTIME_ERROR = 'RUNTIME_ERROR',
	TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
	MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
	COMPILATION_ERROR = 'COMPILATION_ERROR',
	INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export enum ProgramLanguage {
	C99 = 'C99',
	C11 = 'C11',
	C17 = 'C17',
	C23 = 'C23',

	CPP03 = 'CPP03',
	CPP11 = 'CPP11',
	CPP14 = 'CPP14',
	CPP17 = 'CPP17',
	CPP20 = 'CPP20',
	CPP23 = 'CPP23',

	JAVA_8 = 'JAVA_8',
	JAVA_11 = 'JAVA_11',
	JAVA_17 = 'JAVA_17',

	PYTHON2 = 'PYTHON2',
	PYTHON3 = 'PYTHON3',
}

export interface Submission {
	id: string;
	author: User;
	problem: Problem;
	contest: Contest | null;
	sourceCode: string;
	language: ProgramLanguage;
	status: SubmissionStatus;
	totalScore: number;
	submittedAt: Date;
	log: string;
	results: SubmissionResult[];
	canView?: boolean;
	time?: number;
	memory?: number;
	acceptedTestCases?: number;
	totalTestCases?: number;
}
