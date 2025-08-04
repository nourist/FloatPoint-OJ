import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);

	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
	) {}

	async sendVerifyEmail(email: string, verificationToken: string) {
		const clientUrl = this.configService.get<string>('CLIENT_URL');

		await this.mailerService.sendMail({
			to: email,
			subject: 'Verify Your Email',
			template: 'verify-email',
			context: {
				verifyURL: `${clientUrl}/auth/verify-email?token=${verificationToken}`,
			},
		});

		this.logger.log(`Verify email sent to ${email}`);
	}

	async sendResetPasswordEmail(email: string, resetPasswordToken: string) {
		const clientUrl = this.configService.get<string>('CLIENT_URL');

		await this.mailerService.sendMail({
			to: email,
			subject: 'Reset Your Password',
			template: 'reset-password',
			context: {
				resetPasswordURL: `${clientUrl}/auth/reset-password?token=${resetPasswordToken}`,
			},
		});

		this.logger.log(`Reset password email sent to ${email}`);
	}
}
