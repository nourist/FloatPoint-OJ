import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { Default } from 'src/decorators/default.decorator';

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
	@Default(1)
	page: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Default(20)
	limit: number;
}
