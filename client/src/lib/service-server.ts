import { createServerApiInstance } from './http-server';
import { ApiInstance } from '~/types/axios.type';

export const createServerService = async <T>(callback: (_http: ApiInstance) => T) => {
	return callback(await createServerApiInstance());
};
