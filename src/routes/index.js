import Login from '~/pages/Login';
import NotFound from '~/pages/NotFound';
import Dashboard from '~/pages/Dashboard';
import User from '~/pages/User';
import Problem from '~/pages/Problem';
import Submission from '~/pages/Submission';
import Contest from '~/pages/Contest';
import Setting from '~/pages/Setting';
import ProblemId from '~/pages/ProblemId';
import CreateProblem from '~/pages/CreateProblem';
import SubmissionId from '~/pages/SubmissionId';

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
	{
		path: '/problem/:id',
		page: ProblemId,
	},
	{
		path: '/problem/create',
		page: CreateProblem,
	},
	{
		path: '/submission/:id',
		page: SubmissionId,
	}
];

export default routes;
