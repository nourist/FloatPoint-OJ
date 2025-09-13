import { User } from '../types/user.type';
import { ApiInstance } from '~/types/axios.type';

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

export const authServiceInstance = (http: ApiInstance) => ({
	getProfile: () => {
		return http.get<ProfileResponse>('/auth').then((res) => res.user);
	},
	signup: (payload: SignupPayload) => {
		return http.post<SimpleMessageResponse>('/auth/signup', payload);
	},
	resendVerificationEmail: (payload: ResendVerificationEmailPayload) => {
		return http.post<SimpleMessageResponse>('/auth/resend-verification-email', payload);
	},
	verifyEmail: (payload: VerifyEmailPayload) => {
		return http.post<VerifyEmailResponse>('/auth/verify-email', payload);
	},
	forgotPassword: (payload: ForgotPasswordPayload) => {
		return http.post<SimpleMessageResponse>('/auth/forgot-password', payload);
	},
	resetPassword: (payload: ResetPasswordPayload) => {
		return http.post<SimpleMessageResponse>('/auth/reset-password', payload);
	},
	signin: (payload: SigninPayload) => {
		return http.post<AuthResponse>('/auth/signin', payload).then((res) => res.user);
	},
	googleSignin: (payload: GoogleSigninPayload) => {
		return http.post<AuthResponse>('/auth/google-signin', payload).then((res) => res.user);
	},
	signout: () => {
		return http.post<SimpleMessageResponse>('/auth/signout');
	},
});
