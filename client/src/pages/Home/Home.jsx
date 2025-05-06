import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Countdown from 'react-countdown';

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

	useEffect(() => {
		getProblems({ size: 5, sortBy: 'createdAt', order: -1 })
			.then((res) => {
				setNewestProblem(res.data);
			})
			.catch((err) => toast.error(err.response.data.msg));
		if (user?.joiningContest)
			getContest(user?.joiningContest)
				.then((res) => {
					setCurrentContest(res.data);
				})
				.catch((err) => toast.error(err.response.data.msg));
		if (user)
			getSubmissions({ author: user?.name })
				.then((res) => setStatistic(res.stat.status))
				.catch((err) => toast.error(err.response.data.msg));
		getUsers({ size: 5, sortBy: 'totalScore', order: -1 })
			.then((res) => setStanding(res.data))
			.catch((err) => toast.error(err.response.data.msg));
		getSubmissions({ sortBy: 'createdAt', order: -1, size: 15, status: 'AC' })
			.then((res) => setActivities(res.data))
			.catch((err) => toast.error(err.response.data.msg));
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
			<div className="lg:h-[90%] h-[100%] w-full bg-white dark:bg-[rgb(27,27,29)] mt-[2px] px-20 pt-12 pb-[88px]">
				<div className="grid grid-cols-4 grid-rows-4 gap-4 h-full">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-2 row-span-2 rounded-lg dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:row-span-4 lg:col-span-1 py-8 gap-y-4 flex flex-col"
					>
						<Link to={routesConfig.user.replace(':name', user.name)}>
							<UserAvatar className="size-36 mx-auto" user={user}></UserAvatar>
						</Link>
						<h2 className="text-xl dark:text-white text-center">{user?.fullname || user?.name}</h2>
						<div className="w-full px-8">
							<div className="flex font-light">
								<span className="text-sm dark:text-white">{t('better-than')}</span>
								<span className="text-sm dark:text-white ml-auto">
									<span className="text-blue-500">{100 - user?.topPercent}%</span> {t('user')}
								</span>
							</div>
							<div className="dark:bg-[rgb(33,33,37)] bg-gray-200 h-2 w-full">
								<div className={`bg-[#0066B8] h-full`} style={{ width: `${100 - user?.topPercent}%` }}></div>
							</div>
						</div>
						<div className="h-28 w-full flex px-8 mt-auto">
							<span className="dark:bg-[rgb(33,33,37)] bg-slate-200 bg-opacity-60 flex-1 h-full flex flex-col justify-between py-5">
								<Trophy className="mx-auto"></Trophy>
								<h3 className="text-2xl dark:text-white text-center">{user?.top}</h3>
							</span>
							<span className="mx-8 my-auto border dark:border-neutral-700 h-3/4"></span>
							<span className="dark:bg-[rgb(33,33,37)] bg-slate-200 bg-opacity-60 flex-1 h-full flex flex-col justify-between py-5">
								<div className="text-center">
									<FontAwesomeIcon className="size-8 text-[#0066B8]" icon="fa-solid fa-star" />
								</div>
								<h3 className="text-2xl dark:text-white text-center">{user?.totalScore}</h3>
							</span>
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="flex flex-col items-center gap-4 py-8 col-span-2 row-span-2 col-start-3 rounded-lg dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:row-span-4 lg:col-span-1"
					>
						<h2 className="text-xl dark:text-white capitalize">{t('statistics')}</h2>
						<div className="w-[200px] h-[200px] my-2 flex flex-col items-center justify-center border-8 rounded-full dark:border-zinc-700">
							<div className="text-4xl dark:text-white ">{user?.totalAttempt}</div>
							<div className="dark:text-gray-400 text-gray-600 capitalize text-sm mt-2">{t('attempted')}</div>
						</div>
						<div className="flex items-center gap-4 capitalize dark:text-white">
							<div className="w-4 h-4 rounded-full bg-green-500"></div>
							{t('finished')}
							<div className="h-[2px] w-4 dark:bg-white bg-gray-600"></div>
							{user?.totalAC}
						</div>
						<div className="flex items-center gap-4 capitalize dark:text-white">
							<div className="w-4 h-4 rounded-full bg-red-500"></div>
							<div className="dark:text-gray-400 text-gray-600">{t('unfinished')}</div>
							<div className="h-[2px] w-4 dark:bg-white bg-gray-600"></div>
							{user?.totalAC}
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-4 row-start-3 py-8 px-12 rounded-lg flex flex-col dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:col-span-2 lg:row-span-2"
					>
						<div className="flex">
							<h2 className="text-2xl dark:text-white capitalize">{t('newest-problem')}</h2>
							<Link to={routesConfig.problems} className="ml-auto text-blue-600 hover:underline capitalize text-sm">
								{t('view-more')}
							</Link>
						</div>
						{!newestProblem ? (
							<div className="flex flex-1 text-sm items-center capitalize justify-center flex-col dark:text-gray-300 gap-2">
								<h2 className="text-2xl dark:text-white">{'(╯°□°）╯︵ ┻━┻'}</h2>
								{t('no-problem-found')}!
							</div>
						) : (
							<ProblemTab problem={newestProblem?.[0]}></ProblemTab>
						)}
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-2 row-start-4 py-6 px-12 rounded-lg flex flex-col dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:row-span-2 lg:col-start-3 lg:row-start-3 lg:col-span-1"
					>
						<h2 className="text-2xl dark:text-white capitalize">{t('current-contest')}</h2>
						<div className="flex flex-1 items-center justify-center gap-4">
							{!user.joiningContest ? (
								<h3 className="dark:text-gray-400">{t('no-contest-join-msg')}</h3>
							) : (
								<>
									<img src={Contest} alt="" />
									<div className="flex-col flex">
										<Link
											to={routesConfig.contest.replace(':id', user.joiningContest)}
											className="hover:underline hover:!text-yellow-400 text-lg capitalize dark:text-white"
										>
											{currentContest?.title}
										</Link>
										<Countdown className="dark:text-slate-400 text-slate-500" date={new Date(currentContest?.endTime) || Date.now()}></Countdown>
									</div>
								</>
							)}
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-2 col-start-3 row-start-4 py-6 px-12 rounded-lg dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:row-span-2 lg:col-start-4 lg:row-start-3 lg:col-span-1"
					>
						<h2 className="text-2xl dark:text-white capitalize mb-2">{t('your-submissions')}</h2>

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
									<span className="dark:text-gray-400 uppercase text-gray-600">{item[0]}</span>:<span className="dark:text-white">{statistic[index] || 0}</span>
								</div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
			<div className="w-full px-20 dark:text-white pt-16 grid grid-cols-2 grid-rows-6 gap-4 gap-x-8 pb-16">
				<div className="lg:col-span-2 lg:row-span-3 col-span-2 row-span-2">
					<div className="flex items-center gap-2">
						<div className="h-8 w-1 bg-gray-300 dark:bg-zinc-800"></div>
						<Link to={routesConfig.problems} className="text-2xl dark:text-gray-200 hover:text-blue-500 hover:underline text-gray-800 capitalize">
							{t('newest-problems')}
						</Link>
					</div>
					{newestProblem?.map((item, index) => (
						<ProblemTab className="!my-8" size="small" key={index} problem={item}></ProblemTab>
					))}
				</div>
				<div className="lg:col-span-1 lg:row-span-3 col-span-2 row-span-2">
					<div className="flex items-center gap-2">
						<div className="h-8 w-1 bg-gray-300 dark:bg-zinc-800"></div>
						<Link to={routesConfig.users} className="text-2xl dark:text-gray-200 text-gray-800 capitalize hover:text-blue-500 hover:underline">
							{t('top-users')}
						</Link>
					</div>
					<table className="w-full text-gray-500 mt-8 bg-white dark:text-gray-200 dark:bg-neutral-800">
						<thead className="h-12">
							<tr className="border border-gray-200 dark:border-neutral-700">
								<th className="w-20 px-4 py-2 font-semibold text-sm capitalize">{t('top')}</th>
								<th className="text-start px-4 py-2 font-semibold text-sm capitalize">{t('user')}</th>
								<th className="w-20 px-4 py-2 font-semibold text-sm capitalize">{t('point')}</th>
							</tr>
						</thead>
						<tbody>
							{standing?.map((item, index) => (
								<tr
									key={index}
									className="border border-gray-200 dark:border-neutral-700 h-16 hover:bg-blue-500 !bg-opacity-5 text-sm text-gray-800 dark:text-gray-100"
								>
									<td className="text-center">{index + 1}</td>
									<td>
										<Link className="hover:text-blue-500 flex items-center gap-2" to={routesConfig.user.replace(':name', item.name)}>
											<UserAvatar user={item}></UserAvatar>
											{item.name}
										</Link>
									</td>
									<td className="text-center">{item.totalScore}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="lg:col-span-1 lg:row-span-3 col-span-2 row-span-2">
					<div className="flex items-center gap-2">
						<div className="h-8 w-1 bg-gray-300 dark:bg-zinc-800"></div>
						<Link to={routesConfig.submissions} className="text-2xl dark:text-gray-200 text-gray-800 capitalize hover:text-blue-500 hover:underline">
							{t('activities')}
						</Link>
					</div>
					<div className="w-full bg-white dark:bg-neutral-800 dark:border-neutral-700 mt-8 border max-h-[390px] border-gray-200 py-3 overflow-auto">
						{activities?.map((item, index) => (
							<div key={index} className="h-[62px] w-full flex pb-5 last:!pb-0 last:h-[42px] group">
								<div>
									<div className="h-full w-16 relative">
										<div className="group-first:hidden w-[2px] h-1/2 absolute left-1/2 -translate-x-1/2 bg-blue-200 bg-opacity-50"></div>
										<div className="group-last:hidden w-[2px] h-[41px] absolute left-1/2 top-1/2 -translate-x-1/2 bg-blue-200 bg-opacity-50"></div>
										<div className="size-3 rounded-full bg-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
									</div>
									<div className="h-full flex-1"></div>
								</div>
								<div className="flex-1 pt-1">
									<div className="text-sm text-gray-700 dark:text-gray-200">
										<Link to={routesConfig.user.replace(':name', item.author)} className="text-blue-500 font-semibold capitalize">
											{item.author}
										</Link>
										{` ${t('solved-msg')} `}
										<Link to={routesConfig.problem.replace(':id', item.forProblem)} className="text-blue-500 font-semibold">
											{item.forProblem}
										</Link>
									</div>
									<div className="text-xs text-gray-400">{formatedDate(new Date(item.createdAt))}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
