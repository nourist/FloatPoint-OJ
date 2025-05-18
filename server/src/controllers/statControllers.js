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
			startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // thứ Hai
			startOfWeek.setHours(0, 0, 0, 0);

			const endOfWeek = new Date(today);
			endOfWeek.setDate(today.getDate() + (7 - dayOfWeek)); // Chủ Nhật
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
						_id: { $dayOfWeek: '$createdAt' }, // 1=Chủ Nhật,...7=Thứ Bảy
						count: { $sum: 1 },
					},
				},
				{
					$project: {
						// Map thứ Hai=0,... Chủ Nhật=6
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
			startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // thứ Hai
			startOfWeek.setHours(0, 0, 0, 0);

			const endOfWeek = new Date(today);
			endOfWeek.setDate(today.getDate() + (7 - dayOfWeek)); // Chủ Nhật
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
						_id: { $dayOfWeek: '$createdAt' }, // 1=Chủ Nhật,...7=Thứ Bảy
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

			console.log('Get today submission successful');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });
			console.error(`Error in get today submission: ${err.message}`);
		}
	},
};

export default statControllers;
