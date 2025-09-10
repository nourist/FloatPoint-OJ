'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Contest } from '~/types/contest.type';

interface ProblemsTabProps {
	contest: Contest;
}

export function ContestProblemsTab({ contest }: ProblemsTabProps) {
	const t = useTranslations('contest.detail');

	return (
		<div className="w-full overflow-hidden rounded-2xl border shadow-xs">
			<table className="table w-full">
				<thead>
					<tr>
						<th className="w-16">#</th>
						<th>{t('problem_title')}</th>
						<th className="w-20 text-center">{t('points')}</th>
					</tr>
				</thead>
				<tbody>
					{contest.problems && contest.problems.length > 0 ? (
						contest.problems.map((problem, index) => (
							<tr key={problem.id}>
								<td className="font-medium">{index + 1}</td>
								<td>
									<Link className="hover:text-primary font-medium hover:underline" href={`/problem/${problem.slug}`}>
										{problem.title}
									</Link>
								</td>
								<td className="text-center font-medium">{problem.point}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={3} className="text-muted-foreground h-32 text-center">
								{t('no_problems')}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
