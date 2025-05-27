import Problem from '../models/problem.js';
import User from '../models/user.js';
import Submission from '../models/submission.js';

const problemControllers = {
	//[GET] /problem
	async getList(req, res, next) {
		try {
			const { size = 20, page = 1, tags, q, sortBy, order, difficulty, minimal, contest } = req.query;
			let data = await Problem.filterAndSort({ tags, q, sortBy, order, difficulty });
			if (sortBy === 'accuracy') {
				data.sort((a, b) => order * ((b.noOfSubm == 0 ? 1 : b.noOfSuccess / b.noOfSubm) - (a.noOfSubm == 0 ? 1 : a.noOfSuccess / a.noOfSubm)));
			}
			if (sortBy === 'difficulty') {
				const difficultyPoint = {
					easy: 0,
					medium: 1,
					hard: 2,
				};
				data.sort((a, b) => order * (difficultyPoint[b.difficulty] - difficultyPoint[a.difficulty]));
			}
			data = data.map((d) => d.toObject());

			if (req.userPermission != 'Admin') {
				data = data.filter((problem) => problem.public);
			}

			const user = await User.findById(req.userId);
			if (user) {
				const submissions = await Submission.filter({ author: user.name, status: 'AC' });

				for (let i = 0; i < data.length; i++) {
					const okAC = submissions.find((submission) => submission.forProblem == data[i].id);
					if (okAC) {
						data[i].solve = true;
					}
				}

				if (user.joiningContest && Boolean(contest) && contest === 'true') {
					data = data.filter((problem) => problem.contest.includes(user.joiningContest));
				}
			}

			if (minimal) {
				data = data.map((problem) => problem.id);
			}
			res.status(200).json({
				success: true,
				data: data.slice(size * (page - 1), size * page),
				maxPage: Math.ceil(data.length / size),
				maxProblem: data.length,
			});

			console.log('Get problem list successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get problem list: ${err.message}`);
		}
	},

	//[GET] /problem/info/:id
	async get(req, res, next) {
		try {
			const { id } = req.params;

			const problem = await Problem.findOne({ id }, '-_id -__v');

			if (!problem) {
				throw new Error('Problem not found');
			}

			if (!problem.public && req.userPermission !== 'Admin') {
				return res.status(401).json({ success: false, msg: 'You cant see this content' });
			}

			if (req.userPermission === 'Admin') {
				res.status(200).json({
					success: true,
					data: problem,
				});
			} else {
				res.status(200).json({
					success: true,
					data: { ...problem, testcase: undefined },
				});
			}

			console.log(`Get problem "${id}" successfull`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get _id problem: ${err.message}`);
		}
	},

	//[GET] /problem/tags
	async getTags(req, res, next) {
		try {
			let problems = await Problem.find();
			problems = problems.filter((item) => item.public || req.userPermission === 'Admin');

			let map = new Map();
			problems.forEach((problem) => {
				problem.tags.forEach((tag) => {
					if (map.has(tag)) {
						map.set(tag, map.get(tag) + 1);
					} else {
						map.set(tag, 1);
					}
				});
			});

			res.status(200).json({
				success: true,
				data: Array.from(map.entries()),
			});
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error('Error in get tags');
		}
	},

	//[GET] /problem/languages
	async getLanguages(req, res, next) {
		try {
			res.status(200).json({
				success: true,
				data: ['c', 'c11', 'c++11', 'c++14', 'c++17', 'c++20', 'python2', 'python3'],
			});
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error('Error in get languages');
		}
	},

	//[POST] /problem/create
	async create(req, res, next) {
		try {
			const { id, name } = req.body;

			if (!id || !name) {
				throw new Error(`Required fields are empty`);
			}

			const isExisted = await Problem.findOne({ $or: [{ id }, { name }] });

			if (isExisted) {
				throw new Error('Problem already exists');
			}

			const problem = await Problem.create(req.body);

			await problem.save();

			res.status(201).json({
				success: true,
				msg: 'Problem created successfull',
				data: { ...problem._doc, _id: undefined, __v: undefined },
			});

			console.log('Create problem successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in create problem: ${err.message}`);
		}
	},

	//[POST] /problem/edit/:id
	async edit(req, res, next) {
		try {
			const { id } = req.params;

			const problem = await Problem.findOneAndUpdate({ id }, req.body, { new: true });

			if (!problem) {
				throw new Error('Problem not found');
			}

			res.status(200).json({
				success: true,
				msg: 'Problem edited successfull',
				data: { ...problem._doc, _id: undefined, __v: undefined },
			});

			console.log(`Edit problem "${id}" successfull`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in edit problem: ${err.message}`);
		}
	},

	//[DELETE] /problem/delete/:id
	async delete(req, res, next) {
		try {
			const { id } = req.params;

			const problem = await Problem.findOneAndDelete({ id });

			if (!problem) {
				throw new Error('Problem not found');
			}

			res.status(200).json({
				success: true,
				msg: 'Problem deleted successfull',
			});
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in delete problem: ${err.message}`);
		}
	},
};

export default problemControllers;
