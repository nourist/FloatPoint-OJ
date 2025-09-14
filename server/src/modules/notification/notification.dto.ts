import { IsEnum, IsUUID } from 'class-validator';

export enum NotificationStatus {
	READ = 'read',
	UNREAD = 'unread',
	ALL = 'all',
}

export class GetNotificationsQueryDto {
	@IsEnum(NotificationStatus)
	status: NotificationStatus = NotificationStatus.ALL;
}

export class MarkAsReadDto {
	@IsUUID('all', { each: true })
	ids: string[];
}
