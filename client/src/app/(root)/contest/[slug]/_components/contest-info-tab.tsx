'use client';

import { Calendar, Clock, Hash, Star, Trophy, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import RichTextRenderer from '~/components/rich-text-renderer';
import { Badge } from '~/components/ui/badge';
import { Contest } from '~/types/contest.type';
import { getContestStatus } from '~/types/contest.type';

interface InfoProps {
	contest: Contest;
	startDate: string;
	startTime: string;
	endDate: string;
	endTime: string;
}

export const ContestInfoTab = ({ contest, startDate, startTime, endDate, endTime }: InfoProps) => {
	const t = useTranslations('contest.detail');
	const status = getContestStatus(contest);

	const getStatusBadgeClass = () => {
		switch (status) {
			case 'RUNNING':
				return '!bg-green-100 !text-green-800 dark:!bg-green-900 dark:!text-green-300';
			case 'PENDING':
				return '!bg-blue-100 !text-blue-800 dark:!bg-blue-900 dark:!text-blue-300';
			case 'ENDED':
				return '!bg-gray-100 !text-gray-800 dark:!bg-gray-800 dark:!text-gray-300';
			default:
				return '!bg-gray-100 !text-gray-800 dark:!bg-gray-800 dark:!text-gray-300';
		}
	};

	const getStatusText = () => {
		switch (status) {
			case 'RUNNING':
				return t('running');
			case 'PENDING':
				return t('upcoming');
			case 'ENDED':
				return t('ended');
			default:
				return status;
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
						<Trophy className="text-primary h-5 w-5" />
					</div>
					<div>
						<h1 className="text-2xl font-bold">{contest.title}</h1>
						<div className="mt-1 flex items-center gap-2">
							<Badge className={getStatusBadgeClass()}>{getStatusText()}</Badge>
							{contest.isRated && (
								<Badge
									variant="outline"
									className="border-yellow-600 bg-yellow-50 text-yellow-600 dark:border-yellow-500 dark:bg-yellow-900/20 dark:text-yellow-400"
								>
									<Star className="mr-1 h-3 w-3" />
									{t('rated')}
								</Badge>
							)}
						</div>
					</div>
				</div>
				{contest.description && (
					<div className="bg-card rounded-xl border p-6 shadow-xs">
						<RichTextRenderer content={contest.description} className="prose prose-sm max-w-none" />
					</div>
				)}
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
				<div className="bg-card flex h-18 items-center gap-3 rounded-xl border px-4 shadow-xs">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
						<Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">{t('start_time')}</p>
						<div className="flex items-center gap-2">
							<p className="text-sm font-semibold">{startDate}</p>
							<p className="text-muted-foreground text-xs">{startTime}</p>
						</div>
					</div>
				</div>

				<div className="bg-card flex h-18 items-center gap-3 rounded-xl border px-4 shadow-xs">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
						<Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">{t('end_time')}</p>
						<div className="flex items-center gap-2">
							<p className="text-sm font-semibold">{endDate}</p>
							<p className="text-muted-foreground text-xs">{endTime}</p>
						</div>
					</div>
				</div>

				<div className="bg-card flex h-18 items-center gap-3 rounded-xl border px-4 shadow-xs">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
						<Users className="h-5 w-5 text-green-600 dark:text-green-400" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">{t('participants')}</p>
						<p className="text-xl font-bold">{contest.participants?.length || 0}</p>
					</div>
				</div>

				<div className="bg-card flex h-18 items-center gap-3 rounded-xl border px-4 shadow-xs">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
						<Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
					</div>
					<div>
						<p className="text-muted-foreground text-sm">{t('problems')}</p>
						<p className="text-xl font-bold">{contest.problems?.length || 0}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
