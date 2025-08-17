import http from '../lib/http';
import { Contest, UserStanding } from '../types/contest.type';

// Payloads
export interface CreateContestPayload {
	title: string;
	description?: string;
	startTime: string; // ISO Date string
	endTime: string; // ISO Date string
	isRated?: boolean;
}

export type UpdateContestPayload = Partial<CreateContestPayload>;

export interface QueryContestPayload {
	page?: number;
	limit?: number;
	search?: string;
	startTime?: string; // ISO Date string
	endTime?: string; // ISO Date string
	isRated?: boolean;
	sortBy?: 'startTime' | 'endTime' | 'title';
	sortOrder?: 'ASC' | 'DESC';
}

export interface AddProblemsPayload {
	problemIds: string[];
}

// Responses
export interface ContestResponse {
	message: string;
	contest: Contest;
}

export interface ContestsResponse {
	message: string;
	contests: Contest[];
}

export interface StandingsResponse {
	message: string;
	standings: UserStanding[];
}

export interface SimpleMessageResponse {
	message: string;
}

// Functions
export const findAllContests = (params: QueryContestPayload) => {
	return http.get<ContestsResponse>('/contests', { params });
};

export const findOneContest = (slug: string) => {
	return http.get<ContestResponse>(`/contests/${slug}`);
};

export const joinContest = (id: string) => {
	return http.post<SimpleMessageResponse>(`/contests/${id}/join`);
};

export const leaveContest = (id: string) => {
	return http.post<SimpleMessageResponse>(`/contests/${id}/leave`);
};

export const getContestStandings = (id: string) => {
	return http.get<StandingsResponse>(`/contests/${id}/standings`);
};
