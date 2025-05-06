import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MemoryStick, Clock9, Star, CircleCheck } from 'lucide-react';
import { Button } from '~/components/ui/button';
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

const Home = () => {
	const { user } = useAuthStore();
	const { t } = useTranslation('home');
	const [newestProblem, setNewestProblem] = useState();
	const [currentContest, setCurrentContest] = useState();
	const [statistic, setStatistic] = useState({});

	useEffect(() => {
		getProblems({ size: 1, sortBy: 'createdAt', order: -1 })
			.then((res) => {
				setNewestProblem(res.data?.[0]);
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
	}, [user]);

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
							<div className="flex my-auto gap-4">
								<div
									data-difficulty={newestProblem.difficulty}
									className="size-16 capitalize flex items-center justify-center text-2xl font-bold data-[difficulty=easy]:bg-green-500 data-[difficulty=medium]:bg-yellow-400 data-[difficulty=hard]:bg-red-500 data-[difficulty=easy]:border-green-500 data-[difficulty=medium]:border-yellow-400 data-[difficulty=hard]:border-red-500 data-[difficulty=easy]:text-green-500 data-[difficulty=medium]:text-yellow-400 data-[difficulty=hard]:text-red-500 border-2 rounded-lg !bg-opacity-30 "
								>
									{newestProblem.difficulty[0]}
								</div>
								<div className="text-xl dark:text-white flex flex-col justify-around">
									{newestProblem.name}
									<div className="flex text-sm dark:text-gray-400 text-gray-500 gap-1">
										<Star className="size-4" strokeWidth={1}></Star>
										{newestProblem.point}
										<CircleCheck className="size-4 ml-2" strokeWidth={1}></CircleCheck>
										{newestProblem.noOfSubm === 0 ? 0 : Math.round((newestProblem.noOfSuccess / newestProblem.noOfSubm) * 100)}%
										<MemoryStick className="size-4 ml-2" strokeWidth={1}></MemoryStick>
										{newestProblem.memoryLimit}MB
										<Clock9 className="size-4 ml-2" strokeWidth={1}></Clock9>
										{newestProblem.timeLimit}s
									</div>
								</div>
								<Button asChild className="ml-auto my-auto w-32 h-8 !bg-blue-500 rounded-sm !text-white">
									<Link to={routesConfig.problem.replace(':id', newestProblem.id)}>
										<div className="text-xl">{'>'}</div>
										{t('try-now')}
									</Link>
								</Button>
							</div>
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
			<div className="w-full px-20 dark:text-white pt-16 grid grid-cols-2 grid-rows-8 gap-4">
				<div className="col-span-2 lg:col-span-1 lg:row-span-2">
					<div className="flex items-center gap-2">
						<div className="h-8 w-1 bg-gray-300 dark:bg-zinc-800"></div>
						<h2 className="text-2xl dark:text-gray-200 text-gray-800 capitalize">{t('newest-problems')}</h2>
					</div>
				</div>
				<div className="col-span-2 lg:col-span-1 lg:row-span-2 row-start-2">
					<div className="flex items-center gap-2">
						<div className="h-8 w-1 bg-gray-300 dark:bg-zinc-800"></div>
						<h2 className="text-2xl dark:text-gray-200 text-gray-800 capitalize">{t('ongoing-contests')}</h2>
					</div>
				</div>
				<div className="col-span-2 lg:col-span-1 lg:row-span-2 row-start-3">
					<div className="flex items-center gap-2">
						<div className="h-8 w-1 bg-gray-300 dark:bg-zinc-800"></div>
						<h2 className="text-2xl dark:text-gray-200 text-gray-800 capitalize">{t('top-user')}</h2>
					</div>
				</div>
				<div className="col-span-2 lg:col-span-1 lg:row-span-2 row-start-4">
					<div className="flex items-center gap-2">
						<div className="h-8 w-1 bg-gray-300 dark:bg-zinc-800"></div>
						<h2 className="text-2xl dark:text-gray-200 text-gray-800 capitalize">{t('activities')}</h2>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
