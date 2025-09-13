'use client';

import { Crown, Trophy, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { cn } from '~/lib/utils';

interface TopUserData {
	rank: number;
	username: string;
	fullname: string;
	solved: number;
	submissions: number;
	success_rate: string;
}

interface TopUsersTableProps {
	data: TopUserData[];
	isLoading?: boolean;
}

const TopUsersTable = ({ data, isLoading }: TopUsersTableProps) => {
	const t = useTranslations('admin.table');

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('top_users_this_week')}</CardTitle>
					<CardDescription>{t('loading')}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Crown className="h-4 w-4 text-yellow-500" />;
			case 2:
				return <Trophy className="h-4 w-4 text-gray-400" />;
			case 3:
				return <Trophy className="h-4 w-4 text-amber-600" />;
			default:
				return <User className="h-4 w-4 text-gray-500" />;
		}
	};

	const getRankBadgeColor = (rank: number) => {
		switch (rank) {
			case 1:
				return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
			case 2:
				return 'bg-gray-400/10 text-gray-700 border-gray-200';
			case 3:
				return 'bg-amber-600/10 text-amber-700 border-amber-200';
			default:
				return 'bg-gray-100 text-gray-600 border-gray-200';
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Trophy className="h-5 w-5" />
					{t('top_users_this_week')}
				</CardTitle>
				<CardDescription>{t('top_users_this_week_description')}</CardDescription>
			</CardHeader>
			<CardContent className="px-6">
				<ScrollArea className="w-full overflow-y-hidden">
					<div className="min-w-[600px]">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-16">{t('rank')}</TableHead>
									<TableHead>{t('user')}</TableHead>
									<TableHead className="text-center">{t('solved')}</TableHead>
									<TableHead className="text-center">{t('submissions')}</TableHead>
									<TableHead className="text-center">{t('success_rate')}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map((user) => (
									<TableRow key={user.username} className="hover:bg-muted/50">
										<TableCell>
											<div className="flex items-center justify-center">
												<div
													className={cn(
														'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold',
														getRankBadgeColor(user.rank),
													)}
												>
													{user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Link href={`/admin/user/${user.username}`} className="block space-y-1 transition-all hover:text-blue-600 hover:underline">
												<div className="font-medium">{user.fullname || user.username}</div>
												<div className="text-muted-foreground text-sm">@{user.username}</div>
											</Link>
										</TableCell>
										<TableCell className="text-center">
											<div className="font-mono text-sm font-semibold">{user.solved}</div>
										</TableCell>
										<TableCell className="text-center">
											<div className="font-mono text-sm">{user.submissions}</div>
										</TableCell>
										<TableCell className="text-center">
											<div className="font-mono text-sm">
												<span
													className={cn('font-medium', {
														'text-green-600': parseFloat(user.success_rate) >= 80,
														'text-yellow-600': parseFloat(user.success_rate) >= 60 && parseFloat(user.success_rate) < 80,
														'text-red-600': parseFloat(user.success_rate) < 60,
													})}
												>
													{user.success_rate}%
												</span>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</CardContent>
		</Card>
	);
};

export default TopUsersTable;
