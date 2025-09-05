import { Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Skeleton } from '~/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
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
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-16">{t('table.rank')}</TableHead>
						<TableHead>{t('table.user')}</TableHead>
						<TableHead className="text-right">{t('table.rating')}</TableHead>
						<TableHead className="text-right">{t('table.score')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: limit }).map((_, i) => (
						<TableRow key={i}>
							<TableCell className="font-medium">
								<Skeleton className="h-4 w-8" />
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-3">
									<Skeleton className="h-10 w-10 rounded-full" />
									<div className="space-y-1">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-3 w-32" />
									</div>
								</div>
							</TableCell>
							<TableCell className="text-right">
								<Skeleton className="ml-auto h-4 w-16" />
							</TableCell>
							<TableCell className="text-right">
								<Skeleton className="ml-auto h-4 w-16" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	}

	if (!users || users.length === 0) {
		return (
			<div className="py-8 text-center">
				<Users className="text-muted-foreground mx-auto mb-2 h-12 w-12" />
				<p className="text-muted-foreground">{t('no_data')}</p>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-16">{t('table.rank')}</TableHead>
					<TableHead>{t('table.user')}</TableHead>
					<TableHead className="text-right">{t('table.rating')}</TableHead>
					<TableHead className="text-right">{t('table.score')}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user, index) => {
					const rank = (page - 1) * limit + index + 1;
					const ratingValue = user.rating.length > 0 ? user.rating[user.rating.length - 1] : 0;
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const scoreValue = (user as any).score || 0;
					return (
						<TableRow key={user.id}>
							<TableCell className="font-medium">#{rank}</TableCell>
							<TableCell>
								<Link href={`/profile/${user.username}`} className="group">
									<div className="flex items-center gap-3">
										<Avatar className="h-8 w-8">
											<AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
											<AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
										</Avatar>
										<div>
											<p className="font-medium group-hover:underline">
												{user.username}
												{user.fullname && <span className="text-muted-foreground font-normal"> ({user.fullname})</span>}
											</p>
										</div>
									</div>
								</Link>
							</TableCell>
							<TableCell className="text-right font-mono">{Math.round(ratingValue)}</TableCell>
							<TableCell className="text-right font-mono">{Math.round(scoreValue)}</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
};
