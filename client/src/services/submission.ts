import http from '../lib/http';
import { ProgramLanguage, Submission, SubmissionStatus } from '../types/submission.type';

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
}

export interface SubmissionResponse {
	message: string;
	submission: Submission;
}

// Functions
export const findAllSubmissions = (params: GetAllSubmissionsPayload) => {
	return http.get<SubmissionsResponse>('/submission', { params });
};

export const findOneSubmission = (id: string) => {
	return http.get<SubmissionResponse>(`/submission/${id}`);
};

export const submitCode = (payload: SubmitCodePayload) => {
	return http.post<SubmissionResponse>('/submission', payload);
};
