'use client';

import { AlertTriangle, ArrowLeft, Calendar, ChevronDown, ChevronRight, Clock, Code, Database, FileText, TestTube, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { createClientService } from '~/lib/service-client';
import { formatSubmissionStatus, getSubmissionStatusColor } from '~/lib/status-utils';
import { createSubmissionService } from '~/services/submission';
import { SubmissionResult } from '~/types/submission-result.type';
import { Submission, SubmissionStatus } from '~/types/submission.type';

const SubmissionDetailPage = () => {
	const t = useTranslations('submission.detail');
	const params = useParams();
	const router = useRouter();
	const submissionId = params.id as string;

	const [submission, setSubmission] = useState<Submission | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState('source-code');
	const [expandedSubtasks, setExpandedSubtasks] = useState<Set<string>>(new Set());

	useEffect(() => {
		const fetchSubmission = async () => {
			try {
				setLoading(true);
				const submissionService = createClientService(createSubmissionService);
				const result = await submissionService.findOneSubmission(submissionId);
				setSubmission(result.submission);

				// Auto-expand all subtasks on first load
				if (result.submission.results) {
					const subtaskSlugs = new Set(result.submission.results.map((r) => r.slug.split('/')[0]));
					setExpandedSubtasks(subtaskSlugs);
				}
			} catch (err) {
				setError('Submission not found');
			} finally {
				setLoading(false);
			}
		};

		if (submissionId) {
			fetchSubmission();
		}
	}, [submissionId]);

	// Determine the second tab based on submission status
	const getSecondTabConfig = () => {
		if (!submission) return { key: 'test-cases', label: t('tabs.test_cases'), icon: TestTube };

		const hasErrorStatus = [SubmissionStatus.INTERNAL_ERROR, SubmissionStatus.COMPILATION_ERROR].includes(submission.status);

		return hasErrorStatus ? { key: 'log', label: t('tabs.log'), icon: AlertTriangle } : { key: 'test-cases', label: t('tabs.test_cases'), icon: TestTube };
	};

	const secondTab = getSecondTabConfig();

	// Organize results by subtasks for tree view
	const organizeResultsBySubtasks = () => {
		if (!submission?.results) return new Map();

		const subtasksMap = new Map<
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

		submission.results.forEach((result) => {
			const [subtaskSlug] = result.slug.split('/');
			const subtaskName = result.subtaskName || subtaskSlug;

			if (!subtasksMap.has(subtaskSlug)) {
				subtasksMap.set(subtaskSlug, {
					name: subtaskName,
					slug: subtaskSlug,
					testCases: [],
					status: 'ACCEPTED',
					passedCount: 0,
					totalCount: 0,
				});
			}

			const subtask = subtasksMap.get(subtaskSlug)!;
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

		return subtasksMap;
	};

	const toggleSubtaskExpansion = (subtaskSlug: string) => {
		setExpandedSubtasks((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(subtaskSlug)) {
				newSet.delete(subtaskSlug);
			} else {
				newSet.add(subtaskSlug);
			}
			return newSet;
		});
	};

	const toggleAllSubtasks = () => {
		if (expandedSubtasks.size === subtasksData.size) {
			// All expanded, collapse all
			setExpandedSubtasks(new Set());
		} else {
			// Some or none expanded, expand all
			setExpandedSubtasks(new Set(subtasksData.keys()));
		}
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

	const subtasksData = organizeResultsBySubtasks();

	if (loading) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-6">
				<div className="space-y-4">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-64 w-full" />
				</div>
			</div>
		);
	}

	if (error || !submission) {
		return (
			<div className="container mx-auto max-w-4xl px-4 py-6">
				<Card>
					<CardContent className="py-8 text-center">
						<Code className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
						<h3 className="mb-2 text-lg font-semibold">{t('content.not_found.title')}</h3>
						<p className="text-muted-foreground mb-4">{t('content.not_found.message')}</p>
						<Button asChild>
							<Link href="/submission">{t('content.not_found.back_button')}</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-4xl px-4 py-6">
			{/* Breadcrumb */}
			<div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
				<Link href="/" className="hover:text-foreground">
					{t('breadcrumb.home')}
				</Link>
				<span>/</span>
				<Link href="/submission" className="hover:text-foreground">
					{t('breadcrumb.submissions')}
				</Link>
				<span>/</span>
				<span>{submission.id.slice(0, 8)}...</span>
			</div>

			{/* Header */}
			<div className="mb-6">
				<div className="mb-4 flex items-center gap-2">
					<Button variant="ghost" size="sm" onClick={() => router.back()}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						{t('actions.back')}
					</Button>
				</div>

				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<Code className="h-5 w-5" />
								{t('title')}
							</CardTitle>
							<Badge className={getSubmissionStatusColor(submission.status)}>{formatSubmissionStatus(submission.status)}</Badge>
						</div>
						<div className="text-muted-foreground text-sm">
							{t('info.id')}: {submission.id}
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Submission Info */}
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<User className="text-muted-foreground h-4 w-4" />
									<span className="font-medium">{t('info.author')}:</span>
									<span>{submission.author.username}</span>
								</div>
								{submission.problem && (
									<div className="flex items-center gap-2">
										<Code className="text-muted-foreground h-4 w-4" />
										<span className="font-medium">{t('info.problem')}:</span>
										<Link href={`/problem/${submission.problem.slug}`} className="text-primary hover:underline">
											{submission.problem.title}
										</Link>
									</div>
								)}
								<div className="flex items-center gap-2">
									<span className="font-medium">{t('info.language')}:</span>
									<Badge variant="outline">{submission.language}</Badge>
								</div>
							</div>
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<span className="font-medium">{t('info.score')}:</span>
									<span>{submission.totalScore || 0}</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="text-muted-foreground h-4 w-4" />
									<span className="font-medium">{t('info.submitted')}:</span>
									<span>{new Date(submission.submittedAt).toLocaleString()}</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabbed Content */}
			<Card className="mb-6">
				<CardHeader>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList>
							<TabsTrigger value="source-code" className="flex items-center gap-2">
								<FileText className="h-4 w-4" />
								{t('tabs.source_code')}
							</TabsTrigger>
							<TabsTrigger value={secondTab.key} className="flex items-center gap-2">
								<secondTab.icon className="h-4 w-4" />
								{secondTab.label}
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardHeader>
				<CardContent>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						{/* Source Code Tab */}
						<TabsContent value="source-code">
							<pre className="bg-muted overflow-x-auto rounded-lg p-4">
								<code className="font-mono text-sm">{submission.sourceCode}</code>
							</pre>
						</TabsContent>

						{/* Log Tab (for IE/CE) */}
						<TabsContent value="log">
							{submission.log ? (
								<pre className="bg-muted overflow-x-auto rounded-lg p-4 text-sm">{submission.log}</pre>
							) : (
								<div className="text-muted-foreground py-8 text-center">
									<AlertTriangle className="mx-auto mb-4 h-12 w-12" />
									<p>{t('content.no_log_available')}</p>
								</div>
							)}
						</TabsContent>

						{/* Test Cases Tab */}
						<TabsContent value="test-cases">
							{subtasksData.size > 0 ? (
								<div className="space-y-4">
									{/* Controls Header */}
									<div className="flex items-center justify-between">
										<div className="text-muted-foreground text-sm">
											{subtasksData.size} {subtasksData.size === 1 ? 'subtask' : 'subtasks'}
										</div>
										<Button variant="ghost" size="sm" onClick={toggleAllSubtasks} className="text-xs">
											{expandedSubtasks.size === subtasksData.size ? t('content.collapse_all') : t('content.expand_all')}
										</Button>
									</div>
									{Array.from(subtasksData.entries()).map(([subtaskSlug, subtask]) => {
										const isExpanded = expandedSubtasks.has(subtaskSlug);

										return (
											<div key={subtaskSlug} className="overflow-hidden rounded-lg border">
												{/* Subtask Header */}
												<div
													className="bg-muted/50 hover:bg-muted/70 flex cursor-pointer items-center justify-between p-4 transition-colors"
													onClick={() => toggleSubtaskExpansion(subtaskSlug)}
												>
													<div className="flex items-center gap-3">
														<div className="flex items-center gap-2">
															{isExpanded ? (
																<ChevronDown className="text-muted-foreground h-4 w-4" />
															) : (
																<ChevronRight className="text-muted-foreground h-4 w-4" />
															)}
															<TestTube className="text-muted-foreground h-4 w-4" />
														</div>
														<span className="font-semibold">{subtask.name}</span>
														<Badge className={getSubtaskStatusColor(subtask.status)}>
															{subtask.status === 'PARTIAL' ? `${subtask.passedCount}/${subtask.totalCount}` : subtask.status}
														</Badge>
													</div>
													<div className="text-muted-foreground text-sm">
														{t('content.tests_passed', { passed: subtask.passedCount, total: subtask.totalCount })}
													</div>
												</div>

												{/* Test Cases List */}
												{isExpanded && (
													<div className="bg-background border-t">
														{subtask.testCases.map((result: SubmissionResult, index: number) => (
															<div
																key={result.id}
																className={`flex items-center justify-between p-4 pl-8 ${index < subtask.testCases.length - 1 ? 'border-b' : ''}`}
															>
																<div className="flex items-center gap-4">
																	<div className="flex items-center gap-2">
																		<div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs">
																			{index + 1}
																		</div>
																		<span className="font-medium">{result.testCaseName || `Test ${index + 1}`}</span>
																	</div>
																	<Badge className={getSubmissionStatusColor(result.status)}>{formatSubmissionStatus(result.status)}</Badge>
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
									})}
								</div>
							) : (
								<div className="text-muted-foreground py-8 text-center">
									<TestTube className="mx-auto mb-4 h-12 w-12" />
									<p>{t('content.no_test_cases_available')}</p>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<div className="mt-6 flex gap-4">
				<Button asChild>
					<Link href={`/submit?problem=${submission.problem?.slug}`}>
						<Code className="mr-2 h-4 w-4" />
						{t('actions.submit_again')}
					</Link>
				</Button>
				<Button variant="outline" asChild>
					<Link href={`/submission?problem=${submission.problem?.id}`}>{t('actions.view_all_submissions')}</Link>
				</Button>
			</div>
		</div>
	);
};

export default SubmissionDetailPage;
