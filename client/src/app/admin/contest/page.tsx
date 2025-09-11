'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';

import { AdminContestSearch } from './_components/admin-contest-search';
import PaginationControls from '~/components/pagination-controls';
import { Button } from '~/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createClientService } from '~/lib/service-client';
import { contestServiceInstance } from '~/services/contest';
import { ContestStatus, getContestStatus } from '~/types/contest.type';

const AdminContestPage = () => {
	const t = useTranslations('admin.contest.page');
	const locale = useLocale();
	const contestService = createClientService(contestServiceInstance);

	// State for contests and pagination
	const [activeTab, setActiveTab] = useState<ContestStatus>(ContestStatus.RUNNING);
	const [searchQuery, setSearchQuery] = useState('');
	const [page, setPage] = useState(1);
	const [limit] = useState(10);

	// SWR fetcher function
	const fetcher = async (key: { page: number; limit: number; search?: string; status?: ContestStatus }) => {
		const response = await contestService.findAllContests({
			page: key.page,
			limit: key.limit,
			search: key.search || undefined,
			status: key.status,
		});

		// Handle the response structure correctly
		// API returns: { message: 'success', contests: { data: [...], meta: {...} } }
		// Due to axios interceptor, we get the response data directly
		if (response.contests && Array.isArray(response.contests.data)) {
			return {
				contests: response.contests.data,
				totalItems: response.contests.meta?.total || 0,
			};
		} else {
			// Fallback in case the structure is different
			return {
				contests: [],
				totalItems: 0,
			};
		}
	};

	// SWR hook for data fetching
	const { data, error, isLoading } = useSWR(
		{
			page,
			limit,
			search: searchQuery || undefined,
			status: activeTab,
		},
		fetcher,
		{
			keepPreviousData: true,
			revalidateOnFocus: false,
		},
	);

	const contests = data?.contests || [];
	const totalItems = data?.totalItems || 0;

	// Get status badge class based on contest status
	const getStatusBadgeClass = (status: ContestStatus) => {
		switch (status) {
			case ContestStatus.RUNNING:
				return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
			case ContestStatus.PENDING:
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
			case ContestStatus.ENDED:
				return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
		}
	};

	// Get status badge text based on contest status
	const getStatusBadgeText = (status: ContestStatus) => {
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

	if (error) {
		throw error;
	}

	return (
		<>
			<div className="flex items-center justify-between gap-4">
				<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContestStatus)}>
					<TabsList>
						<TabsTrigger value={ContestStatus.RUNNING}>{t('running')}</TabsTrigger>
						<TabsTrigger value={ContestStatus.PENDING}>{t('upcoming')}</TabsTrigger>
						<TabsTrigger value={ContestStatus.ENDED}>{t('ended')}</TabsTrigger>
					</TabsList>
				</Tabs>
				<Button asChild>
					<Link href="/admin/contest/create">{t('create_button')}</Link>
				</Button>
			</div>

			<AdminContestSearch 
				searchQuery={searchQuery} 
				onSearchChange={(query) => {
					setSearchQuery(query);
					setPage(1); // Reset to first page when search changes
				}} 
			/>

			{isLoading ? (
				<div className="p-8 text-center">{t('loading')}</div>
			) : (
				contests.map((contest) => {
					const status = getContestStatus(contest);
					return (
						<Link
							href={`/admin/contest/${contest.slug}`}
							key={contest.id}
							className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-4"
						>
							<div>
								<h3 className="font-medium">{contest.title}</h3>
								<p className="text-muted-foreground text-sm">
									{formatDate(contest.startTime)} - {formatDate(contest.endTime)}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<span className={`rounded-full px-3 py-1 text-sm ${getStatusBadgeClass(status)}`}>{getStatusBadgeText(status)}</span>
								<span className="bg-muted rounded-full px-3 py-1 text-sm">{contest.isRated ? t('rated') : t('unrated')}</span>
							</div>
						</Link>
					);
				})
			)}
			{contests.length > 0 && <PaginationControls totalItems={totalItems} onPageChange={(newPage) => setPage(newPage)} />}
		</>
	);
};

export default AdminContestPage;