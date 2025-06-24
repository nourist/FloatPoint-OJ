import httpRequest from '~/utils/httpRequest';
import useLoadingStore from '~/stores/loadingStore';
import useAuthStore from '~/stores/authStore';

export const auth = () => {
	useLoadingStore.setState({ loading: true });
	useAuthStore.setState({ isAuth: false, user: null });

	return httpRequest
		.get('/auth?admin=true')
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

export const login = (email, password, remember) => {
	useAuthStore.setState({ isAuth: false, user: null });

	return httpRequest
		.post('/auth/login', { email, password, admin: true, remember })
		.then((res) => {
			useAuthStore.setState({ user: res.data.user, isAuth: true });
			return res.data.msg;
		})
		.catch((err) => {
			throw err.response.data.msg;
		});
};

export const logout = () => {
	return httpRequest
		.post('/auth/logout')
		.then((res) => {
			useAuthStore.setState({ user: null, isAuth: false });
			return res.data.msg;
		})
		.catch((err) => {
			throw err.response.data.msg;
		});
};
