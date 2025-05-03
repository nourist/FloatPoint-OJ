import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
			unique: true,
		},
		fullname: {
			type: String,
			default: null,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		permission: {
			type: String,
			enum: ['Member', 'Admin'],
			default: 'Member',
		},
		joiningContest: {
			type: String,
			default: null,
		},
		joinedContest: [String],
		totalScore: {
			type: Number,
			default: 0,
		},
		totalAC: {
			type: Number,
			default: 0,
		},
		totalAttempt: {
			type: Number,
			default: 0,
		},
		defaultLanguage: {
			type: String,
			default: 'c++17',
		},
		avatar: String,
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{
		timestamps: true,
		statics: {
			filterAndSort: function ({ q = '', permission, sortBy, order }) {
				const regex = new RegExp(q, 'i');

				return this.find({
					$and: [
						{
							$or: [{ name: { $regex: regex } }, { fullname: { $regex: regex } }],
						},
						{
							permission,
						},
					],
				})
					.select('-resetPasswordToken -verificationToken -isVerified -password -email')
					.sort({ [sortBy]: order || 1 });
			},
		},
	},
);

const User = mongoose.model('User', userSchema);
export default User;
