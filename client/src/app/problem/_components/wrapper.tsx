'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';

import FilterPanel from './filter-panel';
import SearchBar from './search-bar';
import ProblemTable from './table';
import PaginationControls from '~/components/pagination-controls';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Skeleton } from '~/components/ui/skeleton';
import http from '~/lib/http-client';
import { createProblemService } from '~/services/problem';
import { User } from '~/types/user.type';

interface Props {
	minPoint: number;
	maxPoint: number;
	tags: string[];
	total: number;
	user: User | null;
}

const ProblemWrapper = ({ minPoint, maxPoint, tags: tagOptions, total: initTotal, user }: Props) => {
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);
	const [total, setTotal] = useState(initTotal);

	const [status, setStatus] = useState('all');
	const [difficulty, setDifficulty] = useState('all');
	const [hasEditorial, setHasEditorial] = useState(false);
	const [pointRange, setPointRange] = useState<[number, number]>([minPoint, maxPoint]);
	const [tags, setTags] = useState<string[]>([]);
	const [search, setSearch] = useState('');
	const [orderBy, setOrderBy] = useState('title');
	const [order, setOrder] = useState<'asc' | 'desc'>('asc');
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(20);

	const problemService = createProblemService(http);

	const { data, error, isLoading } = useSWR(
		{
			q: search,
			sortBy: orderBy,
			order: order.toUpperCase(),
			status: status == 'all' ? undefined : status,
			difficulty: difficulty == 'all' ? undefined : difficulty,
			hasEditorial,
			minPoint: pointRange[0],
			maxPoint: pointRange[1],
			tags,
			page,
			limit: size,
		},
		problemService.findAllProblems,
		{
			keepPreviousData: true,
		},
	);

	useEffect(() => {
		if (data) {
			setTotal(data.total);
		}
	}, [data]);

	if (!data) {
		if (!isLoading) throw error;
	}

	return (
		<div className="max-w-app mx-auto my-6 flex gap-6">
			<div className="bg-card w-72 space-y-1 rounded-2xl border p-4 shadow-xs max-lg:hidden">
				<FilterPanel
					user={user}
					minPoint={minPoint}
					maxPoint={maxPoint}
					tagOptions={tagOptions}
					status={status}
					setStatus={setStatus}
					difficulty={difficulty}
					setDifficulty={setDifficulty}
					hasEditorial={hasEditorial}
					setHasEditorial={setHasEditorial}
					pointRange={pointRange}
					setPointRange={setPointRange}
					tags={tags}
					setTags={setTags}
				/>
			</div>
			<div className="flex-1 space-y-6">
				<SearchBar
					setFilterDialogOpen={setFilterDialogOpen}
					search={search}
					setSearch={setSearch}
					orderBy={orderBy}
					setOrderBy={setOrderBy}
					order={order}
					setOrder={setOrder}
				/>
				{!data && isLoading ? (
					<Skeleton className="h-140 w-full rounded-2xl" />
				) : (
					<>
						<ProblemTable selectTags={tags} user={user} problems={data?.problems ?? []} />
						<PaginationControls onPageChange={setPage} onSizeChange={setSize} initialPage={1} initialSize={20} totalItems={total} />
					</>
				)}
			</div>
			<Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
				<DialogContent className="px-0">
					<ScrollArea className="max-h-[calc(100vh-4rem)] px-6">
						<DialogHeader className="mb-4">
							<DialogTitle>Filter</DialogTitle>
						</DialogHeader>
						<div className="space-y-1">
							<FilterPanel
								user={user}
								minPoint={minPoint}
								maxPoint={maxPoint}
								tagOptions={tagOptions}
								status={status}
								setStatus={setStatus}
								difficulty={difficulty}
								setDifficulty={setDifficulty}
								hasEditorial={hasEditorial}
								setHasEditorial={setHasEditorial}
								pointRange={pointRange}
								setPointRange={setPointRange}
								tags={tags}
								setTags={setTags}
							/>
						</div>
					</ScrollArea>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default ProblemWrapper;
