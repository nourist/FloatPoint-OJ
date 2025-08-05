import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Blog } from './blog.entity';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';
import { User } from './user.entity';

export enum NotificationType {
	NEW_BLOG = 'new_blog',
	NEW_PROBLEM = 'new_problem',
	NEW_CONTEST = 'new_contest',
	UPDATE_RATING = 'update_rating',
	SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'text', nullable: true })
	content: string;

	@Column({ type: 'enum', enum: NotificationType })
	type: NotificationType;

	@Column({ type: 'boolean', default: false })
	isRead: boolean;

	@ManyToOne(() => User, (user) => user.notifications)
	user: User;

	@ManyToOne(() => Blog, { onDelete: 'CASCADE', nullable: true })
	blog: Blog;

	@ManyToOne(() => Problem, { onDelete: 'CASCADE', nullable: true })
	problem: Problem;

	@ManyToOne(() => Contest, { onDelete: 'CASCADE', nullable: true })
	contest: Contest;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
