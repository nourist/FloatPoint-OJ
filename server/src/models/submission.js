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
		},
		result: {
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
				required: true,
			},
			point: {
				type: Number,
				default: 0,
			},
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
					required: true,
				},
			},
		],
	},
	{ timestamps: true },
);

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
