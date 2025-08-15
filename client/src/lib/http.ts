import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { addAxiosDateTransformer } from 'axios-date-transformer';

interface ApiInstance extends AxiosInstance {
	get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
	post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
	put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
	delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const http = addAxiosDateTransformer(
	axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
		withCredentials: true,
	}) as ApiInstance,
);

http.interceptors.response.use(
	<T>(res: AxiosResponse<T>) => res.data,
	(err) => Promise.reject(err.response?.data),
);

export default http;
