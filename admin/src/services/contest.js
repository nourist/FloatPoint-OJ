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

export const editContest = (id, data) =>
	httpRequest
		.post(`/contest/edit/${id}`, data)
		.then((res) => res.data.msg)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const deleteContest = (id) =>
	httpRequest
		.delete(`/contest/delete/${id}`)
		.then((res) => res.data.msg)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const createContest = (data) =>
	httpRequest
		.post('/contest/create', data)
		.then((res) => res.data.msg)
		.catch((err) => {
			throw err.response.data.msg;
		});
