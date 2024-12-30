import Problem from '../models/problem.js';

const problemControllers = {
	//[GET] /problem
	async getList(req, res, next) {
		try {
			const { size = 20, page = 1, tags, q, sortBy, order } = req.query;
			const data = await Problem.filterAndSort({ tags, q, sortBy, order });

			if (req.userPermission != 'Admin') {
				data = data.filter((problem) => problem.public);
			}

			res.status(200).json({
				success: true,
				data: data.slice(size * (page - 1), size * page),
				maxPage: Math.ceil(data.length / size),
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

			const problem = await Problem.findOne({ id }, '-testcase -_id -__v');

			if (!problem) {
				throw new Error('Problem not found');
			}

			if (!problem.public && req.userPermission != 'Admin') {
				return res.status(401).json({ success: false, msg: 'You cant see this content' });
			}

			res.status(200).json({
				success: true,
				data: problem,
			});

			console.log(`Get problem "${id}" successfull`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get _id problem: ${err.message}`);
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
