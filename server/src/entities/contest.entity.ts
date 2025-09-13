import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Problem } from './problem.entity';
import { Submission } from './submission.entity';
import { User } from './user.entity';

export enum ContestStatus {
	PENDING = 'PENDING',
	RUNNING = 'RUNNING',
	ENDED = 'ENDED',
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

	@Column({ type: 'boolean', default: false })
	isRatingUpdated: boolean;

	@Column({ type: 'boolean', default: false })
	isRated: boolean;

	@Column({ default: 0 })
	penalty: number;

	// Removed status field - status will be derived from startTime and endTime

	@ManyToOne(() => User, (user) => user.contests)
	@JoinColumn()
	creator: User;

	@ManyToMany(() => Problem, (problem) => problem.contests, { onDelete: 'CASCADE' })
	@JoinTable()
	problems: Problem[];

	@OneToMany(() => Submission, (submission) => submission.contest)
	submissions: Submission[];

	@ManyToMany(() => User, (user) => user.joinedContests, { onDelete: 'CASCADE' })
	@JoinTable()
	participants: User[];

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;

	// Helper method to get the current status based on time
	getStatus(): ContestStatus {
		const now = new Date();
		if (now < this.startTime) {
			return ContestStatus.PENDING;
		} else if (now >= this.startTime && now <= this.endTime) {
			return ContestStatus.RUNNING;
		} else {
			return ContestStatus.ENDED;
		}
	}
}
