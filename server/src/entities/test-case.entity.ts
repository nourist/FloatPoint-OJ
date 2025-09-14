import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Subtask } from './subtask.entity';

@Entity('test_cases')
@Unique(['subtask', 'slug'])
export class TestCase {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Subtask, (subtask) => subtask.testCases, { onDelete: 'CASCADE' })
	@JoinColumn()
	subtask: Subtask;

	@Column({ type: 'varchar', length: 255 })
	name: string;

	@Column({ type: 'varchar', length: 255 })
	slug: string;
}
