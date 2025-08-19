import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { v4 as uuidv4 } from 'uuid';

import { BlogComment } from '../../entities/blog-comment.entity';
import { Blog } from '../../entities/blog.entity';
import { MinioService } from '../minio/minio.service';
import { NotificationService } from '../notification/notification.service';
import { BlogPaginationQueryDto, CreateBlogCommentDto, CreateBlogDto, UpdateBlogCommentDto, UpdateBlogDto } from './blog.dto';
import { User } from 'src/entities/user.entity';

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
	async create(createBlogDto: CreateBlogDto, thumbnail: Express.Multer.File, user: User) {
		let thumbnailUrl: string | null = null;
		const id = uuidv4();
		const slug = slugify(createBlogDto.title, { lower: true });

		if (await this.isSlugExists(slug)) {
			throw new BadRequestException('Slug already exists');
		}

		if (thumbnail) {
			const bucketName = 'thumbnails';
			const fileName = `${id}.${thumbnail.originalname.split('.').pop()}`;
			await this.minioService.saveFile(bucketName, fileName, thumbnail.buffer);
			thumbnailUrl = `/${bucketName}/${fileName}`;
		}

		const blog = this.blogRepository.create({ ...createBlogDto, id, slug, thumbnailUrl, author: user });
		const savedBlog = await this.blogRepository.save(blog);
		await this.notificationService.createNewBlogNotification(savedBlog);
		return savedBlog;
	}

	async findAll(query: BlogPaginationQueryDto) {
		const page = query.page || 1;
		const size = query.size || 10;
		const [blogs, total] = await this.blogRepository.findAndCount({
			order: { createdAt: 'DESC' },
			take: size,
			skip: (page - 1) * size,
			relations: ['author'],
		});
		return { blogs, total, page, size };
	}

	async findBySlug(slug: string) {
		const blog = await this.blogRepository.findOne({ where: { slug } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}
		return blog;
	}

	@Transactional()
	async update(id: string, updateBlogDto: UpdateBlogDto, thumbnail: Express.Multer.File, user: User) {
		const blog = await this.blogRepository.findOne({ where: { id } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		if (blog.author.id !== user.id) {
			throw new UnauthorizedException('Unauthorized');
		}

		let thumbnailUrl: string | null = blog.thumbnailUrl;

		if (thumbnail) {
			const bucketName = 'thumbnails';
			const fileName = `${blog.id}.${thumbnail.originalname.split('.').pop()}`;

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
	async delete(id: string, user: User) {
		const blog = await this.blogRepository.findOne({ where: { id } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		if (blog.author.id !== user.id) {
			throw new UnauthorizedException('Unauthorized');
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

	async createComment(blogId: string, createBlogCommentDto: CreateBlogCommentDto, user: User) {
		const blog = await this.blogRepository.findOne({ where: { id: blogId } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		const blogComment = this.blogCommentRepository.create({ ...createBlogCommentDto, blog, user });
		return this.blogCommentRepository.save(blogComment);
	}

	async findCommentsByBlogId(blogId: string) {
		return this.blogCommentRepository.find({ where: { blog: { id: blogId } } });
	}

	async updateComment(blogId: string, commentId: string, updateBlogCommentDto: UpdateBlogCommentDto, user: User) {
		const blog = await this.blogRepository.findOne({ where: { id: blogId } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		const blogComment = await this.blogCommentRepository.findOne({ where: { id: commentId, blog: { id: blogId } } });
		if (!blogComment) {
			throw new NotFoundException('Blog comment not found');
		}

		if (blogComment.user.id !== user.id) {
			throw new UnauthorizedException('Unauthorized');
		}

		Object.assign(blogComment, updateBlogCommentDto);
		return this.blogCommentRepository.save(blogComment);
	}

	async deleteComment(blogId: string, commentId: string, user: User) {
		const blog = await this.blogRepository.findOne({ where: { id: blogId } });
		if (!blog) {
			throw new NotFoundException('Blog not found');
		}

		const blogComment = await this.blogCommentRepository.findOne({ where: { id: commentId, blog: { id: blogId } } });
		if (!blogComment) {
			throw new NotFoundException('Blog comment not found');
		}

		if (blogComment.user.id !== user.id) {
			throw new UnauthorizedException('Unauthorized');
		}

		await this.blogCommentRepository.remove(blogComment);
	}
}
