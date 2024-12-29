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
			},
		],
	},
	{ timestamps: true },
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
		return (
			y.score.reduce((a, b) => a + b, 0) - x.score.reduce((a, b) => a + b, 0) ||
			y.time.reduce((a, b) => a + b, 0) - x.time.reduce((a, b) => a + b, 0)
		);
	});

	next();
});

const Contest = mongoose.model('Contest', contestSchema);
export default Contest;
