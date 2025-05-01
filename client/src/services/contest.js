import httpRequest from '~/utils/httpRequest';

export const getContests = async (options) => {
	try {
		const res = await httpRequest.get('/contest', { params: options });
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};

export const joinContest = async (id) => {
	try {
		const res = await httpRequest.post(`/contest/join/${id}`);
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
