import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import { ProblemService } from './problem.service';
import {
	CreateProblemDto,
	UpdateProblemDto,
	CreateProblemEditorialDto,
	UpdateProblemEditorialDto,
	CreateSubtaskDto,
	UpdateSubtaskDto,
	CreateTestCaseDto,
	UpdateTestCaseDto,
} from './problem.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/entities/user.entity';

@Controller('problem')
export class ProblemController {
	constructor(private readonly problemService: ProblemService) {}

	@Get()
	async findAll() {
		return {
			message: 'success',
			problems: await this.problemService.findAll(),
		};
	}

	@Get(':slug')
	async getProblemBySlug(@Param('slug') slug: string) {
		return {
			message: 'success',
			problem: await this.problemService.getProblemBySlug(slug),
		};
	}

	@Post()
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async create(@Body() createProblemDto: CreateProblemDto, @GetUser() user: User) {
		return {
			message: 'Problem created successfully',
			problem: await this.problemService.create(createProblemDto, user),
		};
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async update(@Param('id') id: string, @Body() updateProblemDto: UpdateProblemDto) {
		return {
			message: 'Problem updated successfully',
			problem: await this.problemService.update(id, updateProblemDto),
		};
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async remove(@Param('id') id: string) {
		await this.problemService.remove(id);
		return {
			message: 'Problem deleted successfully',
		};
	}

	@Get(':id/editorial')
	async getEditorial(@Param('id') id: string) {
		return {
			message: 'success',
			editorial: await this.problemService.getProblemEditorialByProblemId(id),
		};
	}

	@Post(':id/editorial')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async createEditorial(@Param('id') id: string, @Body() createProblemEditorialDto: CreateProblemEditorialDto, @GetUser() user: User) {
		return {
			message: 'Editorial created successfully',
			editorial: await this.problemService.createEditorial(id, createProblemEditorialDto, user),
		};
	}

	@Patch(':id/editorial')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async updateEditorial(@Param('id') id: string, @Body() updateProblemEditorialDto: UpdateProblemEditorialDto) {
		return {
			message: 'Editorial updated successfully',
			editorial: await this.problemService.updateEditorial(id, updateProblemEditorialDto),
		};
	}

	@Delete(':id/editorial')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async removeEditorial(@Param('id') id: string) {
		await this.problemService.removeEditorial(id);
		return {
			message: 'Editorial deleted successfully',
		};
	}

	@Get(':id/subtasks')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async getAllSubtasks(@Param('id') id: string) {
		return {
			message: 'success',
			subtasks: await this.problemService.getAllSubtasks(id),
		};
	}

	@Get(':id/subtasks/:subtaskSlug')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async getSubtaskBySlug(@Param('id') id: string, @Param('subtaskSlug') subtaskSlug: string) {
		return {
			message: 'success',
			subtask: await this.problemService.getSubtaskBySlug(id, subtaskSlug),
		};
	}

	@Post(':id/subtasks')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async createSubtask(@Param('id') id: string, @Body() createSubtaskDto: CreateSubtaskDto) {
		return {
			message: 'Subtask created successfully',
			subtask: await this.problemService.createSubtask(id, createSubtaskDto),
		};
	}

	@Patch(':id/subtasks/:subtaskSlug')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async updateSubtask(@Param('id') id: string, @Param('subtaskSlug') subtaskSlug: string, @Body() updateSubtaskDto: UpdateSubtaskDto) {
		return {
			message: 'Subtask updated successfully',
			subtask: await this.problemService.updateSubtask(id, subtaskSlug, updateSubtaskDto),
		};
	}

	@Delete(':id/subtasks/:subtaskSlug')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async removeSubtask(@Param('id') id: string, @Param('subtaskSlug') subtaskSlug: string) {
		await this.problemService.removeSubtask(id, subtaskSlug);
		return {
			message: 'Subtask deleted successfully',
		};
	}

	@Get(':id/subtasks/:subtaskSlug/test-cases/:testCaseSlug')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async getTestCaseBySlug(@Param('id') id: string, @Param('subtaskSlug') subtaskSlug: string, @Param('testCaseSlug') testCaseSlug: string) {
		return {
			message: 'success',
			testcase: await this.problemService.getTestCaseContentBySlug(id, subtaskSlug, testCaseSlug),
		};
	}

	@Post(':id/subtasks/:subtaskSlug/test-cases')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async createTestCase(@Param('id') id: string, @Param('subtaskSlug') subtaskSlug: string, @Body() createTestCaseDto: CreateTestCaseDto) {
		return {
			message: 'Test case created successfully',
			testcase: await this.problemService.createTestCase(id, subtaskSlug, createTestCaseDto),
		};
	}

	@Patch(':id/subtasks/:subtaskSlug/test-cases/:testCaseSlug')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async updateTestCase(
		@Param('id') id: string,
		@Param('subtaskSlug') subtaskSlug: string,
		@Param('testCaseSlug') testCaseSlug: string,
		@Body() updateTestCaseDto: UpdateTestCaseDto,
	) {
		return {
			message: 'Test case updated successfully',
			testcase: await this.problemService.updateTestCase(id, subtaskSlug, testCaseSlug, updateTestCaseDto),
		};
	}

	@Delete(':id/subtasks/:subtaskSlug/test-cases/:testCaseSlug')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async removeTestCase(@Param('id') id: string, @Param('subtaskSlug') subtaskSlug: string, @Param('testCaseSlug') testCaseSlug: string) {
		await this.problemService.removeTestCase(id, subtaskSlug, testCaseSlug);
		return {
			message: 'Test case deleted successfully',
		};
	}
}
