import { Contest, ContestProblem, UserStanding } from '../types/contest.type';
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
	status?: 'PENDING' | 'RUNNING' | 'ENDED';
}

// Response structure from the backend service
export interface PaginatedContests {
	data: Contest[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

// Responses
export interface ContestResponse {
	message: string;
	contest: Contest;
}

export interface ContestsResponse {
	message: string;
	contests: PaginatedContests;
}

export interface StandingsResponse {
	message: string;
	standings: UserStanding[];
	problems: ContestProblem[];
	contestId: string;
	isRated: boolean;
	isRatingUpdated: boolean;
	penalty: number;
}

export interface SimpleMessageResponse {
	message: string;
}

// Functions
export const contestServiceInstance = (http: ApiInstance) => ({
	findAllContests: (params: QueryContestPayload) => {
		return http.get<ContestsResponse>('/contest', { params });
	},

	findOneContest: (slug: string) => {
		return http.get<ContestResponse>(`/contest/${slug}`);
	},

	createContest: (payload: CreateContestPayload) => {
		return http.post<ContestResponse>('/contest', payload);
	},

	updateContest: (id: string, payload: UpdateContestPayload) => {
		return http.patch<ContestResponse>(`/contest/${id}`, payload);
	},

	deleteContest: (id: string) => {
		return http.delete<SimpleMessageResponse>(`/contest/${id}`);
	},

	joinContest: (id: string) => {
		return http.post<SimpleMessageResponse>(`/contest/${id}/join`);
	},

	leaveContest: (id: string) => {
		return http.post<SimpleMessageResponse>(`/contest/${id}/leave`);
	},

	addProblemsToContest: (id: string, payload: AddProblemsPayload) => {
		return http.post<ContestResponse>(`/contest/${id}/problems`, payload);
	},

	removeProblemFromContest: (id: string, problemId: string) => {
		return http.delete<ContestResponse>(`/contest/${id}/problems/${problemId}`);
	},

	getContestStandings: (id: string) => {
		return http.get<StandingsResponse>(`/contest/${id}/standings`);
	},
});

interface AddProblemsPayload {
	problemIds: string[];
}
