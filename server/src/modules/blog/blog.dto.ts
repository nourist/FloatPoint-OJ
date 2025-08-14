import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBlogDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	content: string;
}

export class UpdateBlogDto {
	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	content?: string;
}

export class CreateBlogCommentDto {
	@IsString()
	@IsNotEmpty()
	content: string;

	@IsUUID()
	@IsNotEmpty()
	blogId: string;
}

export class UpdateBlogCommentDto {
	@IsString()
	@IsOptional()
	content?: string;
}
