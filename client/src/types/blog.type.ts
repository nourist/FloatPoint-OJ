import { User } from './user.type';

export interface BlogComment {
	id: string;
	content: string;
	user: User;
	blog: Blog;
	createdAt: Date;
	updatedAt: Date;
}

export interface Blog {
	id: string;
	title: string;
	slug: string;
	content: string;
	thumbnailUrl: string | null;
	author: User;
	comments: BlogComment[];
	createdAt: Date;
	updatedAt: Date;
}
