'use client';

import { AlertTriangle, Info, TestTube } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { InfoTab } from './info-tab';
import { LogTab } from './log-tab';
import { TestCasesTab } from './test-cases-tab';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { socketService } from '~/services/socket';
import { Submission } from '~/types/submission.type';

interface SubmissionClientWrapperProps {
	initialSubmission: Submission;
}

export const SubmissionClientWrapper = ({ initialSubmission }: SubmissionClientWrapperProps) => {
	const t = useTranslations('admin.submission.detail');

	const [submission, setSubmission] = useState<Submission>(initialSubmission);
	const [activeTab, setActiveTab] = useState('info');

	// Set up socket connection for real-time updates
	useEffect(() => {
		if (!initialSubmission.id) return;

		socketService.connect();

		const unsubscribe = socketService.onSubmissionUpdate((data) => {
			if (data.id !== submission.id) return;
			setSubmission(data);
		});

		return () => {
			unsubscribe();
		};
	}, [initialSubmission.id, submission.id]);

	return (
		<>
			{/* Tabs header */}
			<div>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList>
						<TabsTrigger value="info" className="flex items-center gap-2">
							<Info className="h-4 w-4" />
							{t('tabs.info')}
						</TabsTrigger>
						<TabsTrigger value="log" className="flex items-center gap-2">
							<AlertTriangle className="h-4 w-4" />
							{t('tabs.log')}
						</TabsTrigger>
						<TabsTrigger value="test-cases" className="flex items-center gap-2">
							<TestTube className="h-4 w-4" />
							{t('tabs.test_cases')}
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<Separator />

			{/* Tabs content */}
			<div>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsContent value="info" className="mt-0 space-y-4">
						<InfoTab submission={submission} />
					</TabsContent>

					<TabsContent value="log" className="mt-0">
						<LogTab log={submission.log || ''} />
					</TabsContent>

					<TabsContent value="test-cases" className="mt-0">
						<TestCasesTab results={submission.results} />
					</TabsContent>
				</Tabs>
			</div>
		</>
	);
};
