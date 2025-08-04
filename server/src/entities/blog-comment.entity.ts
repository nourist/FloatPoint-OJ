import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

import { User } from './user.entity';
import { Blog } from './blog.entity';

@Entity('blog_comments')
export class BlogComment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	content: string;

	@ManyToOne(() => User, (user) => user.comments)
	user: User;

	@ManyToOne(() => Blog, (blog) => blog.comments)
	blog: Blog;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
