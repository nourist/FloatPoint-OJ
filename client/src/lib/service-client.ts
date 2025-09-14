import http from './http-client';
import { ApiInstance } from '~/types/axios.type';

export const createClientService = <T>(callback: (_http: ApiInstance) => T) => {
	return callback(http);
};
