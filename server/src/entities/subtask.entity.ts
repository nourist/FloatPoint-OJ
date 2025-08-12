import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Problem } from './problem.entity';
import { TestCase } from './test-case.entity';

@Entity('subtasks')
@Unique(['problem', 'slug'])
export class Subtask {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Problem, (problem) => problem.subtasks, { onDelete: 'CASCADE' })
	@JoinColumn()
	problem: Problem;

	@Column({ type: 'varchar', length: 255 })
	name: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	slug: string;

	@OneToMany(() => TestCase, (testCase) => testCase.subtask)
	testCases: TestCase[];
}
