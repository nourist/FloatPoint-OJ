import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateBlogCommentDto, CreateBlogDto, UpdateBlogCommentDto, UpdateBlogDto } from './blog.dto';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
	constructor(private readonly blogService: BlogService) {}

	@Post()
	@UseInterceptors(FileInterceptor('thumbnail'))
	async createBlog(@UploadedFile() thumbnail: Express.Multer.File, @Body() data: CreateBlogDto) {
		return this.blogService.create(data, thumbnail);
	}

	@Get()
	async getAllBlogs() {
		return this.blogService.findAll();
	}

	@Get(':slug')
	async getBlogBySlug(@Param('slug') slug: string) {
		return this.blogService.findBySlug(slug);
	}

	@Patch(':id')
	@UseInterceptors(FileInterceptor('thumbnail'))
	async updateBlog(@Param('id') id: string, @UploadedFile() thumbnail: Express.Multer.File, @Body() data: UpdateBlogDto) {
		return this.blogService.update(id, data, thumbnail);
	}

	@Delete(':id')
	async deleteBlog(@Param('id') id: string) {
		return this.blogService.delete(id);
	}

	@Post(':blogId/comments')
	async createComment(@Param('blogId') blogId: string, @Body() createBlogCommentDto: CreateBlogCommentDto) {
		return this.blogService.createComment(blogId, createBlogCommentDto);
	}

	@Get(':blogId/comments')
	async getCommentsByBlogId(@Param('blogId') blogId: string) {
		return this.blogService.findCommentsByBlogId(blogId);
	}

	@Patch(':blogId/comments/:commentId')
	async updateComment(@Param('blogId') blogId: string, @Param('commentId') commentId: string, @Body() updateBlogCommentDto: UpdateBlogCommentDto) {
		return this.blogService.updateComment(blogId, commentId, updateBlogCommentDto);
	}

	@Delete(':blogId/comments/:commentId')
	async deleteComment(@Param('blogId') blogId: string, @Param('commentId') commentId: string) {
		return this.blogService.deleteComment(blogId, commentId);
	}
}
