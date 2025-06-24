import httpRequest from '~/utils/httpRequest';

export const getStat = (day) =>
	httpRequest
		.get(`/stat`, { params: { day } })
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getWeeklySubmissions = (day) =>
	httpRequest
		.get('/stat/weekly-submission', { params: { day } })
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getWeeklyAccepted = (day) =>
	httpRequest
		.get('/stat/weekly-accepted', { params: { day } })
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getMonthlySubmissions = (day) =>
	httpRequest
		.get('/stat/monthly-submission', { params: { day } })
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getMonthlyLanguages = (day) =>
	httpRequest
		.get('/stat/monthly-language', { params: { day } })
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getNewestActivities = () =>
	httpRequest
		.get('/stat/newest-activity')
		.then((res) => res.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getProblemStat = (id) =>
	httpRequest
		.get(`/stat/problem/${id}`)
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});

export const getDailySubmissions = (day) =>
	httpRequest
		.get('/stat/daily-submission', { params: { day } })
		.then((res) => res.data.data)
		.catch((err) => {
			throw err.response.data.msg;
		});
