import { Difficulty } from '~/types/problem.type';

/**
 * Get CSS classes for styling difficulty badges
 */
export const getDifficultyColor = (difficulty: Difficulty): string => {
	switch (difficulty) {
		case 'easy':
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
		case 'medium':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
		case 'hard':
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
	}
};
