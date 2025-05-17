import auth from './authRoutes.js';
import user from './userRoutes.js';
import problem from './problemRoutes.js';
import submission from './submissionRoutes.js';
import contest from './contestRoutes.js';
import statRoutes from './statRoutes.js';

function route(app) {
	app.get('/', (req, res, next) => res.send('Hello world!'));
	app.use('/auth', auth);
	app.use('/user', user);
	app.use('/problem', problem);
	app.use('/submission', submission);
	app.use('/contest', contest);
	app.use('/stat', statRoutes);
}

export default route;
