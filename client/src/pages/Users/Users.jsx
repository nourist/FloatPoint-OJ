import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '~/components/ui/button';
import { RotateCcw } from 'lucide-react';

import Crown from '~/assets/icons/crown.svg';
import { getUsers } from '~/services/user';
import UserAvatar from '~/components/UserAvatar';
import routesConfig from '~/config/routes';
import Search from '~/components/Search';
import Pagination from '~/components/Pagination';
import useDebounce from '~/hooks/useDebounce';
import { Skeleton } from '~/components/ui/skeleton';

const Users = () => {
	const { t } = useTranslation('users');

	const [standing, setStading] = useState([]);
	const [list, setList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [search, setSearch] = useState('');
	const searchValue = useDebounce(search, 400);

	const query = () => {
		setLoading(true);
		getUsers({ page, size: 20, order: -1, sortBy: 'totalScore', q: searchValue })
			.then((res) => {
				setList(res.data);
				setMaxPage(res.maxPage);
			})
			.catch((err) => toast.error(err.response.data.msg))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		getUsers({ size: 3, order: -1, sortBy: 'totalScore' })
			.then((res) => setStading(res.data))
			.catch((err) => toast.error(err.response.data.msg));
	}, []);

	useEffect(query, [page, searchValue]);

	return (
		<div className="flex-1 px-28 py-6">
			<h2 className="text-xl font-semibold capitalize text-gray-700 dark:text-gray-100">{t('leaderboard')}</h2>
			<div className="mt-4 flex h-[538px] items-center justify-around rounded-xl bg-zinc-200 bg-opacity-50 p-24 dark:bg-zinc-800">
				<div className="relative size-60 rounded-2xl border border-orange-600 bg-white shadow-[rgba(100,100,111,0.2)_0px_0px_12px_0px] dark:border-opacity-40 dark:bg-neutral-700">
					<div className="absolute -top-6 right-4 flex size-12 items-center justify-center rounded-full bg-orange-600 text-xl font-semibold text-white">2</div>
					{standing?.[1] ? (
						<>
							<Link to={routesConfig.user.replace(':name', standing[1].name)} className="flex flex-col items-center gap-2 pt-6">
								<UserAvatar className="size-[100px]" user={standing[1]}></UserAvatar>
								<h2 className="font-semibold capitalize dark:text-white">{standing[1].name}</h2>
							</Link>
							<div className="py-8">
								<div className="mx-5 inline h-[30px] rounded-sm border border-blue-300 bg-blue-100 bg-opacity-30 px-[10px] py-1 text-sm capitalize text-gray-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white">
									<FontAwesomeIcon className="mr-2 size-4 text-yellow-500" icon="fa-solid fa-star" />
									{t('score')}: {standing[1].totalScore}
								</div>
							</div>
						</>
					) : (
						<div className="mx-auto my-8 flex size-40 items-center justify-center rounded-full bg-slate-300 text-8xl font-bold text-white">?</div>
					)}
				</div>
				<div className="relative size-[270px] rounded-2xl border-4 border-blue-300 bg-white shadow-[#93c5fd_0px_0px_12px_0px] dark:border-white dark:border-opacity-30 dark:bg-neutral-700 dark:shadow-[rgb(155,155,155)_0px_0px_28px_0px]">
					<Crown className="absolute -top-10 right-8"></Crown>
					{standing?.[0] ? (
						<>
							<Link to={routesConfig.user.replace(':name', standing[0].name)} className="flex flex-col items-center gap-2 pt-6">
								<UserAvatar className="size-[130px]" user={standing[0]}></UserAvatar>
								<h2 className="font-semibold capitalize dark:text-white">{standing[0].name}</h2>
							</Link>
							<div className="py-8">
								<div className="mx-5 inline h-[30px] rounded-sm border border-blue-300 bg-blue-100 bg-opacity-30 px-[10px] py-1 text-sm capitalize text-gray-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white">
									<FontAwesomeIcon className="mr-2 size-4 text-yellow-500" icon="fa-solid fa-star" />
									{t('score')}: {standing[0].totalScore}
								</div>
							</div>
						</>
					) : (
						<div className="mx-auto my-8 flex size-48 items-center justify-center rounded-full bg-slate-300 text-9xl font-bold text-white">?</div>
					)}
				</div>
				<div className="relative size-60 rounded-2xl border border-[#c5b083] bg-white shadow-[rgba(100,100,111,0.2)_0px_0px_12px_0px] dark:border-opacity-40 dark:bg-neutral-700">
					<div className="absolute -top-6 right-4 flex size-12 items-center justify-center rounded-full bg-[#c5b083] text-xl font-semibold text-white">3</div>
					{standing?.[2] ? (
						<>
							<Link to={routesConfig.user.replace(':name', standing[2].name)} className="flex flex-col items-center gap-2 pt-6">
								<UserAvatar className="size-[100px]" user={standing[2]}></UserAvatar>
								<h2 className="font-semibold capitalize dark:text-white">{standing[2].name}</h2>
							</Link>
							<div className="py-8">
								<div className="mx-5 inline h-[30px] rounded-sm border border-blue-300 bg-blue-100 bg-opacity-30 px-[10px] py-1 text-sm capitalize text-gray-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white">
									<FontAwesomeIcon className="mr-2 size-4 text-yellow-500" icon="fa-solid fa-star" />
									{t('score')}: {standing[2].totalScore}
								</div>
							</div>
						</>
					) : (
						<div className="mx-auto my-8 flex size-40 items-center justify-center rounded-full bg-slate-300 text-8xl font-bold text-white">?</div>
					)}
				</div>
			</div>
			<div className="mt-12 flex gap-2">
				<Pagination maxPage={maxPage} currentPage={page} setPage={setPage}></Pagination>
				<Search value={search} setValue={setSearch} placeholder={t('search-placeholder')} className="ml-auto"></Search>
				<Button onClick={query} className="!bg-sky-400 font-light capitalize !text-white hover:!bg-sky-500">
					<RotateCcw></RotateCcw>
					{t('refresh')}
				</Button>
			</div>
			{loading ? (
				<Skeleton className={'my-3 h-[1344px]'}></Skeleton>
			) : (
				<table className="my-3 w-full text-left text-sm text-gray-700 rtl:text-right dark:text-gray-200">
					<thead className="h-16 bg-white text-xs uppercase text-gray-800 dark:bg-neutral-800 dark:text-gray-400">
						<tr>
							<th scope="col" className="w-28 px-6 py-3 text-center">
								{t('top')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('name')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('fullname')}
							</th>
							<th scope="col" className="px-6 py-3">
								{t('point')}
							</th>
						</tr>
					</thead>
					<tbody>
						{list?.map((item, index) => (
							<tr
								key={index}
								className="h-16 border-b border-gray-200 odd:bg-slate-100 even:bg-white hover:cursor-pointer hover:bg-blue-50 dark:border-gray-700 odd:dark:bg-neutral-900 even:dark:bg-neutral-800"
							>
								<td className="px-6 py-4 text-center">
									<Link to={routesConfig.user.replace(':name', item.name)}>{item.top}</Link>
								</td>
								<td className="px-6 py-4 capitalize">
									<Link className="flex items-center gap-3" to={routesConfig.user.replace(':name', item.name)}>
										<UserAvatar user={item}></UserAvatar>
										{item.name}
									</Link>
								</td>
								<td className="px-6 py-4">
									<Link to={routesConfig.user.replace(':name', item.name)}>{item.fullname}</Link>
								</td>
								<td className="px-6 py-4 font-semibold">
									<Link to={routesConfig.user.replace(':name', item.name)}>{item.totalScore}</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
};

export default Users;
