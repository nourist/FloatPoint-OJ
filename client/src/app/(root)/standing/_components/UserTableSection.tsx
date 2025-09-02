import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import useSWR from 'swr';

import { createClientService } from '~/lib/service-client';
import { userServiceInstance } from '~/services/user';
import { User } from '~/types/user.type';
import { SearchFilter } from './SearchFilter';
import { UserTable } from './UserTable';

interface UserTableSectionProps {
	search: string;
	onSearchChange: (search: string) => void;
	page: number;
	limit: number;
	onPageChange: (page: number) => void;
	onSizeChange: (size: number) => void;
}

export const UserTableSection = ({
	search,
	onSearchChange,
	page,
	limit,
	onPageChange,
	onSizeChange,
}: UserTableSectionProps) => {
	const t = useTranslations('standing');

	// SWR data fetching for paginated table (always sorted by rating for consistency)
	const userService = createClientService(userServiceInstance);
	const { data, error, isLoading } = useSWR(['users-table', search, page, limit], () =>
		userService.getUsers({
			sortBy: 'rating',
			sortOrder: 'DESC',
			q: search || undefined,
			page,
			limit,
		}),
	);

	return (
		<div className="rounded-2xl border bg-card p-6 shadow-xs">
			<div className="mb-4 flex items-center gap-2">
				<Users className="h-5 w-5" />
				<h2 className="text-xl font-semibold">{t('all_users')}</h2>
			</div>
			<SearchFilter search={search} onSearchChange={onSearchChange} />
			<UserTable
				users={data?.users || []}
				isLoading={isLoading}
				error={error}
				totalItems={data?.total || 0}
				page={page}
				limit={limit}
				onPageChange={onPageChange}
				onSizeChange={onSizeChange}
			/>
		</div>
	);
};