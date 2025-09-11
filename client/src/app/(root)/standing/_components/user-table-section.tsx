'use client';

import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useSWR from 'swr';

import { SearchFilter } from './search-filter';
import { UserTable } from './user-table';
import PaginationControls from '~/components/pagination-controls';
import { createClientService } from '~/lib/service-client';
import { userServiceInstance } from '~/services/user';

export const UserTableSection = () => {
	const t = useTranslations('standing');

	// State management
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);

	// SWR data fetching for paginated table (always sorted by rating for consistency)
	const userService = createClientService(userServiceInstance);
	const { data, error, isLoading } = useSWR(
		['users-table', search, page, limit],
		() =>
			userService.getUsers({
				sortBy: 'rating',
				sortOrder: 'DESC',
				q: search || undefined,
				page,
				limit,
			}),
		{
			keepPreviousData: true,
		},
	);

	if (error) {
		throw error;
	}

	const handleSearchChange = (newSearch: string) => {
		setSearch(newSearch);
		setPage(1);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleSizeChange = (newLimit: number) => {
		setLimit(newLimit);
		setPage(1);
	};

	return (
		<div className="bg-card rounded-2xl border p-6 shadow-xs">
			<div className="mb-4 flex items-center gap-2">
				<Users className="h-5 w-5" />
				<h2 className="text-xl font-semibold">{t('all_users')}</h2>
			</div>
			<SearchFilter search={search} onSearchChange={handleSearchChange} />
			<UserTable users={data?.users || []} isLoading={isLoading && !data} page={page} limit={limit} />
			{/* Pagination */}
			<PaginationControls
				className="mt-6"
				totalItems={data?.total || 0}
				initialPage={page}
				initialSize={limit}
				onPageChange={handlePageChange}
				onSizeChange={handleSizeChange}
			/>
		</div>
	);
};