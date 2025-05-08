import httpRequest from '~/utils/httpRequest';

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
