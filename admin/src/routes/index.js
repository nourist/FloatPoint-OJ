import Login from '~/pages/Login';
import NotFound from '~/pages/NotFound';
import Dashboard from '~/pages/Dashboard';
import Users from '~/pages/Users';
import Problems from '~/pages/Problems';
import Submissions from '~/pages/Submissions';
import Contests from '~/pages/Contests';
import ProblemId from '~/pages/ProblemId';
import CreateProblem from '~/pages/CreateProblem';
import SubmissionId from '~/pages/SubmissionId';
import UserId from '~/pages/UserId';
import ContestId from '~/pages/ContestId';
import CreateContest from '~/pages/CreateContest';

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
		page: Users,
	},
	{
		path: '/problem',
		page: Problems,
	},
	{
		path: '/submission',
		page: Submissions,
	},
	{
		path: '/contest',
		page: Contests,
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
	},
	{
		path: '/user/:name',
		page: UserId,
	},
	{
		path: '/contest/:id',
		page: ContestId,
	},
	{
		path: '/contest/create',
		page: CreateContest,
	},
];

export default routes;
