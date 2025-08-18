import { Notification } from '../types/notification.type';
import { ApiInstance } from '~/types/axios.type';

// Payloads
export enum NotificationStatus {
	READ = 'read',
	UNREAD = 'unread',
	ALL = 'all',
}

export interface GetNotificationsPayload {
	status?: NotificationStatus;
}

// Responses
export interface NotificationsResponse {
	message: string;
	notifications: Notification[];
}

export interface SimpleMessageResponse {
	message: string;
}

// Functions
export const createNotificationService = (http: ApiInstance) => ({
	getNotifications: (params: GetNotificationsPayload) => {
		return http.get<NotificationsResponse>('/notification', { params });
	},

	markAsRead: (id: string) => {
		return http.patch<SimpleMessageResponse>(`/notification/${id}`);
	},
});
