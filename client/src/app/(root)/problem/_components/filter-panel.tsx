import { useTranslations } from 'next-intl';

import { FilterCollapsible, FilterRadio, FilterRangeSlider, FilterSwitch, FilterTags } from '~/components/filter-panel';
import { User } from '~/types/user.type';

interface FilterPanelProps {
	status: string;
	setStatus: (status: string) => void;
	difficulty: string;
	setDifficulty: (difficulty: string) => void;
	hasEditorial: boolean;
	setHasEditorial: (hasEditorial: boolean) => void;
	pointRange: [number, number];
	setPointRange: (pointRange: [number, number]) => void;
	tags: string[];
	setTags: (tags: string[]) => void;
	contestId: string;
	setContestId: (contestId: string) => void;
	minPoint: number;
	maxPoint: number;
	tagOptions: string[];
	user: User | null;
	contestOptions: { value: string; label: string }[];
}

const FilterPanel = ({
	status,
	setStatus,
	difficulty,
	setDifficulty,
	hasEditorial,
	setHasEditorial,
	pointRange,
	setPointRange,
	tags,
	setTags,
	contestId,
	setContestId,
	minPoint,
	maxPoint,
	tagOptions,
	user,
	contestOptions,
}: FilterPanelProps) => {
	const t = useTranslations('problem.filter');

	const statusOptions = [
		{ value: 'all', label: t('all') },
		{ value: 'solved', label: <div className="text-success">{t('solved')}</div> },
		{ value: 'attempted', label: <div className="text-warning">{t('attempted')}</div> },
		{ value: 'unattempted', label: <div className="text-destructive">{t('todo')}</div> },
	];

	const difficultyOptions = [
		{ value: 'all', label: t('all') },
		{ value: 'easy', label: <div className="text-success">{t('easy')}</div> },
		{ value: 'medium', label: <div className="text-warning">{t('medium')}</div> },
		{ value: 'hard', label: <div className="text-destructive">{t('hard')}</div> },
	];

	const finalContestOptions = [{ value: '', label: t('all') }, ...contestOptions];

	return (
		<>
			{user && (
				<FilterCollapsible title={t('status')}>
					<FilterRadio value={status} setValue={setStatus} data={statusOptions} />
				</FilterCollapsible>
			)}
			{user && contestOptions.length > 0 && (
				<FilterCollapsible title={t('contest')}>
					<FilterRadio value={contestId} setValue={setContestId} data={finalContestOptions} />
				</FilterCollapsible>
			)}
			<FilterCollapsible title={t('difficulty')}>
				<FilterRadio value={difficulty} setValue={setDifficulty} data={difficultyOptions} />
			</FilterCollapsible>
			<FilterCollapsible title={t('editorial')}>
				<FilterSwitch value={hasEditorial} setValue={setHasEditorial} label={t('has_editorial')} />
			</FilterCollapsible>
			<FilterCollapsible title={t('point')}>
				<FilterRangeSlider min={minPoint} max={maxPoint} value={pointRange} setValue={setPointRange} />
			</FilterCollapsible>
			<FilterCollapsible title={t('tags')}>
				<FilterTags tags={tagOptions} value={tags} setValue={setTags} />
			</FilterCollapsible>
		</>
	);
};

export default FilterPanel;
