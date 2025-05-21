import httpRequest from '~/utils/httpRequest';

export const getProblems = (options) =>
	httpRequest
		.get('/problem', { params: options })
		.then((res) => res.data)
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
