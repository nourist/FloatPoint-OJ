import { Problem } from './problem.type';

export interface ProblemTag {
	id: string;
	name: string;
	problems: Problem[];
}
