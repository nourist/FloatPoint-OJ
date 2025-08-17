import { Problem } from './problem.type';
import { Submission } from './submission.type';
import { User } from './user.type';

export interface Contest {
	id: string;
	title: string;
	description: string;
	slug: string;
	startTime: Date;
	endTime: Date;
	isRatingUpdated: boolean;
	isRated: boolean;
	penalty: number;
	creator: User;
	problems: Problem[];
	submissions: Submission[];
	participants: User[];
	createdAt: Date;
	updatedAt: Date;
}

export interface ProblemStanding {
	problemId: string;
	score: number;
	time: number;
	wrongSubmissionsCount: number;
}

export interface UserStanding {
	userId: string;
	username: string;
	fullname: string | null;
	rank: number;
	totalScore: number;
	totalTime: number;
	problems: Record<string, ProblemStanding>;
}
