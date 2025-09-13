import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';

import { Contest } from '../../entities/contest.entity';
import { Problem } from '../../entities/problem.entity';
import { Submission, SubmissionStatus } from '../../entities/submission.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class StatisticsService {
	constructor(
		@InjectRepository(Submission)
		private readonly submissionRepository: Repository<Submission>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Problem)
		private readonly problemRepository: Repository<Problem>,
		@InjectRepository(Contest)
		private readonly contestRepository: Repository<Contest>,
	) {}

	async getOverview() {
		const total_users = await this.userRepository.count();
		const active_users_today = await this.userRepository.count({
			where: {
				updatedAt: MoreThanOrEqual(new Date(new Date().setDate(new Date().getDate() - 1))),
			},
		});
		const total_submissions = await this.submissionRepository.count();
		const accepted_submissions = await this.submissionRepository.count({
			where: { status: SubmissionStatus.ACCEPTED },
		});
		const success_rate = total_submissions > 0 ? (accepted_submissions / total_submissions) * 100 : 0;
		const active_problems = await this.problemRepository.count();

		return {
			total_users,
			active_users_today,
			total_submissions,
			success_rate: parseFloat(success_rate.toFixed(2)),
			active_problems,
			system_status: 'online' as const,
		};
	}

	async getUserActivity(period: '7d' | '30d' | '90d') {
		const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
		const fromDate = new Date();
		fromDate.setDate(fromDate.getDate() - days);

		const result: Array<{ date: string | Date; new_registrations: string; active_users: string }> = await this.userRepository
			.createQueryBuilder('user')
			.select('DATE(user.createdAt)', 'date')
			.addSelect('COUNT(DISTINCT user.id)', 'new_registrations')
			.addSelect(
				`(SELECT COUNT(DISTINCT u.id) FROM "users" u WHERE u."updatedAt" >= DATE(MIN(user.createdAt)) AND u."updatedAt" < DATE(MIN(user.createdAt)) + interval '1 day')`,
				'active_users',
			)
			.where('user.createdAt >= :fromDate', { fromDate })
			.groupBy('DATE(user.createdAt)')
			.orderBy('date', 'ASC')
			.getRawMany();

		const totalUsers = await this.userRepository.count();

		const data = result.map((item) => {
			const date = new Date(item.date);
			return {
				date: date.toISOString().split('T')[0],
				total_users: totalUsers,
				active_users: parseInt(item.active_users, 10),
				new_registrations: parseInt(item.new_registrations, 10),
			};
		});

		return { period, data };
	}

	async getSubmissionVolume(period: '7d' | '30d' | '90d') {
		const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
		const fromDate = new Date();
		fromDate.setDate(fromDate.getDate() - days);

		const result: Array<{ date: string | Date; submissions: string; accepted: string }> = await this.submissionRepository
			.createQueryBuilder('submission')
			.select('DATE(submission.submittedAt)', 'date')
			.addSelect('COUNT(*)', 'submissions')
			.addSelect(`SUM(CASE WHEN submission.status = '${SubmissionStatus.ACCEPTED}' THEN 1 ELSE 0 END)`, 'accepted')
			.where('submission.submittedAt >= :fromDate', { fromDate })
			.groupBy('DATE(submission.submittedAt)')
			.orderBy('date', 'ASC')
			.getRawMany();

		const data = result.map((item) => {
			const date = new Date(item.date);
			return {
				date: date.toISOString().split('T')[0],
				submissions: parseInt(item.submissions, 10),
				accepted: parseInt(item.accepted, 10),
			};
		});

		return { period, data };
	}

	async getLanguageDistribution(period: '7d' | '30d' | 'all') {
		const qb = this.submissionRepository.createQueryBuilder('submission');

		if (period !== 'all') {
			const days = period === '7d' ? 7 : 30;
			const date = new Date();
			date.setDate(date.getDate() - days);
			qb.where('submission.submittedAt >= :date', { date });
		}

		const result: Array<{ language: string; count: string }> = await qb
			.select('submission.language', 'language')
			.addSelect('COUNT(*)', 'count')
			.groupBy('submission.language')
			.getRawMany();

		const total = result.reduce((acc, item) => acc + parseInt(item.count, 10), 0);

		const data = result.map((item) => ({
			language: item.language,
			count: parseInt(item.count, 10),
			percentage: total > 0 ? parseFloat(((parseInt(item.count, 10) / total) * 100).toFixed(2)) : 0,
		}));

		return { period, data };
	}

	async getSubmissionResults(period: '7d' | '30d' | 'all') {
		const qb = this.submissionRepository.createQueryBuilder('submission');

		if (period !== 'all') {
			const days = period === '7d' ? 7 : 30;
			const date = new Date();
			date.setDate(date.getDate() - days);
			qb.where('submission.submittedAt >= :date', { date });
		}

		const result: Array<{ status: string; count: string }> = await qb
			.select('submission.status', 'status')
			.addSelect('COUNT(*)', 'count')
			.groupBy('submission.status')
			.getRawMany();

		const data = result.map((item) => ({
			status: item.status,
			count: parseInt(item.count, 10),
			color: this.getStatusColor(item.status),
		}));

		return { period, data };
	}

	private getStatusColor(status: string): string {
		switch (status as SubmissionStatus) {
			case SubmissionStatus.ACCEPTED:
				return '#4CAF50';
			case SubmissionStatus.WRONG_ANSWER:
				return '#F44336';
			case SubmissionStatus.TIME_LIMIT_EXCEEDED:
				return '#FFC107';
			case SubmissionStatus.MEMORY_LIMIT_EXCEEDED:
				return '#FF9800';
			case SubmissionStatus.RUNTIME_ERROR:
				return '#9C27B0';
			case SubmissionStatus.COMPILATION_ERROR:
				return '#607D8B';
			default:
				return '#9E9E9E';
		}
	}

	async getProblemDifficulty() {
		const result: Array<{ difficulty: string; count: string; solved_users: string }> = await this.problemRepository
			.createQueryBuilder('problem')
			.select('problem.difficulty', 'difficulty')
			.addSelect('COUNT(*)', 'count')
			.addSelect(
				(subQuery) =>
					subQuery
						.select('COUNT(DISTINCT submission."authorId")')
						.from(Submission, 'submission')
						.leftJoin('submission.problem', 'problem_sub')
						.where('problem_sub.difficulty = problem.difficulty')
						.andWhere(`submission.status = '${SubmissionStatus.ACCEPTED}'`),
				'solved_users',
			)
			.groupBy('problem.difficulty')
			.getRawMany();

		const data = result.map((item) => ({
			difficulty: item.difficulty,
			count: parseInt(item.count, 10),
			solved_users: parseInt(item.solved_users, 10),
		}));

		return { data };
	}

	async getContestParticipation(period: '3m' | '6m' | '1y') {
		const months = period === '3m' ? 3 : period === '6m' ? 6 : 12;
		const data: { month: string; contests: number; participants: number }[] = [];

		for (let i = 0; i < months; i++) {
			const date = new Date();
			date.setMonth(date.getMonth() - i);

			const contests = await this.contestRepository.count({
				where: {
					startTime: Between(new Date(date.getFullYear(), date.getMonth(), 1), new Date(date.getFullYear(), date.getMonth() + 1, 0)),
				},
			});

			const participants: { count: string } | undefined = await this.contestRepository
				.createQueryBuilder('contest')
				.leftJoin('contest.participants', 'user')
				.where('contest.startTime BETWEEN :start AND :end', {
					start: new Date(date.getFullYear(), date.getMonth(), 1),
					end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
				})
				.select('COUNT(DISTINCT user.id)', 'count')
				.getRawOne();

			data.push({
				month: date.toLocaleString('default', { month: 'short' }),
				contests,
				participants: parseInt(participants?.count ?? '0', 10),
			});
		}
		return { period, data: data.reverse() };
	}

	async getTopUsers(limit: number, period: '7d' | '30d') {
		const days = period === '7d' ? 7 : 30;
		const fromDate = new Date();
		fromDate.setDate(fromDate.getDate() - days);

		const users: Array<{
			user_username: string;
			user_fullname: string;
			solved: string;
			submissions: string;
		}> = await this.userRepository
			.createQueryBuilder('user')
			.addSelect(
				`(SELECT COUNT(DISTINCT submission."problemId") FROM submissions submission WHERE submission."authorId" = user.id AND submission.status = '${SubmissionStatus.ACCEPTED}' AND submission."submittedAt" >= '${fromDate.toISOString()}')`,
				'solved',
			)
			.addSelect(
				`(SELECT COUNT(*) FROM submissions submission WHERE submission."authorId" = user.id AND submission."submittedAt" >= '${fromDate.toISOString()}')`,
				'submissions',
			)
			.orderBy('solved', 'DESC')
			.take(limit)
			.getRawMany();

		const data = users.map((user, index) => {
			const solved = parseInt(user.solved, 10);
			const submissions = parseInt(user.submissions, 10);
			return {
				rank: index + 1,
				username: user.user_username,
				fullname: user.user_fullname,
				solved,
				submissions,
				success_rate: submissions > 0 ? `${((solved / submissions) * 100).toFixed(2)}%` : '0%',
			};
		});

		return { limit, period, data };
	}

	async getPopularProblems(limit: number, period: '30d') {
		const days = 30;
		const fromDate = new Date();
		fromDate.setDate(fromDate.getDate() - days);

		const problems: Array<{
			problem_slug: string;
			problem_title: string;
			problem_difficulty: string;
			attempts: string;
			solved: string;
		}> = await this.problemRepository
			.createQueryBuilder('problem')
			.addSelect(
				`(SELECT COUNT(*) FROM submissions submission WHERE submission."problemId" = problem.id AND submission."submittedAt" >= '${fromDate.toISOString()}')`,
				'attempts',
			)
			.addSelect(
				`(SELECT COUNT(*) FROM submissions submission WHERE submission."problemId" = problem.id AND submission.status = '${SubmissionStatus.ACCEPTED}' AND submission."submittedAt" >= '${fromDate.toISOString()}')`,
				'solved',
			)
			.orderBy('attempts', 'DESC')
			.take(limit)
			.getRawMany();

		const data = problems.map((problem, index) => {
			const attempts = parseInt(problem.attempts, 10);
			const solved = parseInt(problem.solved, 10);
			return {
				rank: index + 1,
				slug: problem.problem_slug,
				title: problem.problem_title,
				difficulty: problem.problem_difficulty,
				attempts,
				solved,
				success_rate: attempts > 0 ? `${((solved / attempts) * 100).toFixed(2)}%` : '0%',
			};
		});

		return { limit, period, data };
	}
}
