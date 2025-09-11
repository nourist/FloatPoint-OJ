import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

import { SubmissionResultStatus } from '~/types/submission-result.type';
import { SubmissionStatus } from '~/types/submission.type';

/**
 * Get CSS classes for styling submission status badges
 */
export const getSubmissionStatusColor = (status: SubmissionStatus | SubmissionResultStatus): string => {
	switch (status) {
		case SubmissionStatus.ACCEPTED:
		case SubmissionResultStatus.ACCEPTED:
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
		case SubmissionStatus.WRONG_ANSWER:
		case SubmissionResultStatus.WRONG_ANSWER:
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
		case SubmissionStatus.TIME_LIMIT_EXCEEDED:
		case SubmissionResultStatus.TIME_LIMIT_EXCEEDED:
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
		case SubmissionStatus.MEMORY_LIMIT_EXCEEDED:
		case SubmissionResultStatus.MEMORY_LIMIT_EXCEEDED:
			return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
		case SubmissionStatus.RUNTIME_ERROR:
		case SubmissionResultStatus.RUNTIME_ERROR:
			return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
		case SubmissionStatus.COMPILATION_ERROR:
			return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
		case SubmissionStatus.PENDING:
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
		case SubmissionStatus.JUDGING:
			return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
	}
};

/**
 * Get CSS classes for text color only (no background) for status items
 */
export const getSubmissionStatusTextColor = (status: SubmissionStatus | SubmissionResultStatus): string => {
	switch (status) {
		case SubmissionStatus.ACCEPTED:
		case SubmissionResultStatus.ACCEPTED:
			return 'text-green-600 dark:text-green-400';
		case SubmissionStatus.WRONG_ANSWER:
		case SubmissionResultStatus.WRONG_ANSWER:
			return 'text-red-600 dark:text-red-400';
		case SubmissionStatus.TIME_LIMIT_EXCEEDED:
		case SubmissionResultStatus.TIME_LIMIT_EXCEEDED:
			return 'text-yellow-600 dark:text-yellow-400';
		case SubmissionStatus.MEMORY_LIMIT_EXCEEDED:
		case SubmissionResultStatus.MEMORY_LIMIT_EXCEEDED:
			return 'text-orange-600 dark:text-orange-400';
		case SubmissionStatus.RUNTIME_ERROR:
		case SubmissionResultStatus.RUNTIME_ERROR:
			return 'text-purple-600 dark:text-purple-400';
		case SubmissionStatus.COMPILATION_ERROR:
			return 'text-rose-600 dark:text-rose-400';
		case SubmissionStatus.PENDING:
			return 'text-blue-600 dark:text-blue-400';
		case SubmissionStatus.JUDGING:
			return 'text-cyan-600 dark:text-cyan-400';
		default:
			return 'text-gray-600 dark:text-gray-400';
	}
};

/**
 * Get CSS classes for background color only (no text color) for status items
 */
export const getSubmissionStatusBgColor = (status: SubmissionStatus | SubmissionResultStatus): string => {
	switch (status) {
		case SubmissionStatus.ACCEPTED:
		case SubmissionResultStatus.ACCEPTED:
			return 'bg-green-500';
		case SubmissionStatus.WRONG_ANSWER:
		case SubmissionResultStatus.WRONG_ANSWER:
			return 'bg-red-500';
		case SubmissionStatus.TIME_LIMIT_EXCEEDED:
		case SubmissionResultStatus.TIME_LIMIT_EXCEEDED:
			return 'bg-yellow-500';
		case SubmissionStatus.MEMORY_LIMIT_EXCEEDED:
		case SubmissionResultStatus.MEMORY_LIMIT_EXCEEDED:
			return 'bg-orange-500';
		case SubmissionStatus.RUNTIME_ERROR:
		case SubmissionResultStatus.RUNTIME_ERROR:
			return 'bg-purple-500';
		case SubmissionStatus.COMPILATION_ERROR:
			return 'bg-rose-500';
		case SubmissionStatus.PENDING:
			return 'bg-blue-500';
		case SubmissionStatus.JUDGING:
			return 'bg-cyan-500';
		default:
			return 'bg-gray-500';
	}
};

export const getSubmissionStatusVarColor = (status: SubmissionStatus | SubmissionResultStatus): string => {
	switch (status) {
		case SubmissionStatus.ACCEPTED:
		case SubmissionResultStatus.ACCEPTED:
			return 'var(--color-green-500)';
		case SubmissionStatus.WRONG_ANSWER:
		case SubmissionResultStatus.WRONG_ANSWER:
			return 'var(--color-red-500)';
		case SubmissionStatus.TIME_LIMIT_EXCEEDED:
		case SubmissionResultStatus.TIME_LIMIT_EXCEEDED:
			return 'var(--color-yellow-500)';
		case SubmissionStatus.MEMORY_LIMIT_EXCEEDED:
		case SubmissionResultStatus.MEMORY_LIMIT_EXCEEDED:
			return 'var(--color-orange-500)';
		case SubmissionStatus.RUNTIME_ERROR:
		case SubmissionResultStatus.RUNTIME_ERROR:
			return 'var(--color-purple-500)';
		case SubmissionStatus.COMPILATION_ERROR:
			return 'var(--color-rose-500)';
		case SubmissionStatus.PENDING:
			return 'var(--color-blue-500)';
		case SubmissionStatus.JUDGING:
			return 'var(--color-cyan-500)';
		default:
			return 'var(--color-gray-500)';
	}
};

/**
 * Format submission status enum to human-readable string
 */
export const formatSubmissionStatus = (status: SubmissionStatus | SubmissionResultStatus): string => {
	return status
		.replace(/_/g, ' ')
		.toLowerCase()
		.replace(/\b\w/g, (l) => l.toUpperCase());
};

// Get alert color classes based on submission status using Tailwind classes
export const getAlertColorClasses = (status: SubmissionStatus) => {
	switch (status) {
		case SubmissionStatus.ACCEPTED:
			return {
				border: 'border-green-500',
				background: 'bg-green-50 dark:bg-green-950/50',
				iconBackground: 'bg-green-100 dark:bg-green-900/50',
				iconColor: 'text-green-600 dark:text-green-400',
				text: 'text-green-700 dark:text-green-400',
			};
		case SubmissionStatus.WRONG_ANSWER:
		case SubmissionStatus.RUNTIME_ERROR:
		case SubmissionStatus.COMPILATION_ERROR:
		case SubmissionStatus.INTERNAL_ERROR:
			return {
				border: 'border-red-500',
				background: 'bg-red-50 dark:bg-red-950/50',
				iconBackground: 'bg-red-100 dark:bg-red-900/50',
				iconColor: 'text-red-600 dark:text-red-400',
				text: 'text-red-700 dark:text-red-400',
			};
		case SubmissionStatus.PENDING:
		case SubmissionStatus.JUDGING:
			return {
				border: 'border-blue-500',
				background: 'bg-blue-50 dark:bg-blue-950/50',
				iconBackground: 'bg-blue-100 dark:bg-blue-900/50',
				iconColor: 'text-blue-600 dark:text-blue-400',
				text: 'text-blue-700 dark:text-blue-400',
			};
		case SubmissionStatus.TIME_LIMIT_EXCEEDED:
		case SubmissionStatus.MEMORY_LIMIT_EXCEEDED:
		default:
			return {
				border: 'border-amber-500',
				background: 'bg-amber-50 dark:bg-amber-950/50',
				iconBackground: 'bg-amber-100 dark:bg-amber-900/50',
				iconColor: 'text-amber-600 dark:text-amber-400',
				text: 'text-amber-700 dark:text-amber-400',
			};
	}
};

// Get appropriate icon based on submission status
export const getStatusIcon = (status: SubmissionStatus) => {
	switch (status) {
		case SubmissionStatus.ACCEPTED:
			return CheckCircle;
		case SubmissionStatus.WRONG_ANSWER:
		case SubmissionStatus.RUNTIME_ERROR:
		case SubmissionStatus.COMPILATION_ERROR:
		case SubmissionStatus.INTERNAL_ERROR:
			return XCircle;
		case SubmissionStatus.PENDING:
		case SubmissionStatus.JUDGING:
			return Clock;
		case SubmissionStatus.TIME_LIMIT_EXCEEDED:
		case SubmissionStatus.MEMORY_LIMIT_EXCEEDED:
		default:
			return AlertTriangle;
	}
};
