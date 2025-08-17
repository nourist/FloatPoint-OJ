import { Subtask } from './subtask.type';

export interface TestCase {
	id: string;
	subtask: Subtask;
	name: string;
	slug: string;
}
