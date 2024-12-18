import {
	WELLCOME_TEMPLATE,
	VERIFICATION_TEMPLATE,
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
} from './emailTemplate.js';
import { sender, mailtrapClient } from './mailtrap.js';

export const sendWellcomeEmail = async (email, username) => {
	try {
		const res = await mailtrapClient.send({
			from: sender,
			to: [{ email }],
			subject: 'Wellcome to floatpoint',
			html: WELLCOME_TEMPLATE.replace('{username}', username).replace('{clientUrl}', process.env.CLIENT_URL),
			category: 'Wellcome email',
		});

		console.log('Wellcome email sent successfully', res);
	} catch (err) {
		console.error(`Error sending wellcome`, err);

		throw new Error(`Error sending wellcome email: ${err}`);
	}
};

export const sendVerificationEmail = async (email, code) => {
	try {
		const res = await mailtrapClient.send({
			from: sender,
			to: [{ email }],
			subject: 'Verify your email',
			html: VERIFICATION_TEMPLATE.replace('{verificationCode}', code),
			category: 'Email Verification',
		});

		console.log('Verification email sent successfully', res);
	} catch (err) {
		console.error(`Error sending verification`, err);

		throw new Error(`Error sending verification email: ${err}`);
	}
};

export const sendResetPasswordRequestEmail = async (email, resetURL) => {
	try {
		const res = await mailtrapClient.send({
			from: sender,
			to: [{ email }],
			subject: 'Reset your password',
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
			category: 'Password reset',
		});

		console.log('Reset password request email sent successfully', res);
	} catch (err) {
		console.error(`Error sending reset password request`, err);

		throw new Error(`Error sending reset password request email: ${err}`);
	}
};

export const sendResetPasswordSuccessEmail = async (email) => {
	try {
		const res = await mailtrapClient.send({
			from: sender,
			to: [{ email }],
			subject: 'Reset your password',
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: 'Password reset',
		});

		console.log('Reset password success email sent successfully', res);
	} catch (err) {
		console.error(`Error sending reset password request`, err);

		throw new Error(`Error sending reset password request email: ${err}`);
	}
};
