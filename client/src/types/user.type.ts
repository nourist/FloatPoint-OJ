import { Contest } from './contest.type';

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
}

export type NotificationSettings = {
	new_blog: boolean;
	new_problem: boolean;
	new_contest: boolean;
	update_rating: boolean;
	system: boolean;
};

export type User = {
	id: string;
	email: string;
	username: string;
	fullname: string | null;
	avatarUrl: string | null;
	bio: string;
	notificationSettings: NotificationSettings;
	role: UserRole;
	rating: number[];
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	joiningContest: Contest | null;
};
