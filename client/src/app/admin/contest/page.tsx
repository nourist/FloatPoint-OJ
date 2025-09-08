'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import useSWR from 'swr';

import PaginationControls from '~/components/pagination-controls';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createClientService } from '~/lib/service-client';
import { contestServiceInstance } from '~/services/contest';
import { ContestStatus, getContestStatus } from '~/types/contest.type';

const AdminContestPage = () => {
	const t = useTranslations('admin.contest.page');
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
				return 'bg-green-100 text-green-800';
			case ContestStatus.PENDING:
				return 'bg-yellow-100 text-yellow-800';
			case ContestStatus.ENDED:
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
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

			<Input placeholder={t('search_placeholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" />

			{isLoading ? (
				<div className="p-8 text-center">{t('loading')}</div>
			) : error ? (
				<div className="p-8 text-center text-red-500">{t('error_loading')}</div>
			) : contests.length === 0 ? (
				// According to the specification, show nothing when there are no contests
				<></>
			) : (
				<>
					{contests.map((contest) => {
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
										{new Date(contest.startTime).toLocaleString()} - {new Date(contest.endTime).toLocaleString()}
									</p>
								</div>
								<div className="flex items-center gap-2">
									<span className={`rounded-full px-3 py-1 text-sm ${getStatusBadgeClass(status)}`}>{getStatusBadgeText(status)}</span>
									<span className="bg-muted rounded-full px-3 py-1 text-sm">{contest.isRated ? t('rated') : t('unrated')}</span>
								</div>
							</Link>
						);
					})}
				</>
			)}

			{contests.length > 0 && <PaginationControls totalItems={totalItems} onPageChange={(newPage) => setPage(newPage)} />}
		</>
	);
};

export default AdminContestPage;
