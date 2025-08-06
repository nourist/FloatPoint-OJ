import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { Notification, NotificationType } from 'src/entities/notification.entity';
import { Problem } from 'src/entities/problem.entity';
import { User } from 'src/entities/user.entity';
import { NotificationStatus } from 'src/modules/notification/notification.dto';

@Injectable()
export class NotificationService {
	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepository: Repository<Notification>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async sendNotification(notification: Notification, user: User) {
		notification.user = user;
		if (user.notificationSettings[notification.type]) {
			await this.notificationRepository.save(notification);
		}
	}

	async createNewProblemNotification(problem: Problem) {
		const users = await this.userRepository.find();

		await Promise.all(
			users.map(async (user) => {
				await this.sendNotification(
					this.notificationRepository.create({
						type: NotificationType.NEW_PROBLEM,
						problem,
					}),
					user,
				);
			}),
		);
	}

	async getNotifications(user: User, status: NotificationStatus) {
		return await this.notificationRepository.find({
			where: {
				user: {
					id: user.id,
				},
				...(status !== NotificationStatus.ALL && {
					isRead: status === NotificationStatus.READ,
				}),
			},
			order: {
				createdAt: 'DESC',
			},
		});
	}

	async markAsRead(user: User, id: string) {
		await this.notificationRepository.update({ id, user: { id: user.id } }, { isRead: true });
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteOldNotifications() {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		await this.notificationRepository.delete({ createdAt: LessThan(sevenDaysAgo) });
	}
}
