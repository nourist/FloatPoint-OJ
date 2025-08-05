import { IsEnum, IsUUID } from 'class-validator';

import { Default } from 'src/decorators/default.decorator';

export enum NotificationStatus {
	READ = 'read',
	UNREAD = 'unread',
	ALL = 'all',
}

export class GetNotificationsQueryDto {
	@IsEnum(NotificationStatus)
	@Default(NotificationStatus.ALL)
	status: NotificationStatus;
}

export class MarkAsReadDto {
	@IsUUID('all', { each: true })
	ids: string[];
}
