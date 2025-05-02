import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
			unique: true,
		},
		title: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			default: '',
		},
		startTime: {
			type: Date,
			required: true,
		},
		endTime: {
			type: Date,
			required: true,
		},
		problems: [String],
		participant: [String],
		standing: [
			{
				user: {
					type: String,
					required: true,
				},
				score: [
					{
						type: Number,
						default: null,
					},
				],
				time: [
					{
						type: Number,
						default: null,
					},
				],
				status: [
					{
						type: String,
						default: null,
					},
				],
			},
		],
	},
	{
		timestamps: true,
		statics: {
			filter: async function ({ q = '', status }) {
				const regex = new RegExp(q, 'i');

				const data = await this.find({
					$or: [
						{
							id: {
								$regex: regex,
							},
						},
						{
							title: {
								$regex: regex,
							},
						},
					],
				}).select('-_id');

				return data
					.filter((contest) => !status || (contest.startTime > Date.now() ? 'upcoming' : contest.endTime < Date.now() ? 'ended' : 'ongoing' === status))
					.map((contest) => ({
						...contest._doc,
						status: contest.startTime > Date.now() ? 'upcoming' : contest.endTime < Date.now() ? 'ended' : 'ongoing',
						duration: contest.endTime - contest.startTime,
					}));
			},
		},
	},
);

contestSchema.virtual('status').get(function () {
	return this.startTime > Date.now() ? 'upcoming' : this.endTime < Date.now() ? 'ended' : 'ongoing';
});

contestSchema.virtual('duration').get(function () {
	return this.endTime - this.startTime;
});

contestSchema.pre('save', function (next) {
	this.participant = this.standing.map((x) => x.user);

	this.standing.sort((x, y) => {
		return y.score.reduce((a, b) => a + b, 0) - x.score.reduce((a, b) => a + b, 0) || y.time.reduce((a, b) => a + b, 0) - x.time.reduce((a, b) => a + b, 0);
	});

	next();
});

const Contest = mongoose.model('Contest', contestSchema);
export default Contest;
