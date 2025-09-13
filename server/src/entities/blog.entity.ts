import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { BlogComment } from './blog-comment.entity';
import { User } from './user.entity';

@Entity('blogs')
export class Blog {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	title: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	slug: string;

	@Column({ type: 'text' })
	content: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	thumbnailUrl: string | null;

	@ManyToOne(() => User, (user) => user.blogs)
	@JoinColumn()
	author: User;

	@OneToMany(() => BlogComment, (blogComment) => blogComment.blog)
	comments: BlogComment[];

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
