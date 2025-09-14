'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Button } from '~/components/ui/button';

interface TestcaseActionButtonsProps {
	onCreateTestcase?: (subtaskId: string) => void;
	onDeleteTestcase?: (subtaskId: string, testCaseId: string) => void;
	onCreateSubtask?: () => void;
	onDeleteSubtask?: (subtaskId: string) => void;
	subtaskId?: string;
	testCaseId?: string;
	subtaskSlug?: string;
	testCaseSlug?: string;
	type: 'subtask' | 'testcase' | 'new-subtask';
}

const TestcaseActionButtons = ({ onCreateTestcase, onDeleteTestcase, onCreateSubtask, onDeleteSubtask, subtaskSlug, testCaseSlug, type }: TestcaseActionButtonsProps) => {
	const t = useTranslations('admin.problem.testcase');

	if (type === 'new-subtask') {
		return (
			<Button
				variant="outline"
				className="border-primary text-primary hover:bg-primary/10 w-full border-dashed"
				onClick={(e) => {
					e.stopPropagation();
					onCreateSubtask?.();
				}}
			>
				<Plus className="mr-2 h-4 w-4" />
				{t('new_subtask')}
			</Button>
		);
	}

	return (
		<div className="absolute top-1/2 right-2 z-10 flex -translate-y-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
			{type === 'subtask' && (
				<>
					<Button
						size="icon"
						variant="outline"
						className="h-6 w-6"
						onClick={(e) => {
							e.stopPropagation();
							if (subtaskSlug) {
								onCreateTestcase?.(subtaskSlug);
							}
						}}
						aria-label="Add testcase"
					>
						<Plus className="h-3 w-3" />
					</Button>
					<Button
						size="icon"
						variant="outline"
						className="h-6 w-6"
						onClick={(e) => {
							e.stopPropagation();
							if (subtaskSlug) {
								onDeleteSubtask?.(subtaskSlug);
							}
						}}
						aria-label="Delete subtask"
					>
						<Trash2 className="h-3 w-3" />
					</Button>
				</>
			)}
			{type === 'testcase' && (
				<Button
					size="icon"
					variant="outline"
					className="h-6 w-6"
					onClick={(e) => {
						e.stopPropagation();
						if (subtaskSlug && testCaseSlug) {
							onDeleteTestcase?.(subtaskSlug, testCaseSlug);
						}
					}}
					aria-label="Delete testcase"
				>
					<Trash2 className="h-3 w-3" />
				</Button>
			)}
		</div>
	);
};

export default TestcaseActionButtons;
