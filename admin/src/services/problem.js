import httpRequest from '~/utils/httpRequest';

export const getProblems = (options) =>
	httpRequest
		.get('/problem', { params: options })
		.then((res) => res.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getProblem = (id) =>
	httpRequest
		.get(`/problem/info/${id}`)
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getTags = () =>
	httpRequest
		.get('/problem/tags')
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const editProblem = (problemId, data) =>
	httpRequest
		.post(`/problem/edit/${problemId}`, data)
		.then((res) => res.data.msg)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const deleteProblem = (problemId) =>
	httpRequest
		.delete(`/problem/delete/${problemId}`)
		.then((res) => res.data.msg)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const createProblem = (data) =>
	httpRequest
		.post('/problem/create', data)
		.then((res) => res.data.msg)
		.catch((err) => {
			throw err.response.data.msg;
		});
