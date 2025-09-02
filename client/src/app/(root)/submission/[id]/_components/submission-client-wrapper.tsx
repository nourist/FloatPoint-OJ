'use client';

import { AlertTriangle, TestTube } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { LogTab } from './log-tab';
import { SourceCodeTab } from './source-code-tab';
import { SubmissionHeader } from './submission-header';
import { TestCasesTab } from './test-cases-tab';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { socketService } from '~/services/socket';
import { Submission, SubmissionStatus } from '~/types/submission.type';

interface SubmissionClientWrapperProps {
	initialSubmission: Submission;
}

export const SubmissionClientWrapper = ({ initialSubmission }: SubmissionClientWrapperProps) => {
	const t = useTranslations('submission.detail');

	const [submission, setSubmission] = useState<Submission>(initialSubmission);
	const [activeTab, setActiveTab] = useState('source-code');

	// Set up socket connection for real-time updates
	useEffect(() => {
		if (!initialSubmission.id) return;

		// Connect to socket for real-time updates
		socketService.connect();

		// Listen for submission updates
		const unsubscribe = socketService.onSubmissionUpdate((data) => {
			if (data.id !== submission.id) return;
			// Update the submission with new data
			setSubmission(data);
		});

		// Cleanup function
		return () => {
			unsubscribe();
		};
	}, [initialSubmission.id, submission.id]);

	// Determine the second tab based on submission status
	const secondTab = useMemo(() => {
		const hasErrorStatus = [SubmissionStatus.INTERNAL_ERROR, SubmissionStatus.COMPILATION_ERROR].includes(submission.status);

		return hasErrorStatus ? { key: 'log', label: t('tabs.log'), icon: AlertTriangle } : { key: 'test-cases', label: t('tabs.test_cases'), icon: TestTube };
	}, [submission.status, t]);

	return (
		<>
			{/* Breadcrumb */}
			<Breadcrumb className="mb-4">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/submission">{t('breadcrumb.submissions')}</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{submission.id}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Header */}
			<SubmissionHeader submission={submission} />

			{/* Tabbed Content */}
			<div className="bg-card mb-6 gap-4 rounded-2xl border p-6 shadow-xs">
				<div className="border-b pb-4">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="source-code" className="flex items-center gap-2">
								{t('tabs.source_code')}
							</TabsTrigger>
							<TabsTrigger value={secondTab.key} className="flex items-center gap-2">
								<secondTab.icon className="h-4 w-4" />
								{secondTab.label}
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
				<div className="pt-4">
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						{/* Source Code Tab */}
						<TabsContent value="source-code">
							<SourceCodeTab sourceCode={submission.sourceCode} />
						</TabsContent>

						{/* Log Tab (for IE/CE) */}
						<TabsContent value="log">
							<LogTab log={submission.log || ''} />
						</TabsContent>

						{/* Test Cases Tab */}
						<TabsContent value="test-cases">
							<TestCasesTab results={submission.results} />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</>
	);
};
