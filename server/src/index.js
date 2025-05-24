import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import connectDB from './config/db.js';
import route from './routes/index.js';

import { delayMiddleware } from './middlewares/delayMiddlewares.js';

const app = express();

connectDB();

app.use(express.static(path.join(path.resolve(), 'uploads')));

app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.use(
	cors({
		origin: [process.env.CLIENT_URL || 'http://localhost:5173', process.env.ADMIN_URL || 'http://localhost:5174'],
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

app.use(morgan('combined'));

if (process.env.NODE_ENV === 'development') {
	app.use(delayMiddleware);
}

route(app);

app.listen(process.env.PORT || 8080, () => console.log(`Server listening on port ${process.env.PORT || 8080} ${process.env.PORT ? '' : '(default)'}`));
