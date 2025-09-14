import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { ForgotPasswordDto, ResendVerificationEmailDto, ResetPasswordDto, SigninDto, SignupDto, VerifyEmailDto } from './auth.dto';
import { AuthService } from './auth.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { clearAuthCookie, setAuthCookie } from 'src/modules/auth/auth.utils';
import { JwtPayload } from 'src/types/jwt-payload.type';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	getProfile(@GetUser() user: User) {
		return {
			message: 'Get user profile successfully',
			user,
		};
	}

	@Post('signup')
	async signup(@Body() userData: SignupDto) {
		await this.authService.signup(userData);

		return { message: 'Signup successful' };
	}

	@Post('resend-verification-email')
	async resendVerificationEmail(@Body() { email }: ResendVerificationEmailDto) {
		await this.authService.resendVerificationEmail(email);
		return { message: 'Verification email sent successfully' };
	}

	@Post('verify-email')
	async verifyEmail(@Body() { token }: VerifyEmailDto) {
		return { message: 'Email verified successfully', email: (await this.authService.verifyEmail(token)).email };
	}

	@Post('forgot-password')
	async forgotPassword(@Body() { email }: ForgotPasswordDto) {
		await this.authService.forgotPassword(email);
		return { message: 'Reset password email sent successfully' };
	}

	@Post('reset-password')
	async resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
		await this.authService.resetPassword(token, newPassword);
		return { message: 'Password reset successfully' };
	}

	@Post('signin')
	@UseGuards(LocalAuthGuard)
	async signin(@Body() signinInfo: SigninDto, @Res({ passthrough: true }) res: Response) {
		const { access_token, user } = await this.authService.signin(signinInfo);

		setAuthCookie(res, access_token);

		return { message: 'Signin successful', user };
	}

	@Post('google-signin')
	@UseGuards(GoogleAuthGuard)
	async googleSignin(@GetUser() userInfo: JwtPayload, @Res({ passthrough: true }) res: Response) {
		const { access_token, user } = await this.authService.signin(userInfo);

		setAuthCookie(res, access_token);

		return { message: 'Signin successful', user };
	}

	@Post('signout')
	signout(@Res({ passthrough: true }) res: Response) {
		clearAuthCookie(res);

		return { message: 'Signout successful' };
	}
}
