import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { RotateCcw, CircleCheck, Shuffle } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { Button } from '~/components/ui/button';
import { useSearchParams } from 'react-router';

import { getProblems } from '~/services/problem';
import routesConfig from '~/config/routes';
import Pagination from '~/components/Pagination';
import useAuthStore from '~/stores/authStore';
import padlock from '~/assets/images/padlock.png';
import ChipList from '~/components/ChipList';
import ProblemTags from '~/components/ProblemTags';
import useDebounce from '~/hooks/useDebounce';
import Select from '~/components/Select';
import Search from '~/components/Search';

const Problems = () => {
	const { t } = useTranslation('problems');
	const { user } = useAuthStore();
	const [searchParams] = useSearchParams();

	const [randomId, setRandomId] = useState(0);
	const [list, setList] = useState([]);

	const [numOfPage, setNumOfPage] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [sortBy, setSortBy] = useState('');
	const [sortOrder, setSortOrder] = useState(1);
	const [activeTags, setActiveTags] = useState([]);
	const [difficulty, setDifficulty] = useState(''); // ['Easy', 'Medium', 'Hard']
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);

	const searchValue = useDebounce(search, 400);

	const sortHandle = (sortType) => {
		setSortBy(sortType);
		setSortOrder((prev) => (prev == -1 ? 1 : -1));
	};

	const query = () => {
		setLoading(true);
		getProblems({ page: currentPage, sortBy, order: sortOrder, tags: activeTags, difficulty, q: searchValue, size: 50, contest: Boolean(searchParams.get('contest')) })
			.then((res) => {
				setList(res.data);
				setNumOfPage(res.maxPage);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		getProblems({ size: 1e9 })
			.then((res) => {
				const index = Math.round(Math.random() * res.data.length);
				setRandomId(res.data[index].id);
			})
			.catch((err) => {
				toast.error(err);
			});
	}, []);

	useEffect(() => {
		query();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage, sortBy, sortOrder, activeTags, difficulty, searchValue, searchParams]);

	return (
		<div className="mx-auto mt-8 h-[calc(100%-64px)] w-[90%] max-w-[1184px]">
			<ProblemTags setActiveTags={setActiveTags} className="mb-2"></ProblemTags>
			<div className="mb-1 flex h-12 w-full gap-3">
				<Select
					setValue={setDifficulty}
					data={[
						{
							label: <span className="capitalize text-gray-700 dark:text-gray-300">{t('difficulty')}</span>,
						},
						{
							value: 'easy',
							label: <span className="capitalize text-green-500">{t('easy')}</span>,
						},
						{
							value: 'medium',
							label: <span className="capitalize text-yellow-600">{t('medium')}</span>,
						},
						{
							value: 'hard',
							label: <span className="capitalize text-red-500">{t('hard')}</span>,
						},
					]}
				></Select>
				<Search value={search} setValue={setSearch} placeholder={t('search-placeholder')}></Search>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button onClick={query} className="ml-auto size-9 rounded-full !bg-sky-500 p-[10px] !text-white" size="icon">
							<RotateCcw className="size-4"></RotateCcw>
						</Button>
					</TooltipTrigger>
					<TooltipContent className="bg-gray-200 capitalize text-gray-700 dark:bg-[rgb(55,55,55)] dark:text-gray-200">{t('refresh')}</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link to={routesConfig.problem.replace(':id', randomId)} className="mr-2 size-9 rounded-full bg-green-500 p-[10px] text-white">
							<Shuffle className="size-4"></Shuffle>
						</Link>
					</TooltipTrigger>
					<TooltipContent className="bg-gray-200 capitalize text-gray-700 dark:bg-[rgb(55,55,55)] dark:text-gray-200">{t('pick')}</TooltipContent>
				</Tooltip>
			</div>
			<div className="relative block overflow-x-auto shadow-md sm:rounded-lg">
				<table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
					<thead className="bg-white text-xs uppercase text-gray-700 dark:bg-neutral-800 dark:text-gray-400">
						<tr>
							<th scope="col" className="px-6 py-3 text-center">
								{t('status')}
							</th>
							<th scope="col" className="truncate px-6 py-3">
								{t('title')}
								<button className="ml-1" onClick={() => sortHandle('name')}>
									<FontAwesomeIcon icon="fa-solid fa-sort" />
								</button>
							</th>
							<th scope="col" className="px-6 py-3">
								{t('difficulty')}
								<button className="ml-1" onClick={() => sortHandle('difficulty')}>
									<FontAwesomeIcon icon="fa-solid fa-sort" />
								</button>
							</th>
							<th scope="col" className="hidden px-6 py-3 md:table-cell md:max-w-24 lg:max-w-48">
								{t('tags')}
							</th>
							{user?.permission == 'Admin' && (
								<th scope="col" className="hidden px-6 py-3 text-center lg:table-cell">
									{t('private')}
									<button className="ml-1" onClick={() => sortHandle('public')}>
										<FontAwesomeIcon icon="fa-solid fa-sort" />
									</button>
								</th>
							)}
							<th scope="col" className="px-6 py-3">
								{t('point')}
								<button className="ml-1" onClick={() => sortHandle('point')}>
									<FontAwesomeIcon icon="fa-solid fa-sort" />
								</button>
							</th>
							<th scope="col" className="px-6 py-3">
								{t('ac-rate')}
								<button className="ml-1" onClick={() => sortHandle('accuracy')}>
									<FontAwesomeIcon icon="fa-solid fa-sort" />
								</button>
							</th>
							<th scope="col" className="px-6 py-3">
								{t('ac-count')}
								<button className="ml-1" onClick={() => sortHandle('noOfSuccess')}>
									<FontAwesomeIcon icon="fa-solid fa-sort" />
								</button>
							</th>
						</tr>
					</thead>
					<tbody>
						{!loading &&
							list.map((problem, index) => (
								<tr
									key={index}
									className="h-14 border-b border-gray-200 odd:bg-gray-100 even:bg-white dark:border-gray-700 odd:dark:bg-neutral-900 even:dark:bg-neutral-800"
								>
									<td className="px-6 py-4">{problem.solve && <CircleCheck className="mx-auto size-5 text-green-500"></CircleCheck>}</td>
									<td
										scope="row"
										className="truncate whitespace-nowrap px-6 py-4 font-medium text-gray-900 hover:text-blue-400 md:max-w-24 lg:max-w-48 dark:text-white dark:hover:text-blue-400"
									>
										<Link to={routesConfig.problem.replace(':id', problem.id)}>{problem.name}</Link>
									</td>
									<td
										data-difficulty={problem.difficulty}
										className="px-6 py-4 capitalize data-[difficulty=easy]:text-green-500 data-[difficulty=hard]:text-red-500 data-[difficulty=medium]:text-yellow-600"
									>
										{t(problem.difficulty)}
									</td>
									<td className="hidden overflow-hidden px-6 py-4 md:table-cell md:max-w-24 lg:max-w-48" id={`abcxuz${index}`}>
										<ChipList items={problem.tags} activeItems={activeTags} w={document.documentElement.getBoundingClientRect().width / 12}></ChipList>
									</td>
									{user?.permission == 'Admin' && (
										<td className="hidden px-6 py-4 lg:table-cell">{!problem.public && <img className="mx-auto size-6" src={padlock} />}</td>
									)}
									<td className="px-6 py-4">{problem.point}p</td>
									<td className="px-6 py-4">{problem.noOfSubm ? Math.round((problem.noOfSuccess / problem.noOfSubm) * 100) : 0}%</td>
									<td className="px-6 py-4">{problem.noOfSuccess}</td>
								</tr>
							))}
					</tbody>
				</table>
				{loading && <div className="mt-32 h-[100vh] flex-1 text-center dark:text-white">Loading...</div>}
			</div>
			<Pagination maxPage={numOfPage} currentPage={currentPage} setPage={setCurrentPage} className="my-8"></Pagination>
		</div>
	);
};

export default Problems;
