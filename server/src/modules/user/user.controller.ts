import { Controller, Get, Param, Query } from '@nestjs/common';

import { GetUsersDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

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
