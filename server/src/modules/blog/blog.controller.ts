import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { BlogPaginationQueryDto, CreateBlogCommentDto, CreateBlogDto, UpdateBlogCommentDto, UpdateBlogDto } from './blog.dto';
import { BlogService } from './blog.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('blog')
export class BlogController {
	constructor(private readonly blogService: BlogService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('thumbnail'))
	async createBlog(@UploadedFile() thumbnail: Express.Multer.File, @Body() data: CreateBlogDto, @GetUser() user: User) {
		return {
			message: 'Create blog',
			blog: await this.blogService.create(data, thumbnail, user),
		};
	}

	@Get()
	async getAllBlogs(@Query() query: BlogPaginationQueryDto) {
		return {
			message: 'Get all blogs',
			...(await this.blogService.findAll(query)),
		};
	}

	@Get(':slug')
	async getBlogBySlug(@Param('slug') slug: string) {
		return {
			message: 'Get blog by slug',
			blog: await this.blogService.findBySlug(slug),
		};
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('thumbnail'))
	async updateBlog(@Param('id') id: string, @UploadedFile() thumbnail: Express.Multer.File, @Body() data: UpdateBlogDto, @GetUser() user: User) {
		return {
			message: 'Update blog',
			blog: await this.blogService.update(id, data, thumbnail, user),
		};
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard)
	async deleteBlog(@Param('id') id: string, @GetUser() user: User) {
		await this.blogService.delete(id, user);
		return {
			message: 'Delete blog',
		};
	}

	@Post(':blogId/comments')
	@UseGuards(JwtAuthGuard)
	async createComment(@Param('blogId') blogId: string, @Body() createBlogCommentDto: CreateBlogCommentDto, @GetUser() user: User) {
		return {
			message: 'Create comment',
			comment: await this.blogService.createComment(blogId, createBlogCommentDto, user),
		};
	}

	@Get(':blogId/comments')
	async getCommentsByBlogId(@Param('blogId') blogId: string) {
		return {
			message: 'Get comments by blog id',
			comments: await this.blogService.findCommentsByBlogId(blogId),
		};
	}

	@Patch(':blogId/comments/:commentId')
	@UseGuards(JwtAuthGuard)
	async updateComment(@Param('blogId') blogId: string, @Param('commentId') commentId: string, @Body() updateBlogCommentDto: UpdateBlogCommentDto, @GetUser() user: User) {
		return {
			message: 'Update comment',
			comment: await this.blogService.updateComment(blogId, commentId, updateBlogCommentDto, user),
		};
	}

	@Delete(':blogId/comments/:commentId')
	@UseGuards(JwtAuthGuard)
	async deleteComment(@Param('blogId') blogId: string, @Param('commentId') commentId: string, @GetUser() user: User) {
		await this.blogService.deleteComment(blogId, commentId, user);
		return {
			message: 'Delete comment',
		};
	}
}
