import httpRequest from '~/utils/httpRequest';

export const getSubmissions = async (options) => {
	try {
		const res = await httpRequest.get('/submission', { params: options });
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
		// return err.response;
	}
};

export const getStatistic = async () => {
	try {
		const res = await httpRequest.get('/submission/statistic');
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
	}
};
