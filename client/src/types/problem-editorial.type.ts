import { Problem } from './problem.type';
import { User } from './user.type';

export interface ProblemEditorial {
	id: string;
	creator: User;
	content: string;
	problem: Problem;
}
