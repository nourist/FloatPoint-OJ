import Contest from '../models/contest.js';
import User from '../models/user.js';
import Problem from '../models/problem.js';
import Submission from '../models/submission.js';

const contestControllers = {
	//[GET] /contest
	async getList(req, res, next) {
		try {
			const { q, status, size = 20, page = 1 } = req.query;

			const data = await Contest.filter({ q, status });

			res.status(200).json({
				success: true,
				data: data.slice(size * (page - 1), size * page),
				maxPage: Math.ceil(data.length / size),
			});

			console.log('Get contest list successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get contest list: ${err.message}`);
		}
	},

	//[GET] /contest/info/:id
	async get(req, res, next) {
		try {
			const { id } = req.params;

			const contest = await Contest.findOne({ id }, '-_id');

			if (!contest) {
				throw new Error('Contest not found');
			}

			res.status(200).json({
				success: true,
				data: { ...contest._doc, status: contest.get('status') },
			});

			console.log(`Get id: "${id}" contest successfull`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get _id contest: ${err.message}`);
		}
	},

	//[POST] /contest/join/:id
	async join(req, res, next) {
		try {
			const { id } = req.params;

			if (!id) {
				throw new Error('Id field is required');
			}

			const contest = await Contest.findOne({ id });
			const user = await User.findById(req.userId);

			if (contest.get('status') !== 'ongoing') {
				throw new Error('You cant join this contest');
			}

			if (!contest) {
				throw new Error('Contest not found');
			}

			if (!contest.participant.includes(user.name)) {
				contest.standing.push({ user: user.name });
			}

			if (!user.joinedContest.includes(contest.id)) {
				user.joinedContest.push(contest.id);
			}

			user.joiningContest = contest.id;

			await contest.save();
			await user.save();

			res.status(200).json({ success: true, msg: 'Join contest successfull' });

			console.log('Join contest successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in join contest: ${err.message}`);
		}
	},

	//[POST] /contest/leave
	async leave(req, res, next) {
		try {
			const user = await User.findById(req.userId);

			user.joiningContest = null;

			user.save();

			res.status(200).json({ success: false, msg: 'Leave contest successfull' });

			console.log('Leave contest successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in leave contest: ${err.message}`);
		}
	},

	//[POST] /contest/create
	async create(req, res, next) {
		try {
			const { id, title, startTime, endTime } = req.body;

			if (!id || !title || !startTime || !endTime) {
				throw new Error('Required fields are empty');
			}

			const isExisted = await Contest.findOne({ $or: [{ id }, { title }] });

			if (isExisted) {
				throw new Error('Contest already exists');
			}

			const contest = await Contest.create(req.body);

			await contest.save();

			res.status(201).json({
				success: true,
				msg: 'Create contest successfull',
				data: contest._doc,
			});

			console.log(`Create contest successfull"`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in create contest: ${err.message}`);
		}
	},

	//[POST] /contest/edit/:id
	async edit(req, res, next) {
		try {
			const { id } = req.params;

			if (!id) {
				throw new Error('Id field is required');
			}

			const contest = await Contest.findOne({ id });

			if (!contest) {
				throw new Error('Contest not found');
			}

			const newStanding = req.body.problems
				? contest.standing.map((item) => {
						const newScore = req.body.problems.map((problemId) => {
							const idx = contest.problems.indexOf(problemId);
							return {
								score: item.score[idx],
								time: item.time[idx],
								status: item.status[idx],
							};
						});

						return {
							user: item.user,
							score: newScore.map((item) => item.score),
							time: newScore.map((item) => item.time),
							status: newScore.map((item) => item.status),
						};
					})
				: contest.standing;

			contest.set({ ...req.body, standing: newStanding });

			await Promise.all(
				req.body?.problems?.map(async (pid) => {
					const problem = await Problem.findOne({ id: pid });
					if (!problem.contest.includes(id)) {
						problem.contest.push(id);
					}
					await problem.save();
				}) || [],
			);

			await contest.save();

			res.status(200).json({ success: true, msg: 'Edit contest successfull', data: contest._doc });

			console.log('Edit contest successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in edit contest: ${err.message}`);
		}
	},

	//[DELETE] /contest/delete/:id
	async delete(req, res, next) {
		try {
			const { id } = req.params;

			if (!id) {
				throw new Error('Id field is required');
			}

			const contest = await Contest.findOneAndDelete({ id });

			if (!contest) {
				throw new Error('Contest not found');
			}

			res.status(200).json({ success: true, msg: 'Delete contest successfull' });

			console.log('Delete contest successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in delete contest: ${err.message}`);
		}
	},
};

export default contestControllers;
