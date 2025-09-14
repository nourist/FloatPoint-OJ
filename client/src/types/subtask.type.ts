import { Problem } from './problem.type';
import { TestCase } from './test-case.type';

export interface Subtask {
	id: string;
	problem: Problem;
	name: string;
	slug: string;
	testCases: TestCase[];
}
