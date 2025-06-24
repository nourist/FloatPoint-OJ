import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import routesConfig from '~/config/routes';
import useAuthStore from '~/stores/authStore';

const NotFound = () => {
	const { t } = useTranslation('notFound');
	const { isAuth } = useAuthStore();

	return (
		<div className="flex h-full w-full justify-center py-[10%] dark:bg-gray-900">
			<div className="text-center">
				<p className="text-base font-semibold text-sky-500">404</p>
				<h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl dark:text-gray-100">{t('title')}</h1>
				<p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">{t('text')}</p>
				<Link
					to={isAuth ? routesConfig.home : routesConfig.welcome}
					className="mt-6 inline-block rounded-md bg-sky-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
				>
					{t('back-home')}
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
