import httpRequest from '~/utils/httpRequest';

export const getSubmissions = (params) =>
	httpRequest
		.get('/submission', { params })
		.then((res) => res.data)
		.catch((err) => {
			throw err.response.data.msg;
		});
