import httpRequest from '~/utils/httpRequest';

export const getContests = (options) =>
	httpRequest
		.get('/contest', { params: options })
		.then((res) => res.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getContest = (id) =>
	httpRequest
		.get(`/contest/info/${id}`)
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});
