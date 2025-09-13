import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Problem } from './problem.entity';

@Entity('problem_tags')
export class ProblemTag {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	name: string;

	@ManyToMany(() => Problem, (problem) => problem.tags)
	problems: Problem[];
}
