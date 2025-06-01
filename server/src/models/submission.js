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
		forContest: {
			type: String,
			default: null,
		},
		language: {
			type: String,
			required: true,
			enum: ['c', 'c11', 'c++11', 'c++14', 'c++17', 'c++20', 'python2', 'python3'],
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
			enum: ['AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE', 'IE'],
		},
		msg: Object,
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
					enum: ['AC', 'WA', 'TLE', 'MLE', 'RTE'],
				},
				msg: String,
			},
		],
	},
	{
		timestamps: true,
		statics: {
			filter: async function ({ status, author, language, problem, contest }) {
				const query = {};
				if (status) query.status = status;
				if (author) query.author = author;
				if (language) query.language = language;
				if (problem) query.forProblem = problem[0] == '#' ? problem.slice(1, problem.length) : { $regex: problem, $options: 'i' };
				if (contest) query.forContest = contest;

				return this.find(query).sort({ createdAt: -1 }).select('-src -testcase');
			},
		},
	},
);

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
