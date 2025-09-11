'use client';

import { useState } from 'react';
import useSWR from 'swr';

import Filter from './filter';
import ProblemTable from './table';
import Toolbar from './toolbar';
import PaginationControls from '~/components/pagination-controls';
import { createClientService } from '~/lib/service-client';
import { problemServiceInstance } from '~/services/problem';

interface Props {
	minPoint: number;
	maxPoint: number;
	tags: string[];
}

const Wrapper = ({ minPoint, maxPoint, tags: tagOptions }: Props) => {
	const [difficulty, setDifficulty] = useState('all');
	const [hasEditorial, setHasEditorial] = useState(false);
	const [pointRange, setPointRange] = useState<[number, number]>([minPoint, maxPoint]);
	const [tags, setTags] = useState<string[]>([]);
	const [q, setQ] = useState('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(20);
	const [orderBy, setOrderBy] = useState('title');
	const [order, setOrder] = useState<'asc' | 'desc'>('asc');

	const problemService = createClientService(problemServiceInstance);

	const { data, error, isLoading, mutate } = useSWR(
		{
			q,
			sortBy: orderBy,
			order: order.toUpperCase(),
			difficulty: difficulty == 'all' ? undefined : difficulty,
			hasEditorial,
			minPoint: pointRange[0],
			maxPoint: pointRange[1],
			tags,
			page,
			limit,
		},
		problemService.findAllProblems,
		{
			keepPreviousData: true,
		},
	);

	if (!data && !isLoading) {
		throw error;
	}

	return (
		<>
			<div className="w-full space-y-2">
				<Filter
					minPoint={minPoint}
					maxPoint={maxPoint}
					tags={tags}
					setTags={setTags}
					tagOptions={tagOptions}
					difficulty={difficulty}
					setDifficulty={setDifficulty}
					hasEditorial={hasEditorial}
					setHasEditorial={setHasEditorial}
					pointRange={pointRange}
					setPointRange={setPointRange}
				/>
				<Toolbar setQ={setQ} orderBy={orderBy} order={order} setOrderBy={setOrderBy} setOrder={setOrder} />
			</div>
			{data ? (
				<>
					<ProblemTable problems={data.problems} mutate={mutate} />
					<PaginationControls totalItems={data.total} initialPage={1} initialSize={20} onPageChange={setPage} onSizeChange={setLimit} />
				</>
			) : (
				<div>loading...</div>
			)}
		</>
	);
};

export default Wrapper;
