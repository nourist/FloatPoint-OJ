import Submission from '../models/submission.js';
import User from '../models/user.js';

const statControllers = {
	//[GET] /stat
	async getStat(req, res, next) {
		try {
			const startOfToday = new Date();
			startOfToday.setHours(0, 0, 0, 0);

			const endOfToday = new Date();
			endOfToday.setHours(23, 59, 59, 999);

			const countTodaySubmissions = await Submission.countDocuments({
				createdAt: {
					$gte: startOfToday,
					$lte: endOfToday,
				},
			});

			const countUserActiveToday = await User.countDocuments({
				lastLogin: {
					$gte: startOfToday,
					$lte: endOfToday,
				},
			});

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
					countUserActiveToday,
					countUserCreatedToday,
					countTodayAccepted,
				},
			});

			console.log('Get stat successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get stat: ${err.message}`);
		}
	},

	//[GET] /stat/weekly-submission
	async getWeeklySubmisson(req, res, next) {
		try {
			const today = new Date();

			const startOfWeek = new Date(today);
			startOfWeek.setDate(today.getDate() - today.getDay());
			startOfWeek.setHours(0, 0, 0, 0);

			const endOfWeek = new Date(today);
			endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
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
						_id: {
							$dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
						},
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

			console.log('Get weekly submission successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get weekly submission: ${err.message}`);
		}
	},

	//[GET /stat/today-submission
	async getTodaySubmission(req, res, next) {
		try {
			const startOfToday = new Date();
			startOfToday.setHours(0, 0, 0, 0);

			const endOfToday = new Date();
			endOfToday.setHours(23, 59, 59, 999);

			const data = await Submission.aggregate([
				{
					$match: {
						createdAt: {
							$gte: startOfToday,
							$lte: endOfToday,
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
					$sort: { count: -1 },
				},
			]);

			res.status(200).json({
				success: true,
				data,
			});

			console.log('Get today submission successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get today submission: ${err.message}`);
		}
	},
};

export default statControllers;
