import { Controller, Get, Query } from '@nestjs/common';

import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('overview')
	getOverview() {
		return this.statisticsService.getOverview();
	}

	@Get('user-activity')
	getUserActivity(@Query('period') period: '7d' | '30d' | '90d') {
		return this.statisticsService.getUserActivity(period);
	}

	@Get('submission-volume')
	getSubmissionVolume(@Query('period') period: '7d' | '30d' | '90d') {
		return this.statisticsService.getSubmissionVolume(period);
	}

	@Get('language-distribution')
	getLanguageDistribution(@Query('period') period: '7d' | '30d' | 'all') {
		return this.statisticsService.getLanguageDistribution(period);
	}

	@Get('submission-results')
	getSubmissionResults(@Query('period') period: '7d' | '30d' | 'all') {
		return this.statisticsService.getSubmissionResults(period);
	}

	@Get('problem-difficulty')
	getProblemDifficulty() {
		return this.statisticsService.getProblemDifficulty();
	}

	@Get('contest-participation')
	getContestParticipation(@Query('period') period: '3m' | '6m' | '1y') {
		return this.statisticsService.getContestParticipation(period);
	}

	@Get('top-users')
	getTopUsers(@Query('limit') limit: number, @Query('period') period: '7d' | '30d') {
		return this.statisticsService.getTopUsers(limit, period);
	}

	@Get('popular-problems')
	getPopularProblems(@Query('limit') limit: number, @Query('period') period: '30d') {
		return this.statisticsService.getPopularProblems(limit, period);
	}
}
