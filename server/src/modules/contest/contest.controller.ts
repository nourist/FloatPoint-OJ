import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { AddProblemsDto, CreateContestDto, QueryContestDto, UpdateContestDto } from './contest.dto';
import { ContestService } from './contest.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { User, UserRole } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/guards/optional-jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('contest')
export class ContestController {
	constructor(private readonly contestService: ContestService) {}

	@Post()
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async create(@Body() createContestDto: CreateContestDto, @GetUser() user: User) {
		return {
			message: 'success',
			contest: await this.contestService.create(createContestDto, user),
		};
	}

	@Get()
	async findAll(@Query() query: QueryContestDto) {
		return {
			message: 'success',
			contests: await this.contestService.findAll(query),
		};
	}

	@Get(':slug')
	@UseGuards(OptionalJwtAuthGuard)
	async findOne(@Param('slug') slug: string) {
		return {
			message: 'success',
			contest: await this.contestService.findOne(slug),
		};
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateContestDto: UpdateContestDto, @GetUser() user: User) {
		return {
			message: 'success',
			contest: await this.contestService.update(id, updateContestDto, user),
		};
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async remove(@Param('id', ParseUUIDPipe) id: string) {
		await this.contestService.remove(id);
		return {
			message: 'success',
		};
	}

	@Post(':id/join')
	@UseGuards(JwtAuthGuard)
	async join(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
		await this.contestService.join(id, user);
		return {
			message: 'success',
		};
	}

	@Post(':id/leave')
	@UseGuards(JwtAuthGuard)
	async leave(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
		await this.contestService.leave(id, user);
		return {
			message: 'success',
		};
	}

	@Post(':id/problems')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async addProblems(@Param('id', ParseUUIDPipe) id: string, @Body() addProblemsDto: AddProblemsDto, @GetUser() user: User) {
		return {
			message: 'success',
			contest: await this.contestService.addProblems(id, addProblemsDto, user),
		};
	}

	@Delete(':id/problems/:problemId')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async removeProblem(@Param('id', ParseUUIDPipe) id: string, @Param('problemId', ParseUUIDPipe) problemId: string, @GetUser() user: User) {
		return {
			message: 'success',
			contest: await this.contestService.removeProblem(id, problemId, user),
		};
	}

	@Post(':id/start')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async start(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
		return {
			message: 'success',
			contest: await this.contestService.start(id, user),
		};
	}

	@Post(':id/stop')
	@UseGuards(JwtAuthGuard, RoleGuard)
	@Roles(UserRole.ADMIN)
	async stop(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
		return {
			message: 'success',
			contest: await this.contestService.stop(id, user),
		};
	}

	@Get(':id/standings')
	async getStandings(@Param('id', ParseUUIDPipe) id: string) {
		return {
			message: 'success',
			...(await this.contestService.getStandings(id)),
		};
	}
}
