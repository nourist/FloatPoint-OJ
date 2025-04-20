import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CircleCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

import { getProblems } from '~/services/problem';
import routesConfig from '~/config/routes';
import Pagination from '~/components/Pagination';
import useAuthStore from '~/stores/authStore';
import padlock from '~/assets/images/padlock.png';

const Problem = () => {
	const { t } = useTranslation('problems');
	const { user } = useAuthStore();

	const [list, setList] = useState([]);
	const [numOfPage, setNumOfPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortBy, setSortBy] = useState('');
	const [sortOrder, setSortOrder] = useState(1);

	const sortHandler = (sortType) => {
		setSortBy(sortType);
		setSortOrder((prev) => (prev == -1 ? 1 : -1));
	};

	useEffect(() => {
		getProblems({ page: currentPage, sortBy, order: sortOrder })
			.then((res) => {
				setList(res.data);
				setNumOfPage(res.maxPage);
			})
			.catch((err) => {
				toast.error(err);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, sortBy, sortOrder]);

	return (
		<div className="w-[90%] h-[calc(100%-64px)] max-w-[1184px] mx-auto mt-12">
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg block">
				<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
					<thead className="text-xs text-gray-700 uppercase bg-white dark:bg-neutral-800 dark:text-gray-400">
						<tr>
							<th scope="col" className="px-6 py-3 text-center">
								{t('status')}
							</th>
							<th scope="col" className="px-6 py-3 truncate">
								{t('title')}
								<button className="ml-1" onClick={() => sortHandler('name')}>
									<FontAwesomeIcon icon="fa-solid fa-sort" />
								</button>
							</th>
							<th scope="col" className="px-6 py-3">
								{t('difficulty')}
								<button className="ml-1" onClick={() => sortHandler('difficulty')}>
									<FontAwesomeIcon icon="fa-solid fa-sort" />
								</button>
							</th>
							<th scope="col" className="px-6 py-3 hidden md:table-cell md:max-w-24 lg:max-w-48">
								{t('tags')}
							</th>
							{user?.permission == 'Admin' && (
								<th scope="col" className="px-6 py-3 hidden lg:table-cell text-center">
									{t('private')}
									<button className="ml-1" onClick={() => sortHandler('public')}>
										<FontAwesomeIcon icon="fa-solid fa-sort" />
									</button>
								</th>
							)}
							<th scope="col" className="px-6 py-3">
								{t('point')}
								<button className="ml-1" onClick={() => sortHandler('point')}>
									<FontAwesomeIcon icon="fa-solid fa-sort" />
								</button>
							</th>
							<th scope="col" className="px-6 py-3">
								{t('ac-rate')}
								<button className="ml-1" onClick={() => sortHandler('accuracy')}>
									<FontAwesomeIcon icon="fa-solid fa-sort" />
								</button>
							</th>
							<th scope="col" className="px-6 py-3">
								{t('ac-count')}
								<button className="ml-1" onClick={() => sortHandler('noOfSuccess')}>
									<FontAwesomeIcon icon="fa-solid fa-sort" />
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{list.map((problem, index) => (
							<tr
								key={index}
								className="odd:bg-gray-100 odd:dark:bg-neutral-900 even:bg-white even:dark:bg-neutral-800 border-b dark:border-gray-700 border-gray-200 h-14"
							>
								<td className="px-6 py-4">{problem.solve && <CircleCheck className="size-5 text-green-500 mx-auto"></CircleCheck>}</td>
								<th
									scope="row"
									className="px-6 py-4 md:max-w-24 lg:max-w-48 font-medium truncate text-gray-900 whitespace-nowrap hover:text-blue-400 dark:hover:text-blue-400 dark:text-white"
								>
									<Link to={routesConfig.problem.replace(':id', problem.id)}>{problem.name}</Link>
								</th>
								<td className="px-6 py-4 capitalize">{t(problem.difficulty)}</td>
								{problem.tags.length != 0 ? (
									<td className="px-6 py-4 capitalize truncate hidden md:table-cell md:max-w-24 lg:max-w-48">
										<Tooltip>
											<TooltipTrigger>{problem.tags.join(' | ')}</TooltipTrigger>
											<TooltipContent className="capitalize">{problem.tags.join(' | ')}</TooltipContent>
										</Tooltip>
									</td>
								) : (
									<td className="px-6 py-4 capitalize truncate hidden md:table-cell md:max-w-24 lg:max-w-48">{problem.tags.join(' | ')}</td>
								)}
								{user?.permission == 'Admin' && (
									<td className="px-6 py-4 hidden lg:table-cell">{!problem.public && <img className="size-6 mx-auto" src={padlock} />}</td>
								)}
								<td className="px-6 py-4">{problem.point}p</td>
								<td className="px-6 py-4">{problem.noOfSubm ? Math.round((problem.noOfSuccess / problem.noOfSubm) * 100) : 0}%</td>
								<td className="px-6 py-4">{problem.noOfSuccess}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Pagination maxPage={numOfPage} currentPage={currentPage} setPage={setCurrentPage} className="my-8"></Pagination>
		</div>
	);
};

export default Problem;
