import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength } from 'class-validator';

import { Trim } from 'src/decorators/trim.decorator';

export class SignupDto {
	@Trim()
	@IsNotEmpty()
	@IsString()
	@IsEmail({}, { message: 'email is not valid' })
	email: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
		minUppercase: 1,
	})
	password: string;

	@Trim()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	username: string;
}

export class SigninDto {
	@Trim()
	@IsNotEmpty()
	@IsString()
	@IsEmail({}, { message: 'email is not valid' })
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}

export class ResendVerificationEmailDto {
	@Trim()
	@IsNotEmpty()
	@IsString()
	@IsEmail({}, { message: 'email is not valid' })
	email: string;
}

export class VerifyEmailDto {
	@IsNotEmpty()
	@IsString()
	token: string;
}

export class ForgotPasswordDto {
	@Trim()
	@IsNotEmpty()
	@IsString()
	@IsEmail({}, { message: 'email is not valid' })
	email: string;
}

export class ResetPasswordDto {
	@IsNotEmpty()
	@IsString()
	token: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({
		minLength: 8,
		minLowercase: 1,
		minNumbers: 1,
		minSymbols: 1,
		minUppercase: 1,
	})
	newPassword: string;
}
