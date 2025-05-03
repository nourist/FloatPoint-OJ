import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import useAuthStore from '~/stores/authStore';
import UserAvatar from '~/components/UserAvatar';
import routesConfig from '~/config/routes';
import Trophy from '~/assets/icons/trophy.svg';

const Home = () => {
	const { user } = useAuthStore();
	const { t } = useTranslation('home');

	console.log(user);

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
							<div className="dark:bg-[rgb(33,33,37)] h-2 w-full">
								<div className={`dark:bg-[#0066B8] h-full`} style={{ width: `${100 - user?.topPercent}%` }}></div>
							</div>
						</div>
						<div className="h-28 w-full flex px-8 mt-auto">
							<span className="dark:bg-[rgb(33,33,37)] flex-1 h-full flex flex-col justify-between py-5">
								<Trophy className="mx-auto"></Trophy>
								<h3 className="text-2xl dark:text-white text-center">{user?.top}</h3>
							</span>
							<span className="mx-8 my-auto border dark:border-neutral-700 h-3/4"></span>
							<span className="dark:bg-[rgb(33,33,37)] flex-1 h-full flex flex-col justify-between py-5">
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
							<div className="text-4xl dark:text-white">{user?.totalAttempt}</div>
							<div className="dark:text-gray-400 capitalize text-sm mt-2">{t('attempted')}</div>
						</div>
						<div className="flex items-center gap-4 capitalize dark:text-white">
							<div className="w-4 h-4 rounded-full bg-green-500"></div>
							{t('finished')}
							<div className="h-[2px] w-4 dark:bg-white"></div>
							{user?.totalAC}
						</div>
						<div className="flex items-center gap-4 capitalize dark:text-white">
							<div className="w-4 h-4 rounded-full bg-red-500"></div>
							<div className="dark:text-gray-400">{t('unfinished')}</div>
							<div className="h-[2px] w-4 dark:bg-white"></div>
							{user?.totalAC}
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-4 row-start-3 rounded-lg dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:col-span-2 lg:row-span-2"
					></motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-2 row-start-4 rounded-lg dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:row-span-2 lg:col-start-3 lg:row-start-3 lg:col-span-1"
					></motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="col-span-2 col-start-3 row-start-4 rounded-lg dark:bg-zinc-800 dark:shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white shadow-[0px_0px_7px_rgba(0,70,155,0.2)] lg:row-span-2 lg:col-start-4 lg:row-start-3 lg:col-span-1"
					></motion.div>
				</div>
			</div>
		</div>
	);
};

export default Home;
