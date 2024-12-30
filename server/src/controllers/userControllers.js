import User from '../models/user.js';
import { getTop } from '../utils/user.js';

const userControllers = {
	//[GET] /user
	async getList(req, res, next) {
		try {
			const { size = 20, page = 1, q, permission, sortBy, order } = req.query;

			const data = await User.filterAndSort({ q, permission, sortBy, order });

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

			const user = await User.findOne(
				{ name },
				'-resetPasswordToken -verificationToken -isVerified -password -email',
			);

			if (!user) {
				throw new Error('User not found');
			}

			const top = await getTop(user.name);

			res.status(200).json({ success: true, data: { ...user._doc, top } });

			console.log(`Get user "${name}" successfull`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get user: ${err.message}`);
		}
	},
};

export default userControllers;
