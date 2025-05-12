import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';
import { Skeleton } from '~/components/ui/skeleton';

import useAuthStore from '~/stores/authStore';
import UserAvatar from '~/components/UserAvatar';
import routesConfig from '~/config/routes';
import Trophy from '~/assets/icons/trophy.svg';
import { getProblems } from '~/services/problem';
import Contest from '~/assets/images/1stcontest.png';
import { getContest } from '~/services/contest';
import statusColors from '~/config/statusColor';
import { getSubmissions } from '~/services/submission';
import ProblemTab from '~/components/ProblemTab';
import { getUsers } from '~/services/user';

const Home = () => {
	const { user } = useAuthStore();
	const { t } = useTranslation('home');

	const [standing, setStanding] = useState([]);
	const [newestProblem, setNewestProblem] = useState([]);
	const [currentContest, setCurrentContest] = useState();
	const [statistic, setStatistic] = useState({});
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(0);

	useEffect(() => {
		if (!user) return;
		setLoading(4);
		getProblems({ size: 5, sortBy: 'createdAt', order: -1 })
			.then((res) => setNewestProblem(res.data))
			.catch((err) => toast.error(err.response.data.msg))
			.finally(() => setLoading((prev) => prev - 1));
		getSubmissions({ author: user?.name })
			.then((res) => setStatistic(res.stat.status))
			.catch((err) => toast.error(err.response.data.msg))
			.finally(() => setLoading((prev) => prev - 1));
		getUsers({ size: 5, sortBy: 'totalScore', order: -1 })
			.then((res) => setStanding(res.data))
			.catch((err) => toast.error(err.response.data.msg))
			.finally(() => setLoading((prev) => prev - 1));
		getSubmissions({ sortBy: 'createdAt', order: -1, size: 15, status: 'AC' })
			.then((res) => setActivities(res.data))
			.catch((err) => toast.error(err.response.data.msg))
			.finally(() => setLoading((prev) => prev - 1));
		if (user?.joiningContest) {
			setLoading((prev) => prev + 1);
			getContest(user?.joiningContest)
				.then((res) => setCurrentContest(res.data))
				.catch((err) => toast.error(err.response.data.msg))
				.finally(() => setLoading((prev) => prev - 1));
		}
	}, [user]);

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

	return (
		<div className="flex-1">
			<div className="mt-[2px] h-[100%] w-full bg-white px-20 pb-[88px] pt-12 lg:h-[90%] dark:bg-[rgb(27,27,29)]">
				<div className="grid h-full grid-cols-4 grid-rows-4 gap-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-2 row-span-2 flex flex-col gap-y-4 rounded-lg bg-white py-8 shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:col-span-1 lg:row-span-4 dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)]"
					>
						<Link to={routesConfig.user.replace(':name', user.name)}>
							<UserAvatar className="mx-auto size-36" user={user}></UserAvatar>
						</Link>
						<h2 className="text-center text-xl dark:text-white">{user?.fullname || user?.name}</h2>
						<div className="w-full px-8">
							<div className="flex font-light">
								<span className="text-sm dark:text-white">{t('better-than')}</span>
								<span className="ml-auto text-sm dark:text-white">
									<span className="text-blue-500">{100 - user?.topPercent}%</span> {t('user')}
								</span>
							</div>
							<div className="h-2 w-full bg-gray-200 dark:bg-[rgb(33,33,37)]">
								<div className={`h-full bg-[#0066B8]`} style={{ width: `${100 - user?.topPercent}%` }}></div>
							</div>
						</div>
						<div className="mt-auto flex h-28 w-full px-8">
							<span className="flex h-full flex-1 flex-col justify-between bg-slate-200 bg-opacity-60 py-5 dark:bg-[rgb(33,33,37)]">
								<Trophy className="mx-auto"></Trophy>
								<h3 className="text-center text-2xl dark:text-white">{user?.top}</h3>
							</span>
							<span className="mx-8 my-auto h-3/4 border dark:border-neutral-700"></span>
							<span className="flex h-full flex-1 flex-col justify-between bg-slate-200 bg-opacity-60 py-5 dark:bg-[rgb(33,33,37)]">
								<div className="text-center">
									<FontAwesomeIcon className="size-8 text-[#0066B8]" icon="fa-solid fa-star" />
								</div>
								<h3 className="text-center text-2xl dark:text-white">{user?.totalScore}</h3>
							</span>
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-2 col-start-3 row-span-2 flex flex-col items-center gap-4 rounded-lg bg-white py-8 shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:col-span-1 lg:row-span-4 dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)]"
					>
						<h2 className="text-xl capitalize dark:text-white">{t('statistics')}</h2>
						<div className="my-2 flex h-[200px] w-[200px] flex-col items-center justify-center rounded-full border-8 dark:border-zinc-700">
							<div className="text-4xl dark:text-white">{user?.totalAttempt}</div>
							<div className="mt-2 text-sm capitalize text-gray-600 dark:text-gray-400">{t('attempted')}</div>
						</div>
						<div className="flex items-center gap-4 capitalize dark:text-white">
							<div className="h-4 w-4 rounded-full bg-green-500"></div>
							{t('finished')}
							<div className="h-[2px] w-4 bg-gray-600 dark:bg-white"></div>
							{user?.totalAC}
						</div>
						<div className="flex items-center gap-4 capitalize dark:text-white">
							<div className="h-4 w-4 rounded-full bg-red-500"></div>
							<div className="text-gray-600 dark:text-gray-400">{t('unfinished')}</div>
							<div className="h-[2px] w-4 bg-gray-600 dark:bg-white"></div>
							{user?.totalAC}
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-4 row-start-3 flex flex-col rounded-lg bg-white px-12 py-8 shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:col-span-2 lg:row-span-2 dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)]"
					>
						<div className="flex">
							<h2 className="text-2xl capitalize dark:text-white">{t('newest-problem')}</h2>
							<Link to={routesConfig.problems} className="ml-auto text-sm capitalize text-blue-600 hover:underline">
								{t('view-more')}
							</Link>
						</div>
						{!newestProblem ? (
							<div className="flex flex-1 flex-col items-center justify-center gap-2 text-sm capitalize dark:text-gray-300">
								<h2 className="text-2xl dark:text-white">{'(╯°□°）╯︵ ┻━┻'}</h2>
								{t('no-problem-found')}!
							</div>
						) : (
							<ProblemTab loading={loading != 0} problem={newestProblem?.[0]}></ProblemTab>
						)}
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-2 row-start-4 flex flex-col rounded-lg bg-white px-12 py-6 shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-3 dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)]"
					>
						<h2 className="text-2xl capitalize dark:text-white">{t('current-contest')}</h2>
						<div className="flex flex-1 items-center justify-center gap-4">
							{!user.joiningContest ? (
								<h3 className="dark:text-gray-400">{t('no-contest-join-msg')}</h3>
							) : (
								<>
									<img src={Contest} alt="" />
									<div className="flex flex-col">
										<Link
											to={routesConfig.contest.replace(':id', user.joiningContest)}
											className="text-lg capitalize hover:!text-yellow-400 hover:underline dark:text-white"
										>
											{currentContest?.title}
										</Link>
										{loading == 0 ? (
											<Countdown className="text-slate-500 dark:text-slate-400" date={new Date(currentContest?.endTime) || Date.now()}></Countdown>
										) : (
											<Skeleton className="h-6 w-24"></Skeleton>
										)}
									</div>
								</>
							)}
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-2 col-start-3 row-start-4 rounded-lg bg-white px-12 py-6 shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:col-span-1 lg:col-start-4 lg:row-span-2 lg:row-start-3 dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)]"
					>
						<h2 className="mb-2 text-2xl capitalize dark:text-white">{t('your-submissions')}</h2>

						<div className="grid grid-cols-2 grid-rows-4 gap-2">
							{Object.entries({
								ac: statusColors.ac, // AC - green-500
								wa: statusColors.wa, // WA - red-500
								tle: statusColors.tle, // TLE - yellow-500
								mle: statusColors.mle, // MLE - blue-500
								rte: statusColors.rte, // RTE - orange-500
								ce: statusColors.ce, // CE - rose-500
								ie: statusColors.ie, // IE - purple-600
							}).map((item, index) => (
								<div key={index} className="flex items-center gap-1 dark:text-gray-200">
									<div style={{ backgroundColor: item[1] }} className="size-5"></div>
									<span className="uppercase text-gray-600 dark:text-gray-400">{item[0]}</span>:
									<span className="dark:text-white">{statistic[index] === 0 ? 0 : statistic[index] || <Skeleton className="h-6 w-4 rounded-sm"></Skeleton>}</span>
								</div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
			<div className="grid w-full grid-cols-2 grid-rows-6 gap-4 gap-x-8 px-20 pb-16 pt-16 dark:text-white">
				<div className="col-span-2 row-span-2 lg:col-span-2 lg:row-span-3">
					<div className="flex items-center gap-2">
						<div className="h-8 w-1 bg-gray-300 dark:bg-zinc-800"></div>
						<Link to={routesConfig.problems} className="text-2xl capitalize text-gray-800 hover:text-blue-500 hover:underline dark:text-gray-200">
							{t('newest-problems')}
						</Link>
					</div>
					{loading === 0 ? (
						newestProblem?.map((item, index) => <ProblemTab className="!my-8" size="small" key={index} problem={item}></ProblemTab>)
					) : (
						<>
							<ProblemTab className="!my-8" size="small" loading={true}></ProblemTab>
							<ProblemTab className="!my-8" size="small" loading={true}></ProblemTab>
							<ProblemTab className="!my-8" size="small" loading={true}></ProblemTab>
							<ProblemTab className="!my-8" size="small" loading={true}></ProblemTab>
							<ProblemTab className="!my-8" size="small" loading={true}></ProblemTab>
						</>
					)}
				</div>
				<div className="col-span-2 row-span-2 lg:col-span-1 lg:row-span-3">
					<div className="flex items-center gap-2">
						<div className="h-8 w-1 bg-gray-300 dark:bg-zinc-800"></div>
						<Link to={routesConfig.users} className="text-2xl capitalize text-gray-800 hover:text-blue-500 hover:underline dark:text-gray-200">
							{t('top-users')}
						</Link>
					</div>
					{loading === 0 ? (
						<table className="mt-8 w-full bg-white text-gray-500 dark:bg-neutral-800 dark:text-gray-200">
							<thead className="h-12">
								<tr className="border border-gray-200 dark:border-neutral-700">
									<th className="w-20 px-4 py-2 text-sm font-semibold capitalize">{t('top')}</th>
									<th className="px-4 py-2 text-start text-sm font-semibold capitalize">{t('user')}</th>
									<th className="w-20 px-4 py-2 text-sm font-semibold capitalize">{t('point')}</th>
								</tr>
							</thead>
							<tbody>
								{standing?.map((item, index) => (
									<tr
										key={index}
										className="h-16 border border-gray-200 !bg-opacity-5 text-sm text-gray-800 hover:bg-blue-500 dark:border-neutral-700 dark:text-gray-100"
									>
										<td className="text-center">{index + 1}</td>
										<td>
											<Link className="flex items-center gap-2 hover:text-blue-500" to={routesConfig.user.replace(':name', item.name)}>
												<UserAvatar user={item}></UserAvatar>
												{item.name}
											</Link>
										</td>
										<td className="text-center">{item.totalScore}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<Skeleton className={'mt-8 h-[368px]'}></Skeleton>
					)}
				</div>
				<div className="col-span-2 row-span-2 lg:col-span-1 lg:row-span-3">
					<div className="flex items-center gap-2">
						<div className="h-8 w-1 bg-gray-300 dark:bg-zinc-800"></div>
						<Link to={routesConfig.submissions} className="text-2xl capitalize text-gray-800 hover:text-blue-500 hover:underline dark:text-gray-200">
							{t('activities')}
						</Link>
					</div>
					{loading === 0 ? (
						<div className="mt-8 max-h-[368px] w-full overflow-auto border border-gray-200 bg-white py-3 dark:border-neutral-700 dark:bg-neutral-800">
							{activities?.map((item, index) => (
								<div key={index} className="group flex h-[62px] w-full pb-5 last:h-[42px] last:!pb-0">
									<div>
										<div className="relative h-full w-16">
											<div className="absolute left-1/2 h-1/2 w-[2px] -translate-x-1/2 bg-blue-200 bg-opacity-50 group-first:hidden"></div>
											<div className="absolute left-1/2 top-1/2 h-[41px] w-[2px] -translate-x-1/2 bg-blue-200 bg-opacity-50 group-last:hidden"></div>
											<div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500"></div>
										</div>
										<div className="h-full flex-1"></div>
									</div>
									<div className="flex-1 pt-1">
										<div className="text-sm text-gray-700 dark:text-gray-200">
											<Link to={routesConfig.user.replace(':name', item.author)} className="font-semibold capitalize text-blue-500">
												{item.author}
											</Link>
											{` ${t('solved-msg')} `}
											<Link to={routesConfig.problem.replace(':id', item.forProblem)} className="font-semibold text-blue-500">
												{item.forProblem}
											</Link>
										</div>
										<div className="text-xs text-gray-400">{formatedDate(new Date(item.createdAt))}</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<Skeleton className={'mt-8 h-[368px]'}></Skeleton>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
