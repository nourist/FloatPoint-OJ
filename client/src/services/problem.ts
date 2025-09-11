import { ProblemEditorial } from '../types/problem-editorial.type';
import { Difficulty, IOMode, Problem, ProblemScoringMethod } from '../types/problem.type';
import { Subtask } from '../types/subtask.type';
import { TestCase } from '../types/test-case.type';
import { ApiInstance } from '~/types/axios.type';

// Payloads
export interface CreateProblemPayload {
	title: string;
	statement: string;
	timeLimit: number;
	memoryLimit: number;
	point: number;
	ioMode: IOMode;
	inputFile: string | null;
	outputFile: string | null;
	scoringMethod: ProblemScoringMethod;
	difficulty: Difficulty;
	tags: string[];
}

export type UpdateProblemPayload = Partial<CreateProblemPayload>;

export interface GetAllProblemsPayload {
	minPoint?: number;
	maxPoint?: number;
	difficulty?: Difficulty;
	tags?: string[];
	q?: string;
	page?: number;
	limit?: number;
	sortBy?: 'title' | 'point' | 'difficulty' | 'acCount' | 'acRate';
	order?: 'ASC' | 'DESC';
	hasEditorial?: boolean;
}

export interface CreateProblemEditorialPayload {
	content: string;
}

export type UpdateProblemEditorialPayload = Partial<CreateProblemEditorialPayload>;

export interface CreateSubtaskPayload {
	name: string;
}

export type UpdateSubtaskPayload = Partial<CreateSubtaskPayload>;

export interface CreateTestCasePayload {
	name: string;
	input: string;
	output: string;
}

export type UpdateTestCasePayload = Partial<CreateTestCasePayload>;

// Responses
export interface ProblemsResponse {
	message: string;
	problems: Problem[];
	total: number;
}

export interface ProblemResponse {
	message: string;
	problem: Problem;
}

export interface EditorialResponse {
	message: string;
	editorial: ProblemEditorial;
}

export interface SubtasksResponse {
	message: string;
	subtasks: Subtask[];
}

export interface SubtaskResponse {
	message: string;
	subtask: Subtask;
}

export interface TestCaseResponse {
	message: string;
	testcase: TestCase & { input: string; output: string };
}

export interface SimpleMessageResponse {
	message: string;
}

export interface TagsResponse {
	message: string;
	tags: { id: string; name: string }[];
}

export interface MaxPointResponse {
	message: string;
	maxPoint: number;
}

export interface MinPointResponse {
	message: string;
	minPoint: number;
}

// Functions
export const problemServiceInstance = (http: ApiInstance) => ({
	findAllProblems: (params: GetAllProblemsPayload) => {
		return http.get<ProblemsResponse>('/problem', { params });
	},

	getProblemBySlug: (slug: string) => {
		return http.get<ProblemResponse>(`/problem/${slug}`);
	},

	getEditorial: (slug: string) => {
		return http.get<EditorialResponse>(`/problem/${slug}/editorial`);
	},

	getMinPoint: () => {
		return http.get<MinPointResponse>('/problem/min-point').then((res) => res.minPoint);
	},

	getMaxPoint: () => {
		return http.get<MaxPointResponse>('/problem/max-point').then((res) => res.maxPoint);
	},

	getAllTags: () => {
		return http
			.get<TagsResponse>('/problem/tags')
			.then((res) => res.tags)
			.then((res) => res.map((item) => item.name));
	},

	createProblem: (payload: CreateProblemPayload) => {
		return http.post<ProblemResponse>('/problem', payload);
	},

	updateProblem: (id: string, payload: UpdateProblemPayload) => {
		return http.patch<ProblemResponse>(`/problem/${id}`, payload);
	},

	deleteProblem: (id: string) => {
		return http.delete<SimpleMessageResponse>(`/problem/${id}`);
	},

	createEditorial: (problemId: string, payload: CreateProblemEditorialPayload) => {
		return http.post<EditorialResponse>(`/problem/${problemId}/editorial`, payload);
	},

	updateEditorial: (problemId: string, payload: UpdateProblemEditorialPayload) => {
		return http.patch<EditorialResponse>(`/problem/${problemId}/editorial`, payload);
	},

	deleteEditorial: (problemId: string) => {
		return http.delete<SimpleMessageResponse>(`/problem/${problemId}/editorial`);
	},

	getAllSubtasks: (problemId: string) => {
		return http.get<SubtasksResponse>(`/problem/${problemId}/subtasks`);
	},

	getSubtask: (problemId: string, subtaskSlug: string) => {
		return http.get<SubtaskResponse>(`/problem/${problemId}/subtasks/${subtaskSlug}`);
	},

	createSubtask: (problemId: string, payload: CreateSubtaskPayload) => {
		return http.post<SubtaskResponse>(`/problem/${problemId}/subtasks`, payload);
	},

	updateSubtask: (problemId: string, subtaskSlug: string, payload: UpdateSubtaskPayload) => {
		return http.patch<SubtaskResponse>(`/problem/${problemId}/subtasks/${subtaskSlug}`, payload);
	},

	deleteSubtask: (problemId: string, subtaskSlug: string) => {
		return http.delete<SimpleMessageResponse>(`/problem/${problemId}/subtasks/${subtaskSlug}`);
	},

	getTestCaseContent: (problemId: string, subtaskSlug: string, testCaseSlug: string) => {
		return http.get<TestCaseResponse>(`/problem/${problemId}/subtasks/${subtaskSlug}/test-cases/${testCaseSlug}`);
	},

	createTestCase: (problemId: string, subtaskSlug: string, payload: CreateTestCasePayload) => {
		return http.post<TestCaseResponse>(`/problem/${problemId}/subtasks/${subtaskSlug}/test-cases`, payload);
	},

	updateTestCase: (problemId: string, subtaskSlug: string, testCaseSlug: string, payload: UpdateTestCasePayload) => {
		return http.patch<TestCaseResponse>(`/problem/${problemId}/subtasks/${subtaskSlug}/test-cases/${testCaseSlug}`, payload);
	},

	deleteTestCase: (problemId: string, subtaskSlug: string, testCaseSlug: string) => {
		return http.delete<SimpleMessageResponse>(`/problem/${problemId}/subtasks/${subtaskSlug}/test-cases/${testCaseSlug}`);
	},
});
