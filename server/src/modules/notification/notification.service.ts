import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThan, Repository } from 'typeorm';

import { Blog } from 'src/entities/blog.entity';
import { Contest } from 'src/entities/contest.entity';
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
				if (user.id === problem.creator.id) return;

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

	async createNewBlogNotification(blog: Blog) {
		const users = await this.userRepository.find();

		await Promise.all(
			users.map(async (user) => {
				if (user.id === blog.author.id) return;

				await this.sendNotification(
					this.notificationRepository.create({
						type: NotificationType.NEW_BLOG,
						blog,
					}),
					user,
				);
			}),
		);
	}

	async createNewContestNotification(contest: Contest) {
		const users = await this.userRepository.find();

		await Promise.all(
			users.map(async (user) => {
				if (user.id === contest.creator.id) return;

				await this.sendNotification(
					this.notificationRepository.create({
						type: NotificationType.NEW_CONTEST,
						contest,
					}),
					user,
				);
			}),
		);
	}

	async createUpdateRatingNotification(user: User, contest: Contest, oldRating: number, newRating: number) {
		const content = `Your rating has been updated after contest "${contest.title}": ${oldRating} → ${newRating}`;

		await this.sendNotification(
			this.notificationRepository.create({
				type: NotificationType.UPDATE_RATING,
				content,
				contest,
			}),
			user,
		);
	}

	async sendSystemNotification(content: string, senderId: string) {
		const users = await this.userRepository.find();

		await Promise.all(
			users.map(async (user) => {
				// Don't send notification to the sender
				if (user.id === senderId) return;

				await this.sendNotification(
					this.notificationRepository.create({
						type: NotificationType.SYSTEM,
						content,
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
			relations: ['contest', 'problem', 'blog'],
		});
	}

	async markAsRead(user: User, id: string) {
		await this.notificationRepository.update({ id, user: { id: user.id } }, { isRead: true });
	}

	async markMultipleAsRead(user: User, ids: string[]) {
		await this.notificationRepository.update({ id: In(ids), user: { id: user.id } }, { isRead: true });
	}

	@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
	async deleteOldNotifications() {
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		await this.notificationRepository.delete({ createdAt: LessThan(sevenDaysAgo) });
	}
}
