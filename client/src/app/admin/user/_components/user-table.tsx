'use client';

import { useTranslations } from 'next-intl';

import UserTableRow from './user-table-row';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import type { User } from '~/types/user.type';

interface UserTableProps {
	users: User[];
	isLoading: boolean;
}

const UserTable = ({ users, isLoading }: UserTableProps) => {
	const t = useTranslations('admin.user');

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>{t('table.avatar')}</TableHead>
					<TableHead>{t('table.username')}</TableHead>
					<TableHead>{t('table.fullname')}</TableHead>
					<TableHead>{t('table.email')}</TableHead>
					<TableHead>{t('table.role')}</TableHead>
					<TableHead>{t('table.rating')}</TableHead>
					<TableHead>{t('table.score')}</TableHead>
					<TableHead>{t('table.verified')}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{isLoading ? (
					Array.from({ length: 5 }).map((_, index) => (
						<TableRow key={index}>
							<TableCell className="space-y-2">
								<div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
							</TableCell>
							<TableCell>
								<div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							</TableCell>
							<TableCell>
								<div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							</TableCell>
							<TableCell>
								<div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							</TableCell>
							<TableCell>
								<div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							</TableCell>
							<TableCell>
								<div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							</TableCell>
							<TableCell>
								<div className="h-4 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							</TableCell>
							<TableCell>
								<div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
							</TableCell>
						</TableRow>
					))
				) : users.length > 0 ? (
					users.map((user) => <UserTableRow key={user.id} user={user} />)
				) : (
					<TableRow>
						<TableCell colSpan={8} className="text-muted-foreground py-8 text-center">
							{t('no_users_found')}
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default UserTable;
