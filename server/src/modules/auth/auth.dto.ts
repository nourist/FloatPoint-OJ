import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class SignupDto {
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

	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	username: string;
}

export class SigninDto {
	@IsNotEmpty()
	@IsString()
	@IsEmail({}, { message: 'email is not valid' })
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;
}

export class ResendVerificationEmailDto {
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
