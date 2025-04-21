import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CircleCheck } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getProblems } from '~/services/problem';
import routesConfig from '~/config/routes';
import Pagination from '~/components/Pagination';
import useAuthStore from '~/stores/authStore';
import padlock from '~/assets/images/padlock.png';
import ChipList from '~/components/ChipList';
import ProblemTags from '~/components/ProblemTags';

const Problem = () => {
	const { t } = useTranslation('problems');
	const { user } = useAuthStore();

	const [list, setList] = useState([]);

	const [numOfPage, setNumOfPage] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortBy, setSortBy] = useState('');
	const [sortOrder, setSortOrder] = useState(1);
	const [activeTags, setActiveTags] = useState([]);

	const sortHandler = (sortType) => {
		setSortBy(sortType);
		setSortOrder((prev) => (prev == -1 ? 1 : -1));
	};

	useEffect(() => {
		getProblems({ page: currentPage, sortBy, order: sortOrder, tags: activeTags })
			.then((res) => {
				setList(res.data);
				setNumOfPage(res.maxPage);
			})
			.catch((err) => {
				toast.error(err);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, sortBy, sortOrder, activeTags]);

	return (
		<div className="mx-auto mt-12 w-[90%] max-w-[1184px] h-[calc(100%-64px)]">
			<ProblemTags setActiveTags={setActiveTags} className="mb-2"></ProblemTags>
			<div className="block relative shadow-md sm:rounded-lg overflow-x-auto">
				<table className="w-full text-gray-500 dark:text-gray-400 text-sm text-left rtl:text-right">
					<thead className="bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-400 text-xs uppercase">
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
							<th scope="col" className="hidden md:table-cell px-6 py-3 md:max-w-24 lg:max-w-48">
								{t('tags')}
							</th>
							{user?.permission == 'Admin' && (
								<th scope="col" className="hidden lg:table-cell px-6 py-3 text-center">
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
								className="even:bg-white even:dark:bg-neutral-800 odd:bg-gray-100 odd:dark:bg-neutral-900 border-gray-200 dark:border-gray-700 border-b h-14"
							>
								<td className="px-6 py-4">{problem.solve && <CircleCheck className="mx-auto size-5 text-green-500"></CircleCheck>}</td>
								<td
									scope="row"
									className="px-6 py-4 md:max-w-24 lg:max-w-48 font-medium text-gray-900 hover:text-blue-400 dark:hover:text-blue-400 dark:text-white truncate whitespace-nowrap"
								>
									<Link to={routesConfig.problem.replace(':id', problem.id)}>{problem.name}</Link>
								</td>
								<td className="px-6 py-4 capitalize">{t(problem.difficulty)}</td>
								<td className="hidden md:table-cell px-6 py-4 md:max-w-24 lg:max-w-48 overflow-hidden" id={`abcxuz${index}`}>
									<ChipList items={problem.tags} activeItems={activeTags} w={document.documentElement.getBoundingClientRect().width / 12}></ChipList>
								</td>
								{user?.permission == 'Admin' && (
									<td className="hidden lg:table-cell px-6 py-4">{!problem.public && <img className="mx-auto size-6" src={padlock} />}</td>
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
