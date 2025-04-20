import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
			unique: true,
		},
		tags: [String],
		public: {
			type: Boolean,
			default: true,
		},
		contest: [String],
		point: {
			type: Number,
			default: 100,
		},
		timeLimit: {
			type: Number,
			default: 1,
		},
		memoryLimit: {
			type: Number,
			default: 256,
		},
		difficulty: {
			type: String,
			enum: ['easy', 'medium', 'hard'],
			default: 'medium',
		},
		noOfSubm: {
			type: Number,
			default: 0,
		},
		noOfSuccess: {
			type: Number,
			default: 0,
		},
		task: {
			type: String,
			default: '',
		},
		testcase: [
			{
				type: Object,
				stdin: {
					type: String,
					required: true,
				},
				stdout: {
					type: String,
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
		statics: {
			filterAndSort: async function ({ tags = [], q = '', sortBy, order, difficulty }) {
				const regex = new RegExp(q, 'i');

				const data = await this.find({
					$or: [
						{
							id: {
								$regex: regex,
							},
						},
						{
							name: {
								$regex: regex,
							},
						},
					],
				})
					.sort({ [sortBy || 'name']: typeof order === 'string' ? Number(order) : order || 1 })
					.select('-testcase -_id -__v');

				return data.filter(
					(problem) => (tags.length == 0 || tags.every((tag) => problem.tags.includes(tag))) && (!difficulty || (difficulty && problem.difficulty == difficulty)),
				);
			},
		},
	},
);

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
