import controllers from './controllers.js';

const route = (app) => {
	app.get('/', controllers.home);
	app.post('/judge', controllers.judge);
};

export default route;
