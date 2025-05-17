import httpRequest from '~/utils/httpRequest';

export const getStat = (day) =>
	httpRequest
		.get(`/stat`, { params: { day } })
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});
