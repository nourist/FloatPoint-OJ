import axios, { AxiosResponse } from 'axios';
import { addAxiosDateTransformer } from 'axios-date-transformer';
import { cookies } from 'next/headers';

import { ApiInstance } from '~/types/axios.type';

export const createServerApiInstance = async (): Promise<ApiInstance> => {
	const cookieStore = await cookies();

	const instance = addAxiosDateTransformer(
		axios.create({
			baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
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
