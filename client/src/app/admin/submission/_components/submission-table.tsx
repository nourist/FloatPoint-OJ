'use client';

import { AlertCircle, Calendar, Check, Code, Loader2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { languageOptions } from '~/lib/language-utils';
import { getSubmissionStatusColor, getSubmissionStatusTextColor } from '~/lib/status-utils';
import { cn } from '~/lib/utils';
import { Submission, SubmissionStatus } from '~/types/submission.type';
import { User as UserType } from '~/types/user.type';

interface SubmissionTableProps {
	submissions: Submission[];
	user?: UserType;
}

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

const SubmissionTable = ({ submissions }: SubmissionTableProps) => {
	const t = useTranslations('admin.submission');

	const formatLanguage = (language: string) => {
		const option = languageOptions.find((opt) => opt.value === language);
		return option ? option.label : language;
	};

	const formatDate = (dateInput: Date | string): string => {
		const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
		const now = new Date();
		const diff = Math.max((now.getTime() - date.getTime()) / 1000, 0);

		if (diff < 60) return t('date.seconds', { count: Math.floor(diff) });
		if (diff < 3600) return t('date.minutes', { count: Math.floor(diff / 60) });
		if (diff < 86400) return t('date.hours', { count: Math.floor(diff / 3600) });
		if (diff < 2592000) return t('date.days', { count: Math.floor(diff / 86400) });
		if (diff < 31536000) return t('date.months', { count: Math.floor(diff / 2592000) });
		return t('date.years', { count: Math.floor(diff / 31536000) });
	};

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t('table.status')}</TableHead>
						<TableHead>{t('table.problem')}</TableHead>
						<TableHead>{t('table.author')}</TableHead>
						<TableHead>{t('table.language')}</TableHead>
						<TableHead>{t('table.submitted')}</TableHead>
						<TableHead></TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{submissions.map((submission) => (
						<TableRow key={submission.id}>
							<TableCell>
								<div className="flex items-center gap-1">
									<StatusIcon className="size-4" status={submission.status} />
									<div className={cn('my-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', getSubmissionStatusColor(submission.status))}>
										{t(`status.${submission.status.toLowerCase()}`)}
									</div>
								</div>
							</TableCell>
							<TableCell>
								<Link href={`/admin/problem/${submission.problem.slug}`} className="hover:text-primary hover:underline">
									{submission.problem.title}
								</Link>
							</TableCell>
							<TableCell>
								<Link href={`/profile/${submission.author.username}`} className="hover:text-primary hover:underline">
									{submission.author.username}
								</Link>
							</TableCell>
							<TableCell>
								<div className="inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-semibold">
									<Code className="size-3" />
									<span>{formatLanguage(submission.language)}</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="text-muted-foreground flex items-center gap-2 text-xs">
									<Calendar className="size-3" />
									{formatDate(submission.submittedAt)}
								</div>
							</TableCell>
							<TableCell>
								<Link href={`/admin/submission/${submission.id}`} className="text-primary hover:underline">
									{t('page.view')}
								</Link>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default SubmissionTable;
