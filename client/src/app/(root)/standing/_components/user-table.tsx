import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Skeleton } from '~/components/ui/skeleton';
import { User } from '~/types/user.type';

interface UserTableProps {
	users: User[];
	isLoading: boolean;
	page: number;
	limit: number;
}

export const UserTable = ({ users, isLoading, page, limit }: UserTableProps) => {
	const t = useTranslations('standing');

	if (isLoading) {
		return (
			<div className="w-full overflow-hidden rounded-2xl border shadow-xs">
				<table className="table w-full">
					<thead>
						<tr>
							<th className="w-16">{t('table.rank')}</th>
							<th>{t('table.user')}</th>
							<th className="!text-center">{t('table.rating')}</th>
							<th className="!text-center">{t('table.score')}</th>
						</tr>
					</thead>
					<tbody>
						{Array.from({ length: limit }).map((_, i) => (
							<tr key={i}>
								<td>
									<Skeleton className="h-4 w-8" />
								</td>
								<td>
									<div className="flex items-center gap-3">
										<Skeleton className="h-10 w-10 rounded-full" />
										<div className="space-y-1">
											<Skeleton className="h-4 w-24" />
											<Skeleton className="h-3 w-32" />
										</div>
									</div>
								</td>
								<td className="text-center">
									<Skeleton className="ml-auto h-4 w-16" />
								</td>
								<td className="text-center">
									<Skeleton className="ml-auto h-4 w-16" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	if (!users || users.length === 0) {
		return (
			<div className="bg-card rounded-2xl border p-12 text-center shadow-xs">
				<div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
					<Users className="text-muted-foreground h-6 w-6" />
				</div>
				<h3 className="mb-2 text-lg font-semibold">{t('no_data')}</h3>
				<p className="text-muted-foreground">No users found matching your search criteria.</p>
			</div>
		);
	}

	return (
		<div className="w-full overflow-hidden rounded-2xl border shadow-xs">
			<table className="table w-full">
				<thead>
					<tr>
						<th className="w-16">{t('table.rank')}</th>
						<th>{t('table.user')}</th>
						<th className="!text-center">{t('table.rating')}</th>
						<th className="!text-center">{t('table.score')}</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => {
						const rank = (page - 1) * limit + index + 1;
						const ratingValue = user.rating.length > 0 ? user.rating[user.rating.length - 1] : 0;
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const scoreValue = (user as any).score || 0;
						return (
							<tr key={user.id}>
								<td className="font-medium">#{rank}</td>
								<td>
									<Link href={`/profile/${user.username}`} className="group">
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8">
												<AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
												<AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium group-hover:underline hover:text-primary">
													{user.username}
													{user.fullname && <span className="text-muted-foreground font-normal"> ({user.fullname})</span>}
												</p>
											</div>
										</div>
									</Link>
								</td>
								<td className="text-center font-mono text-muted-foreground">{Math.round(ratingValue)}</td>
								<td className="text-center font-mono text-muted-foreground">{Math.round(scoreValue)}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};