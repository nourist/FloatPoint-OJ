import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Problem } from './problem.entity';
import { Submission } from './submission.entity';
import { Contest } from './contest.entity';
import { ProblemEditorial } from './problem-editorial.entity';

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
}

@Entity('users')
export class User {
	@PrimaryColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	fullname: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	username: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	email: string;

	@Exclude()
	@Column({ type: 'varchar', length: 255, nullable: true })
	password: string | null;

	@Column({ default: false })
	isVerified: boolean;

	@Exclude()
	@Column({ nullable: true, type: 'uuid' })
	verificationToken: string | null;

	@Exclude()
	@Column({ nullable: true, type: 'uuid' })
	resetPasswordToken: string | null;

	@Exclude()
	@Column({ nullable: true, type: 'timestamptz' })
	resetPasswordExpiresAt: Date | null;

	@Column({ type: 'varchar', length: 255, nullable: true })
	avatarUrl: string | null;

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole;

	@Column({ default: 0 })
	rating: number;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;

	@OneToMany(() => Problem, (problem) => problem.creator, { onDelete: 'SET NULL' })
	problems: Problem[];

	@OneToMany(() => Submission, (submission) => submission.author, { onDelete: 'SET NULL' })
	submissions: Submission[];

	@OneToMany(() => Contest, (contest) => contest.creator, { onDelete: 'SET NULL' })
	contests: Contest[];

	@OneToMany(() => ProblemEditorial, (problemEditorial) => problemEditorial.creator, { onDelete: 'SET NULL' })
	editorials: ProblemEditorial[];

	@ManyToMany(() => Contest, (contest) => contest.participants, { onDelete: 'SET NULL' })
	joiningContests: Contest[];
}
