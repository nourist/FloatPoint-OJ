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

export interface SendSystemNotificationPayload {
	content: string;
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
export const notificationServiceInstance = (http: ApiInstance) => ({
	getNotifications: (params: GetNotificationsPayload) => {
		return http.get<NotificationsResponse>('/notification', { params });
	},

	markAsRead: (id: string) => {
		return http.patch<SimpleMessageResponse>(`/notification/${id}`);
	},

	markMultipleAsRead: (ids: string[]) => {
		return http.patch<SimpleMessageResponse>('/notification/batch/read', { ids });
	},

	sendSystemNotification: (payload: SendSystemNotificationPayload) => {
		return http.post<SimpleMessageResponse>('/notification/system', payload);
	},
});
