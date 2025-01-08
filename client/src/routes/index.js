import routesConfig from '~/config/routes';
import Welcome from '~/pages/Welcome';
import NotFound from '~/pages/NotFound';
import Home from '~/pages/Home';
import Problem from '~/pages/Problem';
import Submission from '~/pages/Submission';
import Contest from '~/pages/Contest';

const routes = [
	{
		path: routesConfig.welcome,
		page: Welcome,
		layout: null,
	},
	{
		path: routesConfig.notFound,
		page: NotFound,
		layout: null,
	},
	{
		path: routesConfig.home,
		page: Home,
	},
	{
		path: routesConfig.problem,
		page: Problem,
	},
	{
		path: routesConfig.submission,
		page: Submission,
	},
	{
		path: routesConfig.contest,
		page: Contest,
	},
];

export default routes;
