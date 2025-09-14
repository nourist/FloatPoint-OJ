import { Blog } from './blog.type';
import { Contest } from './contest.type';
import { Problem } from './problem.type';
import { User } from './user.type';

export enum NotificationType {
	NEW_BLOG = 'new_blog',
	NEW_PROBLEM = 'new_problem',
	NEW_CONTEST = 'new_contest',
	UPDATE_RATING = 'update_rating',
	SYSTEM = 'system',
}

export interface Notification {
	id: string;
	content: string | null;
	type: NotificationType;
	isRead: boolean;
	user: User;
	blog: Blog | null;
	problem: Problem | null;
	contest: Contest | null;
	createdAt: Date;
	updatedAt: Date;
}
