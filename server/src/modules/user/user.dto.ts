import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class GetUsersDto {
	@IsOptional()
	@IsString()
	q?: string;

	@IsOptional()
	@IsString()
	@IsIn(['username', 'fullName', 'rating', 'score'])
	sortBy?: 'username' | 'fullName' | 'rating' | 'score';

	@IsOptional()
	@IsString()
	@IsIn(['ASC', 'DESC'])
	sortOrder?: 'ASC' | 'DESC';

	@IsOptional()
	@IsInt()
	@Min(1)
	page: number = 1;

	@IsOptional()
	@IsInt()
	@Min(1)
	limit: number = 10;
}

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@Length(3, 20)
	username?: string;

	@IsOptional()
	@IsString()
	@Length(1, 255)
	fullname?: string;

	@IsOptional()
	@IsString()
	bio?: string;
}

export class UpdateNotificationSettingsDto {
	@IsBoolean()
	new_blog: boolean;

	@IsBoolean()
	new_problem: boolean;

	@IsBoolean()
	new_contest: boolean;

	@IsBoolean()
	update_rating: boolean;

	@IsBoolean()
	system: boolean;
}
