'use client';

import { useTranslations } from 'next-intl';
import { UserStanding } from '~/types/contest.type';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

interface StandingsTabProps {
	standings: UserStanding[];
	standingsLoading: boolean;
}

export function StandingsTab({ standings, standingsLoading }: StandingsTabProps) {
	const t = useTranslations('admin.contest.detail');

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold">{t('standings_tab')}</h2>
			{standingsLoading ? (
				<div className="p-8 text-center">{t('loading')}</div>
			) : (
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('rank')}</TableHead>
								<TableHead>{t('user')}</TableHead>
								<TableHead>{t('score')}</TableHead>
								<TableHead>{t('time')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{standings && standings.length > 0 ? (
								standings.map((standing) => (
									<TableRow key={standing.userId}>
										<TableCell className="font-medium">#{standing.rank}</TableCell>
										<TableCell>{standing.username}</TableCell>
										<TableCell>{standing.totalScore}</TableCell>
										<TableCell>{Math.floor(standing.totalTime / 60)}m {standing.totalTime % 60}s</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} className="h-24 text-center">
										{/* Empty row when no standings available */}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}