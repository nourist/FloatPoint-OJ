import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

const Pagination = ({ currentPage, setPage, maxPage, className = '' }) => {
	const { t } = useTranslation('pagination');

	useEffect(() => {
		if (currentPage > maxPage && maxPage != 0) setPage(maxPage);
		if (currentPage <= 0) setPage(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [maxPage]);

	if (maxPage <= 0) return <></>;

	return (
		<div className={`flex items-center gap-1 text-gray-800 dark:text-gray-100 ${className}`}>
			<Button
				disabled={currentPage == 1}
				className="mr-4 bg-neutral-200 text-gray-700 hover:bg-neutral-300 dark:!bg-neutral-700 dark:!text-gray-300 dark:hover:!bg-neutral-600"
				onClick={() => setPage((prev) => prev - 1)}
				size="icon"
			>
				<ChevronLeft></ChevronLeft>
			</Button>
			<span className="capitalize">{t('page')}</span> <strong>{currentPage}</strong> {t('of')} <strong>{maxPage}</strong>
			<Button
				disabled={currentPage == maxPage}
				className="ml-4 bg-neutral-200 text-gray-700 hover:bg-neutral-300 dark:!bg-neutral-700 dark:!text-gray-300 dark:hover:!bg-neutral-600"
				onClick={() => setPage((prev) => prev + 1)}
				size="icon"
			>
				<ChevronRight></ChevronRight>
			</Button>
		</div>
	);
};

Pagination.propTypes = {
	currentPage: PropTypes.number.isRequired,
	setPage: PropTypes.func.isRequired,
	maxPage: PropTypes.number.isRequired,
	className: PropTypes.string,
};

export default Pagination;
