import { Judger } from '../types/judger.type';
import { ApiInstance } from '~/types/axios.type';

// Responses
export interface JudgersResponse {
	message: string;
	judgers: Judger[];
}

// Functions
export const judgerServiceInstance = (http: ApiInstance) => ({
	getAllJudgers: () => {
		return http.get<JudgersResponse>('/judger').then((res) => res.judgers);
	},
});