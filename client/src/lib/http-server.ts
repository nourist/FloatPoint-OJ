import axios, { AxiosResponse } from 'axios';
import { addAxiosDateTransformer } from 'axios-date-transformer';
import { cookies } from 'next/headers';
import qs from 'qs';

import { getApiUrl } from './utils';
import { ApiInstance } from '~/types/axios.type';

export const createServerApiInstance = async (): Promise<ApiInstance> => {
	const cookieStore = await cookies();

	const instance = addAxiosDateTransformer(
		axios.create({
			baseURL: getApiUrl(),
			headers: {
				Cookie: cookieStore.toString(),
			},
			paramsSerializer: {
				serialize: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
				// arrayFormat: "repeat" => tags=a&tags=b
				// arrayFormat: "brackets" => tags[]=a&tags[]=b (default axios)
				// arrayFormat: "indices" => tags[0]=a&tags[1]=b
				// arrayFormat: "comma" => tags=a,b
			},
		}),
	) as ApiInstance;

	instance.interceptors.response.use(
		<T>(res: AxiosResponse<T>) => res.data,
		(err) => Promise.reject(err.response?.data),
	);

	return instance;
};
