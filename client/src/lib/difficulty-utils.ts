import { Difficulty } from '~/types/problem.type';

/**
 * Get CSS classes for styling difficulty badges
 */
export const getDifficultyColor = (difficulty: Difficulty): string => {
	switch (difficulty) {
		case 'easy':
			return 'text-success bg-success/10';
		case 'medium':
			return 'text-warning bg-warning/10';
		case 'hard':
			return 'text-destructive bg-destructive/10';
		default:
			return '';
	}
};

export const getDifficultyTextColor = (difficulty: Difficulty) => {
	switch (difficulty) {
		case 'easy':
			return 'text-success';
		case 'medium':
			return 'text-warning';
		case 'hard':
			return 'text-destructive';
		default:
			return '';
	}
};

export const getDifficultyBgColor = (difficulty: Difficulty) => {
	switch (difficulty) {
		case 'easy':
			return 'bg-success';
		case 'medium':
			return 'bg-warning';
		case 'hard':
			return 'bg-destructive';
		default:
			return '';
	}
};
