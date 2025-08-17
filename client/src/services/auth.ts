import http from '../lib/http';
import { User } from '../types/user.type';

export interface SignupPayload {
	email: string;
	password: string;
	username: string;
}

export interface SigninPayload {
	email: string;
	password: string;
}

export interface ResendVerificationEmailPayload {
	email: string;
}

export interface VerifyEmailPayload {
	token: string;
}

export interface ForgotPasswordPayload {
	email: string;
}

export interface ResetPasswordPayload {
	token: string;
	newPassword: string;
}

export interface GoogleSigninPayload {
	idToken: string;
}

export interface ProfileResponse {
	message: string;
	user: User;
}

export interface AuthResponse {
	message: string;
	user: User;
}

export interface SimpleMessageResponse {
	message: string;
}

export interface VerifyEmailResponse {
	message: string;
	email: string;
}

export const getProfile = () => {
	return http.get<ProfileResponse>('/auth').then((res) => res.user);
};

export const signup = (payload: SignupPayload) => {
	return http.post<SimpleMessageResponse>('/auth/signup', payload);
};

export const resendVerificationEmail = (payload: ResendVerificationEmailPayload) => {
	return http.post<SimpleMessageResponse>('/auth/resend-verification-email', payload);
};

export const verifyEmail = (payload: VerifyEmailPayload) => {
	return http.post<VerifyEmailResponse>('/auth/verify-email', payload);
};

export const forgotPassword = (payload: ForgotPasswordPayload) => {
	return http.post<SimpleMessageResponse>('/auth/forgot-password', payload);
};

export const resetPassword = (payload: ResetPasswordPayload) => {
	return http.post<SimpleMessageResponse>('/auth/reset-password', payload);
};

export const signin = (payload: SigninPayload) => {
	return http.post<AuthResponse>('/auth/signin', payload).then((res) => res.user);
};

export const googleSignin = (payload: GoogleSigninPayload) => {
	return http.post<AuthResponse>('/auth/google-signin', payload).then((res) => res.user);
};

export const signout = () => {
	return http.post<SimpleMessageResponse>('/auth/signout');
};
