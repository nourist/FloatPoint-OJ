'use client';

import { TestTube } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { SubtaskItem } from './subtask-item';
import { SubmissionResult } from '~/types/submission-result.type';

interface TestCasesTabProps {
	results: SubmissionResult[] | undefined;
}

// Organize results by subtasks for tree view
const useSubtasksData = (results: SubmissionResult[] | undefined) => {
	return useMemo(() => {
		const map = new Map<
			string,
			{
				name: string;
				slug: string;
				testCases: SubmissionResult[];
				status: 'ACCEPTED' | 'FAILED' | 'PARTIAL';
				passedCount: number;
				totalCount: number;
			}
		>();

		if (results) {
			results.forEach((result) => {
				// Parse slug to extract subtask and test case information
				// Slug format: "subtaskSlug/testCaseSlug" or just "testCaseSlug"
				const slugParts = result.slug.split('/');
				const subtaskSlug = slugParts.length > 1 ? slugParts[0] : 'default';
				const subtaskName = slugParts.length > 1 ? slugParts[0] : 'Tests';

				if (!map.has(subtaskSlug)) {
					map.set(subtaskSlug, {
						name: subtaskName,
						slug: subtaskSlug,
						testCases: [],
						status: 'ACCEPTED',
						passedCount: 0,
						totalCount: 0,
					});
				}

				const subtask = map.get(subtaskSlug)!;
				subtask.testCases.push(result);
				subtask.totalCount++;

				if (result.status === 'ACCEPTED') {
					subtask.passedCount++;
				}

				// Update subtask status
				if (subtask.passedCount === 0) {
					subtask.status = 'FAILED';
				} else if (subtask.passedCount < subtask.totalCount) {
					subtask.status = 'PARTIAL';
				} else {
					subtask.status = 'ACCEPTED';
				}
			});
		}

		return map;
	}, [results]);
};

export const TestCasesTab = ({ results }: TestCasesTabProps) => {
	const t = useTranslations('submission.detail');
	const subtasksData = useSubtasksData(results);

	if (subtasksData.size === 0) {
		return (
			<div className="text-muted-foreground py-8 text-center">
				<TestTube className="mx-auto mb-4 h-12 w-12" />
				<p>{t('content.no_test_cases_available')}</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Controls Header */}
			<div className="flex items-center justify-between">
				<div className="text-muted-foreground text-sm">
					{subtasksData.size} {subtasksData.size === 1 ? 'subtask' : 'subtasks'}
				</div>
			</div>

			{Array.from(subtasksData.entries()).map(([subtaskSlug, subtask]) => (
				<SubtaskItem key={subtaskSlug} subtaskSlug={subtaskSlug} subtask={subtask} />
			))}
		</div>
	);
};
