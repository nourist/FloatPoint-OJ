import httpRequest from '~/utils/httpRequest';
import useLoadingStore from '~/stores/loadingStore';
import useAuthStore from '~/stores/authStore';

export const auth = () => {
	useLoadingStore.setState({ loading: true });
	useAuthStore.setState({ isAuth: false, user: null });

	return httpRequest
		.get('/auth')
		.then((res) => {
			useAuthStore.setState({ user: res.data.user, isAuth: true });
			useLoadingStore.setState({ loading: false });
			return res.data.msg;
		})
		.catch((err) => {
			useLoadingStore.setState({ loading: false });
			throw err.response.data.msg;
		});
};

export const login = (email, password) => {
	useLoadingStore.setState({ loading: true });
	useAuthStore.setState({ isAuth: false, user: null });

	return httpRequest
		.post('/auth/login', { email, password, admin: true })
		.then((res) => {
			useAuthStore.setState({ user: res.data.user, isAuth: true });
			useLoadingStore.setState({ loading: false });
			return res.data.msg;
		})
		.catch((err) => {
			useLoadingStore.setState({ loading: false });
			throw err.response.data.msg;
		});
};

export const logout = () => {
	useLoadingStore.setState({ loading: true });

	return httpRequest
		.post('/auth/logout')
		.then((res) => {
			useAuthStore.setState({ user: null, isAuth: false });
			useLoadingStore.setState({ loading: false });
			return res.data.msg;
		})
		.catch((err) => {
			useLoadingStore.setState({ loading: false });
			throw err.response.data.msg;
		});
};
