import axios, { AxiosResponse } from 'axios';
import { addAxiosDateTransformer } from 'axios-date-transformer';
import qs from 'qs';

import { getClientApiUrl } from './utils';
import { ApiInstance } from '~/types/axios.type';

const http = addAxiosDateTransformer(
	axios.create({
		baseURL: getClientApiUrl(),
		withCredentials: true,
		paramsSerializer: {
			serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
			// arrayFormat: "repeat" => tags=a&tags=b
			// arrayFormat: "brackets" => tags[]=a&tags[]=b (default axios)
			// arrayFormat: "indices" => tags[0]=a&tags[1]=b
			// arrayFormat: "comma" => tags=a,b
		},
	}),
) as ApiInstance;

http.interceptors.response.use(
	<T>(res: AxiosResponse<T>) => res.data,
	(err) => Promise.reject(err.response?.data),
);

export default http;
