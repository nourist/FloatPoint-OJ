'use client';

import { Calendar, Search, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';

import { ContestSearch } from './_components/contest-search';
import PaginationControls from '~/components/pagination-controls';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createClientService } from '~/lib/service-client';
import { authServiceInstance } from '~/services/auth';
import { contestServiceInstance } from '~/services/contest';
import { ContestStatus, getContestStatus } from '~/types/contest.type';

const ContestPage = () => {
	const t = useTranslations('contest.page');
	const locale = useLocale();
	const [activeTab, setActiveTab] = useState<ContestStatus>(ContestStatus.RUNNING);
	const [searchQuery, setSearchQuery] = useState('');
	const [page, setPage] = useState(1);
	const [limit] = useState(20);

	const contestService = createClientService(contestServiceInstance);
	const { getProfile } = createClientService(authServiceInstance);

	const { data: user } = useSWR('/auth/me', getProfile, {
		revalidateOnFocus: false,
		shouldRetryOnError: false,
	});

	// SWR hook for data fetching
	const { data, error, isLoading } = useSWR(
		{
			page,
			limit,
			search: searchQuery || undefined,
			status: activeTab,
		},
		async ({ page, limit, search, status }) => {
			const response = await contestService.findAllContests({
				page,
				limit,
				search,
				status,
			});
			return {
				contests: response.contests?.data || [],
				total: response.contests?.meta?.total || 0,
			};
		},
		{
			keepPreviousData: true,
			revalidateOnFocus: false,
		},
	);

	const contests = data?.contests || [];
	const totalItems = data?.total || 0;

	// Helper functions
	const getStatusBadgeClass = (status: ContestStatus) => {
		switch (status) {
			case ContestStatus.RUNNING:
				return '!bg-green-100 !text-green-800 dark:!bg-green-900 dark:!text-green-300';
			case ContestStatus.PENDING:
				return '!bg-blue-100 !text-blue-800 dark:!bg-blue-900 dark:!text-blue-300';
			case ContestStatus.ENDED:
				return '!bg-gray-100 !text-gray-800 dark:!bg-gray-800 dark:!text-gray-300';
			default:
				return '!bg-gray-100 !text-gray-800 dark:!bg-gray-800 dark:!text-gray-300';
		}
	};

	const getStatusText = (status: ContestStatus) => {
		switch (status) {
			case ContestStatus.RUNNING:
				return t('running');
			case ContestStatus.PENDING:
				return t('upcoming');
			case ContestStatus.ENDED:
				return t('ended');
			default:
				return status;
		}
	};

	const formatDate = (dateString: string | Date) => {
		return new Date(dateString).toLocaleString(locale, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	if (!data && !isLoading) {
		throw error;
	}

	return (
		<div className="space-y-6">
			{/* Header with Tabs and Search */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				{/* Tabs */}
				<div className="flex-shrink-0">
					<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContestStatus)}>
						<TabsList className="grid w-full grid-cols-3 sm:w-auto">
							<TabsTrigger value={ContestStatus.RUNNING} className="flex items-center gap-1.5 px-3 text-xs sm:text-sm">
								<div className="h-2 w-2 rounded-full bg-green-500" />
								{t('running')}
							</TabsTrigger>
							<TabsTrigger value={ContestStatus.PENDING} className="flex items-center gap-1.5 px-3 text-xs sm:text-sm">
								<div className="h-2 w-2 rounded-full bg-blue-500" />
								{t('upcoming')}
							</TabsTrigger>
							<TabsTrigger value={ContestStatus.ENDED} className="flex items-center gap-1.5 px-3 text-xs sm:text-sm">
								<div className="h-2 w-2 rounded-full bg-gray-500" />
								{t('ended')}
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{/* Search */}
				<ContestSearch 
					searchQuery={searchQuery} 
					onSearchChange={(query) => {
						setSearchQuery(query);
						setPage(1);
					}} 
				/>
			</div>

			{/* Contest List */}
			{isLoading ? (
				<div className="space-y-4">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-32 w-full rounded-2xl" />
					))}
				</div>
			) : contests.length === 0 ? (
				<div className="bg-card rounded-2xl border p-12 text-center shadow-xs">
					<div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
						<Calendar className="text-muted-foreground h-6 w-6" />
					</div>
					<h3 className="mb-2 text-lg font-semibold">{t('no_contests')}</h3>
					<p className="text-muted-foreground">{t('no_contests_description')}</p>
				</div>
			) : (
				<div className="space-y-6">
					{contests.map((contest) => {
						const status = getContestStatus(contest);
						const isUserJoined = !!user && user.joiningContest?.id === contest?.id;

						return (
							<div key={contest.id} className="bg-card rounded-2xl border p-6 shadow-xs">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<div className="mb-3">
											<Link href={`/contest/${contest.slug}`}>
												<h3 className="hover:text-primary cursor-pointer text-lg font-semibold transition-colors hover:underline">{contest.title}</h3>
											</Link>
										</div>

										<div className="text-muted-foreground flex flex-col gap-3 text-sm sm:flex-row">
											<div className="flex items-center gap-1.5">
												<Calendar className="h-4 w-4" />
												<span>
													{formatDate(contest.startTime)} - {formatDate(contest.endTime)}
												</span>
											</div>
											<div className="flex items-center gap-1.5">
												<Users className="h-4 w-4" />
												<span>{t('participants', { count: contest.participants?.length || 0 })}</span>
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge className={getStatusBadgeClass(status)}>{getStatusText(status)}</Badge>
										{contest.isRated && (
											<Badge variant="outline" className="border-yellow-600 text-yellow-600 dark:border-yellow-500 dark:text-yellow-400">
												{t('rated')}
											</Badge>
										)}
										{isUserJoined && (
											<Badge variant="outline" className="border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-600 dark:bg-sky-900/30 dark:text-sky-400">
												{t('joining')}
											</Badge>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Pagination */}
			{contests.length > 0 && <PaginationControls totalItems={totalItems} onPageChange={(newPage) => setPage(newPage)} />}
		</div>
	);
};

export default ContestPage;