'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { AsyncCombobox, FetcherResponse } from '~/components/async-combobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { languageOptions } from '~/lib/language-utils';
import { createClientService } from '~/lib/service-client';
import { getSubmissionStatusTextColor } from '~/lib/status-utils';
import { contestServiceInstance } from '~/services/contest';
import { problemServiceInstance } from '~/services/problem';
import { userServiceInstance } from '~/services/user';
import { SubmissionStatus } from '~/types/submission.type';

interface SubmissionFilterProps {
	problemId: string;
	language: string;
	status: string;
	authorId: string;
	contestId: string;
	onProblemChange: (value: string) => void;
	onLanguageChange: (value: string) => void;
	onStatusChange: (value: string) => void;
	onAuthorChange: (value: string) => void;
	onContestChange: (value: string) => void;
}

const SubmissionFilter = ({
	problemId,
	language,
	status,
	authorId,
	contestId,
	onProblemChange,
	onLanguageChange,
	onStatusChange,
	onAuthorChange,
	onContestChange,
}: SubmissionFilterProps) => {
	const t = useTranslations('admin.submission');

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

	const problemService = createClientService(problemServiceInstance);
	const userService = createClientService(userServiceInstance);
	const contestService = createClientService(contestServiceInstance);

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

	const contestFetcher = useCallback(
		async (page: number, limit: number, query: string): Promise<FetcherResponse> => {
			try {
				const response = await contestService.findAllContests({
					page,
					limit,
					search: query || undefined,
					sortBy: 'title',
					sortOrder: 'ASC',
				});
				return {
					items: response.contests.data.map((contest) => ({
						value: contest.id,
						label: contest.title,
					})),
					has_more: response.contests.data.length === limit,
				};
			} catch (error) {
				console.error('Contest fetcher error:', error);
				return { items: [], has_more: false };
			}
		},
		[contestService],
	);

	return (
		<div className="flex flex-wrap gap-2">
			<div>
				<AsyncCombobox value={problemId} set_value={onProblemChange} fetcher={problemFetcher} placeholder={t('filters.problem_placeholder')} page_size={20} />
			</div>
			<Select value={language} onValueChange={onLanguageChange}>
				<SelectTrigger>
					<SelectValue placeholder={t('filters.select_language')} />
				</SelectTrigger>
				<SelectContent>
					{submissionLanguageOptions.map((option) => (
						<SelectItem key={option.value} value={option.value} className="font-medium">
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select value={status} onValueChange={onStatusChange}>
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
			<div>
				<AsyncCombobox value={authorId} set_value={onAuthorChange} fetcher={authorFetcher} placeholder={t('filters.author_placeholder')} page_size={20} />
			</div>
			<div>
				<AsyncCombobox value={contestId} set_value={onContestChange} fetcher={contestFetcher} placeholder={t('filters.contest_placeholder')} page_size={20} />
			</div>
		</div>
	);
};

export default SubmissionFilter;
