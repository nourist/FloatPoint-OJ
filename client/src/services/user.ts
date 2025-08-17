import http from '../lib/http';
import { NotificationSettings, User } from '../types/user.type';

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

// Functions
export const updateProfile = (payload: UpdateUserPayload) => {
	return http.patch<UserResponse>('/users/me', payload);
};

export const updateAvatar = (avatar: File) => {
	const formData = new FormData();
	formData.append('avatar', avatar);
	return http.patch<UserResponse>('/users/me/avatar', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

export const updateNotificationSettings = (payload: UpdateNotificationSettingsPayload) => {
	return http.patch<UserResponse>('/users/me/notification-settings', payload);
};

export const getUserByUsername = (username: string) => {
	return http.get<UserResponse>(`/users/${username}`);
};

export const getUsers = (params: GetUsersPayload) => {
	return http.get<UsersResponse>('/users', { params });
};
