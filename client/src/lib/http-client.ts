import axios, { AxiosResponse } from 'axios';
import { addAxiosDateTransformer } from 'axios-date-transformer';

import { getApiUrl } from './utils';
import { ApiInstance } from '~/types/axios.type';

const http = addAxiosDateTransformer(
	axios.create({
		baseURL: getApiUrl(),
		withCredentials: true,
	}),
) as ApiInstance;

http.interceptors.response.use(
	<T>(res: AxiosResponse<T>) => res.data,
	(err) => Promise.reject(err.response?.data),
);

export default http;
