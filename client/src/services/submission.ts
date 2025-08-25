import { ProgramLanguage, Submission, SubmissionStatus } from '../types/submission.type';
import { ApiInstance } from '~/types/axios.type';

// Statistics types
export interface StatusStatistic {
	status: SubmissionStatus;
	count: number;
}

export interface LanguageStatistic {
	language: ProgramLanguage;
	count: number;
}

// Payloads
export interface GetAllSubmissionsPayload {
	authorId?: string;
	problemId?: string;
	language?: ProgramLanguage;
	status?: SubmissionStatus;
	page?: number;
	limit?: number;
}

export interface SubmitCodePayload {
	code: string;
	language: ProgramLanguage;
	problemId: string;
}

// Responses
export interface SubmissionsResponse {
	message: string;
	submissions: Submission[];
	total: number;
	statusStatistics: StatusStatistic[];
	languageStatistics: LanguageStatistic[];
}

export interface SubmissionResponse {
	message: string;
	submission: Submission;
}

// Functions
export const submissionServiceInstance = (http: ApiInstance) => ({
	findAllSubmissions: (params: GetAllSubmissionsPayload) => {
		return http.get<SubmissionsResponse>('/submission', { params });
	},

	findOneSubmission: (id: string) => {
		return http.get<SubmissionResponse>(`/submission/${id}`);
	},

	submitCode: (payload: SubmitCodePayload) => {
		return http.post<SubmissionResponse>('/submission', payload);
	},
});
