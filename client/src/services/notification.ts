import http from '../lib/http';
import { Notification } from '../types/notification.type';

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
export const getNotifications = (params: GetNotificationsPayload) => {
	return http.get<NotificationsResponse>('/notification', { params });
};

export const markAsRead = (id: string) => {
	return http.patch<SimpleMessageResponse>(`/notification/${id}`);
};
