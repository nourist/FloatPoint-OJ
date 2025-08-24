'use client';

import { Calendar, Code, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import useSWR from 'swr';

import { AsyncCombobox, FetcherResponse } from '~/components/async-combobox';
import PaginationControls from '~/components/pagination-controls';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Skeleton } from '~/components/ui/skeleton';
import { languageOptions } from '~/lib/language-options';
import { createClientService } from '~/lib/service-client';
import { formatSubmissionStatus, getSubmissionStatusColor, getSubmissionStatusTextColor } from '~/lib/status-utils';
import { createProblemService } from '~/services/problem';
import { createSubmissionService } from '~/services/submission';
import { createUserService } from '~/services/user';
import { ProgramLanguage, SubmissionStatus } from '~/types/submission.type';

const SubmissionsPage = () => {
	const t = useTranslations('submission');

	// Local filter states (no URL synchronization)
	const [problemId, setProblemId] = useState('');
	const [language, setLanguage] = useState('all');
	const [status, setStatus] = useState('all');
	const [authorId, setAuthorId] = useState('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);

	const submissionLanguageOptions = [{ value: 'all', label: t('filters.all_languages') }, ...languageOptions];

	const statusOptions = [
		{
			value: 'all',
			label: t('filters.all_status'),
			textColor: 'text-gray-600 dark:text-gray-400',
		},
		{
			value: SubmissionStatus.ACCEPTED,
			label: t('status.accepted'),
			textColor: getSubmissionStatusTextColor(SubmissionStatus.ACCEPTED),
		},
		{
			value: SubmissionStatus.WRONG_ANSWER,
			label: t('status.wrong_answer'),
			textColor: getSubmissionStatusTextColor(SubmissionStatus.WRONG_ANSWER),
		},
		{
			value: SubmissionStatus.TIME_LIMIT_EXCEEDED,
			label: t('status.time_limit_exceeded'),
			textColor: getSubmissionStatusTextColor(SubmissionStatus.TIME_LIMIT_EXCEEDED),
		},
		{
			value: SubmissionStatus.MEMORY_LIMIT_EXCEEDED,
			label: t('status.memory_limit_exceeded'),
			textColor: getSubmissionStatusTextColor(SubmissionStatus.MEMORY_LIMIT_EXCEEDED),
		},
		{
			value: SubmissionStatus.RUNTIME_ERROR,
			label: t('status.runtime_error'),
			textColor: getSubmissionStatusTextColor(SubmissionStatus.RUNTIME_ERROR),
		},
		{
			value: SubmissionStatus.COMPILATION_ERROR,
			label: t('status.compilation_error'),
			textColor: getSubmissionStatusTextColor(SubmissionStatus.COMPILATION_ERROR),
		},
		{
			value: SubmissionStatus.PENDING,
			label: t('status.pending'),
			textColor: getSubmissionStatusTextColor(SubmissionStatus.PENDING),
		},
		{
			value: SubmissionStatus.JUDGING,
			label: t('status.judging'),
			textColor: getSubmissionStatusTextColor(SubmissionStatus.JUDGING),
		},
	];

	const submissionService = createClientService(createSubmissionService);
	const problemService = createClientService(createProblemService);
	const userService = createClientService(createUserService);

	// Fetcher functions for AsyncCombobox
	const problemFetcher = useCallback(
		async (page: number, limit: number, query: string): Promise<FetcherResponse> => {
			try {
				const response = await problemService.findAllProblems({
					q: query || undefined,
					page,
					limit,
					sortBy: 'title',
					order: 'ASC',
				});
				return {
					items: response.problems.map((problem) => ({
						value: problem.id,
						label: problem.title,
					})),
					has_more: response.problems.length === limit,
				};
			} catch (error) {
				console.error('Problem fetcher error:', error);
				return { items: [], has_more: false };
			}
		},
		[problemService],
	);

	const authorFetcher = useCallback(
		async (page: number, limit: number, query: string): Promise<FetcherResponse> => {
			try {
				const response = await userService.getUsers({
					q: query || undefined,
					page,
					limit,
					sortBy: 'username',
					sortOrder: 'ASC',
				});
				return {
					items: response.users.map((user) => ({
						value: user.id,
						label: user.fullname && user.fullname.trim() ? `${user.username} (${user.fullname})` : user.username,
					})),
					has_more: response.users.length === limit,
				};
			} catch (error) {
				console.error('Author fetcher error:', error);
				return { items: [], has_more: false };
			}
		},
		[userService],
	);

	// SWR with local state as keys - only send non-empty values
	const swrKey = {
		...(problemId && problemId.trim() && { problemId: problemId.trim() }),
		...(language && language.trim() && language !== 'all' && { language: language as ProgramLanguage }),
		...(status && status.trim() && status !== 'all' && { status: status as SubmissionStatus }),
		...(authorId && authorId.trim() && { authorId: authorId.trim() }),
		page,
		limit,
	};

	const { data, error, isLoading } = useSWR(swrKey, submissionService.findAllSubmissions, {
		keepPreviousData: true,
		revalidateOnFocus: false,
	});

	if (!data) {
		if (!isLoading) throw error;
	}

	const submissions = data?.submissions || [];
	const total = data?.total || 0;
	const loading = isLoading;

	// Handler functions for filter changes
	const handleProblemChange = (value: string) => {
		setProblemId(value);
		setPage(1); // Reset to first page when filter changes
	};

	const handleLanguageChange = (value: string) => {
		setLanguage(value);
		setPage(1);
	};

	const handleStatusChange = (value: string) => {
		setStatus(value);
		setPage(1);
	};

	const handleAuthorChange = (value: string) => {
		setAuthorId(value);
		setPage(1);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleSizeChange = (newSize: number) => {
		setLimit(newSize);
		setPage(1); // Reset to first page when changing size
	};

	return (
		<div className="container mx-auto max-w-7xl px-4 py-6">
			{/* Breadcrumb */}
			<div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
				<Link href="/" className="hover:text-foreground">
					{t('page.breadcrumb.home')}
				</Link>
				<span>/</span>
				<span>{t('page.breadcrumb.submissions')}</span>
			</div>

			{/* Header */}
			<div className="mb-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Code className="h-5 w-5" />
							{t('page.title')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{/* Filters */}
						<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
							<div className="space-y-2">
								<Label>{t('filters.problem')}</Label>
								<AsyncCombobox
									value={problemId}
									set_value={handleProblemChange}
									fetcher={problemFetcher}
									placeholder={t('filters.problem_placeholder')}
									page_size={20}
								/>
							</div>
							<div className="space-y-2">
								<Label>{t('filters.language')}</Label>
								<Select value={language} onValueChange={handleLanguageChange}>
									<SelectTrigger>
										<SelectValue placeholder={t('filters.select_language')} />
									</SelectTrigger>
									<SelectContent>
										{submissionLanguageOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>{t('filters.status')}</Label>
								<Select value={status} onValueChange={handleStatusChange}>
									<SelectTrigger>
										<SelectValue placeholder={t('filters.select_status')} />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((option) => (
											<SelectItem key={option.value} value={option.value} className={`font-medium ${option.textColor}`}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>{t('filters.author')}</Label>
								<AsyncCombobox
									value={authorId}
									set_value={handleAuthorChange}
									fetcher={authorFetcher}
									placeholder={t('filters.author_placeholder')}
									page_size={20}
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{total > 0 ? t('page.list_title', { count: total }) : t('page.submissions_title')}</CardTitle>
				</CardHeader>
				<CardContent>
					{loading ? (
						<div className="space-y-4">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="space-y-2 rounded-lg border p-4">
									<Skeleton className="h-4 w-1/4" />
									<Skeleton className="h-4 w-1/2" />
									<Skeleton className="h-4 w-1/3" />
								</div>
							))}
						</div>
					) : error ? (
						<div className="py-8 text-center">
							<p className="text-muted-foreground">{t('messages.error.load_failed')}</p>
						</div>
					) : submissions.length === 0 ? (
						<div className="py-8 text-center">
							<Code className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
							<h3 className="mb-2 text-lg font-semibold">{t('page.no_submissions.title')}</h3>
							<p className="text-muted-foreground mb-4">
								{problemId || (language && language !== 'all') || (status && status !== 'all') || authorId
									? t('page.no_submissions.filtered')
									: t('page.no_submissions.empty')}
							</p>
							<Button asChild>
								<Link href="/submit">{t('page.actions.submit_code')}</Link>
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{submissions.map((submission) => (
								<div key={submission.id} className="hover:bg-muted/50 rounded-lg border p-4 transition-colors">
									<div className="mb-2 flex items-center justify-between">
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-2">
												<User className="text-muted-foreground h-4 w-4" />
												<span className="font-medium">{submission.author.username}</span>
											</div>
											{submission.problem && (
												<Link href={`/problem/${submission.problem.slug}`} className="text-primary font-medium hover:underline">
													{submission.problem.title}
												</Link>
											)}
										</div>
										<Badge className={getSubmissionStatusColor(submission.status)}>{formatSubmissionStatus(submission.status)}</Badge>
									</div>

									<div className="text-muted-foreground mb-2 flex items-center gap-4 text-sm">
										<span className="font-mono">{submission.language}</span>
										<span>
											{t('page.common.score')}: {submission.totalScore || 0}
										</span>
										<div className="flex items-center gap-1">
											<Calendar className="h-3 w-3" />
											{new Date(submission.submittedAt).toLocaleString()}
										</div>
									</div>

									<div className="flex items-center justify-between">
										<div className="text-muted-foreground text-xs">ID: {submission.id}</div>
										<Button variant="ghost" size="sm" asChild>
											<Link href={`/submission/${submission.id}`}>{t('page.actions.view_details')}</Link>
										</Button>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Pagination */}
					{total > 0 && (
						<div className="mt-6">
							<PaginationControls
								totalItems={total}
								initialPage={page}
								initialSize={limit}
								onPageChange={handlePageChange}
								onSizeChange={handleSizeChange}
								isLoading={loading}
								sizes={[10, 20, 50, 100]}
							/>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default SubmissionsPage;
