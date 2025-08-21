import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

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

export class BlogPaginationQueryDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number = 1;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	size?: number = 10;
}
