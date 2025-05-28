import httpRequest from '~/utils/httpRequest';

export const getSubmissions = (params) =>
	httpRequest
		.get('/submission', { params })
		.then((res) => res.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getSubmission = (id) =>
	httpRequest
		.get(`/submission/info/${id}`)
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const deleteSubmission = (id) =>
	httpRequest
		.delete(`/submission/delete/${id}`)
		.then((res) => res.data.msg)
		.catch((err) => {
			throw err.response.data.msg;
		});
