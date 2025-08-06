import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';

import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { GetNotificationsQueryDto } from 'src/modules/notification/notification.dto';
import { NotificationService } from 'src/modules/notification/notification.service';

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getNotifications(@GetUser() user: User, @Query() query: GetNotificationsQueryDto) {
		return {
			message: 'success',
			notifications: await this.notificationService.getNotifications(user, query.status),
		};
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	async markAsRead(@Param('id') id: string, @GetUser() user: User) {
		await this.notificationService.markAsRead(user, id);
		return {
			message: 'Notification marked as read',
		};
	}
}
