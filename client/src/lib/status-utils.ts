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
 * Format submission status enum to human-readable string
 */
export const formatSubmissionStatus = (status: SubmissionStatus | SubmissionResultStatus): string => {
	return status
		.replace(/_/g, ' ')
		.toLowerCase()
		.replace(/\b\w/g, (l) => l.toUpperCase());
};
