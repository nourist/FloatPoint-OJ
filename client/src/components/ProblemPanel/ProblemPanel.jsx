import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

import useDebounce from '~/hooks/useDebounce';

const ProblemPanel = ({ problems = [], loading = false }) => {
	const [data, setData] = useState([0, 0, 0, 0]);
	const [render, setRender] = useState(3);
	const show = useDebounce(render, 50);

	useEffect(() => {
		setData([0, 0, 0, problems.length]);
		problems.forEach((item) => {
			if (item.difficulty === 'easy') {
				setData((prev) => [prev[0] + 1, prev[1], prev[2], prev[3]]);
			} else if (item.difficulty === 'medium') {
				setData((prev) => [prev[0], prev[1] + 1, prev[2], prev[3]]);
			} else if (item.difficulty === 'hard') {
				setData((prev) => [prev[0], prev[1], prev[2] + 1, prev[3]]);
			}
		});
	}, [problems]);

	if (loading)
		return (
			<div className="h-44 flex gap-2">
				<Skeleton className="flex-1 rounded-sm"></Skeleton>
				<div className="grid grid-rows-3 gap-2">
					<Skeleton className="w-[90px] rounded-sm"></Skeleton>
					<Skeleton className="w-[90px] rounded-sm"></Skeleton>
					<Skeleton className="w-[90px] rounded-sm"></Skeleton>
				</div>
			</div>
		);

	return (
		<div className="h-44 flex gap-2">
			<div className="flex-1 bg-zinc-100 dark:bg-neutral-700 dark:text-gray-100 rounded-sm flex items-center justify-center dark:bg-opacity-70">
				<div
					style={{ borderColor: show == 0 ? '#22c55e' : show == 1 ? '#eab308' : show == 2 ? '#ef4444' : undefined }}
					className="size-36 transition-all duration-200 rounded-full border-[5px] border-sky-400 flex items-center justify-center text-sm"
				>
					<h1 className="text-4xl font-semibold mb-2">{data[show]}</h1>/{problems.length}
				</div>
			</div>
			<div className="grid grid-rows-3 gap-2">
				<div
					onMouseEnter={() => setRender(0)}
					onMouseLeave={() => setRender(3)}
					className="w-[90px] bg-zinc-100 dark:text-gray-200 dark:bg-opacity-70 dark:bg-neutral-700 rounded-sm flex items-center flex-col text-sm py-2"
				>
					<div className="text-xs font-semibold text-green-500">Easy</div>
					{data[0]}
				</div>
				<div
					onMouseEnter={() => setRender(1)}
					onMouseLeave={() => setRender(3)}
					className="w-[90px] bg-zinc-100 dark:text-gray-200 dark:bg-opacity-70 dark:bg-neutral-700 rounded-sm flex items-center flex-col text-sm py-2"
				>
					<div className="text-xs font-semibold text-yellow-500">Med</div>
					{data[1]}
				</div>
				<div
					onMouseEnter={() => setRender(2)}
					onMouseLeave={() => setRender(3)}
					className="w-[90px] bg-zinc-100 dark:text-gray-200 dark:bg-opacity-70 dark:bg-neutral-700 rounded-sm flex items-center flex-col text-sm py-2"
				>
					<div className="text-xs font-semibold text-red-500">Hard</div>
					{data[2]}
				</div>
			</div>
		</div>
	);
};

ProblemPanel.propTypes = {
	problems: PropTypes.array,
	loading: PropTypes.bool,
};

export default ProblemPanel;
