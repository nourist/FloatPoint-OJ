const routesConfig = {
	welcome: '/',
	notFound: '/404',
	login: '/login',
	signup: '/signup',
	verifyEmail: '/verify',
	sendVerifyCode: '/re-verify',
	forgotPassword: '/forgot-password',
	resetPassword: '/reset-password/:token',
	home: '/home',
	problem: '/problem/:id',
	problems: '/problems',
	submission: '/submission/:id',
	submissions: '/submissions',
	submit: '/submit',
	contest: '/contest/:id',
	contests: '/contests',
	user: '/user/:name',
	users: '/users',
	setting: '/setting',
	avatarChange: '/avatar-change',
};

export default routesConfig;
