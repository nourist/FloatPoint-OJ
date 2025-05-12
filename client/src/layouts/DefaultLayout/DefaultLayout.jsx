import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sun, MoonStar } from 'lucide-react';
import { Button } from '~/components/ui/button';

import routesConfig from '~/config/routes';
import useAuthStore from '~/stores/authStore';
import useThemeStore from '~/stores/themeStore';
import AvatarWithMenu from '~/components/AvatarWithMenu';
import Logo from '~/assets/images/logo.png';

const DefaultLayout = ({ children, footer }) => {
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
			<header className="flex h-16 items-center space-x-4 bg-white px-16 shadow dark:bg-neutral-800">
				<Link to={routesConfig.home}>
					<img src={Logo} className="size-8" alt="" />
				</Link>

				{[
					{
						title: t('home'),
						path: routesConfig.home,
					},
					{
						title: t('problem'),
						path: routesConfig.problems,
					},
					{
						title: t('submission'),
						path: routesConfig.submissions,
					},
					{
						title: t('contest'),
						path: routesConfig.contests,
					},
				].map((item, index) => (
					<Button key={index} variant="ghost" asChild>
						<Link
							className={`text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 ${isActive(item.path) ? 'bg-zinc-200 text-gray-800 dark:!bg-zinc-900' : 'dark:hover:!bg-zinc-700'}`}
							to={item.path}
						>
							{item.title}
						</Link>
					</Button>
				))}
				{isAuth ? (
					<>
						<Button variant="ghost" className="text-gray-70 group !ml-auto h-8 px-2 dark:text-gray-300 dark:hover:!bg-zinc-700">
							<FontAwesomeIcon icon="fa-regular fa-star" className="group-hover:text-secondary" />
							{user?.totalScore}
						</Button>
						<AvatarWithMenu></AvatarWithMenu>
					</>
				) : (
					<>
						<Button className="!ml-auto h-8 !bg-sky-500 dark:!bg-sky-500/20">
							<Link to={routesConfig.login} className="text-xs font-medium text-white dark:text-sky-400">
								{t('login')}
							</Link>
						</Button>
						<button
							className={`flex size-8 items-center justify-center rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-neutral-900 dark:hover:bg-gray-700`}
							onClick={() => setMode(theme == 'dark' ? 'light' : 'dark')}
						>
							{theme == 'dark' ? (
								// <FontAwesomeIcon icon="fa-solid fa-moon" className="text-slate-400 rotate-[-15deg]" />
								<MoonStar className="text-slate-300" size="18px"></MoonStar>
							) : (
								// <FontAwesomeIcon icon="fa-solid fa-sun" className="text-gray-600" />
								<Sun className="text-gray-700" size="18px"></Sun>
							)}
						</button>
					</>
				)}
			</header>
			<div className="flex min-h-[calc(100%-64px)] flex-col">{children}</div>
			{footer}
		</div>
	);
};

DefaultLayout.propTypes = {
	children: PropTypes.node,
	footer: PropTypes.node,
};

export default DefaultLayout;
