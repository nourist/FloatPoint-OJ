import User from '../models/user.js';
import { getTop } from '../utils/user.js';
import cloudinary from '../config/cloudinary.js';
import Submission from '../models/submission.js';
import Problem from '../models/problem.js';

const userControllers = {
	//[GET] /user
	async getList(req, res, next) {
		try {
			const { size = 20, page = 1, q, permission, sortBy, order, minimal } = req.query;

			let data = await User.filterAndSort({ q, permission, sortBy, order });

			data = await Promise.all(
				data.map(async (item) => {
					const top = await getTop(item.name);
					return { ...item._doc, top };
				}),
			);

			if (minimal) {
				data = data.map((user) => user.name);
			}

			res.status(200).json({
				success: true,
				data: data.slice(size * (page - 1), size * page),
				maxPage: Math.ceil(data.length / size),
			});

			console.log('Get user list successfull');
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get user list: ${err.message}`);
		}
	},

	//[GET] /user/info/:name
	async get(req, res, next) {
		try {
			const { name } = req.params;

			const user = await User.findOne({ name }, '-resetPasswordToken -verificationToken -isVerified -password');

			if (!user) {
				throw new Error('User not found');
			}

			const top = await getTop(user.name);

			const submissions = await Submission.filter({ author: user.name });
			const map = new Map();
			submissions.forEach((item) => {
				if (map.has(item.forProblem)) {
					if (item.status === 'AC') {
						map.set(item.forProblem, 'Accepted');
					}
				} else {
					map.set(item.forProblem, item.status === 'AC' ? 'Accepted' : 'Attempted');
				}
			});
			const problems = await Problem.find();
			const problemDifficulty = new Map();
			const problemName = new Map();
			problems.forEach((item) => {
				problemDifficulty.set(item.id, item.difficulty);
				problemName.set(item.id, item.name);
			});

			res.status(200).json({
				success: true,
				data: { ...user._doc, top },
				problems: Array.from(map, ([key, value]) => [key, value, problemDifficulty.get(key), problemName.get(key)]).reduce(
					(acc, [key, value, difficulty, name]) => ({ ...acc, [key]: { status: value, difficulty, name } }),
					{},
				),
			});

			console.log(`Get user "${name}" successfull`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get user: ${err.message}`);
		}
	},

	//[GET] /user/edit
	async edit(req, res, next) {
		try {
			const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });

			res.status(200).json({
				success: true,
				msg: 'Edit user successfull',
				data: user._doc,
			});

			console.log(`Edit user successfull`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in edit user: ${err.message}`);
		}
	},

	//[POST] /user/change-avatar
	async changeAvatar(req, res, next) {
		try {
			const url = req.file?.path || req.body.url;
			if (!url) {
				throw new Error('No file uploaded');
			}

			const user = await User.findByIdAndUpdate(req.userId, { avatar: url }, { new: true });

			res.status(200).json({
				success: true,
				msg: 'Change avatar successfull',
				data: user.avatar,
			});

			console.log(`Change user avatar successfull`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in change user avatar: ${err.message}`);
		}
	},

	//[DELETE] /user/delete/:name
	async deleteUser(req, res, next) {
		try {
			const { name } = req.params;

			await User.findOneAndDelete({ name });

			res.status(200).json({ success: true, msg: 'User deleted successfully' });

			console.log(`User ${name} deleted successfully`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in delete user: ${err.message}`);
		}
	},
};

export default userControllers;
