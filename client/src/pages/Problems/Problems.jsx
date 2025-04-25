import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { RotateCcw, CircleCheck, Search, Shuffle } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import { getProblems } from '~/services/problem';
import routesConfig from '~/config/routes';
import Pagination from '~/components/Pagination';
import useAuthStore from '~/stores/authStore';
import padlock from '~/assets/images/padlock.png';
import ChipList from '~/components/ChipList';
import ProblemTags from '~/components/ProblemTags';
import useDebounce from '~/hooks/useDebounce';

const Problem = () => {
	const { t } = useTranslation('problems');
	const { user } = useAuthStore();

	const [randomId, setRandomId] = useState(0);
	const [list, setList] = useState([]);

	const [numOfPage, setNumOfPage] = useState(0);
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
		getProblems({ page: currentPage, sortBy, order: sortOrder, tags: activeTags, difficulty, q: searchValue, size: 50 })
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
	}, [currentPage, sortBy, sortOrder, activeTags, difficulty, searchValue]);

	return (
		<div className="mx-auto mt-8 w-[90%] max-w-[1184px] h-[calc(100%-64px)]">
			<ProblemTags setActiveTags={setActiveTags} className="mb-2"></ProblemTags>
			<div className="h-12 w-full mb-1 flex gap-3">
				<Select onValueChange={setDifficulty}>
					<SelectTrigger className="w-[180px] dark:!bg-[rgb(55,55,55)] bg-gray-200 text-gray-700 dark:!text-gray-200 border-none">
						<SelectValue />
					</SelectTrigger>
					<SelectContent className="dark:!bg-[rgb(55,55,55)] border-none">
						<SelectGroup>
							<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3">
								<span className="capitalize text-gray-700 dark:text-gray-300">{t('difficulty')}</span>
							</SelectItem>
							<SelectItem
								className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3 text-green-500 hover:!text-green-500 focus:!text-green-500"
								value="easy"
							>
								<span className="capitalize text-green-500">{t('easy')}</span>
							</SelectItem>
							<SelectItem
								className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3 text-yellow-600 hover:!text-yellow-600 focus:!text-yellow-600"
								value="medium"
							>
								<span className="capitalize text-yellow-600">{t('medium')}</span>
							</SelectItem>
							<SelectItem
								className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3 text-red-500 hover:!text-red-500 focus:!text-red-500"
								value="hard"
							>
								<span className="capitalize text-red-500">{t('hard')}</span>
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<div className="relative flex-1 max-w-96 dark:text-gray-200">
					<Search className="absolute size-4 m-[10px]"></Search>
					<Input
						className="flex-1 pl-10 bg-gray-200 dark:!bg-[rgb(55,55,55)] border-none"
						value={search}
						placeholder={t('search-placeholder')}
						onChange={(e) => setSearch(e.target.value)}
					></Input>
				</div>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button onClick={query} className="rounded-full size-9 p-[10px] !bg-sky-500 !text-white ml-auto" size="icon">
							<RotateCcw className="size-4"></RotateCcw>
						</Button>
					</TooltipTrigger>
					<TooltipContent className="dark:bg-[rgb(55,55,55)] bg-gray-200 text-gray-700 dark:text-gray-200 capitalize">{t('refresh')}</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link to={routesConfig.problem.replace(':id', randomId)} className="rounded-full size-9 p-[10px] bg-green-500 text-white mr-2">
							<Shuffle className="size-4"></Shuffle>
						</Link>
					</TooltipTrigger>
					<TooltipContent className="dark:bg-[rgb(55,55,55)] bg-gray-200 text-gray-700 dark:text-gray-200 capitalize">{t('pick')}</TooltipContent>
				</Tooltip>
			</div>
			<div className="block relative shadow-md sm:rounded-lg overflow-x-auto">
				<table className="w-full text-gray-500 dark:text-gray-400 text-sm text-left rtl:text-right">
					<thead className="bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-400 text-xs uppercase">
						<tr>
							<th scope="col" className="px-6 py-3 text-center">
								{t('status')}
							</th>
							<th scope="col" className="px-6 py-3 truncate">
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
							<th scope="col" className="hidden md:table-cell px-6 py-3 md:max-w-24 lg:max-w-48">
								{t('tags')}
							</th>
							{user?.permission == 'Admin' && (
								<th scope="col" className="hidden lg:table-cell px-6 py-3 text-center">
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
									className="even:bg-white even:dark:bg-neutral-800 odd:bg-gray-100 odd:dark:bg-neutral-900 border-gray-200 dark:border-gray-700 border-b h-14"
								>
									<td className="px-6 py-4">{problem.solve && <CircleCheck className="mx-auto size-5 text-green-500"></CircleCheck>}</td>
									<td
										scope="row"
										className="px-6 py-4 md:max-w-24 lg:max-w-48 font-medium text-gray-900 hover:text-blue-400 dark:hover:text-blue-400 dark:text-white truncate whitespace-nowrap"
									>
										<Link to={routesConfig.problem.replace(':id', problem.id)}>{problem.name}</Link>
									</td>
									<td
										data-difficulty={problem.difficulty}
										className="px-6 py-4 capitalize data-[difficulty=easy]:text-green-500 data-[difficulty=medium]:text-yellow-600 data-[difficulty=hard]:text-red-500"
									>
										{t(problem.difficulty)}
									</td>
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
				{loading && <div className="flex-1 text-center dark:text-white h-[100vh] mt-32">Loading...</div>}
			</div>
			<Pagination maxPage={numOfPage} currentPage={currentPage} setPage={setCurrentPage} className="my-8"></Pagination>
		</div>
	);
};

export default Problem;
