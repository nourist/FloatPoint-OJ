import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { GetNotificationsQueryDto, MarkAsReadDto } from 'src/modules/notification/notification.dto';
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

	@Post('system')
	@UseGuards(JwtAuthGuard)
	async sendSystemNotification(@Body('content') content: string, @GetUser() user: User) {
		// Check if user is admin
		if (user.role !== 'admin') {
			throw new Error('Only admins can send system notifications');
		}

		await this.notificationService.sendSystemNotification(content, user.id);
		return {
			message: 'System notification sent successfully',
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

	@Patch('batch/read')
	@UseGuards(JwtAuthGuard)
	async markMultipleAsRead(@Body() markAsReadDto: MarkAsReadDto, @GetUser() user: User) {
		await this.notificationService.markMultipleAsRead(user, markAsReadDto.ids);
		return {
			message: 'Notifications marked as read',
		};
	}
}
