import PropTypes from 'prop-types';
import { MemoryStick, Clock9, Star, CircleCheck } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '../ui/skeleton';

import routesConfig from '~/config/routes';

const ProblemTab = ({ problem, size, className = '', loading }) => {
	const { t } = useTranslation('home');

	return (
		<div className={`my-auto flex gap-4 ${className}`}>
			{loading ? (
				<Skeleton data-sz={size} className="size-16 rounded-lg data-[sz=small]:size-12" />
			) : (
				<div
					data-sz={size}
					data-difficulty={problem?.difficulty}
					className="flex size-16 items-center justify-center rounded-lg border-2 !bg-opacity-30 text-2xl font-bold capitalize data-[sz=small]:size-12 data-[difficulty=easy]:border-green-500 data-[difficulty=hard]:border-red-500 data-[difficulty=medium]:border-yellow-400 data-[difficulty=easy]:bg-green-500 data-[difficulty=hard]:bg-red-500 data-[difficulty=medium]:bg-yellow-400 data-[difficulty=easy]:text-green-500 data-[difficulty=hard]:text-red-500 data-[difficulty=medium]:text-yellow-400"
				>
					{problem?.difficulty[0]}
				</div>
			)}
			<div data-sz={size} className="flex flex-col justify-around text-xl data-[sz=small]:text-base dark:text-white">
				{loading ? (
					<>
						<Skeleton data-sz={size} className="h-8 w-36 rounded-md data-[sz=small]:h-[28px]"></Skeleton>
						<Skeleton data-sz={size} className="h-5 w-56 rounded-sm data-[sz=small]:h-5"></Skeleton>
					</>
				) : (
					<>
						{problem?.name}
						<div className="flex gap-1 text-sm text-gray-500 dark:text-gray-400">
							<Star className="size-4" strokeWidth={1}></Star>
							{problem?.point}
							<CircleCheck className="ml-2 size-4" strokeWidth={1}></CircleCheck>
							{problem?.noOfSubm === 0 ? 0 : Math.round((problem?.noOfSuccess / problem?.noOfSubm) * 100)}%
							<MemoryStick className="ml-2 size-4" strokeWidth={1}></MemoryStick>
							{problem?.memoryLimit}MB
							<Clock9 className="ml-2 size-4" strokeWidth={1}></Clock9>
							{problem?.timeLimit}s
						</div>
					</>
				)}
			</div>
			<Button data-sz={size} asChild className="my-auto ml-auto h-8 w-32 rounded-sm !bg-blue-500 !text-white data-[sz=small]:h-7 data-[sz=small]:w-28">
				<Link to={routesConfig.problem?.replace(':id', problem?.id)}>
					<div className="text-xl">{'>'}</div>
					{t('try-now')}
				</Link>
			</Button>
		</div>
	);
};

ProblemTab.propTypes = {
	problem: PropTypes.object,
	size: PropTypes.string,
	className: PropTypes.string,
	loading: PropTypes.bool,
};

export default ProblemTab;
