import httpRequest from '~/utils/httpRequest';
import useAuthStore from '~/stores/authStore';

export const getUsers = async (option) => {
	try {
		const res = await httpRequest.get('/user', { params: option });
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const getUser = async (userId) => {
	try {
		const res = await httpRequest.get(`/user/info/${userId}`);
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const editUser = async (data) => {
	try {
		const { reload } = useAuthStore.getState();
		const res = await httpRequest.post(`/user/edit`, data);
		await reload();
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const changeAvatar = async (img) => {
	try {
		const { reload } = useAuthStore.getState();
		const formData = new FormData();
		formData.append('file', img);
		const res = await httpRequest.post('/user/change-avatar', formData);
		await reload();
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
