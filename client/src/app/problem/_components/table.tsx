import { BookOpenCheck, Check, MinusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { getDifficultyColor } from '~/lib/difficulty-utils';
import { cn } from '~/lib/utils';
import { Problem } from '~/types/problem.type';
import { User } from '~/types/user.type';

interface Props {
	problems: Problem[];
	user: User | null;
	selectTags: string[];
}

const getStatusIcon = (status?: 'solved' | 'attempted' | null) => {
	if (status === 'solved') {
		return <Check className="text-success size-4" />;
	}
	if (status === 'attempted') {
		return <MinusCircle className="text-warning size-4" />;
	}
	return null;
};

const ProblemTable = ({ problems, user, selectTags }: Props) => {
	const t = useTranslations('problem.table');
	return (
		<div className="w-full overflow-hidden rounded-2xl border shadow-xs">
			<table className="divide-border w-full divide-y">
				<thead className="bg-accent">
					<tr>
						{user && <th className="px-6 py-3 text-center text-xs font-medium tracking-wider uppercase"></th>}
						<th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase max-sm:px-2">{t('title')}</th>
						<th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase max-sm:px-2">{t('difficulty')}</th>
						<th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase max-sm:px-2">{t('point')}</th>
						<th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase max-md:hidden">{t('accepted')}</th>
						<th className="px-6 py-3 text-left text-xs font-medium tracking-wider uppercase max-xl:hidden">{t('acceptance')}</th>
						<th className="px-6 py-3 text-center text-xs font-medium tracking-wider uppercase max-sm:hidden">{t('editorial')}</th>
					</tr>
				</thead>
				<tbody className="divide-border bg-card divide-y">
					{problems.map((problem) => (
						<tr key={problem.id} className="hover:bg-background">
							{user && (
								<td className="w-14 py-4 pl-5 whitespace-nowrap">
									<div className="flex h-full w-full items-center justify-center">{getStatusIcon(problem.status)}</div>
								</td>
							)}
							<td className="px-6 py-4 whitespace-nowrap max-sm:px-2">
								<Link href={`/problem/${problem.slug}`} className="hover:text-primary font-medium hover:underline">
									{problem.title}
								</Link>
								<div className="mt-1 flex flex-wrap gap-1">
									{problem.tags.map((tag) => (
										<span
											key={tag.id}
											className={cn(
												'bg-accent text-card-foreground/70 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium capitalize',
												selectTags.includes(tag.name) && 'bg-primary text-primary-foreground',
											)}
										>
											{tag.name}
										</span>
									))}
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap max-sm:px-2">
								<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getDifficultyColor(problem.difficulty)}`}>
									{t(problem.difficulty)}
								</span>
							</td>
							<td className="text-muted-foreground px-6 py-4 text-sm whitespace-nowrap max-sm:px-2">{problem.point}</td>
							<td className="text-muted-foreground px-6 py-4 text-sm whitespace-nowrap max-md:hidden">{problem.acCount}</td>
							<td className="text-muted-foreground px-6 py-4 text-sm whitespace-nowrap max-xl:hidden">{((problem.acRate ?? 0) * 100).toFixed(2)}%</td>
							<td className="py-4 whitespace-nowrap max-sm:hidden">
								{problem.editorial && (
									<Link href={`/problem/${problem.slug}/editorial`} className="flex h-full w-full items-center justify-center">
										<BookOpenCheck className="text-success size-4.5" strokeWidth={2.5} />
									</Link>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ProblemTable;
