import axios from 'axios';
import { addAxiosDateTransformer } from 'axios-date-transformer';

const http = addAxiosDateTransformer(
	axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
		withCredentials: true,
	}),
);

http.interceptors.response.use(
	(res) => res.data,
	(err) => Promise.reject(err.response?.data),
);

export default http;
