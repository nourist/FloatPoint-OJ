import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async getUserById(id: string) {
		const user = await this.userRepository.findOneBy({ id });
		if (!user) {
			this.logger.log(`User ${id} not found`);
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async getUserByEmail(email: string) {
		const user = await this.userRepository.findOneBy({ email });
		if (!user) {
			this.logger.log(`User ${email} not found`);
			throw new NotFoundException('User not found');
		}
		return user;
	}

	async checkEmailExists(email: string) {
		const user = await this.userRepository.findOneBy({ email });
		return !!user;
	}

	async checkUsernameExists(username: string) {
		const user = await this.userRepository.findOneBy({ username });
		return !!user;
	}
}
