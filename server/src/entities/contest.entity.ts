import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';

import { User } from './user.entity';
import { Problem } from './problem.entity';
import { Submission } from './submission.entity';

export enum ContestType {
	IOI = 'ioi',
	ICPC = 'icpc',
}

@Entity('contests')
export class Contest {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	title: string;

	@Column({ type: 'text', default: '' })
	description: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	slug: string;

	@Column({ type: 'timestamptz' })
	startTime: Date;

	@Column({ type: 'timestamptz' })
	endTime: Date;

	@Column({
		type: 'enum',
		enum: ContestType,
	})
	type: ContestType;

	@Column({ type: 'boolean', default: false })
	rated: boolean;

	@ManyToOne(() => User, (user) => user.contests)
	@JoinColumn()
	creator: User;

	@ManyToMany(() => Problem, (problem) => problem.contests, { onDelete: 'SET NULL' })
	@JoinTable()
	problems: Problem[];

	@OneToMany(() => Submission, (submission) => submission.contest)
	submissions: Submission[];

	@ManyToMany(() => User, (user) => user.joiningContests)
	@JoinTable()
	participants: User[];

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
