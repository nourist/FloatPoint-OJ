import routesConfig from '~/config/routes';
import Welcome from '~/pages/Welcome';
import NotFound from '~/pages/NotFound';
import Home from '~/pages/Home';
import Problem from '~/pages/Problem';
import Problems from '~/pages/Problems';
import Submission from '~/pages/Submission';
import Contest from '~/pages/Contest';
import Signup from '~/pages/Signup';
import Login from '~/pages/Login';
import VerifyEmail from '~/pages/VerifyEmail';
import ForgotPassword from '~/pages/ForgotPassword';
import ResetPassword from '~/pages/ResetPassword';
import SendVerifyCode from '~/pages/SendVerifyCode';

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
		path: routesConfig.sendVerifyCode,
		page: SendVerifyCode,
		type: 'redirect',
	},
	{
		path: routesConfig.forgotPassword,
		page: ForgotPassword,
		type: 'redirect',
	},
	{
		path: routesConfig.resetPassword,
		page: ResetPassword,
		type: 'redirect',
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
		path: routesConfig.problems,
		page: Problems,
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
