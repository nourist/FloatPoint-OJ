'use client';

import { TestTube } from 'lucide-react';
import { ChevronDown, Clock, Database } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { formatSubmissionStatus, getSubmissionStatusColor } from '~/lib/status-utils';
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

export const TestCasesTab = ({ results }: TestCasesTabProps) => {
	const t = useTranslations('admin.submission.detail');
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
				<Collapsible key={subtaskSlug} className="overflow-hidden rounded-lg border" defaultOpen>
					<CollapsibleTrigger asChild>
						<div className="bg-muted/50 hover:bg-muted/70 flex cursor-pointer items-center justify-between p-4 transition-colors">
							<div className="flex items-center gap-3">
								<Button variant="ghost" size="sm" className="h-auto w-auto p-0">
									<ChevronDown className="text-muted-foreground collapsible-icon h-4 w-4" />
								</Button>
								<TestTube className="text-muted-foreground h-4 w-4" />
								<span className="font-semibold">{subtask.name}</span>
								<Badge className={`${getSubtaskStatusColor(subtask.status)} hover:${getSubtaskStatusColor(subtask.status)}`}>
									{subtask.status === 'PARTIAL' ? `${subtask.passedCount}/${subtask.totalCount}` : subtask.status}
								</Badge>
							</div>
							<div className="text-muted-foreground text-sm">{t('content.tests_passed', { passed: subtask.passedCount, total: subtask.totalCount })}</div>
						</div>
					</CollapsibleTrigger>
					<CollapsibleContent className="border-t">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-16">#</TableHead>
										<TableHead>Test Case</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Time (ms)</TableHead>
										<TableHead className="text-right">Memory (KB)</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{subtask.testCases.map((result: SubmissionResult, index: number) => {
										// Function to extract test case name from slug
										const getTestCaseName = (slug: string) => {
											// Slug format: "subtaskSlug/testCaseSlug" or just "testCaseSlug"
											const parts = slug.split('/');
											if (parts.length > 1) {
												return parts[1]; // Return testCaseSlug part
											}
											return `Test ${index + 1}`; // Default name if no subtask
										};

										return (
											<TableRow key={result.id}>
												<TableCell className="font-medium">{index + 1}</TableCell>
												<TableCell>{getTestCaseName(result.slug)}</TableCell>
												<TableCell>
													<Badge className={`${getSubmissionStatusColor(result.status)} hover:${getSubmissionStatusColor(result.status)}`}>
														{formatSubmissionStatus(result.status)}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-1">
														<Clock className="h-3 w-3" />
														{result.executionTime}
													</div>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-1">
														<Database className="h-3 w-3" />
														{result.memoryUsed}
													</div>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</CollapsibleContent>
				</Collapsible>
			))}
		</div>
	);
};
