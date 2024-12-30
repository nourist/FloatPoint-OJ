import User from '../models/user.js';

export const getTop = async (name) => {
	const list = await User.find().sort({ totalScore: 'desc' });

	let res = -1;
	list.forEach((user, index) => {
		if (user.name == name) {
			res = index + 1;
		}
	});

	return res;
};
