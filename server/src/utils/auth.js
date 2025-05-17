import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId, remember) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '30d', //30 days
	});

	res.cookie('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: remember ? 30 * 24 * 60 * 60 * 1000 : undefined, //30 days
	});

	return token;
};

export const generateVerificationCode = async (user) => {
	try {
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
		user.verificationToken = verificationToken;
		user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

		await user.save();

		console.log('Generate verification code successfull');
	} catch (err) {
		console.error('Error generate verification code', err);

		throw new Error(`Error generate verification code, ${err}`);
	}
};
