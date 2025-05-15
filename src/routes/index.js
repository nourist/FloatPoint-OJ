import Login from '~/pages/Login';
import NotFound from '~/pages/NotFound';
import Dashboard from '~/pages/Dashboard';

const routes = [
	{
		path: '/login',
		page: Login,
		layout: null,
	},
	{
		path: '/404',
		page: NotFound,
	},
	{
		path: '/',
		page: Dashboard,
	},
];

export default routes;
