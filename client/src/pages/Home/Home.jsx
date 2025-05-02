import { motion } from 'framer-motion';
import { Link } from 'react-router';

import useAuthStore from '~/stores/authStore';
import UserAvatar from '~/components/UserAvatar';
import routesConfig from '~/config/routes';

const Home = () => {
	const { user } = useAuthStore();

	return (
		<div className="flex-1">
			<div className="h-[90%] w-full bg-white dark:bg-[rgb(27,27,29)] mt-[2px] px-20 py-[88px]">
				<div className="grid grid-cols-4 grid-rows-2 gap-4 h-full">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="rounded-lg dark:bg-zinc-800 shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white row-span-2 py-8 gap-y-4 flex flex-col"
					>
						<Link to={routesConfig.user.replace(':name', user.name)}>
							<UserAvatar className="size-36 mx-auto" user={user}></UserAvatar>
						</Link>
						<h2 className="text-xl dark:text-white text-center">{user?.fullname || user?.name}</h2>
						<span>top % bar</span>
						<div className="h-28 w-full flex px-8 mt-auto">
							<span className="bg-red-500 flex-1 h-full"></span>
							<span className="mx-8 my-auto border dark:border-neutral-700 h-3/4"></span>
							<span className="bg-red-500 flex-1 h-full"></span>
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="rounded-lg dark:bg-zinc-800 shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white row-span-2"
					></motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="rounded-lg dark:bg-zinc-800 shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white col-span-2"
					></motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="rounded-lg dark:bg-zinc-800 shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white col-start-3 row-start-2"
					></motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="rounded-lg dark:bg-zinc-800 shadow-[0px_0px_7px_rgba(0,0,0,0.2)] bg-white col-start-4 row-start-2"
					></motion.div>
				</div>
			</div>
		</div>
	);
};

export default Home;
