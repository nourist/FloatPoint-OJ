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
		avatar: String,
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true },
);

const User = mongoose.model('User', userSchema);
export default User;
