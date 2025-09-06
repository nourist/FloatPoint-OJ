'use client';

import { Code } from 'lucide-react';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { getSubmissionStatusColor } from '~/lib/status-utils';
import { Submission } from '~/types/submission.type';

interface InfoTabProps {
	submission: Submission;
}

export const InfoTab = ({ submission }: InfoTabProps) => {
	const t = useTranslations('submission.detail');
	const statusTranslation = useTranslations('submission.status');

	return (
		<>
			{/* Left Column - Title and Basic Info */}
			<div className="flex">
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
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{/* Author Info Card */}
				<div className="bg-background rounded-lg p-4">
					<div className="mb-2 flex items-center gap-2">
						<User className="text-muted-foreground h-4 w-4" />
						<span className="text-muted-foreground text-sm font-medium">{t('info.author')}</span>
					</div>
					<Link href={`/profile/${submission.author.username}`} className="hover:text-primary font-medium hover:underline">
						{submission.author.username}
					</Link>
				</div>

				{/* Problem Info Card */}
				{submission.problem && (
					<div className="bg-background rounded-lg p-4">
						<div className="mb-2 flex items-center gap-2">
							<Code className="text-muted-foreground h-4 w-4" />
							<span className="text-muted-foreground text-sm font-medium">{t('info.problem')}</span>
						</div>
						<Link href={`/admin/problem/${submission.problem.slug}`} className="hover:text-primary font-medium hover:underline">
							{submission.problem.title}
						</Link>
					</div>
				)}

				{/* Language Info Card */}
				<div className="bg-background rounded-lg p-4">
					<div className="text-muted-foreground mb-2 text-sm font-medium">{t('info.language')}</div>
					<Badge variant="secondary">{submission.language}</Badge>
				</div>

				{/* Score Info Card */}
				<div className="bg-background rounded-lg p-4">
					<div className="text-muted-foreground mb-2 text-sm font-medium">{t('info.score')}</div>
					<div className="text-lg font-bold">{submission.totalScore || 0}</div>
				</div>
			</div>

			<Separator />

			<pre className="bg-muted overflow-x-auto rounded-lg p-4">
				<code className="font-mono text-sm">{submission.sourceCode}</code>
			</pre>
		</>
	);
};
