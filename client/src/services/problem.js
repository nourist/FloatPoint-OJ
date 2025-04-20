import httpRequest from '~/utils/httpRequest';

export const getProblems = async (options) => {
	try {
		const res = await httpRequest.get('/problem', { params: options });
		return res.data;
	} catch (err) {
		console.error(err);
		return err.response;
	}
};
