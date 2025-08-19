import axios, { AxiosResponse } from 'axios';
import { addAxiosDateTransformer } from 'axios-date-transformer';
import { cookies } from 'next/headers';

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
		}),
	) as ApiInstance;

	instance.interceptors.response.use(
		<T>(res: AxiosResponse<T>) => res.data,
		(err) => Promise.reject(err.response?.data),
	);

	return instance;
};
