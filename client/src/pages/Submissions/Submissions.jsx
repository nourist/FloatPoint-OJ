import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Toggle } from '~/components/ui/toggle';
import { Button } from '~/components/ui/button';
import { UserCheck, RotateCcw } from 'lucide-react';
import { Link } from 'react-router';
import { Pie } from 'react-chartjs-2';
import { useSearchParams } from 'react-router';
import { Skeleton } from '~/components/ui/skeleton';

import useAuthStore from '~/stores/authStore';
import { getLanguages } from '~/services/problem';
import { getSubmissions } from '~/services/submission';
import useDebounce from '~/hooks/useDebounce';
import routesConfig from '~/config/routes';
import Pagination from '~/components/Pagination';
import Select from '~/components/Select';
import Search from '~/components/Search';
import statusColors from '~/config/statusColor';

const Submissions = () => {
	const { t } = useTranslation('submissions');
	const { isAuth, user } = useAuthStore();
	const [params] = useSearchParams();

	const [languages, setLanguages] = useState([]);

	const [status, setStatus] = useState();
	const [language, setLanguage] = useState();
	const [mine, setMine] = useState(false);
	const [search, setSearch] = useState(params.get('problem') ? `#${params.get('problem')}` : '');
	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(0);
	const [loading, setLoading] = useState(false);
	const searchValue = useDebounce(search, 400);

	const [submissions, setSubmissions] = useState([]);
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
		const authorValue = mine ? user.name : params.get('author');
		getSubmissions({ status: status?.toUpperCase(), author: authorValue, language, problem: searchValue, size: 50, page, contest: params.get('contest') })
			.then((res) => {
				setMaxPage(res.maxPage);
				res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				setSubmissions(res.data);
				setStatistic(res.stat);
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
	}, []);

	useEffect(() => {
		query();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status, language, mine, searchValue, user, page, params]);

	return (
		<div className="mx-14 my-8 flex flex-1 flex-row gap-4">
			<div className="flex-1">
				<div className="flex gap-2">
					{isAuth && (
						<Toggle
							className="capitalize hover:!text-sky-500 data-[state=on]:bg-sky-400 data-[state=on]:text-white data-[state=on]:hover:bg-sky-500 data-[state=on]:hover:!text-white dark:text-gray-100 dark:hover:bg-neutral-800"
							pressed={mine}
							onPressedChange={setMine}
						>
							<UserCheck></UserCheck>
							{t('mine')}
						</Toggle>
					)}
					<Select
						setValue={setStatus}
						data={[
							{
								label: <span className={`capitalize text-gray-700 dark:text-gray-300`}>{t('status')}</span>,
							},
							...['ac', 'tle', 'mle', 'rte', 'ce', 'wa', 'ie'].map((status) => ({
								value: status,
								label: (
									<span style={{ color: statusColors[status] }} className={`capitalize`}>
										{t(status)}
									</span>
								),
							})),
						]}
					></Select>
					<Select
						setValue={setLanguage}
						data={[
							{
								label: <span className="capitalize text-gray-700 dark:text-gray-300">{t('language')}</span>,
							},
							...languages.map((item) => ({
								label: <span className="capitalize text-gray-700 dark:text-gray-300">{item}</span>,
								value: item,
							})),
						]}
					></Select>
					<Search value={search} setValue={setSearch} className="ml-auto" placeholder={t('search-placeholder')}></Search>
					<Button onClick={query} className="!bg-sky-400 font-light capitalize !text-white hover:!bg-sky-500">
						<RotateCcw></RotateCcw>
						{t('refresh')}
					</Button>
				</div>
				<table className="my-3 w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
					<thead className="bg-white text-xs uppercase text-gray-700 dark:bg-neutral-800 dark:text-gray-400">
						<tr>
							<th scope="col" className="px-6 py-3 text-center">
								{t('when')}
							</th>
							<th scope="col" className="truncate px-6 py-3">
								{t('id')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('status')}
							</th>
							<th scope="col" className="hidden px-6 py-3 md:table-cell md:max-w-24 lg:max-w-48">
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
									className="h-14 border-b border-gray-200 odd:bg-gray-100 even:bg-white dark:border-gray-700 odd:dark:bg-neutral-900 even:dark:bg-neutral-800"
								>
									<td className="px-6 py-4">{formatedDate(new Date(item.createdAt || null))}</td>
									<td className="px-6 py-4">
										{item._id}
										{item.view && (
											<Link to={routesConfig.submission.replace(':id', item._id)} className="ml-1 text-sky-500 hover:text-sky-600">
												{t('view')}
											</Link>
										)}
									</td>
									<td className="px-6 py-4">
										<span
											data-status={item.status}
											className="rounded-sm px-2 py-1 text-xs text-white data-[status=AC]:bg-green-500 data-[status=CE]:bg-rose-500 data-[status=IE]:bg-purple-600 data-[status=MLE]:bg-blue-500 data-[status=RTE]:bg-orange-500 data-[status=TLE]:bg-yellow-500 data-[status=WA]:bg-red-500"
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
				{loading && <div className="mt-32 h-[100%] flex-1 text-center dark:text-white">Loading...</div>}
				<Pagination currentPage={page} setPage={setPage} maxPage={maxPage}></Pagination>
			</div>
			<div className="w-60">
				<h2 className="mb-1 text-xl capitalize dark:text-gray-100">{t('status')}</h2>
				<div className="rounded-lg border bg-white p-8 pb-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
					{loading ? (
						<Skeleton className="aspect-square w-full rounded-full" />
					) : statistic.status?.reduce((acc, cur) => acc + cur, 0) === 0 ? (
						<div className="aspect-square w-full rounded-full border-2 border-white bg-neutral-300 dark:bg-neutral-700"></div>
					) : (
						<Pie
							data={{
								labels: ['AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE', 'IE'],
								datasets: [
									{
										backgroundColor: [
											statusColors.ac, // AC - green-500
											statusColors.wa, // WA - red-500
											statusColors.tle, // TLE - yellow-500
											statusColors.mle, // MLE - blue-500
											statusColors.rte, // RTE - orange-500
											statusColors.ce, // CE - rose-500
											statusColors.ie, // IE - purple-600
										],
										data: statistic.status,
									},
								],
							}}
						></Pie>
					)}
					<div className="mt-4 text-center text-sm capitalize dark:text-gray-200">
						{`${t('total')}: `}
						{statistic.status?.reduce((acc, cur) => acc + cur, 0)}
					</div>
				</div>
				<h2 className="mb-1 mt-4 text-xl capitalize dark:text-gray-100">{t('language')}</h2>
				<div className="rounded-lg border bg-white p-8 pb-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
					{loading ? (
						<Skeleton className="aspect-square w-full rounded-full" />
					) : statistic.status?.reduce((acc, cur) => acc + cur, 0) === 0 ? (
						<div className="aspect-square w-full rounded-full border-2 border-white bg-neutral-300 dark:bg-neutral-700"></div>
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
					<div className="mt-4 text-center text-sm capitalize dark:text-gray-200">
						{`${t('total')}: `}
						{statistic.language?.reduce((acc, cur) => acc + cur, 0)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Submissions;
