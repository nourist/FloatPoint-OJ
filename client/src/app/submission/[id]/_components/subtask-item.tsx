'use client';

import { ChevronDown, ChevronRight, Clock, Database, TestTube } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '~/components/ui/badge';
import { formatSubmissionStatus, getSubmissionStatusColor } from '~/lib/status-utils';
import { SubmissionResult } from '~/types/submission-result.type';

interface SubtaskItemProps {
	subtaskSlug: string;
	subtask: {
		name: string;
		slug: string;
		testCases: SubmissionResult[];
		status: 'ACCEPTED' | 'FAILED' | 'PARTIAL';
		passedCount: number;
		totalCount: number;
	};
}

const getSubtaskStatusColor = (status: 'ACCEPTED' | 'FAILED' | 'PARTIAL') => {
	switch (status) {
		case 'ACCEPTED':
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
		case 'FAILED':
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
		case 'PARTIAL':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
	}
};

export const SubtaskItem = ({ subtaskSlug, subtask }: SubtaskItemProps) => {
	const t = useTranslations('submission.detail');
	const [isExpanded, setIsExpanded] = useState(true); // Initially expanded

	const handleToggle = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div key={subtaskSlug} className="overflow-hidden rounded-lg border">
			{/* Subtask Header */}
			<div className="bg-muted/50 hover:bg-muted/70 flex cursor-pointer items-center justify-between p-4 transition-colors" onClick={handleToggle}>
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						{isExpanded ? <ChevronDown className="text-muted-foreground h-4 w-4" /> : <ChevronRight className="text-muted-foreground h-4 w-4" />}
						<TestTube className="text-muted-foreground h-4 w-4" />
					</div>
					<span className="font-semibold">{subtask.name}</span>
					<Badge className={`${getSubtaskStatusColor(subtask.status)} hover:${getSubtaskStatusColor(subtask.status)}`}>
						{subtask.status === 'PARTIAL' ? `${subtask.passedCount}/${subtask.totalCount}` : subtask.status}
					</Badge>
				</div>
				<div className="text-muted-foreground text-sm">{t('content.tests_passed', { passed: subtask.passedCount, total: subtask.totalCount })}</div>
			</div>

			{/* Test Cases List */}
			{isExpanded && (
				<div className="bg-background border-t">
					{subtask.testCases.map((result: SubmissionResult, index: number) => (
						<div key={result.id} className={`flex items-center justify-between p-4 pl-8 ${index < subtask.testCases.length - 1 ? 'border-b' : ''}`}>
							<div className="flex items-center gap-4">
								<div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs">{index + 1}</div>
								<span className="font-medium">{result.testCaseName || `Test ${index + 1}`}</span>
								<Badge className={`${getSubmissionStatusColor(result.status)} hover:${getSubmissionStatusColor(result.status)}`}>
									{formatSubmissionStatus(result.status)}
								</Badge>
							</div>
							<div className="text-muted-foreground flex items-center gap-4 text-sm">
								<div className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									{result.executionTime}ms
								</div>
								<div className="flex items-center gap-1">
									<Database className="h-3 w-3" />
									{result.memoryUsed}KB
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
