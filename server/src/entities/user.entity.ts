import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { BlogComment } from './blog-comment.entity';
import { Blog } from './blog.entity';
import { Contest } from './contest.entity';
import { Notification } from './notification.entity';
import { ProblemEditorial } from './problem-editorial.entity';
import { Problem } from './problem.entity';
import { Submission } from './submission.entity';

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
}

@Entity('users')
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	fullname: string | null;

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

	@Column({ type: 'text', default: '' })
	bio: string;

	@Column({
		type: 'jsonb',
		default: () =>
			`'${JSON.stringify({
				new_blog: true,
				new_problem: true,
				new_contest: true,
				update_rating: true,
				system: true,
			})}'`,
	})
	notificationSettings: Record<string, boolean>;

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole;

	@Column('int', { array: true, default: () => "'{}'" })
	rating: number[];

	@OneToMany(() => Problem, (problem) => problem.creator)
	problems: Problem[];

	@OneToMany(() => Submission, (submission) => submission.author)
	submissions: Submission[];

	@OneToMany(() => Contest, (contest) => contest.creator)
	contests: Contest[];

	@OneToMany(() => ProblemEditorial, (problemEditorial) => problemEditorial.creator)
	editorials: ProblemEditorial[];

	@ManyToMany(() => Contest, (contest) => contest.participants)
	joinedContests: Contest[];

	@ManyToOne(() => Contest, { onDelete: 'SET NULL' })
	@JoinColumn()
	joiningContest: Contest | null;

	@OneToMany(() => Blog, (blog) => blog.author)
	blogs: Blog[];

	@OneToMany(() => BlogComment, (blogComment) => blogComment.user)
	comments: BlogComment[];

	@OneToMany(() => Notification, (notification) => notification.user)
	notifications: Notification[];

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
