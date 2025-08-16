import http from '~/lib/http';
import { User } from '~/types/user.type';

type VerifyEmailResponse = {
	email: string;
};

type SigninResponse = {
	message: string;
	user: User;
};

type GetMeResponse = {
	message: string;
	user: User;
};

export const getMe = () => http.get<GetMeResponse>('/auth').then((res) => res.user);

export const signup = (data: { email: string; password: string; username: string }) => http.post('/auth/signup', data);

export const signin = (data: { email: string; password: string }) => http.post<SigninResponse>('/auth/signin', data).then((res) => res.user);

export const signout = () => http.post('/auth/signout');

export const verifyEmail = (token: string) => http.post<VerifyEmailResponse>('/auth/verify-email', { token }).then((res) => res.email);

export const resendVerificationEmail = (email: string) => http.post('/auth/resend-verification-email', { email });

export const forgotPassword = (email: string) => http.post('/auth/forgot-password', { email });

export const resetPassword = (data: { token: string; password: string }) => http.post('/auth/reset-password', data);

export const googleSignin = (idToken: string) => http.post<SigninResponse>('/auth/google-signin', { idToken }).then((res) => res.user);

export const logout = () => http.post('/auth/logout');
