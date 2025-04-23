import httpRequest from '~/utils/httpRequest';

export const getProblems = async (options) => {
	try {
		const res = await httpRequest.get('/problem', { params: options });
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
		// return err.response;
	}
};

export const getProblem = async (id) => {
	try {
		const res = await httpRequest.get(`/problem/info/${id}`);
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
		// return err.response;
	}
};

export const getTags = async () => {
	try {
		const res = await httpRequest.get('/problem/tags');
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
		// return err.response;
	}
};

export const getLanguages = async () => {
	try {
		const res = await httpRequest.get('/problem/languages');
		return res.data;
	} catch (err) {
		console.error(err);
		throw err;
		// return err.response;
	}
};
