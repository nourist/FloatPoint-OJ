'use client';

import { Code, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Badge } from '~/components/ui/badge';
import { Submission } from '~/types/submission.type';

interface SubmissionInfoProps {
	submission: Submission;
}

export const SubmissionInfo = ({ submission }: SubmissionInfoProps) => {
	const t = useTranslations('submission.detail');

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
					<Link href={`/problem/${submission.problem.slug}`} className="hover:text-primary font-medium hover:underline">
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
	);
};
