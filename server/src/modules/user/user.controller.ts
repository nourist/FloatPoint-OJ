import { Body, Controller, Get, Param, Patch, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { GetUsersDto, UpdateNotificationSettingsDto, UpdateUserDto } from './user.dto';
import { UserDifficultyStats, UserLanguageStats, UserRatingHistoryPoint, UserService, UserStatistics, UserSubmissionTrend } from './user.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Patch('/me')
	@UseGuards(JwtAuthGuard)
	async updateProfile(@GetUser() user: User, @Body() body: UpdateUserDto) {
		return {
			message: 'Update profile',
			user: await this.userService.updateProfile(user.id, body),
		};
	}

	@Patch('/me/avatar')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('avatar'))
	async updateAvatar(@GetUser() user: User, @UploadedFile() file: Express.Multer.File) {
		return {
			message: 'Update avatar',
			user: await this.userService.updateAvatar(user.id, file),
		};
	}

	@Patch('/me/notification-settings')
	@UseGuards(JwtAuthGuard)
	async updateNotificationSettings(@GetUser() user: User, @Body() body: UpdateNotificationSettingsDto) {
		return {
			message: 'Update notification settings',
			user: await this.userService.updateNotificationSettings(user.id, body),
		};
	}

	@Get(':username')
	async getUserByUsername(@Param('username') username: string) {
		return {
			message: 'Get user by username',
			user: await this.userService.getUserByUsername(username),
		};
	}

	@Get()
	async getUsers(@Query() getUsersDto: GetUsersDto) {
		return {
			message: 'Get users',
			...(await this.userService.getUsers(getUsersDto)),
		};
	}

	@Get(':username/score')
	async getUserScore(@Param('username') username: string) {
		const user = await this.userService.getUserByUsername(username);
		const score = await this.userService.getUserScore(user.id);
		return {
			message: 'Get user score',
			score,
		};
	}

	@Get(':username/ranking')
	async getUserRanking(@Param('username') username: string) {
		const user = await this.userService.getUserByUsername(username);
		const ranking = await this.userService.getUserRanking(user.id);
		return {
			message: 'success',
			ranking,
		};
	}

	@Get(':username/statistics')
	async getUserStatistics(@Param('username') username: string): Promise<{ message: string; statistics: UserStatistics }> {
		const user = await this.userService.getUserByUsername(username);
		const statistics = await this.userService.getUserStatistics(user.id);
		return {
			message: 'Get user statistics',
			statistics,
		};
	}

	@Get(':username/ac-problems-by-difficulty')
	async getUserAcProblemsByDifficulty(@Param('username') username: string): Promise<{ message: string; data: UserDifficultyStats[] }> {
		const user = await this.userService.getUserByUsername(username);
		const data = await this.userService.getUserAcProblemsByDifficulty(user.id);
		return {
			message: 'Get user AC problems by difficulty',
			data,
		};
	}

	@Get(':username/rating-history')
	async getUserRatingHistory(@Param('username') username: string): Promise<{ message: string; data: UserRatingHistoryPoint[] }> {
		const user = await this.userService.getUserByUsername(username);
		const data = await this.userService.getUserRatingHistory(user.id);
		return {
			message: 'Get user rating history',
			data,
		};
	}

	@Get(':username/submission-trends')
	async getUserSubmissionTrends(@Param('username') username: string): Promise<{ message: string; data: UserSubmissionTrend[] }> {
		const user = await this.userService.getUserByUsername(username);
		const data = await this.userService.getUserSubmissionTrends(user.id);
		return {
			message: 'Get user submission trends',
			data,
		};
	}

	@Get(':username/ac-submissions-by-language')
	async getUserAcSubmissionsByLanguage(@Param('username') username: string): Promise<{ message: string; data: UserLanguageStats[] }> {
		const user = await this.userService.getUserByUsername(username);
		const data = await this.userService.getUserAcSubmissionsByLanguage(user.id);
		return {
			message: 'Get user AC submissions by language',
			data,
		};
	}
}
