import routesConfig from '~/config/routes';
import Welcome from '~/pages/Welcome';
import NotFound from '~/pages/NotFound';
import Home from '~/pages/Home';
import Problem from '~/pages/Problem';
import Submission from '~/pages/Submission';
import Contest from '~/pages/Contest';
import Signup from '~/pages/Signup';
import Login from '~/pages/Login';
import VerifyEmail from '~/pages/VerifyEmail';
import ResetPassword from '~/pages/ResetPassword';

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
		path: routesConfig.signup,
		page: Signup,
		type: 'redirect',
	},
	{
		path: routesConfig.login,
		page: Login,
		type: 'redirect',
	},
	{
		path: routesConfig.verifyEmail,
		page: VerifyEmail,
		type: 'redirect',
	},
	{
		path: routesConfig.resetPassword,
		page: ResetPassword,
		type: 'auth',
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
