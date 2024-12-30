import axios from 'axios';

import User from '../models/user.js';
import Submission from '../models/submission.js';
import Problem from '../models/problem.js';
import Contest from '../models/contest.js';

const submissionControllers = {
	//[GET] /submission
	async getList(req, res, next) {
		try {
			const { size = 20, page = 1, status, author, language, problem } = req.query;
			const data = await Submission.filter({ status, author, language, problem });

			if (req.userPermission != 'Admin') {
				data = data.filter((submission) => !submission.forContest);
			}

			res.status(200).json({
				success: true,
				data: data.slice(size * (page - 1), size * page),
				maxPage: Math.ceil(data.length / size),
			});

			console.log('Get submission list successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get submission list: ${err.message}`);
		}
	},

	//[GET] /submission/info/:id
	async get(req, res, next) {
		try {
			const { id } = req.params;

			const user = await User.findById(req.userId);

			const submission = await Submission.findById(id);

			if (!submission) {
				throw new Error('Submission not found');
			}

			if (user.permission != 'Admin' && user.name != submission.author) {
				return res.status(401).json({ success: false, message: 'Unauthorized - not allowed access' });
			}

			res.status(200).json({
				success: true,
				data: submission,
			});

			console.log(`Get submission "${id}" successfull`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get _id submission: ${err.message}`);
		}
	},

	//[POST] /submission/submit
	async submit(req, res, next) {
		try {
			const { src, problem: id, language, contest: contestId } = req.body;

			const problem = await Problem.findOne({ id });

			if (!problem) {
				throw new Error('Problem not found');
			}

			const user = await User.findById(req.userId);

			let contest = null;

			if (contestId) {
				contest = await Contest.findOne({ id: contestId });
				if (!contest) {
					throw new Error('Contest not found');
				}
				if (!contest.problems.includes(problem.id)) {
					throw new Error('This contest does not have this problem');
				}
				if (user.joiningContest != contest.id) {
					throw new Error('You are not participating in this contest');
				}
			}

			axios
				.post(`/judge`, { src, problem, language }, { baseURL: process.env.JUDGER_URL })
				.catch((err) => res.status(400).json(err.response.data))
				.then(async (response) => {
					const submission = new Submission({
						author: user.name,
						src,
						forProblem: id,
						forContest: contestId,
						language,
						...response.data.data,
					});
					problem.noOfSubm++;

					const alreadyAC = await Submission.filter({ status: 'AC', author: user.name, problem: id });
					if (!alreadyAC && response.data.data.status === 'AC') {
						problem.noOfSuccess++;
						user.totalAC++;
					}

					const lastSubmissions = await Submission.filter({ author: user.name, problem: id });
					const bestLastSubmit = lastSubmissions.reduce((acc, val) => max(acc, val.point));
					user.totalScore -= bestLastSubmit;
					user.totalScore += max(bestLastSubmit, submission.point);

					await submission.save();
					await problem.save();
					await user.save();

					if (contest) {
						contest.standing = contest.standing.map((usr) => {
							if (usr.user == user.name) {
								if (submission.point > usr.score[contest.problems.indexOf(id)]) {
									usr.score[contest.problems.indexOf(id)] = submission.point;
									usr.time[contest.problems.indexOf(id)] = Date.now();
								}
							}
							return usr;
						});

						await contest.save();
					}

					res.status(201).json({ success: true, data: submission });

					console.log('Submit code successfull');
				});
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in submit: ${err.message}`);
		}
	},
};

export default submissionControllers;
