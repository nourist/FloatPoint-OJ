'use client';

import { Code } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SubmissionInfo } from './submission-info';
import { getSubmissionStatusColor } from '~/lib/status-utils';
import { getAlertColorClasses, getStatusIcon } from '~/lib/status-utils';
import { Submission } from '~/types/submission.type';

interface SubmissionHeaderProps {
	submission: Submission;
}

export const SubmissionHeader = ({ submission }: SubmissionHeaderProps) => {
	const t = useTranslations('submission.detail');
	const statusTranslation = useTranslations('submission.status');

	const colorClasses = getAlertColorClasses(submission.status);
	const StatusIcon = getStatusIcon(submission.status);

	return (
		<div className="mb-6">
			{/* Simplified Status Alert - Only essential information */}
			<div className={`mb-6 flex items-center rounded-xl border-l-4 p-4 ${colorClasses.border} ${colorClasses.background}`}>
				<div className={`mr-3 rounded-lg p-2 ${colorClasses.iconBackground}`}>
					<StatusIcon className={`h-5 w-5 ${colorClasses.iconColor}`} />
				</div>
				<div className="flex flex-1 items-center gap-2">
					<h2 className={`font-bold ${colorClasses.text}`}>{statusTranslation(submission.status.toLowerCase())}</h2>
					{submission.totalScore > 0 && <span className="rounded-full bg-white/50 px-2 py-1 text-xs font-medium dark:bg-black/20">{submission.totalScore}p</span>}
				</div>
			</div>

			{/* Redesigned Header Section - Cleaner layout */}
			<div className="bg-card rounded-2xl border p-6 shadow-xs">
				<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
					{/* Left Column - Title and Basic Info */}
					<div className="flex-1">
						<div className="flex items-center gap-3">
							<div className="bg-primary/10 rounded-lg p-2">
								<Code className="text-primary h-5 w-5" />
							</div>
							<div>
								<h1 className="text-2xl font-bold">{t('title')}</h1>
								<div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-4 text-sm">
									<span>
										{t('info.id')}: <span className="font-mono">{submission.id}</span>
									</span>
									<span>
										{t('info.submitted')}: {new Date(submission.submittedAt).toLocaleString()}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Status Badge */}
					<div className="flex items-center">
						<div className={`rounded-full px-4 py-2 text-sm font-medium ${getSubmissionStatusColor(submission.status)}`}>
							{statusTranslation(submission.status.toLowerCase())}
						</div>
					</div>
				</div>

				{/* Submission Info Section */}
				<div className="mt-6 border-t pt-6">
					<SubmissionInfo submission={submission} />
				</div>
			</div>
		</div>
	);
};
