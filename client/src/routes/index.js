import routesConfig from '~/config/routes';
import DefaultLayoutWithFooter from '~/layouts/DefaultLayoutWithFooter';
import Welcome from '~/pages/Welcome';
import NotFound from '~/pages/NotFound';
import Home from '~/pages/Home';
import Problem from '~/pages/Problem';
import Problems from '~/pages/Problems';
import Submission from '~/pages/Submission';
import Submissions from '~/pages/Submissions';
import Contest from '~/pages/Contest';
import Contests from '~/pages/Contests';
import User from '~/pages/User';
import Users from '~/pages/Users';
import Submit from '~/pages/Submit';
import Signup from '~/pages/Signup';
import Login from '~/pages/Login';
import VerifyEmail from '~/pages/VerifyEmail';
import ForgotPassword from '~/pages/ForgotPassword';
import ResetPassword from '~/pages/ResetPassword';
import SendVerifyCode from '~/pages/SendVerifyCode';
import Setting from '~/pages/Setting';
import AvatarChange from '~/pages/AvatarChange';

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
		layout: DefaultLayoutWithFooter,
		type: 'redirect',
	},
	{
		path: routesConfig.login,
		page: Login,
		layout: DefaultLayoutWithFooter,
		type: 'redirect',
	},
	{
		path: routesConfig.verifyEmail,
		page: VerifyEmail,
		layout: DefaultLayoutWithFooter,
		type: 'redirect',
	},
	{
		path: routesConfig.sendVerifyCode,
		page: SendVerifyCode,
		layout: DefaultLayoutWithFooter,
		type: 'redirect',
	},
	{
		path: routesConfig.forgotPassword,
		page: ForgotPassword,
		layout: DefaultLayoutWithFooter,
		type: 'redirect',
	},
	{
		path: routesConfig.resetPassword,
		page: ResetPassword,
		layout: DefaultLayoutWithFooter,
		type: 'redirect',
	},
	{
		path: routesConfig.home,
		page: Home,
		layout: DefaultLayoutWithFooter,
	},
	{
		path: routesConfig.problem,
		page: Problem,
	},
	{
		path: routesConfig.problems,
		page: Problems,
		layout: DefaultLayoutWithFooter,
	},
	{
		path: routesConfig.submission,
		page: Submission,
		type: 'auth',
	},
	{
		path: routesConfig.submissions,
		page: Submissions,
		layout: DefaultLayoutWithFooter,
	},
	{
		path: routesConfig.contest,
		page: Contest,
		type: 'auth',
	},
	{
		path: routesConfig.contests,
		page: Contests,
		layout: DefaultLayoutWithFooter,
	},
	{
		path: routesConfig.user,
		page: User,
	},
	{
		path: routesConfig.users,
		page: Users,
		layout: DefaultLayoutWithFooter,
	},
	{
		path: routesConfig.submit,
		page: Submit,
		type: 'auth',
	},
	{
		path: routesConfig.setting,
		page: Setting,
		type: 'auth',
	},
	{
		path: routesConfig.avatarChange,
		page: AvatarChange,
		type: 'auth',
	},
];

export default routes;
