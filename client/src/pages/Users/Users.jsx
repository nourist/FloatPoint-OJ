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
			<h2 className="text-xl font-semibold text-gray-700 capitalize dark:text-gray-100">{t('leaderboard')}</h2>
			<div className="h-[538px] mt-4 p-24 flex items-center justify-around rounded-xl bg-zinc-200 bg-opacity-50 dark:bg-zinc-800">
				<div className="relative size-60 bg-white dark:bg-neutral-700 dark:border-opacity-40 rounded-2xl border border-orange-600 shadow-[rgba(100,100,111,0.2)_0px_0px_12px_0px]">
					<div className="absolute right-4 -top-6 size-12 bg-orange-600 rounded-full text-white font-semibold text-xl flex items-center justify-center">2</div>
					{standing?.[1] ? (
						<>
							<Link to={routesConfig.user.replace(':name', standing[1].name)} className="flex flex-col items-center gap-2 pt-6">
								<UserAvatar className="size-[100px]" user={standing[1]}></UserAvatar>
								<h2 className="font-semibold capitalize dark:text-white">{standing[1].name}</h2>
							</Link>
							<div className="py-8">
								<div className="h-[30px] py-1 px-[10px] dark:text-white dark:bg-neutral-800 dark:border-neutral-600 border rounded-sm text-gray-700 border-blue-300 inline mx-5 bg-blue-100 bg-opacity-30 text-sm capitalize">
									<FontAwesomeIcon className="size-4 text-yellow-500 mr-2" icon="fa-solid fa-star" />
									{t('score')}: {standing[1].totalScore}
								</div>
							</div>
						</>
					) : (
						<div className="size-40 bg-slate-300 rounded-full my-8 mx-auto flex items-center justify-center text-8xl text-white font-bold">?</div>
					)}
				</div>
				<div className="relative size-[270px] bg-white dark:bg-neutral-700 dark:border-opacity-30 rounded-2xl border-4 border-blue-300 shadow-[#93c5fd_0px_0px_12px_0px] dark:border-white dark:shadow-[rgb(155,155,155)_0px_0px_28px_0px]">
					<Crown className="absolute right-8 -top-10"></Crown>
					{standing?.[0] ? (
						<>
							<Link to={routesConfig.user.replace(':name', standing[0].name)} className="flex flex-col items-center gap-2 pt-6">
								<UserAvatar className="size-[130px]" user={standing[0]}></UserAvatar>
								<h2 className="font-semibold capitalize dark:text-white">{standing[0].name}</h2>
							</Link>
							<div className="py-8">
								<div className="h-[30px] py-1 px-[10px] border rounded-sm text-gray-700 dark:text-white dark:bg-neutral-800 dark:border-neutral-600 border-blue-300 inline mx-5 bg-blue-100 bg-opacity-30 text-sm capitalize">
									<FontAwesomeIcon className="size-4 text-yellow-500 mr-2" icon="fa-solid fa-star" />
									{t('score')}: {standing[0].totalScore}
								</div>
							</div>
						</>
					) : (
						<div className="size-48 bg-slate-300 rounded-full my-8 mx-auto flex items-center justify-center text-9xl text-white font-bold">?</div>
					)}
				</div>
				<div className="relative size-60 bg-white dark:bg-neutral-700 dark:border-opacity-40 rounded-2xl border border-[#c5b083] shadow-[rgba(100,100,111,0.2)_0px_0px_12px_0px]">
					<div className="absolute right-4 -top-6 size-12 bg-[#c5b083] rounded-full text-white font-semibold text-xl flex items-center justify-center">3</div>
					{standing?.[2] ? (
						<>
							<Link to={routesConfig.user.replace(':name', standing[2].name)} className="flex flex-col items-center gap-2 pt-6">
								<UserAvatar className="size-[100px]" user={standing[2]}></UserAvatar>
								<h2 className="font-semibold capitalize dark:text-white">{standing[2].name}</h2>
							</Link>
							<div className="py-8">
								<div className="h-[30px] py-1 dark:text-white dark:bg-neutral-800 dark:border-neutral-600 px-[10px] border rounded-sm text-gray-700 border-blue-300 inline mx-5 bg-blue-100 bg-opacity-30 text-sm capitalize">
									<FontAwesomeIcon className="size-4 text-yellow-500 mr-2" icon="fa-solid fa-star" />
									{t('score')}: {standing[2].totalScore}
								</div>
							</div>
						</>
					) : (
						<div className="size-40 bg-slate-300 rounded-full my-8 mx-auto flex items-center justify-center text-8xl text-white font-bold">?</div>
					)}
				</div>
			</div>
			<div className="flex gap-2 mt-12">
				<Pagination maxPage={maxPage} currentPage={page} setPage={setPage}></Pagination>
				<Search value={search} setValue={setSearch} placeholder={t('search-placeholder')} className="ml-auto"></Search>
				<Button onClick={query} className="!bg-sky-400 capitalize !text-white font-light hover:!bg-sky-500">
					<RotateCcw></RotateCcw>
					{t('refresh')}
				</Button>
			</div>
			{loading ? (
				<Skeleton className={'h-[1344px] my-3'}></Skeleton>
			) : (
				<table className="w-full text-gray-700 dark:text-gray-200 text-sm text-left rtl:text-right my-3">
					<thead className="bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-400 text-xs uppercase h-16">
						<tr>
							<th scope="col" className="px-6 py-3 text-center w-28">
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
								className="even:bg-white even:dark:bg-neutral-800 odd:bg-slate-100 odd:dark:bg-neutral-900 hover:bg-blue-50 hover:cursor-pointer border-gray-200 dark:border-gray-700 border-b h-16"
							>
								<td className="px-6 py-4 text-center">
									<Link to={routesConfig.user.replace(':name', item.name)}>{index + 1}</Link>
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
