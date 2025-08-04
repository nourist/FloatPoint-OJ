import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

import { User } from './user.entity';
import { Blog } from './blog.entity';
import { Contest } from './contest.entity';
import { Problem } from './problem.entity';

enum NotificationType {
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

	@Column({ type: 'text' })
	content: string;

	@Column({ type: 'enum', enum: NotificationType })
	type: NotificationType;

	@Column({ type: 'boolean' })
	isRead: boolean;

	@ManyToOne(() => User, (user) => user.notifications)
	user: User;

	@ManyToOne(() => Blog, { onDelete: 'CASCADE' })
	blog: Blog;

	@ManyToOne(() => Problem, { onDelete: 'CASCADE' })
	problem: Problem;

	@ManyToOne(() => Contest, { onDelete: 'CASCADE' })
	contest: Contest;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
