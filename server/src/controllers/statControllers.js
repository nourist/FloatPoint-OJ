import Submission from '../models/submission.js';
import User from '../models/user.js';

const parseDate = (dateStr) => {
	const d = new Date(dateStr);
	return isNaN(d.getTime()) ? new Date() : d;
};

const statControllers = {
	//[GET] /stat
	async getStat(req, res, next) {
		const { day } = req.query;

		try {
			const baseDay = parseDate(day);
			const startOfToday = new Date(baseDay);
			startOfToday.setHours(0, 0, 0, 0);

			const endOfToday = new Date(baseDay);
			endOfToday.setHours(23, 59, 59, 999);

			const countTodaySubmissions = await Submission.countDocuments({
				createdAt: {
					$gte: startOfToday,
					$lte: endOfToday,
				},
			});

			const todayProblemSet = await Submission.distinct('forProblem', {
				createdAt: {
					$gte: startOfToday,
					$lte: endOfToday,
				},
			});
			const countTodayProblem = todayProblemSet.length;

			const countUserCreatedToday = await User.countDocuments({
				createdAt: {
					$gte: startOfToday,
					$lte: endOfToday,
				},
			});

			const countTodayAccepted = await Submission.countDocuments({
				createdAt: {
					$gte: startOfToday,
					$lte: endOfToday,
				},
				status: 'AC',
			});

			res.status(200).json({
				success: true,
				data: {
					countTodaySubmissions,
					countTodayProblem,
					countUserCreatedToday,
					countTodayAccepted,
				},
			});

			console.log('Get stat successful');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get stat: ${err.message}`);
		}
	},

	//[GET] /stat/weekly-submission
	async getWeeklySubmisson(req, res, next) {
		const { day } = req.query;

		try {
			const today = parseDate(day);

			const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();

			const startOfWeek = new Date(today);
			startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
			startOfWeek.setHours(0, 0, 0, 0);

			const endOfWeek = new Date(today);
			endOfWeek.setDate(today.getDate() + (7 - dayOfWeek));
			endOfWeek.setHours(23, 59, 59, 999);

			const data = await Submission.aggregate([
				{
					$match: {
						createdAt: {
							$gte: startOfWeek,
							$lte: endOfWeek,
						},
					},
				},
				{
					$group: {
						_id: { $dayOfWeek: '$createdAt' },
						count: { $sum: 1 },
					},
				},
				{
					$project: {
						dayOfWeek: {
							$mod: [{ $add: [{ $subtract: ['$_id', 2] }, 7] }, 7],
						},
						count: 1,
						_id: 0,
					},
				},
				{
					$sort: { dayOfWeek: 1 },
				},
			]);

			res.status(200).json({
				success: true,
				data,
			});

			console.log('Get weekly submission successful');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get weekly submission: ${err.message}`);
		}
	},

	//[GET] /stat/weekly-accepted
	async getWeeklyAccepted(req, res, next) {
		const { day } = req.query;

		try {
			const today = parseDate(day);

			const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();

			const startOfWeek = new Date(today);
			startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
			startOfWeek.setHours(0, 0, 0, 0);

			const endOfWeek = new Date(today);
			endOfWeek.setDate(today.getDate() + (7 - dayOfWeek));
			endOfWeek.setHours(23, 59, 59, 999);

			const data = await Submission.aggregate([
				{
					$match: {
						createdAt: {
							$gte: startOfWeek,
							$lte: endOfWeek,
						},
						status: 'AC',
					},
				},
				{
					$group: {
						_id: { $dayOfWeek: '$createdAt' },
						count: { $sum: 1 },
					},
				},
				{
					$project: {
						dayOfWeek: {
							$mod: [{ $add: [{ $subtract: ['$_id', 2] }, 7] }, 7],
						},
						count: 1,
						_id: 0,
					},
				},
				{
					$sort: { dayOfWeek: 1 },
				},
			]);

			res.status(200).json({
				success: true,
				data,
			});

			console.log('Get weekly accepted submissions successful');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get weekly accepted submissions: ${err.message}`);
		}
	},

	//[GET] /stat/daily-submission
	async getDailySubmission(req, res, next) {
		const { day } = req.query;

		try {
			const baseDay = parseDate(day);
			const startOfDay = new Date(baseDay);
			startOfDay.setHours(0, 0, 0, 0);

			const endOfDay = new Date(baseDay);
			endOfDay.setHours(23, 59, 59, 999);

			const data = await Submission.aggregate([
				{
					$match: {
						createdAt: {
							$gte: startOfDay,
							$lte: endOfDay,
						},
					},
				},
				{
					$group: {
						_id: '$status',
						count: { $sum: 1 },
					},
				},
				{
					$sort: { _id: -1 },
				},
			]);

			res.status(200).json({
				success: true,
				data,
			});

			console.log('Get daily submission successful');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get daily submission: ${err.message}`);
		}
	},

	//[GET] /stat/monthly-submission
	async getMonthlySubmission(req, res, next) {
		const { day } = req.query;

		try {
			const baseDay = parseDate(day);
			const startOfMonth = new Date(baseDay.getFullYear(), baseDay.getMonth(), 1);
			const endOfMonth = new Date(baseDay.getFullYear(), baseDay.getMonth() + 1, 0, 23, 59, 59, 999);

			const data = await Submission.aggregate([
				{
					$match: {
						createdAt: {
							$gte: startOfMonth,
							$lte: endOfMonth,
						},
					},
				},
				{
					$group: {
						_id: '$status',
						count: { $sum: 1 },
					},
				},
				{
					$sort: { _id: -1 },
				},
			]);

			res.status(200).json({
				success: true,
				data,
			});

			console.log('Get monthly submission successful');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get monthly submission: ${err.message}`);
		}
	},

	//[GET] /stat/monthly-language
	async getMonthlyLanguage(req, res, next) {
		const { day } = req.query;

		try {
			const baseDay = parseDate(day);
			const startOfMonth = new Date(baseDay.getFullYear(), baseDay.getMonth(), 1);
			const endOfMonth = new Date(baseDay.getFullYear(), baseDay.getMonth() + 1, 0, 23, 59, 59, 999);

			const data = await Submission.aggregate([
				{
					$match: {
						createdAt: {
							$gte: startOfMonth,
							$lte: endOfMonth,
						},
					},
				},
				{
					$group: {
						_id: '$language',
						count: { $sum: 1 },
					},
				},
				{
					$sort: { _id: 1 },
				},
			]);

			res.status(200).json({
				success: true,
				data,
			});

			console.log('Get monthly language successful');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get monthly language: ${err.message}`);
		}
	},

	//[GET] /stat/newest-activity
	async getNewestActivity(req, res, next) {
		try {
			const today = new Date(Date.now());
			const endDay = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

			const startOfToday = new Date(today);
			startOfToday.setHours(0, 0, 0, 0);

			const endOfToday = new Date(today);
			endOfToday.setHours(23, 59, 59, 999);

			const users = await User.find({
				createdAt: {
					$gte: endDay,
					$lte: today,
				},
			});

			const accepteds = await Submission.find({
				createdAt: {
					$gte: endDay,
					$lte: today,
				},
				status: 'AC',
			});

			const data = [];

			users.forEach((item) => {
				data.push({
					when: item.createdAt,
					type: 'user',
					author: item.name,
				});
			});
			accepteds.forEach((item) => {
				data.push({
					when: item.createdAt,
					type: 'accepted',
					author: item.author,
					problem: item.forProblem,
				});
			});
			data.sort((a, b) => new Date(b.when) - new Date(a.when));

			res.status(200).json({
				success: true,
				data: data.slice(0, 5),
				today: data.reduce((acc, cur) => {
					if (cur.when >= startOfToday && cur.when <= endOfToday) return acc + 1;
					else return acc;
				}, 0),
			});

			console.log('Get newest activities successful');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get newest activities: ${err.message}`);
		}
	},

	//[GET] /stat/problem/:id
	async getProblemStat(req, res, next) {
		const { id } = req.params;

		try {
			const status = await Submission.aggregate([
				{
					$match: {
						forProblem: id,
					},
				},
				{
					$group: {
						_id: '$status',
						count: { $sum: 1 },
					},
				},
				{
					$sort: { _id: -1 },
				},
			]);

			const language = await Submission.aggregate([
				{
					$match: {
						forProblem: id,
					},
				},
				{
					$group: {
						_id: '$language',
						count: { $sum: 1 },
					},
				},
				{
					$sort: { _id: -1 },
				},
			]);

			res.status(200).json({ success: true, data: { status, language } });
			console.log('Get problem stat successful');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get problem stat: ${err.message}`);
		}
	},
};

export default statControllers;
