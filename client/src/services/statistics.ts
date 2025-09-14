import { ApiInstance } from '~/types/axios.type';

// Data Interfaces
export interface OverviewData {
	total_users: number;
	active_users_today: number;
	total_submissions: number;
	success_rate: number;
	active_problems: number;
	system_status: 'online' | 'offline' | 'warning';
}

export interface UserActivityData {
	date: string;
	total_users: number;
	active_users: number;
	new_registrations: number;
}

export interface SubmissionVolumeData {
	date: string;
	submissions: number;
	accepted: number;
}

export interface LanguageData {
	language: string;
	count: number;
	percentage: number;
}

export interface SubmissionResultData {
	status: string;
	count: number;
	color: string;
}

export interface ProblemDifficultyData {
	difficulty: string;
	count: number;
	solved_users: number;
}

export interface ContestParticipationData {
	month: string;
	contests: number;
	participants: number;
}

export interface JudgerQueueData {
	time: string;
	queue_size: number;
	processing_time: number;
}

export interface SystemResourceData {
	time: string;
	cpu: number;
	memory: number;
	disk: number;
}

export interface TopUserData {
	rank: number;
	username: string;
	fullname: string;
	solved: number;
	submissions: number;
	success_rate: string;
}

export interface PopularProblemData {
	rank: number;
	slug: string;
	title: string;
	difficulty: string;
	attempts: number;
	solved: number;
	success_rate: string;
}

// Response Interfaces
export interface OverviewResponse {
	message?: string;
	total_users: number;
	active_users_today: number;
	total_submissions: number;
	success_rate: number;
	active_problems: number;
	system_status: 'online' | 'offline' | 'warning';
}

export interface UserActivityResponse {
	message?: string;
	period: string;
	data: UserActivityData[];
}

export interface SubmissionVolumeResponse {
	message?: string;
	period: string;
	data: SubmissionVolumeData[];
}

export interface LanguageDistributionResponse {
	message?: string;
	period: string;
	data: LanguageData[];
}

export interface SubmissionResultsResponse {
	message?: string;
	period: string;
	data: SubmissionResultData[];
}

export interface ProblemDifficultyResponse {
	message?: string;
	data: ProblemDifficultyData[];
}

export interface ContestParticipationResponse {
	message?: string;
	period: string;
	data: ContestParticipationData[];
}

export interface JudgerQueueResponse {
	message?: string;
	data: JudgerQueueData[];
}

export interface SystemResourceResponse {
	message?: string;
	period: string;
	data: SystemResourceData[];
}

export interface TopUsersResponse {
	message?: string;
	limit: number;
	period: string;
	data: TopUserData[];
}

export interface PopularProblemsResponse {
	message?: string;
	limit: number;
	period: string;
	data: PopularProblemData[];
}

// Service Functions
export const statisticsServiceInstance = (http: ApiInstance) => ({
	getOverview: () => {
		return http.get<OverviewResponse>('/statistics/overview');
	},

	getUserActivity: (period: '7d' | '30d' | '90d' = '30d') => {
		return http.get<UserActivityResponse>(`/statistics/user-activity?period=${period}`);
	},

	getSubmissionVolume: (period: '7d' | '30d' | '90d' = '7d') => {
		return http.get<SubmissionVolumeResponse>(`/statistics/submission-volume?period=${period}`);
	},

	getLanguageDistribution: (period: '7d' | '30d' | 'all' = '30d') => {
		return http.get<LanguageDistributionResponse>(`/statistics/language-distribution?period=${period}`);
	},

	getSubmissionResults: (period: '7d' | '30d' | 'all' = '30d') => {
		return http.get<SubmissionResultsResponse>(`/statistics/submission-results?period=${period}`);
	},

	getProblemDifficulty: () => {
		return http.get<ProblemDifficultyResponse>('/statistics/problem-difficulty');
	},

	getContestParticipation: (period: '3m' | '6m' | '1y' = '6m') => {
		return http.get<ContestParticipationResponse>(`/statistics/contest-participation?period=${period}`);
	},

	getJudgerQueue: () => {
		return http.get<JudgerQueueResponse>('/statistics/judger-queue');
	},

	getSystemResources: (period: '1h' | '24h' = '1h') => {
		return http.get<SystemResourceResponse>(`/statistics/system-resources?period=${period}`);
	},

	getTopUsers: (limit: number = 10, period: '7d' | '30d' = '7d') => {
		return http.get<TopUsersResponse>(`/statistics/top-users?limit=${limit}&period=${period}`);
	},

	getPopularProblems: (limit: number = 10, period: '30d' = '30d') => {
		return http.get<PopularProblemsResponse>(`/statistics/popular-problems?limit=${limit}&period=${period}`);
	},
});
