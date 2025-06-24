import httpRequest from '~/utils/httpRequest';

export const getUsers = (params) =>
	httpRequest
		.get('/user', { params })
		.then((res) => res.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const deleteUser = (name) =>
	httpRequest
		.delete(`/user/delete/${name}`)
		.then((res) => res.data.msg)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getUser = (name) =>
	httpRequest
		.get(`/user/info/${name}`)
		.then((res) => res.data)
		.catch((err) => {
			throw err.response.data.msg;
		});
