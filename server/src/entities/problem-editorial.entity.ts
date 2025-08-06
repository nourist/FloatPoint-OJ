import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Problem } from './problem.entity';
import { User } from './user.entity';

@Entity('problem_editorials')
export class ProblemEditorial {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.editorials)
	@JoinColumn()
	creator: User;

	@Column({ type: 'text' })
	content: string;

	@ManyToOne(() => Problem, (problem) => problem.editorial, { onDelete: 'CASCADE' })
	@JoinColumn()
	problem: Problem;
}
