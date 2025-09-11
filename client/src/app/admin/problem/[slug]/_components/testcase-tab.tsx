'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

import ConfirmDialog from './confirm-dialog';
import CreateItemDialog from './create-item-dialog';
import TestcaseActionButtons from './testcase-action-buttons';
import { Tree, TreeItem, TreeProvider } from '~/components/tree';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '~/components/ui/resizable';
import { Textarea } from '~/components/ui/textarea';
import { createClientService } from '~/lib/service-client';
import { problemServiceInstance } from '~/services/problem';
import { UpdateTestCasePayload } from '~/services/problem';
import { Problem } from '~/types/problem.type';
import { Subtask } from '~/types/subtask.type';
import { TestCase } from '~/types/test-case.type';

interface TestCaseContent {
	input: string;
	output: string;
}

interface TreeNodeData {
	subtaskId: string;
	testCaseId: string;
}

interface TreeNode {
	id: string;
	label: string;
	type: 'subtask' | 'testcase' | 'input' | 'output';
	children?: TreeNode[];
	data?: TreeNodeData;
	level?: number;
}

const TestcaseTab = ({ problem }: { problem: Problem }) => {
	const t = useTranslations('admin.problem.testcase');
	const problemService = createClientService(problemServiceInstance);

	const [selectedNode, setSelectedNode] = useState<string | null>(null);
	const [content, setContent] = useState<TestCaseContent | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [breadcrumbPath, setBreadcrumbPath] = useState<Array<{ label: string; type: string }>>([]);

	// Dialog states
	const [isCreateSubtaskDialogOpen, setIsCreateSubtaskDialogOpen] = useState(false);
	const [isCreateTestcaseDialogOpen, setIsCreateTestcaseDialogOpen] = useState(false);
	const [isDeleteSubtaskDialogOpen, setIsDeleteSubtaskDialogOpen] = useState(false);
	const [isDeleteTestcaseDialogOpen, setIsDeleteTestcaseDialogOpen] = useState(false);
	const [currentSubtaskId, setCurrentSubtaskId] = useState<string | null>(null);
	const [currentTestCaseId, setCurrentTestCaseId] = useState<string | null>(null);
	const [isCreating, setIsCreating] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	// Fetch subtasks using SWR
	const {
		data: subtasksData,
		error: subtasksError,
		isLoading: subtasksLoading,
		mutate: mutateSubtasks,
	} = useSWR(['subtasks', problem.id], () => problemService.getAllSubtasks(problem.id).then((res) => res.subtasks));

	const subtasks = React.useMemo(() => subtasksData || [], [subtasksData]);

	// Build tree structure from subtasks data
	const treeData = React.useMemo<TreeNode[]>(() => {
		if (!subtasks) return [];

		return subtasks.map((subtask: Subtask) => ({
			id: `subtask-${subtask.id}`,
			label: subtask.name,
			type: 'subtask',
			level: 0,
			children: subtask.testCases.map((testCase: TestCase) => ({
				id: `testcase-${testCase.id}`,
				label: testCase.name,
				type: 'testcase',
				level: 1,
				children: [
					{
						id: `input-${testCase.id}`,
						label: t('input'),
						type: 'input',
						level: 2,
						data: { subtaskId: subtask.slug, testCaseId: testCase.slug },
					},
					{
						id: `output-${testCase.id}`,
						label: t('output'),
						type: 'output',
						level: 2,
						data: { subtaskId: subtask.slug, testCaseId: testCase.slug },
					},
				],
			})),
		}));
	}, [subtasks, t]);

	// Handle subtasks loading/error states
	useEffect(() => {
		if (subtasksError) {
			toast.error(t('error.title'), {
				description: t('error.load_subtasks'),
			});
		}
	}, [subtasksError, t]);

	// Fetch content when a node is selected
	const fetchContent = useCallback(
		async (subtaskSlug: string, testCaseSlug: string, type: 'input' | 'output') => {
			try {
				const response = await problemService.getTestCaseContent(problem.id, subtaskSlug, testCaseSlug);
				setContent({
					input: type === 'input' ? response.testcase.input : content?.input || '',
					output: type === 'output' ? response.testcase.output : content?.output || '',
				});
				setIsEditing(true);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_error) {
				toast.error(t('error.title'), {
					description: t('error.load_content'),
				});
			}
		},
		[problem.id, content?.input, content?.output, problemService, t],
	);

	// Handle node selection
	const handleNodeSelect = (nodeId: string, data?: TreeNodeData) => {
		setSelectedNode(nodeId);

		// Reset content when selecting a non-input/output node
		if (data?.subtaskId && data?.testCaseId) {
			// This is an input or output node
			fetchContent(data.subtaskId, data.testCaseId, nodeId.startsWith('input-') ? 'input' : 'output');

			// Update breadcrumb path
			const subtask = subtasks.find((st) => st.slug === data.subtaskId);
			const testCase = subtask?.testCases.find((tc) => tc.slug === data.testCaseId);

			if (subtask && testCase) {
				setBreadcrumbPath([
					{ label: subtask.name, type: 'subtask' },
					{ label: testCase.name, type: 'testcase' },
					{ label: nodeId.startsWith('input-') ? t('input') : t('output'), type: nodeId.startsWith('input-') ? 'input' : 'output' },
				]);
			}
		} else {
			// Reset content for other nodes
			setContent(null);
			setIsEditing(false);
			setBreadcrumbPath([]);
		}
	};

	// Save content
	const handleSave = useCallback(async () => {
		if (!selectedNode || !content) return;

		// Lấy node data thay vì split ID
		const node = treeData
			.flatMap((st) => st.children ?? [])
			.flatMap((tc) => tc.children ?? [])
			.find((n) => n.id === selectedNode);

		if (!node?.data) return;

		const { subtaskId, testCaseId } = node.data;

		setIsSaving(true);
		try {
			const payload: UpdateTestCasePayload = {};

			if (selectedNode.startsWith('input-')) {
				payload.input = content.input;
			} else if (selectedNode.startsWith('output-')) {
				payload.output = content.output;
			}

			await problemService.updateTestCase(problem.id, subtaskId, testCaseId, payload);

			toast.success(t('success.title'), {
				description: t('success.saved'),
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(t('error.title'), {
				description: error?.response?.data?.message || t('error.save_content'),
			});
		} finally {
			setIsSaving(false);
		}
	}, [selectedNode, content, problem.id, problemService, t, treeData]);

	// Create new testcase
	const handleCreateTestCase = async (subtaskId: string) => {
		setCurrentSubtaskId(subtaskId);
		setIsCreateTestcaseDialogOpen(true);
	};

	// Confirm create testcase
	const handleConfirmCreateTestCase = async (name: string) => {
		if (!currentSubtaskId) return;

		setIsCreating(true);
		try {
			await problemService.createTestCase(problem.id, currentSubtaskId, {
				name,
				input: '',
				output: '',
			});

			// Refresh subtasks data
			mutateSubtasks();

			toast.success(t('success.title'), {
				description: t('success.testcase_created'),
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(t('error.title'), {
				description: error?.response?.data?.message || t('error.create_testcase'),
			});
		} finally {
			setIsCreating(false);
		}
	};

	// Delete testcase
	const handleDeleteTestCase = async (subtaskId: string, testCaseId: string) => {
		setCurrentSubtaskId(subtaskId);
		setCurrentTestCaseId(testCaseId);
		setIsDeleteTestcaseDialogOpen(true);
	};

	// Confirm delete testcase
	const handleConfirmDeleteTestCase = async () => {
		if (!currentSubtaskId || !currentTestCaseId) return;

		setIsDeleting(true);
		try {
			await problemService.deleteTestCase(problem.id, currentSubtaskId, currentTestCaseId);

			// Refresh subtasks data
			mutateSubtasks();

			toast.success(t('success.title'), {
				description: t('success.testcase_deleted'),
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(t('error.title'), {
				description: error?.response?.data?.message || t('error.delete_testcase'),
			});
		} finally {
			setIsDeleting(false);
			setIsDeleteTestcaseDialogOpen(false);
		}
	};

	// Create new subtask
	const handleCreateSubtask = async () => {
		setIsCreateSubtaskDialogOpen(true);
	};

	// Confirm create subtask
	const handleConfirmCreateSubtask = async (name: string) => {
		setIsCreating(true);
		try {
			await problemService.createSubtask(problem.id, {
				name,
			});

			// Refresh subtasks data
			mutateSubtasks();

			toast.success(t('success.title'), {
				description: t('success.subtask_created'),
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(t('error.title'), {
				description: error?.response?.data?.message || t('error.create_subtask'),
			});
		} finally {
			setIsCreating(false);
		}
	};

	// Delete subtask
	const handleDeleteSubtask = async (subtaskId: string) => {
		setCurrentSubtaskId(subtaskId);
		setIsDeleteSubtaskDialogOpen(true);
	};

	// Confirm delete subtask
	const handleConfirmDeleteSubtask = async () => {
		if (!currentSubtaskId) return;

		setIsDeleting(true);
		try {
			await problemService.deleteSubtask(problem.id, currentSubtaskId);

			// Refresh subtasks data
			mutateSubtasks();

			toast.success(t('success.title'), {
				description: t('success.subtask_deleted'),
			});
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			toast.error(t('error.title'), {
				description: error?.response?.data?.message || t('error.delete_subtask'),
			});
		} finally {
			setIsDeleting(false);
			setIsDeleteSubtaskDialogOpen(false);
		}
	};

	// Render tree items with action buttons
	const renderTreeItems = () => {
		if (!subtasks) return null;

		return subtasks.map((subtask: Subtask) => (
			<div key={`subtask-${subtask.id}`} className="group">
				<TreeItem
					nodeId={`subtask-${subtask.id}`}
					label={subtask.name}
					hasChildren
					data={{ subtaskId: subtask.slug }}
					level={0}
					className="pr-16" // Add padding to accommodate buttons
					actions={
						<>
							<Button
								size="icon"
								variant="outline"
								className="h-6 w-6"
								onClick={(e) => {
									e.stopPropagation();
									handleCreateTestCase(subtask.slug);
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
									handleDeleteSubtask(subtask.slug);
								}}
								aria-label="Delete subtask"
							>
								<Trash2 className="h-3 w-3" />
							</Button>
						</>
					}
				>
					{subtask.testCases.map((testCase: TestCase) => (
						<div key={`testcase-${testCase.id}`} className="group">
							<TreeItem
								nodeId={`testcase-${testCase.id}`}
								label={testCase.name}
								hasChildren={true}
								data={{ subtaskId: subtask.slug, testCaseId: testCase.slug }}
								level={1}
								className="pr-10" // Add padding to accommodate buttons
								actions={
									<Button
										size="icon"
										variant="outline"
										className="h-6 w-6"
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteTestCase(subtask.slug, testCase.slug);
										}}
										aria-label="Delete testcase"
									>
										<Trash2 className="h-3 w-3" />
									</Button>
								}
							>
								<TreeItem
									nodeId={`input-${testCase.id}`}
									label={t('input')}
									hasChildren={false}
									data={{ subtaskId: subtask.slug, testCaseId: testCase.slug }}
									level={2}
								/>
								<TreeItem
									nodeId={`output-${testCase.id}`}
									label={t('output')}
									hasChildren={false}
									data={{ subtaskId: subtask.slug, testCaseId: testCase.slug }}
									level={2}
								/>
							</TreeItem>
						</div>
					))}
				</TreeItem>
			</div>
		));
	};

	// Show loading state
	if (subtasksLoading) {
		return (
			<div className="flex h-[calc(100vh-200px)] items-center justify-center">
				<p className="text-muted-foreground">{t('loading')}</p>
			</div>
		);
	}

	return (
		<div className="h-[calc(100vh-200px)] overflow-hidden rounded-lg border">
			<ResizablePanelGroup direction="horizontal" className="h-full">
				<ResizablePanel defaultSize={33} minSize={20} maxSize={50}>
					<div className="h-full">
						<TreeProvider selectable multiSelect={false} onNodeClick={handleNodeSelect} indent={24}>
							<Tree>
								{renderTreeItems()}
								<div className="px-3 py-2">
									<TestcaseActionButtons type="new-subtask" onCreateSubtask={handleCreateSubtask} />
								</div>
							</Tree>
						</TreeProvider>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={67}>
					<div className="flex h-full flex-col">
						{isEditing ? (
							<>
								<div className="flex items-center justify-between border-b px-4 py-2">
									<Breadcrumb>
										<BreadcrumbList>
											{breadcrumbPath.map((item, index) => (
												<React.Fragment key={index}>
													<BreadcrumbItem>
														<BreadcrumbLink className={index === breadcrumbPath.length - 1 ? 'font-semibold' : ''}>{item.label}</BreadcrumbLink>
													</BreadcrumbItem>
													{index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
												</React.Fragment>
											))}
										</BreadcrumbList>
									</Breadcrumb>
									<Button onClick={handleSave} disabled={isSaving}>
										{isSaving ? t('saving') : t('save')}
									</Button>
								</div>
								<div className="bg-background flex-1">
									<Textarea
										value={selectedNode?.startsWith('input-') ? content?.input || '' : content?.output || ''}
										onChange={(e) => {
											if (selectedNode?.startsWith('input-')) {
												setContent((prev) => (prev ? { ...prev, input: e.target.value } : null));
											} else {
												setContent((prev) => (prev ? { ...prev, output: e.target.value } : null));
											}
										}}
										className="h-full min-h-[400px] border-0 font-mono text-sm shadow-none !ring-0"
										placeholder={t('content_placeholder')}
									/>
								</div>
							</>
						) : (
							<div className="flex flex-1 items-center justify-center">
								<p className="text-muted-foreground">{t('select_to_edit')}</p>
							</div>
						)}
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>

			{/* Create Subtask Dialog */}
			<CreateItemDialog
				open={isCreateSubtaskDialogOpen}
				onOpenChange={setIsCreateSubtaskDialogOpen}
				itemType="subtask"
				onCreate={handleConfirmCreateSubtask}
				isLoading={isCreating}
			/>

			{/* Create Testcase Dialog */}
			<CreateItemDialog
				open={isCreateTestcaseDialogOpen}
				onOpenChange={setIsCreateTestcaseDialogOpen}
				itemType="testcase"
				onCreate={handleConfirmCreateTestCase}
				isLoading={isCreating}
			/>

			{/* Delete Subtask Confirmation Dialog */}
			<ConfirmDialog
				open={isDeleteSubtaskDialogOpen}
				onOpenChange={setIsDeleteSubtaskDialogOpen}
				title={t('delete_subtask_title')}
				description={t('delete_subtask_description')}
				onConfirm={handleConfirmDeleteSubtask}
				isLoading={isDeleting}
			/>

			{/* Delete Testcase Confirmation Dialog */}
			<ConfirmDialog
				open={isDeleteTestcaseDialogOpen}
				onOpenChange={setIsDeleteTestcaseDialogOpen}
				title={t('delete_testcase_title')}
				description={t('delete_testcase_description')}
				onConfirm={handleConfirmDeleteTestCase}
				isLoading={isDeleting}
			/>
		</div>
	);
};

export default TestcaseTab;
