import { create } from 'zustand';

import httpRequest from '~/utils/httpRequest';
import useLoadingStore from './loadingStore';

const useAuthStore = create((set) => ({
	user: null,
	isAuth: false,
	error: null,
	msg: null,
	isLoading: false,

	async getInfo() {
		useLoadingStore.setState({ isLoading: true }); //global loading state
		set({ user: null, error: null, msg: null, isLoading: true }); //self loading state

		try {
			const res = await httpRequest.get('/auth');
			set({ user: res.data.user, isAuth: true, isLoading: false });
			useLoadingStore.setState({ isLoading: false });
		} catch (err) {
			console.error(err);
			set({ /*error: err.response.data.msg,*/ isAuth: false, isLoading: false });
			useLoadingStore.setState({ isLoading: false });
		}
	},

	async reload() {
		try {
			const res = await httpRequest.get('/auth');
			set({ user: res.data.user, isAuth: true });
		} catch (err) {
			console.error(err);
			set({ /*error: err.response.data.msg,*/ isAuth: false });
		}
	},

	async login(email, password) {
		set({ user: null, error: null, msg: null, isLoading: true });

		try {
			const res = await httpRequest.post('/auth/login', { email, password });
			set({ user: res.data.user, isAuth: true, msg: res.data.msg, isLoading: false });
		} catch (err) {
			console.error(err);
			set({ error: err.response.data.msg, isAuth: false, isLoading: false });
		}
	},

	async signup(email, password, name) {
		set({ error: null, msg: null, isLoading: true });

		try {
			const res = await httpRequest.post('/auth/signup', { email, password, name });
			set({ msg: res.data.msg, isLoading: false });
		} catch (err) {
			console.error(err);
			set({ error: err.response.data.msg, isLoading: false });
		}
	},

	async logout() {
		set({ error: null, msg: null, isLoading: true });

		try {
			// eslint-disable-next-line no-unused-vars
			const res = await httpRequest.post('/auth/logout');
			set({ isAuth: false, user: null, isLoading: false /*msg: res.data.msg*/ });
		} catch (err) {
			console.error(err);
			set({ /*error: err.message,*/ isLoading: false });
		}
	},

	async verifyEmail(code) {
		set({ error: null, msg: null, isLoading: true });

		try {
			const res = await httpRequest.post(`/auth/verify-email/${code}`);
			set({ isLoading: false, msg: res.data.msg });
		} catch (err) {
			console.error(err);
			set({ error: err.response.data.msg, isLoading: false });
		}
	},

	async sendVerifyCode(email) {
		set({ error: null, msg: null, isLoading: true });

		try {
			const res = await httpRequest.post(`/auth/re-send-verify`, { email });
			set({ isLoading: false, msg: res.data.msg });
		} catch (err) {
			console.error(err);
			set({ error: err.response.data.msg, isLoading: false });
		}
	},

	async forgotPassword(email) {
		set({ error: null, msg: null, isLoading: true });

		try {
			const res = await httpRequest.post('/auth/forgot-password', { email });
			set({ isLoading: false, msg: res.data.msg });
		} catch (err) {
			console.error(err);
			set({ error: err.response.data.msg, isLoading: false });
		}
	},

	async resetPassword(token, password) {
		set({ error: null, msg: null, isLoading: true });

		try {
			const res = await httpRequest.post(`/auth/reset-password/${token}`, { password });
			set({ isLoading: false, msg: res.data.msg });
		} catch (err) {
			console.error(err);
			set({ error: err.response.data.msg, isLoading: false });
		}
	},

	clearLog() {
		set({ error: null, msg: null });
	},
}));

export default useAuthStore;
