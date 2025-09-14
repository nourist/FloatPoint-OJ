'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { cn } from '~/lib/utils';
import { ContestProblem, UserStanding } from '~/types/contest.type';

interface StandingsTabProps {
	standings: UserStanding[];
	standingsLoading: boolean;
	problems: ContestProblem[];
}

// Helper to format time as timestamp (HH:MM:SS)
const formatTime = (ms: number) => {
	const seconds = Math.floor(ms / 1000);
	if (seconds === 0) {
		return '';
	}

	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;
	return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formatTotalTime = (ms: number) => {
	const seconds = Math.floor(ms / 1000);
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;
	return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export function StandingsTab({ standings, standingsLoading, problems }: StandingsTabProps) {
	const t = useTranslations('admin.contest.detail');

	return standingsLoading ? (
		<div className="p-8 text-center">{t('loading')}</div>
	) : (
		<Table className="min-w-full">
			<TableHeader>
				<TableRow className="!bg-muted">
					<TableHead className="w-16 text-center font-bold">{t('rank')}</TableHead>
					<TableHead className="min-w-[200px] font-bold">{t('user')}</TableHead>
					<TableHead className="w-32 text-center font-bold">{t('score')}</TableHead>
					{problems.map((problem, index) => (
						<TableHead key={problem.id} className="w-20 text-center font-bold">
							<div className="flex flex-col">
								<span>{index + 1}</span>
								<span className="text-xs">{problem.maxScore}</span>
							</div>
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{standings && standings.length > 0 ? (
					standings.map((standing) => (
						<TableRow key={standing.userId}>
							<TableCell className="text-center font-medium">{standing.rank}</TableCell>
							<TableCell className="text-left font-medium">
								<Link className="hover:text-primary hover:underline" href={`/admin/user/${standing.username}`}>
									{standing.username}
								</Link>
							</TableCell>
							<TableCell className="text-center">
								<div className="flex flex-col">
									<span className="text-lg font-bold">{standing.totalScore}</span>
									<span className="text-xs text-gray-500">{formatTotalTime(standing.totalTime)}</span>
								</div>
							</TableCell>
							{problems.map((problem) => {
								const ps = standing.problems[problem.id];
								const isAc = ps && ps.isAc;
								return (
									<TableCell key={problem.id} className={cn('text-center', isAc ? 'bg-success/10 text-success font-medium' : '')}>
										{ps ? (
											<div className="flex flex-col">
												<span className="font-bold">{ps.score}</span>
												<span className="text-xs text-gray-600">{formatTime(ps.time)}</span>
											</div>
										) : (
											<div className="flex flex-col">
												<span></span>
												<span className="text-xs"></span>
											</div>
										)}
									</TableCell>
								);
							})}
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={3 + problems.length} className="h-24 text-center">
							{t('no_standings')}
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
