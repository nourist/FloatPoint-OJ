import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';

import { BlogComment } from '../../entities/blog-comment.entity';
import { Blog } from '../../entities/blog.entity';
import { MinioService } from '../minio/minio.service';
import { NotificationService } from '../notification/notification.service';
import { CreateBlogCommentDto, CreateBlogDto, UpdateBlogCommentDto, UpdateBlogDto } from './blog.dto';

@Injectable()
export class BlogService {
	constructor(
		@InjectRepository(Blog)
		private readonly blogRepository: Repository<Blog>,
		@InjectRepository(BlogComment)
		private readonly blogCommentRepository: Repository<BlogComment>,
		private readonly minioService: MinioService,
		private readonly notificationService: NotificationService,
	) {}

	async isSlugExists(slug: string) {
		const blog = await this.blogRepository.findOne({ where: { slug } });
		return !!blog;
	}

	@Transactional()
	async create(createBlogDto: CreateBlogDto, thumbnail: Express.Multer.File) {
		let thumbnailUrl: string | null = null;
		const id = uuidv4();
		const slug = slugify(createBlogDto.title, { lower: true });

		if (await this.isSlugExists(slug)) {
			throw new Error('Slug already exists');
		}

		if (thumbnail) {
			const bucketName = 'thumbnails';
			const fileName = `${id}-${thumbnail.filename.split('.').pop()}`;
			await this.minioService.saveFile(bucketName, fileName, thumbnail.buffer);
			thumbnailUrl = `/${bucketName}/${fileName}`;
		}

		const blog = this.blogRepository.create({ ...createBlogDto, id, slug, thumbnailUrl });
		const savedBlog = await this.blogRepository.save(blog);
		await this.notificationService.createNewBlogNotification(savedBlog);
		return savedBlog;
	}

	async findAll() {
		return this.blogRepository.find();
	}

	async findBySlug(slug: string) {
		const blog = await this.blogRepository.findOne({ where: { slug } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}
		return blog;
	}

	@Transactional()
	async update(id: string, updateBlogDto: UpdateBlogDto, thumbnail: Express.Multer.File) {
		const blog = await this.blogRepository.findOne({ where: { id } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		let thumbnailUrl: string | null = blog.thumbnailUrl;

		if (thumbnail) {
			const bucketName = 'thumbnails';
			const fileName = `${blog.id}-${thumbnail.filename.split('.').pop()}`;

			if (blog.thumbnailUrl) {
				const oldFileName = blog.thumbnailUrl.split('/').pop();
				if (oldFileName) {
					await this.minioService.removeFile(bucketName, oldFileName);
				}
			}

			await this.minioService.saveFile(bucketName, fileName, thumbnail.buffer);
			thumbnailUrl = `/${bucketName}/${fileName}`;
		}

		Object.assign(blog, updateBlogDto);
		blog.thumbnailUrl = thumbnailUrl;

		return this.blogRepository.save(blog);
	}

	@Transactional()
	async delete(id: string) {
		const blog = await this.blogRepository.findOne({ where: { id } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		if (blog.thumbnailUrl) {
			const bucketName = 'thumbnails';
			const fileName = blog.thumbnailUrl.split('/').pop();
			if (fileName) {
				await this.minioService.removeFile(bucketName, fileName);
			}
		}

		await this.blogRepository.remove(blog);
		return { message: 'Blog deleted successfully' };
	}

	async createComment(blogId: string, createBlogCommentDto: CreateBlogCommentDto) {
		const blog = await this.blogRepository.findOne({ where: { id: blogId } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		const blogComment = this.blogCommentRepository.create({ ...createBlogCommentDto, blog });
		return this.blogCommentRepository.save(blogComment);
	}

	async findCommentsByBlogId(blogId: string) {
		return this.blogCommentRepository.find({ where: { blog: { id: blogId } } });
	}

	async updateComment(blogId: string, commentId: string, updateBlogCommentDto: UpdateBlogCommentDto) {
		const blog = await this.blogRepository.findOne({ where: { id: blogId } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		const blogComment = await this.blogCommentRepository.findOne({ where: { id: commentId, blog: { id: blogId } } });
		if (!blogComment) {
			throw new NotFoundException('Blog comment not found');
		}

		Object.assign(blogComment, updateBlogCommentDto);
		return this.blogCommentRepository.save(blogComment);
	}

	async deleteComment(blogId: string, commentId: string) {
		const blog = await this.blogRepository.findOne({ where: { id: blogId } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		const blogComment = await this.blogCommentRepository.findOne({ where: { id: commentId, blog: { id: blogId } } });
		if (!blogComment) {
			throw new NotFoundException('Blog comment not found');
		}

		await this.blogCommentRepository.remove(blogComment);
	}
}
