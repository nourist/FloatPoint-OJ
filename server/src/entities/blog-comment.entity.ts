import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Blog } from './blog.entity';
import { User } from './user.entity';

@Entity('blog_comments')
export class BlogComment {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 255 })
	content: string;

	@ManyToOne(() => User, (user) => user.comments)
	user: User;

	@ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
	blog: Blog;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt: Date;
}
