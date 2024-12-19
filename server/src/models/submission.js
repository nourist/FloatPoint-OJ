import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
	{
		author: {
			type: String,
			required: true,
		},
		src: {
			type: String,
			required: true,
		},
		forProblem: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			required: true,
			enum: ['c', 'c++11', 'c++14', 'c++17', 'c++20', 'python2', 'python3', 'java'],
		},
		time: {
			type: Number,
			default: 0,
		},
		memory: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			default: 'IE',
			enum: ['AC', 'WA', 'TLE', 'MLE', 'CE', 'RE', 'IE'],
		},
		point: {
			type: Number,
			default: 0,
		},
		testcase: [
			{
				type: Object,
				time: {
					type: Number,
					default: 0,
				},
				memory: {
					type: Number,
					default: 0,
				},
				status: {
					type: String,
					default: 'IE',
					enum: ['AC', 'WA', 'TLE', 'MLE', 'CE', 'RE', 'IE'],
				},
			},
		],
	},
	{
		timestamps: true,
		statics: {
			filter: async function ({ status, author, language, problem }) {
				return this.find({ status, author, language, forProblem: problem }).select('-src -testcase');
			},
		},
	},
);

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
