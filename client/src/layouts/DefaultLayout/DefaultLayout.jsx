import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '~/components/ui/button';

import routesConfig from '~/config/routes';
import useAuthStore from '~/stores/authStore';
import useThemeStore from '~/stores/themeStore';
import AvatarWithMenu from '~/components/AvatarWithMenu';

const DefaultLayout = ({ children }) => {
	const { t } = useTranslation();
	const location = useLocation();
	const { isAuth, user } = useAuthStore();
	const { theme, setMode } = useThemeStore();

	const isActive = (path) => {
		const regex = new RegExp(`^${path}`);
		return regex.test(location.pathname);
	};

	return (
		<div className="h-full w-full overflow-auto bg-gray-100 dark:bg-neutral-900">
			<header className="h-16 px-16 flex items-center space-x-4 dark:bg-neutral-800 bg-white shadow">
				<Link to={routesConfig.home}>
					<img src="./logo.png" className="size-8" alt="" />
				</Link>

				{[
					{
						title: t('home'),
						path: routesConfig.home,
					},
					{
						title: t('problem'),
						path: routesConfig.problem,
					},
					{
						title: t('submission'),
						path: routesConfig.submission,
					},
					{
						title: t('contest'),
						path: routesConfig.contest,
					},
				].map((item, index) => (
					<Button key={index} variant="ghost" asChild>
						<Link
							className={`text-gray-600 font-medium text-sm hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 ${isActive(item.path) ? 'bg-zinc-200 text-gray-800 dark:!bg-zinc-900' : 'dark:hover:!bg-zinc-700'}`}
							to={item.path}
						>
							{item.title}
						</Link>
					</Button>
				))}
				{isAuth ? (
					<>
						<Button variant="ghost" className="!ml-auto px-2 h-8 text-gray-70 dark:hover:!bg-zinc-700 dark:text-gray-300 group">
							<FontAwesomeIcon icon="fa-regular fa-star" className="group-hover:text-secondary" />
							{user.totalScore}
						</Button>
						<Button variant="ghost" className="h-8 w-8 text-gray-700 dark:hover:!bg-zinc-700 dark:text-gray-300 dot" size="icon">
							<FontAwesomeIcon icon="fa-regular fa-bell" />
						</Button>
						<AvatarWithMenu></AvatarWithMenu>
					</>
				) : (
					<>
						<Button className="!bg-sky-500 !ml-auto h-8 dark:!bg-sky-500/30">
							<Link to={routesConfig.login} className="text-white dark:text-sky-400 font-medium text-xs">
								{t('login')}
							</Link>
						</Button>
						<button
							className={`size-8 bg-slate-200 hover:bg-slate-300 dark:bg-neutral-900 dark:hover:bg-gray-700 rounded-md`}
							onClick={() => setMode(theme == 'dark' ? 'light' : 'dark')}
						>
							{theme == 'dark' ? (
								<FontAwesomeIcon icon="fa-solid fa-moon" className="text-slate-400 rotate-[-15deg]" />
							) : (
								<FontAwesomeIcon icon="fa-solid fa-sun" className="text-gray-600" />
							)}
						</button>
					</>
				)}
			</header>
			{children}
		</div>
	);
};

DefaultLayout.propTypes = {
	children: PropTypes.node,
};

export default DefaultLayout;
