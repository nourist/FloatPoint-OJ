'use client';

import { AlertCircle, Calendar, Check, Code, Loader2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Skeleton } from '~/components/ui/skeleton';
import { languageOptions } from '~/lib/language-utils';
import { getSubmissionStatusColor, getSubmissionStatusTextColor } from '~/lib/status-utils';
import { cn } from '~/lib/utils';
import { Submission, SubmissionStatus } from '~/types/submission.type';
import { User } from '~/types/user.type';

interface SubmissionTableProps {
	submissions: Submission[];
	user?: User;
}

export const TableSkeleton = () => {
	return (
		<div className="overflow-hidden rounded-2xl border shadow-xs">
			<table className="table w-full">
				<thead>
					<tr>
						<th>
							<Skeleton className="h-4 w-12" />
						</th>
						<th className="max-md:!pl-0">
							<Skeleton className="h-4 w-16" />
						</th>
						<th className="max-md:!px-0 max-sm:hidden">
							<Skeleton className="h-4 w-20" />
						</th>
						<th className="max-xl:hidden">
							<Skeleton className="h-4 w-16" />
						</th>
						<th className="max-xl:hidden">
							<Skeleton className="h-4 w-14" />
						</th>
						<th>
							<Skeleton className="h-4 w-20" />
						</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{[...Array(5)].map((_, i) => (
						<tr key={i}>
							<td>
								<div className="space-y-1">
									<div className="flex items-center gap-1">
										<Skeleton className="size-4 rounded-full" />
										<Skeleton className="h-5 w-16 rounded-full" />
									</div>
									<div>
										<Skeleton className="h-3 w-20" />
									</div>
								</div>
							</td>
							<td className="max-md:!pl-0">
								<Skeleton className="h-4 w-32" />
							</td>
							<td className="max-md:!px-0 max-sm:hidden">
								<div className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5">
									<Skeleton className="size-3" />
									<Skeleton className="h-3 w-16" />
								</div>
							</td>
							<td className="max-xl:hidden">
								<Skeleton className="h-4 w-12" />
							</td>
							<td className="max-xl:hidden">
								<Skeleton className="h-4 w-14" />
							</td>
							<td>
								<div className="flex items-center gap-2">
									<Skeleton className="size-3" />
									<Skeleton className="h-3 w-16" />
								</div>
							</td>
							<td>
								<Skeleton className="h-4 w-4" />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
interface StatusIconProps {
	status: SubmissionStatus;
	className?: string;
}

const StatusIcon = ({ status, className }: StatusIconProps) => {
	const getStatusIcon = (status: SubmissionStatus) => {
		switch (status) {
			case SubmissionStatus.ACCEPTED:
				return Check;
			case SubmissionStatus.WRONG_ANSWER:
			case SubmissionStatus.RUNTIME_ERROR:
			case SubmissionStatus.COMPILATION_ERROR:
			case SubmissionStatus.INTERNAL_ERROR:
				return X;
			case SubmissionStatus.TIME_LIMIT_EXCEEDED:
			case SubmissionStatus.MEMORY_LIMIT_EXCEEDED:
				return AlertCircle;
			case SubmissionStatus.PENDING:
			case SubmissionStatus.JUDGING:
				return Loader2;
			default:
				return AlertCircle;
		}
	};
	const Status = getStatusIcon(status);
	return <Status className={cn(getSubmissionStatusTextColor(status), className)} />;
};

const SubmissionTable = ({ submissions, user }: SubmissionTableProps) => {
	const t = useTranslations('submission');

	const formatLanguage = (language: string) => {
		const option = languageOptions.find((opt) => opt.value === language);
		return option ? option.label : language;
	};

	const formatDate = (dateInput: Date | string): string => {
		const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
		const now = new Date();
		const diff = Math.max((now.getTime() - date.getTime()) / 1000, 0); // giây

		if (diff < 60) {
			return t('date.seconds', { count: Math.floor(diff) });
		}
		if (diff < 3600) {
			return t('date.minutes', { count: Math.floor(diff / 60) });
		}
		if (diff < 86400) {
			return t('date.hours', { count: Math.floor(diff / 3600) });
		}
		if (diff < 2592000) {
			return t('date.days', { count: Math.floor(diff / 86400) });
		}
		if (diff < 31536000) {
			return t('date.months', { count: Math.floor(diff / 2592000) });
		}
		return t('date.years', { count: Math.floor(diff / 31536000) });
	};

	return (
		<div className="overflow-hidden rounded-2xl border shadow-xs">
			<table className="table w-full">
				<thead>
					<tr>
						<th>{t('table.status')}</th>
						<th className="max-md:!pl-0">{t('table.problem')}</th>
						<th className="max-md:!px-0 max-sm:hidden">{t('table.language')}</th>
						<th className="max-xl:hidden">{t('table.runtime')}</th>
						<th className="max-xl:hidden">{t('table.memory')}</th>
						<th>{t('table.submitted')}</th>
						{user && <th></th>}
					</tr>
				</thead>
				<tbody>
					{submissions.map((submission) => (
						<tr key={submission.id}>
							<td>
								<div className="space-y-1">
									<div className="flex items-center gap-1">
										<StatusIcon className="size-4" status={submission.status} />
										<div className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', getSubmissionStatusColor(submission.status))}>
											{t(`status.${submission.status}`)}
										</div>
									</div>
									<div className="text-muted-foreground text-xs">
										{submission.acceptedTestCases}/{submission.totalTestCases} {t('page.passed')}
									</div>
								</div>
							</td>
							<td className="max-md:!pl-0">
								<Link className="hover:text-primary font-medium hover:underline" href={`/problem/${submission.problem.slug}`}>
									{submission.problem.title}
								</Link>
							</td>
							<td className="max-md:!px-0 max-sm:hidden">
								<div className="bg-accent inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-semibold">
									<Code className="size-3" />
									<div className="mt-[1px]">{formatLanguage(submission.language)}</div>
								</div>
							</td>
							<td className="text-muted-foreground max-xl:hidden">{Number((submission.time || 0) / 1000).toFixed(2)}s</td>
							<td className="text-muted-foreground max-xl:hidden">{Number((submission.memory || 0) / 1024).toFixed(1)}MB</td>
							<td className="text-muted-foreground">
								<div className="flex items-center gap-2 text-xs">
									<Calendar className="size-3" />
									{formatDate(submission.submittedAt)}
								</div>
							</td>
							{user && (
								<td>
									{submission.canView && (
										<Link href={`/submission/${submission.id}`} className="text-primary flex items-center gap-1 text-sm font-semibold hover:underline">
											{t('page.view')}
										</Link>
									)}
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default SubmissionTable;
