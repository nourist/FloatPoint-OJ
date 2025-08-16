import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
				verifyURL: `${clientUrl}/verify-endpoint?token=${verificationToken}`,
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
				resetPasswordURL: `${clientUrl}/reset-password?token=${resetPasswordToken}`,
			},
		});

		this.logger.log(`Reset password email sent to ${email}`);
	}
}
