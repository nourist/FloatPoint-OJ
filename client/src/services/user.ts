import { NotificationSettings, User } from '../types/user.type';
import { ApiInstance } from '~/types/axios.type';

// Payloads
export interface GetUsersPayload {
	q?: string;
	sortBy?: 'username' | 'fullName' | 'rating' | 'score';
	sortOrder?: 'ASC' | 'DESC';
	page?: number;
	limit?: number;
}

export interface UpdateUserPayload {
	username?: string;
	fullname?: string;
	bio?: string;
}

export type UpdateNotificationSettingsPayload = NotificationSettings;

// Responses
export interface UserResponse {
	message: string;
	user: User;
}

export interface UsersResponse {
	message: string;
	users: User[];
	total: number;
}

export interface UserScoreResponse {
	message: string;
	score: number;
}

export interface UserStatistics {
	submissionCount: number;
	acSubmissionCount: number;
	problemCount: number;
	acProblemCount: number;
	joinedContestCount: number;
	blogCount: number;
	commentCount: number;
	languageStats: { language: string; count: number }[];
	score: number;
	rating: number;
}

export interface UserStatisticsResponse {
	message: string;
	statistics: UserStatistics;
}

// Functions
export const userServiceInstance = (http: ApiInstance) => ({
	updateProfile: (payload: UpdateUserPayload) => {
		return http.patch<UserResponse>('/users/me', payload);
	},

	updateAvatar: (avatar: File) => {
		const formData = new FormData();
		formData.append('avatar', avatar);
		return http.patch<UserResponse>('/users/me/avatar', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},

	updateNotificationSettings: (payload: UpdateNotificationSettingsPayload) => {
		return http.patch<UserResponse>('/users/me/notification-settings', payload);
	},

	getUserByUsername: (username: string) => {
		return http.get<UserResponse>(`/users/${username}`);
	},

	getUsers: (params: GetUsersPayload) => {
		return http.get<UsersResponse>('/users', { params });
	},

	getUserScore: (username: string) => {
		return http.get<UserScoreResponse>(`/users/${username}/score`);
	},

	getUserStatistics: (username: string) => {
		return http.get<UserStatisticsResponse>(`/users/${username}/statistics`);
	},

	getUserAcProblemsByDifficulty: (username: string) => {
		return http.get<{ message: string; data: { difficulty: string; count: number }[] }>(`/users/${username}/ac-problems-by-difficulty`);
	},

	getUserRanking: (username: string) => {
		return http.get<{ message: string; ranking: number }>(`/users/${username}/ranking`);
	},

	getUserRatingHistory: (username: string) => {
		return http.get<{ message: string; data: { date: string; rating: number }[] }>(`/users/${username}/rating-history`);
	},

	getUserSubmissionTrends: (username: string) => {
		return http.get<{ message: string; data: { date: string; submissions: number; accepted: number; successRate: number }[] }>(`/users/${username}/submission-trends`);
	},

	getUserAcSubmissionsByLanguage: (username: string) => {
		return http.get<{ message: string; data: { language: string; count: number }[] }>(`/users/${username}/ac-submissions-by-language`);
	},
});
