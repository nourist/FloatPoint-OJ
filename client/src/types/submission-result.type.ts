import { Submission } from './submission.type';

export enum SubmissionResultStatus {
	ACCEPTED = 'ACCEPTED',
	WRONG_ANSWER = 'WRONG_ANSWER',
	RUNTIME_ERROR = 'RUNTIME_ERROR',
	TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
	MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
}

export interface SubmissionResult {
	id: string;
	submission: Submission;
	slug: string;
	status: SubmissionResultStatus;
	executionTime: number;
	memoryUsed: number;
}
