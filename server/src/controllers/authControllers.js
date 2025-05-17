import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

import { getTop, getTopPercent } from '../utils/user.js';
import User from '../models/user.js';
import { generateTokenAndSetCookie, generateVerificationCode } from '../utils/auth.js';
import { sendResetPasswordRequestEmail, sendResetPasswordSuccessEmail, sendVerificationEmail, sendWellcomeEmail } from '../mail/emails.js';
import Contest from '../models/contest.js';

const authControllers = {
	//[POST] /auth/signup
	async signup(req, res, next) {
		const { email, password, name } = req.body;

		try {
			if (!email || !password || !name) {
				throw new Error('All fields are required');
			}

			const userAlreadyExists = await User.findOne({ email });

			if (userAlreadyExists) {
				throw new Error('User already exists');
			}

			const hashedPassword = await bcryptjs.hash(password, Number(process.env.HASH_SALT));

			const user = new User({
				email,
				name,
				password: hashedPassword,
			});

			await generateVerificationCode(user);

			await sendVerificationEmail(user.email, user.verificationToken);

			res.status(201).json({
				success: true,
				msg: 'User created successfully',
				user: {
					...user._doc,
					_id: undefined,
					password: undefined,
					resetPasswordToken: undefined,
					verificationToken: undefined,
				},
			});

			console.log(`User ${user._id} created successfully`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in create user: ${err.message}`);
		}
	},

	//[POST] /auth/re-send-verify
	async reSendVerificationCode(req, res, next) {
		const { email } = req.body;

		try {
			if (!email) {
				throw new Error('Email field are required');
			}

			const user = await User.findOne({ email });

			if (!user) {
				throw new Error('User does not exist');
			}

			if (user.isVerified) {
				throw new Error('User already verified');
			}

			await generateVerificationCode(user);

			await sendVerificationEmail(user.email, user.verificationToken);

			res.status(200).json({ success: true, msg: 'Verification code sent to your email' });

			console.log(`Re-send verification code successfully, email: ${user.email}`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in re-send verification code: ${err.message}`);
		}
	},

	//[POST] /auth/verify-email/:code
	async verifyEmail(req, res, next) {
		const { code } = req.params;

		try {
			const user = await User.findOne({
				verificationToken: code,
			});

			if (!user) {
				throw new Error('Invalid verification code');
			}

			if (user.verificationTokenExpiresAt < Date.now()) {
				throw new Error('Expired verification code');
			}

			user.isVerified = true;
			user.verificationToken = undefined;
			user.verificationTokenExpiresAt = undefined;
			await user.save();

			await sendWellcomeEmail(user.email, user.name);

			res.status(200).json({
				success: true,
				msg: 'Email verified successfully',
			});

			console.log(`Email ${user.email} verified successfully`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in verification email: ${err.message}`);
		}
	},

	//[GET] /auth/login
	async login(req, res, next) {
		const { email, password, admin, remember = true } = req.body;

		try {
			if (!email || !password) {
				throw new Error('All fields are required');
			}

			const user = await User.findOne({ email });

			if (admin && user.permission !== 'Admin') {
				throw new Error('You are not Admin');
			}

			if (!user) {
				throw new Error('User does not exist');
			}

			const isPasswordValid = await bcryptjs.compare(password, user.password);

			if (!isPasswordValid) {
				throw new Error('Password not valid');
			}

			if (!user.isVerified) {
				throw new Error("User doesn't verified");
			}

			generateTokenAndSetCookie(res, user._id, remember);

			user.lastLogin = new Date();
			await user.save();

			const top = await getTop(user.name);
			const topPercent = await getTopPercent(user.name);

			res.status(200).json({
				success: true,
				msg: 'Logged in successfully',
				user: {
					...user._doc,
					top,
					topPercent,
					_id: undefined,
					password: undefined,
					resetPasswordToken: undefined,
					verificationToken: undefined,
				},
			});

			console.log(`User ${user._id} logged in successfully`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in login: ${err.message}`);
		}
	},

	//[POST] /auth/logout
	logout(req, res, next) {
		res.clearCookie('token');
		res.status(200).json({ success: true, msg: 'Logged out successfully' });

		console.log('User logged out successfully');
	},

	//[POST] /auth/forgot-password
	async forgotPassword(req, res, next) {
		const { email } = req.body;

		try {
			if (!email) {
				throw new Error('Email field are required');
			}

			const user = await User.findOne({ email });

			if (!user) {
				throw new Error('User does not exist');
			}

			const resetToken = crypto.randomBytes(20).toString('hex');
			const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

			user.resetPasswordToken = resetToken;
			user.resetPasswordExpiresAt = resetTokenExpiresAt;

			await user.save();

			await sendResetPasswordRequestEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

			res.status(200).json({ success: true, msg: 'Password reset link sent to your email' });

			console.log(`Password reset link sent to email: ${user.email}`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in send password reset link: ${err.message}`);
		}
	},

	//[POST] /auth/reset-password/:token
	async resetPassword(req, res, next) {
		const { token } = req.params;
		const { password } = req.body;

		try {
			const user = await User.findOne({
				resetPasswordToken: token,
				resetPasswordExpiresAt: { $gt: Date.now() },
			});

			if (!user) {
				throw new Error('Invalid or expired reset token');
			}

			const hashedPassword = await bcryptjs.hash(password, Number(process.env.HASH_SALT));

			user.password = hashedPassword;
			user.resetPasswordToken = undefined;
			user.resetPasswordExpiresAt = undefined;
			await user.save();

			await sendResetPasswordSuccessEmail(user.email);

			res.status(200).json({ success: true, msg: 'Password reset successful' });

			console.log(`Password reset successful`);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in reset password: ${err.message}`);
		}
	},

	//[GET] /auth
	async getSelfInfo(req, res, next) {
		const { admin } = req.query;

		try {
			const user = await User.findById(req.userId);

			if (!user) {
				throw new Error('User does not exist');
			}

			if (admin && user.permission !== 'Admin') {
				throw new Error('You are not Admin');
			}

			if (user.joiningContest) {
				const contest = await Contest.findOne({ id: user.joiningContest });
				if (contest && contest.endTime < Date.now()) {
					user.joiningContest = null;
				}
			}

			user.lastLogin = Date.now();
			await user.save();

			const top = await getTop(user.name);
			const topPercent = await getTopPercent(user.name);

			res.status(200).json({
				success: true,
				user: {
					...user._doc,
					top,
					topPercent,
					_id: undefined,
					password: undefined,
					resetPasswordToken: undefined,
					verificationToken: undefined,
				},
			});

			console.log(`Success get user ${user._id} info `);
		} catch (err) {
			res.status(400).json({ success: false, msg: err.message });

			console.error(`Error in get user info: ${err.message}`);
		}
	},
};

export default authControllers;
