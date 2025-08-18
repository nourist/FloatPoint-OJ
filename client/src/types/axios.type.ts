import { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ApiInstance extends AxiosInstance {
	get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
	post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
	put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
	delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}
