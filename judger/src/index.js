import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';

import route from './routes.js';

const app = express();

app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.use(express.json());

app.use(morgan('combined'));

route(app);

app.listen(process.env.PORT || 8090, () => console.log(`Judger Server listening on port ${process.env.PORT || 8090} ${process.env.PORT ? '' : '(default)'}`));
