import { Contest, UserStanding } from '../types/contest.type';
import { ApiInstance } from '~/types/axios.type';

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
export const createContestService = (http: ApiInstance) => ({
	findAllContests: (params: QueryContestPayload) => {
		return http.get<ContestsResponse>('/contests', { params });
	},

	findOneContest: (slug: string) => {
		return http.get<ContestResponse>(`/contests/${slug}`);
	},

	joinContest: (id: string) => {
		return http.post<SimpleMessageResponse>(`/contests/${id}/join`);
	},

	leaveContest: (id: string) => {
		return http.post<SimpleMessageResponse>(`/contests/${id}/leave`);
	},

	getContestStandings: (id: string) => {
		return http.get<StandingsResponse>(`/contests/${id}/standings`);
	},
});
