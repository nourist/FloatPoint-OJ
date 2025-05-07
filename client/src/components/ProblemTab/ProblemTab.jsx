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
		<div className={`flex my-auto gap-4 ${className}`}>
			{loading ? (
				<Skeleton data-sz={size} className="data-[sz=small]:size-12 size-16 rounded-lg" />
			) : (
				<div
					data-sz={size}
					data-difficulty={problem?.difficulty}
					className="data-[sz=small]:size-12 size-16 capitalize flex items-center justify-center text-2xl font-bold data-[difficulty=easy]:bg-green-500 data-[difficulty=medium]:bg-yellow-400 data-[difficulty=hard]:bg-red-500 data-[difficulty=easy]:border-green-500 data-[difficulty=medium]:border-yellow-400 data-[difficulty=hard]:border-red-500 data-[difficulty=easy]:text-green-500 data-[difficulty=medium]:text-yellow-400 data-[difficulty=hard]:text-red-500 border-2 rounded-lg !bg-opacity-30 "
				>
					{problem?.difficulty[0]}
				</div>
			)}
			<div data-sz={size} className="data-[sz=small]:text-base text-xl dark:text-white flex flex-col justify-around">
				{loading ? (
					<>
						<Skeleton data-sz={size} className="h-8 w-36 rounded-md data-[sz=small]:h-[28px]"></Skeleton>
						<Skeleton data-sz={size} className="h-5 w-56 rounded-sm data-[sz=small]:h-5"></Skeleton>
					</>
				) : (
					<>
						{problem?.name}
						<div className="flex text-sm dark:text-gray-400 text-gray-500 gap-1">
							<Star className="size-4" strokeWidth={1}></Star>
							{problem?.point}
							<CircleCheck className="size-4 ml-2" strokeWidth={1}></CircleCheck>
							{problem?.noOfSubm === 0 ? 0 : Math.round((problem?.noOfSuccess / problem?.noOfSubm) * 100)}%
							<MemoryStick className="size-4 ml-2" strokeWidth={1}></MemoryStick>
							{problem?.memoryLimit}MB
							<Clock9 className="size-4 ml-2" strokeWidth={1}></Clock9>
							{problem?.timeLimit}s
						</div>
					</>
				)}
			</div>
			<Button data-sz={size} asChild className="ml-auto data-[sz=small]:h-7 data-[sz=small]:w-28 my-auto w-32 h-8 !bg-blue-500 rounded-sm !text-white">
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
