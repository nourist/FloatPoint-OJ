import { Controller, ForbiddenException, Get, Param, Query, UseGuards } from '@nestjs/common';

import { GetAllSubmissionsDto } from './submission.dto';
import { SubmissionService } from './submission.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User, UserRole } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('submission')
export class SubmissionController {
	constructor(private readonly submissionService: SubmissionService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	async findAll(@Query() query: GetAllSubmissionsDto, @GetUser() user: User) {
		return {
			message: 'success',
			...(await this.submissionService.findAll(query, user)),
		};
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	async findOne(@Param('id') id: string, @GetUser() user: User) {
		const submission = await this.submissionService.findOne(id);

		if (submission.author.id !== user.id && user.role !== UserRole.ADMIN) {
			throw new ForbiddenException();
		}

		return {
			message: 'success',
			submission,
		};
	}
}
