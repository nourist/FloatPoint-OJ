import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import connectDB from './config/db.js';
import route from './routes/index.js';

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
		origin: [process.env.CLIENT_URL],
		credentials: true,
	}),
);

app.use(express.json());
app.use(cookieParser());

app.use(morgan('combined'));

route(app);

app.listen(process.env.PORT || 8080, () =>
	console.log(`Server listening on port ${process.env.PORT || 8080} ${process.env.PORT ? '' : '(default)'}`),
);
