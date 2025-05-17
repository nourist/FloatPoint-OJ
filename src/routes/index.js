import Login from '~/pages/Login';
import NotFound from '~/pages/NotFound';
import Dashboard from '~/pages/Dashboard';
import User from '~/pages/User';
import Problem from '~/pages/Problem';
import Submission from '~/pages/Submission';
import Contest from '~/pages/Contest';
import Setting from '~/pages/Setting';

const routes = [
	{
		path: '/login',
		page: Login,
		layout: null,
	},
	{
		path: '/404',
		page: NotFound,
		layout: null,
	},
	{
		path: '/',
		page: Dashboard,
	},
	{
		path: '/user',
		page: User,
	},
	{
		path: '/problem',
		page: Problem,
	},
	{
		path: '/submission',
		page: Submission,
	},
	{
		path: '/contest',
		page: Contest,
	},
	{
		path: '/setting',
		page: Setting,
	},
];

export default routes;
