import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from 'src/entities/notification.entity';
import { NotificationType } from 'src/entities/notification.entity';
import { Problem } from 'src/entities/problem.entity';
import { User } from 'src/entities/user.entity';

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
}
