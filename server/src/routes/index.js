import auth from './authRoutes.js';
import problem from './problemRoutes.js';

function route(app) {
	app.get('/', (req, res, next) => res.send('hello world!'));
	app.use('/auth', auth);
	app.use('/problem', problem);
}

export default route;
