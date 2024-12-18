import auth from './authRoutes.js';

function route(app) {
	app.get('/', (req, res, next) => res.send('hello world!'));
	app.use('/auth', auth);
}

export default route;
