'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { TableCell, TableRow } from '~/components/ui/table';
import UserAvatar from '~/components/user-avatar';
import type { User } from '~/types/user.type';

interface UserTableRowProps {
	user: User;
}

const UserTableRow = ({ user }: UserTableRowProps) => {
	const t = useTranslations('admin.user');

	return (
		<TableRow className="hover:bg-muted/50">
			<TableCell>
				<UserAvatar user={user} className="size-8 rounded-full" />
			</TableCell>
			<TableCell>
				<Link href={`/admin/user/${user.username}`} className="font-medium transition-all hover:text-blue-600 hover:underline dark:hover:text-blue-400">
					{user.username}
				</Link>
			</TableCell>
			<TableCell className="text-muted-foreground">{user.fullname || '-'}</TableCell>
			<TableCell className="text-muted-foreground">{user.email}</TableCell>
			<TableCell>
				<span
					className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
						user.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
					}`}
				>
					{user.role}
				</span>
			</TableCell>
			<TableCell>{user.rating?.length > 0 ? user.rating[user.rating.length - 1] : 0}</TableCell>
			<TableCell>{user.rating?.length > 0 ? user.rating.reduce((a, b) => a + b, 0) : 0}</TableCell>
			<TableCell>
				<span
					className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
						user.isVerified
							? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
							: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
					}`}
				>
					{user.isVerified ? t('table.verified_yes') : t('table.verified_no')}
				</span>
			</TableCell>
		</TableRow>
	);
};

export default UserTableRow;
