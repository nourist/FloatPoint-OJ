'use client';

import { Activity, CheckCircle, Code, RefreshCw, Server, TrendingUp, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

import ContestParticipationChart from './_components/charts/contest-participation-chart';
import LanguageDistributionChart from './_components/charts/language-distribution-chart';
import ProblemDifficultyChart from './_components/charts/problem-difficulty-chart';
import SubmissionResultsChart from './_components/charts/submission-results-chart';
import SubmissionVolumeChart from './_components/charts/submission-volume-chart';
import UserActivityChart from './_components/charts/user-activity-chart';
import { DashboardSkeleton } from './_components/loading-skeleton';
import MetricCard from './_components/metric-card';
import PopularProblemsTable from './_components/tables/popular-problems-table';
import TopUsersTable from './_components/tables/top-users-table';
import { Button } from '~/components/ui/button';
import { createClientService } from '~/lib/service-client';
import { statisticsServiceInstance } from '~/services/statistics';

const Dashboard = () => {
	const t = useTranslations('admin.dashboard');
	const { getOverview, getLanguageDistribution, getSubmissionResults, getProblemDifficulty, getTopUsers, getPopularProblems } = createClientService(statisticsServiceInstance);

	// Fetch data with error handling and refresh interval for real-time data
	const {
		data: overview,
		isLoading: overviewLoading,
		error: overviewError,
	} = useSWR('/statistics/overview', getOverview, {
		errorRetryCount: 3,
	});
	const { data: languageDistribution, isLoading: languageDistributionLoading } = useSWR('/statistics/language-distribution', () => getLanguageDistribution('30d'));
	const { data: submissionResults, isLoading: submissionResultsLoading } = useSWR('/statistics/submission-results', () => getSubmissionResults('30d'));
	const { data: problemDifficulty, isLoading: problemDifficultyLoading } = useSWR('/statistics/problem-difficulty', getProblemDifficulty);
	const { data: topUsers, isLoading: topUsersLoading } = useSWR('/statistics/top-users', () => getTopUsers(10, '7d'));
	const { data: popularProblems, isLoading: popularProblemsLoading } = useSWR('/statistics/popular-problems', () => getPopularProblems(10, '30d'));

	// Handle errors
	const isAnyError = overviewError;
	const isMainDataLoading = overviewLoading;

	// Show error if critical data fails
	if (isAnyError) {
		throw isAnyError;
	}

	// Show skeleton for initial load
	if (isMainDataLoading) {
		return <DashboardSkeleton />;
	}

	return (
		<div className="space-y-4">
			{/* Header Section - Key Metrics Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
				<MetricCard title={t('total_users')} value={overview?.total_users ?? 0} icon={Users} />
				<MetricCard title={t('active_today')} value={overview?.active_users_today ?? 0} icon={Activity} />
				<MetricCard title={t('total_submissions')} value={overview?.total_submissions ?? 0} icon={TrendingUp} />
				<MetricCard title={t('success_rate')} value={overview?.success_rate ? `${overview.success_rate}%` : '0%'} icon={CheckCircle} />
				<MetricCard title={t('active_problems')} value={overview?.active_problems ?? 0} icon={Code} />
			</div>

			{/* Row 1: Activity Overview */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<UserActivityChart />
				<SubmissionVolumeChart />
			</div>

			{/* Row 2: Submission Analytics */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<LanguageDistributionChart data={languageDistribution?.data ?? []} isLoading={languageDistributionLoading} />
				<SubmissionResultsChart data={submissionResults?.data ?? []} isLoading={submissionResultsLoading} />
			</div>

			{/* Row 3: Problem & Contest Stats */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<ProblemDifficultyChart data={problemDifficulty?.data ?? []} isLoading={problemDifficultyLoading} />
				<ContestParticipationChart />
			</div>

			{/* Bottom Section: Activity Tables */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<TopUsersTable data={topUsers?.data ?? []} isLoading={topUsersLoading} />
				<PopularProblemsTable data={popularProblems?.data ?? []} isLoading={popularProblemsLoading} />
			</div>
		</div>
	);
};

export default Dashboard;
