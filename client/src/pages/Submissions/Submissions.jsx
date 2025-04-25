import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from '~/components/ui/select';
import { toast } from 'react-toastify';
import { Toggle } from '~/components/ui/toggle';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { UserCheck, Search, RotateCcw } from 'lucide-react';
import { Link } from 'react-router';
import { Pie } from 'react-chartjs-2';
import { useSearchParams } from 'react-router';
import { Skeleton } from '~/components/ui/skeleton';

import useAuthStore from '~/stores/authStore';
import { getLanguages } from '~/services/problem';
import { getStatistic, getSubmissions } from '~/services/submission';
import useDebounce from '~/hooks/useDebounce';
import routesConfig from '~/config/routes';
import Pagination from '~/components/Pagination';

const Submissions = () => {
	const { t } = useTranslation('submissions');
	const { isAuth, user } = useAuthStore();
	const [params] = useSearchParams();

	const [languages, setLanguages] = useState([]);

	const [submissions, setSubmissions] = useState([]);
	const [status, setStatus] = useState();
	const [language, setLanguage] = useState();
	const [mine, setMine] = useState(false);
	const [search, setSearch] = useState(params.get('problem') ? `#${params.get('problem')}` : '');
	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const [loadingStat, setLoadingStat] = useState(false);
	const searchValue = useDebounce(search, 400);

	const [statistic, setStatistic] = useState({});

	const formatedDate = (date) => {
		const datePart = new Intl.DateTimeFormat('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		}).format(date);

		const timePart = new Intl.DateTimeFormat('vi-VN', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		}).format(date);

		const result = `${datePart.replaceAll('/', '-')} ${timePart}`;
		return result;
	};

	const query = () => {
		setLoading(true);
		const authorValue = mine ? user.name : null;
		getSubmissions({ status: status?.toUpperCase(), author: authorValue, language, problem: searchValue, size: 50, page })
			.then((res) => {
				setMaxPage(res.maxPage);
				setSubmissions(res.data);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		getLanguages()
			.then((res) => {
				setLanguages(res.data);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			});
		setLoadingStat(true);
		getStatistic()
			.then((res) => {
				setStatistic(res.data);
			})
			.catch((err) => {
				toast.error(err.response.data.msg);
			})
			.finally(() => setLoadingStat(false));
	}, []);

	useEffect(() => {
		query();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, language, mine, searchValue, user, page]);

	return (
		<div className="flex-1 mx-14 my-8 flex-row flex gap-4">
			<div className="flex-1">
				<div className="flex gap-2">
					{isAuth && (
						<Toggle
							className="capitalize dark:text-gray-100 dark:hover:bg-neutral-800 hover:!text-sky-500 data-[state=on]:bg-sky-400 data-[state=on]:text-white data-[state=on]:hover:!text-white data-[state=on]:hover:bg-sky-500"
							pressed={mine}
							onPressedChange={setMine}
						>
							<UserCheck></UserCheck>
							{t('mine')}
						</Toggle>
					)}
					<Select onValueChange={setStatus}>
						<SelectTrigger className="w-[180px] dark:!bg-[rgb(55,55,55)] bg-gray-200 text-gray-700 dark:!text-gray-200 border-none">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="dark:!bg-[rgb(55,55,55)] border-none">
							<SelectGroup>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3">
									<span className="capitalize text-gray-700 dark:text-gray-300">{t('status')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="ac">
									<span className="capitalize text-green-500">{t('ac')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="tle">
									<span className="capitalize text-yellow-500">{t('tle')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="mle">
									<span className="capitalize text-blue-500">{t('mle')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="rte">
									<span className="capitalize text-orange-500">{t('rte')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="ce">
									<span className="capitalize text-rose-500">{t('ce')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="wa">
									<span className="capitalize text-red-500">{t('wa')}</span>
								</SelectItem>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value="ie">
									<span className="capitalize text-purple-600">{t('ie')}</span>
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select onValueChange={setLanguage}>
						<SelectTrigger className="w-[180px] dark:!bg-[rgb(55,55,55)] bg-gray-200 text-gray-700 dark:!text-gray-200 border-none">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="dark:!bg-[rgb(55,55,55)] border-none">
							<SelectGroup>
								<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3">
									<span className="capitalize text-gray-700 dark:text-gray-300">{t('language')}</span>
								</SelectItem>
								{languages.map((item, index) => (
									<SelectItem className="h-10 dark:hover:!bg-neutral-700 dark:focus:!bg-neutral-700 px-3" value={item} key={index}>
										<span className="capitalize text-gray-700 dark:text-gray-300">{item}</span>
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<div className="relative flex-1 max-w-96 dark:text-gray-200 ml-auto">
						<Search className="absolute size-4 m-[10px]"></Search>
						<Input
							className="flex-1 pl-10 bg-gray-200 dark:!bg-[rgb(55,55,55)] border-none"
							value={search}
							placeholder={t('search-placeholder')}
							onChange={(e) => setSearch(e.target.value)}
						></Input>
					</div>
					<Button onClick={query} className="!bg-sky-400 capitalize !text-white font-light hover:!bg-sky-500">
						<RotateCcw></RotateCcw>
						{t('refresh')}
					</Button>
				</div>
				<table className="w-full text-gray-500 dark:text-gray-400 text-sm text-left rtl:text-right my-3">
					<thead className="bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-400 text-xs uppercase">
						<tr>
							<th scope="col" className="px-6 py-3 text-center">
								{t('when')}
							</th>
							<th scope="col" className="px-6 py-3 truncate">
								{t('id')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('status')}
							</th>
							<th scope="col" className="hidden md:table-cell px-6 py-3 md:max-w-24 lg:max-w-48">
								{t('problem')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('time')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('memory')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('language')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('point')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('author')}
							</th>
						</tr>
					</thead>
					<tbody className="text-sm">
						{!loading &&
							submissions.map((item, index) => (
								<tr
									key={index}
									className="even:bg-white even:dark:bg-neutral-800 odd:bg-gray-100 odd:dark:bg-neutral-900 border-gray-200 dark:border-gray-700 border-b h-14"
								>
									<td className="px-6 py-4">{formatedDate(new Date(item.createdAt))}</td>
									<td className="px-6 py-4">
										{item._id}
										{item.view && (
											<Link to={routesConfig.submission.replace(':id', item._id)} className="text-sky-500 hover:text-sky-600 ml-1">
												{t('view')}
											</Link>
										)}
									</td>
									<td className="px-6 py-4">
										<span
											data-status={item.status}
											className="text-xs py-1 px-2 rounded-sm data-[status=AC]:bg-green-500 data-[status=TLE]:bg-yellow-500 data-[status=MLE]:bg-blue-500 data-[status=RTE]:bg-orange-500 data-[status=CE]:bg-rose-500 data-[status=WA]:bg-red-500 data-[status=IE]:bg-purple-600 text-white"
										>
											{item.status}
										</span>
									</td>
									<td className="px-6 py-4">
										<Link className="text-sky-500 hover:text-sky-600" to={routesConfig.problem.replace(':id', item.forProblem)}>
											{item.forProblem}
										</Link>
									</td>
									<td className="px-6 py-4">{item.time}s</td>
									<td className="px-6 py-4">{item.memory}MB</td>
									<td className="px-6 py-4">{item.language}</td>
									<td className="px-6 py-4">{item.point}p</td>
									<td className="px-6 py-4">
										<Link className="text-sky-500 hover:text-sky-600" to={routesConfig.user.replace(':name', item.author)}>
											{item.author}
										</Link>
									</td>
								</tr>
							))}
					</tbody>
				</table>
				{loading && <div className="flex-1 text-center dark:text-white h-[100%] mt-32">Loading...</div>}
				<Pagination currentPage={page} setPage={setPage} maxPage={maxPage}></Pagination>
			</div>
			<div className="w-60">
				<h2 className="text-xl capitalize dark:text-gray-100 mb-1">{t('status')}</h2>
				<div className="dark:bg-neutral-800 p-8 pb-4 rounded-lg shadow-lg bg-white border dark:border-neutral-700">
					{loadingStat ? (
						<Skeleton className="w-full aspect-square rounded-full" />
					) : (
						<Pie
							data={{
								labels: ['AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE', 'IE'],
								datasets: [
									{
										backgroundColor: [
											'#22c55e', // AC - green-500
											'#ef4444', // WA - red-500
											'#eab308', // TLE - yellow-500
											'#3b82f6', // MLE - blue-500
											'#f97316', // RTE - orange-500
											'#f43f5e', // CE - rose-500
											'#9333ea', // IE - purple-600
										],
										data: statistic.status,
									},
								],
							}}
						></Pie>
					)}
					<div className="mt-4 text-center capitalize dark:text-gray-200 text-sm">
						{`${t('total')}: `}
						{statistic.status?.reduce((acc, cur) => acc + cur, 0)}
					</div>
				</div>
				<h2 className="text-xl capitalize mt-4 dark:text-gray-100 mb-1">{t('language')}</h2>
				<div className="dark:bg-neutral-800 p-8 pb-4 rounded-lg shadow-lg bg-white border dark:border-neutral-700">
					{loadingStat ? (
						<Skeleton className="w-full aspect-square rounded-full" />
					) : (
						<Pie
							data={{
								labels: languages,
								datasets: [
									{
										backgroundColor: ['#eab308', '#3b82f6', '#ef4444', '#6366f1', '#8b5cf6', '#14b8a6', '#f97316', '#0ea5e9'],
										data: statistic.language,
									},
								],
							}}
						></Pie>
					)}
					<div className="mt-4 text-center capitalize dark:text-gray-200 text-sm">
						{`${t('total')}: `}
						{statistic.language?.reduce((acc, cur) => acc + cur, 0)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Submissions;
