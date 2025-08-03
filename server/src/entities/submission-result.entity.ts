import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Submission } from './submission.entity';

export enum SubmissionResultStatus {
	ACCEPTED = 'ACCEPTED',
	WRONG_ANSWER = 'WRONG_ANSWER',
	RUNTIME_ERROR = 'RUNTIME_ERROR',
	OUTPUT_LIMIT_EXCEEDED = 'OUTPUT_LIMIT_EXCEEDED',
	TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
	MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
}

@Entity('submission_results')
export class SubmissionResult {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Submission, (submission) => submission.results)
	@JoinColumn()
	submission: Submission;

	@Column({
		type: 'enum',
		enum: SubmissionResultStatus,
	})
	status: SubmissionResultStatus;

	@Column()
	executionTime: number; // in milliseconds

	@Column()
	memoryUsed: number; // in kilobytes
}
