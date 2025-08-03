import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { User } from './user.entity';
import { Problem } from './problem.entity';
import { Contest } from './contest.entity';
import { SubmissionResult } from './submission-result.entity';

export enum SubmissionStatus {
	PENDING = 'PENDING',
	JUDGING = 'JUDGING',
	ACCEPTED = 'ACCEPTED',
	WRONG_ANSWER = 'WRONG_ANSWER',
	RUNTIME_ERROR = 'RUNTIME_ERROR',
	OUTPUT_LIMIT_EXCEEDED = 'OUTPUT_LIMIT_EXCEEDED',
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

@Entity('submissions')
export class Submission {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.submissions)
	@JoinColumn()
	author: User;

	@ManyToOne(() => Problem, (problem) => problem.submissions, { onDelete: 'SET NULL', nullable: true })
	@JoinColumn()
	problem: Problem | null;

	@ManyToOne(() => Contest, (contest) => contest.submissions, { nullable: true, onDelete: 'SET NULL' })
	@JoinColumn()
	contest: Contest | null;

	@Column({ type: 'text' })
	sourceCode: string;

	@Column({ type: 'enum', enum: ProgramLanguage })
	language: ProgramLanguage;

	@Column({
		type: 'enum',
		enum: SubmissionStatus,
		default: SubmissionStatus.PENDING,
	})
	status: SubmissionStatus;

	@Column({ default: 0 })
	totalScore: number;

	@CreateDateColumn({ type: 'timestamptz' })
	submittedAt: Date;

	@Column({ type: 'text', default: '' })
	log: string;

	@OneToMany(() => SubmissionResult, (result) => result.submission)
	results: SubmissionResult[];
}
