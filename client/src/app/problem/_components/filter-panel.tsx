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
	minPoint: number;
	maxPoint: number;
	tagOptions: string[];
	user: User | null;
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
	minPoint,
	maxPoint,
	tagOptions,
	user,
}: FilterPanelProps) => {
	const statusOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'solved', label: <div className="text-success">Solved</div> },
		{ value: 'attempted', label: <div className="text-warning">Attempt</div> },
		{ value: 'unattempted', label: <div className="text-destructive">Todo</div> },
	];

	const difficultyOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'easy', label: <div className="text-success">Easy</div> },
		{ value: 'medium', label: <div className="text-warning">Medium</div> },
		{ value: 'hard', label: <div className="text-destructive">Hard</div> },
	];

	return (
		<>
			{user && (
				<FilterCollapsible title="Status">
					<FilterRadio value={status} setValue={setStatus} data={statusOptions} />
				</FilterCollapsible>
			)}
			<FilterCollapsible title="Difficulty">
				<FilterRadio value={difficulty} setValue={setDifficulty} data={difficultyOptions} />
			</FilterCollapsible>
			<FilterCollapsible title="Editorial">
				<FilterSwitch value={hasEditorial} setValue={setHasEditorial} label="Has Editorial" />
			</FilterCollapsible>
			<FilterCollapsible title="Point">
				<FilterRangeSlider min={minPoint} max={maxPoint} value={pointRange} setValue={setPointRange} />
			</FilterCollapsible>
			<FilterCollapsible title="Tags">
				<FilterTags tags={tagOptions} value={tags} setValue={setTags} />
			</FilterCollapsible>
		</>
	);
};

export default FilterPanel;
