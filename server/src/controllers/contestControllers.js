import Contest from '../models/contest.js';

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

	//[POST] /contest/create
	async create(req, res, next) {
		try {
			const { id, title, startTime, endTime } = req.body;

			if (!id || !title || !startTime || !endTime) {
				throw new Error('Required fields are empty');
			}

			const isExisted = Contest.findOne({ $or: [{ id }, { title }] });

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

	//[DELETE] /contest/delete/:id
	async delete(req, res, next) {
		try {
			const { id } = req.params;

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
