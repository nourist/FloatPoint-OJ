import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Contest } from './contest.entity';
import { ProblemEditorial } from './problem-editorial.entity';
import { ProblemTag } from './problem-tag.entity';
import { Submission } from './submission.entity';
import { Subtask } from './subtask.entity';
import { User } from './user.entity';

export enum ProblemScoringMethod {
	STANDARD = 'standard', // Standard scoring per test case
	SUBTASK = 'subtask', // Points per subtask
	ICPC = 'icpc', // Pass/Fail (1/0)
}

export enum IOMode {
	STANDARD = 'standard', // stdin/stdout
	FILE = 'file', // input.txt / output.txt
}

export enum Difficulty {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard',
}

@Entity('problems')
export class Problem {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	title: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	slug: string;

	@Column({ type: 'text', default: '' })
	statement: string;

	@Column({ default: 1000 })
	timeLimit: number; // in milliseconds

	@Column({ default: 128 })
	memoryLimit: number; // in kilobytes

	@Column({ default: 100 })
	point: number;

	@Column({ type: 'enum', enum: IOMode, default: IOMode.STANDARD })
	ioMode: IOMode;

	@Column({ nullable: true, type: 'varchar', length: 255 })
	inputFile: string | null;

	@Column({ nullable: true, type: 'varchar', length: 255 })
	outputFile: string | null;

	@Column({
		type: 'enum',
		enum: ProblemScoringMethod,
		default: ProblemScoringMethod.STANDARD,
	})
	scoringMethod: ProblemScoringMethod;

	@Column({ type: 'enum', enum: Difficulty, default: Difficulty.MEDIUM })
	difficulty: Difficulty;

	@ManyToOne(() => User, (user) => user.problems)
	@JoinColumn()
	creator: User;

	@OneToMany(() => Subtask, (subtask) => subtask.problem)
	subtasks: Subtask[];

	@OneToMany(() => Submission, (submission) => submission.problem)
	submissions: Submission[];

	@ManyToMany(() => Contest, (contest) => contest.problems)
	contests: Contest[];

	@ManyToMany(() => ProblemTag, (problemTag) => problemTag.problems)
	tags: ProblemTag[];

	@OneToOne(() => ProblemEditorial, (problemEditorial) => problemEditorial.problem, { onDelete: 'SET NULL', nullable: true })
	editorial: ProblemEditorial;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
