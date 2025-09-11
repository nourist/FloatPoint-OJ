import { Body, Controller, Get, Param, Patch, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { GetUsersDto, UpdateNotificationSettingsDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
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
}
