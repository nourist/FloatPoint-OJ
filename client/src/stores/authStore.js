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
			set({ error: err.response.data.msg, isAuth: false, isLoading: false });
			useLoadingStore.setState({ isLoading: false });
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
			set({ error: err.message, isLoading: false });
		}
	},
}));

export default useAuthStore;
