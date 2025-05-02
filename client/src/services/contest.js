import httpRequest from '~/utils/httpRequest';
import useAuthStore from '~/stores/authStore';

export const getContests = async (options) => {
	try {
		const res = await httpRequest.get('/contest', { params: options });
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const getContest = async (id) => {
	try {
		const res = await httpRequest.get(`/contest/info/${id}`);
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const joinContest = async (id) => {
	try {
		const { reload } = useAuthStore.getState();
		const res = await httpRequest.post(`/contest/join/${id}`);
		await reload();
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const leaveContest = async () => {
	try {
		const { reload } = useAuthStore.getState();
		const res = await httpRequest.post('/contest/leave');
		await reload();
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
