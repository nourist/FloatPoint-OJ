import User from '../models/user.js';
import Submission from '../models/submission.js';
import Problem from '../models/problem.js';

const submissionControllers = {
	//[GET] /submission
	async getList(req, res, next) {
		try {
			const { size = 20, page = 1, status, author, language, problem } = req.query;
			const data = await Submission.filter({ status, author, language, problem });

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
			const { src, problem: id, language } = req.body;

			const problem = await Problem.findOne({ id });

			if (!problem) {
				throw new Error('Problem not found');
			}

			const user = await User.findById(req.userId);

			//judge....
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in submit: ${err.message}`);
		}
	},
};

export default submissionControllers;
