import { Body, Controller, ForbiddenException, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { GetAllSubmissionsDto, SubmitCodeDto } from './submission.dto';
import { SubmissionService } from './submission.service';
import { GetOptionalUser } from 'src/decorators/get-optional-user.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User, UserRole } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/guards/optional-jwt-auth.guard';

@Controller('submission')
export class SubmissionController {
	constructor(private readonly submissionService: SubmissionService) {}

	@Get()
	@UseGuards(OptionalJwtAuthGuard)
	async findAll(@Query() query: GetAllSubmissionsDto, @GetOptionalUser() user: User | null) {
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

	@Get('activity/:userId')
	@UseGuards(OptionalJwtAuthGuard)
	async getSubmissionActivity(@Param('userId') userId: string) {
		return {
			message: 'success',
			...(await this.submissionService.getSubmissionActivity(userId)),
		};
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	async submitCode(@Body() body: SubmitCodeDto, @GetUser() user: User) {
		return {
			message: 'success',
			submission: await this.submissionService.submitCode(body, user),
		};
	}
}
