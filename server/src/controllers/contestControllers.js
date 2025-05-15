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
				data: contest._doc,
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

			const contest = await Contest.findOneAndUpdate({ id }, { ...req.body, problems: undefined }, { new: true });

			if (!contest) {
				throw new Error('Contest not found');
			}

			res.status(200).json({ success: true, msg: 'Edit contest successfull', data: contest._doc });

			console.log('Edit contest successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in edit contest: ${err.message}`);
		}
	},

	//[POST] /contest/add-problem/:id
	async addProblem(req, res, next) {
		try {
			const { id } = req.params;
			const { problem: problemId } = req.query;

			if (!id || !problemId) {
				throw new Error('All fields are required');
			}

			const contest = await Contest.findOne({ id });
			const problem = await Problem.findOne({ id: problemId });

			if (!contest) {
				throw new Error('Contest not found');
			}

			if (!problem) {
				throw new Error('Problem not found');
			}

			contest.problems.push(problemId);

			if (!problem.contest.includes(id)) {
				problem.contest.push(id);
			}

			await problem.save();
			await contest.save();

			res.status(200).json({
				success: true,
				msg: 'Add contest problem successfull',
				data: contest._doc,
			});

			console.log('Add contest problem successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in add problem to contest: ${err.message}`);
		}
	},

	//[POST] /contest/edit-problem/:id
	async editProblem(req, res, next) {
		try {
			const { id } = req.params;
			const { index, problem: problemId } = req.body;

			if (!id || (!index && index != 0) || !problemId) {
				throw new Error('All fields are required');
			}

			const contest = await Contest.findOne({ id });
			if (!contest) {
				throw new Error('Contest not found');
			}

			if (index >= contest.problems.length || index < 0) {
				throw new Error('Index not valid');
			}

			const problem = await Problem.findOne({ id: problemId });
			if (!problem) {
				throw new Error('Problem not found');
			}

			const lastProblem = await Problem.findOne({ id: contest.problems[index] });

			const lastProblemContestIdx = lastProblem.contest.indexOf(id);

			if (lastProblemContestIdx >= 0) {
				lastProblem.contest.splice(lastProblemContestIdx, 1);
			}

			contest.problems[index] = problemId;

			contest.standing = contest.standing.map((usr) => {
				usr.score[index] = null;
				usr.time[index] = null;
				return usr;
			});

			if (!problem.contest.includes(id)) {
				problem.contest.push(id);
			}

			await lastProblem.save();
			await problem.save();
			await contest.save();

			res.status(200).json({
				success: true,
				msg: 'Edit contest problem successfull',
				data: contest._doc,
			});

			console.log('Edit contest problem successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in edit contest problem: ${err.message}`);
		}
	},

	//[POST] /contest/remove-problem/:id
	async removeProblem(req, res, next) {
		try {
			const { id } = req.params;
			const { index } = req.query;

			if (!id || (!index && index != 0)) {
				throw new Error('All fields are required');
			}

			const contest = await Contest.findOne({ id });
			if (!contest) {
				throw new Error('Contest not found');
			}

			if (index >= contest.problems.length || index < 0) {
				throw new Error('Index not valid');
			}

			const lastProblem = await Problem.findOne({ id: contest.problems[index] });

			const lastProblemContestIdx = lastProblem.contest.indexOf(id);

			if (lastProblemContestIdx >= 0) {
				lastProblem.contest.splice(lastProblemContestIdx, 1);
			}

			contest.standing = contest.standing.map((usr) => {
				usr.score.splice(index, 1);
				usr.time.splice(index, 1);
				return usr;
			});

			contest.problems.splice(index, 1);

			await lastProblem.save();
			await contest.save();

			res.status(200).json({
				success: true,
				msg: 'Remove contest problem successfull',
				data: contest._doc,
			});

			console.log('Remove contest problem successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in remove contest problem: ${err.message}`);
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
