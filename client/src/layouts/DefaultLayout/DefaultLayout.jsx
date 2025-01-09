import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';

import routesConfig from '~/config/routes';

const DefaultLayout = ({ children }) => {
	const { t } = useTranslation();

	return (
		<div className="h-full w-full overflow-auto bg-gray-100 dark:bg-neutral-900">
			<header className="h-16 px-12 flex items-center space-x-4 dark:bg-neutral-800 bg-white shadow">
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
						<Link className="text-gray-600 font-medium text-sm hover:text-gray-700 dark:text-gray-300 dark:hover:!bg-zinc-700 dark:hover:text-gray-100" to={item.path}>
							{item.title}
						</Link>
					</Button>
				))}
			</header>
			{children}
		</div>
	);
};

DefaultLayout.propTypes = {
	children: PropTypes.node,
};

export default DefaultLayout;
