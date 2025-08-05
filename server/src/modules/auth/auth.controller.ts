import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { SigninDto, SignupDto, VerifyEmailDto, ResendVerificationEmailDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { JwtPayload } from 'src/types/jwt-payload.type';
import { setAuthCookie, clearAuthCookie } from 'src/modules/auth/auth-cookie.utils';
import { User } from 'src/entities/user.entity';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

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
		await this.authService.verifyEmail(token);
		return { message: 'Email verified successfully' };
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
