'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LogTabProps {
	log: string;
}

export const LogTab = ({ log }: LogTabProps) => {
	const t = useTranslations('admin.submission.detail');

	return log ? (
		<pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">{log}</pre>
	) : (
		<div className="text-muted-foreground py-8 text-center">
			<AlertTriangle className="mx-auto mb-4 h-12 w-12" />
			<p>{t('content.no_log_available')}</p>
		</div>
	);
};
