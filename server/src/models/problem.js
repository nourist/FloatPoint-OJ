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
		tags: [
			{
				type: String,
			},
		],
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
			required: true,
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
		examples: [
			{
				type: Object,
				input: {
					type: String,
					required: true,
				},
				output: {
					type: String,
					required: true,
				},
				explaination: {
					type: String,
				},
			},
		],
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
	{ timestamps: true },
);

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
