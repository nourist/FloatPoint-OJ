import { Problem } from './problem.type';
import { Submission } from './submission.type';
import { User } from './user.type';

export enum ContestStatus {
	PENDING = 'PENDING',
	RUNNING = 'RUNNING',
	ENDED = 'ENDED',
}

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
	time: number; // Time in seconds from contest start to solve
	wrongSubmissionsCount: number;
	isAc: boolean;
}

export interface UserStanding {
	userId: string;
	username: string;
	fullname: string | null;
	rank: number;
	totalScore: number;
	totalTime: number; // Total time in seconds, including penalties
	problems: Record<string, ProblemStanding>;
	oldRating?: number;
	newRating?: number;
}

export interface ContestProblem {
	id: string;
	title: string;
	maxScore: number;
}

export interface ContestStandingsResponse {
	contestId: string;
	isRated: boolean;
	isRatingUpdated: boolean;
	penalty: number;
	problems: ContestProblem[];
	standings: UserStanding[];
}

// Add helper method to get the current status based on time (client-side)
export const getContestStatus = (contest: Contest): ContestStatus => {
	const now = new Date();
	if (now < new Date(contest.startTime)) {
		return ContestStatus.PENDING;
	} else if (now >= new Date(contest.startTime) && now <= new Date(contest.endTime)) {
		return ContestStatus.RUNNING;
	} else {
		return ContestStatus.ENDED;
	}
};
