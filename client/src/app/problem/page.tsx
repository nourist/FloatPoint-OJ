'use client';

import { useState } from 'react';

import { FilterCollapsible, FilterRadio, FilterRangeSlider, FilterSwitch, FilterTags } from '~/components/filter-panel';
import SearchBarWithOrder from '~/components/search-bar-with-order';

const Problem = () => {
	const statusOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'solved', label: <div className="text-success">Solved</div> },
		{ value: 'attempt', label: <div className="text-warning">Attempt</div> },
		{ value: 'todo', label: <div className="text-destructive">Todo</div> },
	];

	const difficultyOptions = [
		{ value: 'all', label: 'All' },
		{ value: 'easy', label: <div className="text-success">Easy</div> },
		{ value: 'medium', label: <div className="text-warning">Medium</div> },
		{ value: 'hard', label: <div className="text-destructive">Hard</div> },
	];

	const tagsOptions = ['math', 'geometry', 'combinatorics', 'number-theory', 'data-structure', 'graph', 'dp', 'brute-force', 'greedy'];
	const orderByList = [
		{ value: 'name', label: 'Name' },
		{ value: 'point', label: 'Point' },
		{ value: 'submit', label: 'Submit' },
		{ value: 'accept', label: 'Accept' },
		{ value: 'accept_rate', label: 'Accept Rate' },
	];

	const [status, setStatus] = useState('all');
	const [difficulty, setDifficulty] = useState('all');
	const [hasEditorial, setHasEditorial] = useState(false);
	const [pointRange, setPointRange] = useState<[number, number]>([0, 100]);
	const [tags, setTags] = useState<string[]>([]);
	const [search, setSearch] = useState('');
	const [orderBy, setOrderBy] = useState('name');
	const [order, setOrder] = useState<'asc' | 'desc'>('asc');

	console.log('re-render');

	return (
		<div className="max-w-app mx-auto my-6 flex gap-6">
			<div className="bg-card w-72 space-y-1 rounded-2xl border p-4 shadow-xs">
				<FilterCollapsible title="Status">
					<FilterRadio value={status} setValue={setStatus} data={statusOptions} />
				</FilterCollapsible>
				<FilterCollapsible title="Difficulty">
					<FilterRadio value={difficulty} setValue={setDifficulty} data={difficultyOptions} />
				</FilterCollapsible>
				<FilterCollapsible title="Editorial">
					<FilterSwitch value={hasEditorial} setValue={setHasEditorial} label="Has Editorial" />
				</FilterCollapsible>
				<FilterCollapsible title="Point">
					<FilterRangeSlider min={0} max={100} value={pointRange} setValue={setPointRange} />
				</FilterCollapsible>
				<FilterCollapsible title="Tags">
					<FilterTags tags={tagsOptions} value={tags} setValue={setTags} />
				</FilterCollapsible>
			</div>
			<div className="flex-1 space-y-6">
				<SearchBarWithOrder search={search} setSearch={setSearch} orderByList={orderByList} orderBy={orderBy} setOrderBy={setOrderBy} order={order} setOrder={setOrder} />
			</div>
		</div>
	);
};

export default Problem;
