import judge from './judgeEngine/index.js';

const controllers = {
	home: (req, res, next) => {
		res.send('Hello world');
	},
	judge: async (req, res, next) => {
		try {
			const result = await judge(req.body);
			res.status(200).json({ success: true, data: result });
		} catch (err) {
			res.status(400).json({
				success: false,
				msg: err.message,
			});

			console.error(err.message);
		}
	},
};

export default controllers;
